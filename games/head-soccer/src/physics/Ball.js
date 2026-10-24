/**
 * Soccer ball physics: gravity, bounce, spin, crossbar collision and
 * pluggable super-shot effects (see physics/SuperShots.js).
 */
export const GOAL = {
  inset: 6,
  width: 72,
  frontX: 78,
  height: 210,
  postRadius: 9
};

export class Ball {
  constructor(x = 420, y = 0, radius = 26) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.radius = radius;
    this.rotation = 0;
    this.spin = 0; // Aerodynamic Magnus spin: positive = topspin / dip, negative = backspin / lift
    this.isSuper = false;
    this.superType = null;
    this.superColors = null;
    this.heavy = false;
    this.lastKickedBy = 'player';
    this.isDragging = false;
    this.elasticity = 0.78;
    this.friction = 0.988;
    this.gravity = 850;
    this.gravityScale = 1;
    this.scale = 1;
    this.alpha = 1;
    this.squashX = 1.0;
    this.squashY = 1.0;
    this.airCombo = 0;
    this.isOnFire = false;
    this.fireLevel = 0; // 1 = combo 3 volley rush, 2 = combo 4+ en llamas!
    this.onCrossbarHit = null;
    this.onNetBulge = null;
    this.trail = [];
    this.effect = null;
    this.effectTime = 0;
  }

  setEffect(effect) {
    this.effect = effect;
    this.effectTime = 0;
  }

  clearEffect() {
    if (this.effect?.end) this.effect.end(this);
    this.effect = null;
    this.effectTime = 0;
    this.gravityScale = 1;
    this.scale = 1;
    this.squashX = 1.0;
    this.squashY = 1.0;
    this.alpha = 1;
  }

  /** Drop the ball at a kickoff spot. */
  reset(x, y) {
    this.clearEffect();
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = -160;
    this.spin = 0;
    this.isSuper = false;
    this.heavy = false;
    this.superType = null;
    this.lastKickedBy = null;
    this.squashX = 1.0;
    this.squashY = 1.0;
    this.airCombo = 0;
    this.isOnFire = false;
    this.fireLevel = 0;
    this.trail.length = 0;
  }

  update(dt, groundY, stageWidth) {
    if (this.isDragging) return;

    // Smooth elastic recovery of ball squash & stretch
    this.squashX += (1.0 - this.squashX) * Math.min(1.0, dt * 14);
    this.squashY += (1.0 - this.squashY) * Math.min(1.0, dt * 14);

    // Super-shot effect tick
    if (this.effect) {
      this.effectTime += dt;
      this.effect.update(this, this.effectTime);
      if (this.effectTime >= this.effect.duration) this.clearEffect();
    }

    // Magnus Aerodynamic Force: F_magnus = S * (omega x v)
    // In 2D side-view, perpendicular vector to velocity (vx, vy) creates curling / dipping banana trajectory
    let speed = Math.hypot(this.vx, this.vy);
    if (speed > 50 && Math.abs(this.spin) > 0.04) {
      const perpX = -this.vy / speed;
      const perpY = this.vx / speed;
      const magnusStrength = this.spin * 18.0; // curl acceleration px/s^2
      this.vx += perpX * magnusStrength * dt;
      this.vy += perpY * magnusStrength * dt;
      // Air resistance decays spin over flight
      this.spin *= Math.pow(0.965, dt * 60);
    }

    this.vy += this.gravity * this.gravityScale * dt;
    this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Physical rolling spin combined with aerodynamic ball rotation
    this.rotation += ((this.vx * dt) / this.radius) + this.spin * dt * 4.4;

    // Ground collision & bounce with elastic squash
    if (this.y + this.radius > groundY) {
      this.y = groundY - this.radius;
      if (Math.abs(this.vy) > 80) {
        this.squashY = Math.max(0.68, 1.0 - Math.min(0.32, Math.abs(this.vy) / 850));
        this.squashX = 1.0 + (1.0 - this.squashY) * 0.95;
      }
      this.vy = -this.vy * this.elasticity;
      if (Math.abs(this.vy) < 40) this.vy = 0;
      // Rolling friction and spin damping on turf
      this.vx *= 0.97;
      this.spin *= 0.52;
      // Juggling aerial combo drops on ground contact
      this.airCombo = 0;
      this.isOnFire = false;
      this.fireLevel = 0;
    }

    // Ceiling
    if (this.y - this.radius < 0) {
      this.y = this.radius;
      this.vy = Math.abs(this.vy) * this.elasticity;
    }

    // Goals: Crossbar, Upright Posts, and Dynamic Net Physics
    const barY = groundY - GOAL.height;
    const frontLeftX = 78;
    const frontRightX = stageWidth - 78;

    // 1. Crossbar Horizontal Collision (both goals - upper ceiling only)
    this.collideCrossbar(GOAL.inset, frontLeftX, barY, false);
    this.collideCrossbar(frontRightX, stageWidth - GOAL.inset, barY, true);

    // 2. Inside the Net Physics (Catching tension, progressive drag, and net bulge)
    this.handleNetPhysics(groundY, stageWidth);

    // Super shot dynamic aerodynamic decay (balances overpowered cross-field shots)
    speed = Math.hypot(this.vx, this.vy);
    if (this.isSuper) {
      this.superLife = (this.superLife || 0) + dt;
      if (this.superLife > 0.8) {
        this.vx *= 0.985;
        this.vy *= 0.985;
      }
      if (this.superLife > 2.2 || (!this.effect && speed < 300)) {
        this.isSuper = false;
        this.superLife = 0;
        this.heavy = false;
        this.shotType = null;
      }
    } else {
      this.superLife = 0;
    }

    // Dynamic motion comet trail for fast balls or airborne combos on fire
    if (speed > 240 || this.isOnFire) {
      let trailColor = '#00f0ff';
      if (this.isOnFire) {
        trailColor = this.fireLevel >= 2 ? '#ff1100' : '#ff7700';
      } else if (this.isSuper) {
        trailColor = (this.superColors && this.superColors[0]) || '#ff3700';
      } else if (this.shotType === 'bicycle') {
        trailColor = '#ffd700';
      } else if (this.shotType === 'rocket') {
        trailColor = '#00f0ff';
      } else if (this.shotType === 'palomita') {
        trailColor = '#00ffcc';
      } else if (this.shotType === 'scorpion') {
        trailColor = '#ff00aa';
      } else if (this.shotType === 'smash') {
        trailColor = '#ffcc00';
      }

      this.trail.push({
        x: this.x,
        y: this.y,
        vx: this.vx,
        vy: this.vy,
        speed,
        life: 1.0,
        color: trailColor,
        isSuper: this.isSuper,
        isOnFire: this.isOnFire,
        shotType: this.shotType
      });
    }

    for (let i = this.trail.length - 1; i >= 0; i--) {
      this.trail[i].life -= dt * (speed > 600 ? 4.2 : 3.4);
      if (this.trail[i].life <= 0) this.trail.splice(i, 1);
    }
  }

  collideCrossbar(x1, x2, barY, isRight = false) {
    const r = this.radius + (GOAL.postRadius || 6);
    const cx = Math.max(x1, Math.min(this.x, x2));
    const dx = this.x - cx;
    const dy = this.y - barY;
    const dist = Math.hypot(dx, dy);

    if (dist < r && dist > 0) {
      const nx = dx / dist;
      const ny = dy / dist;
      this.x = cx + nx * r;
      this.y = barY + ny * r;
      const dot = this.vx * nx + this.vy * ny;
      if (dot < 0) {
        const speed = Math.hypot(this.vx, this.vy);
        this.vx -= 2 * dot * nx * 0.88;
        this.vy -= 2 * dot * ny * 0.88;
        this.squashX = 0.72;
        this.squashY = 1.28;
        if (speed > 90 && this.onCrossbarHit) {
          const cornerPostX = isRight ? x1 : x2;
          const isCorner = Math.abs(cx - cornerPostX) < 14;
          const hitType = isCorner ? 'corner' : 'crossbar';
          this.onCrossbarHit(cx, barY, speed, hitType, isRight);
        }
      }
    }
  }



  handleNetPhysics(groundY, stageWidth) {
    const frontLeftX = 78;
    const frontRightX = stageWidth - 78;
    const goalH = GOAL.height || 210;

    const isInsideLeftNet = this.x < frontLeftX && this.y > groundY - goalH;
    const isInsideRightNet = this.x > frontRightX && this.y > groundY - goalH;

    if (isInsideLeftNet) {
      // Elastic net progressive drag
      this.vx *= 0.91;
      this.vy *= 0.93;
      const speed = Math.hypot(this.vx, this.vy);
      if (speed > 35 && this.onNetBulge) {
        this.onNetBulge(false, this.y, speed);
      }
      // Back wall soft cushion
      if (this.x - this.radius < GOAL.inset) {
        this.x = GOAL.inset + this.radius;
        this.vx = Math.abs(this.vx) * 0.22;
      }
    } else if (isInsideRightNet) {
      this.vx *= 0.91;
      this.vy *= 0.93;
      const speed = Math.hypot(this.vx, this.vy);
      if (speed > 35 && this.onNetBulge) {
        this.onNetBulge(true, this.y, speed);
      }
      if (this.x + this.radius > stageWidth - GOAL.inset) {
        this.x = stageWidth - GOAL.inset - this.radius;
        this.vx = -Math.abs(this.vx) * 0.22;
      }
    } else {
      // Normal pitch boundaries (above crossbars)
      if (this.x - this.radius < GOAL.inset) {
        this.x = GOAL.inset + this.radius;
        this.vx = Math.abs(this.vx) * this.elasticity;
      }
      if (this.x + this.radius > stageWidth - GOAL.inset) {
        this.x = stageWidth - GOAL.inset - this.radius;
        this.vx = -Math.abs(this.vx) * this.elasticity;
      }
    }
  }

  kick(powerX, powerY, isSuper = false, kicker = 'player', shotType = null, spin = 0) {
    if (!isSuper && this.effect) this.clearEffect();
    this.vx = powerX;
    this.vy = powerY;
    this.isSuper = isSuper;
    this.superLife = 0;
    this.shotType = shotType;
    this.spin = spin;
    if (!isSuper) {
      this.heavy = false;
      this.superType = null;
    }
    this.lastKickedBy = kicker;

    // Check if airborne hit for juggling combo (above pitch grass)
    if (this.y < 570) {
      this.airCombo = (this.airCombo || 0) + 1;
      if (this.airCombo >= 3) {
        this.isOnFire = true;
        this.fireLevel = this.airCombo >= 4 ? 2 : 1;
        if (this.airCombo >= 4) {
          this.vx *= 1.25;
          this.vy *= 1.20;
        }
      }
      if (this.onAirComboHit) {
        this.onAirComboHit(this.airCombo, this.x, this.y, Math.sign(powerX) || 1);
      }
    }

    const speed = Math.hypot(powerX, powerY);
    if (speed > 300) {
      this.squashX = Math.min(1.48, 1.0 + (speed / 1100) * 0.44);
      this.squashY = Math.max(0.58, 1.0 - (speed / 1100) * 0.38);
    }
  }
}
