/**
 * Manages particle effects (sparks, flame auras, goal celebrations).
 */
export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  spawnSparks(x, y, count = 12, color = '#ffcc00') {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 2;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        radius: Math.random() * 4 + 2,
        life: 1.0,
        decay: Math.random() * 0.04 + 0.02,
        color: color
      });
    }
  }

  spawnFlameAura(x, y, colors = ['#ff3700', '#ffd000']) {
    if (this.particles.length > 160) return;
    for (let i = 0; i < 3; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 55,
        y: y + (Math.random() - 0.5) * 75,
        vx: (Math.random() - 0.5) * 2.5,
        vy: -Math.random() * 5 - 2,
        radius: Math.random() * 6 + 3,
        life: 1.0,
        decay: Math.random() * 0.06 + 0.04,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  /** Small lingering puff left behind a super-shot ball. */
  spawnTrail(x, y, color) {
    if (this.particles.length > 260) return;
    this.particles.push({
      x: x + (Math.random() - 0.5) * 14,
      y: y + (Math.random() - 0.5) * 14,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      radius: Math.random() * 7 + 5,
      life: 1.0,
      decay: 0.06,
      color
    });
  }

  /** Grass/dust kick-up when landing or sprint-turning. */
  spawnDust(x, y, count = 6) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 30,
        y,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 2 - 0.5,
        radius: Math.random() * 4 + 2,
        life: 0.8,
        decay: 0.04,
        color: Math.random() > 0.5 ? 'rgba(220, 255, 200, 0.8)' : 'rgba(120, 200, 90, 0.8)'
      });
    }
  }

  /** Air shockwave puff ring for double jump and sonic dash */
  spawnAirRing(x, y, color = '#00f0ff') {
    this.particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      radius: 8,
      maxRadius: 36,
      isRing: true,
      life: 1.0,
      decay: 0.08,
      color
    });
  }

  /** Festive confetti blast for goals */
  spawnConfetti(x, y, count = 40) {
    const palette = ['#ff0055', '#00ffcc', '#ffd700', '#ff8800', '#7928ca', '#ffffff', '#0099ff'];
    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI) + Math.PI; // upward fountain
      const speed = Math.random() * 9 + 4;
      this.particles.push({
        x: x + (Math.random() - 0.5) * 60,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: 0.18,
        width: Math.random() * 8 + 4,
        height: Math.random() * 5 + 3,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.28,
        isConfetti: true,
        life: 1.0,
        decay: Math.random() * 0.015 + 0.012,
        color: palette[Math.floor(Math.random() * palette.length)]
      });
    }
  }

  /** Metallic spark flash and shockwave when hitting the crossbar */
  spawnPostHit(x, y) {
    this.spawnAirRing(x, y, '#ffd700');
    this.spawnSparks(x, y, 16, '#ffffff');
    this.spawnSparks(x, y, 14, '#ffd700');
  }

  /** Directional Kick Impact Burst with shockwave ring and high-speed sparks */
  spawnKickImpact(x, y, dir = 1, color = '#00f0ff', count = 24) {
    // 1. Expanding shockwave ring
    this.particles.push({
      x,
      y,
      vx: dir * 4,
      vy: 0,
      radius: 10,
      maxRadius: 52,
      isRing: true,
      life: 1.0,
      decay: 0.08,
      color: '#ffffff'
    });

    // 2. High-speed directional sparks
    for (let i = 0; i < count; i++) {
      const spreadAngle = (Math.random() - 0.5) * 1.1; // Cone in direction
      const baseAngle = dir > 0 ? 0 : Math.PI;
      const angle = baseAngle + spreadAngle;
      const speed = Math.random() * 12 + 6;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        radius: Math.random() * 5 + 2,
        life: 1.0,
        decay: Math.random() * 0.04 + 0.025,
        color,
        additive: true
      });
    }
  }

  /** Supersonic boom rings traveling forward behind explosive strikes */
  spawnSonicBoom(x, y, dir = 1, color = '#00f0ff') {
    for (let i = 0; i < 3; i++) {
      this.particles.push({
        x: x + dir * i * 22,
        y,
        vx: dir * (10 + i * 3),
        vy: 0,
        radius: 12 + i * 8,
        maxRadius: 48 + i * 16,
        isRing: true,
        life: 1.0,
        decay: 0.07,
        color
      });
    }
  }

  /** Grass & Turf spray kicked up from the pitch during powerful volleys */
  spawnTurfSpray(x, y, dir = 1, count = 12) {
    for (let i = 0; i < count; i++) {
      const angle = dir > 0 ? -Math.PI * 0.75 + (Math.random() - 0.5) * 0.6 : -Math.PI * 0.25 + (Math.random() - 0.5) * 0.6;
      const speed = Math.random() * 8 + 3;
      this.particles.push({
        x: x + (Math.random() - 0.5) * 16,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: 0.32,
        width: Math.random() * 6 + 3,
        height: Math.random() * 3 + 2,
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.4,
        isConfetti: true,
        life: 1.0,
        decay: 0.035,
        color: Math.random() > 0.4 ? '#4caf50' : '#2e7d32'
      });
    }
  }

  /** High-energy flame burst for super dragon kicks and fireballs */
  spawnFlameBurst(x, y, count = 28, colors = ['#ff3700', '#ffd700', '#ff0055']) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 11 + 3;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        radius: Math.random() * 8 + 4,
        life: 1.0,
        decay: Math.random() * 0.05 + 0.03,
        color: colors[Math.floor(Math.random() * colors.length)],
        additive: true
      });
    }
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.isConfetti || p.gravity) {
        p.vy += p.gravity || 0.18;
        p.rotation += p.rotSpeed || 0.15;
      }
      p.life -= p.decay;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  render(ctx) {
    ctx.save();
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.life);
      if (p.additive) {
        ctx.globalCompositeOperation = 'lighter';
      } else {
        ctx.globalCompositeOperation = 'source-over';
      }

      if (p.isConfetti) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.width * 0.5, -p.height * 0.5, p.width, p.height);
        ctx.restore();
      } else if (p.isRing) {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 3.5 * p.life;
        ctx.beginPath();
        const r = p.radius + (p.maxRadius - p.radius) * (1.0 - p.life);
        ctx.ellipse(p.x, p.y, r, r * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }
    }
    ctx.restore();
  }
}
