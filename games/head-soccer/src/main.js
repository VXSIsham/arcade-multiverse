import { Skeleton } from './core/Skeleton.js?v=char_overhaul_v40';
import { AnimationController } from './animation/AnimationController.js?v=char_overhaul_v40';
import { Ball } from './physics/Ball.js?v=char_overhaul_v40';
import { CollisionSystem } from './physics/CollisionSystem.js?v=char_overhaul_v40';
import { ParticleSystem } from './physics/ParticleSystem.js?v=char_overhaul_v40';
import { RagdollSystem } from './physics/RagdollSystem.js?v=char_overhaul_v40';
import { PowerSystem } from './physics/PowerSystem.js?v=char_overhaul_v40';
import { PowerUpSystem } from './physics/PowerUpSystem.js?v=char_overhaul_v40';
import { RivalBot } from './physics/RivalBot.js?v=char_overhaul_v40';
import { SuperShots } from './physics/SuperShots.js?v=char_overhaul_v40';
import { CHARACTERS, getCharacter } from './data/Characters.js?v=char_overhaul_v40';
import { SoundManager } from './audio/SoundManager.js?v=char_overhaul_v40';
import { AssetLoader } from './renderer/AssetLoader.js?v=char_overhaul_v40';
import { GameRenderer } from './renderer/GameRenderer.js?v=char_overhaul_v40';
import { SpineExporter } from './export/SpineExporter.js?v=char_overhaul_v40';
import { InputManager } from './ui/InputManager.js?v=char_overhaul_v40';
import { UIManager } from './ui/UIManager.js?v=char_overhaul_v40';
import { TournamentManager, GAME_MODES } from './tournament/TournamentManager.js?v=char_overhaul_v40';

/**
 * Head Soccer 2D — Skeletal Rig, Ragdoll Stun, Multi-Character Roster & Super Power Engine
 * Fast-paced arcade physics, instant kicks, physical platformer jumps, and comical low-HP stun scaling.
 * Pure soccer headers with zero self-damage; damage only on hostile rival shots, ultis, and tackles.
 */
async function bootstrap() {
  const canvas = document.getElementById('gameCanvas');

  // 1. Core Systems
  const skeleton = new Skeleton();
  const animController = new AnimationController(skeleton);
  animController.headScaleMultiplier = 1.0; // Golden Chibi Ratio

  const soundManager = new SoundManager();
  const particleSystem = new ParticleSystem();
  const assetLoader = new AssetLoader();
  const spineExporter = new SpineExporter(skeleton);
  const ragdollSystem = new RagdollSystem(skeleton, soundManager, particleSystem);
  const powerSystem = new PowerSystem();
  const powerUpSystem = new PowerUpSystem(soundManager, particleSystem);

  // 2. Preload Game Sprites (including all roster heads)
  await assetLoader.load();

  // 3. Renderer, Ball & Rival
  const renderer = new GameRenderer(canvas, assetLoader);
  const superShots = new SuperShots(particleSystem, soundManager, renderer);
  const ball = new Ball(450, renderer.groundY - 21, 21);
  const collisionSystem = new CollisionSystem(soundManager, particleSystem);
  const rivalBot = new RivalBot(renderer.groundY, renderer.stageWidth, soundManager, particleSystem);

  // 4. Player State
  const player = {
    x: Math.floor(renderer.stageWidth * 0.28) || 280,
    y: renderer.groundY,
    vx: 0,
    vy: 0,
    isGrounded: true,
    canDoubleJump: true,
    isStunned: false,
    stunTimer: 0,
    isFrozen: false,
    freezeTimer: 0,
    hasShield: false,
    speedMultiplier: 1.0,
    giantHeadMultiplier: 1.0,
    isDashing: false,
    dashTimer: 0,
    dashVx: 0,
    dashCooldown: 0,
    dashGhosts: [],
    isSpinning: false,
    spinTime: 0,
    spinDuration: 0.36,
    flipAngle: 0,
    direction: 1, // 1 = right, -1 = left
    userHeadScale: 1.0,
    animController: animController,
    character: getCharacter('kenta'), // Defaults to Kenta 🇯🇵
    kickHitbox: { x: 0, y: 0, radius: 26 },
    headHitbox: { x: 0, y: 0, radius: 48 },
    foreheadHitbox: { x: 0, y: 0, radius: 30 },
    torsoHitbox: { x: 0, y: 0, radius: 24 },
    hp: 100,
    maxHp: 100,
    isKnockedOut: false,
    activePowerMultiplier: 1.0,
    isMoving: false
  };

  // Assign initial Rival character (El Toro 🇲🇽)
  rivalBot.setCharacter(getCharacter('luchador'));
  rivalBot.x = Math.floor(renderer.stageWidth * 0.72) || (renderer.stageWidth - 280);

  // Expose to window for live inspection / testing
  window.player = player;
  window.skeleton = skeleton;
  window.ball = ball;
  window.ragdollSystem = ragdollSystem;
  window.powerSystem = powerSystem;
  window.collisionSystem = collisionSystem;
  window.rivalBot = rivalBot;
  window.superShots = superShots;
  window.CHARACTERS = CHARACTERS;
  window.stadiumRenderer = renderer.stadiumRenderer;

  // 5. Input & UI Orchestration
  const inputManager = new InputManager(canvas, ball, soundManager);
  const uiManager = new UIManager(skeleton, animController, soundManager, spineExporter);

  // Match State
  let matchSeconds = 60;
  let isMatchOver = false;
  let slowMoTimer = 0;
  let hitStopTimer = 0;

  // Initial HUD sync
  uiManager.setPlayerInfo(player.character);
  uiManager.setRivalInfo(rivalBot.character);
  uiManager.setPlayerHp(player.hp, player.maxHp);
  uiManager.setRivalHp(rivalBot.hp, rivalBot.maxHp);
  uiManager.setScore(collisionSystem.playerGoals, collisionSystem.rivalGoals);
  uiManager.setPowerMeter(powerSystem.getRatio(), powerSystem.canUseSuper());
  uiManager.setMatchTimer(matchSeconds);

  // Character Switching Handlers
  const switchPlayerCharacter = (charId) => {
    const char = getCharacter(charId);
    if (!char) return;
    player.character = char;
    soundManager.play('recover');
    const color = (char.super?.colors && char.super.colors[0]) || '#00f0ff';
    particleSystem.spawnSparks(player.x, player.y - 50, 24, color);
    uiManager.setPlayerInfo(char);
    collisionSystem.addFloatingText(`¡${char.name} (${char.country})!`, player.x, player.y - 100, '#ffd700', 22);
  };

  const switchRivalCharacter = (charId) => {
    const char = getCharacter(charId);
    if (!char) return;
    rivalBot.setCharacter(char);
    soundManager.play('recover');
    const color = (char.super?.colors && char.super.colors[0]) || '#ff3700';
    particleSystem.spawnSparks(rivalBot.x, rivalBot.y - 50, 24, color);
    uiManager.setRivalInfo(char);
    collisionSystem.addFloatingText(`¡${char.name} (${char.country})!`, rivalBot.x, rivalBot.y - 100, '#ff3700', 22);
  };

  uiManager.onSelectPlayerCharacter(switchPlayerCharacter);
  uiManager.onSelectRivalCharacter(switchRivalCharacter);
  window.setPlayerCharacter = switchPlayerCharacter;
  window.setRivalCharacter = switchRivalCharacter;

  // Synchronize bone selections
  uiManager.onSelectBone(bone => {
    renderer.spineDebugger.setSelectedBone(bone);
  });
  renderer.spineDebugger.setSelectedBone(skeleton.head);

  // Hurt / Knockout trigger
  const triggerHurt = () => {
    if (ragdollSystem.isActive) return;
    soundManager.init();
    uiManager.setActiveAnim('hurt');
    collisionSystem.applyDamage(player, 35, ragdollSystem, -340 * player.direction, -420);
  };

  // Dash Action (Ground & Air Dash with velocity momentum and ghost trails)
  const triggerDash = () => {
    if (player.isStunned || player.isFrozen || ragdollSystem.isActive || isMatchOver) return;
    if (player.dashCooldown > 0) return;
    soundManager.init();

    const dir = player.direction || 1;
    player.dashCooldown = 0.45;
    player.isDashing = true;
    player.dashTimer = 0.16;

    if (!player.isGrounded) {
      // Sonic Air Dash!
      player.dashVx = dir * 960;
      player.vy = -60; // cancels falling momentum smoothly
      soundManager.play('laser');
      particleSystem.spawnAirRing(player.x, player.y - 30, '#ffd700');
      particleSystem.spawnSparks(player.x, player.y - 30, 16, '#ffd700');
      collisionSystem.addFloatingText('💨 ¡AIR DASH!', player.x, player.y - 75, '#ffd700', 20);
    } else {
      // Ground Dash!
      player.dashVx = dir * 1020;
      soundManager.play('kick');
      particleSystem.spawnAirRing(player.x, player.y - 15, '#00f0ff');
      particleSystem.spawnSparks(player.x - dir * 25, player.y - 15, 14, '#00f0ff');
      collisionSystem.addFloatingText('⚡ DASH!', player.x, player.y - 75, '#00f0ff', 18);
    }
  };

  // Snappy Action Trigger
  const triggerAction = (animName, data = null) => {
    soundManager.init();

    if (animName === 'hurt') {
      triggerHurt();
      return;
    }
    if (animName === 'dash') {
      triggerDash();
      return;
    }

    if (ragdollSystem.isActive || player.isStunned || player.isFrozen || isMatchOver) return;

    if (animName === 'charged_kick') {
      const chargeRatio = typeof data === 'number' ? data : 0.7;
      const powerMult = player.character?.stats?.power || 1.0;
      player.activePowerMultiplier = (1.4 + chargeRatio * 0.7) * powerMult;

      soundManager.playSubBassKick();
      soundManager.play('kick');
      soundManager.play('chargedBlast');
      renderer.punchZoom(1.15, player.x, player.y - 40);
      renderer.shake(12 + chargeRatio * 6);

      animController.play('kick');
      particleSystem.spawnSonicBoom(player.x, player.y - 20, player.direction, '#00f0ff');
      particleSystem.spawnFlameBurst(player.x, player.y - 20, 24, ['#00f0ff', '#ffffff', '#0077ff']);
      const pct = Math.round(50 + chargeRatio * 50);
      collisionSystem.addFloatingText(`⚡ ¡CAÑONAZO ${pct}%! ⚡`, player.x, player.y - 95, '#00f0ff', 24);
      uiManager.setActiveAnim('kick');
      return;
    }

    if (animName === 'jump') {
      if (player.isGrounded) {
        const jumpMult = player.character?.stats?.jump || 1.0;
        player.vy = -750 * jumpMult;
        player.isGrounded = false;
        player.canDoubleJump = true;
        animController.play('jump');
        animController.triggerJumpStretch(1.25);
        soundManager.play('headImpact');
        particleSystem.spawnDust(player.x, player.y, 8);
        uiManager.setActiveAnim('jump');
      } else if (player.canDoubleJump) {
        // High Athletic Double Jump with 360 Flip!
        const jumpMult = player.character?.stats?.jump || 1.0;
        // Realistic momentum blending: cancels fall and propels upward
        player.vy = -520 * jumpMult;
        player.canDoubleJump = false;
        player.isSpinning = true;
        player.spinTime = 0;
        player.spinDuration = 0.36;
        player.flipAngle = 0;
        soundManager.play('recover');
        particleSystem.spawnAirRing(player.x, player.y - 5, '#00f0ff');
        particleSystem.spawnSparks(player.x, player.y - 5, 14, '#00f0ff');
        collisionSystem.addFloatingText('🚀 ¡DOBLE SALTO!', player.x, player.y - 85, '#00f0ff', 20);
        animController.play('jump');
        animController.triggerJumpStretch(1.0);
        uiManager.setActiveAnim('jump');
      }
      return;
    }

    if (animName === 'super_shot') {
      if (powerSystem.canUseSuper()) {
        powerSystem.consumeSuper();
        const powerMult = player.character?.stats?.power || 1.0;
        player.activePowerMultiplier = 2.4 * powerMult;
        animController.play('super_shot');
        soundManager.play('superPower');
        soundManager.play('chargedBlast');

        const superColors = player.character?.super?.colors || ['#ff3700', '#ffd000'];
        particleSystem.spawnFlameAura(player.x, player.y - 65, superColors);

        // Character-specific signature Super Shot fired from ANYWHERE!
        superShots.launch(ball, player.character, player.direction, 'player', { player, rivalBot });
        collisionSystem.addFloatingText(`🔥 ¡${player.character?.super?.name || 'SUPER HABILIDAD'}! 🔥`, player.x, player.y - 95, superColors[0] || '#ff3700', 24);
        uiManager.setActiveAnim('super_shot');
      } else {
        // Not enough super energy: trigger standard kick and notify HUD
        const powerMult = player.character?.stats?.power || 1.0;
        player.activePowerMultiplier = 1.0 * powerMult;
        animController.play('kick');
        soundManager.play('kick');
        uiManager.setActiveAnim('kick');
        collisionSystem.addFloatingText('⚡ POWER INSUFICIENTE', player.x, player.y - 95, '#ff5500', 16);
      }
      return;
    }

    if (animName === 'kick' || animName === 'rocket_kick' || animName === 'bicycle_kick' || animName === 'diving_header' || animName === 'scorpion_kick' || animName === 'smash_header') {
      const powerMult = player.character?.stats?.power || 1.0;
      player.activePowerMultiplier = 1.25 * powerMult;

      let chosenAnim = animName;

      if (animName === 'kick') {
        const dx = (ball.x - player.x) * player.direction;
        const dy = ball.y - player.y;
        const dist = Math.hypot(ball.x - player.x, ball.y - player.y);

        if (!player.isGrounded) {
          if (dy < -35 && dist < 170) {
            // Ball is high overhead: Bicycle Kick!
            chosenAnim = 'bicycle_kick';
            player.vy = -380;
            particleSystem.spawnAirRing(player.x, player.y - 30, '#ffd700');
            soundManager.play('chargedBlast');
          } else if (dy > -20 && dx > 15 && dist < 150) {
            // Ball is descending in front: Smash Header!
            chosenAnim = 'smash_header';
            particleSystem.spawnAirRing(player.x, player.y - 20, '#ffcc00');
            soundManager.play('headImpact');
          } else {
            // Mid-air flying dive: Diving Header!
            chosenAnim = 'diving_header';
            player.vx = player.direction * 320;
            particleSystem.spawnAirRing(player.x, player.y - 20, '#00ffcc');
            soundManager.play('kick');
          }
        } else {
          // Grounded
          if (dx < -15 && dist < 100) {
            // Ball is behind: Scorpion Kick!
            chosenAnim = 'scorpion_kick';
            soundManager.play('kick');
          } else if (player.isMoving && dx > 10) {
            // Running forward: Rocket Kick low bullet!
            chosenAnim = 'rocket_kick';
            particleSystem.spawnTurfSpray(player.x, renderer.groundY, player.direction, 14);
            soundManager.play('laser');
          } else {
            // Standard crisp kick
            chosenAnim = 'kick';
            soundManager.play('kick');
          }
        }
      } else {
        if (chosenAnim === 'bicycle_kick' && !player.isGrounded) {
          player.vy = -380;
          particleSystem.spawnAirRing(player.x, player.y - 30, '#ffd700');
          soundManager.play('chargedBlast');
        } else {
          soundManager.play('kick');
        }
      }

      animController.play(chosenAnim);
      particleSystem.spawnSparks(player.x + 35 * player.direction, player.y - 15, 14, '#00f0ff');
      uiManager.setActiveAnim(chosenAnim);
      return;
    }

    animController.play(animName);
    uiManager.setActiveAnim(animName);
  };

  inputManager.onAction(triggerAction);
  uiManager.onPlayAction(triggerAction);

  // Player 2 Action Dispatcher
  const triggerP2Action = (animName, data = null) => {
    soundManager.init();
    if (animName === 'jump') {
      rivalBot.triggerJump();
    } else if (animName === 'dash') {
      rivalBot.triggerDash();
    } else if (animName === 'charged_kick') {
      rivalBot.triggerKick(ball, player, collisionSystem, data);
    } else if (animName === 'super_shot') {
      rivalBot.triggerSuper(ball, player, collisionSystem, superShots);
    } else if (animName === 'kick' || animName === 'bicycle_kick') {
      rivalBot.triggerKick(ball, player, collisionSystem);
    }
  };

  inputManager.onP2Action(triggerP2Action);

  // 2-Player Local Multiplayer Mode Toggle
  const toggle2PMode = (enable = null) => {
    const isNow2P = enable !== null ? !!enable : !inputManager.twoPlayerMode;
    inputManager.setTwoPlayerMode(isNow2P);
    rivalBot.setHumanControlled(isNow2P);
    uiManager.setTwoPlayerMode(isNow2P);
    if (isNow2P) {
      soundManager.play('crowdCheer');
      collisionSystem.addFloatingText('👥 ¡MODO 2 JUGADORES ACTIVADO! 🎮', renderer.stageWidth * 0.5, renderer.groundY - 140, '#00f0ff', 24);
      collisionSystem.addFloatingText('P1: WASD / Espacio / Shift  |  P2: Flechas / Enter / Shift Der', renderer.stageWidth * 0.5, renderer.groundY - 110, '#ffd700', 16);
    } else {
      collisionSystem.addFloatingText('🤖 MODO 1 JUGADOR (VS CPU)', renderer.stageWidth * 0.5, renderer.groundY - 140, '#ffd700', 20);
    }
  };

  uiManager.onToggle2P(toggle2PMode);
  window.toggle2PMode = toggle2PMode;

  // Tournament Coordinator Setup
  const tournamentManager = new TournamentManager();
  window.tournamentManager = tournamentManager;

  uiManager.onStartTournMatch(() => {
    if (inputManager.twoPlayerMode) toggle2PMode(false);
    if (!tournamentManager.bracket || tournamentManager.tournamentRound >= 3) {
      tournamentManager.startCopaMundial(player.character.id);
    }
    const currentRival = tournamentManager.getCurrentRival();
    switchRivalCharacter(currentRival.id);
    rivalBot.setDifficulty(tournamentManager.getCurrentDifficulty());
    const roundNames = ['CUARTOS DE FINAL', 'SEMIFINAL', 'GRAN FINAL'];
    const rName = roundNames[tournamentManager.tournamentRound] || 'GRAN FINAL';
    uiManager.updateTournamentPill(`COPA MUNDIAL — ${rName}`, '🏆');
    uiManager.renderTournamentBracket(tournamentManager.bracket, tournamentManager.tournamentRound);
    resetMatch();
  });

  uiManager.onStartSurvival(() => {
    if (inputManager.twoPlayerMode) toggle2PMode(false);
    const rival = tournamentManager.startSurvival(player.character.id);
    switchRivalCharacter(rival.id);
    rivalBot.setDifficulty(tournamentManager.getCurrentDifficulty());
    uiManager.updateTournamentPill('SUPERVIVENCIA — RACHA: 0', '🔥');
    uiManager.updateSurvivalStats(0, tournamentManager.bestSurvivalStreak);
    resetMatch();
  });

  uiManager.onStartGoldenGoal(() => {
    const rival = tournamentManager.startGoldenGoal(player.character.id, rivalBot.character.id);
    switchRivalCharacter(rival.id);
    rivalBot.setDifficulty('hard');
    uiManager.updateTournamentPill('GOL DE ORO — MUERTE SÚBITA', '⚡');
    resetMatch();
  });

  uiManager.onStartLocal2P(() => {
    toggle2PMode(true);
    tournamentManager.startLocal2P(player.character.id, rivalBot.character.id);
    uiManager.updateTournamentPill('1 VS 1 MULTIJUGADOR LOCAL', '👥');
    resetMatch();
  });

  uiManager.onStartQuickMatch(() => {
    tournamentManager.setQuickMatch();
    uiManager.updateTournamentPill(inputManager.twoPlayerMode ? '1 VS 1 MULTIJUGADOR LOCAL' : 'AMISTOSO RÁPIDO', inputManager.twoPlayerMode ? '👥' : '⚽');
    resetMatch();
  });

  // Dash button & keyboard listener
  const dashBtn = document.getElementById('btnDash');
  if (dashBtn) {
    dashBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerDash();
    });
  }
  window.addEventListener('keydown', (e) => {
    if ((e.key === 's' || e.key === 'S' || (!inputManager.twoPlayerMode && e.key === 'ArrowDown')) && !e.repeat) {
      triggerDash();
    }
    if (isMatchOver && (e.key === ' ' || e.key === 'Enter') && !e.repeat) {
      e.preventDefault();
      resetMatch();
    }
  });

  // Touch & Arcade Movement Controls
  const touchState = { left: false, right: false };
  const bindTouchMove = (id, dir) => {
    const el = document.getElementById(id);
    if (!el) return;
    const start = (e) => {
      e.preventDefault();
      soundManager.init();
      touchState[dir] = true;
      inputManager.touchMoves[dir] = true;
    };
    const end = (e) => {
      e.preventDefault();
      touchState[dir] = false;
      inputManager.touchMoves[dir] = false;
    };
    el.addEventListener('mousedown', start);
    el.addEventListener('touchstart', start, { passive: false });
    el.addEventListener('mouseup', end);
    el.addEventListener('mouseleave', end);
    el.addEventListener('touchend', end);
    el.addEventListener('touchcancel', end);
  };
  bindTouchMove('btnMoveLeft', 'left');
  bindTouchMove('btnMoveRight', 'right');

  // Hold-to-Charge Kick Button binding for mobile/mouse
  const btnKick = document.getElementById('btnKick');
  if (btnKick) {
    btnKick.addEventListener('mousedown', (e) => { e.preventDefault(); inputManager.startKickCharge(); });
    btnKick.addEventListener('mouseup', (e) => { e.preventDefault(); inputManager.releaseKickCharge(); });
    btnKick.addEventListener('mouseleave', () => { if (inputManager.isKickHolding) inputManager.releaseKickCharge(); });
    btnKick.addEventListener('touchstart', (e) => { e.preventDefault(); inputManager.startKickCharge(); }, { passive: false });
    btnKick.addEventListener('touchend', (e) => { e.preventDefault(); inputManager.releaseKickCharge(); }, { passive: false });
    btnKick.addEventListener('touchcancel', (e) => { e.preventDefault(); inputManager.releaseKickCharge(); }, { passive: false });
  }

  // Match Reset Handler
  const resetMatch = () => {
    if (tournamentManager.currentMode === GAME_MODES.GOLDEN_GOAL) {
      matchSeconds = 0.01;
    } else {
      matchSeconds = 60;
    }
    isMatchOver = false;
    collisionSystem.isMatchOver = false;
    slowMoTimer = 0;
    uiManager.hideMatchOver();
    collisionSystem.playerGoals = 0;
    collisionSystem.rivalGoals = 0;
    uiManager.setScore(0, 0);
    player.x = Math.floor(renderer.stageWidth * 0.28) || 280;
    player.y = renderer.groundY;

    if (tournamentManager.currentMode === GAME_MODES.SURVIVAL) {
      player.hp = tournamentManager.survivalHealth;
    } else {
      player.hp = 100;
    }
    player.isStunned = false;
    player.isFrozen = false;
    player.hasShield = false;
    player.canDoubleJump = true;
    player.isKnockedOut = false;
    player.isDashing = false;
    player.dashVx = 0;
    player.dashCooldown = 0;
    player.dashGhosts = [];
    player.isSpinning = false;
    player.flipAngle = 0;
    superShots.reset();
    player.animController.play('idle');
    rivalBot.resetPosition();
    rivalBot.x = Math.floor(renderer.stageWidth * 0.72) || (renderer.stageWidth - 280);
    rivalBot.y = renderer.groundY;
    rivalBot.hp = 100;
    rivalBot.power = 0;
    ball.reset(renderer.stageWidth * 0.5, renderer.groundY - 180);
    powerSystem.power = tournamentManager.currentMode === GAME_MODES.SURVIVAL ? 100 : 0;
    powerUpSystem.reset();
    uiManager.setPlayerHp(player.hp, 100);
    uiManager.setRivalHp(100, 100);
    uiManager.setRivalPowerMeter(0, false);
    if (tournamentManager.currentMode === GAME_MODES.LOCAL_2P) {
      uiManager.updateTournamentPill('1 VS 1 MULTIJUGADOR LOCAL', '👥');
    }
    soundManager.play('goalWhistle');
  };

  uiManager.onRestartMatch(resetMatch);
  const matchOverBanner = document.getElementById('matchOverBanner');
  if (matchOverBanner) {
    matchOverBanner.addEventListener('click', resetMatch);
  }

  // Ragdoll & Stun Handlers
  ragdollSystem.onRecover(() => {
    player.isKnockedOut = false;
    player.isStunned = false;
    uiManager.setRagdollActive(false);
    uiManager.setStunActive(false);
    uiManager.setPlayerHp(player.hp, player.maxHp);
    animController.play('idle');
    uiManager.setActiveAnim('idle');
  });

  collisionSystem.onDamage((hp) => {
    uiManager.setPlayerHp(hp, player.maxHp);
  });

  collisionSystem.onRivalDamage((hp) => {
    uiManager.setRivalHp(hp, rivalBot.maxHp);
  });

  collisionSystem.onStun((isStunned) => {
    uiManager.setStunActive(isStunned);
    if (!isStunned && !ragdollSystem.isActive) {
      animController.play('idle');
      uiManager.setActiveAnim('idle');
    }
  });

  collisionSystem.onHitStop((dur) => {
    hitStopTimer = Math.max(hitStopTimer, dur);
  });

  collisionSystem.onShake((intensity) => {
    renderer.shake(intensity);
  });

  // Net Bulge and Post Hit integration with StadiumRenderer
  ball.onNetBulge = (isRight, impactY, speed) => {
    renderer.stadiumRenderer.triggerNetImpact(isRight, impactY, speed);
  };

  collisionSystem.onPostHit((isRight, hitX, hitY, speed, hitType) => {
    renderer.stadiumRenderer.triggerPostHit(isRight, hitX, hitY, speed, hitType);
  });

  // Goal trigger banner, LED sensor flash & scoreboard update
  collisionSystem.onGoal((playerScore, kicker, ballObj) => {
    uiManager.setScore(playerScore, collisionSystem.rivalGoals);
    uiManager.showGoalBanner(inputManager.twoPlayerMode ? 'JUGADOR 1' : '', player.character?.country || '⚽');
    player.animController.play('celebration');
    if (rivalBot && rivalBot.isHumanControlled) {
      rivalBot.animController.play('defeat');
    }
    soundManager.play('crowdCheer');
    renderer.shake(14);
    renderer.flash('#00ffcc');
    slowMoTimer = 1.2;

    renderer.stadiumRenderer.triggerGoalCelebration(true, '#00ffcc');
    if (ballObj) {
      renderer.stadiumRenderer.triggerNetImpact(true, ballObj.y, Math.hypot(ballObj.vx, ballObj.vy));
    }

    if (tournamentManager.currentMode === GAME_MODES.GOLDEN_GOAL) {
      matchSeconds = 0;
    }
  });

  collisionSystem.onRivalGoal((rivalScore, kicker, ballObj) => {
    uiManager.setScore(collisionSystem.playerGoals, rivalScore);
    uiManager.showGoalBanner(inputManager.twoPlayerMode ? 'JUGADOR 2' : '', rivalBot.character?.country || '⚽');
    player.animController.play('defeat');
    if (rivalBot && rivalBot.isHumanControlled) {
      rivalBot.animController.play('celebration');
    }
    renderer.shake(12);
    renderer.flash('#ff3700');
    slowMoTimer = 1.0;

    renderer.stadiumRenderer.triggerGoalCelebration(false, '#ff3700');
    if (ballObj) {
      renderer.stadiumRenderer.triggerNetImpact(false, ballObj.y, Math.hypot(ballObj.vx, ballObj.vy));
    }

    if (tournamentManager.currentMode === GAME_MODES.GOLDEN_GOAL) {
      matchSeconds = 0;
    }
  });

  // 6. Main Game Loop
  let lastTime = performance.now();

  function loop() {
    const now = performance.now();
    const rawDt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    // Poll connected Gamepads (Pad 0 for Player 1, Pad 1 for Player 2)
    inputManager.pollGamepads();

    let dt = rawDt;
    if (hitStopTimer > 0) {
      hitStopTimer -= rawDt;
      dt = 0; // Freeze physics for that punchy arcade hit impact!
    } else if (slowMoTimer > 0) {
      slowMoTimer -= rawDt;
      dt = rawDt * 0.35; // Dramatic Slow-Mo!
    }

    // Match Countdown Timer
    if (!isMatchOver) {
      if (tournamentManager.currentMode === GAME_MODES.GOLDEN_GOAL) {
        matchSeconds += dt;
      } else {
        matchSeconds -= dt;
      }

      const isGameOverTriggered = 
        (tournamentManager.currentMode !== GAME_MODES.GOLDEN_GOAL && matchSeconds <= 0) ||
        (tournamentManager.currentMode === GAME_MODES.GOLDEN_GOAL && (collisionSystem.playerGoals > 0 || collisionSystem.rivalGoals > 0));

      if (isGameOverTriggered) {
        matchSeconds = Math.max(0, matchSeconds);
        isMatchOver = true;
        soundManager.play('goalWhistle');

        const outcome = tournamentManager.recordMatchResult(collisionSystem.playerGoals, collisionSystem.rivalGoals);

        if (outcome.status === 'won_championship') {
          soundManager.play('crowdCheer');
          player.animController.play('celebration');
          uiManager.showTrophyModal(player.character);
          uiManager.showMatchOver('¡CAMPEÓN DEL MUNDO! 🏆', `${player.character.name} levanta la copa dorada!`);
        } else if (outcome.status === 'advanced') {
          soundManager.play('crowdCheer');
          uiManager.showMatchOver('¡CLASIFICADO! 🏆', `Avanzas a la ${outcome.roundName}! Abre el menú de Torneos para tu siguiente rival.`);
          uiManager.renderTournamentBracket(tournamentManager.bracket, tournamentManager.tournamentRound);
        } else if (outcome.status === 'streak_continued') {
          soundManager.play('crowdCheer');
          uiManager.showMatchOver(`¡VICTORIA EN RACHA! 🔥`, `Racha: ${outcome.streak} rivales. +${outcome.bonusHp} HP recuperados.`);
          uiManager.updateTournamentPill(`SUPERVIVENCIA — RACHA: ${outcome.streak}`, '🔥');
          uiManager.updateSurvivalStats(outcome.streak, tournamentManager.bestSurvivalStreak);
        } else if (outcome.status === 'game_over') {
          player.animController.play('defeat');
          uiManager.showMatchOver('FIN DE LA SUPERVIVENCIA 💀', `Alcanzaste ${outcome.finalStreak} victorias. Récord: ${outcome.bestStreak}`);
          uiManager.updateSurvivalStats(0, outcome.bestStreak);
        } else if (outcome.status === 'p1_victory') {
          soundManager.play('crowdCheer');
          player.animController.play('celebration');
          if (rivalBot.isHumanControlled) rivalBot.animController.play('defeat');
          uiManager.showMatchOver('¡VICTORIA DEL JUGADOR 1! 🏆', `${player.character.name} triunfa ${outcome.p1Score} - ${outcome.p2Score}!`);
        } else if (outcome.status === 'p2_victory') {
          soundManager.play('crowdCheer');
          player.animController.play('defeat');
          if (rivalBot.isHumanControlled) rivalBot.animController.play('celebration');
          uiManager.showMatchOver('¡VICTORIA DEL JUGADOR 2! 🎮', `${rivalBot.character.name} triunfa ${outcome.p2Score} - ${outcome.p1Score}!`);
        } else if (collisionSystem.playerGoals > collisionSystem.rivalGoals) {
          player.animController.play('celebration');
          soundManager.play('crowdCheer');
          uiManager.showMatchOver('¡VICTORIA! 🏆', `${player.character.name} triunfa ${collisionSystem.playerGoals} - ${collisionSystem.rivalGoals}`);
        } else if (collisionSystem.playerGoals < collisionSystem.rivalGoals) {
          player.animController.play('defeat');
          uiManager.showMatchOver('¡DERROTA! 💀', `${rivalBot.character.name} vence ${collisionSystem.rivalGoals} - ${collisionSystem.playerGoals}`);
        } else {
          uiManager.showMatchOver('¡EMPATE! ⚽', `Marcador final: ${collisionSystem.playerGoals} - ${collisionSystem.rivalGoals}`);
        }
      }
      uiManager.setMatchTimer(matchSeconds);
    }

    let animState;

    // Update Super Power Meter Passive Generation & HUD Sync
    powerSystem.update(dt);
    uiManager.setPowerMeter(powerSystem.getRatio(), powerSystem.canUseSuper());

    // Sync Rival dimensions
    rivalBot.stageWidth = renderer.stageWidth;
    rivalBot.groundY = renderer.groundY;
    rivalBot.enabled = uiManager.toggles.rival !== false;

    // Update Rival AI / Player 2 with SuperShots launcher and inputs
    const rivalAnimState = rivalBot.update(dt, ball, player, collisionSystem, ragdollSystem, superShots, inputManager);
    uiManager.setRivalHp(rivalBot.hp, rivalBot.maxHp);
    uiManager.setRivalPowerMeter(rivalBot.power / 100, rivalBot.power >= 100);

    if (ragdollSystem.isActive) {
      // 1. Floppy Ragdoll Physics active!
      ragdollSystem.update(dt, renderer.groundY, renderer.stageWidth, player);
      animState = {
        face: 'ko',
        squashY: 1.0,
        stretchX: 1.0,
        aura: false
      };
      uiManager.setRagdollActive(true);
    } else {
      uiManager.setRagdollActive(false);

      // 2. Horizontal Locomotion & Physics-Based Dash
      const speedMult = (player.character?.stats?.speed || 1.0) * (player.speedMultiplier || 1.0);
      const moveSpeed = 360 * speedMult;
      let isMoving = false;

      // Dash Cooldown decrement
      if (player.dashCooldown > 0) {
        player.dashCooldown = Math.max(0, player.dashCooldown - dt);
      }

      // Smooth Physics Dash with Continuous Velocity Deceleration & Afterimages
      if (player.isDashing) {
        player.dashTimer -= dt;
        player.x += player.dashVx * dt;
        player.dashVx *= 0.92; // fluid aerodynamic drag

        // Append ghost afterimage
        if (!player.dashGhosts) player.dashGhosts = [];
        player.dashGhosts.push({
          x: player.x,
          y: player.y,
          direction: player.direction || 1,
          alpha: 0.65,
          color: player.character?.super?.colors?.[0] || 'rgba(0, 240, 255, 0.45)',
          headImg: renderer.assetLoader.getHead(player.character?.id)
        });

        if (player.dashTimer <= 0) {
          player.isDashing = false;
          player.dashVx = 0;
        }
      }

      // Fade dash ghost afterimages
      if (player.dashGhosts && player.dashGhosts.length > 0) {
        for (let i = player.dashGhosts.length - 1; i >= 0; i--) {
          player.dashGhosts[i].alpha -= dt * 4.2;
          if (player.dashGhosts[i].alpha <= 0) {
            player.dashGhosts.splice(i, 1);
          }
        }
      }

      // Athletic Double Jump 360 Flip / Spin
      if (player.isSpinning) {
        player.spinTime += dt;
        const progress = Math.min(1.0, player.spinTime / player.spinDuration);
        player.flipAngle = progress * Math.PI * 2 * (player.direction || 1);
        if (progress >= 1.0) {
          player.isSpinning = false;
          player.flipAngle = 0;
        }
      }

      if (!player.isStunned && !player.isFrozen && !isMatchOver && !player.isDashing) {
        if (touchState.left || inputManager.isKeyDown('a') || inputManager.isKeyDown('arrowleft')) {
          player.x -= moveSpeed * dt;
          player.direction = -1;
          isMoving = true;
        }
        if (touchState.right || inputManager.isKeyDown('d') || inputManager.isKeyDown('arrowright')) {
          player.x += moveSpeed * dt;
          player.direction = 1;
          isMoving = true;
        }
      }
      player.isMoving = isMoving;
      if (isMoving && player.isGrounded && Math.random() < 0.35) {
        particleSystem.spawnDust(player.x - player.direction * 18, renderer.groundY, 2);
      }
      if (rivalBot && rivalBot.isMoving && rivalBot.isGrounded && Math.random() < 0.35) {
        particleSystem.spawnDust(rivalBot.x - rivalBot.direction * 18, renderer.groundY, 2);
      }

      // Clamp player to pitch boundaries (full width between edge-aligned goals)
      player.x = Math.max(78, Math.min(player.x, renderer.stageWidth - 78));

      // 3. Vertical Physics (Platformer Jump & Gravity)
      if (!player.isGrounded) {
        player.vy += 1580 * dt; // Gravity
        player.y += player.vy * dt;

        if (player.y >= renderer.groundY) {
          const impact = Math.min(1.6, Math.abs(player.vy) / 450);
          player.y = renderer.groundY;
          player.vy = 0;
          player.isGrounded = true;
          player.canDoubleJump = true;
          animController.triggerLandingSquash(impact);
          particleSystem.spawnDust(player.x, renderer.groundY, 7);
          particleSystem.spawnSparks(player.x, renderer.groundY, 8, 'rgba(255,255,255,0.6)');
        }
      } else {
        player.y = renderer.groundY;
        player.vy = 0;
        player.canDoubleJump = true;
      }

      // 4. Locomotion & Animation State Machine
      const cur = animController.currentAnim;
      const isOneShot = ['kick', 'rocket_kick', 'bicycle_kick', 'diving_header', 'scorpion_kick', 'smash_header', 'super_shot'].includes(cur);
      const isOneShotFinished = isOneShot && (animController.animTime >= animController.getClip().duration * 0.95);

      if (player.isStunned) {
        if (cur !== 'stun') animController.play('stun');
      } else if (!isOneShot || isOneShotFinished) {
        if (!player.isGrounded) {
          if (cur !== 'jump') animController.play('jump');
        } else if (isMoving) {
          if (cur !== 'run') animController.play('run');
        } else {
          if (cur !== 'idle') animController.play('idle');
        }
      }

      player.vx = player.isDashing ? player.dashVx : (isMoving ? player.direction * moveSpeed : 0);

      // Synchronize Skeleton Root Transform
      skeleton.setPosition(player.x, player.y);
      skeleton.setFacing(player.direction);

      // Procedural Gaze / Look-At tracking towards ball & athletic momentum
      animController.setLookTarget(ball.x, ball.y);
      animController.setVelocity(player.vx, player.vy);

      // Update Animation State & Skeleton
      animState = animController.update(player.isFrozen ? 0 : dt);
      player.userHeadScale = animController.headScaleMultiplier * (player.giantHeadMultiplier || 1.0);
      if (rivalBot) {
        rivalBot.animController.headScaleMultiplier = 1.0 * (rivalBot.giantHeadMultiplier || 1.0);
      }

      // Super shot aura during playback
      if (animState.aura || animController.currentAnim === 'super_shot') {
        const colors = player.character?.super?.colors || ['#ff3700', '#ffd000'];
        particleSystem.spawnFlameAura(player.x, player.y - 75, colors);
      }
    }

    // Hold-to-Charge Power Shot Feedback & Aura
    const chargeRatio = inputManager.getKickChargeRatio();
    if (chargeRatio > 0 && !player.isStunned && !player.isFrozen && !ragdollSystem.isActive) {
      if (Math.random() < 0.28) {
        soundManager.playChargeHum(chargeRatio);
      }
      particleSystem.spawnSparks(player.x + player.direction * 15, renderer.groundY - 8, 2, chargeRatio > 0.85 ? '#ffd700' : '#00f0ff');
      renderer.chargingAura = {
        x: player.x,
        y: renderer.groundY,
        ratio: chargeRatio,
        color: chargeRatio > 0.85 ? '#ffd700' : '#00f0ff'
      };
    } else {
      renderer.chargingAura = null;
    }

    // Hold-to-Charge Power Shot Feedback & Aura for Player 2
    const p2ChargeRatio = inputManager.getP2KickChargeRatio();
    if (p2ChargeRatio > 0 && rivalBot.isHumanControlled && !rivalBot.isStunned && !rivalBot.isFrozen) {
      if (Math.random() < 0.28) {
        soundManager.playChargeHum(p2ChargeRatio);
      }
      particleSystem.spawnSparks(rivalBot.x + rivalBot.direction * 15, renderer.groundY - 8, 2, p2ChargeRatio > 0.85 ? '#ffd700' : '#ff3700');
      renderer.chargingAuraP2 = {
        x: rivalBot.x,
        y: renderer.groundY,
        ratio: p2ChargeRatio,
        color: p2ChargeRatio > 0.85 ? '#ffd700' : '#ff3700'
      };
    } else {
      renderer.chargingAuraP2 = null;
    }

    // Update Physics, Air Drops & Interactions
    ball.update(dt, renderer.groundY, renderer.stageWidth);
    collisionSystem.update(player, skeleton, ball, renderer.stageWidth, renderer.groundY, dt, ragdollSystem, powerSystem, rivalBot, inputManager, isMatchOver, superShots);
    powerUpSystem.update(dt, renderer.stageWidth, renderer.groundY, player, rivalBot, ball, collisionSystem);
    superShots.update(dt, renderer.stageWidth, renderer.groundY, ball, player, rivalBot, collisionSystem);
    particleSystem.update(dt);

    // Telemetry updates
    const speedKmH = (Math.hypot(ball.vx, ball.vy) * 0.08).toFixed(0);
    uiManager.updateTelemetry(speedKmH);
    uiManager.updateTimeline(animController.animTime, animController.getClip().duration);
    uiManager.updateBoneInspector();

    // Render Pipeline
    renderer.render({
      player,
      skeleton,
      animState,
      rivalBot,
      rivalAnimState,
      ball,
      particleSystem,
      ragdollSystem,
      powerSystem,
      powerUpSystem,
      collisionSystem,
      superShots,
      soundManager,
      dt,
      options: {
        showBones: document.getElementById('dbgBones')?.checked ?? uiManager.toggles.showBones,
        showJoints: uiManager.toggles.showJoints,
        showMesh: document.getElementById('dbgMesh')?.checked ?? uiManager.toggles.showMesh,
        showHitboxes: document.getElementById('dbgHitboxes')?.checked ?? uiManager.toggles.showHitboxes,
        showSkin: uiManager.toggles.showSkin
      }
    });

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

window.addEventListener('DOMContentLoaded', bootstrap);
