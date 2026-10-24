import { Skeleton } from '../core/Skeleton.js?v=char_overhaul_v42';
import { AnimationController } from '../animation/AnimationController.js?v=char_overhaul_v42';
import { getCharacter } from '../data/Characters.js?v=char_overhaul_v42';

/**
 * Autonomous CPU Rival Opponent for 1v1 Head Soccer.
 * Defends the right goal, tracks the ball, performs header jumps, tackles,
 * and launches character-specific Rival Super Shots!
 */
export class RivalBot {
  /**
   * @param {number} groundY
   * @param {number} stageWidth
   * @param {import('../audio/SoundManager.js').SoundManager} soundManager
   * @param {import('./ParticleSystem.js').ParticleSystem} particleSystem
   */
  constructor(groundY, stageWidth, soundManager, particleSystem) {
    this.groundY = groundY;
    this.stageWidth = stageWidth;
    this.soundManager = soundManager;
    this.particleSystem = particleSystem;

    this.skeleton = new Skeleton();
    this.animController = new AnimationController(this.skeleton);
    this.animController.headScaleMultiplier = 1.0;

    this.character = getCharacter('luchador'); // Defaults to El Toro 🇲🇽

    this.x = stageWidth - 230;
    this.y = groundY;
    this.vx = 0;
    this.vy = 0;
    this.direction = -1; // Primary facing: LEFT towards player & field
    this.isGrounded = true;
    this.isStunned = false;
    this.stunTimer = 0;
    this.hp = 100;
    this.maxHp = 100;
    this.power = 30; // Starts with partial super gauge
    this.kickHitbox = { x: 0, y: 0, radius: 26 };
    this.headHitbox = { x: 0, y: 0, radius: 48 };
    this.foreheadHitbox = { x: 0, y: 0, radius: 30 };
    this.torsoHitbox = { x: 0, y: 0, radius: 24 };
    this.hitFlashTimer = 0;
    this.isFrozen = false;
    this.freezeTimer = 0;
    this.hasShield = false;
    this.speedMultiplier = 1.0;
    this.giantHeadMultiplier = 1.0;

    this.isHumanControlled = false;
    this.canDoubleJump = true;
    this.isDashing = false;
    this.dashTimer = 0;
    this.dashVx = 0;
    this.dashCooldown = 0;
    this.dashGhosts = [];
    this.isSpinning = false;
    this.spinTime = 0;
    this.spinDuration = 0.36;
    this.flipAngle = 0;
    this.isMoving = false;
    this.activePowerMultiplier = 1.0;

    this.kickCooldown = 0;
    this.tackleCooldown = 0;
    this.jumpCooldown = 0;
    this.tauntCooldown = 0;
    this.enabled = true;
    this.difficulty = 'medium';
  }

  setHumanControlled(isHuman) {
    this.isHumanControlled = !!isHuman;
  }

  setDifficulty(level = 'medium') {
    this.difficulty = level;
    if (level === 'easy') {
      this.speedMultiplier = 0.82;
    } else if (level === 'medium') {
      this.speedMultiplier = 1.0;
    } else if (level === 'hard') {
      this.speedMultiplier = 1.25;
    } else if (level === 'champion') {
      this.speedMultiplier = 1.45;
    }
  }

  freeze(duration = 2.0) {
    if (this.hasShield) return;
    this.isFrozen = true;
    this.freezeTimer = duration;
    this.vx = 0;
    this.soundManager.play('freeze');
    this.particleSystem.spawnSparks(this.x, this.y - 45, 25, '#00ffff');
  }

  setCharacter(character) {
    this.character = character;
    this.hp = 100;
    this.maxHp = 100;
    this.animController.play('idle');
  }

  resetPosition() {
    this.x = this.stageWidth - 230;
    this.y = this.groundY;
    this.vx = 0;
    this.vy = 0;
    this.isGrounded = true;
    this.isStunned = false;
    this.isFrozen = false;
    this.freezeTimer = 0;
    this.stunTimer = 0;
    this.direction = -1;
    this.isDashing = false;
    this.dashTimer = 0;
    this.dashVx = 0;
    this.dashGhosts = [];
    this.isSpinning = false;
    this.spinTime = 0;
    this.flipAngle = 0;
    this.canDoubleJump = true;
    this.isMoving = false;
    this.activePowerMultiplier = 1.0;
    this.animController.play('idle');
  }

  triggerJump() {
    if (this.isStunned || this.isFrozen || !this.enabled) return;
    this.soundManager.init();

    if (this.isGrounded) {
      const jumpMult = this.character?.stats?.jump || 1.0;
      this.vy = -750 * jumpMult;
      this.isGrounded = false;
      this.canDoubleJump = true;
      this.animController.play('jump');
      this.animController.triggerJumpStretch(1.25);
      this.soundManager.play('headImpact');
      this.particleSystem.spawnDust(this.x, this.y, 8);
    } else if (this.canDoubleJump) {
      const jumpMult = this.character?.stats?.jump || 1.0;
      this.vy = -520 * jumpMult;
      this.canDoubleJump = false;
      this.isSpinning = true;
      this.spinTime = 0;
      this.spinDuration = 0.36;
      this.flipAngle = 0;
      this.soundManager.play('recover');
      this.particleSystem.spawnAirRing(this.x, this.y - 5, '#ff3700');
      this.particleSystem.spawnSparks(this.x, this.y - 5, 14, '#ff3700');
      this.animController.play('jump');
      this.animController.triggerJumpStretch(1.0);
    }
  }

  triggerDash() {
    if (this.isStunned || this.isFrozen || !this.enabled) return;
    if (this.dashCooldown > 0) return;
    this.soundManager.init();

    const dir = this.direction || -1;
    this.dashCooldown = 0.45;
    this.isDashing = true;
    this.dashTimer = 0.16;

    if (!this.isGrounded) {
      this.dashVx = dir * 960;
      this.vy = -60;
      this.soundManager.play('laser');
      this.particleSystem.spawnAirRing(this.x, this.y - 30, '#ffd700');
      this.particleSystem.spawnSparks(this.x, this.y - 30, 16, '#ffd700');
    } else {
      this.dashVx = dir * 1020;
      this.soundManager.play('kick');
      this.particleSystem.spawnAirRing(this.x, this.y - 15, '#ff3700');
      this.particleSystem.spawnSparks(this.x - dir * 25, this.y - 15, 14, '#ff3700');
    }
  }

  triggerKick(ball, player, collisionSystem, chargeRatio = null) {
    if (this.isStunned || this.isFrozen || !this.enabled) return;
    this.soundManager.init();

    if (chargeRatio !== null) {
      const powerMult = this.character?.stats?.power || 1.0;
      this.activePowerMultiplier = (1.4 + chargeRatio * 0.7) * powerMult;

      this.soundManager.playSubBassKick();
      this.soundManager.play('kick');
      this.soundManager.play('chargedBlast');

      this.animController.play('kick');
      this.particleSystem.spawnSonicBoom(this.x, this.y - 20, this.direction, '#ff3700');
      this.particleSystem.spawnFlameBurst(this.x, this.y - 20, 24, ['#ff3700', '#ffffff', '#ffd000']);
      const pct = Math.round(50 + chargeRatio * 50);
      collisionSystem?.addFloatingText(`⚡ ¡CAÑONAZO P2 ${pct}%! ⚡`, this.x, this.y - 95, '#ff3700', 24);
      this.performHitCheck(ball, player, collisionSystem, true);
      return;
    }

    const powerMult = this.character?.stats?.power || 1.0;
    this.activePowerMultiplier = 1.25 * powerMult;

    let chosenAnim = 'kick';
    const dx = (ball.x - this.x) * this.direction;
    const dy = ball.y - this.y;
    const dist = Math.hypot(ball.x - this.x, ball.y - this.y);

    if (!this.isGrounded) {
      if (dy < -35 && dist < 170) {
        chosenAnim = 'bicycle_kick';
        this.vy = -380;
        this.particleSystem.spawnAirRing(this.x, this.y - 30, '#ffd700');
        this.soundManager.play('chargedBlast');
      } else if (dy > -20 && dx > 15 && dist < 150) {
        chosenAnim = 'smash_header';
        this.particleSystem.spawnAirRing(this.x, this.y - 20, '#ffcc00');
        this.soundManager.play('headImpact');
      } else {
        chosenAnim = 'diving_header';
        this.vx = this.direction * 320;
        this.particleSystem.spawnAirRing(this.x, this.y - 20, '#ff5500');
        this.soundManager.play('kick');
      }
    } else {
      if (dx < -15 && dist < 100) {
        chosenAnim = 'scorpion_kick';
        this.soundManager.play('kick');
      } else if (this.isMoving && dx > 10) {
        chosenAnim = 'rocket_kick';
        this.particleSystem.spawnTurfSpray(this.x, this.groundY, this.direction, 14);
        this.soundManager.play('laser');
      } else {
        chosenAnim = 'kick';
        this.soundManager.play('kick');
      }
    }

    this.animController.play(chosenAnim);
    this.particleSystem.spawnSparks(this.x + 35 * this.direction, this.y - 15, 14, '#ff3700');
    this.performHitCheck(ball, player, collisionSystem);
  }

  triggerSuper(ball, player, collisionSystem, superShots) {
    if (this.isStunned || this.isFrozen || !this.enabled) return;
    this.soundManager.init();

    if (this.power >= 100) {
      this.power = 0;
      const powerMult = this.character?.stats?.power || 1.0;
      this.activePowerMultiplier = 2.4 * powerMult;
      this.animController.play('super_shot');
      this.soundManager.play('superPower');
      this.soundManager.play('chargedBlast');

      const superColors = this.character?.super?.colors || ['#ff3700', '#ffd000'];
      this.particleSystem.spawnFlameAura(this.x, this.y - 65, superColors);

      if (superShots) {
        superShots.launch(ball, this.character, this.direction, 'rival', { player, rivalBot: this });
      } else {
        ball.kick(this.direction * 980, -320, true, 'rival');
      }
      collisionSystem?.addFloatingText(`🔥 ¡${this.character?.super?.name || 'SUPER TIRO P2'}! 🔥`, this.x, this.y - 95, superColors[0] || '#ff3700', 24);
    } else {
      this.triggerKick(ball, player, collisionSystem);
      collisionSystem?.addFloatingText('⚡ POWER INSUFICIENTE P2', this.x, this.y - 95, '#ff5500', 16);
    }
  }

  performHitCheck(ball, player, collisionSystem, forceHit = false) {
    const footTip = this.skeleton.footFront.getWorldTip();
    const footOffsetX = Math.abs(footTip.x - this.skeleton.root.x);
    this.kickHitbox.x = this.x + this.direction * footOffsetX;
    this.kickHitbox.y = footTip.y;

    const distFootBall = Math.hypot(ball.x - this.kickHitbox.x, ball.y - this.kickHitbox.y);
    const reach = forceHit ? ball.radius + this.kickHitbox.radius + 36 : ball.radius + this.kickHitbox.radius + 18;

    if (distFootBall <= reach) {
      this.kickCooldown = 0.28;
      const powerMult = (this.character?.stats?.power || 1.0) * (this.activePowerMultiplier || 1.0);
      const cur = this.animController.currentAnim;
      const dir = this.direction;

      if (cur === 'bicycle_kick') {
        ball.kick(dir * (1160 + Math.random() * 80) * powerMult, -280 * powerMult, false, 'rival', 'bicycle', dir * 3.6);
        this.power = Math.min(100, this.power + 22);
        this.particleSystem.spawnSonicBoom(ball.x, ball.y, dir, '#ffd700');
        this.particleSystem.spawnKickImpact(ball.x, ball.y, dir, '#ffd700', 30);
        this.soundManager.play('chargedBlast');
        this.soundManager.play('kick');
        collisionSystem?.triggerShake(13);
        collisionSystem?.addFloatingText('🤸 ¡CHILENA P2!', this.x, this.y - 95, '#ffd700', 22);
      } else if (cur === 'rocket_kick') {
        ball.kick(dir * (1120 + Math.random() * 70) * powerMult, -85 * powerMult, false, 'rival', 'rocket', dir * 1.4);
        this.power = Math.min(100, this.power + 20);
        this.particleSystem.spawnTurfSpray(ball.x, this.groundY, dir, 20);
        this.particleSystem.spawnSonicBoom(ball.x, ball.y, dir, '#ff5500');
        this.particleSystem.spawnKickImpact(ball.x, ball.y, dir, '#ff5500', 26);
        this.soundManager.play('laser');
        this.soundManager.play('kick');
        collisionSystem?.triggerShake(11);
        collisionSystem?.addFloatingText('🚀 ¡CAÑONAZO P2!', this.x, this.y - 95, '#ff5500', 22);
      } else if (cur === 'diving_header') {
        ball.kick(dir * (1040 + Math.random() * 60) * powerMult, -170 * powerMult, false, 'rival', 'palomita', dir * 2.0);
        this.power = Math.min(100, this.power + 18);
        this.particleSystem.spawnKickImpact(ball.x, ball.y, dir, '#ff9900', 22);
        this.soundManager.play('headImpact');
        collisionSystem?.addFloatingText('⚡ ¡PALOMITA P2!', this.x, this.y - 95, '#ff9900', 20);
      } else if (cur === 'scorpion_kick') {
        ball.kick(dir * (960 + Math.random() * 60) * powerMult, -440 * powerMult, false, 'rival', 'scorpion', -dir * 3.4);
        this.power = Math.min(100, this.power + 18);
        this.particleSystem.spawnKickImpact(ball.x, ball.y, dir, '#ff00aa', 22);
        this.soundManager.play('kick');
        collisionSystem?.addFloatingText('🦂 ¡TIRO ESCORPIÓN P2!', this.x, this.y - 95, '#ff00aa', 20);
      } else if (cur === 'smash_header') {
        ball.kick(dir * (880 + Math.random() * 60) * powerMult, 360 * powerMult, false, 'rival', 'smash', dir * 2.6);
        this.power = Math.min(100, this.power + 18);
        this.particleSystem.spawnTurfSpray(ball.x, this.groundY, dir, 18);
        this.particleSystem.spawnKickImpact(ball.x, ball.y, dir, '#ffd700', 24);
        this.soundManager.play('headImpact');
        collisionSystem?.addFloatingText('💥 ¡MARTILLAZO P2!', this.x, this.y - 95, '#ffd700', 20);
      } else {
        const isCharged = this.activePowerMultiplier > 1.35;
        ball.kick(
          dir * (780 + Math.random() * 80) * powerMult,
          (-340 - Math.random() * 80) * powerMult,
          false,
          'rival',
          isCharged ? 'rocket' : 'drive'
        );
        this.power = Math.min(100, this.power + (isCharged ? 22 : 14));
        this.particleSystem.spawnKickImpact(footTip.x, footTip.y, dir, isCharged ? '#ffd700' : '#ff9900', isCharged ? 28 : 18);
        this.soundManager.play('kick');
      }
    }
  }

  update(dt, ball, player, collisionSystem, ragdollSystem, superShots, inputManager = null) {
    if (!this.enabled) return { face: 'idle' };

    if (this.kickCooldown > 0) this.kickCooldown -= dt;
    if (this.tackleCooldown > 0) this.tackleCooldown -= dt;
    if (this.jumpCooldown > 0) this.jumpCooldown -= dt;
    if (this.tauntCooldown > 0) this.tauntCooldown -= dt;
    if (this.hitFlashTimer > 0) this.hitFlashTimer = Math.max(0, this.hitFlashTimer - dt);

    // Freeze recovery
    if (this.isFrozen) {
      this.freezeTimer -= dt;
      if (this.freezeTimer <= 0) {
        this.isFrozen = false;
        this.soundManager.play('shatter');
        this.particleSystem.spawnSparks(this.x, this.y - 45, 30, '#00ffff');
      }
      this.skeleton.setPosition(this.x, this.y);
      this.skeleton.setFacing(this.direction);
      return { face: 'ko', squashY: 1.0, stretchX: 1.0, aura: false };
    }

    // Passive power meter build-up (balanced arcade rate)
    if (this.power < 100) {
      this.power = Math.min(100, this.power + dt * 6.0);
    }

    // Stun recovery
    if (this.isStunned) {
      this.stunTimer -= dt;
      if (this.stunTimer <= 0) {
        this.isStunned = false;
        this.animController.play('idle');
        this.soundManager.play('recover');
        this.particleSystem.spawnSparks(this.x, this.y - 45, 20, '#00ffcc');
        this.hp = Math.min(100, this.hp + 20);
      }
      this.skeleton.setPosition(this.x, this.y);
      this.skeleton.setFacing(this.direction);
      return this.animController.update(dt);
    }

    // === PLAYER 2 HUMAN CONTROLLED BRANCH ===
    if (this.isHumanControlled) {
      // Dash Cooldown decrement
      if (this.dashCooldown > 0) {
        this.dashCooldown = Math.max(0, this.dashCooldown - dt);
      }

      // Smooth Physics Dash with Continuous Velocity Deceleration & Afterimages
      if (this.isDashing) {
        this.dashTimer -= dt;
        this.x += this.dashVx * dt;
        this.dashVx *= 0.92;

        if (!this.dashGhosts) this.dashGhosts = [];
        this.dashGhosts.push({
          x: this.x,
          y: this.y,
          direction: this.direction || -1,
          alpha: 0.65,
          color: this.character?.super?.colors?.[0] || 'rgba(255, 55, 0, 0.45)'
        });

        if (this.dashTimer <= 0) {
          this.isDashing = false;
          this.dashVx = 0;
        }
      }

      // Fade dash ghost afterimages
      if (this.dashGhosts && this.dashGhosts.length > 0) {
        for (let i = this.dashGhosts.length - 1; i >= 0; i--) {
          this.dashGhosts[i].alpha -= dt * 4.2;
          if (this.dashGhosts[i].alpha <= 0) {
            this.dashGhosts.splice(i, 1);
          }
        }
      }

      // Athletic Double Jump 360 Flip / Spin
      if (this.isSpinning) {
        this.spinTime += dt;
        const progress = Math.min(1.0, this.spinTime / this.spinDuration);
        this.flipAngle = progress * Math.PI * 2 * (this.direction || -1);
        if (progress >= 1.0) {
          this.isSpinning = false;
          this.flipAngle = 0;
        }
      }

      const speedMult = (this.character?.stats?.speed || 1.0) * (this.speedMultiplier || 1.0);
      const moveSpeed = 360 * speedMult;
      let isMoving = false;

      if (!this.isStunned && !this.isFrozen && !this.isDashing && inputManager) {
        if (inputManager.isP2KeyDown('left')) {
          this.x -= moveSpeed * dt;
          this.direction = -1;
          isMoving = true;
        }
        if (inputManager.isP2KeyDown('right')) {
          this.x += moveSpeed * dt;
          this.direction = 1;
          isMoving = true;
        }
      }
      this.isMoving = isMoving;

      // Clamp to pitch boundaries
      this.x = Math.max(78, Math.min(this.x, this.stageWidth - 78));

      // Vertical gravity & platform physics
      if (!this.isGrounded) {
        this.vy += 1580 * dt;
        this.y += this.vy * dt;

        if (this.y >= this.groundY) {
          const impact = Math.min(1.6, Math.abs(this.vy) / 450);
          this.y = this.groundY;
          this.vy = 0;
          this.isGrounded = true;
          this.canDoubleJump = true;
          this.animController.triggerLandingSquash(impact);
          this.particleSystem.spawnDust(this.x, this.groundY, 7);
          this.particleSystem.spawnSparks(this.x, this.groundY, 8, 'rgba(255,255,255,0.6)');
        }
      } else {
        this.y = this.groundY;
        this.vy = 0;
        this.canDoubleJump = true;
      }

      // Hitboxes updates (Anatomically calibrated for Chibi 1.25x caricature proportion)
      const headScale = (this.userHeadScale || 1.0) * (this.giantHeadMultiplier || 1.0) * 1.25;
      const footTip = this.skeleton.footFront.getWorldTip();
      const footOffsetX = Math.abs(footTip.x - this.skeleton.root.x);
      this.kickHitbox.x = this.x + this.direction * (footOffsetX + 4);
      this.kickHitbox.y = footTip.y - 2;
      this.kickHitbox.radius = 26;

      this.headHitbox.x = this.skeleton.head.worldX + this.direction * (14 * headScale);
      this.headHitbox.y = this.skeleton.head.worldY - (50 * headScale);
      this.headHitbox.radius = Math.round(48 * headScale);

      if (!this.foreheadHitbox) this.foreheadHitbox = { x: 0, y: 0, radius: 30 };
      this.foreheadHitbox.x = this.skeleton.head.worldX + this.direction * (28 * headScale);
      this.foreheadHitbox.y = this.skeleton.head.worldY - (58 * headScale);
      this.foreheadHitbox.radius = Math.round(30 * headScale);

      if (!this.torsoHitbox) this.torsoHitbox = { x: 0, y: 0, radius: 24 };
      this.torsoHitbox.x = this.skeleton.torso.worldX + this.direction * 4;
      this.torsoHitbox.y = this.skeleton.torso.worldY - 12;
      this.torsoHitbox.radius = 24;

      // Continuous collision check if kick animation is active
      const curAnim = this.animController.currentAnim;
      const isOneShotKick = ['kick', 'rocket_kick', 'bicycle_kick', 'diving_header', 'scorpion_kick', 'smash_header'].includes(curAnim);
      const distFootBall = Math.hypot(ball.x - this.kickHitbox.x, ball.y - this.kickHitbox.y);
      if (isOneShotKick && this.kickCooldown <= 0 && distFootBall < ball.radius + this.kickHitbox.radius) {
        this.performHitCheck(ball, player, collisionSystem);
      }

      // Header collision check (Forehead sweetspot + Cranium mass)
      const distHeadBall = Math.hypot(ball.x - this.headHitbox.x, ball.y - this.headHitbox.y);
      const distForeheadBall = this.foreheadHitbox ? Math.hypot(ball.x - this.foreheadHitbox.x, ball.y - this.foreheadHitbox.y) : 999;
      const isHeadHit = distHeadBall < ball.radius + this.headHitbox.radius || (this.foreheadHitbox && distForeheadBall < ball.radius + this.foreheadHitbox.radius);
      if (this.kickCooldown <= 0 && isHeadHit) {
        this.hitFlashTimer = 0.12;
        this.kickCooldown = 0.22;
        const powerMult = (this.character?.stats?.power || 1.0) * (this.activePowerMultiplier || 1.0);
        const dir = this.direction;

        const isLaser = (ball.superType === 'laser' || ball.superType === 'laser_reflected') && ball.lastKickedBy === 'player';
        if (isLaser && (!this.isGrounded || curAnim === 'smash_header' || isOneShotKick)) {
          // OPTION 1: P2 REFLEJO PRISMATICO!
          ball.isSuper = true;
          ball.superType = 'laser_reflected';
          ball.superColors = ['#ffd700', '#ffffff', '#00f0ff'];
          ball.lastKickedBy = 'rival';
          ball.kick(dir * 1580, -25, true, 'rival');
          this.particleSystem.spawnSonicBoom(this.headHitbox.x, this.headHitbox.y, dir, '#ffd700');
          this.particleSystem.spawnSparks(ball.x, ball.y, 45, '#ffd700');
          this.soundManager.play('superPower');
          this.soundManager.play('laser');
          collisionSystem?.triggerHitStop(0.09);
          collisionSystem?.triggerShake(16);
          collisionSystem?.addFloatingText('🪞⚡ ¡REFLEJO P2! ⚡🪞', this.x, this.y - 110, '#ffd700', 26);
          return;
        }

        if (!this.isGrounded && curAnim === 'smash_header') {
          ball.kick(dir * (880 + Math.random() * 60) * powerMult, 360 * powerMult, false, 'rival', 'smash', dir * 2.6);
          this.particleSystem.spawnTurfSpray(ball.x, this.groundY, dir, 16);
          this.particleSystem.spawnKickImpact(ball.x, ball.y, dir, '#ffd700', 22);
          this.soundManager.play('headImpact');
          collisionSystem?.addFloatingText('💥 ¡MARTILLAZO P2!', this.x, this.y - 95, '#ffd700', 20);
        } else if (!this.isGrounded) {
          ball.kick(dir * (680 + Math.random() * 80) * powerMult, -Math.abs(ball.vy) * 0.75 - 240, false, 'rival', 'header');
          this.particleSystem.spawnKickImpact(ball.x, ball.y, dir, '#ffd700', 20);
          this.soundManager.play('headImpact');
        } else if (isMoving) {
          ball.kick(dir * 420 * powerMult, -Math.abs(ball.vy) * 0.6 - 160, false, 'rival');
          this.soundManager.play('headImpact');
        } else {
          ball.vx = dir * 135;
          ball.vy = -Math.abs(ball.vy) * 0.55 - 90;
          ball.lastKickedBy = 'rival';
          this.soundManager.play('bounce');
        }
      }

      // State machine
      const isOneShot = ['kick', 'rocket_kick', 'bicycle_kick', 'diving_header', 'scorpion_kick', 'smash_header', 'super_shot'].includes(curAnim);
      const isFinished = isOneShot && (this.animController.animTime >= this.animController.getClip().duration * 0.95);

      if (this.isStunned) {
        if (curAnim !== 'stun') this.animController.play('stun');
      } else if (!isOneShot || isFinished) {
        if (!this.isGrounded) {
          if (curAnim !== 'jump') this.animController.play('jump');
        } else if (isMoving) {
          if (curAnim !== 'run') this.animController.play('run');
        } else {
          if (curAnim !== 'idle') this.animController.play('idle');
        }
      }

      this.skeleton.setPosition(this.x, this.y);
      this.skeleton.setFacing(this.direction);
      this.animController.setLookTarget(ball.x, ball.y);
      const animState = this.animController.update(this.isFrozen ? 0 : dt);

      if (animState.aura || curAnim === 'super_shot') {
        const colors = this.character?.super?.colors || ['#ff3700', '#ffd000'];
        this.particleSystem.spawnFlameAura(this.x, this.y - 75, colors);
      }

      return animState;
    }

    // 1. Positioning AI: Defend right goal or press the ball
    const targetDefendX = this.stageWidth - 170;
    let targetX = targetDefendX;

    const ballInRivalZone = ball.x > this.stageWidth * 0.35;
    if (ballInRivalZone) {
      // Approach ball with slight offset to kick towards the left
      targetX = Math.min(this.stageWidth - 82, Math.max(this.stageWidth * 0.36, ball.x + 32));
    }

    const distToTarget = targetX - this.x;
    const speedMult = (this.character?.stats?.speed || 1.0) * (this.speedMultiplier || 1.0);
    const moveSpeed = 330 * speedMult;
    let isMoving = false;

    if (Math.abs(distToTarget) > 16) {
      this.x += Math.sign(distToTarget) * moveSpeed * dt;
      isMoving = true;
    }

    // Primary facing: Rival ALWAYS defends facing LEFT towards Player 1 and field.
    // Only turn right if ball bypassed the rival into the net behind them.
    if (ball.x > this.x + 35 && ball.x > this.stageWidth - 110) {
      this.direction = 1;
    } else {
      this.direction = -1;
    }

    // Keep within pitch bounds
    this.x = Math.max(this.stageWidth * 0.34, Math.min(this.stageWidth - 80, this.x));

    // Jump AI for headers
    const distBallRival = Math.hypot(ball.x - this.x, ball.y - (this.y - 65));
    if (this.isGrounded && this.jumpCooldown <= 0 && distBallRival < 115 && ball.y < this.groundY - 55 && ball.vy > -240) {
      const jumpMult = this.character?.stats?.jump || 1.0;
      this.vy = -720 * jumpMult;
      this.isGrounded = false;
      this.jumpCooldown = 1.1;
      this.animController.play('jump');
      this.animController.triggerJumpStretch(1.2);
      this.soundManager.play('headImpact');
    }

    // Vertical physics
    if (!this.isGrounded) {
      this.vy += 1580 * dt;
      this.y += this.vy * dt;
      if (this.y >= this.groundY) {
        const impact = Math.min(1.5, Math.abs(this.vy) / 450);
        this.y = this.groundY;
        this.vy = 0;
        this.isGrounded = true;
        this.animController.triggerLandingSquash(impact);
      }
    } else {
      this.y = this.groundY;
      this.vy = 0;
    }

    // 2. Kicking Strike Logic (Anatomically calibrated)
    const footTip = this.skeleton.footFront.getWorldTip();
    const footOffsetX = Math.abs(footTip.x - this.skeleton.root.x);
    this.kickHitbox.x = this.x + this.direction * (footOffsetX + 4);
    this.kickHitbox.y = footTip.y - 2;
    this.kickHitbox.radius = 26;

    if (!this.torsoHitbox) this.torsoHitbox = { x: 0, y: 0, radius: 24 };
    this.torsoHitbox.x = this.skeleton.torso.worldX + this.direction * 4;
    this.torsoHitbox.y = this.skeleton.torso.worldY - 12;
    this.torsoHitbox.radius = 24;

    // Remote / Ranged Super Ability cast:
    // If RivalBot has full power (100) and ball is in attacking half, unleash special ability with telegraph!
    const ballInAttackZone = ball.x > this.stageWidth * 0.28 && ball.x < this.x;
    if (this.power >= 100 && this.kickCooldown <= 0 && ballInAttackZone && Math.random() < 0.006) {
      this.power = 0;
      this.kickCooldown = 1.2;
      this.animController.play('super_shot');
      this.soundManager.play('superPower');
      this.soundManager.play('chargedBlast');
      const colors = this.character?.super?.colors || ['#ff3700', '#ffd000'];
      this.particleSystem.spawnFlameAura(this.x, this.y - 65, colors);

      if (superShots) {
        superShots.launch(ball, this.character, -1, 'rival', { player, rivalBot: this });
      }
      collisionSystem.addFloatingText('⚠️ ¡SUPER TIRO RIVAL! ⚠️', this.x, this.y - 120, '#ff1744', 22);
      collisionSystem.addFloatingText(`🔥 ¡${this.character?.super?.name || 'TIRO RIVAL'}! 🔥`, this.x, this.y - 95, colors[0] || '#ff3700', 20);
    }

    const distFootBall = Math.hypot(ball.x - this.kickHitbox.x, ball.y - this.kickHitbox.y);
    if (this.kickCooldown <= 0 && distFootBall < ball.radius + this.kickHitbox.radius) {
      this.kickCooldown = 0.35;
      const useSuper = this.power >= 100;

      if (useSuper) {
        this.power = 0;
        this.animController.play('super_shot');
        this.soundManager.play('superPower');
        this.soundManager.play('chargedBlast');
        const colors = this.character?.super?.colors || ['#ff3700', '#ffd000'];
        this.particleSystem.spawnFlameAura(this.x, this.y - 65, colors);

        if (superShots) {
          superShots.launch(ball, this.character, -1, 'rival', { player, rivalBot: this });
        } else {
          ball.kick(-860, -320, true, 'rival');
        }
        collisionSystem.addFloatingText(`🔥 ¡${this.character?.super?.name || 'TIRO RIVAL'}! 🔥`, this.x, this.y - 95, colors[0] || '#ff3700', 22);
      } else {
        const powerMult = this.character?.stats?.power || 1.0;
        if (!this.isGrounded) {
          if (ball.y < this.y - 35) {
            // Acrobatic Bicycle Kick
            this.animController.play('bicycle_kick');
            ball.kick((-980 - Math.random() * 80) * powerMult, -260 * powerMult, false, 'rival', 'bicycle');
            this.particleSystem.spawnSonicBoom(ball.x, ball.y, -1, '#ff3700');
            this.particleSystem.spawnKickImpact(ball.x, ball.y, -1, '#ff3700', 24);
            this.soundManager.play('chargedBlast');
            this.soundManager.play('kick');
            collisionSystem?.addFloatingText('🤸 ¡CHILENA RIVAL!', this.x, this.y - 95, '#ff3700', 20);
            collisionSystem?.triggerShake(10);
          } else {
            // Diving Header Torpedo
            this.animController.play('diving_header');
            ball.kick((-920 - Math.random() * 70) * powerMult, -170 * powerMult, false, 'rival', 'palomita');
            this.particleSystem.spawnKickImpact(ball.x, ball.y, -1, '#ff9900', 20);
            this.soundManager.play('headImpact');
            collisionSystem?.addFloatingText('⚡ ¡PALOMITA RIVAL!', this.x, this.y - 95, '#ff9900', 20);
          }
        } else if (isMoving && Math.random() < 0.45) {
          // Low Rocket Drive
          this.animController.play('rocket_kick');
          ball.kick((-950 - Math.random() * 90) * powerMult, -80 * powerMult, false, 'rival', 'rocket');
          this.particleSystem.spawnTurfSpray(ball.x, this.groundY, -1, 16);
          this.particleSystem.spawnSonicBoom(ball.x, ball.y, -1, '#ff5500');
          this.particleSystem.spawnKickImpact(ball.x, ball.y, -1, '#ff5500', 22);
          this.soundManager.play('laser');
          this.soundManager.play('kick');
          collisionSystem?.addFloatingText('🚀 ¡CAÑONAZO RIVAL!', this.x, this.y - 95, '#ff5500', 20);
          collisionSystem?.triggerShake(9);
        } else {
          // Standard Strike
          this.animController.play('kick');
          this.soundManager.play('kick');
          this.particleSystem.spawnKickImpact(footTip.x, footTip.y, -1, '#ff9900', 16);
          ball.kick((-680 - Math.random() * 100) * powerMult, (-340 - Math.random() * 80) * powerMult, false, 'rival');
        }
      }
    }

    // 3. Header Strike Logic for Rival (Anatomically calibrated for Chibi proportion)
    const headScale = (this.userHeadScale || 1.0) * (this.giantHeadMultiplier || 1.0) * 1.25;
    this.headHitbox.x = this.skeleton.head.worldX + this.direction * (14 * headScale);
    this.headHitbox.y = this.skeleton.head.worldY - (50 * headScale);
    this.headHitbox.radius = Math.round(48 * headScale);

    if (!this.foreheadHitbox) this.foreheadHitbox = { x: 0, y: 0, radius: 30 };
    this.foreheadHitbox.x = this.skeleton.head.worldX + this.direction * (28 * headScale);
    this.foreheadHitbox.y = this.skeleton.head.worldY - (58 * headScale);
    this.foreheadHitbox.radius = Math.round(30 * headScale);

    const distHeadBall = Math.hypot(ball.x - this.headHitbox.x, ball.y - this.headHitbox.y);
    const distForeheadBall = this.foreheadHitbox ? Math.hypot(ball.x - this.foreheadHitbox.x, ball.y - this.foreheadHitbox.y) : 999;
    const isHeadHit = distHeadBall < ball.radius + this.headHitbox.radius || (this.foreheadHitbox && distForeheadBall < ball.radius + this.foreheadHitbox.radius);
    if (this.kickCooldown <= 0 && isHeadHit) {
      this.hitFlashTimer = 0.12;
      this.kickCooldown = 0.32;
      const powerMult = this.character?.stats?.power || 1.0;
      const isLaser = (ball.superType === 'laser' || ball.superType === 'laser_reflected') && ball.lastKickedBy === 'player';
      if (isLaser && (!this.isGrounded || curAnim === 'smash_header' || Math.random() < 0.65)) {
        // OPTION 1: AI REFLEJO PRISMATICO!
        ball.isSuper = true;
        ball.superType = 'laser_reflected';
        ball.superColors = ['#ffd700', '#ffffff', '#00f0ff'];
        ball.lastKickedBy = 'rival';
        ball.kick(-1580, -25, true, 'rival');
        this.particleSystem.spawnSonicBoom(this.headHitbox.x, this.headHitbox.y, -1, '#ffd700');
        this.particleSystem.spawnSparks(ball.x, ball.y, 45, '#ffd700');
        this.soundManager.play('superPower');
        this.soundManager.play('laser');
        collisionSystem?.triggerHitStop(0.09);
        collisionSystem?.triggerShake(16);
        collisionSystem?.addFloatingText('🪞⚡ ¡REFLEJO RIVAL! ⚡🪞', this.x, this.y - 110, '#ffd700', 26);
        return;
      }

      if (!this.isGrounded && ball.y > this.y - 45) {
        this.animController.play('smash_header');
        ball.kick((-820 - Math.random() * 80) * powerMult, 320 * powerMult, false, 'rival', 'smash');
        this.particleSystem.spawnTurfSpray(ball.x, this.groundY, -1, 14);
        this.particleSystem.spawnKickImpact(ball.x, ball.y, -1, '#ffd700', 20);
        this.soundManager.play('headImpact');
        collisionSystem?.addFloatingText('💥 ¡MARTILLAZO RIVAL!', this.x, this.y - 95, '#ffd700', 20);
      } else {
        ball.kick((-560 - Math.random() * 100) * powerMult, -Math.abs(ball.vy) * 0.85 - 220, false, 'rival');
        this.particleSystem.spawnKickImpact(ball.x, ball.y, -1, '#ffd700', 16);
        this.soundManager.play('headImpact');
      }
    }

    // 4. Physical Rival vs Player Close Combat Tackle
    const distToPlayer = Math.abs(this.x - player.x);
    if (this.tackleCooldown <= 0 && distToPlayer < 55 && Math.abs(this.y - player.y) < 40) {
      this.tackleCooldown = 2.4; // 2.4s cooldown so no tackle spam!
      this.animController.play('kick');
      this.soundManager.play('punch');
      this.particleSystem.spawnSparks((this.x + player.x) * 0.5, player.y - 45, 14, '#ff9900');
      const tackleDmg = Math.round(14 * (this.character?.stats?.power || 1.0));
      // isHeavyBlast = false -> NO STUN, just pushback!
      collisionSystem.applyDamage(player, tackleDmg, ragdollSystem, -220, -160, false);
      collisionSystem.addFloatingText('💥 ¡TACKLE!', player.x, player.y - 85, '#ff9900', 16);
    }

    // 5. Animation transitions
    const cur = this.animController.currentAnim;
    const isOneShot = ['kick', 'rocket_kick', 'bicycle_kick', 'diving_header', 'scorpion_kick', 'smash_header', 'super_shot', 'taunt'].includes(cur);
    const isFinished = isOneShot && (this.animController.animTime >= this.animController.getClip().duration * 0.95);

    if (!isOneShot || isFinished) {
      if (!this.isGrounded) {
        if (cur !== 'jump') this.animController.play('jump');
      } else if (isMoving) {
        if (cur !== 'run') this.animController.play('run');
      } else {
        if (cur !== 'idle') this.animController.play('idle');
      }
    }

    this.skeleton.setPosition(this.x, this.y);
    this.skeleton.setFacing(this.direction);
    if (this.animController.setLookTarget) this.animController.setLookTarget(ball.x, ball.y);
    if (this.animController.setVelocity) this.animController.setVelocity(this.vx, this.vy);
    const animState = this.animController.update(dt);

    if (animState.aura || cur === 'super_shot') {
      const colors = this.character?.super?.colors || ['#ff3700', '#ffd000'];
      this.particleSystem.spawnFlameAura(this.x, this.y - 75, colors);
    }

    return animState;
  }

  takeDamage(amount, impulseX = 320, impulseY = -380, isHeavyBlast = false, customStunTimer = null) {
    if (this.hasShield) {
      this.soundManager.play('bounce');
      this.particleSystem.spawnSparks(this.x, this.y - 60, 20, '#ffd700');
      return;
    }
    if (this.isStunned) return;
    this.hp = Math.max(10, this.hp - amount);
    this.soundManager.play('punch');
    this.particleSystem.spawnSparks(this.x, this.y - 60, 20, '#ff3700');

    // Rival ONLY stuns on heavy blast (super shots, bombs, gloves) or critical guard break!
    const isGuardBroken = this.hp <= 15 && amount >= 25;
    if (isHeavyBlast || isGuardBroken) {
      this.isStunned = true;
      this.stunTimer = customStunTimer != null ? customStunTimer : 0.65;
      this.animController.play('stun');
      this.soundManager.play('knockout');
    } else {
      // Light pushback without locking movement
      this.x += Math.sign(impulseX) * 20;
    }
  }
}
