import { AnimationClips } from './AnimationClip.js?v=anim_hd_v28';

/**
 * Advanced State Machine, Timeline Sequencer and Pose Blender for Head Soccer.
 * Implements smooth cubic cross-fading, procedural look-at ball tracking,
 * and dynamic elastic squash-and-stretch on athletic jump/landing impacts.
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

    // Cross-fade blending state (eliminates visual popping between actions)
    this.blendTimer = 0;
    this.blendDuration = 0.085; // 85ms snappy arcade transition
    this.prevPose = null;
    this.lastEvaluatedState = null;

    // Dynamic Squash & Stretch Spring Physics
    this.squashX = 0;
    this.squashY = 0;

    // Procedural Look-At ball tracking
    this.lookTarget = null; // { x, y }
    this.currentLookAngle = 0;

    this.onStateChangeCallbacks = [];
  }

  onStateChange(fn) {
    this.onStateChangeCallbacks.push(fn);
  }

  setLookTarget(x, y) {
    if (x === null || x === undefined) {
      this.lookTarget = null;
    } else {
      this.lookTarget = { x, y };
    }
  }

  triggerLandingSquash(force = 1.0) {
    const intensity = Math.min(1.8, Math.max(0.5, force));
    this.squashX = 0.16 * intensity;
    this.squashY = -0.18 * intensity;
  }

  triggerJumpStretch(force = 1.0) {
    const intensity = Math.min(1.6, Math.max(0.5, force));
    this.squashX = -0.10 * intensity;
    this.squashY = 0.14 * intensity;
  }

  play(animName) {
    if (!AnimationClips[animName]) return;
    
    // Prevent interrupting non-looping high-priority actions until almost finished
    if (this.currentAnim === animName && !AnimationClips[animName].loop) {
      if (this.animTime < AnimationClips[animName].duration * 0.92) {
        return;
      }
    }

    // Capture current snapshot for smooth cross-fading
    if (this.currentAnim !== animName && this.lastEvaluatedState) {
      this.prevPose = { ...this.lastEvaluatedState };
      this.blendTimer = this.blendDuration;
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

    // Evaluate current target clip
    const normalizedTime = Math.min(1.0, Math.max(0.0, this.animTime / clip.duration));
    let rawState = clip.evaluate(normalizedTime);

    // Apply smooth cubic Hermite cross-fading if blending from previous pose
    let state = rawState;
    if (this.blendTimer > 0 && this.prevPose) {
      const p = 1.0 - (this.blendTimer / this.blendDuration);
      // Smoothstep curve: 3p^2 - 2p^3
      const t = p * p * (3.0 - 2.0 * p);
      state = this.blendPoses(this.prevPose, rawState, t);
      this.blendTimer = Math.max(0, this.blendTimer - dt);
    }

    // Update elastic squash and stretch decay
    const decay = Math.exp(-dt * 15.0);
    this.squashX *= decay;
    this.squashY *= decay;

    // Procedural Look-At Head Tracking
    if (this.lookTarget && state.face !== 'ko') {
      const headBone = this.skeleton.head;
      const dx = (this.lookTarget.x - headBone.worldX) * (this.skeleton.facing || 1);
      const dy = this.lookTarget.y - headBone.worldY;
      const targetAngle = Math.atan2(dy, Math.max(15, dx)) * (180 / Math.PI);
      const clampedAngle = Math.max(-24, Math.min(26, targetAngle * 0.35));
      this.currentLookAngle += (clampedAngle - this.currentLookAngle) * Math.min(1.0, dt * 10.0);
    } else {
      this.currentLookAngle += (0 - this.currentLookAngle) * Math.min(1.0, dt * 8.0);
    }

    this.lastEvaluatedState = { ...state };
    this.applyToSkeleton(state);
    return state;
  }

  blendPoses(a, b, t) {
    const result = { ...b };
    const numericKeys = [
      'hipY', 'torsoRot', 'headRot', 'headScaleX', 'headScaleY', 'hairRot',
      'legFrontRot', 'footFrontRot', 'legBackRot', 'footBackRot',
      'armFrontRot', 'armBackRot'
    ];

    for (const key of numericKeys) {
      if (a[key] !== undefined && b[key] !== undefined) {
        result[key] = a[key] + (b[key] - a[key]) * t;
      }
    }
    return result;
  }

  applyToSkeleton(state) {
    const { hip, torso, head, hairRibbon, legFront, footFront, legBack, footBack, armFront, armBack } = this.skeleton;

    // Apply Hip with dynamic squash offset
    if (state.hipY !== undefined) {
      hip.y = state.hipY + this.squashY * 18.0;
    }
    if (state.torsoRot !== undefined) torso.rotation = state.torsoRot;
    
    // Apply Head with Look-At tracking and dynamic stretch
    if (state.headRot !== undefined) {
      head.rotation = state.headRot + this.currentLookAngle;
    }

    const baseScaleX = (state.headScaleX || 1.0) * this.headScaleMultiplier;
    const baseScaleY = (state.headScaleY || 1.0) * this.headScaleMultiplier;
    head.scaleX = baseScaleX * (1.0 + this.squashX);
    head.scaleY = baseScaleY * (1.0 + this.squashY);

    if (state.hairRot !== undefined && hairRibbon) {
      hairRibbon.rotation = state.hairRot;
    }

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
