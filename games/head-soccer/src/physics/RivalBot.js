import { Skeleton } from '../core/Skeleton.js';
import { AnimationController } from '../animation/AnimationController.js';
import { getCharacter } from '../data/Characters.js';

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
    this.kickHitbox = { x: 0, y: 0, radius: 18 };
    this.headHitbox = { x: 0, y: 0, radius: 26 };
    this.torsoHitbox = { x: 0, y: 0, radius: 20 };
    this.isFrozen = false;
    this.freezeTimer = 0;
    this.hasShield = false;
    this.speedMultiplier = 1.0;
    this.giantHeadMultiplier = 1.0;

    this.kickCooldown = 0;
    this.tackleCooldown = 0;
    this.jumpCooldown = 0;
    this.enabled = true;
    this.difficulty = 'medium';
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
    this.animController.play('idle');
  }

  update(dt, ball, player, collisionSystem, ragdollSystem, superShots) {
    if (!this.enabled) return { face: 'idle' };

    if (this.kickCooldown > 0) this.kickCooldown -= dt;
    if (this.tackleCooldown > 0) this.tackleCooldown -= dt;
    if (this.jumpCooldown > 0) this.jumpCooldown -= dt;

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

    // Passive power meter build-up (ready for super shots)
    if (this.power < 100) {
      this.power = Math.min(100, this.power + dt * 9.5);
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
      this.soundManager.play('headImpact');
    }

    // Vertical physics
    if (!this.isGrounded) {
      this.vy += 1580 * dt;
      this.y += this.vy * dt;
      if (this.y >= this.groundY) {
        this.y = this.groundY;
        this.vy = 0;
        this.isGrounded = true;
      }
    } else {
      this.y = this.groundY;
      this.vy = 0;
    }

    // 2. Kicking Strike Logic
    const footTip = this.skeleton.footFront.getWorldTip();
    const footOffsetX = Math.abs(footTip.x - this.skeleton.root.x);
    this.kickHitbox.x = this.x + this.direction * footOffsetX;
    this.kickHitbox.y = footTip.y;

    if (!this.torsoHitbox) this.torsoHitbox = { x: 0, y: 0, radius: 20 };
    this.torsoHitbox.x = this.skeleton.torso.worldX;
    this.torsoHitbox.y = this.skeleton.torso.worldY - 14;

    // Remote / Ranged Super Ability cast:
    // If RivalBot has full power (100) and ball is in play, unleash special ability from anywhere!
    if (this.power >= 100 && this.kickCooldown <= 0 && ball.x < this.x && Math.random() < 0.018) {
      this.power = 0;
      this.kickCooldown = 1.1;
      this.animController.play('super_shot');
      this.soundManager.play('superPower');
      this.soundManager.play('chargedBlast');
      const colors = this.character?.super?.colors || ['#ff3700', '#ffd000'];
      this.particleSystem.spawnFlameAura(this.x, this.y - 65, colors);

      if (superShots) {
        superShots.launch(ball, this.character, -1, 'rival', { player, rivalBot: this });
      }
      collisionSystem.addFloatingText(`🔥 ¡${this.character?.super?.name || 'TIRO RIVAL'}! 🔥`, this.x, this.y - 95, colors[0] || '#ff3700', 22);
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

    // 3. Header Strike Logic for Rival
    this.headHitbox.x = this.skeleton.head.worldX + this.direction * 12;
    this.headHitbox.y = this.skeleton.head.worldY - 32;

    const distHeadBall = Math.hypot(ball.x - this.headHitbox.x, ball.y - this.headHitbox.y);
    if (this.kickCooldown <= 0 && distHeadBall < ball.radius + this.headHitbox.radius) {
      this.kickCooldown = 0.32;
      const powerMult = this.character?.stats?.power || 1.0;
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
    const isOneShot = ['kick', 'rocket_kick', 'bicycle_kick', 'diving_header', 'scorpion_kick', 'smash_header', 'super_shot'].includes(cur);
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
    const animState = this.animController.update(dt);

    if (animState.aura || cur === 'super_shot') {
      const colors = this.character?.super?.colors || ['#ff3700', '#ffd000'];
      this.particleSystem.spawnFlameAura(this.x, this.y - 75, colors);
    }

    return animState;
  }

  takeDamage(amount, impulseX = 320, impulseY = -380, isHeavyBlast = false) {
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
      this.stunTimer = 0.65; // Snappy 0.65s recovery
      this.animController.play('stun');
      this.soundManager.play('knockout');
    } else {
      // Light pushback without locking movement
      this.x += Math.sign(impulseX) * 20;
    }
  }
}
