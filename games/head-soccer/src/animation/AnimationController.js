import { AnimationClips } from './AnimationClip.js';

/**
 * State machine and timeline player for character animations.
 */
export class AnimationController {
  /**
   * @param {import('../core/Skeleton.js').Skeleton} skeleton
   */
  constructor(skeleton) {
    this.skeleton = skeleton;
    this.currentAnim = 'idle';
    this.animTime = 0;
    this.isPlaying = true;
    this.speed = 1.0;
    this.headScaleMultiplier = 1.0;
    this.squashFactor = 1.2;

    this.onStateChangeCallbacks = [];
  }

  onStateChange(fn) {
    this.onStateChangeCallbacks.push(fn);
  }

  play(animName) {
    if (!AnimationClips[animName]) return;
    if (this.currentAnim === animName && !AnimationClips[animName].loop) {
      if (this.animTime < AnimationClips[animName].duration * 0.95) {
        return; // Let the action finish completely
      }
    }
    this.currentAnim = animName;
    this.animTime = 0;
    this.onStateChangeCallbacks.forEach(cb => cb(animName));
  }

  getClip() {
    return AnimationClips[this.currentAnim] || AnimationClips.idle;
  }

  update(dt) {
    const clip = this.getClip();

    if (this.isPlaying) {
      this.animTime += dt * this.speed;
      if (this.animTime >= clip.duration) {
        if (clip.loop) {
          this.animTime %= clip.duration;
        } else {
          this.animTime = clip.duration;
          this.play('idle');
        }
      }
    }

    const normalizedTime = Math.min(1.0, Math.max(0.0, this.animTime / clip.duration));
    const state = clip.evaluate(normalizedTime);

    this.applyToSkeleton(state);
    return state;
  }

  applyToSkeleton(state) {
    const { hip, torso, head, hairRibbon, legFront, footFront, legBack, footBack, armFront, armBack } = this.skeleton;

    if (state.hipY !== undefined) hip.y = state.hipY;
    if (state.torsoRot !== undefined) torso.rotation = state.torsoRot;
    if (state.headRot !== undefined) head.rotation = state.headRot;

    head.scaleX = (state.headScaleX || 1.0) * this.headScaleMultiplier;
    head.scaleY = (state.headScaleY || 1.0) * this.headScaleMultiplier;

    if (state.hairRot !== undefined) hairRibbon.rotation = state.hairRot;

    // Legs & Cleats
    if (state.legFrontRot !== undefined) legFront.rotation = state.legFrontRot;
    if (state.footFrontRot !== undefined) footFront.rotation = state.footFrontRot;
    if (state.legBackRot !== undefined) legBack.rotation = state.legBackRot;
    if (state.footBackRot !== undefined) footBack.rotation = state.footBackRot;

    // Arms
    if (state.armFrontRot !== undefined && armFront) armFront.rotation = state.armFrontRot;
    if (state.armBackRot !== undefined && armBack) armBack.rotation = state.armBackRot;

    this.skeleton.updateTransforms();
  }
}
