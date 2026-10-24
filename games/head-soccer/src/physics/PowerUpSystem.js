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
    this.bananas = []; // Slippery banana peel traps on turf
    this.bombState = null; // Active dynamite on ball: { timer: 5.0, maxTime: 5.0 }

    // Active Buffs
    this.playerBuffs = { speed: 0, shield: 0, giant: 0, shrink: 0 };
    this.rivalBuffs = { speed: 0, shield: 0, giant: 0, shrink: 0 };
  }

  reset() {
    this.crates.length = 0;
    this.gloves.length = 0;
    this.bananas.length = 0;
    this.bombState = null;
    this.spawnTimer = 8.0;
    this.playerBuffs = { speed: 0, shield: 0, giant: 0, shrink: 0 };
    this.rivalBuffs = { speed: 0, shield: 0, giant: 0, shrink: 0 };
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

    // 4b. Update Slippery Banana Peels on Turf
    for (let i = this.bananas.length - 1; i >= 0; i--) {
      const b = this.bananas[i];
      b.life -= dt;
      if (b.life <= 0) {
        this.bananas.splice(i, 1);
        continue;
      }

      // Check collision with Player
      const dP1 = Math.hypot(b.x - player.x, b.y - player.y);
      if (dP1 < 32 && !player.isStunned && !player.isKnockedOut) {
        this.soundManager.play('slip');
        this.particleSystem.spawnSparks(b.x, groundY, 18, '#ffd700');
        player.isSpinning = true;
        player.spinTime = 0;
        player.spinDuration = 0.55;
        player.flipAngle = 0;
        player.vy = -320;
        player.x -= player.direction * 35;
        collisionSystem.applyDamage(player, 10, null, -360 * player.direction, -260, false);
        collisionSystem.addFloatingText('🍌 ¡RESBALÓN CÓMICO! 🍌', player.x, player.y - 85, '#ffd700', 22);
        this.bananas.splice(i, 1);
        continue;
      }

      // Check collision with Rival
      if (rivalBot && rivalBot.enabled && !rivalBot.isStunned) {
        const dRival = Math.hypot(b.x - rivalBot.x, b.y - rivalBot.y);
        if (dRival < 32) {
          this.soundManager.play('slip');
          this.particleSystem.spawnSparks(b.x, groundY, 18, '#ffd700');
          rivalBot.isSpinning = true;
          rivalBot.spinTime = 0;
          rivalBot.spinDuration = 0.55;
          rivalBot.flipAngle = 0;
          rivalBot.vy = -320;
          rivalBot.x -= (rivalBot.direction || -1) * 35;
          if (rivalBot.takeDamage) rivalBot.takeDamage(10, 360, -260, false);
          collisionSystem.addFloatingText('🍌 ¡RESBALÓN CÓMICO! 🍌', rivalBot.x, rivalBot.y - 85, '#ffd700', 22);
          this.bananas.splice(i, 1);
          continue;
        }
      }
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

    if (buffs.shrink > 0) {
      buffs.shrink -= dt;
      entity.shrinkMultiplier = 0.45;
      if (Math.random() < 0.22) {
        this.particleSystem.spawnSparks(entity.x, entity.y - 20, 2, '#ff00cc');
      }
    } else {
      entity.shrinkMultiplier = 1.0;
    }
  }

  spawnCrate(stageWidth) {
    const x = stageWidth * (0.24 + Math.random() * 0.52);
    const crateTypes = ['speed', 'freeze', 'glove', 'bomb', 'shield', 'giant', 'banana', 'shrink'];
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

      case 'banana':
        const targetOpp = isP1 ? rivalBot : player;
        const oppX = targetOpp ? targetOpp.x : 500;
        this.bananas.push({
          x: Math.max(90, Math.min(collector.x + (isP1 ? 1 : -1) * 75, 1200)),
          y: collector.y - 6,
          life: 20.0,
          angle: (Math.random() - 0.5) * 0.4
        });
        this.bananas.push({
          x: Math.max(90, Math.min(oppX + (Math.random() - 0.5) * 60, 1200)),
          y: collector.y - 6,
          life: 20.0,
          angle: (Math.random() - 0.5) * 0.4
        });
        collisionSystem.addFloatingText(`${prefix}¡TRAMPAS DE PLÁTANO! 🍌`, collector.x, collector.y - 90, '#ffd700', 22);
        break;

      case 'shrink':
        const oppBuffs = isP1 ? this.rivalBuffs : this.playerBuffs;
        oppBuffs.shrink = 8.5;
        this.soundManager.play('shrink');
        if (opponent) {
          opponent.shrinkMultiplier = 0.45;
          this.particleSystem.spawnSparks(opponent.x, opponent.y - 40, 35, '#ff00cc');
        }
        collisionSystem.addFloatingText(`${prefix}¡RAYO ENCOJEDOR! 🔬🐭`, opponent ? opponent.x : collector.x, (opponent ? opponent.y : collector.y) - 95, '#ff00cc', 24);
        break;
    }
  }

  render(ctx) {
    const time = performance.now() * 0.005;

    // 1. Render Air Drop Crates
    for (const c of this.crates) {
      ctx.save();
      ctx.translate(c.x, c.y);

      // Parachute if in air
      if (!c.isGrounded) {
        ctx.save();
        const sway = Math.sin(time + c.x * 0.01) * 0.12;
        ctx.rotate(sway);

        // Parachute suspension rigging cords
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(-32, -42);
        ctx.lineTo(-14, -16);
        ctx.moveTo(32, -42);
        ctx.lineTo(14, -16);
        ctx.moveTo(-16, -42);
        ctx.lineTo(-6, -16);
        ctx.moveTo(16, -42);
        ctx.lineTo(6, -16);
        ctx.stroke();

        // Parachute Canopy Base Dome
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 4;

        // Alternating Striped Silk Canopy
        const canopyW = 34;
        const canopyH = 26;
        const canopyY = -42;

        // Outer Orange Gores
        ctx.fillStyle = '#ff5500';
        ctx.beginPath();
        ctx.moveTo(-canopyW, canopyY);
        ctx.quadraticCurveTo(-canopyW * 0.85, canopyY - canopyH, 0, canopyY - canopyH);
        ctx.quadraticCurveTo(canopyW * 0.85, canopyY - canopyH, canopyW, canopyY);
        ctx.quadraticCurveTo(0, canopyY + 6, -canopyW, canopyY);
        ctx.fill();

        // Center White Panel Gore
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(-canopyW * 0.42, canopyY);
        ctx.quadraticCurveTo(-canopyW * 0.25, canopyY - canopyH, 0, canopyY - canopyH);
        ctx.quadraticCurveTo(canopyW * 0.25, canopyY - canopyH, canopyW * 0.42, canopyY);
        ctx.quadraticCurveTo(0, canopyY + 4, -canopyW * 0.42, canopyY);
        ctx.fill();

        // Inner Shadow / Depth Arc
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-canopyW, canopyY);
        ctx.quadraticCurveTo(0, canopyY + 6, canopyW, canopyY);
        ctx.stroke();

        ctx.restore();
      }

      // Fortified High-Tech Supply Crate
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 3;

      // Dark reinforced metal body
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(-18, -18, 36, 36, 5);
      ctx.fill();

      // Industrial hazard gold inner face
      const crateGrad = ctx.createLinearGradient(-15, -15, 15, 15);
      crateGrad.addColorStop(0, '#f59e0b');
      crateGrad.addColorStop(1, '#b45309');
      ctx.fillStyle = crateGrad;
      ctx.beginPath();
      ctx.roundRect(-14, -14, 28, 28, 3);
      ctx.fill();

      // Corner steel bracket reinforcements
      ctx.fillStyle = '#0f172a';
      const bSize = 7;
      ctx.fillRect(-18, -18, bSize, bSize);
      ctx.fillRect(18 - bSize, -18, bSize, bSize);
      ctx.fillRect(-18, 18 - bSize, bSize, bSize);
      ctx.fillRect(18 - bSize, 18 - bSize, bSize, bSize);

      // Steel Rivets
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-16, -16, 3, 3);
      ctx.fillRect(13, -16, 3, 3);
      ctx.fillRect(-16, 13, 3, 3);
      ctx.fillRect(13, 13, 3, 3);

      // Pulsing Holographic Core & Question Mark
      const pulse = 0.85 + Math.sin(time * 3) * 0.15;
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 14 * pulse;
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 20px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('?', 0, 1);

      ctx.restore();
      ctx.restore();
    }

    // 2. Render Rocket Boxing Gloves (High-Fidelity Arcade Sprite)
    for (const g of this.gloves) {
      ctx.save();
      ctx.translate(g.x, g.y);
      const dir = Math.sign(g.vx);
      if (dir < 0) {
        ctx.scale(-1, 1);
      }

      // Jet Engine Exhaust Flame
      const flameFlicker = 1.0 + Math.sin(time * 12) * 0.25;
      const flameGrad = ctx.createLinearGradient(-14, 0, -42 * flameFlicker, 0);
      flameGrad.addColorStop(0, '#ffffff');
      flameGrad.addColorStop(0.2, '#00f0ff');
      flameGrad.addColorStop(0.6, '#ff5500');
      flameGrad.addColorStop(1, 'rgba(255, 0, 0, 0)');

      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 16;
      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.moveTo(-14, -8);
      ctx.lineTo(-42 * flameFlicker, 0);
      ctx.lineTo(-14, 8);
      ctx.closePath();
      ctx.fill();

      // Chrome Rocket Thruster Nozzle
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = '#475569';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-16, -11, 10, 22, 2);
      ctx.fill();
      ctx.stroke();

      // Boxing Glove Main Leather Fist
      ctx.fillStyle = '#dc2626';
      ctx.strokeStyle = '#7f1d1d';
      ctx.lineWidth = 2.2;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.moveTo(-6, -16);
      ctx.quadraticCurveTo(18, -18, 24, -4);
      ctx.quadraticCurveTo(26, 12, 14, 18);
      ctx.quadraticCurveTo(0, 18, -6, 12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Glove Thumb
      ctx.beginPath();
      ctx.moveTo(8, -10);
      ctx.quadraticCurveTo(16, -6, 12, 4);
      ctx.stroke();

      // Golden Wrist Binding Cuff
      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1.2;
      ctx.fillRect(-9, -13, 5, 26);
      ctx.strokeRect(-9, -13, 5, 26);

      ctx.restore();
    }

    // 3. Render Slippery Banana Peels on Turf
    for (const b of this.bananas) {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.angle || 0);

      // Soft ground shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
      ctx.beginPath();
      ctx.ellipse(0, 4, 16, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Banana Peel Yellow Silhouette with golden sheen
      ctx.shadowColor = 'rgba(255, 215, 0, 0.55)';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1.4;

      // Center Stem
      ctx.beginPath();
      ctx.arc(0, -2, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Brown Stem Tip
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-2, -6, 4, 4);

      // 3 Splayed curved peels
      ctx.fillStyle = '#fde047';
      // Left peel
      ctx.beginPath();
      ctx.moveTo(-2, -2);
      ctx.quadraticCurveTo(-12, -4, -18, 3);
      ctx.quadraticCurveTo(-10, 5, -2, 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right peel
      ctx.beginPath();
      ctx.moveTo(2, -2);
      ctx.quadraticCurveTo(12, -4, 18, 3);
      ctx.quadraticCurveTo(10, 5, 2, 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Front peel
      ctx.beginPath();
      ctx.moveTo(-3, 0);
      ctx.quadraticCurveTo(0, 12, 0, 15);
      ctx.quadraticCurveTo(3, 12, 3, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }
  }
}
