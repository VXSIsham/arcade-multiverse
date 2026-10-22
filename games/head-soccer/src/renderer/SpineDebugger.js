/**
 * Visualizer for Spine 2D diamond bones, joint nodes, and collision hitboxes.
 */
export class SpineDebugger {
  constructor() {
    this.selectedBone = null;
  }

  setSelectedBone(bone) {
    this.selectedBone = bone;
  }

  drawBone(ctx, bone) {
    if (bone.length <= 0) return;
    const rad = bone.worldRotation * Math.PI / 180;
    const len = bone.length * bone.worldScaleX;
    const tipX = bone.worldX + Math.cos(rad) * len;
    const tipY = bone.worldY + Math.sin(rad) * len;

    const perpRad = rad + Math.PI / 2;
    const diamondW = Math.min(len * 0.22, 10);
    const midLen = len * 0.25;
    const midX = bone.worldX + Math.cos(rad) * midLen;
    const midY = bone.worldY + Math.sin(rad) * midLen;

    const side1X = midX + Math.cos(perpRad) * diamondW;
    const side1Y = midY + Math.sin(perpRad) * diamondW;
    const side2X = midX - Math.cos(perpRad) * diamondW;
    const side2Y = midY - Math.sin(perpRad) * diamondW;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(bone.worldX, bone.worldY);
    ctx.lineTo(side1X, side1Y);
    ctx.lineTo(tipX, tipY);
    ctx.lineTo(side2X, side2Y);
    ctx.closePath();

    const isSelected = bone === this.selectedBone;
    ctx.fillStyle = isSelected ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 255, 170, 0.22)';
    ctx.fill();
    ctx.strokeStyle = isSelected ? '#00f0ff' : '#00ffaa';
    ctx.lineWidth = isSelected ? 2.5 : 1.5;
    ctx.stroke();

    ctx.restore();
  }

  drawJoint(ctx, bone) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(bone.worldX, bone.worldY, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = bone === this.selectedBone ? '#00f0ff' : '#ffaa00';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Local red X axis
    const rad = bone.worldRotation * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(bone.worldX, bone.worldY);
    ctx.lineTo(bone.worldX + Math.cos(rad) * 14, bone.worldY + Math.sin(rad) * 14);
    ctx.strokeStyle = '#ff3344';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }

  drawHitboxes(ctx, player) {
    ctx.save();

    const isKicking = player.animController?.currentAnim === 'kick' || player.animController?.currentAnim === 'super_shot';
    const isJumping = player.animController?.currentAnim === 'jump' || !player.isGrounded;

    // 1. Kick Hitbox (Toe / Cleat Strike Zone)
    ctx.lineWidth = isKicking ? 3 : 1.5;
    ctx.setLineDash(isKicking ? [] : [3, 3]);
    ctx.strokeStyle = isKicking ? '#00f0ff' : 'rgba(0, 240, 255, 0.55)';
    ctx.fillStyle = isKicking ? 'rgba(0, 240, 255, 0.3)' : 'rgba(0, 240, 255, 0.08)';
    ctx.beginPath();
    ctx.arc(player.kickHitbox.x, player.kickHitbox.y, player.kickHitbox.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 2. Head Hitbox (Forehead / Header Strike Zone)
    ctx.lineWidth = isJumping ? 3 : 1.5;
    ctx.setLineDash(isJumping ? [] : [3, 3]);
    ctx.strokeStyle = isJumping ? '#ffd700' : 'rgba(255, 215, 0, 0.55)';
    ctx.fillStyle = isJumping ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 215, 0, 0.08)';
    ctx.beginPath();
    ctx.arc(player.headHitbox.x, player.headHitbox.y, player.headHitbox.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 3. Torso / Chest Hitbox (Control & Trap Zone)
    if (player.torsoHitbox) {
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = 'rgba(255, 120, 0, 0.55)';
      ctx.fillStyle = 'rgba(255, 120, 0, 0.08)';
      ctx.beginPath();
      ctx.arc(player.torsoHitbox.x, player.torsoHitbox.y, player.torsoHitbox.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }
}
