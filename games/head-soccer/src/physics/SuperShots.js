/**
 * Special Abilities & Projectiles Engine for Head Soccer.
 * Character abilities can be fired from ANYWHERE on the pitch!
 * They create active field entities (laser beams, blizzard waves, Excalibur sword slashes,
 * lightning strikes, sand cyclones, black holes, shurikens, and dragon fireballs)
 * that physically interact with both the ball and players.
 */
export class SuperShots {
  /**
   * @param {import('./ParticleSystem.js').ParticleSystem} particleSystem
   * @param {import('../audio/SoundManager.js').SoundManager} soundManager
   * @param {{shake: (n:number)=>void, flash: (c:string)=>void}} cameraFx
   */
  constructor(particleSystem, soundManager, cameraFx) {
    this.particleSystem = particleSystem;
    this.soundManager = soundManager;
    this.cameraFx = cameraFx;
    this.activeAbilities = [];
  }

  reset() {
    this.activeAbilities.length = 0;
  }

  /**
   * Activates the signature ability of `character` in direction `dir` (1 = right, -1 = left).
   * Works from anywhere in the arena!
   */
  launch(ball, character, dir, owner, targets = null) {
    const type = character?.super?.type || 'fire';
    const colors = character?.super?.colors || ['#ff3700', '#ffd000'];
    const resolvedTargets = targets || { player: window.player, rivalBot: window.rivalBot };
    const caster = owner === 'player' ? resolvedTargets.player : resolvedTargets.rivalBot;
    const opponent = owner === 'player' ? resolvedTargets.rivalBot : resolvedTargets.player;

    this.soundManager.play('superPower');
    this.cameraFx?.shake(7);

    const distBall = caster ? Math.hypot(ball.x - caster.x, ball.y - (caster.y - 45)) : 999;
    const hasBall = distBall < 130;

    switch (type) {
      // 1. Cyborg-01: Colossal Screen-Wide Plasma Laser Beam
      case 'laser': {
        this.soundManager.play('laser');
        this.cameraFx?.shake(10);
        const newAbility = {
          type: 'laser',
          owner,
          x: caster ? caster.x : (dir > 0 ? 100 : 900),
          y: caster ? caster.y - 48 : ball.y,
          dir,
          life: 0.65,
          maxLife: 0.65,
          hasSuperchargedBall: false,
          hasHitOpponent: false,
          isReflected: false,
          colors: ['#00f0ff', '#ffffff', '#ff0055']
        };

        // Opción 3: Si ya hay un poder activo del rival en el campo -> ¡CHOQUE DE PODERES INSTANTÁNEO!
        const opposingAbility = this.activeAbilities.find(ab => ab.owner !== owner);
        if (opposingAbility) {
          this.triggerBeamClash(1200, 520, ball, resolvedTargets.player, resolvedTargets.rivalBot, null, newAbility, opposingAbility);
          return;
        }

        this.activeAbilities.push(newAbility);
        break;
      }

      // 2. Dr. Frost: Traveling Glacial Blizzard Wave
      case 'frost': {
        this.soundManager.play('freeze');
        this.activeAbilities.push({
          type: 'frost',
          owner,
          x: caster ? caster.x + dir * 35 : (dir > 0 ? 120 : 880),
          y: caster ? caster.y - 35 : ball.y,
          vx: dir * 720,
          radius: 48,
          life: 1.8,
          colors: ['#00ffff', '#e0ffff', '#0088ff']
        });
        break;
      }

      // 3. Sir Arthur: Holy Excalibur Crescent Blade Wave
      case 'paladin': {
        this.soundManager.play('chargedBlast');
        this.cameraFx?.shake(8);
        this.activeAbilities.push({
          type: 'paladin',
          owner,
          x: caster ? caster.x + dir * 40 : (dir > 0 ? 120 : 880),
          y: caster ? caster.y - 45 : ball.y,
          vx: dir * 760,
          radius: 56,
          life: 1.6,
          colors: ['#ffd700', '#ffffff', '#ffaa00']
        });
        break;
      }

      // 4. Björn: Divine Thunderclap & Sky Lightning Strike
      case 'thunder': {
        this.soundManager.play('superExplode');
        this.cameraFx?.flash('#ffffff');
        this.cameraFx?.shake(12);
        const strikeX = hasBall ? ball.x : (opponent ? opponent.x : (caster.x + dir * 320));
        this.activeAbilities.push({
          type: 'thunder',
          owner,
          x: strikeX,
          life: 0.55,
          maxLife: 0.55,
          colors: ['#7df9ff', '#ffffff', '#ffe600']
        });
        break;
      }

      // 5. Anubis: Roaming Desert Sandstorm Cyclone
      case 'anubis': {
        this.soundManager.play('superPower');
        this.activeAbilities.push({
          type: 'anubis',
          owner,
          x: caster ? caster.x + dir * 60 : (dir > 0 ? 150 : 850),
          y: caster ? caster.y - 60 : ball.y,
          vx: dir * 420,
          radius: 68,
          life: 2.8,
          colors: ['#ffd700', '#c8963e', '#1a1508']
        });
        break;
      }

      // 6. Zog: Gravitational Black Hole Singularity
      case 'alien': {
        this.soundManager.play('laser');
        const holeX = dir > 0 ? (window.innerWidth ? window.innerWidth * 0.72 : 720) : 280;
        this.activeAbilities.push({
          type: 'alien',
          owner,
          x: holeX,
          y: caster ? caster.y - 120 : 380,
          life: 1.6,
          maxLife: 1.6,
          detonated: false,
          dir,
          colors: ['#a855f7', '#ec4899', '#06b6d4']
        });
        break;
      }

      // 7. Kage: Multi-Shadow Shuriken Barrage
      case 'shadow': {
        this.soundManager.play('kick');
        [-160, 0, 160].forEach((vyOffset) => {
          this.activeAbilities.push({
            type: 'shuriken',
            owner,
            x: caster ? caster.x + dir * 40 : (dir > 0 ? 120 : 880),
            y: caster ? caster.y - 45 : ball.y,
            vx: dir * 840,
            vy: vyOffset,
            rotation: 0,
            radius: 26,
            life: 1.4,
            colors: ['#7c4dff', '#1a1a2e', '#ff007f']
          });
        });
        break;
      }

      // 8. El Toro: Flying Lucha Body Splash / Volcanic Boulder
      case 'lucha': {
        if (hasBall) {
          ball.kick(dir * 880, -320, true, owner);
          ball.superType = 'lucha';
          ball.superColors = colors;
          this.soundManager.play('superExplode');
        } else if (caster) {
          this.soundManager.play('chargedBlast');
          caster.isDashing = true;
          caster.dashTimer = 0.45;
          caster.dashVx = dir * 880;
          caster.vy = -380;
          caster.isGrounded = false;
          this.activeAbilities.push({
            type: 'lucha_shockwave',
            owner,
            caster,
            life: 0.6,
            colors: ['#00c853', '#ffffff', '#ff1744']
          });
        }
        break;
      }

      // 9. Kenta: Dragon Fireball / Meteor Kick
      case 'fire': {
        if (hasBall) {
          ball.kick(dir * 980, -220, true, owner);
          ball.superType = 'fire';
          ball.superColors = colors;
          this.soundManager.play('superExplode');
        } else {
          this.soundManager.play('superExplode');
          this.activeAbilities.push({
            type: 'fireball',
            owner,
            x: caster ? caster.x + dir * 40 : (dir > 0 ? 120 : 880),
            y: caster ? caster.y - 45 : ball.y,
            vx: dir * 920,
            radius: 36,
            life: 1.5,
            colors: ['#ff3700', '#ffd000']
          });
        }
        break;
      }

      // 10. Joãozinho: Samba Tornado / Banana Curve Shot
      case 'banana': {
        if (hasBall) {
          ball.kick(dir * 880, -520, true, owner);
          ball.superType = 'banana';
          ball.superColors = colors;
          ball.setEffect({
            duration: 1.2,
            update(b, t) {
              b.gravityScale = t < 0.35 ? -0.35 : 2.8;
            }
          });
        } else {
          this.activeAbilities.push({
            type: 'tornado',
            owner,
            x: caster ? caster.x + dir * 40 : (dir > 0 ? 120 : 880),
            y: caster ? caster.y - 50 : ball.y,
            vx: dir * 680,
            radius: 48,
            life: 1.8,
            colors: ['#ffeb3b', '#00e676']
          });
        }
        break;
      }

      // 11. Phoenix: Wings of Fire Soaring Parabolic Divebomb
      case 'phoenix': {
        this.soundManager.play('superExplode');
        this.cameraFx?.flash('#ff9100');
        this.cameraFx?.shake(12);
        if (hasBall) {
          ball.kick(dir * 1150, -420, true, owner);
          ball.superType = 'phoenix';
          ball.superColors = ['#ff9100', '#ffd700', '#ff1744'];
          ball.setEffect({
            duration: 1.3,
            update(b, t) {
              // Soaring phoenix arc: lifts up then dives fiercely into the goal
              b.gravityScale = t < 0.4 ? -0.8 : 3.2;
              b.vx += dir * 18;
            }
          });
        }
        this.activeAbilities.push({
          type: 'phoenix',
          owner,
          x: caster ? caster.x + dir * 50 : (dir > 0 ? 100 : 900),
          y: caster ? caster.y - 65 : ball.y,
          vx: dir * 780,
          startY: caster ? caster.y - 65 : ball.y,
          wingPhase: 0,
          radius: 54,
          life: 1.8,
          colors: ['#ff9100', '#ffd700', '#ff1744']
        });
        break;
      }

      // 12. Poseidon: Tsunami Hydro-Cannon Sweeping Pitch Wave
      case 'poseidon': {
        this.soundManager.play('superPower');
        this.cameraFx?.shake(14);
        if (hasBall) {
          ball.kick(dir * 1180, -260, true, owner);
          ball.superType = 'poseidon';
          ball.superColors = ['#00d4ff', '#0044ff', '#e0ffff'];
        }
        this.activeAbilities.push({
          type: 'tsunami',
          owner,
          x: caster ? caster.x + dir * 45 : (dir > 0 ? 100 : 900),
          y: (targets?.player?.y || 500) - 45,
          vx: dir * 650,
          radius: 75,
          life: 2.2,
          colors: ['#00d4ff', '#0044ff', '#ffffff']
        });
        break;
      }

      // 13. Titan: Ground Fissure & Seismic Earth Spikes
      case 'titan': {
        this.soundManager.play('superExplode');
        this.soundManager.play('bounce');
        this.cameraFx?.shake(16);
        this.cameraFx?.flash('#ffd700');
        const startX = caster ? caster.x + dir * 40 : (dir > 0 ? 150 : 850);
        const ground = caster ? caster.y : 500;
        this.activeAbilities.push({
          type: 'earth_spikes',
          owner,
          dir,
          startX,
          groundY: ground,
          progress: 0,
          maxDist: 650,
          life: 1.2,
          spikes: [],
          colors: ['#a8896c', '#ff5722', '#3e2723']
        });
        if (hasBall) {
          ball.kick(dir * 1050, -580, true, owner);
          ball.superType = 'titan';
          ball.superColors = ['#a8896c', '#ff5722', '#ffd700'];
        }
        break;
      }

      // 14. Chrono: Temporal Time Warp Dilatation & Hologram Strike
      case 'chrono': {
        this.soundManager.play('laser');
        this.soundManager.play('chargedBlast');
        this.cameraFx?.flash('#00ffcc');
        this.cameraFx?.shake(10);
        if (opponent) {
          // Slow down opponent for 2.2s
          opponent.speedMultiplier = 0.35;
          setTimeout(() => { if (opponent) opponent.speedMultiplier = 1.0; }, 2200);
        }
        if (caster) {
          // Boost caster sprint speed
          caster.speedMultiplier = 1.4;
          setTimeout(() => { if (caster) caster.speedMultiplier = 1.0; }, 2200);
        }
        if (hasBall) {
          ball.kick(dir * 1280, -220, true, owner);
          ball.superType = 'chrono';
          ball.superColors = ['#00ffcc', '#7c4dff', '#ffffff'];
          ball.setEffect({
            duration: 1.4,
            update(b, t) {
              // Zig-zag temporal jumps
              if (Math.random() < 0.25) {
                b.y += (Math.random() - 0.5) * 40;
              }
            }
          });
        }
        this.activeAbilities.push({
          type: 'time_warp',
          owner,
          x: caster ? caster.x + dir * 80 : 500,
          y: caster ? caster.y - 70 : 380,
          radius: 90,
          rotation: 0,
          life: 2.0,
          colors: ['#00ffcc', '#7c4dff', '#ffffff']
        });
        break;
      }
    }
  }

  /**
   * Updates all active field projectiles, waves, and singularities.
   */
  update(dt, stageWidth, groundY, ball, player, rivalBot, collisionSystem) {
    for (let i = this.activeAbilities.length - 1; i >= 0; i--) {
      const a = this.activeAbilities[i];
      a.life -= dt;

      const opponent = a.owner === 'player' ? rivalBot : player;
      const dir = a.dir || (a.vx ? Math.sign(a.vx) : 1);

      switch (a.type) {
        // --- LASER BEAM ---
        case 'laser': {
          // Particle sparks along beam
          this.particleSystem.spawnSparks(a.x + dir * Math.random() * (stageWidth * 0.8), a.y + (Math.random() - 0.5) * 20, 2, a.isReflected ? '#ffd700' : '#00f0ff');

          // 1. BEAM CLASH CHECK (Opción 3: choque de poderes con otra habilidad activa opuesta)
          for (let j = this.activeAbilities.length - 1; j >= 0; j--) {
            if (j === i) continue;
            const other = this.activeAbilities[j];
            if (other && other.owner !== a.owner) {
              const clashDist = Math.abs(a.x - other.x);
              const clashY = Math.abs(a.y - (other.y || groundY - 100));
              if (clashDist < stageWidth && clashY < 120) {
                this.triggerBeamClash(stageWidth, groundY, ball, player, rivalBot, collisionSystem, a, other);
                return;
              }
            }
          }

          // 2. Check Ball intersection (Only supercharge once so it never gets stuck or dragged!)
          const inRayX = (dir > 0 && ball.x >= a.x - 20) || (dir < 0 && ball.x <= a.x + 20);
          const inRayY = Math.abs(ball.y - a.y) < 55;
          if (!a.hasSuperchargedBall && inRayX && inRayY) {
            a.hasSuperchargedBall = true;
            ball.kick(dir * 1480, -22, true, a.owner);
            ball.superType = a.isReflected ? 'laser_reflected' : 'laser';
            ball.superColors = a.colors;
            this.soundManager.play('superExplode');
            this.soundManager.play('laser');
            this.cameraFx?.shake(12);
            this.particleSystem.spawnSonicBoom(ball.x, ball.y, dir, a.isReflected ? '#ffd700' : '#00f0ff');
            this.particleSystem.spawnSparks(ball.x, ball.y, 35, a.isReflected ? '#ffd700' : '#00f0ff');
            collisionSystem?.addFloatingText(a.isReflected ? '🪞⚡ ¡LÁSER REFLEJADO! ⚡' : '⚡ ¡SUPERCARGA LÁSER! 🤖', ball.x, ball.y - 70, a.isReflected ? '#ffd700' : '#00f0ff', 22);
          }

          // 3. Check Opponent intersection (Damage + Stun largo 2.6s + Balón rebota y sale volando)
          if (opponent && !a.hasHitOpponent) {
            const oppInX = (dir > 0 && opponent.x > a.x) || (dir < 0 && opponent.x < a.x);
            const oppInY = Math.abs((opponent.y - 45) - a.y) < 60;
            const distBallOpp = Math.hypot(ball.x - opponent.x, ball.y - (opponent.y - 45));

            if (oppInX && oppInY && (distBallOpp < 90 || a.life < 0.40)) {
              a.hasHitOpponent = true;
              a.life = Math.min(a.life, 0.08); // Beam finishes and dissipates

              const stunDuration = 2.6; // Stun largo como pidió el usuario!
              const dmg = a.isReflected ? 38 : 35;
              if (opponent.takeDamage) {
                opponent.takeDamage(dmg, dir * 420, -380, true, stunDuration);
              } else if (collisionSystem) {
                collisionSystem.applyDamage(player, dmg, null, dir * 420, -380, true, stunDuration);
              }

              // BALL COLLISION & REBOUND:
              // "choque con el rival, le haga daño y salga volando la pelota"
              ball.isSuper = false;
              ball.superType = null;
              ball.vx = -dir * (380 + Math.random() * 120); // Rebounds backwards
              ball.vy = -720 - Math.random() * 140; // Launches high into the air!
              ball.spin = -dir * 18;

              this.soundManager.play('superExplode');
              this.soundManager.play('knockout');
              this.soundManager.playSubBassKick();
              this.cameraFx?.shake(18);
              this.cameraFx?.flash('#00f0ff');
              collisionSystem?.triggerHitStop(0.08);
              this.particleSystem.spawnSonicBoom(opponent.x, opponent.y - 45, -dir, '#00f0ff');
              this.particleSystem.spawnSparks(ball.x, ball.y, 45, '#00ffff');
              this.particleSystem.spawnTurfSpray(opponent.x, groundY, -dir, 20);

              collisionSystem?.addFloatingText(`💥 ¡IMPACTO DEMOLEDOR! (-${dmg} HP)`, opponent.x, opponent.y - 95, '#00f0ff', 24);
              collisionSystem?.addFloatingText('😵 ¡STUN CRÍTICO! (2.6s)', opponent.x, opponent.y - 68, '#ffd700', 18);
            }
          }
          break;
        }

        // --- FROST BLIZZARD WAVE ---
        case 'frost': {
          a.x += a.vx * dt;
          this.particleSystem.spawnTrail(a.x, a.y, '#00ffff');

          // Freeze opponent on contact
          if (opponent && !a.hasHitOpponent) {
            const distOpp = Math.hypot(a.x - opponent.x, a.y - (opponent.y - 45));
            if (distOpp < a.radius + 35) {
              a.hasHitOpponent = true;
              opponent.freeze?.(2.0);
              this.soundManager.play('freeze');
              this.particleSystem.spawnSparks(opponent.x, opponent.y - 45, 30, '#00ffff');
              collisionSystem?.addFloatingText('🧊 ¡VENTISCA GLACIAL!', opponent.x, opponent.y - 95, '#00ffff', 22);
            }
          }

          // Supercharge ball on contact
          const distBall = Math.hypot(a.x - ball.x, a.y - ball.y);
          if (distBall < a.radius + ball.radius) {
            ball.kick(dir * 980, -240, true, a.owner);
            ball.superType = 'frost';
            ball.superColors = a.colors;
            this.soundManager.play('freeze');
            this.particleSystem.spawnSparks(ball.x, ball.y, 25, '#00ffff');
          }
          break;
        }

        // --- EXCALIBUR CRESCENT WAVE ---
        case 'paladin': {
          a.x += a.vx * dt;
          this.particleSystem.spawnTrail(a.x, a.y, '#ffd700');

          if (opponent && !a.hasHitOpponent) {
            const distOpp = Math.hypot(a.x - opponent.x, a.y - (opponent.y - 45));
            if (distOpp < a.radius + 35) {
              a.hasHitOpponent = true;
              opponent.takeDamage ? opponent.takeDamage(25, dir * 320, -360, false) : collisionSystem?.applyDamage(player, 25, null, dir * 320, -360, false);
              this.soundManager.play('punch');
              this.particleSystem.spawnSparks(opponent.x, opponent.y - 45, 25, '#ffd700');
              collisionSystem?.addFloatingText('⚔️ ¡ONDA EXCALIBUR!', opponent.x, opponent.y - 95, '#ffd700', 22);
            }
          }

          const distBall = Math.hypot(a.x - ball.x, a.y - ball.y);
          if (distBall < a.radius + ball.radius) {
            ball.kick(dir * 1050, -420, true, a.owner);
            ball.superType = 'paladin';
            ball.superColors = a.colors;
            this.soundManager.play('chargedBlast');
            this.particleSystem.spawnSparks(ball.x, ball.y, 30, '#ffd700');
          }
          break;
        }

        // --- THOR LIGHTNING STRIKE ---
        case 'thunder': {
          this.particleSystem.spawnSparks(a.x, groundY - Math.random() * 200, 3, '#7df9ff');

          // Strike ball
          if (Math.abs(ball.x - a.x) < 70 && !a.hasHitBall) {
            a.hasHitBall = true;
            ball.kick(dir * 1150, 780, true, a.owner);
            ball.superType = 'thunder';
            ball.superColors = a.colors;
            this.soundManager.play('superExplode');
            this.particleSystem.spawnSparks(ball.x, ball.y, 35, '#7df9ff');
            collisionSystem?.addFloatingText('⚡ ¡RAYO DE THOR!', ball.x, ball.y - 85, '#7df9ff', 24);
          }

          // Strike opponent
          if (opponent && Math.abs(opponent.x - a.x) < 65 && !a.hasHitOpponent) {
            a.hasHitOpponent = true;
            opponent.takeDamage ? opponent.takeDamage(28, dir * 260, -280, true) : collisionSystem?.applyDamage(player, 28, null, dir * 260, -280, true);
            this.particleSystem.spawnSparks(opponent.x, opponent.y - 50, 30, '#ffffff');
            collisionSystem?.addFloatingText('⚡ ¡ELECTROCUTADO!', opponent.x, opponent.y - 95, '#7df9ff', 22);
          }
          break;
        }

        // --- ANUBIS SANDSTORM CYCLONE ---
        case 'anubis': {
          a.x += a.vx * dt;
          this.particleSystem.spawnTrail(a.x, a.y, '#c8963e');

          // Suction pull on ball
          const distBall = Math.hypot(a.x - ball.x, a.y - ball.y);
          if (distBall < a.radius + 60) {
            ball.vx = a.vx * 1.25;
            ball.vy = Math.sin(a.life * 14) * 280;
            ball.isSuper = true;
            ball.superType = 'anubis';
            ball.superColors = a.colors;
          }

          // Pull opponent backward
          if (opponent) {
            const distOpp = Math.hypot(a.x - opponent.x, a.y - (opponent.y - 45));
            if (distOpp < a.radius + 60) {
              opponent.x += dir * 180 * dt;
              this.particleSystem.spawnSparks(opponent.x, opponent.y - 40, 1, '#c8963e');
            }
          }
          break;
        }

        // --- ALIEN BLACK HOLE SINGULARITY ---
        case 'alien': {
          this.particleSystem.spawnSparks(a.x, a.y, 2, '#a855f7');

          // Suction on ball
          const dxB = a.x - ball.x;
          const dyB = a.y - ball.y;
          const distB = Math.hypot(dxB, dyB);
          if (distB > 15) {
            ball.vx += (dxB / distB) * 720 * dt;
            ball.vy += (dyB / distB) * 720 * dt;
          }

          // Suction on opponent
          if (opponent) {
            const dxO = a.x - opponent.x;
            if (Math.abs(dxO) < 260) {
              opponent.x += Math.sign(dxO) * 160 * dt;
            }
          }

          // Final Cosmic Slingshot Detonation
          if (a.life <= 0.25 && !a.detonated) {
            a.detonated = true;
            this.soundManager.play('superExplode');
            this.cameraFx?.shake(11);
            this.cameraFx?.flash('#a855f7');
            this.particleSystem.spawnSparks(a.x, a.y, 45, '#a855f7');
            ball.kick(dir * 1350, 240, true, a.owner);
            ball.superType = 'alien';
            ball.superColors = a.colors;
            collisionSystem?.addFloatingText('🌌 ¡SINGULARIDAD CÓSMICA! 🛸', a.x, a.y - 85, '#a855f7', 24);
          }
          break;
        }

        // --- SHADOW SHURIKEN ---
        case 'shuriken': {
          a.x += a.vx * dt;
          a.y += a.vy * dt;
          a.rotation += dt * 22;

          // Bounce off ground
          if (a.y >= groundY - 15) {
            a.y = groundY - 15;
            a.vy = -Math.abs(a.vy) * 0.8;
          }

          // Hit ball
          const distB = Math.hypot(a.x - ball.x, a.y - ball.y);
          if (distB < a.radius + ball.radius) {
            ball.kick(dir * 920, -180, true, a.owner);
            ball.superType = 'shadow';
            ball.superColors = a.colors;
            this.soundManager.play('kick');
            this.particleSystem.spawnSparks(ball.x, ball.y, 16, '#7c4dff');
          }

          // Hit opponent
          if (opponent && !a.hasHitOpponent) {
            const distO = Math.hypot(a.x - opponent.x, a.y - (opponent.y - 45));
            if (distO < a.radius + 30) {
              a.hasHitOpponent = true;
              opponent.takeDamage ? opponent.takeDamage(18, dir * 260, -180, false) : collisionSystem?.applyDamage(player, 18, null, dir * 260, -180, false);
              this.soundManager.play('punch');
              this.particleSystem.spawnSparks(opponent.x, opponent.y - 40, 16, '#7c4dff');
            }
          }
          break;
        }

        // --- FIREBALL PROJECTILE ---
        case 'fireball': {
          a.x += a.vx * dt;
          this.particleSystem.spawnTrail(a.x, a.y, '#ff3700');

          const distB = Math.hypot(a.x - ball.x, a.y - ball.y);
          if (distB < a.radius + ball.radius) {
            ball.kick(dir * 1020, -220, true, a.owner);
            ball.superType = 'fire';
            ball.superColors = a.colors;
            this.soundManager.play('superExplode');
            this.particleSystem.spawnSparks(ball.x, ball.y, 35, '#ff3700');
            collisionSystem?.addFloatingText('🔥 ¡TIRO DRAGÓN! 🔥', ball.x, ball.y - 85, '#ff3700', 24);
            a.life = 0; // consumed on ball
          }

          if (opponent && !a.hasHitOpponent) {
            const distO = Math.hypot(a.x - opponent.x, a.y - (opponent.y - 45));
            if (distO < a.radius + 30) {
              a.hasHitOpponent = true;
              opponent.takeDamage ? opponent.takeDamage(26, dir * 280, -240, false) : collisionSystem?.applyDamage(player, 26, null, dir * 280, -240, false);
              this.soundManager.play('superExplode');
              this.particleSystem.spawnSparks(opponent.x, opponent.y - 45, 25, '#ff3700');
            }
          }
          break;
        }

        // --- SAMBA TORNADO ---
        case 'tornado': {
          a.x += a.vx * dt;
          this.particleSystem.spawnTrail(a.x, a.y, '#00e676');

          const distB = Math.hypot(a.x - ball.x, a.y - ball.y);
          if (distB < a.radius + ball.radius) {
            ball.kick(dir * 950, -480, true, a.owner);
            ball.superType = 'banana';
            ball.superColors = a.colors;
            this.soundManager.play('kick');
            this.particleSystem.spawnSparks(ball.x, ball.y, 25, '#ffeb3b');
          }
          break;
        }

        // --- PHOENIX WINGS OF FIRE ---
        case 'phoenix': {
          a.x += a.vx * dt;
          a.wingPhase = (a.wingPhase || 0) + dt * 12;
          a.y = a.startY + Math.sin(a.wingPhase) * 28;
          this.particleSystem.spawnSparks(a.x, a.y, 3, '#ffd700');
          this.particleSystem.spawnTrail(a.x, a.y, '#ff9100');

          const distB = Math.hypot(a.x - ball.x, a.y - ball.y);
          if (distB < a.radius + ball.radius && !a.hasHitBall) {
            a.hasHitBall = true;
            ball.kick(dir * 1220, -380, true, a.owner);
            ball.superType = 'phoenix';
            ball.superColors = a.colors;
            this.soundManager.play('superExplode');
            this.cameraFx?.shake(10);
            this.particleSystem.spawnSparks(ball.x, ball.y, 35, '#ffd700');
            collisionSystem?.addFloatingText('🔥 ¡VUELO DEL FÉNIX! 🪽', ball.x, ball.y - 85, '#ff9100', 24);
          }

          if (opponent && !a.hasHitOpponent) {
            const distO = Math.hypot(a.x - opponent.x, a.y - (opponent.y - 45));
            if (distO < a.radius + 35) {
              a.hasHitOpponent = true;
              opponent.takeDamage ? opponent.takeDamage(30, dir * 320, -340, true) : collisionSystem?.applyDamage(player, 30, null, dir * 320, -340, true);
              this.soundManager.play('superExplode');
              this.particleSystem.spawnSparks(opponent.x, opponent.y - 50, 30, '#ff1744');
              collisionSystem?.addFloatingText('🔥 ¡LLAMARADA FÉNIX!', opponent.x, opponent.y - 95, '#ff9100', 22);
            }
          }
          break;
        }

        // --- TSUNAMI HYDRO WAVE ---
        case 'tsunami': {
          a.x += a.vx * dt;
          this.particleSystem.spawnTrail(a.x, a.y, '#00d4ff');
          this.particleSystem.spawnSparks(a.x, a.y - 20, 2, '#ffffff');

          const distB = Math.hypot(a.x - ball.x, a.y - ball.y);
          if (distB < a.radius + ball.radius) {
            ball.vx = a.vx * 1.35;
            ball.vy = -180;
            ball.superType = 'poseidon';
            ball.superColors = a.colors;
            this.particleSystem.spawnSparks(ball.x, ball.y, 20, '#00d4ff');
          }

          if (opponent && !a.hasHitOpponent) {
            const distO = Math.hypot(a.x - opponent.x, a.y - (opponent.y - 45));
            if (distO < a.radius + 40) {
              a.hasHitOpponent = true;
              opponent.takeDamage ? opponent.takeDamage(26, dir * 420, -240, false) : collisionSystem?.applyDamage(player, 26, null, dir * 420, -240, false);
              this.soundManager.play('recover');
              this.particleSystem.spawnSparks(opponent.x, opponent.y - 40, 30, '#00d4ff');
              collisionSystem?.addFloatingText('🌊 ¡TSUNAMI MARINO!', opponent.x, opponent.y - 95, '#00d4ff', 22);
            }
          }
          break;
        }

        // --- TITAN SEISMIC EARTH SPIKES ---
        case 'earth_spikes': {
          a.progress += dt * 620;
          const currentSpikeCount = Math.floor(a.progress / 45);
          while (a.spikes.length < currentSpikeCount && a.spikes.length * 45 < a.maxDist) {
            const spikeIndex = a.spikes.length;
            const sx = a.startX + a.dir * spikeIndex * 45;
            a.spikes.push({
              x: sx,
              height: 40 + Math.random() * 45,
              width: 24,
              eruptTime: 0.25,
              hasHit: false
            });
            this.particleSystem.spawnDust(sx, a.groundY, 6);
          }

          // Check spikes against ball and opponent
          for (const spk of a.spikes) {
            if (!spk.hasHit) {
              if (Math.abs(ball.x - spk.x) < 32 && ball.y >= a.groundY - spk.height) {
                spk.hasHit = true;
                ball.kick(a.dir * 880, -680, true, a.owner);
                ball.superType = 'titan';
                ball.superColors = a.colors;
                this.soundManager.play('bounce');
                this.particleSystem.spawnSparks(ball.x, ball.y, 20, '#ff5722');
                collisionSystem?.addFloatingText('🪨 ¡IMPACTO SÍSMICO!', ball.x, ball.y - 80, '#ff5722', 20);
              }
              if (opponent && Math.abs(opponent.x - spk.x) < 32 && !a.hasHitOpponent) {
                a.hasHitOpponent = true;
                opponent.takeDamage ? opponent.takeDamage(32, a.dir * 240, -420, true) : collisionSystem?.applyDamage(player, 32, null, a.dir * 240, -420, true);
                this.soundManager.play('superExplode');
                this.cameraFx?.shake(12);
                this.particleSystem.spawnSparks(opponent.x, a.groundY - 30, 25, '#ff5722');
                collisionSystem?.addFloatingText('💥 ¡FISURA TERRESTRE!', opponent.x, opponent.y - 95, '#ff5722', 24);
              }
            }
          }
          break;
        }

        // --- CHRONO TIME WARP DILATATION ---
        case 'time_warp': {
          a.rotation += dt * 2.5;
          this.particleSystem.spawnSparks(a.x + (Math.random() - 0.5) * a.radius, a.y + (Math.random() - 0.5) * a.radius, 2, '#00ffcc');

          const distB = Math.hypot(a.x - ball.x, a.y - ball.y);
          if (distB < a.radius) {
            ball.vx += dir * 180 * dt;
          }
          break;
        }
      }

      if (a.life <= 0 || a.x < -100 || a.x > stageWidth + 100) {
        this.activeAbilities.splice(i, 1);
      }
    }
  }

  triggerBeamClash(stageWidth, groundY, ball, player, rivalBot, collisionSystem, a1, a2) {
    const clashX = (a1.x + a2.x) * 0.5 || stageWidth * 0.5;
    const clashY = groundY - 110;

    const idx1 = this.activeAbilities.indexOf(a1);
    if (idx1 !== -1) this.activeAbilities.splice(idx1, 1);
    const idx2 = this.activeAbilities.indexOf(a2);
    if (idx2 !== -1) this.activeAbilities.splice(idx2, 1);

    // Ball blasted skyward into the stratosphere!
    ball.x = clashX;
    ball.y = clashY;
    ball.vx = (Math.random() - 0.5) * 160;
    ball.vy = -980; // Launches vertically skyward!
    ball.spin = 24;
    ball.isSuper = false;
    ball.superType = null;

    if (player) {
      player.x = Math.max(130, player.x - 70 * (player.direction || 1));
      collisionSystem?.applyDamage(player, 15, null, -200, -180, true, 1.2);
    }
    if (rivalBot) {
      rivalBot.x = Math.min(stageWidth - 130, rivalBot.x - 70 * (rivalBot.direction || -1));
      rivalBot.takeDamage?.(15, 200, -180, true, 1.2);
    }

    this.soundManager.play('superExplode');
    this.soundManager.play('chargedBlast');
    this.soundManager.playSubBassKick();
    this.cameraFx?.shake(24);
    this.cameraFx?.flash('#ffffff');
    collisionSystem?.triggerHitStop(0.12);

    this.particleSystem.spawnSonicBoom(clashX, clashY, 1, '#ffd700');
    this.particleSystem.spawnSonicBoom(clashX, clashY, -1, '#00f0ff');
    this.particleSystem.spawnSparks(clashX, clashY, 60, '#ffd700');
    this.particleSystem.spawnSparks(clashX, clashY, 60, '#00f0ff');
    this.particleSystem.spawnTurfSpray(clashX, groundY, 1, 25);
    this.particleSystem.spawnTurfSpray(clashX, groundY, -1, 25);

    collisionSystem?.addFloatingText('💥⚔️ ¡CHOQUE DE PODERES! ⚔️💥', clashX, clashY - 60, '#ffd700', 28);
    collisionSystem?.addFloatingText('⚡ ¡ENERGÍA SOBRECARGADA! ⚡', clashX, clashY - 25, '#00ffff', 20);
  }

  /**
   * Renders all active special abilities onto the canvas with rich procedural aesthetics.
   */
  render(ctx, stageWidth, groundY) {
    for (const a of this.activeAbilities) {
      ctx.save();

      switch (a.type) {
        // Laser Beam: Huge linear glowing plasma beam with energetic corona
        case 'laser': {
          const alpha = Math.min(1, a.life / a.maxLife);
          ctx.globalAlpha = alpha;
          const beamLen = stageWidth + 100;
          const startX = a.dir > 0 ? a.x : a.x - beamLen;
          const isReflected = !!a.isReflected;

          // Outer plasma glow
          ctx.shadowColor = isReflected ? '#ffd700' : '#00f0ff';
          ctx.shadowBlur = 40;
          ctx.fillStyle = isReflected ? 'rgba(255, 215, 0, 0.45)' : 'rgba(0, 240, 255, 0.45)';
          ctx.fillRect(startX, a.y - 20, beamLen, 40);

          // Inner laser core
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 20;
          ctx.fillRect(startX, a.y - 7, beamLen, 14);

          // Digital laser scanlines
          ctx.strokeStyle = isReflected ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 0, 85, 0.7)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(startX, a.y - 12);
          ctx.lineTo(startX + beamLen, a.y - 12);
          ctx.moveTo(startX, a.y + 12);
          ctx.lineTo(startX + beamLen, a.y + 12);
          ctx.stroke();
          break;
        }

        // Blizzard Wave: Procedural crystalline frost stars & glacial shards
        case 'frost': {
          ctx.translate(a.x, a.y);
          ctx.shadowColor = '#00ffff';
          ctx.shadowBlur = 30;

          // Freezing mist aura
          const mistGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, a.radius);
          mistGrad.addColorStop(0, 'rgba(224, 255, 255, 0.85)');
          mistGrad.addColorStop(0.5, 'rgba(0, 255, 255, 0.45)');
          mistGrad.addColorStop(1, 'rgba(0, 136, 255, 0)');
          ctx.fillStyle = mistGrad;
          ctx.beginPath();
          ctx.arc(0, 0, a.radius, 0, Math.PI * 2);
          ctx.fill();

          // Crystalline 6-pointed frost star
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          for (let k = 0; k < 6; k++) {
            const angle = (k * Math.PI) / 3;
            const ox = Math.cos(angle) * (a.radius * 0.75);
            const oy = Math.sin(angle) * (a.radius * 0.75);
            ctx.moveTo(0, 0);
            ctx.lineTo(ox, oy);
            // Branchlets
            const bx1 = Math.cos(angle + 0.4) * (a.radius * 0.45);
            const by1 = Math.sin(angle + 0.4) * (a.radius * 0.45);
            ctx.moveTo(ox * 0.6, oy * 0.6);
            ctx.lineTo(bx1, by1);
          }
          ctx.stroke();

          // Glowing diamond core
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(0, -14);
          ctx.lineTo(14, 0);
          ctx.lineTo(0, 14);
          ctx.lineTo(-14, 0);
          ctx.closePath();
          ctx.fill();
          break;
        }

        // Paladin: Golden Excalibur Crescent Blade Wave
        case 'paladin': {
          ctx.translate(a.x, a.y);
          const dir = Math.sign(a.vx);
          ctx.shadowColor = '#ffd700';
          ctx.shadowBlur = 35;

          // Golden outer crescent
          ctx.strokeStyle = '#ffd700';
          ctx.lineWidth = 12;
          ctx.beginPath();
          ctx.arc(0, 0, a.radius, dir > 0 ? -Math.PI * 0.45 : Math.PI * 0.55, dir > 0 ? Math.PI * 0.45 : Math.PI * 1.45);
          ctx.stroke();

          // White holy light inner core
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.arc(0, 0, a.radius, dir > 0 ? -Math.PI * 0.45 : Math.PI * 0.55, dir > 0 ? Math.PI * 0.45 : Math.PI * 1.45);
          ctx.stroke();
          break;
        }

        // Thor: Vertical Divine Lightning Bolt
        case 'thunder': {
          const alpha = Math.min(1, a.life / a.maxLife);
          ctx.globalAlpha = alpha;
          ctx.shadowColor = '#7df9ff';
          ctx.shadowBlur = 35;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 7;

          ctx.beginPath();
          let cy = 0;
          let cx = a.x;
          ctx.moveTo(cx, cy);
          while (cy < groundY) {
            cy += 35 + Math.random() * 25;
            cx = a.x + (Math.random() - 0.5) * 50;
            ctx.lineTo(cx, cy);
          }
          ctx.stroke();

          // Ground impact flash ring
          ctx.fillStyle = 'rgba(125, 249, 255, 0.45)';
          ctx.beginPath();
          ctx.ellipse(a.x, groundY, 70, 16, 0, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        // Anubis: Procedural Golden Sandstorm Vortex
        case 'anubis': {
          ctx.translate(a.x, a.y);
          ctx.shadowColor = '#ffd700';
          ctx.shadowBlur = 24;

          // Multi-layer rotating sand spirals
          const time = performance.now() * 0.005;
          for (let s = 0; s < 4; s++) {
            const rot = time + (s * Math.PI) / 2;
            const rX = a.radius * (0.6 + s * 0.15);
            const rY = a.radius * 1.2;
            ctx.strokeStyle = s % 2 === 0 ? 'rgba(255, 215, 0, 0.65)' : 'rgba(200, 150, 62, 0.55)';
            ctx.lineWidth = 3 + s;
            ctx.beginPath();
            ctx.ellipse(0, 0, rX, rY, rot, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Glowing pyramid center
          ctx.fillStyle = '#ffd700';
          ctx.beginPath();
          ctx.moveTo(0, -22);
          ctx.lineTo(18, 16);
          ctx.lineTo(-18, 16);
          ctx.closePath();
          ctx.fill();
          break;
        }

        // Alien: Black Hole Cosmic Singularity
        case 'alien': {
          ctx.translate(a.x, a.y);
          const pulse = 1.0 + Math.sin((a.maxLife - a.life) * 14) * 0.22;
          ctx.scale(pulse, pulse);

          ctx.shadowColor = '#a855f7';
          ctx.shadowBlur = 40;

          // Glowing cosmic accretion ring
          const accGrad = ctx.createRadialGradient(0, 0, 20, 0, 0, 65);
          accGrad.addColorStop(0, '#0a0014');
          accGrad.addColorStop(0.4, 'rgba(168, 85, 247, 0.85)');
          accGrad.addColorStop(0.7, 'rgba(6, 182, 212, 0.65)');
          accGrad.addColorStop(1, 'rgba(236, 72, 153, 0)');
          ctx.fillStyle = accGrad;
          ctx.beginPath();
          ctx.arc(0, 0, 65, 0, Math.PI * 2);
          ctx.fill();

          // Pitch-black event horizon
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(0, 0, 28, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 2.5;
          ctx.stroke();
          break;
        }

        // Shadow Shuriken: 4-pointed metallic ninja star
        case 'shuriken': {
          ctx.translate(a.x, a.y);
          ctx.rotate(a.rotation);
          ctx.shadowColor = '#7c4dff';
          ctx.shadowBlur = 22;

          // 4-point metallic star
          ctx.fillStyle = '#1e1b2e';
          ctx.strokeStyle = '#7c4dff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let p = 0; p < 8; p++) {
            const rad = p % 2 === 0 ? a.radius : a.radius * 0.32;
            const ang = (p * Math.PI) / 4;
            const px = Math.cos(ang) * rad;
            const py = Math.sin(ang) * rad;
            p === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Central silver rivet
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, 0, 6, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        // Fireball: Procedural Dragon Fire Comet Core
        case 'fireball': {
          ctx.translate(a.x, a.y);
          ctx.shadowColor = '#ff3700';
          ctx.shadowBlur = 35;

          // Fiery tail
          const dir = Math.sign(a.vx) || 1;
          const tailGrad = ctx.createLinearGradient(0, 0, -dir * 60, 0);
          tailGrad.addColorStop(0, 'rgba(255, 200, 0, 0.9)');
          tailGrad.addColorStop(0.5, 'rgba(255, 55, 0, 0.7)');
          tailGrad.addColorStop(1, 'rgba(255, 0, 80, 0)');
          ctx.fillStyle = tailGrad;
          ctx.beginPath();
          ctx.moveTo(0, -a.radius * 0.7);
          ctx.lineTo(-dir * 65, 0);
          ctx.lineTo(0, a.radius * 0.7);
          ctx.closePath();
          ctx.fill();

          // Glowing fireball body
          const fireGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, a.radius);
          fireGrad.addColorStop(0, '#ffffff');
          fireGrad.addColorStop(0.35, '#ffd000');
          fireGrad.addColorStop(0.7, '#ff3700');
          fireGrad.addColorStop(1, 'rgba(255, 0, 0, 0)');
          ctx.fillStyle = fireGrad;
          ctx.beginPath();
          ctx.arc(0, 0, a.radius, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        // Tornado: Wind Cyclone Bands
        case 'tornado': {
          ctx.translate(a.x, a.y);
          ctx.shadowColor = '#00e676';
          ctx.shadowBlur = 24;
          const t = performance.now() * 0.008;

          for (let b = 0; b < 5; b++) {
            const by = -a.radius + (b * (a.radius * 2)) / 5;
            const bw = a.radius * (0.35 + (b / 5) * 0.75);
            ctx.strokeStyle = b % 2 === 0 ? 'rgba(0, 230, 118, 0.7)' : 'rgba(255, 235, 59, 0.8)';
            ctx.lineWidth = 3.5;
            ctx.beginPath();
            ctx.ellipse(Math.sin(t + b) * 8, by, bw, 8, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
          break;
        }

        // Phoenix: Majestic Soaring Firebird
        case 'phoenix': {
          ctx.translate(a.x, a.y);
          const dir = Math.sign(a.vx) || 1;
          ctx.scale(dir, 1);
          ctx.shadowColor = '#ff9100';
          ctx.shadowBlur = 38;

          const wingFlap = Math.sin(a.wingPhase || 0) * 26;

          // Glowing Wings of Fire
          const wingGrad = ctx.createLinearGradient(0, 0, 0, -45);
          wingGrad.addColorStop(0, '#ffd700');
          wingGrad.addColorStop(0.6, '#ff9100');
          wingGrad.addColorStop(1, '#ff1744');
          ctx.fillStyle = wingGrad;

          ctx.beginPath();
          // Upper Wing
          ctx.moveTo(10, -5);
          ctx.quadraticCurveTo(-15, -45 + wingFlap, -48, -25 + wingFlap);
          ctx.quadraticCurveTo(-25, -10, 0, 0);
          // Lower Wing
          ctx.quadraticCurveTo(-15, 35 - wingFlap, -45, 20 - wingFlap);
          ctx.quadraticCurveTo(-20, 10, 10, 5);
          ctx.closePath();
          ctx.fill();

          // Bird Head & Beak
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(25, -2);
          ctx.lineTo(44, 0);
          ctx.lineTo(25, 4);
          ctx.closePath();
          ctx.fill();

          // Blazing Eye
          ctx.fillStyle = '#ff1744';
          ctx.beginPath();
          ctx.arc(20, -2, 3, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        // Tsunami: Surging Hydro Crest Wave
        case 'tsunami': {
          ctx.translate(a.x, a.y);
          const dir = Math.sign(a.vx) || 1;
          ctx.scale(dir, 1);
          ctx.shadowColor = '#00d4ff';
          ctx.shadowBlur = 35;

          // Water body
          const waveGrad = ctx.createLinearGradient(0, -60, 0, 40);
          waveGrad.addColorStop(0, 'rgba(224, 255, 255, 0.95)');
          waveGrad.addColorStop(0.3, 'rgba(0, 212, 255, 0.85)');
          waveGrad.addColorStop(0.8, 'rgba(0, 68, 255, 0.85)');
          waveGrad.addColorStop(1, 'rgba(0, 30, 120, 0.9)');
          ctx.fillStyle = waveGrad;

          ctx.beginPath();
          ctx.moveTo(-a.radius, 40);
          ctx.quadraticCurveTo(0, -65, a.radius * 0.7, -45);
          // Curling wave crest
          ctx.quadraticCurveTo(a.radius * 1.1, -30, a.radius * 0.8, -10);
          ctx.quadraticCurveTo(a.radius * 0.5, -20, a.radius * 0.3, 0);
          ctx.lineTo(a.radius * 0.5, 40);
          ctx.closePath();
          ctx.fill();

          // Foam line
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(a.radius * 0.75, -25, 14, 0, Math.PI * 1.5);
          ctx.stroke();
          break;
        }

        // Titan Earth Spikes: Jagged Obsidian Stone Pillars
        case 'earth_spikes': {
          ctx.shadowColor = '#ff5722';
          ctx.shadowBlur = 24;

          for (const spk of a.spikes) {
            const h = spk.height;
            const w = spk.width;
            const sx = spk.x;
            const sy = a.groundY;

            // Stone polygon
            const rockGrad = ctx.createLinearGradient(sx, sy - h, sx, sy);
            rockGrad.addColorStop(0, '#ff9100');
            rockGrad.addColorStop(0.35, '#5d4037');
            rockGrad.addColorStop(1, '#21130d');
            ctx.fillStyle = rockGrad;

            ctx.beginPath();
            ctx.moveTo(sx - w * 0.5, sy);
            ctx.lineTo(sx - w * 0.2, sy - h * 0.7);
            ctx.lineTo(sx, sy - h); // sharp peak
            ctx.lineTo(sx + w * 0.3, sy - h * 0.6);
            ctx.lineTo(sx + w * 0.5, sy);
            ctx.closePath();
            ctx.fill();

            // Glowing magma vein
            ctx.strokeStyle = '#ff5722';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(sx, sy - h);
            ctx.lineTo(sx + (Math.random() - 0.5) * 6, sy);
            ctx.stroke();
          }
          break;
        }

        // Chrono Time Warp: Holographic Clock Dial
        case 'time_warp': {
          ctx.translate(a.x, a.y);
          ctx.shadowColor = '#00ffcc';
          ctx.shadowBlur = 32;

          // Outer time dilation aura
          ctx.strokeStyle = 'rgba(0, 255, 204, 0.75)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, a.radius, 0, Math.PI * 2);
          ctx.stroke();

          // Clock tick marks
          ctx.save();
          ctx.rotate(a.rotation);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.5;
          for (let m = 0; m < 12; m++) {
            ctx.rotate(Math.PI / 6);
            ctx.beginPath();
            ctx.moveTo(0, a.radius - 12);
            ctx.lineTo(0, a.radius - 4);
            ctx.stroke();
          }
          // Clock Hand
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, -a.radius * 0.65);
          ctx.stroke();
          ctx.restore();

          // Central glowing jewel
          ctx.fillStyle = '#00ffcc';
          ctx.beginPath();
          ctx.arc(0, 0, 9, 0, Math.PI * 2);
          ctx.fill();
          break;
        }
      }

      ctx.restore();
    }
  }
}
