/**
 * Authentic Head Soccer Collision Detection, Dynamic Stun System, and Super Meter.
 * Player does NOT die; taking damage lowers stun resistance, making characters easily stunned.
 * Heading the ball is a pure offensive soccer move and NEVER inflicts self-damage!
 * Damage/stun ONLY occurs when:
 * 1. Rival blasts a Super Shot (Ulti) directly into the character.
 * 2. Rival kicks a violent cannon shot (> 550 speed) directly at the character.
 * 3. Rival hits the character with a direct physical kick/tackle in close combat.
 */
export class CollisionSystem {
  /**
   * @param {import('../audio/SoundManager.js').SoundManager} soundManager
   * @param {import('./ParticleSystem.js').ParticleSystem} particleSystem
   */
  constructor(soundManager, particleSystem) {
    this.soundManager = soundManager;
    this.particleSystem = particleSystem;
    this.playerGoals = 0;
    this.rivalGoals = 0;
    this.goalCooldown = 0;
    this.kickCooldown = 0;
    this.damageCooldown = 0;
    this.onGoalCallbacks = [];
    this.onRivalGoalCallbacks = [];
    this.onDamageCallbacks = [];
    this.onRivalDamageCallbacks = [];
    this.onStunCallbacks = [];
    this.onHitStopCallbacks = [];
    this.onShakeCallbacks = [];
    this.onPostHitCallbacks = [];
    this.floatingTexts = [];
  }

  onGoal(fn) {
    this.onGoalCallbacks.push(fn);
  }

  onRivalGoal(fn) {
    this.onRivalGoalCallbacks.push(fn);
  }

  onDamage(fn) {
    this.onDamageCallbacks.push(fn);
  }

  onRivalDamage(fn) {
    this.onRivalDamageCallbacks.push(fn);
  }

  onStun(fn) {
    this.onStunCallbacks.push(fn);
  }

  onHitStop(fn) {
    this.onHitStopCallbacks.push(fn);
  }

  onShake(fn) {
    this.onShakeCallbacks.push(fn);
  }

  onPostHit(fn) {
    this.onPostHitCallbacks.push(fn);
  }

  triggerHitStop(duration = 0.045) {
    this.onHitStopCallbacks.forEach(fn => fn(duration));
  }

  triggerShake(intensity = 8) {
    this.onShakeCallbacks.forEach(fn => fn(intensity));
  }

  addFloatingText(text, x, y, color = '#ffd700', size = 20) {
    this.floatingTexts.push({
      text,
      x: x + (Math.random() - 0.5) * 16,
      y,
      vy: -115 - Math.random() * 35,
      color,
      size,
      life: 1.0,
      decay: 0.85
    });
  }

  applyDamage(player, amount, ragdollSystem, impulseX = -280, impulseY = -380, isHeavyBlast = false) {
    if (player.hasShield) {
      this.soundManager.play('bounce');
      this.particleSystem.spawnSparks(player.x, player.y - 50, 20, '#ffd700');
      this.addFloatingText('🛡️ ¡ESCUDO DEFLECTOR!', player.x, player.y - 85, '#ffd700', 18);
      return;
    }
    if (player.isStunned || player.isKnockedOut) return;
    if (this.damageCooldown > 0) return;

    this.damageCooldown = 0.35;
    // Lower bound HP to 10 (never die!)
    player.hp = Math.max(10, (player.hp ?? 100) - amount);

    this.soundManager.play('punch');
    this.particleSystem.spawnSparks(player.x, player.y - 60, 20, '#ff3700');

    if (amount >= 35) {
      this.addFloatingText(`-${amount} CRITICAL!`, player.x, player.y - 80, '#ff3700', 22);
    } else {
      this.addFloatingText(`-${amount} HP`, player.x, player.y - 75, '#ffd700', 18);
    }

    this.onDamageCallbacks.forEach(fn => fn(player.hp));

    // Stun logic: NO MORE RANDOM STUNS!
    // Stun occurs ONLY on:
    // 1. Direct Super Shot / Heavy Blast / Bomb / Glove (isHeavyBlast === true)
    // 2. Critical Guard Break (player.hp <= 15 and amount >= 25)
    const isGuardBroken = player.hp <= 15 && amount >= 25;
    if (isHeavyBlast || isGuardBroken) {
      this.triggerStun(player, ragdollSystem, impulseX, impulseY, isHeavyBlast);
    } else {
      // Normal combat pushback — player stays agile and retains full control!
      player.x += Math.sign(impulseX) * 20;
    }
  }

  freezePlayer(player, duration = 2.0) {
    if (player.hasShield || player.isFrozen) return;
    player.isFrozen = true;
    player.freezeTimer = duration;
    player.vx = 0;
    this.soundManager.play('freeze');
    this.particleSystem.spawnSparks(player.x, player.y - 45, 25, '#00ffff');
    this.addFloatingText('🧊 ¡CONGELADO! 🧊', player.x, player.y - 110, '#00ffff', 24);
  }

  triggerStun(player, ragdollSystem, impulseX = -280, impulseY = -380, isHeavyBlast = false) {
    player.isStunned = true;
    player.stunTimer = 0.65; // Snappy 0.65s stun, quick recovery!
    this.soundManager.play('knockout');
    this.addFloatingText('😵 ¡STUNNED!', player.x, player.y - 110, '#00f0ff', 22);

    this.onStunCallbacks.forEach(fn => fn(true));

    // Ragdoll flop ONLY on catastrophic heavy blasts when HP is low!
    if (isHeavyBlast && player.hp <= 20 && ragdollSystem) {
      ragdollSystem.start(player, impulseX, impulseY);
    } else {
      player.animController.play('stun');
    }
  }

  update(player, skeleton, ball, stageWidth, groundY, dt, ragdollSystem, powerSystem, rivalBot, inputManager = null) {
    if (this.goalCooldown > 0) this.goalCooldown -= dt;
    if (this.damageCooldown > 0) this.damageCooldown -= dt;
    if (this.kickCooldown > 0) this.kickCooldown -= dt;

    if (!player.freeze) {
      player.freeze = (dur) => this.freezePlayer(player, dur);
    }

    // Freeze Timer Management for Player
    if (player.isFrozen) {
      player.freezeTimer -= dt;
      if (player.freezeTimer <= 0) {
        player.isFrozen = false;
        this.soundManager.play('shatter');
        this.particleSystem.spawnSparks(player.x, player.y - 45, 30, '#00ffff');
        this.addFloatingText('✨ ¡DESCONGELADO! ✨', player.x, player.y - 110, '#00ffcc', 20);
      }
    }

    // Stun Timer Management for Player
    if (player.isStunned) {
      player.stunTimer -= dt;
      if (player.stunTimer <= 0) {
        player.isStunned = false;
        player.animController.play('idle');
        this.soundManager.play('recover');
        this.particleSystem.spawnSparks(player.x, player.y - 40, 20, '#00ffcc');
        player.hp = Math.min(100, player.hp + 20); // Slowly restore HP
        this.onDamageCallbacks.forEach(fn => fn(player.hp));
        this.onStunCallbacks.forEach(fn => fn(false));
      }
    }

    // Update Floating Damage Texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy * dt;
      ft.vy += 80 * dt;
      ft.life -= ft.decay * dt;
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }

    // Floppy ragdoll ball bounce
    if (player.isKnockedOut && ragdollSystem?.isActive) {
      const pHead = ragdollSystem.getPoint('head');
      if (pHead) {
        const d = Math.hypot(ball.x - pHead.x, ball.y - pHead.y);
        if (d < ball.radius + pHead.radius) {
          ball.vx = (ball.x - pHead.x) * 8 + 120;
          ball.vy = -Math.abs(ball.vy) * 0.7 - 180;
          this.soundManager.play('bounce');
          this.particleSystem.spawnSparks(ball.x, ball.y, 10, '#00f0ff');
        }
      }
      return;
    }

    // 1. Precise Hitbox Updates
    // Kick Foot Hitbox (Toe / Cleat: radius 18px)
    const footTip = skeleton.footFront.getWorldTip();
    const footOffsetX = Math.abs(footTip.x - skeleton.root.x);
    player.kickHitbox.x = player.x + player.direction * footOffsetX;
    player.kickHitbox.y = footTip.y;
    player.kickHitbox.radius = 18;

    // Head Hitbox (Forehead / Crown: radius 26px)
    const headX = skeleton.head.worldX + player.direction * 12;
    const headY = skeleton.head.worldY - 32;
    player.headHitbox.x = headX;
    player.headHitbox.y = headY;
    player.headHitbox.radius = 26;

    // Torso Hitbox (Chest / Body trap: radius 20px)
    if (!player.torsoHitbox) player.torsoHitbox = { x: 0, y: 0, radius: 20 };
    player.torsoHitbox.x = skeleton.torso.worldX;
    player.torsoHitbox.y = skeleton.torso.worldY - 14;
    player.torsoHitbox.radius = 20;

    const curAnim = player.animController.currentAnim;
    const isSpecialKick = ['bicycle_kick', 'rocket_kick', 'diving_header', 'scorpion_kick', 'smash_header'].includes(curAnim);
    const isKicking = curAnim === 'kick' || isSpecialKick;
    const isSuper = curAnim === 'super_shot';
    const isJumping = curAnim === 'jump' || !player.isGrounded;
    const isMoving = !!player.isMoving;

    // --- A. KICK FOOT COLLISION ---
    const distFoot = Math.hypot(ball.x - player.kickHitbox.x, ball.y - player.kickHitbox.y);
    if (distFoot < ball.radius + player.kickHitbox.radius) {
      const powerMult = (player.character?.stats?.power || 1.0) * (player.activePowerMultiplier || 1.0);
      const dir = player.direction;

      // Magnus Aerodynamic Spin Calculation based on Directional Input
      let spinIntent = 0;
      if (inputManager) {
        if (inputManager.isKeyDown('w') || inputManager.isKeyDown('arrowup')) {
          spinIntent = dir * 3.4; // Banana topspin dip over keeper!
        } else if (inputManager.isKeyDown('s') || inputManager.isKeyDown('arrowdown')) {
          spinIntent = -dir * 2.8; // Floating backspin lob!
        }
      }

      if (isSuper) {
        // 1. SIGNATURE SUPER SHOT
        this.kickCooldown = 0.22;
        ball.kick(dir * 960 * powerMult, -280 * powerMult, true, 'player', 'super', dir * 2.5);
        this.particleSystem.spawnFlameBurst(footTip.x, footTip.y, 32);
        this.particleSystem.spawnSonicBoom(footTip.x, footTip.y, dir, '#ff3700');
        this.soundManager.play('superExplode');
        this.triggerShake(16);
        this.triggerHitStop(0.06);
      } else if (curAnim === 'bicycle_kick') {
        // 2. BICYCLE KICK (Chilena acrobática aérea de máxima potencia)
        if (this.kickCooldown <= 0) {
          this.kickCooldown = 0.25;
          ball.kick(dir * (1160 + Math.random() * 80) * powerMult, -280 * powerMult, false, 'player', 'bicycle', dir * 3.6);
          powerSystem?.addPower(24);
          this.particleSystem.spawnSonicBoom(ball.x, ball.y, dir, '#ffd700');
          this.particleSystem.spawnKickImpact(ball.x, ball.y, dir, '#ffd700', 32);
          this.particleSystem.spawnFlameBurst(ball.x, ball.y, 22, ['#ffd700', '#ff8800', '#ffffff']);
          this.soundManager.play('chargedBlast');
          this.soundManager.play('kick');
          this.triggerShake(14);
          this.triggerHitStop(0.05);
          this.addFloatingText('🤸 ¡CHILENA ARCADE!', player.x, player.y - 95, '#ffd700', 22);
        }
      } else if (curAnim === 'rocket_kick') {
        // 3. ROCKET KICK (Cañonazo raso devastador a ras de pasto)
        if (this.kickCooldown <= 0) {
          this.kickCooldown = 0.22;
          ball.kick(dir * (1120 + Math.random() * 70) * powerMult, -85 * powerMult, false, 'player', 'rocket', dir * 1.4);
          powerSystem?.addPower(20);
          this.particleSystem.spawnTurfSpray(ball.x, groundY, dir, 22);
          this.particleSystem.spawnSonicBoom(ball.x, ball.y, dir, '#00f0ff');
          this.particleSystem.spawnKickImpact(ball.x, ball.y, dir, '#00f0ff', 28);
          this.soundManager.play('laser');
          this.soundManager.play('kick');
          this.triggerShake(12);
          this.triggerHitStop(0.045);
          this.addFloatingText('🚀 ¡TIRO COHETE!', player.x, player.y - 95, '#00f0ff', 22);
        }
      } else if (curAnim === 'diving_header') {
        // 4. DIVING HEADER (Palomita horizontal torpedo)
        if (this.kickCooldown <= 0) {
          this.kickCooldown = 0.22;
          ball.kick(dir * (1040 + Math.random() * 60) * powerMult, -170 * powerMult, false, 'player', 'palomita', dir * 2.0);
          powerSystem?.addPower(18);
          this.particleSystem.spawnSonicBoom(ball.x, ball.y, dir, '#00ffcc');
          this.particleSystem.spawnKickImpact(ball.x, ball.y, dir, '#00ffcc', 24);
          this.soundManager.play('headImpact');
          this.soundManager.play('kick');
          this.triggerShake(11);
          this.triggerHitStop(0.04);
          this.addFloatingText('⚡ ¡PALOMITA AGRESIVA!', player.x, player.y - 95, '#00ffcc', 22);
        }
      } else if (curAnim === 'scorpion_kick') {
        // 5. SCORPION KICK (Vaselina de tacón acrobática sobre la defensa)
        if (this.kickCooldown <= 0) {
          this.kickCooldown = 0.24;
          ball.kick(dir * (960 + Math.random() * 60) * powerMult, -440 * powerMult, false, 'player', 'scorpion', -dir * 3.4);
          powerSystem?.addPower(18);
          this.particleSystem.spawnKickImpact(ball.x, ball.y, dir, '#ff00aa', 24);
          this.soundManager.play('kick');
          this.triggerShake(10);
          this.triggerHitStop(0.04);
          this.addFloatingText('🦂 ¡TIRO ESCORPIÓN!', player.x, player.y - 95, '#ff00aa', 22);
        }
      } else if (curAnim === 'smash_header') {
        // 6. SMASH HEADER (Cabezazo picado hacia el piso)
        if (this.kickCooldown <= 0) {
          this.kickCooldown = 0.22;
          ball.kick(dir * (880 + Math.random() * 60) * powerMult, 360 * powerMult, false, 'player', 'smash', dir * 2.6);
          powerSystem?.addPower(18);
          this.particleSystem.spawnTurfSpray(ball.x, groundY, dir, 18);
          this.particleSystem.spawnKickImpact(ball.x, ball.y, dir, '#ffcc00', 24);
          this.soundManager.play('headImpact');
          this.triggerShake(11);
          this.triggerHitStop(0.04);
          this.addFloatingText('💥 ¡CABEZAZO DEMOLEDOR!', player.x, player.y - 95, '#ffcc00', 22);
        }
      } else if (isKicking) {
        // 7. ACTIVE KICK (Tiro directo base o cañonazo cargado)
        if (this.kickCooldown <= 0) {
          this.kickCooldown = 0.20;
          const isCharged = (player.activePowerMultiplier || 1.0) > 1.35;
          const kickSpin = spinIntent !== 0 ? spinIntent : (isCharged ? dir * 2.8 : (isMoving ? dir * 1.6 : dir * 0.8));

          ball.kick(
            dir * (780 + Math.random() * 80) * powerMult,
            (-340 - Math.random() * 80) * powerMult,
            false,
            'player',
            isCharged ? 'rocket' : 'drive',
            kickSpin
          );
          powerSystem?.addPower(isCharged ? 24 : 16);
          this.particleSystem.spawnKickImpact(footTip.x, footTip.y, dir, isCharged ? '#ffd700' : '#00ffcc', isCharged ? 30 : 20);
          this.particleSystem.spawnTurfSpray(footTip.x, groundY, dir, isCharged ? 18 : 12);
          if (isCharged) {
            this.soundManager.playSubBassKick();
            this.particleSystem.spawnSonicBoom(footTip.x, footTip.y, dir, '#ffd700');
            this.triggerShake(12);
            this.triggerHitStop(0.045);
          } else {
            this.soundManager.play('kick');
            this.triggerShake(8);
            this.triggerHitStop(0.035);
          }
          if (Math.abs(kickSpin) > 2.0) {
            this.addFloatingText(kickSpin * dir > 0 ? '🍌 ¡TIRO CON EFECTO!' : '🎯 ¡VASALINA FLOTANTE!', player.x, player.y - 95, '#00ffff', 20);
          }
        }
      } else if (isMoving) {
        // 8. RUNNING DRIBBLE (Toque en carrera)
        if (this.kickCooldown <= 0) {
          this.kickCooldown = 0.12;
          ball.vx = dir * 290;
          ball.vy = -140;
          ball.spin = dir * 0.9;
          ball.lastKickedBy = 'player';
          this.particleSystem.spawnSparks(footTip.x, footTip.y, 6, '#00f0ff');
          this.soundManager.play('bounce');
        }
      } else {
        // 9. STANDING STILL / IDLE
        if (this.kickCooldown <= 0) {
          this.kickCooldown = 0.15;
          ball.vx = dir * 85;
          ball.vy = -Math.abs(ball.vy) * 0.35 - 35;
          ball.lastKickedBy = 'player';
          this.soundManager.play('bounce');
        }
      }
    }

    // --- B. HEAD COLLISION (NEVER self-damages on headers) ---
    const distHead = Math.hypot(ball.x - player.headHitbox.x, ball.y - player.headHitbox.y);
    if (distHead < ball.radius + player.headHitbox.radius) {
      const isRivalSuper = ball.isSuper && ball.lastKickedBy === 'rival';
      const isViolentRivalShot = ball.lastKickedBy === 'rival' && ball.vx < -550;

      if (isRivalSuper) {
        // RIVAL ULTI BLAST HITS PLAYER!
        this.applyDamage(player, 35, ragdollSystem, -380, -420, true);
        this.particleSystem.spawnSparks(ball.x, ball.y, 45, '#ff3700');
        this.soundManager.play('superExplode');
        ball.isSuper = false;
        ball.vx = Math.abs(ball.vx) * 0.35 + 80;
        ball.vy = -Math.abs(ball.vy) * 0.5 - 120;
      } else if (isViolentRivalShot) {
        // FAST RIVAL SHOT DEFLECTED BY FOREHEAD — REWARDING SOCCER BLOCK, NO DAMAGE, NO STUN!
        ball.vx = Math.abs(ball.vx) * 0.6 + 120;
        ball.vy = -Math.abs(ball.vy) * 0.5 - 140;
        ball.lastKickedBy = 'player';
        this.particleSystem.spawnSparks(ball.x, ball.y, 22, '#ffd700');
        this.soundManager.play('headImpact');
        powerSystem?.addPower(8);
        this.addFloatingText('🛡️ ¡CABEZAZO DEFENSIVO!', player.x, player.y - 85, '#ffd700', 18);
      } else {
        // PURE SOCCER HEADER
        const powerMult = (player.character?.stats?.power || 1.0) * (player.activePowerMultiplier || 1.0);
        const dir = player.direction;

        if (curAnim === 'smash_header') {
          if (this.kickCooldown <= 0) {
            this.kickCooldown = 0.22;
            ball.kick(dir * (880 + Math.random() * 60) * powerMult, 360 * powerMult, false, 'player', 'smash');
            powerSystem?.addPower(20);
            this.particleSystem.spawnTurfSpray(ball.x, groundY, dir, 18);
            this.particleSystem.spawnKickImpact(ball.x, ball.y, dir, '#ffd700', 26);
            this.soundManager.play('headImpact');
            this.triggerShake(12);
            this.triggerHitStop(0.045);
            this.addFloatingText('💥 ¡CABEZAZO DEMOLEDOR!', player.x, player.y - 95, '#ffd700', 22);
          }
        } else if (curAnim === 'diving_header') {
          if (this.kickCooldown <= 0) {
            this.kickCooldown = 0.22;
            ball.kick(dir * (1040 + Math.random() * 60) * powerMult, -170 * powerMult, false, 'player', 'palomita');
            powerSystem?.addPower(20);
            this.particleSystem.spawnSonicBoom(ball.x, ball.y, dir, '#00ffcc');
            this.particleSystem.spawnKickImpact(ball.x, ball.y, dir, '#00ffcc', 24);
            this.soundManager.play('headImpact');
            this.triggerShake(11);
            this.triggerHitStop(0.04);
            this.addFloatingText('⚡ ¡PALOMITA AGRESIVA!', player.x, player.y - 95, '#00ffcc', 22);
          }
        } else if (isJumping) {
          // ACTIVE JUMP HEADER (W pressed in air)
          if (this.kickCooldown <= 0) {
            this.kickCooldown = 0.20;
            ball.kick(
              dir * (680 + Math.random() * 80) * powerMult,
              -Math.abs(ball.vy) * 0.75 - 240,
              false,
              'player',
              'header'
            );
            powerSystem?.addPower(16);
            this.particleSystem.spawnKickImpact(ball.x, ball.y, dir, '#ffd700', 20);
            this.soundManager.play('headImpact');
            this.triggerShake(8);
          }
        } else if (isMoving) {
          // RUNNING HEADER (Running forward)
          if (this.kickCooldown <= 0) {
            this.kickCooldown = 0.15;
            ball.kick(
              dir * 420 * powerMult,
              -Math.abs(ball.vy) * 0.6 - 160,
              false,
              'player'
            );
            powerSystem?.addPower(8);
            this.particleSystem.spawnSparks(ball.x, ball.y, 10, '#ffd700');
            this.soundManager.play('headImpact');
          }
        } else {
          // STANDING STILL (Passive ball drop on head)
          if (this.kickCooldown <= 0) {
            this.kickCooldown = 0.16;
            ball.vx = dir * 135;
            ball.vy = -Math.abs(ball.vy) * 0.55 - 90;
            ball.lastKickedBy = 'player';
            this.soundManager.play('bounce');
            this.particleSystem.spawnSparks(ball.x, ball.y, 6, '#ffd700');
          }
        }
      }
    }

    // --- C. TORSO / BODY TRAP COLLISION ---
    const distTorso = Math.hypot(ball.x - player.torsoHitbox.x, ball.y - player.torsoHitbox.y);
    if (distTorso < ball.radius + player.torsoHitbox.radius && distFoot >= ball.radius + player.kickHitbox.radius && distHead >= ball.radius + player.headHitbox.radius) {
      if (this.kickCooldown <= 0) {
        this.kickCooldown = 0.16;
        ball.vx = player.direction * (isMoving ? 190 : 80);
        ball.vy = -Math.abs(ball.vy) * 0.35 - 50;
        ball.lastKickedBy = 'player';
        this.soundManager.play('bounce');
      }
    }

    // 3. Player vs Rival Interactions (Tackles & Super Shot Hits)
    if (rivalBot && rivalBot.enabled) {
      // Player kicks rival directly in close combat
      const distFootRival = Math.hypot(player.kickHitbox.x - rivalBot.x, player.kickHitbox.y - (rivalBot.y - 25));
      const isPlayerKicking = ['kick', 'rocket_kick', 'bicycle_kick', 'diving_header', 'scorpion_kick', 'smash_header'].includes(player.animController.currentAnim);
      if (isPlayerKicking && distFootRival < 60 && !rivalBot.isStunned) {
        rivalBot.takeDamage(15, 220, -160, false); // Light chip damage & pushback, NO STUN!
        this.addFloatingText('💥 ¡PATADA!', rivalBot.x, rivalBot.y - 85, '#00ffcc', 18);
        this.onRivalDamageCallbacks.forEach(fn => fn(rivalBot.hp));
      }

      // Player Dragon Super Shot ball impacts rival
      if (ball.isSuper && ball.lastKickedBy === 'player') {
        const distBallRival = Math.hypot(ball.x - rivalBot.x, ball.y - (rivalBot.y - 65));
        if (distBallRival < ball.radius + 45) {
          rivalBot.takeDamage(40, 420, -480, true); // True super shot impact!
          this.soundManager.play('superExplode');
          this.particleSystem.spawnSparks(rivalBot.x, rivalBot.y - 60, 45, '#ff3700');
          this.addFloatingText('🔥 ¡SUPER IMPACTO! 🔥', rivalBot.x, rivalBot.y - 95, '#ff3700', 24);
          this.onRivalDamageCallbacks.forEach(fn => fn(rivalBot.hp));
          ball.isSuper = false;
          ball.vx = 420; // Deflects towards rival goal
        }
      }
    }

    // Post, Crossbar & Top Corner joint collision event hook
    if (!ball.onCrossbarHit) {
      ball.onCrossbarHit = (cx, barY, speed, hitType = 'crossbar', isRight = false) => {
        this.soundManager.play('postClang');
        this.particleSystem.spawnPostHit(cx, barY);
        this.triggerShake(speed > 450 ? 12 : 8);

        let bannerText = '💥 ¡TRAVESAÑO!';
        let bannerColor = '#ffd700';

        if (hitType === 'corner') {
          bannerText = '📐 ¡A LA ESCUADRA!';
          bannerColor = '#00ffcc';
          this.triggerHitStop(0.045);
        } else if (hitType === 'post') {
          bannerText = '💥 ¡POSTE!';
          bannerColor = '#ff9900';
        }

        this.addFloatingText(bannerText, cx, barY - 35, bannerColor, 22);
        this.onPostHitCallbacks.forEach(fn => fn(isRight, cx, barY, speed, hitType));
      };
    }

    // Right Goal: Player scores! (Front line at stageWidth - 78)
    const rightGoalFrontX = stageWidth - 78;
    const goalH = 210;

    if (ball.x >= rightGoalFrontX && ball.y > groundY - goalH) {
      this.triggerPlayerGoal(stageWidth, groundY, ball, powerSystem, rivalBot);
    }

    // Left Goal: Rival scores! (Front line at 78)
    const leftGoalFrontX = 78;
    if (ball.x <= leftGoalFrontX && ball.y > groundY - goalH) {
      this.triggerRivalGoal(stageWidth, groundY, ball, rivalBot);
    }
  }

  triggerPlayerGoal(stageWidth, groundY, ball, powerSystem, rivalBot) {
    if (this.goalCooldown > 0) return;
    this.goalCooldown = 2.5;
    this.playerGoals++;

    powerSystem?.addPower(35);
    this.soundManager.play('goalWhistle');
    this.soundManager.play('crowdCheer');
    this.particleSystem.spawnSparks(stageWidth - 55, groundY - 90, 45, '#00ffcc');
    this.particleSystem.spawnSparks(stageWidth - 55, groundY - 140, 45, '#ffcc00');
    this.particleSystem.spawnConfetti(stageWidth - 70, groundY - 140, 48);

    if (rivalBot) {
      rivalBot.animController.play('stun');
    }

    // Soft dampening inside the net
    ball.vx = -Math.abs(ball.vx) * 0.35 - 75;
    this.onGoalCallbacks.forEach(fn => fn(this.playerGoals, 'player', ball));

    // Reset ball to center after brief celebration
    setTimeout(() => {
      ball.x = stageWidth * 0.5;
      ball.y = groundY - 180;
      ball.vx = 0;
      ball.vy = -180;
      ball.isSuper = false;
      ball.lastKickedBy = null;
    }, 1200);
  }

  triggerRivalGoal(stageWidth, groundY, ball, rivalBot) {
    if (this.goalCooldown > 0) return;
    this.goalCooldown = 2.5;
    this.rivalGoals++;

    if (rivalBot) rivalBot.power = Math.min(100, rivalBot.power + 35);
    this.soundManager.play('goalWhistle');
    this.soundManager.play('crowdCheer');
    this.particleSystem.spawnSparks(55, groundY - 90, 45, '#ff3700');
    this.particleSystem.spawnSparks(55, groundY - 140, 45, '#ff9900');
    this.particleSystem.spawnConfetti(70, groundY - 140, 48);

    ball.vx = Math.abs(ball.vx) * 0.35 + 75;
    this.onRivalGoalCallbacks.forEach(fn => fn(this.rivalGoals, 'rival', ball));

    // Reset ball to center
    setTimeout(() => {
      ball.x = stageWidth * 0.5;
      ball.y = groundY - 180;
      ball.vx = 0;
      ball.vy = -180;
      ball.isSuper = false;
      ball.lastKickedBy = null;
    }, 1200);
  }

  renderFloatingTexts(ctx) {
    ctx.save();
    for (const ft of this.floatingTexts) {
      ctx.globalAlpha = Math.max(0, Math.min(1, ft.life));
      ctx.font = `900 ${ft.size}px "Outfit", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = ft.color;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.strokeText(ft.text, ft.x, ft.y);
      ctx.fillText(ft.text, ft.x, ft.y);
    }
    ctx.restore();
  }
}
