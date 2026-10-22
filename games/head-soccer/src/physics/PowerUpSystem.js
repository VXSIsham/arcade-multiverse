/**
 * Mystery Air Drop Crates & Match Mutator System for Head Soccer.
 * Spawns parachute supply crates every 18s that can be cracked open by players or the ball,
 * unleashing game-changing abilities: Speed Boots, Freeze Bomb, Rocket Glove, Ticking Dynamite,
 * Reflector Shield, and Giant Head!
 */
export class PowerUpSystem {
  /**
   * @param {import('../audio/SoundManager.js').SoundManager} soundManager
   * @param {import('./ParticleSystem.js').ParticleSystem} particleSystem
   */
  constructor(soundManager, particleSystem) {
    this.soundManager = soundManager;
    this.particleSystem = particleSystem;

    this.crates = [];
    this.spawnTimer = 8.0; // First air drop 8s into match!
    this.gloves = []; // Active rocket boxing gloves
    this.bombState = null; // Active dynamite on ball: { timer: 5.0, maxTime: 5.0 }

    // Active Buffs
    this.playerBuffs = { speed: 0, shield: 0, giant: 0 };
    this.rivalBuffs = { speed: 0, shield: 0, giant: 0 };
  }

  reset() {
    this.crates.length = 0;
    this.gloves.length = 0;
    this.bombState = null;
    this.spawnTimer = 8.0;
    this.playerBuffs = { speed: 0, shield: 0, giant: 0 };
    this.rivalBuffs = { speed: 0, shield: 0, giant: 0 };
  }

  update(dt, stageWidth, groundY, player, rivalBot, ball, collisionSystem) {
    // 1. Air Drop Spawn Timer
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0 && this.crates.length < 2) {
      this.spawnTimer = 16.0 + Math.random() * 8.0;
      this.spawnCrate(stageWidth);
    }

    // 2. Update Crates
    for (let i = this.crates.length - 1; i >= 0; i--) {
      const crate = this.crates[i];
      crate.time += dt;

      if (!crate.isGrounded) {
        crate.y += 95 * dt;
        crate.x += Math.sin(crate.time * 2.8) * 45 * dt;

        if (crate.y >= groundY - 22) {
          crate.y = groundY - 22;
          crate.isGrounded = true;
          this.soundManager.play('bounce');
          this.particleSystem.spawnSparks(crate.x, groundY, 10, '#ffd700');
        }
      } else {
        crate.groundLife -= dt;
        if (crate.groundLife <= 0) {
          this.crates.splice(i, 1);
          continue;
        }
      }

      // Check collision with Player
      const distP1 = Math.hypot(crate.x - player.x, crate.y - (player.y - 45));
      if (distP1 < 48) {
        this.collectCrate(crate, 'player', player, rivalBot, ball, collisionSystem);
        this.crates.splice(i, 1);
        continue;
      }

      // Check collision with Rival
      if (rivalBot && rivalBot.enabled) {
        const distRival = Math.hypot(crate.x - rivalBot.x, crate.y - (rivalBot.y - 45));
        if (distRival < 48) {
          this.collectCrate(crate, 'rival', player, rivalBot, ball, collisionSystem);
          this.crates.splice(i, 1);
          continue;
        }
      }

      // Check collision with Ball
      const distBall = Math.hypot(crate.x - ball.x, crate.y - ball.y);
      if (distBall < ball.radius + 24) {
        const beneficiary = ball.lastKickedBy === 'rival' ? 'rival' : 'player';
        this.collectCrate(crate, beneficiary, player, rivalBot, ball, collisionSystem);
        this.crates.splice(i, 1);
        continue;
      }
    }

    // 3. Update Active Boxing Gloves
    for (let i = this.gloves.length - 1; i >= 0; i--) {
      const g = this.gloves[i];
      g.x += g.vx * dt;
      g.life -= dt;

      // Particle smoke trail
      this.particleSystem.spawnTrail(g.x, g.y, '#ff3700');

      // Check hit opponent
      const target = g.owner === 'player' ? rivalBot : player;
      if (target && !target.isStunned) {
        const dist = Math.hypot(g.x - target.x, g.y - (target.y - 50));
        if (dist < 55) {
          this.soundManager.play('punch');
          this.soundManager.play('superExplode');
          target.takeDamage ? target.takeDamage(35, g.vx * 0.45, -380, true) : collisionSystem.applyDamage(player, 35, null, g.vx * 0.45, -380, true);
          collisionSystem.addFloatingText('🥊 ¡K.O. GUANTAZO! 🥊', target.x, target.y - 100, '#ff3700', 24);
          this.particleSystem.spawnSparks(target.x, target.y - 50, 30, '#ffd700');
          this.gloves.splice(i, 1);
          continue;
        }
      }

      if (g.life <= 0 || g.x < 40 || g.x > stageWidth - 40) {
        this.gloves.splice(i, 1);
      }
    }

    // 4. Update Ticking Bomb on Ball
    if (this.bombState) {
      this.bombState.timer -= dt;
      ball.isBomb = true;
      ball.bombTimer = this.bombState.timer;

      // Spark fuse
      this.particleSystem.spawnSparks(ball.x, ball.y - ball.radius - 8, 3, '#ffd700');

      if (this.bombState.timer <= 0) {
        // DETONATION!
        this.bombState = null;
        ball.isBomb = false;
        this.soundManager.play('superExplode');
        this.particleSystem.spawnSparks(ball.x, ball.y, 60, '#ff3700');
        this.particleSystem.spawnSparks(ball.x, ball.y, 40, '#ffd700');
        collisionSystem.addFloatingText('💥 ¡BOOOOM! 💣', ball.x, ball.y - 90, '#ff3700', 32);

        // Blast nearby characters
        const dP1 = Math.hypot(ball.x - player.x, ball.y - player.y);
        if (dP1 < 160) {
          collisionSystem.applyDamage(player, 35, null, (player.x - ball.x) * 4, -520, true);
        }
        if (rivalBot && rivalBot.enabled) {
          const dRival = Math.hypot(ball.x - rivalBot.x, ball.y - rivalBot.y);
          if (dRival < 160) {
            rivalBot.takeDamage(35, (rivalBot.x - ball.x) * 4, -520, true);
          }
        }
      }
    } else {
      ball.isBomb = false;
    }

    // 5. Update Active Buffs
    this.updateBuffs(this.playerBuffs, player, dt);
    if (rivalBot) this.updateBuffs(this.rivalBuffs, rivalBot, dt);
  }

  updateBuffs(buffs, entity, dt) {
    if (buffs.speed > 0) {
      buffs.speed -= dt;
      entity.speedMultiplier = 1.65;
      this.particleSystem.spawnTrail(entity.x, entity.y - 20, '#00f0ff');
    } else {
      entity.speedMultiplier = 1.0;
    }

    if (buffs.shield > 0) {
      buffs.shield -= dt;
      entity.hasShield = true;
    } else {
      entity.hasShield = false;
    }

    if (buffs.giant > 0) {
      buffs.giant -= dt;
      entity.giantHeadMultiplier = 1.65;
    } else {
      entity.giantHeadMultiplier = 1.0;
    }
  }

  spawnCrate(stageWidth) {
    const x = stageWidth * (0.24 + Math.random() * 0.52);
    const crateTypes = ['speed', 'freeze', 'glove', 'bomb', 'shield', 'giant'];
    const type = crateTypes[Math.floor(Math.random() * crateTypes.length)];

    this.crates.push({
      x,
      y: -50,
      type,
      time: 0,
      isGrounded: false,
      groundLife: 15.0
    });
  }

  collectCrate(crate, recipient, player, rivalBot, ball, collisionSystem) {
    this.soundManager.play('powerup');
    this.particleSystem.spawnSparks(crate.x, crate.y, 35, '#ffd700');
    this.particleSystem.spawnSparks(crate.x, crate.y, 25, '#00f0ff');

    const isP1 = recipient === 'player';
    const collector = isP1 ? player : rivalBot;
    const opponent = isP1 ? rivalBot : player;
    const buffs = isP1 ? this.playerBuffs : this.rivalBuffs;
    const prefix = isP1 ? '⭐ ' : '🤖 ';

    switch (crate.type) {
      case 'speed':
        buffs.speed = 6.5;
        collisionSystem.addFloatingText(`${prefix}¡BOTAS SÓNICAS! ⚡`, collector.x, collector.y - 90, '#00f0ff', 22);
        break;

      case 'freeze':
        if (opponent && opponent.freeze) {
          opponent.freeze(2.2);
          this.soundManager.play('freeze');
          collisionSystem.addFloatingText(`${prefix}¡BOMBA DE HIELO! 🧊`, opponent.x, opponent.y - 90, '#00ffff', 22);
        }
        break;

      case 'glove':
        const dir = isP1 ? (collector.direction || 1) : -1;
        this.soundManager.play('glove');
        this.gloves.push({
          x: collector.x + dir * 40,
          y: collector.y - 45,
          vx: dir * 1150,
          owner: recipient,
          life: 1.8
        });
        collisionSystem.addFloatingText(`${prefix}¡GUANTE COHETE! 🥊`, collector.x, collector.y - 90, '#ff3700', 22);
        break;

      case 'bomb':
        this.bombState = { timer: 5.0, maxTime: 5.0 };
        collisionSystem.addFloatingText('💣 ¡BALÓN DINAMITA! 💣', ball.x, ball.y - 90, '#ff0044', 24);
        break;

      case 'shield':
        buffs.shield = 7.0;
        collisionSystem.addFloatingText(`${prefix}¡ESCUDO DEFLECTOR! 🛡️`, collector.x, collector.y - 90, '#ffd700', 22);
        break;

      case 'giant':
        buffs.giant = 8.0;
        collisionSystem.addFloatingText(`${prefix}¡MEGA CABEZA! 🍄`, collector.x, collector.y - 90, '#ff00ff', 22);
        break;
    }
  }

  render(ctx) {
    // 1. Render Air Drop Crates
    for (const c of this.crates) {
      ctx.save();
      ctx.translate(c.x, c.y);

      // Parachute if in air
      if (!c.isGrounded) {
        ctx.save();
        ctx.fillStyle = '#ff3700';
        ctx.beginPath();
        ctx.arc(0, -32, 28, Math.PI, 0);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, -32, 16, Math.PI, 0);
        ctx.fill();

        // Parachute suspension lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-26, -32);
        ctx.lineTo(-14, -14);
        ctx.moveTo(26, -32);
        ctx.lineTo(14, -14);
        ctx.moveTo(0, -32);
        ctx.lineTo(0, -14);
        ctx.stroke();
        ctx.restore();
      }

      // Wooden Box with Gold Corner Reinforcements
      ctx.fillStyle = '#b45309'; // Rich wood brown
      ctx.fillRect(-18, -18, 36, 36);

      ctx.fillStyle = '#78350f';
      ctx.fillRect(-15, -15, 30, 30);

      // Golden band & Question Mark
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-4, -18, 8, 36);
      ctx.fillRect(-18, -4, 36, 8);

      ctx.font = '900 18px "Outfit", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 4;
      ctx.fillText('?', 0, 1);

      ctx.restore();
    }

    // 2. Render Rocket Boxing Gloves
    for (const g of this.gloves) {
      ctx.save();
      ctx.translate(g.x, g.y);
      const dir = Math.sign(g.vx);

      ctx.font = '36px "Segoe UI Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (dir < 0) {
        ctx.scale(-1, 1);
      }
      ctx.fillText('🥊', 0, 0);
      ctx.restore();
    }
  }
}
