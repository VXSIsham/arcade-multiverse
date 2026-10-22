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
      this.drawArm(ctx, skeleton.armBack, false, kit);
      this.drawBoot(ctx, skeleton.footBack, false);
      this.drawJersey(ctx, skeleton.torso, kit, character, facing);
      this.drawBoot(ctx, skeleton.footFront, true);
      if (animState?.face === 'strain' || animState?.face === 'power' || animState?.face === 'dragon') {
        this.drawKickSwoosh(ctx, skeleton.footFront, character);
      }
      this.drawArm(ctx, skeleton.armFront, true, kit);
    }
    this.drawHead(ctx, skeleton.head, animState, headScale, showSkin, showMesh, character, options.hp);

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

  drawJersey(ctx, bone, kit, character, facing) {
    const torsoImg = this.assetLoader.get('torso');
    if (!this.isReady(torsoImg)) return;

    ctx.save();
    ctx.translate(bone.worldX, bone.worldY);
    // Torso bone points upward (-90°); +90° compensation aligns sprite upright
    ctx.rotate((bone.worldRotation + 90) * Math.PI / 180);
    if (kit && kit !== 'none') ctx.filter = kit;

    const w = 72;
    const h = (torsoImg.height / torsoImg.width) * w;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 10;
    // Pivot centered on chest, slightly higher so shorts end above boots
    ctx.drawImage(torsoImg, -w * 0.50, -h * 0.58, w, h);

    // Reset filter for layered uniform detailing (number and collar)
    ctx.filter = 'none';

    // Detailed Gold Collar Line
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.85)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, -h * 0.44, 9, 0, Math.PI);
    ctx.stroke();

    // Detailed Team Number badge on jersey chest
    const num = facing > 0 ? '10' : '7';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 4;
    ctx.font = 'bold 13px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(num, 0, -h * 0.22);

    ctx.restore();
  }

  drawArm(ctx, bone, isFront, kit) {
    const armImg = this.assetLoader.get('arm');
    if (!bone || !this.isReady(armImg)) return;

    ctx.save();
    ctx.translate(bone.worldX, bone.worldY);
    ctx.rotate(bone.worldRotation * Math.PI / 180);

    const w = isFront ? 26 : 22;
    const h = (armImg.height / armImg.width) * w;
    const filters = [];
    if (kit && kit !== 'none') filters.push(kit);
    if (!isFront) filters.push('brightness(0.68) saturate(0.9)');
    if (filters.length) ctx.filter = filters.join(' ');
    // Shoulder pivot at top center
    ctx.drawImage(armImg, -w * 0.45, -h * 0.12, w, h);

    // Captain's Armband on Front Arm!
    if (isFront) {
      ctx.filter = 'none';
      ctx.fillStyle = '#ffd700';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      const bandY = h * 0.35;
      ctx.fillRect(-w * 0.42, bandY, w * 0.84, 9);
      ctx.strokeRect(-w * 0.42, bandY, w * 0.84, 9);

      // Captain "C"
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 8px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('C', 0, bandY + 4.5);
    }

    ctx.restore();
  }

  drawHead(ctx, bone, animState, headScaleMultiplier, showSkin, showMesh, character, hp = 100) {
    ctx.save();
    ctx.translate(bone.worldX, bone.worldY);
    // Head bone points upward (-90°); +90° compensation aligns head upright
    ctx.rotate((bone.worldRotation + 90) * Math.PI / 180);

    const sX = headScaleMultiplier * (animState.headScaleX || 1.0);
    const sY = headScaleMultiplier * (animState.headScaleY || 1.0);
    ctx.scale(sX, sY);

    if (showSkin) {
      const headImg = this.pickHead(character, animState.face);
      if (this.isReady(headImg)) {
        const cfg = character?.head || { width: 106, pivotX: 0.48, pivotY: 0.86 };
        const w = cfg.width;
        const h = (headImg.height / headImg.width) * w;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
        ctx.shadowBlur = 14;
        ctx.shadowOffsetY = 4;
        // Neck pivot sits at bone origin (jersey collar)
        ctx.drawImage(headImg, -w * cfg.pivotX, -h * cfg.pivotY, w, h);
        ctx.shadowColor = 'transparent';

        // Expressive low-HP sweat droplets
        if (hp < 45 || animState.face === 'ko') {
          const t = performance.now() * 0.005;
          const dropY = -h * 0.55 + (t % 1) * 12;
          ctx.fillStyle = 'rgba(125, 249, 255, 0.9)';
          ctx.beginPath();
          ctx.arc(-w * 0.28, dropY, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Flaring Eye Glint when in super power state
        if (animState.face === 'power') {
          ctx.shadowColor = '#00ffff';
          ctx.shadowBlur = 16;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(8, -h * 0.48, 4, 0, Math.PI * 2);
          ctx.fill();
        }
        // Character-specific Head Accessories / Glow overlays
        this.drawCharacterHeadOverlay(ctx, character, w, h, animState);
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

  drawCharacterHeadOverlay(ctx, character, w, h, animState) {
    if (!character) return;
    const time = performance.now() * 0.004;
    const id = character.id;

    ctx.save();
    switch (id) {
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

  pickHead(character, face) {
    let expr = 'idle';
    if (face === 'ko') expr = 'ko';
    else if (face === 'strain' || face === 'power' || face === 'dragon') expr = 'kick';
    if (!character) {
      return this.assetLoader.get(expr === 'ko' ? 'headKo' : expr === 'kick' ? 'headKick' : 'headIdle');
    }
    return this.assetLoader.getHead(character.id, expr);
  }

  drawBoot(ctx, bone, isFront) {
    const bootImg = this.assetLoader.get('boot');
    if (!this.isReady(bootImg)) return;

    ctx.save();
    ctx.translate(bone.worldX, bone.worldY);
    ctx.rotate(bone.worldRotation * Math.PI / 180);

    const w = isFront ? 50 : 44;
    const h = (bootImg.height / bootImg.width) * w;
    if (!isFront) ctx.filter = 'brightness(0.68) saturate(0.9)';
    // Ankle/heel pivot
    ctx.drawImage(bootImg, -w * 0.28, -h * 0.52, w, h);

    // Athletic Speed Swoosh / Stripe on boot
    ctx.filter = 'none';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-w * 0.12, -h * 0.15);
    ctx.quadraticCurveTo(0, -h * 0.05, w * 0.35, -h * 0.2);
    ctx.stroke();

    // Cleat Sole Studs underneath
    ctx.fillStyle = '#111111';
    for (let s = 0; s < 3; s++) {
      ctx.fillRect(-w * 0.15 + s * 14, h * 0.44, 4, 3);
    }

    ctx.restore();
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
