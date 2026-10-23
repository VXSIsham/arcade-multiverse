/**
 * Renders a Head Soccer character by binding sprites to the FK skeleton bones.
 * Appearance (head sprites, head pivot, jersey tint) comes from a roster entry
 * in data/Characters.js, so any character can be drawn on either side.
 */
export class CharacterRenderer {
  /**
   * @param {import('./AssetLoader.js').AssetLoader} assetLoader
   */
  constructor(assetLoader) {
    this.assetLoader = assetLoader;
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {import('../core/Skeleton.js').Skeleton} skeleton
   * @param {object} animState
   * @param {object} options
   * @param {object} options.character  Roster entry from Characters.js
   * @param {string} [options.jerseyFilter] Overrides character.jerseyFilter (alt kit)
   */
  render(ctx, skeleton, animState, options = {}) {
    const {
      showSkin = true,
      showMesh = false,
      headScale = 1.0,
      facing = 1,
      character,
      jerseyFilter
    } = options;
    if (!showSkin && !showMesh) return;

    const kit = jerseyFilter ?? character?.jerseyFilter ?? 'none';

    ctx.save();

    // Mirror horizontally around character root origin when facing left
    if (facing < 0) {
      ctx.translate(skeleton.root.x, skeleton.root.y);
      ctx.scale(-1, 1);
      ctx.translate(-skeleton.root.x, -skeleton.root.y);
    }

    // Character-specific signature ambient aura & particles
    this.drawAmbientEffects(ctx, skeleton, character, options.isSuperReady);

    // Glowing Super Power Aura behind character
    if (animState?.aura || options.isSuperReady) {
      this.drawSuperAura(ctx, skeleton, character);
    }

    if (showSkin) {
      this.drawBoot(ctx, skeleton.footBack, false, options);
      this.drawLeg(ctx, skeleton.legBack, false, kit, character, options);
      this.drawArm(ctx, skeleton.armBack, false, kit, character, options);
      this.drawJersey(ctx, skeleton.torso, kit, character, facing, options);
      this.drawNeck(ctx, skeleton.torso, skeleton.head, kit, character, options);
      this.drawLeg(ctx, skeleton.legFront, true, kit, character, options);
      this.drawBoot(ctx, skeleton.footFront, true, options);
      this.drawArm(ctx, skeleton.armFront, true, kit, character, options);
      if (animState?.face === 'strain' || animState?.face === 'power' || animState?.face === 'dragon') {
        this.drawKickSwoosh(ctx, skeleton.footFront, character);
      }
    }
    this.drawHead(ctx, skeleton.head, animState, headScale, showSkin, showMesh, character, {
      ...options,
      headWorldX: skeleton.head.worldX,
      headWorldY: skeleton.head.worldY,
      torsoWorldX: skeleton.torso.worldX,
      torsoWorldY: skeleton.torso.worldY
    });

    ctx.restore();
  }

  drawAmbientEffects(ctx, skeleton, character, isSuperReady) {
    if (!character) return;
    const root = skeleton.root;
    const time = performance.now() * 0.003;
    const id = character.id;

    ctx.save();
    ctx.translate(root.x, root.y);

    switch (id) {
      case 'phoenix': {
        // Floating fiery sparks rising from shoulders
        ctx.fillStyle = '#ff9100';
        for (let i = 0; i < 4; i++) {
          const t = (time * 1.5 + i * 0.25) % 1;
          const ex = Math.sin(t * 6.28 + i) * 28;
          const ey = -20 - t * 80;
          const r = (1 - t) * 4.5 + 1;
          ctx.globalAlpha = (1 - t) * 0.8;
          ctx.beginPath();
          ctx.arc(ex, ey, r, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }
      case 'frost': {
        // Drifting icy snowflakes & crystal sparks
        ctx.fillStyle = '#00ffff';
        for (let i = 0; i < 4; i++) {
          const t = (time + i * 0.25) % 1;
          const fx = Math.cos(t * 4 + i) * 32;
          const fy = -10 - t * 70;
          ctx.globalAlpha = (1 - t) * 0.85;
          ctx.fillRect(fx - 2, fy - 2, 4, 4);
        }
        break;
      }
      case 'poseidon': {
        // Ocean ripples at feet
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.6)';
        ctx.lineWidth = 2;
        const ringScale = (time * 0.8) % 1;
        ctx.globalAlpha = 1 - ringScale;
        ctx.beginPath();
        ctx.ellipse(0, 0, 36 * ringScale, 10 * ringScale, 0, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }
      case 'titan': {
        // Volcanic ground fissure glow
        ctx.fillStyle = '#ff5722';
        const pulse = 0.5 + Math.sin(time * 4) * 0.4;
        ctx.globalAlpha = pulse * 0.7;
        ctx.beginPath();
        ctx.ellipse(0, 0, 32, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case 'chrono': {
        // Quantum cyber holographic scan circle
        ctx.strokeStyle = '#00ffcc';
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.5 + Math.sin(time * 6) * 0.3;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.ellipse(0, -45, 48, 68, time, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        break;
      }
      case 'alien': {
        // Anti-gravity cosmic rings
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2;
        const rT = (time * 0.7) % 1;
        ctx.globalAlpha = (1 - rT) * 0.75;
        ctx.beginPath();
        ctx.ellipse(0, -rT * 60, 28, 8, 0, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }
      case 'anubis': {
        // Golden hieroglyphic desert sand
        ctx.fillStyle = '#ffd700';
        for (let i = 0; i < 3; i++) {
          const t = (time * 1.2 + i * 0.33) % 1;
          const sx = Math.sin(t * 8) * 26;
          const sy = -15 - t * 65;
          ctx.globalAlpha = (1 - t) * 0.7;
          ctx.beginPath();
          ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }
      case 'knight': {
        // Paladin divine glint
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.7)';
        ctx.lineWidth = 1.5;
        const pulse = Math.sin(time * 3);
        if (pulse > 0.4) {
          ctx.globalAlpha = (pulse - 0.4) * 1.5;
          ctx.beginPath();
          ctx.moveTo(-35, -50);
          ctx.lineTo(-35, -75);
          ctx.moveTo(-47, -62);
          ctx.lineTo(-23, -62);
          ctx.stroke();
        }
        break;
      }
    }
    ctx.restore();
  }

  drawSuperAura(ctx, skeleton, character) {
    const root = skeleton.root;
    const colors = character?.super?.colors || ['#ffd700', '#ff5500'];
    const time = performance.now() * 0.006;
    const pulse = 1.0 + Math.sin(time * 3) * 0.12;

    ctx.save();
    ctx.translate(root.x, root.y - 45);
    ctx.shadowColor = colors[0] || '#ffd700';
    ctx.shadowBlur = 28;

    const auraGrad = ctx.createRadialGradient(0, 0, 15, 0, 0, 85 * pulse);
    auraGrad.addColorStop(0, colors[1] || 'rgba(255, 215, 0, 0.45)');
    auraGrad.addColorStop(0.6, colors[0] || 'rgba(255, 85, 0, 0.35)');
    auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = auraGrad;

    ctx.beginPath();
    ctx.ellipse(0, 0, 65 * pulse, 85 * pulse, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawJersey(ctx, bone, kit, character, facing, options = {}) {
    const torsoImg = this.assetLoader.get('torso');
    if (!this.isReady(torsoImg)) return;

    ctx.save();
    ctx.translate(bone.worldX, bone.worldY);
    // Torso bone points upward (-90°); +90° compensation aligns sprite upright
    ctx.rotate((bone.worldRotation + 90) * Math.PI / 180);

    // Dynamic Athletic Breathing Cycle (Natural chest rise & fall)
    const time = performance.now() * 0.0035;
    const isExerted = options.currentAnim === 'run' || options.isDashing || !options.isGrounded;
    const breathRate = isExerted ? 6.5 : 3.2;
    const breathAmount = isExerted ? 0.045 : 0.026;
    const breathe = Math.sin(time * breathRate) * breathAmount;
    ctx.scale(1.0 + breathe * 0.5, 1.0 + breathe);

    if (kit && kit !== 'none') ctx.filter = kit;

    // Torso calibrated to 2:1 Chibi bobblehead proportion (width 64)
    const w = 64;
    const h = (torsoImg.height / torsoImg.width) * w;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 8;
    // Pivot centered on chest, neck collar sits right under head chin
    ctx.drawImage(torsoImg, -w * 0.50, -h * 0.36, w, h);

    // Reset filter for layered uniform detailing
    ctx.filter = 'none';

    // Athletic Fabric Highlights & Ribcage Depth
    const chestGrad = ctx.createRadialGradient(0, -h * 0.06, 4, 0, -h * 0.06, 22);
    chestGrad.addColorStop(0, 'rgba(255, 255, 255, 0.16)');
    chestGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.04)');
    chestGrad.addColorStop(1, 'rgba(0, 0, 0, 0.12)');
    ctx.fillStyle = chestGrad;
    ctx.beginPath();
    ctx.ellipse(0, -h * 0.06, 22, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3D Ribbed V-Neck / Crew Collar Front Rim
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.ellipse(0, -h * 0.34, 15, 5, 0, 0, Math.PI);
    ctx.stroke();

    // Team Championship Crest Badge on right chest
    ctx.save();
    ctx.translate(w * 0.22, -h * 0.14);
    if (facing < 0) ctx.scale(-1, 1);
    ctx.fillStyle = '#ffd700';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(4, -2);
    ctx.lineTo(4, 3);
    ctx.lineTo(0, 6);
    ctx.lineTo(-4, 3);
    ctx.lineTo(-4, -2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Star glint on crest
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -1, 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Detailed Team Number badge on jersey chest (NEVER mirrored backwards)
    const num = (character?.id === 'kenta' || !character) ? '10' : (character?.id === 'luchador' ? '7' : (character?.number || '9'));
    ctx.save();
    ctx.translate(0, -h * 0.02);
    if (facing < 0) {
      ctx.scale(-1, 1); // Un-mirror so number is never backwards
    }
    ctx.font = '900 13px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3.2;
    ctx.strokeText(num, 0, 0);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(num, 0, 0);
    ctx.restore();

    ctx.restore();
  }

  drawNeck(ctx, torsoBone, headBone, kit, character, options = {}) {
    if (!headBone || !torsoBone) return;

    ctx.save();
    // Anchor directly at head bone pivot (chin/jaw base)
    ctx.translate(headBone.worldX, headBone.worldY);
    ctx.rotate((torsoBone.worldRotation + 90) * Math.PI / 180);

    const time = performance.now() * 0.003;
    const breathe = Math.sin(time * 3.4) * 0.03;

    // Muscular neck geometry linking chin down into collar
    // Local coords: (0,0) is base of head bone. Chin extends down to ~12-14px. Torso collar is at ~22-26px.
    const neckTopW = 24;
    const neckBottomW = 32 * (1.0 + breathe * 0.4);
    const neckTopY = 2;
    const neckBottomY = 24;

    // Character-specific anatomical neck skin & collar design
    const id = character?.id || 'kenta';
    let skinBase = '#fed7aa'; // Anime warm peach skin
    let skinShadow = '#ea580c';
    let collarAccent = '#ffffff';

    switch (id) {
      case 'kenta':
        skinBase = '#ffedd5';
        skinShadow = '#ea580c';
        collarAccent = '#ffffff';
        break;
      case 'luchador':
        skinBase = '#16a34a'; // Emerald lucha cowl
        skinShadow = '#14532d';
        collarAccent = '#facc15';
        break;
      case 'viking':
        skinBase = '#fef08a';
        skinShadow = '#b45309';
        collarAccent = '#94a3b8';
        break;
      case 'samba':
        skinBase = '#f59e0b';
        skinShadow = '#92400e';
        collarAccent = '#00e676';
        break;
      case 'ninja':
        skinBase = '#0f172a'; // Full dark ninja cowl
        skinShadow = '#020617';
        collarAccent = '#7c3aed';
        break;
      case 'cyborg':
        skinBase = '#334155'; // Dark titanium chassis
        skinShadow = '#0f172a';
        collarAccent = '#00f0ff';
        break;
      case 'frost':
        skinBase = '#e0f2fe';
        skinShadow = '#0284c7';
        collarAccent = '#00ffff';
        break;
      case 'knight':
        skinBase = '#94a3b8'; // Steel gorget armor
        skinShadow = '#475569';
        collarAccent = '#ffd700';
        break;
      case 'anubis':
        skinBase = '#09090b'; // Jet black jackal neck
        skinShadow = '#000000';
        collarAccent = '#eab308';
        break;
      case 'alien':
        skinBase = '#c084fc';
        skinShadow = '#581c87';
        collarAccent = '#22d3ee';
        break;
      case 'phoenix':
        skinBase = '#fb923c';
        skinShadow = '#9a3412';
        collarAccent = '#ffd700';
        break;
      case 'titan':
        skinBase = '#292524'; // Volcanic basalt rock
        skinShadow = '#1c1917';
        collarAccent = '#f97316';
        break;
    }

    // 1. Shaded Muscular Neck Column
    const neckGrad = ctx.createLinearGradient(-neckBottomW * 0.5, neckTopY, neckBottomW * 0.5, neckBottomY);
    neckGrad.addColorStop(0, skinShadow);
    neckGrad.addColorStop(0.35, skinBase);
    neckGrad.addColorStop(0.7, skinBase);
    neckGrad.addColorStop(1, skinShadow);

    ctx.fillStyle = neckGrad;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.6;

    ctx.beginPath();
    ctx.moveTo(-neckTopW * 0.5, neckTopY);
    ctx.lineTo(neckTopW * 0.5, neckTopY);
    ctx.lineTo(neckBottomW * 0.5, neckBottomY);
    ctx.lineTo(-neckBottomW * 0.5, neckBottomY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Sternocleidomastoid Tendon / Throat Depth Line
    if (id !== 'ninja' && id !== 'cyborg') {
      ctx.strokeStyle = skinShadow;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-4, neckTopY + 2);
      ctx.lineTo(-5, neckBottomY - 4);
      ctx.moveTo(4, neckTopY + 2);
      ctx.lineTo(5, neckBottomY - 4);
      ctx.stroke();
    }

    // Special Cyborg Hydraulic Piston Neck Core
    if (id === 'cyborg') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-6, neckTopY, 12, neckBottomY - neckTopY);
      // Glowing Cyan Plasma Power Conduit
      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 8;
      ctx.fillRect(-2, neckTopY + 2, 4, neckBottomY - neckTopY - 4);
      ctx.shadowBlur = 0;
    }

    // Special Anubis Golden Pharaonic Collar (Usekh)
    if (id === 'anubis') {
      ctx.fillStyle = '#ffd700';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, neckBottomY - 4, 15, Math.PI, 0, true);
      ctx.fill();
      ctx.stroke();
      // Turquoise jewel insets
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(-8, neckBottomY - 7, 3, 3);
      ctx.fillRect(5, neckBottomY - 7, 3, 3);
    }

    // 2. Ribbed Jersey Collar Socket (Wraps base of neck)
    ctx.fillStyle = collarAccent;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.ellipse(0, neckBottomY - 2, neckBottomW * 0.52, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Dark collar inner recess
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.beginPath();
    ctx.ellipse(0, neckBottomY - 3, neckBottomW * 0.42, 3.0, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Organic Ambient Occlusion Shadow Cast by the Massive Chibi Jaw
    const chinShadow = ctx.createLinearGradient(0, neckTopY, 0, neckBottomY - 4);
    chinShadow.addColorStop(0, 'rgba(15, 23, 42, 0.65)');
    chinShadow.addColorStop(0.55, 'rgba(15, 23, 42, 0.24)');
    chinShadow.addColorStop(1, 'rgba(15, 23, 42, 0.0)');
    ctx.fillStyle = chinShadow;
    ctx.beginPath();
    ctx.moveTo(-neckTopW * 0.5, neckTopY);
    ctx.lineTo(neckTopW * 0.5, neckTopY);
    ctx.lineTo(neckBottomW * 0.5, neckBottomY - 4);
    ctx.lineTo(-neckBottomW * 0.5, neckBottomY - 4);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  drawArm(ctx, bone, isFront, kit, character, options = {}) {
    const armImg = this.assetLoader.get('arm');
    if (!bone || !this.isReady(armImg)) return;

    ctx.save();
    ctx.translate(bone.worldX, bone.worldY);
    // Align vertical arm sprite (sleeve top to fist bottom) along bone direction
    ctx.rotate((bone.worldRotation - 90) * Math.PI / 180);

    const w = isFront ? 22 : 18;
    const h = (armImg.height / armImg.width) * w;
    const filters = [];
    if (kit && kit !== 'none') filters.push(kit);
    if (!isFront) filters.push('brightness(0.72) saturate(0.9)');
    if (filters.length) ctx.filter = filters.join(' ');
    // Shoulder sleeve pivot at top center
    ctx.drawImage(armImg, -w * 0.50, -h * 0.12, w, h);
    ctx.filter = 'none';

    // Athletic Terrycloth Wristband (Muñequera Deportiva) near wrist
    const wristY = h * 0.58;
    const wristW = w * 0.85;
    ctx.fillStyle = isFront ? '#ffffff' : '#e2e8f0';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(-wristW * 0.5, wristY, wristW, 5.5, [2]);
    ctx.fill();
    ctx.stroke();

    // Contrasting team color stripe on wristband
    ctx.fillStyle = character?.super?.colors?.[0] || '#2563eb';
    ctx.fillRect(-wristW * 0.5 + 1, wristY + 2, wristW - 2, 1.8);

    ctx.restore();
  }

  drawHead(ctx, bone, animState, headScaleMultiplier, showSkin, showMesh, character, options = {}) {
    ctx.save();
    ctx.translate(bone.worldX, bone.worldY);
    // Head bone points upward (-90°); +90° compensation aligns head upright
    ctx.rotate((bone.worldRotation + 90) * Math.PI / 180);

    const hitFlash = options.hitFlashTimer || 0;
    const isStunned = options.isStunned || animState.face === 'ko' || (options.hp != null && options.hp < 40);

    // Apply authentic 1.25x Chibi caricature multiplier (Stable skull structure, no whole-head squashing on blinks)
    let sX = 1.25 * headScaleMultiplier * (animState.headScaleX || 1.0);
    let sY = 1.25 * headScaleMultiplier * (animState.headScaleY || 1.0);

    // Dynamic Header Contact Impact Squash & Rebound Stretch
    if (hitFlash > 0) {
      const flashRatio = hitFlash / 0.12;
      sX *= (1.0 + flashRatio * 0.16);
      sY *= (1.0 - flashRatio * 0.12);
    }

    // Stunned / Low-HP Jitter Tremble
    if (isStunned) {
      const time = performance.now() * 0.05;
      const jitterX = Math.sin(time) * 1.5;
      const jitterY = Math.cos(time * 1.3) * 1.0;
      ctx.translate(jitterX, jitterY);
    }

    ctx.scale(sX, sY);

    if (showSkin) {
      const headImg = this.pickHead(character, animState.face, options);
      if (this.isReady(headImg)) {
        const cfg = character?.head || { width: 104, pivotX: 0.50, pivotY: 0.88 };
        const w = cfg.width;
        const h = (headImg.height / headImg.width) * w;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.40)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 4;
        // Chin sits cleanly right above the jersey collar
        ctx.drawImage(headImg, -w * (cfg.pivotX ?? 0.50), -h * (cfg.pivotY ?? 0.88), w, h);
        ctx.shadowColor = 'transparent';

        // 1. 2.5D Volumetric Cranium & Jawline Depth Shading (Applied directly onto sprite via source-atop!)
        this.drawVolumetricHeadShading(ctx, w, h, cfg);

        // 2. Stadium Floodlight Rim Lighting (Fresnel specular highlight clipped to sprite hair crest)
        this.drawStadiumRimLight(ctx, w, h, cfg, character, options);

        // 3. Anime Hair Sheen & Specular Strata (Lustrous arcade hair glow on sprite)
        this.drawAnimeHairSheen(ctx, w, h, cfg, character);

        // 4. Dynamic Hair & Bangs Secondary Spring Physics (Elastic swaying in response to speed & jumps)
        this.drawHairSecondaryPhysics(ctx, w, h, character, animState, options);

        // 5. Living dynamic facial animations (Pupil ball-tracking, organic eyelids, dizzy spirals, cheek blush, nose bridge)
        this.drawDynamicFaceFeatures(ctx, w, h, character, animState, options);

        // 6. Character-specific Head Accessories & Signature Overlays (Bandana ribbons, horns, crowns)
        this.drawCharacterHeadOverlay(ctx, character, w, h, animState, options);
      }
    }

    // Spine 2D Mesh Wireframe overlay mode
    if (showMesh) {
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
      ctx.lineWidth = 1;
      for (let r = 0; r <= 4; r++) {
        ctx.beginPath();
        ctx.moveTo(-50, -85 + r * 21);
        ctx.lineTo(50, -85 + r * 21);
        ctx.stroke();
      }
      for (let c = 0; c <= 4; c++) {
        ctx.beginPath();
        ctx.moveTo(-50 + c * 25, -85);
        ctx.lineTo(-50 + c * 25, 0);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  drawVolumetricHeadShading(ctx, w, h, cfg) {
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';

    const pivotX = cfg?.pivotX ?? 0.50;
    const pivotY = cfg?.pivotY ?? 0.88;
    const bottomY = h * (1.0 - pivotY);
    const leftX = -w * pivotX;

    // Spherical ambient occlusion around lower jaw and cheek perimeter
    const jawGrad = ctx.createLinearGradient(0, bottomY - h * 0.28, 0, bottomY);
    jawGrad.addColorStop(0, 'rgba(15, 23, 42, 0.0)');
    jawGrad.addColorStop(0.6, 'rgba(15, 23, 42, 0.16)');
    jawGrad.addColorStop(1, 'rgba(15, 23, 42, 0.38)');
    ctx.fillStyle = jawGrad;
    ctx.fillRect(leftX, bottomY - h * 0.28, w, h * 0.28);
    ctx.restore();
  }

  drawStadiumRimLight(ctx, w, h, cfg, character, options) {
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';

    const pivotX = cfg?.pivotX ?? 0.50;
    const pivotY = cfg?.pivotY ?? 0.88;
    const topY = -h * pivotY;
    const leftX = -w * pivotX;

    // Upper hair crest floodlight rim gradient (illuminated by overhead stadium floodlights)
    const rimGrad = ctx.createLinearGradient(0, topY, 0, topY + h * 0.34);
    rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
    rimGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.22)');
    rimGrad.addColorStop(0.75, 'rgba(255, 255, 255, 0.06)');
    rimGrad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
    ctx.fillStyle = rimGrad;
    ctx.fillRect(leftX, topY, w, h * 0.34);

    // Subtle elemental aura hue along top hair tips
    const auraColor = character?.super?.colors?.[0];
    if (auraColor) {
      const auraGrad = ctx.createLinearGradient(0, topY, 0, topY + h * 0.18);
      auraGrad.addColorStop(0, auraColor.startsWith('#') ? `${auraColor}55` : 'rgba(0, 240, 255, 0.35)');
      auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = auraGrad;
      ctx.fillRect(leftX, topY, w, h * 0.18);
    }

    ctx.restore();
  }

  drawAnimeHairSheen(ctx, w, h, cfg, character) {
    const id = character?.id || 'kenta';
    if (id === 'ninja' || id === 'cyborg' || id === 'alien') return; // Handled with custom overlays

    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';

    const pivotY = cfg?.pivotY ?? 0.88;
    const topY = -h * pivotY;
    const sheenY = topY + h * 0.18;

    // Iconic fighting-game hair specular sheen band
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.beginPath();
    ctx.ellipse(-w * 0.10, sheenY, w * 0.28, 5, -0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(w * 0.18, sheenY + 4, w * 0.16, 4, 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Specular micro-dots
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.beginPath();
    ctx.arc(-w * 0.06, sheenY, 1.8, 0, Math.PI * 2);
    ctx.arc(w * 0.14, sheenY + 4, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawHairSecondaryPhysics(ctx, w, h, character, animState, options) {
    const vx = options.vx || 0;
    const vy = options.vy || 0;
    const facing = options.facing || 1;
    const airVx = vx * facing;
    // Aerodynamic hair drag (opposes horizontal movement)
    const dragX = -Math.max(-12, Math.min(12, airVx * 0.028));
    // Air resistance vertical lift (falling pushes hair tips UP, jumping compresses down)
    const liftY = -Math.max(-10, Math.min(10, vy * 0.022));
    const time = performance.now() * 0.006;
    const wind = Math.sin(time * 3.5) * 2.0;

    const id = character?.id || 'kenta';

    ctx.save();

    if (id === 'kenta') {
      // 3 Dynamic Spiky Anime Bangs swaying over forehead with spring physics
      const drawBang = (baseX, baseY, length, angleOffset, color) => {
        ctx.save();
        ctx.translate(baseX, baseY);
        const sway = (dragX + wind) * 0.45;
        const lift = liftY * 0.4;
        ctx.fillStyle = color;
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-4, 0);
        ctx.quadraticCurveTo(-2 + sway * 0.5, length * 0.5 + lift * 0.5, sway, length + lift);
        ctx.quadraticCurveTo(2 + sway * 0.5, length * 0.5 + lift * 0.5, 4, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      };

      // Spiky anime bangs along forehead rim
      drawBang(-w * 0.22, -h * 0.62, 14, 0, '#1e293b');
      drawBang(-w * 0.05, -h * 0.64, 16, 0, '#0f172a');
      drawBang(w * 0.12, -h * 0.60, 13, 0, '#1e293b');
    }

    if (id === 'ninja') {
      // Long Flowing Shinobi Scarf (Bufanda Ninja)
      ctx.save();
      ctx.translate(-w * 0.28, -h * 0.32);
      const scarfLength = 65;
      const nodes = 6;
      ctx.fillStyle = '#7c3aed';
      ctx.strokeStyle = '#4c1d95';
      ctx.lineWidth = 1.6;

      ctx.beginPath();
      ctx.moveTo(0, -5);
      for (let i = 1; i <= nodes; i++) {
        const t = i / nodes;
        const wave = Math.sin(time * 5 + i * 0.8) * (4 + i * 2.2);
        const nx = -t * scarfLength + dragX * t * 1.8;
        const ny = t * 12 + wave + liftY * t;
        ctx.lineTo(nx, ny - 4);
      }
      for (let i = nodes; i >= 1; i--) {
        const t = i / nodes;
        const wave = Math.sin(time * 5 + i * 0.8) * (4 + i * 2.2);
        const nx = -t * scarfLength + dragX * t * 1.8;
        const ny = t * 12 + wave + liftY * t;
        ctx.lineTo(nx, ny + 5);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    if (id === 'viking') {
      // Braided Golden Norse Beard swinging with pendulum inertia
      ctx.save();
      ctx.translate(w * 0.05, -h * 0.24);
      const beardSway = (dragX + wind) * 0.55;
      ctx.fillStyle = '#ca8a04';
      ctx.strokeStyle = '#713f12';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.quadraticCurveTo(-6 + beardSway, 14, beardSway, 24);
      ctx.quadraticCurveTo(6 + beardSway, 14, 10, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Steel beard ring
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(beardSway - 3, 16, 6, 3);
      ctx.restore();
    }

    if (id === 'knight') {
      // Crimson Feathered Helmet Plume waving in the wind
      ctx.save();
      ctx.translate(-w * 0.14, -h * 0.86);
      const plumeWave = Math.sin(time * 4) * 6 + dragX * 0.8;
      ctx.fillStyle = '#dc2626';
      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-18, -14 + plumeWave * 0.5, -34, -18 + plumeWave);
      ctx.quadraticCurveTo(-16, -6, 0, 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    if (id === 'alien') {
      // Gelatinous bouncy antennae with glowing bobbles
      const drawAntenna = (baseX, baseY) => {
        ctx.save();
        ctx.translate(baseX, baseY);
        const bounce = Math.sin(time * 7) * 4 + dragX * 0.3;
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(bounce * 0.5, -12, bounce, -22);
        ctx.stroke();
        // Luminous glowing orb
        ctx.fillStyle = '#22d3ee';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(bounce, -22, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };
      drawAntenna(-w * 0.22, -h * 0.82);
      drawAntenna(w * 0.22, -h * 0.82);
    }

    if (id === 'cyborg') {
      // Cyber Ear Exhaust Steam Puff when dashing / moving
      if (options.isDashing || Math.abs(airVx) > 120) {
        ctx.save();
        ctx.translate(-w * 0.38, -h * 0.44);
        const steamProgress = (time * 2) % 1;
        ctx.fillStyle = `rgba(0, 240, 255, ${0.7 * (1 - steamProgress)})`;
        ctx.beginPath();
        ctx.arc(-steamProgress * 18, -steamProgress * 6, 3 + steamProgress * 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    ctx.restore();
  }

  drawCharacterHeadOverlay(ctx, character, w, h, animState, options = {}) {
    if (!character || character.id === 'kenta') {
      this.drawHeadbandRibbon(ctx, w, h, animState, options);
    }
    if (!character) return;
    const time = performance.now() * 0.004;
    const id = character.id;

    ctx.save();
    switch (id) {
      case 'kenta': {
        // Headband ribbons handled above
        break;
      }
      case 'chrono': {
        // High-tech holographic scanline moving across cyber visor
        const scanY = -h * 0.46 + Math.sin(time * 3) * 12;
        ctx.strokeStyle = 'rgba(0, 255, 204, 0.85)';
        ctx.shadowColor = '#00ffcc';
        ctx.shadowBlur = 8;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-w * 0.22, scanY);
        ctx.lineTo(w * 0.22, scanY);
        ctx.stroke();
        break;
      }
      case 'titan': {
        // Molten lava veins pulsating in horn tips
        const pulse = 0.5 + Math.sin(time * 4) * 0.5;
        ctx.fillStyle = '#ff7700';
        ctx.shadowColor = '#ff3700';
        ctx.shadowBlur = 12 * pulse;
        ctx.globalAlpha = 0.7 * pulse;
        ctx.beginPath();
        ctx.arc(-w * 0.18, -h * 0.82, 6, 0, Math.PI * 2);
        ctx.arc(w * 0.32, -h * 0.76, 7, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case 'phoenix': {
        // Flickering crown flame shimmer
        const flicker = Math.sin(time * 8) * 4;
        ctx.fillStyle = '#ffd700';
        ctx.shadowColor = '#ff5722';
        ctx.shadowBlur = 14;
        ctx.globalAlpha = 0.65;
        ctx.beginPath();
        ctx.ellipse(0, -h * 0.84 + flicker, 12, 18, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case 'frost': {
        // Ice crystal crown shimmer
        const glint = Math.sin(time * 3.5);
        if (glint > 0.3) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.shadowColor = '#00ffff';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.moveTo(0, -h * 0.86);
          ctx.lineTo(0, -h * 0.76);
          ctx.moveTo(-5, -h * 0.81);
          ctx.lineTo(5, -h * 0.81);
          ctx.stroke();
        }
        break;
      }
      case 'poseidon': {
        // Golden trident crown shimmer
        const glint = Math.sin(time * 2.8);
        if (glint > 0.4) {
          ctx.fillStyle = 'rgba(255, 235, 59, 0.85)';
          ctx.shadowColor = '#ffd700';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(0, -h * 0.78, 4, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }
      case 'alien': {
        // Pulsing golden antenna tips
        const pulse = 0.5 + Math.sin(time * 5) * 0.45;
        ctx.fillStyle = '#ffd700';
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 10;
        ctx.globalAlpha = pulse;
        ctx.beginPath();
        ctx.arc(-w * 0.28, -h * 0.85, 4.5, 0, Math.PI * 2);
        ctx.arc(w * 0.28, -h * 0.85, 4.5, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
    }
    ctx.restore();
  }

  pickHead(character, face, options = {}) {
    let expr = 'idle';
    const isStunnedOrHurt = options.isStunned || (options.hp != null && options.hp < 40) || face === 'ko';
    const isAction = !options.isGrounded || options.isDashing || options.currentAnim === 'kick' ||
      ['rocket_kick', 'bicycle_kick', 'diving_header', 'scorpion_kick', 'smash_header', 'super_shot'].includes(options.currentAnim) ||
      face === 'strain' || face === 'power' || face === 'dragon';

    if (isStunnedOrHurt) {
      expr = 'ko';
    } else if (isAction) {
      expr = 'kick';
    }

    if (!character) {
      return this.assetLoader.get(expr === 'ko' ? 'headKo' : expr === 'kick' ? 'headKick' : 'headIdle');
    }
    return this.assetLoader.getHead(character.id, expr);
  }

  drawBoot(ctx, bone, isFront, options = {}) {
    const bootImg = this.assetLoader.get('boot');
    if (!this.isReady(bootImg)) return;

    ctx.save();
    ctx.translate(bone.worldX, bone.worldY);
    ctx.rotate(bone.worldRotation * Math.PI / 180);

    const w = isFront ? 48 : 42;
    const h = (bootImg.height / bootImg.width) * w;
    if (!isFront) ctx.filter = 'brightness(0.72) saturate(0.9)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 6;
    // Ankle collar pivot: sits right at ankle joint, cleat sole touches ground
    ctx.drawImage(bootImg, -w * 0.35, -h * 0.38, w, h);
    ctx.filter = 'none';

    // Molded High-Traction Cleat Studs (Tacos de Suela Deportivos)
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    const studY = h * 0.44;
    // Heel and toe cleats
    ctx.fillRect(-w * 0.22, studY, 4, 3.5);
    ctx.fillRect(-w * 0.08, studY + 1, 4, 3.5);
    ctx.fillRect(w * 0.14, studY + 1, 4, 3.5);
    ctx.fillRect(w * 0.32, studY, 4, 3.5);

    ctx.restore();
  }

  drawLeg(ctx, bone, isFront, kit, character, options = {}) {
    if (!bone) return;
    ctx.save();
    ctx.translate(bone.worldX, bone.worldY);
    ctx.rotate(bone.worldRotation * Math.PI / 180);

    const len = bone.length || 20;
    const w = isFront ? 14 : 12;

    const filters = [];
    if (kit && kit !== 'none') filters.push(kit);
    if (!isFront) filters.push('brightness(0.72) saturate(0.9)');
    if (filters.length) ctx.filter = filters.join(' ');

    // Athletic soccer sock (matching kit shorts)
    ctx.fillStyle = '#1e3a8a'; // Deep athletic navy/blue
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.6;

    ctx.beginPath();
    // Tapered muscular soccer calf shape with anatomical curve
    ctx.moveTo(0, -w * 0.55);
    ctx.quadraticCurveTo(len * 0.5, -w * 0.62, len + 2, -w * 0.42);
    ctx.lineTo(len + 2, w * 0.42);
    ctx.quadraticCurveTo(len * 0.5, w * 0.62, 0, w * 0.55);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Twin Championship White Accent Stripes on the sock
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(len * 0.35, -w * 0.50, 2.5, w * 1.0);
    ctx.fillRect(len * 0.60, -w * 0.48, 2.5, w * 0.96);

    // Athletic White Ankle Tape (Vendaje de compresión de tobillo)
    ctx.fillStyle = isFront ? '#f8fafc' : '#e2e8f0';
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(len - 4, -w * 0.46, 5, w * 0.92, [1]);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  drawHeadbandRibbon(ctx, w, h, animState, options = {}) {
    ctx.save();
    ctx.translate(-w * 0.36, -h * 0.56);

    const isFast = options.isDashing || options.currentAnim === 'run';
    const speed = isFast ? 0.016 : 0.009;
    const time = performance.now() * speed;
    const wave1 = Math.sin(time) * (isFast ? 8 : 4);
    const wave2 = Math.cos(time * 1.25) * (isFast ? 9 : 5);

    // Ribbon Knot
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.ellipse(0, 0, 4.5, 6, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Ribbon 1 (Main Upper Red Banner)
    ctx.fillStyle = '#dc2626';
    ctx.strokeStyle = '#7f1d1d';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, -4);
    ctx.quadraticCurveTo(-16, -10 + wave1, -36, -14 + wave1 * 1.6);
    ctx.lineTo(-30, -5 + wave1);
    ctx.quadraticCurveTo(-14, 0, 0, 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Ribbon 2 (Secondary lower tail)
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-14, 8 + wave2, -32, 12 + wave2 * 1.4);
    ctx.lineTo(-26, 18 + wave2);
    ctx.quadraticCurveTo(-12, 10, 0, 5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  drawDynamicFaceFeatures(ctx, w, h, character, animState, options = {}) {
    const isStunned = options.isStunned || animState.face === 'ko' || (options.hp != null && options.hp < 40);
    const isAction = !options.isGrounded || options.isDashing || options.currentAnim === 'kick' ||
      ['rocket_kick', 'bicycle_kick', 'diving_header', 'scorpion_kick', 'smash_header', 'super_shot'].includes(options.currentAnim) ||
      animState.face === 'strain' || animState.face === 'power';
    const isSuper = animState.face === 'power' || options.isSuperReady;
    const hitFlash = options.hitFlashTimer || 0;

    // Relative eye coordinates on Chibi caricature head
    // Front eye (forward-facing in 3/4 view)
    const eyeFrontX = w * 0.16;
    const eyeFrontY = -h * 0.46;
    // Back eye (nearer to center of face)
    const eyeBackX = -w * 0.14;
    const eyeBackY = -h * 0.46;

    // 1. STUNNED / KO FACIAL EXPRESSIONS
    if (isStunned) {
      const time = performance.now() * 0.006;
      // Animated Spinning Dizzy Spirals (@ @)
      const drawSpiral = (cx, cy, r) => {
        ctx.save();
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.8;
        ctx.shadowColor = '#eab308';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        const loops = 3;
        for (let a = 0; a <= Math.PI * 2 * loops; a += 0.25) {
          const curR = (a / (Math.PI * 2 * loops)) * r;
          const px = cx + Math.cos(a + time * 3) * curR;
          const py = cy + Math.sin(a + time * 3) * curR;
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.restore();
      };

      drawSpiral(eyeFrontX, eyeFrontY, 7);
      drawSpiral(eyeBackX, eyeBackY, 6);

      // Comical Wavy Dizzy Mouth
      ctx.save();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      const mouthY = -h * 0.26;
      ctx.moveTo(-w * 0.12, mouthY);
      ctx.quadraticCurveTo(-w * 0.06, mouthY - 4, 0, mouthY);
      ctx.quadraticCurveTo(w * 0.06, mouthY + 4, w * 0.12, mouthY);
      ctx.stroke();
      ctx.restore();

      // Dripping Animated Sweat Droplets
      const t = performance.now() * 0.004;
      const sweatProg = t % 1;
      const sweatY = -h * 0.58 + sweatProg * 24;
      const sweatAlpha = Math.sin(sweatProg * Math.PI);
      ctx.save();
      ctx.fillStyle = `rgba(103, 232, 249, ${0.9 * sweatAlpha})`;
      ctx.strokeStyle = `rgba(6, 182, 212, ${0.8 * sweatAlpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-w * 0.30, sweatY);
      ctx.bezierCurveTo(-w * 0.33, sweatY + 5, -w * 0.33, sweatY + 11, -w * 0.30, sweatY + 12);
      ctx.bezierCurveTo(-w * 0.27, sweatY + 11, -w * 0.27, sweatY + 5, -w * 0.30, sweatY);
      ctx.fill();
      ctx.stroke();
      // Specular highlight on sweat
      ctx.fillStyle = `rgba(255, 255, 255, ${sweatAlpha})`;
      ctx.beginPath();
      ctx.arc(-w * 0.31, sweatY + 8, 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    // Volumetric Athletic Cheek Blush / Exertion Glow (Adds warmth and organic vitality)
    if (character?.id !== 'ninja' && character?.id !== 'cyborg') {
      ctx.save();
      ctx.fillStyle = 'rgba(244, 63, 94, 0.15)';
      ctx.beginPath();
      ctx.ellipse(eyeFrontX - 2, eyeFrontY + 13, 8, 4.5, 0.1, 0, Math.PI * 2);
      ctx.ellipse(eyeBackX - 2, eyeBackY + 13, 7, 4.0, -0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Chibi Nose Bridge Contour with Specular Highlight
    if (character?.id !== 'ninja') {
      ctx.save();
      const noseX = w * 0.04;
      const noseY = -h * 0.36;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
      ctx.beginPath();
      ctx.arc(noseX, noseY, 2.0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.beginPath();
      ctx.arc(noseX - 0.6, noseY - 0.6, 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Athletic Perspiration Beads on Forehead during high-speed action
    if (isAction && character?.id !== 'cyborg') {
      const sweatTime = performance.now() * 0.003;
      ctx.save();
      ctx.fillStyle = 'rgba(186, 230, 253, 0.75)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 0.8;
      const sweatX = -w * 0.18 + Math.sin(sweatTime) * 2;
      const sweatY = -h * 0.64;
      ctx.beginPath();
      ctx.arc(sweatX, sweatY, 1.8, 0, Math.PI * 2);
      ctx.arc(w * 0.10, -h * 0.62, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // 2. DYNAMIC PUPIL & IRIS TRACKING THE BALL (The characters actually WATCH the ball!)
    let pupilShiftX = 0;
    let pupilShiftY = 0;

    if (options.ball) {
      // Find ball direction relative to head bone
      const headWorldX = options.headWorldX ?? 0;
      const headWorldY = options.headWorldY ?? 0;
      const facing = options.facing || 1;
      const dx = (options.ball.x - headWorldX) * facing;
      const dy = options.ball.y - headWorldY;
      const dist = Math.hypot(dx, dy) || 1;
      const maxShift = isAction ? 5.2 : 4.0;
      pupilShiftX = Math.max(-maxShift, Math.min(maxShift, (dx / dist) * maxShift));
      pupilShiftY = Math.max(-maxShift, Math.min(maxShift, (dy / dist) * maxShift));
    }

    // Natural Organic Blinking Cycle (140ms every 3.8s)
    const nowSec = performance.now() * 0.001;
    const charSeed = character ? character.id.charCodeAt(0) * 0.6 : 0;
    const blinkCycle = (nowSec + charSeed) % 3.8;
    const isBlinking = blinkCycle > 3.66;
    const blinkAmount = isBlinking ? Math.sin(((blinkCycle - 3.66) / 0.14) * Math.PI) : 0;

    // Draw Dynamic Pupils and Specular Eye Glints
    const drawEyeDetails = (cx, cy, rx, ry, isFront) => {
      ctx.save();
      // If blinking, smoothly sweep organic eyelid
      if (blinkAmount > 0.15) {
        ctx.fillStyle = '#fbcfe8'; // Soft skin tone base
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        const drop = ry * blinkAmount * 1.8;
        ctx.ellipse(cx, cy - ry + drop * 0.5, rx * 1.05, Math.max(1, drop * 0.6), 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx - rx, cy - ry + drop);
        ctx.quadraticCurveTo(cx, cy - ry + drop + 2, cx + rx, cy - ry + drop);
        ctx.stroke();
        ctx.restore();
        return;
      }

      // Dynamic Iris tracking
      const px = cx + pupilShiftX * (isFront ? 1.0 : 0.85);
      const py = cy + pupilShiftY * 0.85;

      // Iris Color derived from character identity
      let irisColor = '#0284c7'; // Vibrant athletic sky blue
      if (character?.id === 'titan') irisColor = '#ea580c';
      else if (character?.id === 'phoenix') irisColor = '#f59e0b';
      else if (character?.id === 'viking') irisColor = '#06b6d4';
      else if (character?.id === 'luchador') irisColor = '#16a34a';
      else if (character?.id === 'chrono') irisColor = '#00f0ff';
      else if (character?.id === 'alien') irisColor = '#a855f7';
      else if (character?.id === 'samba') irisColor = '#d97706';

      // Outer Iris Rim
      ctx.fillStyle = irisColor;
      ctx.beginPath();
      ctx.arc(px, py, isFront ? 4.2 : 3.6, 0, Math.PI * 2);
      ctx.fill();

      // Inner Pupil (Deep Black)
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(px, py, isFront ? 2.4 : 2.0, 0, Math.PI * 2);
      ctx.fill();

      // Specular Starburst Eye Glint (Upper-Left Reflection)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(px - 1.2, py - 1.2, isFront ? 1.4 : 1.1, 0, Math.PI * 2);
      ctx.arc(px + 1.2, py + 1.0, 0.7, 0, Math.PI * 2);
      ctx.fill();

      // Super Aura Eye Glow
      if (isSuper) {
        ctx.shadowColor = irisColor;
        ctx.shadowBlur = 10;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      ctx.restore();
    };

    drawEyeDetails(eyeFrontX, eyeFrontY, 6, 8, true);
    drawEyeDetails(eyeBackX, eyeBackY, 5, 7, false);

    // 3. BATTLE SQUINT & FURROWED BROWS (Active in sprint, jump, or kicks)
    if (isAction) {
      ctx.save();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      // Front brow (steep angled fierce slant down towards nose bridge)
      ctx.beginPath();
      ctx.moveTo(eyeFrontX + 8, eyeFrontY - 10);
      ctx.lineTo(eyeFrontX - 8, eyeFrontY - 6);
      ctx.stroke();
      // Back brow
      ctx.beginPath();
      ctx.moveTo(eyeBackX + 6, eyeBackY - 7);
      ctx.lineTo(eyeBackX - 8, eyeBackY - 10);
      ctx.stroke();

      // Anime Exertion / Rage Symbol (💢 cross) on temple
      const veinX = -w * 0.28;
      const veinY = -h * 0.70;
      const vTime = performance.now() * 0.008;
      const vScale = 1.0 + Math.sin(vTime) * 0.15;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.arc(veinX - 4 * vScale, veinY, 4 * vScale, -Math.PI * 0.5, Math.PI * 0.5);
      ctx.arc(veinX + 4 * vScale, veinY, 4 * vScale, Math.PI * 0.5, -Math.PI * 0.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(veinX, veinY - 4 * vScale, 4 * vScale, 0, Math.PI);
      ctx.arc(veinX, veinY + 4 * vScale, 4 * vScale, Math.PI, 0);
      ctx.stroke();
      ctx.restore();

      // Open Shouting Action Mouth (During kicks / headers)
      if (options.currentAnim === 'kick' || !options.isGrounded || animState.face === 'strain' || animState.face === 'power') {
        ctx.save();
        const mX = w * 0.04;
        const mY = -h * 0.24;
        // Mouth cavity (deep red)
        ctx.fillStyle = '#991b1b';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(mX, mY, 10, 7, 0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Upper white teeth bar
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(mX, mY - 3.5, 7.5, 2.5, 0.1, 0, Math.PI);
        ctx.fill();
        // Lower tongue curve
        ctx.fillStyle = '#f87171';
        ctx.beginPath();
        ctx.arc(mX, mY + 3, 4.5, Math.PI, 0);
        ctx.fill();
        ctx.restore();
      }
    }

    // 4. FOREHEAD IMPACT SWEETSPOT STARBURST (Triggered when ball hits forehead!)
    if (hitFlash > 0) {
      const flashRatio = hitFlash / 0.12;
      const fx = w * 0.24;
      const fy = -h * 0.60;
      ctx.save();
      ctx.translate(fx, fy);
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 24 * flashRatio;

      // Shockwave Ring Expanding
      ctx.strokeStyle = `rgba(255, 215, 0, ${flashRatio})`;
      ctx.lineWidth = 3.5 * flashRatio;
      ctx.beginPath();
      ctx.arc(0, 0, (1 - flashRatio) * 36 + 8, 0, Math.PI * 2);
      ctx.stroke();

      // 8-Point Impact Starburst
      ctx.fillStyle = `rgba(255, 255, 255, ${flashRatio})`;
      ctx.beginPath();
      const spikes = 8;
      const rOuter = 26 * flashRatio;
      const rInner = 8 * flashRatio;
      for (let s = 0; s < spikes * 2; s++) {
        const radius = s % 2 === 0 ? rOuter : rInner;
        const angle = (s * Math.PI) / spikes;
        const sx = Math.cos(angle) * radius;
        const sy = Math.sin(angle) * radius;
        if (s === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.closePath();
      ctx.fill();

      // Pure White Core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 5 * flashRatio, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  drawKickSwoosh(ctx, bone, character) {
    if (!bone) return;
    const colors = character?.super?.colors || ['#00f0ff', '#ffffff'];
    const primeColor = colors[0] || 'rgba(0, 240, 255, 0.9)';
    const accentColor = colors[1] || '#ffffff';

    ctx.save();
    ctx.translate(bone.worldX, bone.worldY);
    ctx.rotate(bone.worldRotation * Math.PI / 180);

    // Dynamic glowing elemental blade arc
    const grad = ctx.createLinearGradient(0, 0, 72, -45);
    grad.addColorStop(0, primeColor);
    grad.addColorStop(0.4, accentColor);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.shadowColor = primeColor;
    ctx.shadowBlur = 16;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(6, 12);
    ctx.quadraticCurveTo(58, -32, 78, -52);
    ctx.quadraticCurveTo(42, -22, 12, -6);
    ctx.closePath();
    ctx.fill();

    // Sharp energy sparks at the tip
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(72, -48, 3.5, 0, Math.PI * 2);
    ctx.arc(58, -36, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  isReady(img) {
    return img && img.complete && img.naturalWidth > 0;
  }
}
