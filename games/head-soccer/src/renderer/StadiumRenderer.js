/**
 * Authentic Stadium & Goal System Renderer:
 * Advanced Goalposts with Metallic Tubular Shading, Hexagonal & Diamond Net Physics,
 * Localized Net Bulging on Ball Impact, Harmonic Post Vibration, LED Goal Sensors,
 * and Aerodynamic Corner Flags.
 */

import { GoalNetSimulation } from '../physics/NetPhysics.js';

export const GOAL_NET_STYLES = {
  HEXAGON: 'hexagon',
  DIAMOND: 'diamond',
  CLASSIC: 'classic'
};

export const GOAL_NET_COLORS = {
  CHAMPIONS: 'champions', // Deep silver white cords with golden tension seams
  CLASSIC: 'classic',     // Crisp stadium white
  GOLD: 'gold',           // Championship tournament gold
  NEON_CYAN: 'neon_cyan'  // Cyber arcade neon glow
};

export class StadiumRenderer {
  /**
   * @param {import('./AssetLoader.js').AssetLoader} assetLoader
   */
  constructor(assetLoader) {
    this.assetLoader = assetLoader;

    // Real-Time 2D Verlet Cloth Net Simulations
    this.leftNetSim = null;
    this.rightNetSim = null;
    this.lastStageWidth = 0;
    this.lastGroundY = 0;

    // Goal Configuration Properties (Clean, Bold Arcade Pro Goal)
    this.goalProps = {
      width: 72,
      height: 210,
      postRadius: 9,
      netStyle: GOAL_NET_STYLES.HEXAGON,
      netColor: GOAL_NET_COLORS.CHAMPIONS,
      postColor: '#ffffff',
      ledSensors: false,
      vibration: true,
      cornerFlags: false,
      paddingPads: false,
      laserLine: false
    };

    // Net bulge & dynamics (localized at impactY)
    this.leftNetBulge = 0;
    this.leftNetBulgeY = 0.5;
    this.rightNetBulge = 0;
    this.rightNetBulgeY = 0.5;

    // Physical post & crossbar harmonic vibration
    this.leftPostVibe = 0;
    this.leftCrossbarVibe = 0;
    this.rightPostVibe = 0;
    this.rightCrossbarVibe = 0;

    // Goal-line sensor LED celebration strobe
    this.leftGoalFlash = 0;
    this.rightGoalFlash = 0;
    this.leftGoalColor = '#ff3700';
    this.rightGoalColor = '#00ffcc';

    // Corner flag wind physics & bend
    this.flagTime = 0;
    this.leftFlagBend = 0;
    this.rightFlagBend = 0;

    // Celebratory Stadium Confetti Cannons
    this.confetti = [];
  }

  setGoalProps(newProps = {}) {
    Object.assign(this.goalProps, newProps);
  }

  initNets(stageWidth, groundY) {
    const goalH = this.goalProps.height || 210;
    const topY = groundY - goalH;
    this.leftNetSim = new GoalNetSimulation(false, 78, 6, topY, groundY, 7, 10);
    this.rightNetSim = new GoalNetSimulation(true, stageWidth - 78, stageWidth - 6, topY, groundY, 7, 10);
  }

  bulgeNet(isRight) {
    if (isRight) {
      this.rightNetBulge = 1.0;
      this.rightNetBulgeY = 0.5;
    } else {
      this.leftNetBulge = 1.0;
      this.leftNetBulgeY = 0.5;
    }
  }

  triggerNetImpact(isRight, impactY, speed = 250) {
    const goalH = this.goalProps.height || 210;
    const normY = Math.max(0.08, Math.min(0.92, (impactY - (this.lastGroundY - goalH)) / goalH));
    const bulgeIntensity = Math.min(1.65, 0.45 + (speed / 700) * 0.95);

    if (isRight) {
      this.rightNetBulge = Math.max(this.rightNetBulge, bulgeIntensity);
      this.rightNetBulgeY = normY;
    } else {
      this.leftNetBulge = Math.max(this.leftNetBulge, bulgeIntensity);
      this.leftNetBulgeY = normY;
    }

    const netSim = isRight ? this.rightNetSim : this.leftNetSim;
    if (netSim) {
      const dir = isRight ? 1 : -1;
      const push = Math.min(50, (speed / 180) * 16 * dir);
      for (const p of netSim.particles) {
        if (!p.pinned && Math.abs(p.y - impactY) < 70) {
          const factor = 1.0 - Math.abs(p.y - impactY) / 70;
          p.x += push * factor;
          p.oldX -= push * factor * 0.35;
        }
      }
    }
  }

  triggerPostHit(isRight, hitX, hitY, speed = 350, hitType = 'crossbar') {
    const vibeAmp = Math.min(1.0, 0.4 + (speed / 650) * 0.6);

    if (isRight) {
      if (hitType === 'post') {
        this.rightPostVibe = Math.max(this.rightPostVibe, vibeAmp);
      } else {
        this.rightCrossbarVibe = Math.max(this.rightCrossbarVibe, vibeAmp);
      }
      this.rightFlagBend = 0.75;
    } else {
      if (hitType === 'post') {
        this.leftPostVibe = Math.max(this.leftPostVibe, vibeAmp);
      } else {
        this.leftCrossbarVibe = Math.max(this.leftCrossbarVibe, vibeAmp);
      }
      this.leftFlagBend = -0.75;
    }
  }

  triggerGoalCelebration(isRightGoal, color = null) {
    if (isRightGoal) {
      this.rightGoalFlash = 1.0;
      this.rightGoalColor = color || '#00ffcc';
      this.rightNetBulge = 1.35;
      this.rightNetBulgeY = 0.48;
    } else {
      this.leftGoalFlash = 1.0;
      this.leftGoalColor = color || '#ff3700';
      this.leftNetBulge = 1.35;
      this.leftNetBulgeY = 0.48;
    }

    const netSim = isRightGoal ? this.rightNetSim : this.leftNetSim;
    if (netSim) {
      const dir = isRightGoal ? 1 : -1;
      for (const p of netSim.particles) {
        if (!p.pinned) {
          p.x += dir * (18 + Math.random() * 14);
          p.oldX -= dir * 8;
        }
      }
    }

    // Explosive Confetti Cannon blast across arena!
    const colors = ['#ffd700', '#ff0055', '#00f0ff', '#22c55e', '#a855f7', '#ff9100', '#ffffff'];
    const startX = isRightGoal ? (this.lastStageWidth - 78) : 78;
    for (let i = 0; i < 140; i++) {
      const angle = isRightGoal ? (-Math.PI * 0.5 - Math.random() * 0.95) : (-Math.PI * 0.5 + Math.random() * 0.95);
      const speed = Math.random() * 540 + 260;
      this.confetti.push({
        x: startX + (Math.random() - 0.5) * 50,
        y: (this.lastGroundY || 600) - (130 + Math.random() * 80),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        width: Math.random() * 9 + 5,
        height: Math.random() * 6 + 4,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 14,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1.0,
        decay: Math.random() * 0.28 + 0.20,
        flutterFreq: Math.random() * 8 + 4,
        flutterAmp: Math.random() * 65 + 30
      });
    }
  }

  update(dt, ball = null, soundManager = null) {
    this.flagTime += dt;

    if (this.leftNetSim && this.rightNetSim) {
      this.leftNetSim.update(dt, ball, soundManager);
      this.rightNetSim.update(dt, ball, soundManager);
    }

    // Net bulge decay
    if (this.leftNetBulge > 0) this.leftNetBulge = Math.max(0, this.leftNetBulge - dt * 2.1);
    if (this.rightNetBulge > 0) this.rightNetBulge = Math.max(0, this.rightNetBulge - dt * 2.1);

    // Harmonic vibration decay on posts & crossbars
    if (this.leftPostVibe > 0) this.leftPostVibe = Math.max(0, this.leftPostVibe - dt * 3.4);
    if (this.leftCrossbarVibe > 0) this.leftCrossbarVibe = Math.max(0, this.leftCrossbarVibe - dt * 3.4);
    if (this.rightPostVibe > 0) this.rightPostVibe = Math.max(0, this.rightPostVibe - dt * 3.4);
    if (this.rightCrossbarVibe > 0) this.rightCrossbarVibe = Math.max(0, this.rightCrossbarVibe - dt * 3.4);

    // LED sensor celebration flash decay
    if (this.leftGoalFlash > 0) this.leftGoalFlash = Math.max(0, this.leftGoalFlash - dt * 1.3);
    if (this.rightGoalFlash > 0) this.rightGoalFlash = Math.max(0, this.rightGoalFlash - dt * 1.3);

    // Corner flag elastic recovery
    this.leftFlagBend *= 0.93;
    this.rightFlagBend *= 0.93;

    // Confetti Physics simulation
    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const c = this.confetti[i];
      c.vy += 380 * dt; // gravity
      c.vx *= 0.965; // air drag
      c.x += (c.vx + Math.sin(this.flagTime * c.flutterFreq) * c.flutterAmp) * dt;
      c.y += c.vy * dt;
      c.rot += c.rotSpeed * dt;
      c.life -= c.decay * dt;
      if (c.life <= 0 || c.y > (this.lastGroundY || 700) + 20) {
        this.confetti.splice(i, 1);
      }
    }
  }

  renderConfetti(ctx) {
    if (!this.confetti || this.confetti.length === 0) return;
    ctx.save();
    for (const c of this.confetti) {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rot);
      ctx.scale(Math.cos(c.rot * 1.5), 1.0); // 3D ribbon flip
      ctx.fillStyle = c.color;
      ctx.globalAlpha = Math.max(0, Math.min(1, c.life * 1.8));
      ctx.fillRect(-c.width * 0.5, -c.height * 0.5, c.width, c.height);
      ctx.restore();
    }
    ctx.restore();
  }

  renderBackdrop(ctx, stageWidth, stageHeight, groundY) {
    this.lastGroundY = groundY;
    const stadiumImg = this.assetLoader.get('stadium');
    if (stadiumImg && stadiumImg.complete && stadiumImg.naturalWidth > 0) {
      ctx.drawImage(stadiumImg, 0, 0, stageWidth, stageHeight);

      // Top ambient vignette for HUD contrast
      const topGrad = ctx.createLinearGradient(0, 0, 0, 110);
      topGrad.addColorStop(0, 'rgba(4, 8, 16, 0.88)');
      topGrad.addColorStop(0.7, 'rgba(4, 8, 16, 0.45)');
      topGrad.addColorStop(1, 'rgba(4, 8, 16, 0)');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, stageWidth, 110);

      // Living stadium crowd flashbulbs
      if (Math.random() < 0.22) {
        ctx.save();
        const fx = Math.random() * stageWidth;
        const fy = 140 + Math.random() * (groundY - 260);
        const radius = Math.random() * 5 + 3;
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(fx, fy, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, groundY);
      grad.addColorStop(0, '#0c192c');
      grad.addColorStop(0.7, '#13243f');
      grad.addColorStop(1, '#1b3252');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, stageWidth, groundY);
    }

    // Lush Green Pitch Floor with Realistic Mowed Lawn Stripes
    const stripeWidth = 55;
    const numStripes = Math.ceil(stageWidth / stripeWidth);

    ctx.save();
    for (let i = 0; i < numStripes; i++) {
      const sx = i * stripeWidth;
      const isEven = i % 2 === 0;

      const stripeGrad = ctx.createLinearGradient(0, groundY, 0, stageHeight);
      if (isEven) {
        stripeGrad.addColorStop(0, '#28ad3b');
        stripeGrad.addColorStop(0.3, '#1f9331');
        stripeGrad.addColorStop(1, '#11551a');
      } else {
        stripeGrad.addColorStop(0, '#219b33');
        stripeGrad.addColorStop(0.3, '#188229');
        stripeGrad.addColorStop(1, '#0e4a16');
      }
      ctx.fillStyle = stripeGrad;
      ctx.fillRect(sx, groundY, stripeWidth, stageHeight - groundY);
    }
    ctx.restore();
  }

  renderPitchLine(ctx, stageWidth, groundY) {
    ctx.save();

    // Subtle drop shadow under touchline
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, groundY + 5);
    ctx.lineTo(stageWidth, groundY + 5);
    ctx.stroke();

    // Crisp White Touchline
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, groundY + 3);
    ctx.lineTo(stageWidth, groundY + 3);
    ctx.stroke();

    // Center Arc & Penalty Areas
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 3.5;

    // Center Arc
    ctx.beginPath();
    ctx.arc(stageWidth * 0.5, groundY + 3, 115, Math.PI, 0);
    ctx.stroke();

    // Center Spot
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(stageWidth * 0.5, groundY + 3, 6, 0, Math.PI * 2);
    ctx.fill();

    // Left Penalty Box
    ctx.beginPath();
    ctx.moveTo(0, groundY - 70);
    ctx.lineTo(170, groundY - 70);
    ctx.lineTo(170, groundY + 3);
    ctx.stroke();

    // Right Penalty Box
    ctx.beginPath();
    ctx.moveTo(stageWidth, groundY - 70);
    ctx.lineTo(stageWidth - 170, groundY - 70);
    ctx.lineTo(stageWidth - 170, groundY + 3);
    ctx.stroke();

    ctx.restore();
  }

  renderGoals(ctx, stageWidth, groundY) {
    this.lastGroundY = groundY;
    if (!this.leftNetSim || !this.rightNetSim || this.lastStageWidth !== stageWidth) {
      this.initNets(stageWidth, groundY);
      this.lastStageWidth = stageWidth;
    }
    const goalH = this.goalProps.height || 210;

    // Left Goal: Front post at x = 78, back wall at x = 6 (width = 72)
    this.drawAuthenticGoal(ctx, 78, 6, groundY, goalH, false);

    // Right Goal: Front post at x = stageWidth - 78, back wall at x = stageWidth - 6 (width = 72)
    this.drawAuthenticGoal(ctx, stageWidth - 78, stageWidth - 6, groundY, goalH, true);
  }

  drawAuthenticGoal(ctx, frontX, backX, groundY, height, isRight) {
    ctx.save();
    const topY = groundY - height;

    // Vibration dynamics
    const postVibeAmp = isRight ? this.rightPostVibe : this.leftPostVibe;
    const barVibeAmp = isRight ? this.rightCrossbarVibe : this.leftCrossbarVibe;
    const postVibeX = Math.sin(this.flagTime * 46) * postVibeAmp * 4.2;
    const barVibeY = Math.sin(this.flagTime * 46) * barVibeAmp * 4.2;

    const vFrontX = frontX + postVibeX;
    const vTopY = topY + barVibeY;

    // Net bulge & celebration flash
    const bulge = isRight ? this.rightNetBulge : this.leftNetBulge;
    const flash = isRight ? this.rightGoalFlash : this.leftGoalFlash;
    const flashColor = isRight ? this.rightGoalColor : this.leftGoalColor;

    const postRadius = this.goalProps.postRadius || 9;
    const tubeR = postRadius;
    const cornerR = postRadius * 1.5;
    const minX = Math.min(vFrontX, backX);
    const maxX = Math.max(vFrontX, backX);
    const goalDepth = Math.abs(vFrontX - backX);

    // 1. Goal Turf Shadow (Soft ambient occlusion on the pitch turf)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
    ctx.beginPath();
    ctx.ellipse((vFrontX + backX) * 0.5, groundY + 3, goalDepth * 0.55, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Goal Cavity 3D Interior Darkening (Gives genuine depth inside the net)
    const cavityGrad = ctx.createLinearGradient(vFrontX, 0, backX, 0);
    cavityGrad.addColorStop(0, 'rgba(10, 18, 30, 0.08)');
    cavityGrad.addColorStop(1, 'rgba(5, 10, 20, 0.35)');
    ctx.fillStyle = cavityGrad;
    ctx.beginPath();
    ctx.moveTo(vFrontX, vTopY);
    ctx.lineTo(backX, topY);
    ctx.lineTo(backX, groundY);
    ctx.lineTo(vFrontX, groundY);
    ctx.closePath();
    ctx.fill();

    // 3. Rear Support Frame (The rear curved stanchion tubes BEHIND the net)
    // Upper horizontal extension tube from front post to back wall
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(vFrontX, vTopY);
    ctx.lineTo(backX, topY);
    ctx.stroke();

    // Rear vertical back post curving down to ground
    ctx.beginPath();
    ctx.moveTo(backX, topY);
    ctx.quadraticCurveTo(backX + (isRight ? 6 : -6), (topY + groundY) * 0.5, backX, groundY);
    ctx.stroke();

    // Rear ground anchor rail (sits on the turf at the back wall only)
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(backX, groundY);
    ctx.lineTo(backX + (isRight ? -14 : 14), groundY);
    ctx.stroke();

    // Rear support metallic highlight (inner shine on rear steel)
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(vFrontX, vTopY + 1);
    ctx.lineTo(backX, topY + 1);
    ctx.lineTo(backX, groundY);
    ctx.stroke();

    // 4. Net Shading & Verlet Cloth Rendering
    let netStroke = 'rgba(255, 255, 255, 0.55)';
    if (this.goalProps.netColor === GOAL_NET_COLORS.GOLD) {
      netStroke = 'rgba(255, 215, 0, 0.65)';
    } else if (this.goalProps.netColor === GOAL_NET_COLORS.NEON_CYAN) {
      netStroke = 'rgba(0, 240, 255, 0.65)';
    } else if (flash > 0) {
      netStroke = flashColor;
    } else if (bulge > 0.1) {
      netStroke = 'rgba(255, 255, 255, 0.88)';
    }

    const netSim = isRight ? this.rightNetSim : this.leftNetSim;
    if (netSim) {
      netSim.render(ctx, netStroke, this.goalProps.netStyle);
    } else {
      ctx.save();
      ctx.strokeStyle = netStroke;
      ctx.lineWidth = 1.4;
      const netSpacing = 16;
      for (let y = topY; y <= groundY; y += netSpacing) {
        ctx.beginPath();
        ctx.moveTo(vFrontX, y);
        ctx.lineTo(backX, y);
        ctx.stroke();
      }
      for (let x = minX; x <= maxX; x += netSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, topY);
        ctx.lineTo(x, groundY);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 5. Goal Line Turf Chalk Marking (Authentic pitch line, NOT floating laser)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(vFrontX - 3, groundY - 2, 6, 4);

    // Optional LED Sensor (celebration flash on goal)
    if (this.goalProps.ledSensors && flash > 0) {
      ctx.save();
      ctx.strokeStyle = flashColor;
      ctx.lineWidth = 4;
      ctx.shadowColor = flashColor;
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.moveTo(backX, topY);
      ctx.lineTo(vFrontX, vTopY);
      ctx.stroke();
      ctx.restore();
    }

    // 6. TOP CROSSBAR ONLY (Open Goal Mouth - No vertical front post obstructing goals!)
    const outlineColor = '#0f172a';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = (tubeR * 2) + 4; // 2px dark border

    // Dark outline on top horizontal crossbar
    ctx.beginPath();
    ctx.moveTo(backX, vTopY);
    ctx.lineTo(vFrontX, vTopY);
    ctx.stroke();

    // Crossbar Horizontal Gradient
    const crossbarGrad = ctx.createLinearGradient(0, vTopY - tubeR, 0, vTopY + tubeR);
    crossbarGrad.addColorStop(0, '#ffffff');  // top light bounce
    crossbarGrad.addColorStop(0.35, '#f8fafc'); // specular highlight
    crossbarGrad.addColorStop(0.7, '#cbd5e1'); // core metal
    crossbarGrad.addColorStop(1, '#64748b');  // underside shadow

    // Crossbar metallic body
    ctx.strokeStyle = crossbarGrad;
    ctx.lineWidth = tubeR * 2;
    ctx.beginPath();
    ctx.moveTo(backX, vTopY);
    ctx.lineTo(vFrontX, vTopY);
    ctx.stroke();

    // Specular Razor-Sharp Glare Line along top of crossbar
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(backX, vTopY - tubeR * 0.4);
    ctx.lineTo(vFrontX, vTopY - tubeR * 0.4);
    ctx.stroke();

    ctx.restore();
  }
}
