/**
 * 2D Floppy Ragdoll Physics Simulator for Head Soccer Knockouts.
 * Uses Verlet integration and distance constraints to simulate comical floppy doll tumbles.
 */
export class RagdollSystem {
  /**
   * @param {import('../core/Skeleton.js').Skeleton} skeleton
   * @param {import('../audio/SoundManager.js').SoundManager} soundManager
   * @param {import('./ParticleSystem.js').ParticleSystem} particleSystem
   */
  constructor(skeleton, soundManager, particleSystem) {
    this.skeleton = skeleton;
    this.soundManager = soundManager;
    this.particleSystem = particleSystem;

    this.isActive = false;
    this.timer = 0;
    this.maxDuration = 1.4; // 1.4 seconds of comical tumbling and fast recovery

    // Ragdoll point masses
    this.points = [];
    this.constraints = [];

    this.gravity = 980;
    this.friction = 0.985;
    this.groundFriction = 0.88;

    this.onRecoverCallbacks = [];
  }

  onRecover(fn) {
    this.onRecoverCallbacks.push(fn);
  }

  start(player, impulseX = -420, impulseY = -540) {
    this.isActive = true;
    this.timer = this.maxDuration;
    player.isKnockedOut = true;

    // Snapshot current bone world positions to initialize ragdoll particles
    const s = this.skeleton;
    const px = player.x;
    const py = player.y;

    // Give head and torso extra rotational torque for comical somersaults
    this.points = [
      { id: 'hip', x: s.hip.worldX || px, y: s.hip.worldY || (py - 32), oldX: (s.hip.worldX || px) - impulseX * 0.016, oldY: (s.hip.worldY || (py - 32)) - impulseY * 0.016, radius: 14 },
      { id: 'torso', x: s.torso.worldX || px, y: s.torso.worldY || (py - 58), oldX: (s.torso.worldX || px) - impulseX * 0.019, oldY: (s.torso.worldY || (py - 58)) - (impulseY + 50) * 0.019, radius: 18 },
      { id: 'head', x: s.head.worldX || px, y: s.head.worldY || (py - 90), oldX: (s.head.worldX || px) - (impulseX * 1.25) * 0.024, oldY: (s.head.worldY || (py - 90)) - (impulseY + 120) * 0.024, radius: 36 },
      { id: 'foot_front', x: s.footFront.worldX || (px + 12), y: s.footFront.worldY || (py - 10), oldX: (s.footFront.worldX || (px + 12)) - impulseX * 0.014, oldY: (s.footFront.worldY || (py - 10)) - impulseY * 0.014, radius: 10 },
      { id: 'foot_back', x: s.footBack.worldX || (px - 12), y: s.footBack.worldY || (py - 10), oldX: (s.footBack.worldX || (px - 12)) - impulseX * 0.012, oldY: (s.footBack.worldY || (py - 10)) - impulseY * 0.012, radius: 10 },
      { id: 'arm_front', x: s.armFront?.worldX || (px + 16), y: s.armFront?.worldY || (py - 45), oldX: (s.armFront?.worldX || (px + 16)) - (impulseX * 1.1) * 0.020, oldY: (s.armFront?.worldY || (py - 45)) - impulseY * 0.020, radius: 8 },
      { id: 'arm_back', x: s.armBack?.worldX || (px - 16), y: s.armBack?.worldY || (py - 45), oldX: (s.armBack?.worldX || (px - 16)) - (impulseX * 0.9) * 0.016, oldY: (s.armBack?.worldY || (py - 45)) - impulseY * 0.016, radius: 8 }
    ];

    // Distance constraints (connecting floppy ragdoll bones)
    this.constraints = [
      this.createConstraint('hip', 'torso'),
      this.createConstraint('torso', 'head'),
      this.createConstraint('hip', 'foot_front'),
      this.createConstraint('hip', 'foot_back'),
      this.createConstraint('torso', 'arm_front'),
      this.createConstraint('torso', 'arm_back'),
      this.createConstraint('head', 'hip'), // prevents head from inverting through torso
      this.createConstraint('foot_front', 'foot_back') // prevents splits
    ];

    this.soundManager.play('knockout');
    this.particleSystem.spawnSparks(this.points[2].x, this.points[2].y, 30, '#ffd700');
    this.particleSystem.spawnSparks(this.points[2].x, this.points[2].y, 15, '#ff3700');
  }

  createConstraint(idA, idB) {
    const pA = this.getPoint(idA);
    const pB = this.getPoint(idB);
    const dist = Math.hypot(pA.x - pB.x, pA.y - pB.y);
    return { a: pA, b: pB, length: Math.max(14, dist) };
  }

  getPoint(id) {
    return this.points.find(p => p.id === id);
  }

  update(dt, groundY, stageWidth, player) {
    if (!this.isActive) return;

    this.timer -= dt;

    // 1. Verlet Integration on particles
    for (const p of this.points) {
      const vx = (p.x - p.oldX) * this.friction;
      const vy = (p.y - p.oldY) * this.friction + this.gravity * (dt * dt);

      p.oldX = p.x;
      p.oldY = p.y;
      p.x += vx;
      p.y += vy;

      // Ground collision & comical bouncy restitution
      if (p.y + p.radius > groundY) {
        const impactSpeed = Math.abs(vy);
        p.y = groundY - p.radius;
        p.oldY = p.y + vy * 0.48; // bounciness
        p.oldX = p.x - (p.x - p.oldX) * this.groundFriction;

        if (impactSpeed > 1.2 && Math.random() < 0.35) {
          this.soundManager.play('bounce');
          this.particleSystem.spawnSparks(p.x, groundY, 4, '#aaa');
        }
      }

      // Left & Right Pitch Boundaries
      if (p.x - p.radius < 30) {
        p.x = 30 + p.radius;
        p.oldX = p.x + vx * 0.55;
      }
      if (p.x + p.radius > stageWidth - 30) {
        p.x = stageWidth - 30 - p.radius;
        p.oldX = p.x + vx * 0.55;
      }
    }

    // 2. Solve Distance Constraints (relaxation loops)
    for (let iter = 0; iter < 4; iter++) {
      for (const c of this.constraints) {
        const dx = c.b.x - c.a.x;
        const dy = c.b.y - c.a.y;
        const currentDist = Math.hypot(dx, dy) || 1;
        const delta = (currentDist - c.length) / currentDist;

        c.a.x += dx * 0.5 * delta;
        c.a.y += dy * 0.5 * delta;
        c.b.x -= dx * 0.5 * delta;
        c.b.y -= dy * 0.5 * delta;
      }
    }

    // 3. Sync ragdoll positions back to Player and Skeleton
    const pHip = this.getPoint('hip');
    const pTorso = this.getPoint('torso');
    const pHead = this.getPoint('head');
    const pFootF = this.getPoint('foot_front');
    const pFootB = this.getPoint('foot_back');
    const pArmF = this.getPoint('arm_front');
    const pArmB = this.getPoint('arm_back');

    player.x = pHip.x;
    player.y = pHip.y + 28;

    // Apply world positions directly
    const s = this.skeleton;
    s.root.worldX = pHip.x;
    s.root.worldY = pHip.y + 28;

    s.hip.worldX = pHip.x;
    s.hip.worldY = pHip.y;
    s.hip.worldRotation = Math.atan2(pTorso.y - pHip.y, pTorso.x - pHip.x) * (180 / Math.PI);

    s.torso.worldX = pTorso.x;
    s.torso.worldY = pTorso.y;
    s.torso.worldRotation = Math.atan2(pHead.y - pTorso.y, pHead.x - pTorso.x) * (180 / Math.PI);

    s.head.worldX = pHead.x;
    s.head.worldY = pHead.y;
    // Comical head flopping oscillation
    s.head.worldRotation = s.torso.worldRotation + Math.sin(this.timer * 18) * 25;

    s.footFront.worldX = pFootF.x;
    s.footFront.worldY = pFootF.y;
    s.footFront.worldRotation = Math.atan2(pFootF.y - pHip.y, pFootF.x - pHip.x) * (180 / Math.PI) - 90;

    s.footBack.worldX = pFootB.x;
    s.footBack.worldY = pFootB.y;
    s.footBack.worldRotation = Math.atan2(pFootB.y - pHip.y, pFootB.x - pHip.x) * (180 / Math.PI) - 90;

    if (s.armFront) {
      s.armFront.worldX = pArmF.x;
      s.armFront.worldY = pArmF.y;
      s.armFront.worldRotation = Math.atan2(pArmF.y - pTorso.y, pArmF.x - pTorso.x) * (180 / Math.PI) - 90;
    }
    if (s.armBack) {
      s.armBack.worldX = pArmB.x;
      s.armBack.worldY = pArmB.y;
      s.armBack.worldRotation = Math.atan2(pArmB.y - pTorso.y, pArmB.x - pTorso.x) * (180 / Math.PI) - 90;
    }

    // Recover after duration ends
    if (this.timer <= 0) {
      this.recover(player, groundY);
    }
  }

  renderDizzyStars(ctx) {
    if (!this.isActive) return;
    const pHead = this.getPoint('head');
    if (!pHead) return;

    ctx.save();
    const starCount = 4;
    const time = (this.maxDuration - this.timer) * 7;
    const radiusX = 46;
    const radiusY = 18;

    for (let i = 0; i < starCount; i++) {
      const angle = time + (i * (Math.PI * 2 / starCount));
      const sx = pHead.x + Math.cos(angle) * radiusX;
      const sy = pHead.y - 45 + Math.sin(angle) * radiusY;

      ctx.font = '22px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 12;
      ctx.fillText(i % 2 === 0 ? '⭐' : '💫', sx, sy);
    }
    ctx.restore();
  }

  recover(player, groundY) {
    this.isActive = false;
    player.isKnockedOut = false;
    player.y = groundY;
    player.hp = player.maxHp || 100;
    this.skeleton.setPosition(player.x, player.y);
    this.skeleton.updateTransforms();
    this.soundManager.play('recover');
    this.particleSystem.spawnSparks(player.x, groundY - 30, 30, '#00ffcc');
    this.particleSystem.spawnSparks(player.x, groundY - 60, 20, '#ffd700');
    this.onRecoverCallbacks.forEach(fn => fn());
  }
}
