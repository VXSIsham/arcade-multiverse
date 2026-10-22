/**
 * Head Soccer Charge System.
 * Enables holding down kick, super shot, or jump to accumulate devastating shot power.
 */
export class ChargeSystem {
  constructor() {
    this.isCharging = false;
    this.chargingAction = null;
    this.chargeTime = 0;
    this.maxChargeTime = 0.85; // 0.85s to reach 100% max overdrive
    this.humTimer = 0;
    this.chargeOffset = { x: 0, y: 0 };
  }

  startCharge(action) {
    if (this.isCharging && this.chargingAction === action) return;
    this.isCharging = true;
    this.chargingAction = action;
    this.chargeTime = 0;
    this.humTimer = 0;
  }

  getRatio() {
    return Math.min(1.0, this.chargeTime / this.maxChargeTime);
  }

  update(dt, player, particleSystem, soundManager) {
    if (!this.isCharging) {
      this.chargeOffset.x = 0;
      this.chargeOffset.y = 0;
      return;
    }

    this.chargeTime += dt;
    const ratio = this.getRatio();

    // Wind-up tension vibration
    this.chargeOffset.x = (Math.random() - 0.5) * (ratio * 3.5);
    this.chargeOffset.y = (Math.random() - 0.5) * (ratio * 2.0);

    // Audio frequency buildup
    this.humTimer -= dt;
    if (this.humTimer <= 0) {
      this.humTimer = 0.08;
      soundManager.playChargeHum(ratio);
    }

    // Inward particle suction / electric arcs
    const px = player.x;
    const py = player.y - 45;
    if (this.chargingAction === 'super_shot') {
      particleSystem.spawnFlameAura(px, py);
    } else {
      if (Math.random() < ratio * 0.75 + 0.25) {
        particleSystem.spawnSparks(
          px + (Math.random() - 0.5) * 60,
          py + (Math.random() - 0.5) * 60,
          2,
          ratio > 0.8 ? '#ff3700' : '#00ffff'
        );
      }
    }
  }

  releaseCharge() {
    if (!this.isCharging) {
      return null;
    }

    const action = this.chargingAction;
    const ratio = this.getRatio();
    const isCharged = ratio > 0.18;

    // Power multiplier: 1.0x (tap) to 2.8x (full kick), or 3.6x (super shot)
    const baseMult = action === 'super_shot' ? 1.8 : 1.0;
    const maxBonus = action === 'super_shot' ? 1.8 : 1.8;
    const powerMult = baseMult + (isCharged ? ratio * maxBonus : 0);

    this.isCharging = false;
    this.chargingAction = null;
    this.chargeTime = 0;
    this.chargeOffset.x = 0;
    this.chargeOffset.y = 0;

    return {
      action,
      powerMult,
      isCharged,
      ratio
    };
  }

  cancel() {
    this.isCharging = false;
    this.chargingAction = null;
    this.chargeTime = 0;
    this.chargeOffset.x = 0;
    this.chargeOffset.y = 0;
  }

  render(ctx, player) {
    if (!this.isCharging) return;

    const ratio = this.getRatio();
    const barW = 84;
    const barH = 11;
    const barX = player.x - barW / 2;
    const barY = player.y - 122;

    ctx.save();

    // Backdrop Pill
    ctx.fillStyle = 'rgba(10, 15, 25, 0.85)';
    ctx.strokeStyle = ratio >= 0.95 ? '#ffffff' : (this.chargingAction === 'super_shot' ? '#ff3700' : '#00f0ff');
    ctx.lineWidth = ratio >= 0.95 ? 2.5 : 1.5;
    if (ratio >= 0.95) {
      ctx.shadowColor = '#ffcc00';
      ctx.shadowBlur = 12;
    }

    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, 5);
    ctx.fill();
    ctx.stroke();

    // Fill Gradient
    const fillW = Math.max(0, (barW - 4) * ratio);
    const grad = ctx.createLinearGradient(barX, barY, barX + barW, barY);
    if (this.chargingAction === 'super_shot') {
      grad.addColorStop(0, '#ff9900');
      grad.addColorStop(0.7, '#ff3700');
      grad.addColorStop(1, '#ff0055');
    } else {
      grad.addColorStop(0, '#00e5ff');
      grad.addColorStop(0.6, '#ffd700');
      grad.addColorStop(1, '#ff3700');
    }

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(barX + 2, barY + 2, fillW, barH - 4, 3);
    ctx.fill();

    // Percentage Label
    ctx.font = '900 9px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    const label = ratio >= 0.98 ? '★ MAX OVERDRIVE ★' : `CHARGE ${Math.floor(ratio * 100)}%`;
    ctx.fillText(label, player.x, barY + 9);

    ctx.restore();
  }
}
