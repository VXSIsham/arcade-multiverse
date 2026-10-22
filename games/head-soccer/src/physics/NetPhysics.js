/**
 * Real-Time 2D Verlet Integration Cloth / Spring-Mass Soccer Net Simulation.
 * Provides authentic physical net ballooning, ball wrapping, tension propagation,
 * and natural cloth ripples when shots enter either goal.
 */

export class VerletParticle {
  constructor(x, y, pinned = false) {
    this.x = x;
    this.y = y;
    this.oldX = x;
    this.oldY = y;
    this.pinned = pinned;
  }
}

export class VerletConstraint {
  constructor(p1, p2, stiffness = 0.95) {
    this.p1 = p1;
    this.p2 = p2;
    this.restLength = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    this.stiffness = stiffness;
  }

  resolve() {
    const dx = this.p2.x - this.p1.x;
    const dy = this.p2.y - this.p1.y;
    const dist = Math.hypot(dx, dy);
    if (dist === 0) return;

    const diff = (this.restLength - dist) / dist * 0.5 * this.stiffness;
    const offsetX = dx * diff;
    const offsetY = dy * diff;

    if (!this.p1.pinned) {
      this.p1.x -= offsetX;
      this.p1.y -= offsetY;
    }
    if (!this.p2.pinned) {
      this.p2.x += offsetX;
      this.p2.y += offsetY;
    }
  }
}

export class GoalNetSimulation {
  constructor(isRight, frontX, backX, topY, groundY, cols = 7, rows = 11) {
    this.isRight = isRight;
    this.frontX = frontX;
    this.backX = backX;
    this.topY = topY;
    this.groundY = groundY;
    this.cols = cols;
    this.rows = rows;

    this.particles = [];
    this.constraints = [];
    this.grid = []; // grid[r][c]

    this.damping = 0.965; // cloth air damping
    this.gravity = 140;   // subtle net sag
    this.lastDisplacement = 0;

    this.buildGrid();
  }

  buildGrid() {
    this.particles = [];
    this.constraints = [];
    this.grid = [];

    const depth = Math.abs(this.frontX - this.backX);
    const height = this.groundY - this.topY;
    const startX = Math.min(this.frontX, this.backX);

    for (let r = 0; r <= this.rows; r++) {
      this.grid[r] = [];
      const normY = r / this.rows;
      const y = this.topY + normY * height;

      for (let c = 0; c <= this.cols; c++) {
        const normX = c / this.cols;
        const x = this.isRight
          ? this.frontX + normX * depth
          : this.frontX - normX * depth;

        // Pin conditions:
        // Top crossbar (r === 0)
        // Front upright post (c === 0)
        // Back ground anchor (r === this.rows && c === this.cols)
        const isPinned = (r === 0) || (c === 0 && (r === 0 || r === this.rows)) || (r === this.rows);

        const p = new VerletParticle(x, y, isPinned);
        this.particles.push(p);
        this.grid[r][c] = p;
      }
    }

    // Structural Constraints (Horizontal & Vertical)
    for (let r = 0; r <= this.rows; r++) {
      for (let c = 0; c <= this.cols; c++) {
        const current = this.grid[r][c];

        // Horizontal neighbor
        if (c < this.cols) {
          const right = this.grid[r][c + 1];
          this.constraints.push(new VerletConstraint(current, right, 0.92));
        }

        // Vertical neighbor
        if (r < this.rows) {
          const down = this.grid[r + 1][c];
          this.constraints.push(new VerletConstraint(current, down, 0.94));
        }

        // Diagonal Shear Constraints (prevents collapsing like a loose string)
        if (r < this.rows && c < this.cols) {
          const diag1 = this.grid[r + 1][c + 1];
          this.constraints.push(new VerletConstraint(current, diag1, 0.65));

          const diag2 = this.grid[r + 1][c];
          const diag3 = this.grid[r][c + 1];
          this.constraints.push(new VerletConstraint(diag2, diag3, 0.65));
        }
      }
    }
  }

  update(dt, ball, soundManager = null) {
    const fixedDt = Math.min(dt, 0.033);
    const timeSq = fixedDt * fixedDt;
    let netDisplacementThisFrame = 0;

    // 1. Verlet Integration Step
    for (const p of this.particles) {
      if (p.pinned) continue;

      const vx = (p.x - p.oldX) * this.damping;
      const vy = (p.y - p.oldY) * this.damping;

      p.oldX = p.x;
      p.oldY = p.y;

      p.x += vx;
      p.y += vy + this.gravity * timeSq;
    }

    // 2. Ball-to-Net Elastic Collision
    if (ball) {
      const ballRadius = ball.radius || 21;
      const collisionRadius = ballRadius + 4;
      const radiusSq = collisionRadius * collisionRadius;

      for (const p of this.particles) {
        const dx = p.x - ball.x;
        const dy = p.y - ball.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < radiusSq && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const nx = dx / dist;
          const ny = dy / dist;
          const push = collisionRadius - dist;

          if (!p.pinned) {
            p.x += nx * push * 0.85;
            p.y += ny * push * 0.85;
            netDisplacementThisFrame += push;
          }

          // Transfer net friction and drag to ball
          ball.vx *= 0.95;
          ball.vy *= 0.96;
        }
      }
    }

    // 3. Satisfy Distance Constraints (Relaxation iterations)
    const iterations = 4;
    for (let iter = 0; iter < iterations; iter++) {
      for (const c of this.constraints) {
        c.resolve();
      }
    }

    // Play net rustle sound on significant physical interaction
    if (netDisplacementThisFrame > 15 && this.lastDisplacement <= 15 && soundManager) {
      soundManager.play('netRustle');
    }
    this.lastDisplacement = netDisplacementThisFrame;
  }

  render(ctx, color = 'rgba(255, 255, 255, 0.55)', style = 'hexagon') {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;

    if (style === 'diamond' || style === 'classic') {
      // Draw all structural constraints as net cords
      ctx.beginPath();
      for (let r = 0; r <= this.rows; r++) {
        for (let c = 0; c <= this.cols; c++) {
          const p = this.grid[r][c];
          if (c < this.cols) {
            const right = this.grid[r][c + 1];
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(right.x, right.y);
          }
          if (r < this.rows) {
            const down = this.grid[r + 1][c];
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(down.x, down.y);
          }
        }
      }
      ctx.stroke();
    } else {
      // Hexagonal Honeycomb mesh derived from Verlet grid points
      ctx.beginPath();
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          const p0 = this.grid[r][c];
          const p1 = this.grid[r][c + 1];
          const p2 = this.grid[r + 1][c + 1];
          const p3 = this.grid[r + 1][c];

          const midTopX = (p0.x + p1.x) * 0.5;
          const midTopY = (p0.y + p1.y) * 0.5;
          const midBotX = (p3.x + p2.x) * 0.5;
          const midBotY = (p3.y + p2.y) * 0.5;

          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(midTopX, midTopY);
          ctx.lineTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(midBotX, midBotY);
          ctx.lineTo(p3.x, p3.y);
        }
      }
      ctx.stroke();
    }

    ctx.restore();
  }
}
