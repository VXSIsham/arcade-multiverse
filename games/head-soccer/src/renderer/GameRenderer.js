import { StadiumRenderer } from './StadiumRenderer.js?v=char_overhaul_v42';
import { CharacterRenderer } from './CharacterRenderer.js?v=char_overhaul_v42';
import { SpineDebugger } from './SpineDebugger.js?v=char_overhaul_v42';

/**
 * Main game rendering pipeline coordinator with dynamic camera juice (shake & flash).
 */
export class GameRenderer {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {import('./AssetLoader.js').AssetLoader} assetLoader
   */
  constructor(canvas, assetLoader) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.assetLoader = assetLoader;

    this.stadiumRenderer = new StadiumRenderer(assetLoader);
    this.characterRenderer = new CharacterRenderer(assetLoader);
    this.spineDebugger = new SpineDebugger();

    this.stageWidth = 0;
    this.stageHeight = 0;
    this.groundY = 0;

    // Camera FX (Shake, Flash & Dynamic Punch Zoom)
    this.trauma = 0;
    this.flashAlpha = 0;
    this.flashColor = '#ffffff';
    this.cameraZoom = 1.0;
    this.targetZoom = 1.0;
    this.zoomFocusX = null;
    this.zoomFocusY = null;

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.floor(rect.width * dpr);
    this.canvas.height = Math.floor(rect.height * dpr);
    this.stageWidth = rect.width;
    this.stageHeight = rect.height;
    this.groundY = this.stageHeight - 145;
  }

  shake(intensity = 8) {
    this.trauma = Math.min(25, this.trauma + intensity);
  }

  punchZoom(amount = 1.10, focusX = null, focusY = null) {
    this.targetZoom = Math.min(1.22, Math.max(this.targetZoom, amount));
    this.zoomFocusX = focusX;
    this.zoomFocusY = focusY;
  }

  flash(color = '#ffffff') {
    this.flashColor = color;
    this.flashAlpha = 0.85;
  }

  render(sceneState) {
    const {
      player,
      skeleton,
      animState,
      ball,
      particleSystem,
      options = {}
    } = sceneState;

    const dpr = window.devicePixelRatio || 1;
    const ctx = this.ctx;
    const dt = sceneState.dt || 0.016;

    // Smooth Camera Punch Zoom Interpolation
    this.cameraZoom += (this.targetZoom - this.cameraZoom) * Math.min(1.0, dt * 10);
    this.targetZoom += (1.0 - this.targetZoom) * Math.min(1.0, dt * 3.6);

    const focusX = this.zoomFocusX ?? (this.stageWidth * 0.5);
    const focusY = this.zoomFocusY ?? (this.groundY - 80);

    // Screen Shake Offset
    let shakeX = 0;
    let shakeY = 0;
    if (this.trauma > 0) {
      shakeX = (Math.random() - 0.5) * this.trauma * 2.2;
      shakeY = (Math.random() - 0.5) * this.trauma * 2.2;
      this.trauma = Math.max(0, this.trauma - 0.55);
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.translate(shakeX, shakeY);

    if (Math.abs(this.cameraZoom - 1.0) > 0.002) {
      ctx.translate(focusX, focusY);
      ctx.scale(this.cameraZoom, this.cameraZoom);
      ctx.translate(-focusX, -focusY);
    }

    ctx.clearRect(-40, -40, this.stageWidth + 80, this.stageHeight + 80);

    // Update stadium dynamic physics (Verlet net simulation, post vibration, LED sensors)
    this.stadiumRenderer.update(dt, ball, sceneState.soundManager);

    // 1. Stadium Backdrop
    this.stadiumRenderer.renderBackdrop(ctx, this.stageWidth, this.stageHeight, this.groundY);

    // 2. Goal Posts & Nets (Left & Right)
    this.stadiumRenderer.renderGoals(ctx, this.stageWidth, this.groundY);

    // 3. Ground Pitch Line & Center Arc
    this.stadiumRenderer.renderPitchLine(ctx, this.stageWidth, this.groundY);

    // 4. Dynamic Character & Ball Ground Shadows with Realistic Elevation Scaling
    // Player 1 Ground Shadow
    const p1Elev = Math.max(0, this.groundY - player.y);
    const p1Scale = Math.max(0.35, 1.0 - (p1Elev / 280) * 0.65);
    const p1Alpha = Math.max(0.10, 0.42 - (p1Elev / 280) * 0.30);
    ctx.fillStyle = `rgba(0, 0, 0, ${p1Alpha.toFixed(3)})`;
    ctx.beginPath();
    ctx.ellipse(player.x, this.groundY + 3, 46 * p1Scale, 11 * p1Scale, 0, 0, Math.PI * 2);
    ctx.fill();

    // CPU Rival Ground Shadow
    if (sceneState.rivalBot && sceneState.rivalBot.enabled) {
      const cpu = sceneState.rivalBot;
      const cpuElev = Math.max(0, this.groundY - cpu.y);
      const cpuScale = Math.max(0.35, 1.0 - (cpuElev / 280) * 0.65);
      const cpuAlpha = Math.max(0.10, 0.42 - (cpuElev / 280) * 0.30);
      ctx.fillStyle = `rgba(0, 0, 0, ${cpuAlpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.ellipse(cpu.x, this.groundY + 3, 46 * cpuScale, 11 * cpuScale, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Ball Ground Shadow (Crucial 3D depth cue for judging aerial passes and headers)
    const ballElev = Math.max(0, this.groundY - ball.y);
    const ballScale = Math.max(0.32, 1.0 - (ballElev / 320) * 0.68);
    const ballAlpha = Math.max(0.10, 0.48 - (ballElev / 320) * 0.34);
    ctx.fillStyle = `rgba(0, 0, 0, ${ballAlpha.toFixed(3)})`;
    ctx.beginPath();
    ctx.ellipse(ball.x, this.groundY + 3, Math.max(8, ball.radius * 1.35 * ballScale), Math.max(3, 7 * ballScale), 0, 0, Math.PI * 2);
    ctx.fill();

    // Supply Crates Ground Shadow (shows landing zone while parachute is falling)
    if (sceneState.powerUpSystem && sceneState.powerUpSystem.crates) {
      for (const crate of sceneState.powerUpSystem.crates) {
        const crateElev = Math.max(0, this.groundY - crate.y);
        const crateScale = Math.max(0.30, 1.0 - (crateElev / 340) * 0.70);
        const crateAlpha = Math.max(0.08, 0.38 - (crateElev / 340) * 0.28);
        ctx.fillStyle = `rgba(0, 0, 0, ${crateAlpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.ellipse(crate.x, this.groundY + 3, 22 * crateScale, 6 * crateScale, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 4b. Hold-to-Charge Glowing Power Aura on Turf (P1 & P2)
    const drawAura = (aura) => {
      if (!aura) return;
      const { x, y, ratio, color } = aura;
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3.5;
      ctx.shadowColor = color;
      ctx.shadowBlur = 14 + ratio * 14;

      // Pulsating outer energy ring
      ctx.beginPath();
      ctx.ellipse(x, y + 2, 42 + ratio * 16, 11 + ratio * 4, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Progress Arc
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4.5;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.ellipse(x, y + 2, 46 + ratio * 16, 12 + ratio * 4, 0, -Math.PI * 0.5, -Math.PI * 0.5 + Math.PI * 2 * ratio);
      ctx.stroke();
      ctx.restore();
    };

    if (this.chargingAura) drawAura(this.chargingAura);
    if (this.chargingAuraP2) drawAura(this.chargingAuraP2);

    // 5b. High-Speed Action Speed Lines (Anime/Arcade Rush)
    this.drawSpeedLines(ctx, ball);

    // 6. Multi-layer Glowing Comet Motion Trail
    if (ball.trail && ball.trail.length > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < ball.trail.length; i++) {
        const t = ball.trail[i];
        const r = ball.radius * t.life * (t.speed > 550 ? 1.25 : 0.95);
        const trailColor = t.color || (t.isSuper ? '#ff3700' : '#00f0ff');

        // Outer glow
        ctx.beginPath();
        ctx.arc(t.x, t.y, r, 0, Math.PI * 2);
        const alphaHex = Math.floor(t.life * 170).toString(16).padStart(2, '0');
        ctx.fillStyle = trailColor.startsWith('#') ? `${trailColor}${alphaHex}` : trailColor;
        ctx.fill();

        // Hot plasma core
        ctx.beginPath();
        ctx.arc(t.x, t.y, r * 0.42, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${t.life * 0.85})`;
        ctx.fill();
      }
      ctx.restore();
    }

    // 6b. Dash Ghost Afterimages (Motion Blur Rocket Trails - P1 & P2)
    if (player.dashGhosts && player.dashGhosts.length > 0) {
      for (const ghost of player.dashGhosts) {
        ctx.save();
        ctx.globalAlpha = ghost.alpha;
        ctx.translate(ghost.x, ghost.y);
        ctx.scale(ghost.direction, 1);
        ctx.fillStyle = ghost.color || 'rgba(0, 240, 255, 0.4)';
        ctx.beginPath();
        ctx.ellipse(0, -45, 26, 44, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    if (sceneState.rivalBot && sceneState.rivalBot.dashGhosts && sceneState.rivalBot.dashGhosts.length > 0) {
      for (const ghost of sceneState.rivalBot.dashGhosts) {
        ctx.save();
        ctx.globalAlpha = ghost.alpha;
        ctx.translate(ghost.x, ghost.y);
        ctx.scale(ghost.direction, 1);
        ctx.fillStyle = ghost.color || 'rgba(255, 55, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(0, -45, 26, 44, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // 7. Character Skins & Mesh (Player 1)
    ctx.save();
    if (player.isSpinning && player.flipAngle) {
      ctx.translate(player.x, player.y - 45);
      ctx.rotate(player.flipAngle);
      ctx.translate(-player.x, -(player.y - 45));
    }
    this.characterRenderer.render(ctx, skeleton, animState, {
      showSkin: options.showSkin,
      showMesh: options.showMesh,
      headScale: player.userHeadScale,
      character: player.character,
      facing: player.direction || 1,
      hp: player.hp,
      isSuperReady: sceneState.isPlayerSuperReady,
      scaleMultiplier: player.shrinkMultiplier || 1.0,
      ball: ball,
      isGrounded: player.isGrounded,
      isDashing: player.isDashing,
      isStunned: player.isStunned,
      currentAnim: player.animController?.currentAnim,
      hitFlashTimer: player.hitFlashTimer || 0,
      vx: player.vx || 0,
      vy: player.vy || 0
    });
    ctx.restore();

    // 7b. Rival Opponent Skins & Mesh (P2 / CPU Striker)
    if (sceneState.rivalBot && sceneState.rivalBot.enabled) {
      ctx.save();
      if (sceneState.rivalBot.isSpinning && sceneState.rivalBot.flipAngle) {
        ctx.translate(sceneState.rivalBot.x, sceneState.rivalBot.y - 45);
        ctx.rotate(sceneState.rivalBot.flipAngle);
        ctx.translate(-sceneState.rivalBot.x, -(sceneState.rivalBot.y - 45));
      }
      this.characterRenderer.render(ctx, sceneState.rivalBot.skeleton, sceneState.rivalAnimState || { face: 'idle' }, {
        showSkin: options.showSkin,
        showMesh: options.showMesh,
        headScale: sceneState.rivalBot.giantHeadMultiplier || 1.0,
        character: sceneState.rivalBot.character,
        facing: sceneState.rivalBot.direction || -1,
        hp: sceneState.rivalBot.hp,
        isSuperReady: sceneState.rivalBot.power >= 100,
        scaleMultiplier: sceneState.rivalBot.shrinkMultiplier || 1.0,
        ball: ball,
        isGrounded: sceneState.rivalBot.isGrounded,
        isDashing: sceneState.rivalBot.isDashing,
        isStunned: sceneState.rivalBot.isStunned,
        currentAnim: sceneState.rivalBot.animController?.currentAnim,
        hitFlashTimer: sceneState.rivalBot.hitFlashTimer || 0,
        vx: sceneState.rivalBot.vx || 0,
        vy: sceneState.rivalBot.vy || 0
      });
      ctx.restore();

      if (sceneState.rivalBot.isStunned) {
        this.drawStunStars(ctx, sceneState.rivalBot.skeleton.head);
      }

      if (sceneState.rivalBot.hasShield) {
        this.drawEnergyShield(ctx, sceneState.rivalBot.x, sceneState.rivalBot.y - 45);
      }

      if (sceneState.rivalBot.isFrozen) {
        this.drawIceBlock(ctx, sceneState.rivalBot.x, sceneState.rivalBot.y - 45);
      }
    }

    // 8. Player Shield & Freeze & Dizzy Stars
    if (player.hasShield) {
      this.drawEnergyShield(ctx, player.x, player.y - 45);
    }
    if (player.isFrozen) {
      this.drawIceBlock(ctx, player.x, player.y - 45);
    }

    if (sceneState.ragdollSystem?.isActive) {
      sceneState.ragdollSystem.renderDizzyStars(ctx);
    } else if (player.isStunned) {
      this.drawStunStars(ctx, skeleton.head);
    }

    // 9. Mystery Air Drop Crates & Projectiles
    if (sceneState.powerUpSystem) {
      sceneState.powerUpSystem.render(ctx);
    }

    // 9b. Active Field Special Abilities (Laser, Blizzard, Excalibur, Black Hole, etc.)
    if (sceneState.superShots) {
      sceneState.superShots.render(ctx, this.stageWidth, this.groundY);
    }

    // 10. Spine Bones & Joints (Debugger View)
    if (options.showBones) {
      skeleton.getAllBones().forEach(b => this.spineDebugger.drawBone(ctx, b));
    }
    if (options.showJoints) {
      skeleton.getAllBones().forEach(b => this.spineDebugger.drawJoint(ctx, b));
    }

    // 11. Hitboxes (Debugger View)
    if (options.showHitboxes) {
      this.spineDebugger.drawHitboxes(ctx, player);
      if (sceneState.rivalBot && sceneState.rivalBot.enabled) {
        this.spineDebugger.drawHitboxes(ctx, sceneState.rivalBot);
      }
    }

    // 12. Soccer Ball
    this.drawSoccerBall(ctx, ball);

    // 13. Particles & Sparks
    particleSystem.render(ctx);

    // 13b. Celebratory Confetti Cannons
    this.stadiumRenderer.renderConfetti(ctx);

    // 14. Floating Comic Damage Numbers
    if (sceneState.collisionSystem) {
      sceneState.collisionSystem.renderFloatingTexts(ctx);
    }

    // 15. Camera Flash Overlay (Lightning / Thunder)
    if (this.flashAlpha > 0) {
      ctx.fillStyle = this.flashColor;
      ctx.globalAlpha = this.flashAlpha;
      ctx.fillRect(-20, -20, this.stageWidth + 40, this.stageHeight + 40);
      ctx.globalAlpha = 1.0;
      this.flashAlpha = Math.max(0, this.flashAlpha - 0.08);
    }

    ctx.restore();
  }

  drawSpeedLines(ctx, ball) {
    const speed = Math.hypot(ball.vx, ball.vy);
    if (speed < 520 && !ball.isSuper) return;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const alpha = Math.min(0.48, (speed - 480) / 900 + (ball.isSuper ? 0.28 : 0));
    ctx.strokeStyle = ball.isSuper ? `rgba(255, 95, 0, ${alpha})` : `rgba(0, 240, 255, ${alpha})`;
    ctx.lineWidth = 2.4;

    const angle = Math.atan2(ball.vy, ball.vx);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const lineCount = 12;

    for (let i = 0; i < lineCount; i++) {
      const offset = (i / lineCount) * this.stageHeight;
      const startX = cos > 0 ? (i % 2 === 0 ? 0 : 35) : (this.stageWidth - (i % 2 === 0 ? 0 : 35));
      const startY = offset + Math.sin(performance.now() * 0.008 + i) * 16;
      const len = 80 + Math.sin(performance.now() * 0.012 + i * 2) * 45;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + cos * len, startY + sin * len);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawProceduralBall(ctx, radius) {
    // Crisp authentic cartoon soccer ball with stitched pentagons
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#222222';
    ctx.stroke();

    // Center pentagon
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * Math.PI * 2) / 5 - Math.PI * 0.5;
      const px = Math.cos(a) * (radius * 0.42);
      const py = Math.sin(a) * (radius * 0.42);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();

    // Seam lines to outer rim
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.6;
    for (let i = 0; i < 5; i++) {
      const a = (i * Math.PI * 2) / 5 - Math.PI * 0.5;
      const innerX = Math.cos(a) * (radius * 0.42);
      const innerY = Math.sin(a) * (radius * 0.42);
      const outerX = Math.cos(a) * radius;
      const outerY = Math.sin(a) * radius;
      ctx.beginPath();
      ctx.moveTo(innerX, innerY);
      ctx.lineTo(outerX, outerY);
      ctx.stroke();
    }
  }

  drawSoccerBall(ctx, ball) {
    const speed = Math.hypot(ball.vx, ball.vy);
    const flightAngle = speed > 60 ? Math.atan2(ball.vy, ball.vx) : 0;

    ctx.save();
    ctx.translate(ball.x, ball.y);

    // Dynamic flight-vector elastic stretch
    if (speed > 80) {
      ctx.rotate(flightAngle);
      const sx = (ball.scale || 1) * (ball.squashX || 1);
      const sy = (ball.scale || 1) * (ball.squashY || 1);
      ctx.scale(sx, sy);
      ctx.rotate(-flightAngle);
    } else {
      const sx = (ball.scale || 1) * (ball.squashX || 1);
      const sy = (ball.scale || 1) * (ball.squashY || 1);
      if (sx !== 1 || sy !== 1) ctx.scale(sx, sy);
    }

    if (ball.alpha !== undefined && ball.alpha !== 1) {
      ctx.globalAlpha = ball.alpha;
    }

    // High Speed / Super Energy Corona
    if (ball.isSuper || speed > 440) {
      ctx.save();
      const glowColor = ball.isSuper
        ? ((ball.superColors && ball.superColors[0]) || '#ff3700')
        : (ball.shotType === 'bicycle' ? '#ffd700' : (ball.shotType === 'rocket' ? '#00f0ff' : '#00ffcc'));
      
      const pulse = 1.0 + Math.sin(performance.now() * 0.016) * 0.12;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = ball.isSuper ? 36 : 20;

      // Radiant energy aura
      const auraGrad = ctx.createRadialGradient(0, 0, ball.radius * 0.5, 0, 0, (ball.radius + 14) * pulse);
      auraGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
      auraGrad.addColorStop(0.5, glowColor);
      auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(0, 0, (ball.radius + 14) * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Supersonic shockwave ring
      if (speed > 580) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, ball.radius + 7, ball.radius * 0.65, flightAngle, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Roaring Anime Fireball Aura (Aerial Juggling Combo "¡EN LLAMAS!")
    if (ball.isOnFire) {
      ctx.save();
      const time = performance.now() * 0.015;
      const firePulse = 1.0 + Math.sin(time * 3) * 0.18;
      const isSuperFire = (ball.fireLevel || 1) >= 2;

      // Outer Heat Haze & Roaring Flame Corona
      ctx.shadowColor = isSuperFire ? '#ff0033' : '#ff7700';
      ctx.shadowBlur = isSuperFire ? 42 : 26;

      const fireGrad = ctx.createRadialGradient(0, 0, ball.radius * 0.35, 0, 0, (ball.radius + 18) * firePulse);
      fireGrad.addColorStop(0, '#ffffff');
      fireGrad.addColorStop(0.25, '#ffd700');
      fireGrad.addColorStop(0.65, isSuperFire ? '#ff2200' : '#ff7700');
      fireGrad.addColorStop(1, 'rgba(255, 0, 0, 0)');

      ctx.fillStyle = fireGrad;
      ctx.beginPath();
      ctx.arc(0, 0, (ball.radius + 18) * firePulse, 0, Math.PI * 2);
      ctx.fill();

      // Whirling solar flares / flame tongues
      const tongueCount = isSuperFire ? 8 : 6;
      ctx.fillStyle = isSuperFire ? 'rgba(255, 60, 0, 0.75)' : 'rgba(255, 150, 0, 0.75)';
      for (let i = 0; i < tongueCount; i++) {
        const ang = (i * Math.PI * 2) / tongueCount + time * 1.6;
        const len = (ball.radius + 10) + Math.sin(time * 4 + i) * 8;
        const fx = Math.cos(ang) * len;
        const fy = Math.sin(ang) * len;
        ctx.beginPath();
        ctx.arc(fx, fy, 6 * firePulse, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Ball texture & rolling spin
    ctx.save();
    ctx.rotate(ball.rotation);

    const ballImg = this.assetLoader.get('ball');
    if (ballImg && ballImg.complete && ballImg.naturalWidth > 0) {
      ctx.drawImage(ballImg, -ball.radius, -ball.radius, ball.radius * 2, ball.radius * 2);
    } else {
      this.drawProceduralBall(ctx, ball.radius);
    }
    ctx.restore();

    // Bomb timer overlay
    if (ball.isBomb) {
      const pulse = 0.5 + Math.abs(Math.sin(performance.now() * 0.015)) * 0.5;
      ctx.save();
      ctx.strokeStyle = '#ff0044';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#ff0044';
      ctx.shadowBlur = 24 * pulse;
      ctx.beginPath();
      ctx.arc(0, 0, ball.radius + 4, 0, Math.PI * 2);
      ctx.stroke();

      ctx.font = '900 13px "Outfit", sans-serif';
      ctx.fillStyle = '#ff0044';
      ctx.textAlign = 'center';
      ctx.fillText(`💣 ${(ball.bombTimer || 0).toFixed(1)}s`, 0, -ball.radius - 8);
      ctx.restore();
    }

    ctx.restore();
  }

  drawIceBlock(ctx, x, y, width = 94, height = 124) {
    ctx.save();
    ctx.translate(x, y);

    const grad = ctx.createLinearGradient(-width * 0.5, -height * 0.5, width * 0.5, height * 0.5);
    grad.addColorStop(0, 'rgba(165, 243, 252, 0.78)');
    grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.65)');
    grad.addColorStop(1, 'rgba(14, 165, 233, 0.82)');

    ctx.fillStyle = grad;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.88)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(-width * 0.5, -height * 0.5, width, height, 14);
    ctx.fill();
    ctx.stroke();

    // Specular Highlight Glare
    ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
    ctx.beginPath();
    ctx.moveTo(-width * 0.4, -height * 0.44);
    ctx.lineTo(width * 0.35, -height * 0.44);
    ctx.lineTo(-width * 0.1, -height * 0.15);
    ctx.closePath();
    ctx.fill();

    // Ice Cracks
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-width * 0.2, height * 0.2);
    ctx.lineTo(0, 0);
    ctx.lineTo(width * 0.3, height * 0.1);
    ctx.moveTo(0, 0);
    ctx.lineTo(-width * 0.1, -height * 0.25);
    ctx.stroke();

    // Floating Frost Crystals
    ctx.font = '18px "Segoe UI Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('❄️', -width * 0.35, -height * 0.32);
    ctx.fillText('❄️', width * 0.35, height * 0.32);

    ctx.restore();
  }

  drawEnergyShield(ctx, x, y, radius = 54) {
    ctx.save();
    ctx.translate(x, y);
    const time = (performance.now() / 1000) * 3;

    ctx.rotate(time * 0.6);
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 18;

    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const hx = Math.cos(angle) * radius;
      const hy = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 215, 0, 0.18)';
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  drawStunStars(ctx, headBone) {
    if (!headBone) return;
    ctx.save();
    const starCount = 4;
    const time = (performance.now() / 1000) * 7.5;
    const radiusX = 42;
    const radiusY = 16;
    const hx = headBone.worldX;
    const hy = headBone.worldY - 45;

    for (let i = 0; i < starCount; i++) {
      const angle = time + (i * (Math.PI * 2 / starCount));
      const sx = hx + Math.cos(angle) * radiusX;
      const sy = hy + Math.sin(angle) * radiusY;

      ctx.font = '22px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 12;
      ctx.fillText(i % 2 === 0 ? '⭐' : '💫', sx, sy);
    }
    ctx.restore();
  }
}
