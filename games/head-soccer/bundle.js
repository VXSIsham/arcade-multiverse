(function(){
const __mods = {};
const __cache = {};
function __req(id) {
  if (__cache[id]) return __cache[id];
  const exports = {};
  __cache[id] = exports;
  if (!__mods[id]) throw new Error("Module not found: " + id);
  __mods[id](exports, __req);
  return exports;
}

__mods['animation/AnimationClip.js'] = function(exports, __req) {
/**
 * Authentic Head Soccer Arcade Keyframe Animation Engine.
 * Features realistic athletic sprint physics, explosive multi-phase kick snaps,
 * contralateral arm swings, and secondary harmonic follow-through.
 */
const AnimationClips = {
  idle: {
    name: 'idle',
    duration: 0.85,
    loop: true,
    evaluate: (t) => {
      // Natural athletic striker balance bounce & rhythmic breathing
      const cycle = t * Math.PI * 2;
      const bounce = Math.sin(cycle);
      const squash = Math.cos(cycle);
      const lag = Math.sin(cycle - 0.45); // Harmonic secondary lag

      return {
        hipY: -32 + bounce * 2.2,
        torsoRot: bounce * 1.8,
        headRot: -bounce * 2.2,
        headScaleX: 1.0 + squash * 0.025,
        headScaleY: 1.0 - squash * 0.025,
        hairRot: 35 + lag * 10,
        legFrontRot: 195 + bounce * 2.5,
        footFrontRot: -105 + bounce * 3.5,
        legBackRot: 165 - bounce * 2.0,
        footBackRot: -75 - bounce * 2.5,
        armFrontRot: 175 + bounce * 5,
        armBackRot: 185 - bounce * 5,
        face: 'idle'
      };
    }
  },

  run: {
    name: 'run',
    duration: 0.38, // Fast, high-energy athletic sprint cadence
    loop: true,
    evaluate: (t) => {
      // High-cadence professional soccer sprint with contralateral arm drive
      const cycle = t * Math.PI * 2;
      const sin = Math.sin(cycle);
      const cos = Math.cos(cycle);
      const footStrike = Math.abs(Math.sin(cycle)); // dips on each foot contact
      const doubleStep = Math.sin(cycle * 2);

      return {
        hipY: -32 - footStrike * 5.2,
        torsoRot: -15 + doubleStep * 2.5, // aggressive aerodynamic forward lean
        headRot: -sin * 4.5,
        headScaleX: 1.03,
        headScaleY: 0.97,
        hairRot: 65 + sin * 18, // hair whips back in the windstream
        // High knee lift and deep backward push-off
        legFrontRot: 195 + sin * 52,
        footFrontRot: -105 + cos * 38,
        legBackRot: 195 - sin * 52,
        footBackRot: -105 - cos * 38,
        // Contralateral athletic sprint arm pumping (opposite arm to leg)
        armFrontRot: 180 - sin * 52,
        armBackRot: 180 + sin * 52,
        face: 'idle'
      };
    }
  },

  kick: {
    name: 'kick',
    duration: 0.22, // Ultra-snappy explosive arcade kick
    loop: false,
    evaluate: (t) => {
      let hipY = -32;
      let legAngle = 195;
      let footAngle = -105;
      let torsoRot = 0;
      let headRot = 0;
      let armFrontRot = 175;
      let armBackRot = 185;
      let face = 'strain';

      if (t < 0.22) {
        // 1. Deep Anticipation: coiling backswing & hip torque
        const p = t / 0.22;
        const ease = p * p;
        legAngle = 195 + ease * 50; // pulls leg back to 245°
        footAngle = -105 - ease * 25;
        torsoRot = -ease * 16;      // torso coils back
        headRot = ease * 8;
        hipY = -32 - ease * 4;
        armFrontRot = 175 + ease * 35; // coils back to 210°
        armBackRot = 185 - ease * 35;  // counters forward to 150°
      } else if (t < 0.58) {
        // 2. Explosive Ball-Striking Whip Snap!
        const p = (t - 0.22) / 0.36;
        // Cubic ease-out snap
        const ease = 1.0 - Math.pow(1.0 - p, 3);
        legAngle = 245 - ease * 165; // snaps violently through ball to 80°
        footAngle = -130 + ease * 145; // foot locks into rigid pointed drive
        torsoRot = -16 + ease * 30;  // chest drives forward over ball
        headRot = 8 - ease * 18;
        hipY = -36 + ease * 6;
        armFrontRot = 210 - ease * 105; // whips forward to 105° (chest drives over ball)
        armBackRot = 150 + ease * 95;   // whips back to 245°
      } else {
        // 3. Elastic Recoil & Recovery Ease
        const p = (t - 0.58) / 0.42;
        const ease = Math.sin(p * Math.PI * 0.5);
        legAngle = 80 + ease * 115;
        footAngle = 15 - ease * 120;
        torsoRot = 14 - ease * 14;
        headRot = -10 + ease * 10;
        hipY = -30 - ease * 2;
        armFrontRot = 105 + ease * 70;  // settles back to 175°
        armBackRot = 245 - ease * 60;   // settles back to 185°
        face = 'idle';
      }

      return {
        hipY,
        torsoRot,
        headRot,
        headScaleX: 1.06,
        headScaleY: 0.94,
        hairRot: 40 - torsoRot * 1.2,
        legFrontRot: legAngle,
        footFrontRot: footAngle,
        legBackRot: 165,
        footBackRot: -75,
        armFrontRot,
        armBackRot,
        face
      };
    }
  },

  jump: {
    name: 'jump',
    duration: 0.52,
    loop: false,
    evaluate: (t) => {
      // 3-Phase Aerial Athletic Physics: Crouch -> Apex Header Coil -> Touchdown Prep
      let hipY = -32;
      let legFront = 195;
      let footFront = -105;
      let legBack = 165;
      let footBack = -75;
      let torsoRot = 0;
      let headRot = 0;
      let armFront = 175;
      let armBack = 185;

      if (t < 0.40) {
        // Ascent & Tuck Phase: Knees tuck close to chest, arms elevate for momentum
        const p = t / 0.40;
        const arc = Math.sin(p * Math.PI * 0.5);
        hipY = -32 - arc * 12;
        torsoRot = arc * 14;
        headRot = arc * 16;
        legFront = 195 - arc * 55; // tucked kicking leg
        footFront = -105 + arc * 42;
        legBack = 165 - arc * 40;
        footBack = -75 + arc * 32;
        armFront = 175 - arc * 65; // arms raised forward-up for aerodynamic balance
        armBack = 185 + arc * 45;  // arm elevates backward-up
      } else {
        // Apex & Descent Phase: Header strike extension and landing preparation
        const p = (t - 0.40) / 0.60;
        const arc = Math.sin(p * Math.PI * 0.5);
        hipY = -44 + arc * 12;
        torsoRot = 14 - arc * 14;
        headRot = 16 - arc * 16;
        legFront = 140 + arc * 55; // legs extending downwards
        footFront = -63 - arc * 42;
        legBack = 125 + arc * 40;
        footBack = -43 - arc * 32;
        armFront = 110 + arc * 65; // recovers to 175°
        armBack = 230 - arc * 45;  // recovers to 185°
      }

      return {
        hipY,
        torsoRot,
        headRot,
        headScaleX: 1.05,
        headScaleY: 0.95,
        hairRot: 55,
        legFrontRot: legFront,
        footFrontRot: footFront,
        legBackRot: legBack,
        footBackRot: footBack,
        armFrontRot: armFront,
        armBackRot: armBack,
        face: 'strain'
      };
    }
  },

  stun: {
    name: 'stun',
    duration: 1.1,
    loop: true,
    evaluate: (t) => {
      // Comical arcade dizzy stagger with rubbery head wobbling
      const cycle = t * Math.PI * 6;
      const wobble = Math.sin(cycle);
      const sway = Math.cos(cycle * 0.5);

      return {
        hipY: -32 + Math.abs(wobble) * 3,
        torsoRot: sway * 16,
        headRot: -sway * 22 + wobble * 8,
        headScaleX: 1.0 + wobble * 0.05,
        headScaleY: 1.0 - wobble * 0.05,
        hairRot: 35 + sway * 20,
        legFrontRot: 195 + wobble * 14,
        footFrontRot: -105,
        legBackRot: 165 - wobble * 14,
        footBackRot: -75,
        armFrontRot: 175 + sway * 25, // floppy limp arms swinging naturally
        armBackRot: 185 - sway * 25,
        face: 'ko'
      };
    }
  },

  super_shot: {
    name: 'super_shot',
    duration: 0.62,
    loop: false,
    evaluate: (t) => {
      // Dragon Kick Epic Super Move
      let hipY = -32;
      let legAngle = 195;
      let footAngle = -105;
      let headRot = 0;
      let armFrontRot = 175;
      let armBackRot = 185;

      if (t < 0.28) {
        // Instant power windup leap into the air
        const p = t / 0.28;
        hipY = -32 - p * 45;
        legAngle = 195 + p * 55;
        headRot = -p * 18;
        armFrontRot = 175 - p * 60; // lifts to 115°
        armBackRot = 185 + p * 45;  // lifts back to 230°
      } else if (t < 0.68) {
        // Devastating Dragon Strike snap!
        const p = (t - 0.28) / 0.40;
        hipY = -77;
        legAngle = 250 - p * 180;
        footAngle = -135 + p * 140;
        headRot = -18 + p * 34;
        armFrontRot = 115 - p * 25; // drives forward to 90°
        armBackRot = 230 + p * 20;  // locks back at 250°
      } else {
        // Power touchdown
        const p = (t - 0.68) / 0.32;
        hipY = -77 + p * 45;
        legAngle = 70 + p * 125;
        footAngle = 5 - p * 110;
        headRot = 16 - p * 16;
        armFrontRot = 90 + p * 85;  // settles back to 175°
        armBackRot = 250 - p * 65;  // settles back to 185°
      }

      return {
        hipY,
        torsoRot: headRot * 0.5,
        headRot,
        headScaleX: 1.10,
        headScaleY: 0.92,
        hairRot: 65 + (Math.random() - 0.5) * 40,
        legFrontRot: legAngle,
        footFrontRot: footAngle,
        legBackRot: 165,
        footBackRot: -75,
        armFrontRot,
        armBackRot,
        face: 'power',
        aura: true
      };
    }
  },

  bicycle_kick: {
    name: 'bicycle_kick',
    duration: 0.44,
    loop: false,
    evaluate: (t) => {
      // Acrobatic overhead backflip bicycle kick with full scissor rotation!
      const spinAngle = t * Math.PI * 2;
      const arc = Math.sin(t * Math.PI);
      const legSnap = t > 0.35 && t < 0.72 ? 1.0 : 0.0;

      return {
        hipY: -32 - arc * 60,
        torsoRot: -180 + t * 360,
        headRot: -28 + arc * 35,
        headScaleX: 1.08,
        headScaleY: 0.92,
        hairRot: 75 + Math.sin(spinAngle) * 45,
        legFrontRot: 195 - legSnap * 155 - arc * 40,
        footFrontRot: -105 + legSnap * 135,
        legBackRot: 165 + arc * 55,
        footBackRot: -75 - arc * 35,
        armFrontRot: 180 + Math.sin(spinAngle) * 65,
        armBackRot: 180 - Math.sin(spinAngle) * 65,
        face: 'strain',
        aura: t > 0.25 && t < 0.75
      };
    }
  },

  diving_header: {
    name: 'diving_header',
    duration: 0.48,
    loop: false,
    evaluate: (t) => {
      // Bullet horizontal dive forward through the air
      const diveArc = Math.sin(t * Math.PI);
      return {
        hipY: -32 - diveArc * 38,
        torsoRot: 84 * diveArc, // prone horizontal missile pose
        headRot: 40 * diveArc,
        headScaleX: 1.12,
        headScaleY: 0.90,
        hairRot: 85,
        legFrontRot: 195 - diveArc * 95,
        footFrontRot: -105 + diveArc * 75,
        legBackRot: 165 - diveArc * 75,
        footBackRot: -75 + diveArc * 55,
        armFrontRot: 175 + diveArc * 65, // tucked back like aerodynamic wings
        armBackRot: 185 + diveArc * 55,
        face: 'strain'
      };
    }
  },

  celebration: {
    name: 'celebration',
    duration: 1.1,
    loop: true,
    evaluate: (t) => {
      // Euphoric Goal Celebration: double-fist pumping in the air, bouncing with joy!
      const cycle = t * Math.PI * 4;
      const jump = Math.abs(Math.sin(cycle));
      return {
        hipY: -32 - jump * 18,
        torsoRot: Math.sin(cycle * 0.5) * 8,
        headRot: -12 + Math.cos(cycle) * 8,
        headScaleX: 1.06,
        headScaleY: 0.94,
        hairRot: 45 + Math.sin(cycle) * 15,
        legFrontRot: 195 - jump * 35,
        footFrontRot: -105 + jump * 25,
        legBackRot: 165 - jump * 35,
        footBackRot: -75 + jump * 25,
        armFrontRot: 0 + Math.sin(cycle) * 20, // arms raised triumphantly toward the sky!
        armBackRot: 0 - Math.sin(cycle) * 20,
        face: 'power'
      };
    }
  },

  defeat: {
    name: 'defeat',
    duration: 1.4,
    loop: true,
    evaluate: (t) => {
      // Heartbroken defeat slouch: head hung low, shoulders slumped
      const sigh = Math.sin(t * Math.PI * 2);
      return {
        hipY: -30 + sigh * 1.5,
        torsoRot: -18,
        headRot: 28 + sigh * 4,
        headScaleX: 0.96,
        headScaleY: 1.04,
        hairRot: 20,
        legFrontRot: 195,
        footFrontRot: -105,
        legBackRot: 165,
        footBackRot: -75,
        armFrontRot: 178 + sigh * 4, // arms hanging limply down along body
        armBackRot: 182 - sigh * 4,
        face: 'ko'
      };
    }
  },

  super_charge: {
    name: 'super_charge',
    duration: 0.75,
    loop: true,
    evaluate: (t) => {
      // Super Saiyan power vibration stance
      const vibrate = (Math.random() - 0.5) * 4.5;
      const breathe = Math.sin(t * Math.PI * 4);
      return {
        hipY: -34 + vibrate,
        torsoRot: -8 + vibrate * 0.5,
        headRot: -14 + breathe * 5,
        headScaleX: 1.09 + Math.abs(vibrate) * 0.02,
        headScaleY: 0.93 - Math.abs(vibrate) * 0.02,
        hairRot: 65 + vibrate * 6,
        legFrontRot: 218,
        footFrontRot: -122,
        legBackRot: 142,
        footBackRot: -58,
        armFrontRot: 155 + vibrate * 4,
        armBackRot: 205 - vibrate * 4,
        face: 'power',
        aura: true
      };
    }
  },

  rocket_kick: {
    name: 'rocket_kick',
    duration: 0.26,
    loop: false,
    evaluate: (t) => {
      // Low bullet cannon sweep shot
      let legAngle = 195;
      let footAngle = -105;
      let torsoRot = 0;
      let hipY = -32;
      let armFrontRot = 175;
      let armBackRot = 185;

      if (t < 0.22) {
        const p = t / 0.22;
        legAngle = 195 + p * 60;
        footAngle = -105 - p * 35;
        torsoRot = -p * 24;
        hipY = -30 + p * 4;
        armFrontRot = 175 + p * 35;
        armBackRot = 185 - p * 35;
      } else if (t < 0.62) {
        const p = (t - 0.22) / 0.40;
        const ease = Math.sin(p * Math.PI * 0.5);
        legAngle = 255 - ease * 190;
        footAngle = -140 + ease * 155;
        torsoRot = -24 + ease * 40;
        hipY = -26 - ease * 8;
        armFrontRot = 210 - ease * 105;
        armBackRot = 150 + ease * 95;
      } else {
        const p = (t - 0.62) / 0.38;
        legAngle = 65 + p * 130;
        footAngle = 15 - p * 120;
        torsoRot = 16 - p * 16;
        hipY = -34 + p * 2;
        armFrontRot = 105 + p * 70;
        armBackRot = 245 - p * 60;
      }

      return {
        hipY,
        torsoRot,
        headRot: -torsoRot * 0.75,
        headScaleX: 1.06,
        headScaleY: 0.94,
        hairRot: 70,
        legFrontRot: legAngle,
        footFrontRot: footAngle,
        legBackRot: 145,
        footBackRot: -60,
        armFrontRot,
        armBackRot,
        face: 'strain'
      };
    }
  },

  scorpion_kick: {
    name: 'scorpion_kick',
    duration: 0.40,
    loop: false,
    evaluate: (t) => {
      // Acrobatic heel strike flicking up behind the back
      const arc = Math.sin(t * Math.PI);
      const heelSnap = t > 0.32 && t < 0.72 ? 1.0 : 0.0;
      return {
        hipY: -32 - arc * 44,
        torsoRot: 48 * arc,
        headRot: -34 * arc,
        headScaleX: 1.07,
        headScaleY: 0.93,
        hairRot: 25 - arc * 35,
        legFrontRot: 195 + heelSnap * 105,
        footFrontRot: -105 + heelSnap * 95,
        legBackRot: 165 + arc * 65,
        footBackRot: -75 + arc * 50,
        armFrontRot: 155 - arc * 45,
        armBackRot: 205 + arc * 45,
        face: 'strain'
      };
    }
  },

  smash_header: {
    name: 'smash_header',
    duration: 0.30,
    loop: false,
    evaluate: (t) => {
      // Downward spike header hammer
      const snap = Math.sin(t * Math.PI);
      return {
        hipY: -32 - snap * 26,
        torsoRot: -16 + snap * 50,
        headRot: -22 + snap * 60,
        headScaleX: 1.14,
        headScaleY: 0.88,
        hairRot: 80,
        legFrontRot: 195 - snap * 45,
        footFrontRot: -105 + snap * 35,
        legBackRot: 165 - snap * 30,
        footBackRot: -75 + snap * 25,
        armFrontRot: 135 + snap * 45,
        armBackRot: 225 - snap * 45,
        face: 'strain'
      };
    }
  }
};

exports.AnimationClips = AnimationClips;
};

__mods['animation/AnimationController.js'] = function(exports, __req) {
const {  AnimationClips  } = __req('animation/AnimationClip.js');

/**
 * Advanced State Machine, Timeline Sequencer and Pose Blender for Head Soccer.
 * Implements smooth cubic cross-fading, procedural look-at ball tracking,
 * and dynamic elastic squash-and-stretch on athletic jump/landing impacts.
 */
class AnimationController {
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

    // Athletic momentum velocity tracking
    this.vx = 0;
    this.vy = 0;

    this.onStateChangeCallbacks = [];
  }

  setVelocity(vx, vy) {
    this.vx = vx || 0;
    this.vy = vy || 0;
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

    // Dynamic athletic momentum lean (forward sprint pitch & airborne diving posture)
    const facing = this.skeleton.facing || 1;
    const speedRatio = Math.max(-1.0, Math.min(1.0, (this.vx || 0) / 360));
    const forwardLean = speedRatio * 5.5 * facing;
    const vertRatio = Math.max(-1.0, Math.min(1.0, (this.vy || 0) / 600));
    const airTilt = vertRatio * 4.0;

    if (state.torsoRot !== undefined) {
      torso.rotation = state.torsoRot + forwardLean * 0.75 + airTilt * 0.45;
    }
    
    // Apply Head with Look-At tracking and dynamic stretch
    if (state.headRot !== undefined) {
      head.rotation = state.headRot + this.currentLookAngle + forwardLean * 0.40 - airTilt * 0.25;
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

exports.AnimationController = AnimationController;
};

__mods['audio/SoundManager.js'] = function(exports, __req) {
/**
 * Web Audio API procedural sound effects synthesizer. Zero external assets needed.
 */
class SoundManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.initialized = false;
  }

  init() {
    if (this.initialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
      this.initialized = true;
    }
  }

  toggle() {
    this.init();
    this.enabled = !this.enabled;
    return this.enabled;
  }

  play(soundName) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || this.ctx.state !== 'running') return;

    switch (soundName) {
      case 'kick':
        this.playKick();
        break;
      case 'headImpact':
        this.playHeadImpact();
        break;
      case 'superPower':
        this.playSuperPower();
        break;
      case 'superExplode':
        this.playSuperExplode();
        break;
      case 'goalWhistle':
        this.playGoalWhistle();
        break;
      case 'punch':
        this.playPunch();
        break;
      case 'bounce':
        this.playBounce();
        break;
      case 'knockout':
        this.playKnockout();
        break;
      case 'recover':
        this.playRecover();
        break;
      case 'chargedBlast':
        this.playChargedBlast();
        break;
      case 'laser':
        this.playLaser();
        break;
      case 'freeze':
        this.playFreeze();
        break;
      case 'shatter':
        this.playShatter();
        break;
      case 'powerup':
        this.playPowerup();
        break;
      case 'glove':
        this.playGlove();
        break;
      case 'postClang':
        this.playPostClang();
        break;
      case 'crowdCheer':
        this.playCrowdCheer();
        break;
      case 'dash':
        this.playDash();
        break;
      case 'netRustle':
        this.playNetRustle();
        break;
      case 'subBassKick':
        this.playSubBassKick();
        break;
      case 'chargeHum':
        this.playChargeHum();
        break;
    }
  }

  playPunch() {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.16);
    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  playBounce() {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  playKnockout() {
    const now = this.ctx.currentTime;
    // Comical descending slide whistle + gong
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.55);
    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.55);

    // Damped gong / bell chime
    const gong = this.ctx.createOscillator();
    const gGain = this.ctx.createGain();
    gong.type = 'triangle';
    gong.frequency.setValueAtTime(440, now + 0.05);
    gGain.gain.setValueAtTime(0.6, now + 0.05);
    gGain.gain.exponentialRampToValueAtTime(0.01, now + 0.85);
    gong.connect(gGain);
    gGain.connect(this.ctx.destination);
    gong.start(now + 0.05);
    gong.stop(now + 0.85);
  }

  playRecover() {
    const now = this.ctx.currentTime;
    // Comical boing / springboard
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(680, now + 0.22);
    gain.gain.setValueAtTime(0.65, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  playChargedBlast() {
    const now = this.ctx.currentTime;
    // Heavy cannon blast
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(28, now + 0.35);
    gain.gain.setValueAtTime(0.9, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  playChargeHum(ratio) {
    if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const baseFreq = 220 + ratio * 480;
    osc.frequency.setValueAtTime(baseFreq, now);
    gain.gain.setValueAtTime(0.12 * ratio, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  playKick() {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);
    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);

    const whoosh = this.ctx.createOscillator();
    const wGain = this.ctx.createGain();
    whoosh.type = 'sine';
    whoosh.frequency.setValueAtTime(450, now);
    whoosh.frequency.exponentialRampToValueAtTime(100, now + 0.15);
    wGain.gain.setValueAtTime(0.3, now);
    wGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    whoosh.connect(wGain);
    wGain.connect(this.ctx.destination);
    whoosh.start(now);
    whoosh.stop(now + 0.15);
  }

  playHeadImpact() {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.18);
    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  playSuperPower() {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(950, now + 0.45);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.6, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.6);
  }

  playSuperExplode() {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.5);
    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);
  }

  playGoalWhistle() {
    const now = this.ctx.currentTime;
    [0, 0.22, 0.45].forEach((delay, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2400 + (idx % 2 === 0 ? 0 : 200), now + delay);
      gain.gain.setValueAtTime(0.4, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.16);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + 0.16);
    });
  }

  playLaser() {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.28);
    gain.gain.setValueAtTime(0.85, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.28);
  }

  playFreeze() {
    const now = this.ctx.currentTime;
    // Chilly crystalline tone
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.05);
      gain.gain.setValueAtTime(0.4, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.35);
    });
  }

  playShatter() {
    const now = this.ctx.currentTime;
    // White noise / glass crack burst
    for (let i = 0; i < 4; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200 + Math.random() * 1600, now + i * 0.02);
      gain.gain.setValueAtTime(0.5, now + i * 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.02 + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.02);
      osc.stop(now + i * 0.02 + 0.15);
    }
  }

  playPowerup() {
    const now = this.ctx.currentTime;
    // Cheerful ascending arcade arpeggio
    const notes = [330, 440, 554, 659, 880];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      gain.gain.setValueAtTime(0.35, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.06 + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.12);
    });
  }

  playGlove() {
    const now = this.ctx.currentTime;
    // Spring boing followed by heavy thud
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.22);
    gain.gain.setValueAtTime(0.75, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  playPostClang() {
    const now = this.ctx.currentTime;
    // Sharp resonant metallic post strike (dual metallic sine pings)
    [1350, 2180, 840].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = idx === 2 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.92, now + 0.35);
      gain.gain.setValueAtTime(0.65 / (idx + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.38);
    });
  }

  playCrowdCheer() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const duration = 1.6;
    // Synthesize cheering crowd roar via modulated bandpassed noise
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.7;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(650, now);
    filter.frequency.linearRampToValueAtTime(950, now + 0.6);
    filter.frequency.exponentialRampToValueAtTime(450, now + duration);
    filter.Q.value = 1.8;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.7, now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
  }

  playDash() {
    const now = this.ctx.currentTime;
    // Aerodynamic whoosh / jet burst
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.16);
    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  playNetRustle() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const duration = 0.28;
    // Synthesize physical nylon cord vibration / net ripple
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.45;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2200, now);
    filter.frequency.exponentialRampToValueAtTime(750, now + duration);
    filter.Q.value = 2.4;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.55, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
  }

  playSubBassKick() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // 48Hz Sub-bass gut-punch drop
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(54, now);
    osc.frequency.exponentialRampToValueAtTime(24, now + 0.22);

    gain.gain.setValueAtTime(0.9, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  playChargeHum(progress = 0.5) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Ascending charging hum indicating power build up
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    const freq = 120 + Math.min(1.0, progress) * 360;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.linearRampToValueAtTime(freq + 40, now + 0.08);

    gain.gain.setValueAtTime(0.25 * Math.min(1.0, progress + 0.2), now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }
}

exports.SoundManager = SoundManager;
};

__mods['core/Bone.js'] = function(exports, __req) {
/**
 * Class representing a 2D Bone node in a Forward Kinematics (FK) skeletal rig.
 * Compatible with Spine 2D and DragonBones transformation matrices.
 */
class Bone {
  /**
   * @param {string} name - Unique identifier for the bone
   * @param {Bone|null} parent - Parent bone in hierarchy
   * @param {number} length - Length along local X-axis in pixels
   * @param {number} localX - Rest position X relative to parent
   * @param {number} localY - Rest position Y relative to parent
   * @param {number} localRotation - Rest rotation in degrees
   * @param {number} localScaleX - Rest scale X
   * @param {number} localScaleY - Rest scale Y
   */
  constructor(name, parent = null, length = 50, localX = 0, localY = 0, localRotation = 0, localScaleX = 1, localScaleY = 1) {
    this.name = name;
    this.parent = parent;
    this.children = [];
    if (parent) parent.children.push(this);
    this.length = length;

    // Base / Rest Pose
    this.baseX = localX;
    this.baseY = localY;
    this.baseRotation = localRotation;
    this.baseScaleX = localScaleX;
    this.baseScaleY = localScaleY;

    // Animated local transform
    this.x = localX;
    this.y = localY;
    this.rotation = localRotation; // degrees
    this.scaleX = localScaleX;
    this.scaleY = localScaleY;

    // World transform
    this.worldX = 0;
    this.worldY = 0;
    this.worldRotation = 0;
    this.worldScaleX = 1;
    this.worldScaleY = 1;
    this.matrix = [1, 0, 0, 1, 0, 0];
  }

  /**
   * Resets local transform back to initial setup pose.
   */
  resetPose() {
    this.x = this.baseX;
    this.y = this.baseY;
    this.rotation = this.baseRotation;
    this.scaleX = this.baseScaleX;
    this.scaleY = this.baseScaleY;
  }

  /**
   * Recursively computes world 2D affine transformation matrix.
   */
  updateWorldTransform() {
    const rad = (this.rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const localM = [
      cos * this.scaleX, sin * this.scaleX,
      -sin * this.scaleY, cos * this.scaleY,
      this.x, this.y
    ];

    if (this.parent) {
      const pm = this.parent.matrix;
      this.matrix = [
        pm[0] * localM[0] + pm[2] * localM[1],
        pm[1] * localM[0] + pm[3] * localM[1],
        pm[0] * localM[2] + pm[2] * localM[3],
        pm[1] * localM[2] + pm[3] * localM[3],
        pm[0] * localM[4] + pm[2] * localM[5] + pm[4],
        pm[1] * localM[4] + pm[3] * localM[5] + pm[5]
      ];
      this.worldX = this.matrix[4];
      this.worldY = this.matrix[5];
      this.worldRotation = this.parent.worldRotation + this.rotation;
      this.worldScaleX = this.parent.worldScaleX * this.scaleX;
      this.worldScaleY = this.parent.worldScaleY * this.scaleY;
    } else {
      this.matrix = localM;
      this.worldX = this.x;
      this.worldY = this.y;
      this.worldRotation = this.rotation;
      this.worldScaleX = this.scaleX;
      this.worldScaleY = this.scaleY;
    }

    for (const child of this.children) {
      child.updateWorldTransform();
    }
  }

  /**
   * Gets the tip position of the bone in world space.
   * @returns {{x: number, y: number}}
   */
  getWorldTip() {
    const rad = (this.worldRotation * Math.PI) / 180;
    return {
      x: this.worldX + Math.cos(rad) * this.length * this.worldScaleX,
      y: this.worldY + Math.sin(rad) * this.length * this.worldScaleY
    };
  }
}

exports.Bone = Bone;
};

__mods['core/Skeleton.js'] = function(exports, __req) {
const {  Bone  } = __req('core/Bone.js');

/**
 * Head Soccer Skeletal Rig.
 * Proportions calibrated to the authentic D&D Dream 1.4:1 Chibi Caricature ratio.
 */
class Skeleton {
  constructor() {
    // Root at pitch touchline level
    this.root = new Bone('root', null, 0, 0, 0, 0);

    // Hip / Pelvis: base of shorts
    this.hip = new Bone('hip', this.root, 24, 0, -32, -90);

    // Torso: compact jersey #10 (pointing straight up)
    this.torso = new Bone('torso', this.hip, 26, 24, 0, 0);

    // Head: rests organically on the anatomical neck & jersey collar
    this.head = new Bone('head', this.torso, 36, 28, 0, 0, 1.0, 1.0);

    // Headband fluttering ribbons
    this.hairRibbon = new Bone('hair_ribbon', this.head, 24, -20, 16, 35);

    // Arms attached to torso shoulders (hanging naturally downward along torso)
    this.armBack = new Bone('arm_back', this.torso, 20, 18, 12, 185);
    this.armFront = new Bone('arm_front', this.torso, 20, 18, -12, 175);

    // Back Support Leg & Boot (ground contact)
    this.legBack = new Bone('leg_back', this.hip, 20, 0, -8, 165);
    this.footBack = new Bone('foot_back', this.legBack, 24, 20, 0, -75);

    // Front Kicking Leg & Boot (ground contact & kick swing)
    this.legFront = new Bone('leg_front', this.hip, 20, 0, 8, 195);
    this.footFront = new Bone('foot_front', this.legFront, 24, 20, 0, -105);

    this.bones = [
      this.root,
      this.hip,
      this.torso,
      this.head,
      this.hairRibbon,
      this.armBack,
      this.armFront,
      this.legBack,
      this.footBack,
      this.legFront,
      this.footFront
    ];

    this.boneMap = new Map();
    this.bones.forEach(b => this.boneMap.set(b.name, b));
  }

  getBone(name) {
    return this.boneMap.get(name);
  }

  getAllBones() {
    return this.bones;
  }

  setPosition(x, y) {
    this.root.x = x;
    this.root.y = y;
  }

  setFacing(direction) {
    this.facing = direction;
    this.root.scaleX = 1;
  }

  updateTransforms() {
    this.root.updateWorldTransform();
  }
}

exports.Skeleton = Skeleton;
};

__mods['data/Characters.js'] = function(exports, __req) {
/**
 * Full 10-Character Roster definitions with authentic Head Soccer stats and unique abilities.
 */
const CHARACTERS = [
  {
    id: 'kenta',
    name: 'Kenta',
    country: '🇯🇵',
    title: 'El Protagonista',
    heads: {
      idle: 'assets/head_idle.png',
      kick: 'assets/head_kick.png',
      ko: 'assets/head_ko.png'
    },
    head: { width: 106, pivotX: 0.48, pivotY: 0.86 },
    jerseyFilter: 'none',
    stats: { speed: 1.05, jump: 1.0, power: 1.05 },
    super: { type: 'fire', name: 'Tiro Dragón 🔥', colors: ['#ff3700', '#ffd000'] }
  },
  {
    id: 'luchador',
    name: 'El Toro',
    country: '🇲🇽',
    title: 'Luchador Enmascarado',
    heads: {
      idle: 'assets/characters/luchador_idle.png',
      kick: 'assets/characters/luchador_kick.png',
      ko: 'assets/characters/luchador_ko.png'
    },
    head: { width: 102, pivotX: 0.5, pivotY: 0.9 },
    jerseyFilter: 'hue-rotate(110deg) saturate(1.3)',
    stats: { speed: 0.95, jump: 1.0, power: 1.25 },
    super: { type: 'lucha', name: 'Plancha Volcánica 🌋', colors: ['#00c853', '#ffffff', '#ff1744'] }
  },
  {
    id: 'viking',
    name: 'Björn',
    country: '🇳🇴',
    title: 'Martillo del Norte',
    heads: {
      idle: 'assets/characters/viking_idle.png',
      kick: 'assets/characters/viking_kick.png',
      ko: 'assets/characters/viking_ko.png'
    },
    head: { width: 104, pivotX: 0.52, pivotY: 0.74 },
    jerseyFilter: 'hue-rotate(185deg) saturate(0.8) brightness(0.95)',
    stats: { speed: 0.92, jump: 1.1, power: 1.18 },
    super: { type: 'thunder', name: 'Rayo de Thor ⚡', colors: ['#7df9ff', '#ffffff', '#ffe600'] }
  },
  {
    id: 'samba',
    name: 'Joãozinho',
    country: '🇧🇷',
    title: 'Rey del Jogo Bonito',
    heads: {
      idle: 'assets/characters/samba_idle.png',
      kick: 'assets/characters/samba_kick.png',
      ko: 'assets/characters/samba_ko.png'
    },
    head: { width: 112, pivotX: 0.5, pivotY: 0.92 },
    jerseyFilter: 'hue-rotate(60deg) saturate(1.6) brightness(1.15)',
    stats: { speed: 1.2, jump: 1.05, power: 0.95 },
    super: { type: 'banana', name: 'Chanfle Tornado 🌪️', colors: ['#ffeb3b', '#00e676'] }
  },
  {
    id: 'ninja',
    name: 'Kage',
    country: '🥷',
    title: 'Sombra Ninja',
    heads: {
      idle: 'assets/characters/ninja_idle.png',
      kick: 'assets/characters/ninja_kick.png',
      ko: 'assets/characters/ninja_ko.png'
    },
    head: { width: 100, pivotX: 0.5, pivotY: 0.92 },
    jerseyFilter: 'hue-rotate(220deg) saturate(0.6) brightness(0.7)',
    stats: { speed: 1.15, jump: 1.2, power: 0.92 },
    super: { type: 'shadow', name: 'Warp Shuriken 🌀', colors: ['#7c4dff', '#1a1a2e', '#ff007f'] }
  },
  {
    id: 'cyborg',
    name: 'Cyborg-01',
    country: '🇩🇪',
    title: 'Mecha Striker',
    heads: {
      idle: 'assets/characters/cyborg_idle.png',
      kick: 'assets/characters/cyborg_kick.png',
      ko: 'assets/characters/cyborg_ko.png'
    },
    head: { width: 106, pivotX: 0.5, pivotY: 0.88 },
    jerseyFilter: 'grayscale(0.6) contrast(1.2)',
    stats: { speed: 1.08, jump: 0.95, power: 1.22 },
    super: { type: 'laser', name: 'Cañón Láser Hiperión 🤖', colors: ['#00f0ff', '#ffffff', '#ff0055'] }
  },
  {
    id: 'frost',
    name: 'Dr. Frost',
    country: '❄️',
    title: 'Rey del Hielo',
    heads: {
      idle: 'assets/characters/frost_idle.png',
      kick: 'assets/characters/frost_kick.png',
      ko: 'assets/characters/frost_ko.png'
    },
    head: { width: 108, pivotX: 0.5, pivotY: 0.88 },
    jerseyFilter: 'hue-rotate(160deg) saturate(1.4) brightness(1.1)',
    stats: { speed: 1.02, jump: 1.08, power: 1.05 },
    super: { type: 'frost', name: 'Ventisca Glacial (Freeze) 🧊', colors: ['#00ffff', '#e0ffff', '#0088ff'] }
  },
  {
    id: 'knight',
    name: 'Sir Arthur',
    country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    title: 'Paladín Dorado',
    heads: {
      idle: 'assets/characters/knight_idle.png',
      kick: 'assets/characters/knight_kick.png',
      ko: 'assets/characters/knight_ko.png'
    },
    head: { width: 108, pivotX: 0.5, pivotY: 0.86 },
    jerseyFilter: 'hue-rotate(200deg) brightness(1.1)',
    stats: { speed: 0.98, jump: 1.15, power: 1.14 },
    super: { type: 'paladin', name: 'Espada Excalibur ⚔️', colors: ['#ffd700', '#ffffff', '#ffaa00'] }
  },
  {
    id: 'anubis',
    name: 'Anubis',
    country: '🇪🇬',
    title: 'Guardián del Nilo',
    heads: {
      idle: 'assets/characters/anubis_idle.png',
      kick: 'assets/characters/anubis_kick.png',
      ko: 'assets/characters/anubis_ko.png'
    },
    head: { width: 112, pivotX: 0.5, pivotY: 0.86 },
    jerseyFilter: 'sepia(0.8) hue-rotate(35deg) brightness(0.9)',
    stats: { speed: 1.05, jump: 1.12, power: 1.1 },
    super: { type: 'anubis', name: 'Vórtice de las Pirámides 🏜️', colors: ['#ffd700', '#c8963e', '#1a1508'] }
  },
  {
    id: 'alien',
    name: 'Zog',
    country: '👽',
    title: 'Invasor Galáctico',
    heads: {
      idle: 'assets/characters/alien_idle.png',
      kick: 'assets/characters/alien_kick.png',
      ko: 'assets/characters/alien_ko.png'
    },
    head: { width: 110, pivotX: 0.5, pivotY: 0.86 },
    jerseyFilter: 'hue-rotate(85deg) saturate(1.5)',
    stats: { speed: 1.12, jump: 1.25, power: 0.95 },
    super: { type: 'alien', name: 'Agujero Negro Gravitacional 🛸', colors: ['#a855f7', '#06b6d4', '#ec4899'] }
  },
  {
    id: 'phoenix',
    name: 'Fénix Dorado',
    country: '🇪🇸',
    title: 'Señor del Fuego Eterno',
    heads: {
      idle: 'assets/characters/phoenix_idle.png',
      kick: 'assets/characters/phoenix_kick.png',
      ko: 'assets/characters/phoenix_ko.png'
    },
    head: { width: 115, pivotX: 0.5, pivotY: 0.88 },
    jerseyFilter: 'hue-rotate(340deg) saturate(1.8) brightness(1.2)',
    stats: { speed: 1.15, jump: 1.2, power: 1.2 },
    super: { type: 'phoenix', name: 'Alas del Fénix 🪽🔥', colors: ['#ff9100', '#ffd700', '#ff1744'] }
  },
  {
    id: 'poseidon',
    name: 'Poseidón',
    country: '🇬🇷',
    title: 'Rey de las Mareas',
    heads: {
      idle: 'assets/characters/poseidon_idle.png',
      kick: 'assets/characters/poseidon_kick.png',
      ko: 'assets/characters/poseidon_ko.png'
    },
    head: { width: 116, pivotX: 0.5, pivotY: 0.84 },
    jerseyFilter: 'hue-rotate(170deg) saturate(1.6) brightness(1.1)',
    stats: { speed: 1.05, jump: 1.1, power: 1.25 },
    super: { type: 'poseidon', name: 'Tsunami Hidro-Cañón 🌊🔱', colors: ['#00d4ff', '#0044ff', '#e0ffff'] }
  },
  {
    id: 'titan',
    name: 'Titán Sísmico',
    country: '🇮🇹',
    title: 'Muralla de Roca',
    heads: {
      idle: 'assets/characters/titan_idle.png',
      kick: 'assets/characters/titan_kick.png',
      ko: 'assets/characters/titan_ko.png'
    },
    head: { width: 114, pivotX: 0.5, pivotY: 0.88 },
    jerseyFilter: 'sepia(0.6) hue-rotate(330deg) brightness(0.85)',
    stats: { speed: 0.9, jump: 1.05, power: 1.35 },
    super: { type: 'titan', name: 'Fisura Terrestre 🪨💥', colors: ['#a8896c', '#ff5722', '#21130d'] }
  },
  {
    id: 'chrono',
    name: 'Chrono Warp',
    country: '🇨🇭',
    title: 'Amo del Tiempo',
    heads: {
      idle: 'assets/characters/chrono_idle.png',
      kick: 'assets/characters/chrono_kick.png',
      ko: 'assets/characters/chrono_ko.png'
    },
    head: { width: 112, pivotX: 0.5, pivotY: 0.86 },
    jerseyFilter: 'hue-rotate(280deg) saturate(1.7) brightness(1.15)',
    stats: { speed: 1.22, jump: 1.15, power: 1.05 },
    super: { type: 'chrono', name: 'Grieta Temporal ⏳⚡', colors: ['#00ffcc', '#7c4dff', '#ffffff'] }
  }
];

function getCharacter(id) {
  return CHARACTERS.find(c => c.id === id) || CHARACTERS[0];
}

exports.getCharacter = getCharacter;
exports.CHARACTERS = CHARACTERS;
};

__mods['export/SpineExporter.js'] = function(exports, __req) {
/**
 * Generates official Spine 3.8 / 4.0 JSON format for export into Spine Editor, Unity, or Godot.
 */
class SpineExporter {
  /**
   * @param {import('../core/Skeleton.js').Skeleton} skeleton
   */
  constructor(skeleton) {
    this.skeleton = skeleton;
  }

  generateJSON() {
    const bones = this.skeleton.getAllBones().map(b => ({
      name: b.name,
      parent: b.parent ? b.parent.name : undefined,
      length: b.length,
      x: b.baseX,
      y: b.baseY,
      rotation: b.baseRotation,
      scaleX: b.baseScaleX,
      scaleY: b.baseScaleY
    }));

    const spineData = {
      skeleton: {
        spine: "3.8.99",
        width: 320,
        height: 420,
        fps: 60,
        images: "./assets/"
      },
      bones: bones,
      slots: [
        { name: "shadow", bone: "root", attachment: "shadow" },
        { name: "boot_back", bone: "foot_back", attachment: "boot_back" },
        { name: "leg_back", bone: "leg_back", attachment: "leg_back" },
        { name: "torso", bone: "torso", attachment: "jersey_blue" },
        { name: "neck", bone: "neck", attachment: "neck" },
        { name: "head", bone: "head", attachment: "head_caricature" },
        { name: "hair", bone: "hair_ribbon", attachment: "hair_spikes" },
        { name: "boot_front", bone: "foot_front", attachment: "boot_cleat" },
        { name: "arm_front", bone: "arm_front", attachment: "arm_glove" }
      ],
      skins: {
        default: {
          head: {
            head_caricature: {
              type: "mesh",
              uvs: [0, 0, 1, 0, 1, 1, 0, 1],
              triangles: [0, 1, 2, 2, 3, 0],
              vertices: [1, 5, 0, 0, 1],
              hull: 4,
              width: 175,
              height: 200
            }
          },
          boot_front: {
            boot_cleat: { x: 22, y: 0, width: 64, height: 32 }
          }
        }
      },
      animations: {
        idle: {
          bones: {
            hip: { translate: [{ time: 0, y: 0 }, { time: 0.5, y: -4 }, { time: 1.0, y: 0 }] },
            torso: { rotate: [{ time: 0, angle: 0 }, { time: 0.5, angle: 3 }, { time: 1.0, angle: 0 }] },
            head: { rotate: [{ time: 0, angle: 0 }, { time: 0.5, angle: -3 }, { time: 1.0, angle: 0 }] }
          }
        },
        kick: {
          bones: {
            leg_front: {
              rotate: [
                { time: 0, angle: 115 },
                { time: 0.1, angle: 60, curve: "stepped" },
                { time: 0.22, angle: 180, curve: [0.25, 0, 0.75, 1] },
                { time: 0.42, angle: 115 }
              ]
            },
            foot_front: {
              rotate: [
                { time: 0, angle: -35 },
                { time: 0.1, angle: -60 },
                { time: 0.22, angle: 45 },
                { time: 0.42, angle: -35 }
              ]
            }
          }
        },
        super_shot: {
          bones: {
            hip: { translate: [{ time: 0, y: 0 }, { time: 0.4, y: 80 }, { time: 1.1, y: 0 }] },
            leg_front: { rotate: [{ time: 0, angle: 115 }, { time: 0.4, angle: 40 }, { time: 0.75, angle: 205 }, { time: 1.1, angle: 115 }] }
          }
        }
      }
    };

    return JSON.stringify(spineData, null, 2);
  }
}

exports.SpineExporter = SpineExporter;
};

__mods['main.js'] = function(exports, __req) {
const {  Skeleton  } = __req('core/Skeleton.js');
const {  AnimationController  } = __req('animation/AnimationController.js');
const {  Ball  } = __req('physics/Ball.js');
const {  CollisionSystem  } = __req('physics/CollisionSystem.js');
const {  ParticleSystem  } = __req('physics/ParticleSystem.js');
const {  RagdollSystem  } = __req('physics/RagdollSystem.js');
const {  PowerSystem  } = __req('physics/PowerSystem.js');
const {  PowerUpSystem  } = __req('physics/PowerUpSystem.js');
const {  RivalBot  } = __req('physics/RivalBot.js');
const {  SuperShots  } = __req('physics/SuperShots.js');
const {  CHARACTERS, getCharacter  } = __req('data/Characters.js');
const {  SoundManager  } = __req('audio/SoundManager.js');
const {  AssetLoader  } = __req('renderer/AssetLoader.js');
const {  GameRenderer  } = __req('renderer/GameRenderer.js');
const {  SpineExporter  } = __req('export/SpineExporter.js');
const {  InputManager  } = __req('ui/InputManager.js');
const {  UIManager  } = __req('ui/UIManager.js');
const {  TournamentManager, GAME_MODES  } = __req('tournament/TournamentManager.js');

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

};

__mods['physics/Ball.js'] = function(exports, __req) {
/**
 * Soccer ball physics: gravity, bounce, spin, crossbar collision and
 * pluggable super-shot effects (see physics/SuperShots.js).
 */
const GOAL = {
  inset: 6,
  width: 72,
  frontX: 78,
  height: 210,
  postRadius: 9
};

class Ball {
  constructor(x = 420, y = 0, radius = 26) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.radius = radius;
    this.rotation = 0;
    this.spin = 0; // Aerodynamic Magnus spin: positive = topspin / dip, negative = backspin / lift
    this.isSuper = false;
    this.superType = null;
    this.superColors = null;
    this.heavy = false;
    this.lastKickedBy = 'player';
    this.isDragging = false;
    this.elasticity = 0.78;
    this.friction = 0.988;
    this.gravity = 850;
    this.gravityScale = 1;
    this.scale = 1;
    this.alpha = 1;
    this.squashX = 1.0;
    this.squashY = 1.0;
    this.onCrossbarHit = null;
    this.onNetBulge = null;
    this.trail = [];
    this.effect = null;
    this.effectTime = 0;
  }

  setEffect(effect) {
    this.effect = effect;
    this.effectTime = 0;
  }

  clearEffect() {
    if (this.effect?.end) this.effect.end(this);
    this.effect = null;
    this.effectTime = 0;
    this.gravityScale = 1;
    this.scale = 1;
    this.squashX = 1.0;
    this.squashY = 1.0;
    this.alpha = 1;
  }

  /** Drop the ball at a kickoff spot. */
  reset(x, y) {
    this.clearEffect();
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = -160;
    this.spin = 0;
    this.isSuper = false;
    this.heavy = false;
    this.superType = null;
    this.lastKickedBy = null;
    this.squashX = 1.0;
    this.squashY = 1.0;
    this.trail.length = 0;
  }

  update(dt, groundY, stageWidth) {
    if (this.isDragging) return;

    // Smooth elastic recovery of ball squash & stretch
    this.squashX += (1.0 - this.squashX) * Math.min(1.0, dt * 14);
    this.squashY += (1.0 - this.squashY) * Math.min(1.0, dt * 14);

    // Super-shot effect tick
    if (this.effect) {
      this.effectTime += dt;
      this.effect.update(this, this.effectTime);
      if (this.effectTime >= this.effect.duration) this.clearEffect();
    }

    // Magnus Aerodynamic Force: F_magnus = S * (omega x v)
    // In 2D side-view, perpendicular vector to velocity (vx, vy) creates curling / dipping banana trajectory
    let speed = Math.hypot(this.vx, this.vy);
    if (speed > 50 && Math.abs(this.spin) > 0.04) {
      const perpX = -this.vy / speed;
      const perpY = this.vx / speed;
      const magnusStrength = this.spin * 18.0; // curl acceleration px/s^2
      this.vx += perpX * magnusStrength * dt;
      this.vy += perpY * magnusStrength * dt;
      // Air resistance decays spin over flight
      this.spin *= Math.pow(0.965, dt * 60);
    }

    this.vy += this.gravity * this.gravityScale * dt;
    this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Physical rolling spin combined with aerodynamic ball rotation
    this.rotation += ((this.vx * dt) / this.radius) + this.spin * dt * 4.4;

    // Ground collision & bounce with elastic squash
    if (this.y + this.radius > groundY) {
      this.y = groundY - this.radius;
      if (Math.abs(this.vy) > 80) {
        this.squashY = Math.max(0.68, 1.0 - Math.min(0.32, Math.abs(this.vy) / 850));
        this.squashX = 1.0 + (1.0 - this.squashY) * 0.95;
      }
      this.vy = -this.vy * this.elasticity;
      if (Math.abs(this.vy) < 40) this.vy = 0;
      // Rolling friction and spin damping on turf
      this.vx *= 0.97;
      this.spin *= 0.52;
    }

    // Ceiling
    if (this.y - this.radius < 0) {
      this.y = this.radius;
      this.vy = Math.abs(this.vy) * this.elasticity;
    }

    // Goals: Crossbar, Upright Posts, and Dynamic Net Physics
    const barY = groundY - GOAL.height;
    const frontLeftX = 78;
    const frontRightX = stageWidth - 78;

    // 1. Crossbar Horizontal Collision (both goals - upper ceiling only)
    this.collideCrossbar(GOAL.inset, frontLeftX, barY, false);
    this.collideCrossbar(frontRightX, stageWidth - GOAL.inset, barY, true);

    // 2. Inside the Net Physics (Catching tension, progressive drag, and net bulge)
    this.handleNetPhysics(groundY, stageWidth);

    // Super shot dynamic aerodynamic decay (balances overpowered cross-field shots)
    speed = Math.hypot(this.vx, this.vy);
    if (this.isSuper) {
      this.superLife = (this.superLife || 0) + dt;
      if (this.superLife > 0.8) {
        this.vx *= 0.985;
        this.vy *= 0.985;
      }
      if (this.superLife > 2.2 || (!this.effect && speed < 300)) {
        this.isSuper = false;
        this.superLife = 0;
        this.heavy = false;
        this.shotType = null;
      }
    } else {
      this.superLife = 0;
    }

    // Dynamic motion comet trail for fast balls
    if (speed > 240) {
      let trailColor = '#00f0ff';
      if (this.isSuper) {
        trailColor = (this.superColors && this.superColors[0]) || '#ff3700';
      } else if (this.shotType === 'bicycle') {
        trailColor = '#ffd700';
      } else if (this.shotType === 'rocket') {
        trailColor = '#00f0ff';
      } else if (this.shotType === 'palomita') {
        trailColor = '#00ffcc';
      } else if (this.shotType === 'scorpion') {
        trailColor = '#ff00aa';
      } else if (this.shotType === 'smash') {
        trailColor = '#ffcc00';
      }

      this.trail.push({
        x: this.x,
        y: this.y,
        vx: this.vx,
        vy: this.vy,
        speed,
        life: 1.0,
        color: trailColor,
        isSuper: this.isSuper,
        shotType: this.shotType
      });
    }

    for (let i = this.trail.length - 1; i >= 0; i--) {
      this.trail[i].life -= dt * (speed > 600 ? 4.2 : 3.4);
      if (this.trail[i].life <= 0) this.trail.splice(i, 1);
    }
  }

  collideCrossbar(x1, x2, barY, isRight = false) {
    const r = this.radius + (GOAL.postRadius || 6);
    const cx = Math.max(x1, Math.min(this.x, x2));
    const dx = this.x - cx;
    const dy = this.y - barY;
    const dist = Math.hypot(dx, dy);

    if (dist < r && dist > 0) {
      const nx = dx / dist;
      const ny = dy / dist;
      this.x = cx + nx * r;
      this.y = barY + ny * r;
      const dot = this.vx * nx + this.vy * ny;
      if (dot < 0) {
        const speed = Math.hypot(this.vx, this.vy);
        this.vx -= 2 * dot * nx * 0.88;
        this.vy -= 2 * dot * ny * 0.88;
        this.squashX = 0.72;
        this.squashY = 1.28;
        if (speed > 90 && this.onCrossbarHit) {
          const cornerPostX = isRight ? x1 : x2;
          const isCorner = Math.abs(cx - cornerPostX) < 14;
          const hitType = isCorner ? 'corner' : 'crossbar';
          this.onCrossbarHit(cx, barY, speed, hitType, isRight);
        }
      }
    }
  }



  handleNetPhysics(groundY, stageWidth) {
    const frontLeftX = 78;
    const frontRightX = stageWidth - 78;
    const goalH = GOAL.height || 210;

    const isInsideLeftNet = this.x < frontLeftX && this.y > groundY - goalH;
    const isInsideRightNet = this.x > frontRightX && this.y > groundY - goalH;

    if (isInsideLeftNet) {
      // Elastic net progressive drag
      this.vx *= 0.91;
      this.vy *= 0.93;
      const speed = Math.hypot(this.vx, this.vy);
      if (speed > 35 && this.onNetBulge) {
        this.onNetBulge(false, this.y, speed);
      }
      // Back wall soft cushion
      if (this.x - this.radius < GOAL.inset) {
        this.x = GOAL.inset + this.radius;
        this.vx = Math.abs(this.vx) * 0.22;
      }
    } else if (isInsideRightNet) {
      this.vx *= 0.91;
      this.vy *= 0.93;
      const speed = Math.hypot(this.vx, this.vy);
      if (speed > 35 && this.onNetBulge) {
        this.onNetBulge(true, this.y, speed);
      }
      if (this.x + this.radius > stageWidth - GOAL.inset) {
        this.x = stageWidth - GOAL.inset - this.radius;
        this.vx = -Math.abs(this.vx) * 0.22;
      }
    } else {
      // Normal pitch boundaries (above crossbars)
      if (this.x - this.radius < GOAL.inset) {
        this.x = GOAL.inset + this.radius;
        this.vx = Math.abs(this.vx) * this.elasticity;
      }
      if (this.x + this.radius > stageWidth - GOAL.inset) {
        this.x = stageWidth - GOAL.inset - this.radius;
        this.vx = -Math.abs(this.vx) * this.elasticity;
      }
    }
  }

  kick(powerX, powerY, isSuper = false, kicker = 'player', shotType = null, spin = 0) {
    if (!isSuper && this.effect) this.clearEffect();
    this.vx = powerX;
    this.vy = powerY;
    this.isSuper = isSuper;
    this.superLife = 0;
    this.shotType = shotType;
    this.spin = spin;
    if (!isSuper) {
      this.heavy = false;
      this.superType = null;
    }
    this.lastKickedBy = kicker;

    const speed = Math.hypot(powerX, powerY);
    if (speed > 300) {
      this.squashX = Math.min(1.48, 1.0 + (speed / 1100) * 0.44);
      this.squashY = Math.max(0.58, 1.0 - (speed / 1100) * 0.38);
    }
  }
}

exports.Ball = Ball;
exports.GOAL = GOAL;
};

__mods['physics/ChargeSystem.js'] = function(exports, __req) {
/**
 * Head Soccer Charge System.
 * Enables holding down kick, super shot, or jump to accumulate devastating shot power.
 */
class ChargeSystem {
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

exports.ChargeSystem = ChargeSystem;
};

__mods['physics/CollisionSystem.js'] = function(exports, __req) {
/**
 * Authentic Head Soccer Collision Detection, Dynamic Stun System, and Super Meter.
 * Player does NOT die; taking damage lowers stun resistance, making characters easily stunned.
 * Heading the ball is a pure offensive soccer move and NEVER inflicts self-damage!
 * Damage/stun ONLY occurs when:
 * 1. Rival blasts a Super Shot (Ulti) directly into the character.
 * 2. Rival kicks a violent cannon shot (> 550 speed) directly at the character.
 * 3. Rival hits the character with a direct physical kick/tackle in close combat.
 */
class CollisionSystem {
  /**
   * @param {import('../audio/SoundManager.js').SoundManager} soundManager
   * @param {import('./ParticleSystem.js').ParticleSystem} particleSystem
   */
  constructor(soundManager, particleSystem) {
    this.soundManager = soundManager;
    this.particleSystem = particleSystem;
    this.playerGoals = 0;
    this.rivalGoals = 0;
    this.goalCooldown = 0;
    this.kickCooldown = 0;
    this.damageCooldown = 0;
    this.onGoalCallbacks = [];
    this.onRivalGoalCallbacks = [];
    this.onDamageCallbacks = [];
    this.onRivalDamageCallbacks = [];
    this.onStunCallbacks = [];
    this.onHitStopCallbacks = [];
    this.onShakeCallbacks = [];
    this.onPostHitCallbacks = [];
    this.floatingTexts = [];
  }

  onGoal(fn) {
    this.onGoalCallbacks.push(fn);
  }

  onRivalGoal(fn) {
    this.onRivalGoalCallbacks.push(fn);
  }

  onDamage(fn) {
    this.onDamageCallbacks.push(fn);
  }

  onRivalDamage(fn) {
    this.onRivalDamageCallbacks.push(fn);
  }

  onStun(fn) {
    this.onStunCallbacks.push(fn);
  }

  onHitStop(fn) {
    this.onHitStopCallbacks.push(fn);
  }

  onShake(fn) {
    this.onShakeCallbacks.push(fn);
  }

  onPostHit(fn) {
    this.onPostHitCallbacks.push(fn);
  }

  triggerHitStop(duration = 0.045) {
    this.onHitStopCallbacks.forEach(fn => fn(duration));
  }

  triggerShake(intensity = 8) {
    this.onShakeCallbacks.forEach(fn => fn(intensity));
  }

  addFloatingText(text, x, y, color = '#ffd700', size = 20) {
    this.floatingTexts.push({
      text,
      x: x + (Math.random() - 0.5) * 16,
      y,
      vy: -115 - Math.random() * 35,
      color,
      size,
      life: 1.0,
      decay: 0.85
    });
  }

  applyDamage(player, amount, ragdollSystem, impulseX = -280, impulseY = -380, isHeavyBlast = false, customStunTimer = null) {
    if (player.hasShield) {
      this.soundManager.play('bounce');
      this.particleSystem.spawnSparks(player.x, player.y - 50, 20, '#ffd700');
      this.addFloatingText('🛡️ ¡ESCUDO DEFLECTOR!', player.x, player.y - 85, '#ffd700', 18);
      return;
    }
    if (player.isStunned || player.isKnockedOut) return;
    if (this.damageCooldown > 0) return;

    this.damageCooldown = 0.35;
    // Lower bound HP to 10 (never die!)
    player.hp = Math.max(10, (player.hp ?? 100) - amount);

    this.soundManager.play('punch');
    this.particleSystem.spawnSparks(player.x, player.y - 60, 20, '#ff3700');

    if (amount >= 35) {
      this.addFloatingText(`-${amount} CRITICAL!`, player.x, player.y - 80, '#ff3700', 22);
    } else {
      this.addFloatingText(`-${amount} HP`, player.x, player.y - 75, '#ffd700', 18);
    }

    this.onDamageCallbacks.forEach(fn => fn(player.hp));

    // Stun logic: Heavy blasts or critical guard break
    const isGuardBroken = player.hp <= 15 && amount >= 25;
    if (isHeavyBlast || isGuardBroken) {
      this.triggerStun(player, ragdollSystem, impulseX, impulseY, isHeavyBlast, customStunTimer);
    } else {
      // Normal combat pushback — player stays agile and retains full control!
      player.x += Math.sign(impulseX) * 20;
    }
  }

  freezePlayer(player, duration = 2.0) {
    if (player.hasShield || player.isFrozen) return;
    player.isFrozen = true;
    player.freezeTimer = duration;
    player.vx = 0;
    this.soundManager.play('freeze');
    this.particleSystem.spawnSparks(player.x, player.y - 45, 25, '#00ffff');
    this.addFloatingText('🧊 ¡CONGELADO! 🧊', player.x, player.y - 110, '#00ffff', 24);
  }

  triggerStun(player, ragdollSystem, impulseX = -280, impulseY = -380, isHeavyBlast = false, customStunTimer = null) {
    player.isStunned = true;
    player.stunTimer = customStunTimer != null ? customStunTimer : 0.65;
    this.soundManager.play('knockout');
    const stunLabel = customStunTimer && customStunTimer > 1.5 ? `😵 ¡STUN CRÍTICO (${customStunTimer.toFixed(1)}s)!` : '😵 ¡STUNNED!';
    this.addFloatingText(stunLabel, player.x, player.y - 110, '#00f0ff', 22);

    this.onStunCallbacks.forEach(fn => fn(true));

    // Ragdoll flop ONLY on catastrophic heavy blasts when HP is low!
    if (isHeavyBlast && player.hp <= 20 && ragdollSystem) {
      ragdollSystem.start(player, impulseX, impulseY);
    } else {
      player.animController.play('stun');
    }
  }

  update(player, skeleton, ball, stageWidth, groundY, dt, ragdollSystem, powerSystem, rivalBot, inputManager = null, isMatchOver = false, superShots = null) {
    this.isMatchOver = isMatchOver;
    this.superShots = superShots;
    if (this.isMatchOver) {
      // Smoothly bring the ball to rest after the final whistle
      ball.vx *= 0.94;
      ball.vy *= 0.94;
      ball.spin *= 0.90;
      ball.isSuper = false;
    }

    if (this.goalCooldown > 0) this.goalCooldown -= dt;
    if (this.damageCooldown > 0) this.damageCooldown -= dt;
    if (this.kickCooldown > 0) this.kickCooldown -= dt;
    if (player.hitFlashTimer > 0) player.hitFlashTimer = Math.max(0, player.hitFlashTimer - dt);

    if (!player.freeze) {
      player.freeze = (dur) => this.freezePlayer(player, dur);
    }

    // Freeze Timer Management for Player
    if (player.isFrozen) {
      player.freezeTimer -= dt;
      if (player.freezeTimer <= 0) {
        player.isFrozen = false;
        this.soundManager.play('shatter');
        this.particleSystem.spawnSparks(player.x, player.y - 45, 30, '#00ffff');
        this.addFloatingText('✨ ¡DESCONGELADO! ✨', player.x, player.y - 110, '#00ffcc', 20);
      }
    }

    // Stun Timer Management for Player
    if (player.isStunned) {
      player.stunTimer -= dt;
      if (player.stunTimer <= 0) {
        player.isStunned = false;
        player.animController.play('idle');
        this.soundManager.play('recover');
        this.particleSystem.spawnSparks(player.x, player.y - 40, 20, '#00ffcc');
        player.hp = Math.min(100, player.hp + 20); // Slowly restore HP
        this.onDamageCallbacks.forEach(fn => fn(player.hp));
        this.onStunCallbacks.forEach(fn => fn(false));
      }
    }

    // Update Floating Damage Texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy * dt;
      ft.vy += 80 * dt;
      ft.life -= ft.decay * dt;
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }

    // Floppy ragdoll ball bounce
    if (player.isKnockedOut && ragdollSystem?.isActive) {
      const pHead = ragdollSystem.getPoint('head');
      if (pHead) {
        const d = Math.hypot(ball.x - pHead.x, ball.y - pHead.y);
        if (d < ball.radius + pHead.radius) {
          ball.vx = (ball.x - pHead.x) * 8 + 120;
          ball.vy = -Math.abs(ball.vy) * 0.7 - 180;
          this.soundManager.play('bounce');
          this.particleSystem.spawnSparks(ball.x, ball.y, 10, '#00f0ff');
        }
      }
      return;
    }

    // 1. Anatomically Calibrated Hitbox Updates (Matches Chibi 1.25x caricature proportion)
    const headScale = (player.userHeadScale || 1.0) * 1.25;

    // Head Hitbox (Full skull cranium mass from crown to jaw: radius 48px scaled)
    player.headHitbox.x = skeleton.head.worldX + player.direction * (14 * headScale);
    player.headHitbox.y = skeleton.head.worldY - (50 * headScale);
    player.headHitbox.radius = Math.round(48 * headScale);

    // Dedicated Forehead Strike Sweetspot (Forehead/brow header impact zone: radius 30px)
    if (!player.foreheadHitbox) player.foreheadHitbox = { x: 0, y: 0, radius: 30 };
    player.foreheadHitbox.x = skeleton.head.worldX + player.direction * (28 * headScale);
    player.foreheadHitbox.y = skeleton.head.worldY - (58 * headScale);
    player.foreheadHitbox.radius = Math.round(30 * headScale);

    // Kick Foot Hitbox (Covers Cleat Instep, Sole & Extended Toe: radius 26px)
    const footTip = skeleton.footFront.getWorldTip();
    const footOffsetX = Math.abs(footTip.x - skeleton.root.x);
    player.kickHitbox.x = player.x + player.direction * (footOffsetX + 4);
    player.kickHitbox.y = footTip.y - 2;
    player.kickHitbox.radius = 26;

    // Torso Hitbox (Chest / Body trap: radius 24px)
    if (!player.torsoHitbox) player.torsoHitbox = { x: 0, y: 0, radius: 24 };
    player.torsoHitbox.x = skeleton.torso.worldX + player.direction * 4;
    player.torsoHitbox.y = skeleton.torso.worldY - 12;
    player.torsoHitbox.radius = 24;

    const curAnim = player.animController.currentAnim;
    const isSpecialKick = ['bicycle_kick', 'rocket_kick', 'diving_header', 'scorpion_kick', 'smash_header'].includes(curAnim);
    const isKicking = curAnim === 'kick' || isSpecialKick;
    const isSuper = curAnim === 'super_shot';
    const isJumping = curAnim === 'jump' || !player.isGrounded;
    const isMoving = !!player.isMoving;

    // --- A. KICK FOOT COLLISION ---
    const distFoot = Math.hypot(ball.x - player.kickHitbox.x, ball.y - player.kickHitbox.y);
    if (distFoot < ball.radius + player.kickHitbox.radius) {
      const isRivalSuper = (ball.isSuper && ball.lastKickedBy === 'rival') || ball.superType === 'laser';
      if (isRivalSuper) {
        if (isKicking || isJumping) {
          const isLaser = ball.superType === 'laser';
          if (isLaser) {
            // OPTION 1: REFLEJO PRISMATICO ON FOOT KICK!
            ball.isSuper = true;
            ball.superType = 'laser_reflected';
            ball.superColors = ['#ffd700', '#ffffff', '#00f0ff'];
            ball.lastKickedBy = 'player';
            ball.vx = 1580;
            ball.vy = -25;
            powerSystem?.addPower(35);

            if (this.superShots) {
              const activeLaser = this.superShots.activeAbilities.find(a => a.type === 'laser');
              if (activeLaser) {
                activeLaser.dir = 1;
                activeLaser.owner = 'player';
                activeLaser.x = player.x;
                activeLaser.colors = ['#ffd700', '#ffffff', '#00f0ff'];
                activeLaser.isReflected = true;
                activeLaser.hasHitOpponent = false;
                activeLaser.hasSuperchargedBall = true;
                activeLaser.life = 0.65;
              }
            }

            this.soundManager.play('superPower');
            this.soundManager.play('laser');
            this.soundManager.playSubBassKick();
            this.particleSystem.spawnSonicBoom(footTip.x, footTip.y, 1, '#ffd700');
            this.particleSystem.spawnSparks(ball.x, ball.y, 45, '#ffd700');
            this.triggerShake(16);
            this.triggerHitStop(0.09);
            this.addFloatingText('🪞⚡ ¡REFLEJO PRISMÁTICO! ⚡🪞', player.x, player.y - 110, '#ffd700', 26);
            return;
          }

          // Standard Super Parry
          ball.isSuper = false;
          ball.lastKickedBy = 'player';
          ball.vx = 880;
          ball.vy = -260;
          powerSystem?.addPower(25);
          this.soundManager.playSubBassKick();
          this.particleSystem.spawnSonicBoom(footTip.x, footTip.y, 1, '#ffd700');
          this.particleSystem.spawnSparks(ball.x, ball.y, 35, '#00ffff');
          this.triggerShake(14);
          this.triggerHitStop(0.065);
          this.addFloatingText('⚡ ¡PARRY PERFECTO! 🛡️', player.x, player.y - 100, '#00f0ff', 24);
          return;
        } else {
          // UNGUARDED PLAYER STRUCK BY BLAST!
          const isLaser = ball.superType === 'laser';
          const stunDur = isLaser ? 2.6 : 0.65;
          const dmg = isLaser ? 35 : 25;
          this.applyDamage(player, dmg, ragdollSystem, -420, -380, true, stunDur);
          this.particleSystem.spawnSparks(ball.x, ball.y, 45, '#ff3700');
          this.soundManager.play('superExplode');
          this.soundManager.play('knockout');
          ball.isSuper = false;
          ball.superType = null;
          // Ball collides with player, damages, and launches high into the air!
          ball.vx = 380 + Math.random() * 100;
          ball.vy = -720 - Math.random() * 120;
          ball.spin = -14;
          return;
        }
      }

      const powerMult = (player.character?.stats?.power || 1.0) * (player.activePowerMultiplier || 1.0);
      const dir = player.direction;

      // Magnus Aerodynamic Spin Calculation based on Directional Input
      let spinIntent = 0;
      if (inputManager) {
        if (inputManager.isKeyDown('w') || inputManager.isKeyDown('arrowup')) {
          spinIntent = dir * 3.4; // Banana topspin dip over keeper!
        } else if (inputManager.isKeyDown('s') || inputManager.isKeyDown('arrowdown')) {
          spinIntent = -dir * 2.8; // Floating backspin lob!
        }
      }

      if (isSuper) {
        // 1. SIGNATURE SUPER SHOT
        this.kickCooldown = 0.22;
        ball.kick(dir * 960 * powerMult, -280 * powerMult, true, 'player', 'super', dir * 2.5);
        this.particleSystem.spawnFlameBurst(footTip.x, footTip.y, 32);
        this.particleSystem.spawnSonicBoom(footTip.x, footTip.y, dir, '#ff3700');
        this.soundManager.play('superExplode');
        this.triggerShake(16);
        this.triggerHitStop(0.06);
      } else if (curAnim === 'bicycle_kick') {
        // 2. BICYCLE KICK (Chilena acrobática aérea de máxima potencia)
        if (this.kickCooldown <= 0) {
          this.kickCooldown = 0.25;
          ball.kick(dir * (1160 + Math.random() * 80) * powerMult, -280 * powerMult, false, 'player', 'bicycle', dir * 3.6);
          powerSystem?.addPower(24);
          this.particleSystem.spawnSonicBoom(ball.x, ball.y, dir, '#ffd700');
          this.particleSystem.spawnKickImpact(ball.x, ball.y, dir, '#ffd700', 32);
          this.particleSystem.spawnFlameBurst(ball.x, ball.y, 22, ['#ffd700', '#ff8800', '#ffffff']);
          this.soundManager.play('chargedBlast');
          this.soundManager.play('kick');
          this.triggerShake(14);
          this.triggerHitStop(0.05);
          this.addFloatingText('🤸 ¡CHILENA ARCADE!', player.x, player.y - 95, '#ffd700', 22);
        }
      } else if (curAnim === 'rocket_kick') {
        // 3. ROCKET KICK (Cañonazo raso devastador a ras de pasto)
        if (this.kickCooldown <= 0) {
          this.kickCooldown = 0.22;
          ball.kick(dir * (1120 + Math.random() * 70) * powerMult, -85 * powerMult, false, 'player', 'rocket', dir * 1.4);
          powerSystem?.addPower(20);
          this.particleSystem.spawnTurfSpray(ball.x, groundY, dir, 22);
          this.particleSystem.spawnSonicBoom(ball.x, ball.y, dir, '#00f0ff');
          this.particleSystem.spawnKickImpact(ball.x, ball.y, dir, '#00f0ff', 28);
          this.soundManager.play('laser');
          this.soundManager.play('kick');
          this.triggerShake(12);
          this.triggerHitStop(0.045);
          this.addFloatingText('🚀 ¡TIRO COHETE!', player.x, player.y - 95, '#00f0ff', 22);
        }
      } else if (curAnim === 'diving_header') {
        // 4. DIVING HEADER (Palomita horizontal torpedo)
        if (this.kickCooldown <= 0) {
          this.kickCooldown = 0.22;
          ball.kick(dir * (1040 + Math.random() * 60) * powerMult, -170 * powerMult, false, 'player', 'palomita', dir * 2.0);
          powerSystem?.addPower(18);
          this.particleSystem.spawnSonicBoom(ball.x, ball.y, dir, '#00ffcc');
          this.particleSystem.spawnKickImpact(ball.x, ball.y, dir, '#00ffcc', 24);
          this.soundManager.play('headImpact');
          this.soundManager.play('kick');
          this.triggerShake(11);
          this.triggerHitStop(0.04);
          this.addFloatingText('⚡ ¡PALOMITA AGRESIVA!', player.x, player.y - 95, '#00ffcc', 22);
        }
      } else if (curAnim === 'scorpion_kick') {
        // 5. SCORPION KICK (Vaselina de tacón acrobática sobre la defensa)
        if (this.kickCooldown <= 0) {
          this.kickCooldown = 0.24;
          ball.kick(dir * (960 + Math.random() * 60) * powerMult, -440 * powerMult, false, 'player', 'scorpion', -dir * 3.4);
          powerSystem?.addPower(18);
          this.particleSystem.spawnKickImpact(ball.x, ball.y, dir, '#ff00aa', 24);
          this.soundManager.play('kick');
          this.triggerShake(10);
          this.triggerHitStop(0.04);
          this.addFloatingText('🦂 ¡TIRO ESCORPIÓN!', player.x, player.y - 95, '#ff00aa', 22);
        }
      } else if (curAnim === 'smash_header') {
        // 6. SMASH HEADER (Cabezazo picado hacia el piso)
        if (this.kickCooldown <= 0) {
          this.kickCooldown = 0.22;
          ball.kick(dir * (880 + Math.random() * 60) * powerMult, 360 * powerMult, false, 'player', 'smash', dir * 2.6);
          powerSystem?.addPower(18);
          this.particleSystem.spawnTurfSpray(ball.x, groundY, dir, 18);
          this.particleSystem.spawnKickImpact(ball.x, ball.y, dir, '#ffcc00', 24);
          this.soundManager.play('headImpact');
          this.triggerShake(11);
          this.triggerHitStop(0.04);
          this.addFloatingText('💥 ¡CABEZAZO DEMOLEDOR!', player.x, player.y - 95, '#ffcc00', 22);
        }
      } else if (isKicking) {
        // 7. ACTIVE KICK (Tiro directo base o cañonazo cargado)
        if (this.kickCooldown <= 0) {
          this.kickCooldown = 0.20;
          const isCharged = (player.activePowerMultiplier || 1.0) > 1.35;
          const kickSpin = spinIntent !== 0 ? spinIntent : (isCharged ? dir * 2.8 : (isMoving ? dir * 1.6 : dir * 0.8));

          ball.kick(
            dir * (780 + Math.random() * 80) * powerMult,
            (-340 - Math.random() * 80) * powerMult,
            false,
            'player',
            isCharged ? 'rocket' : 'drive',
            kickSpin
          );
          powerSystem?.addPower(isCharged ? 24 : 16);
          this.particleSystem.spawnKickImpact(footTip.x, footTip.y, dir, isCharged ? '#ffd700' : '#00ffcc', isCharged ? 30 : 20);
          this.particleSystem.spawnTurfSpray(footTip.x, groundY, dir, isCharged ? 18 : 12);
          if (isCharged) {
            this.soundManager.playSubBassKick();
            this.particleSystem.spawnSonicBoom(footTip.x, footTip.y, dir, '#ffd700');
            this.triggerShake(12);
            this.triggerHitStop(0.045);
          } else {
            this.soundManager.play('kick');
            this.triggerShake(8);
            this.triggerHitStop(0.035);
          }
          if (Math.abs(kickSpin) > 2.0) {
            this.addFloatingText(kickSpin * dir > 0 ? '🍌 ¡TIRO CON EFECTO!' : '🎯 ¡VASALINA FLOTANTE!', player.x, player.y - 95, '#00ffff', 20);
          }
        }
      } else if (isMoving) {
        // 8. RUNNING DRIBBLE (Toque en carrera)
        if (this.kickCooldown <= 0) {
          this.kickCooldown = 0.12;
          ball.vx = dir * 290;
          ball.vy = -140;
          ball.spin = dir * 0.9;
          ball.lastKickedBy = 'player';
          this.particleSystem.spawnSparks(footTip.x, footTip.y, 6, '#00f0ff');
          this.soundManager.play('bounce');
        }
      } else {
        // 9. STANDING STILL / IDLE
        if (this.kickCooldown <= 0) {
          this.kickCooldown = 0.15;
          ball.vx = dir * 85;
          ball.vy = -Math.abs(ball.vy) * 0.35 - 35;
          ball.lastKickedBy = 'player';
          this.soundManager.play('bounce');
        }
      }
    }

    // --- B. HEAD COLLISION (NEVER self-damages on headers) ---
    const distHead = Math.hypot(ball.x - player.headHitbox.x, ball.y - player.headHitbox.y);
    const distForehead = player.foreheadHitbox ? Math.hypot(ball.x - player.foreheadHitbox.x, ball.y - player.foreheadHitbox.y) : 999;
    const isHeadHit = distHead < ball.radius + player.headHitbox.radius || (player.foreheadHitbox && distForehead < ball.radius + player.foreheadHitbox.radius);

    if (isHeadHit) {
      player.hitFlashTimer = 0.12;
      const isRivalSuper = (ball.isSuper && ball.lastKickedBy === 'rival') || ball.superType === 'laser';
      const isViolentRivalShot = ball.lastKickedBy === 'rival' && ball.vx < -550;

      if (isRivalSuper) {
        // Can the player parry / counter the super shot with an active header or kick?
        const isHeaderAttempt = isJumping || curAnim === 'smash_header' || curAnim === 'diving_header';
        const isKickAttempt = isKicking;

        if (isHeaderAttempt || isKickAttempt) {
          const isLaser = ball.superType === 'laser';
          if (isLaser) {
            // OPTION 1: REFLEJO PRISMATICO ON FOREHEAD HEADER!
            ball.isSuper = true;
            ball.superType = 'laser_reflected';
            ball.superColors = ['#ffd700', '#ffffff', '#00f0ff'];
            ball.lastKickedBy = 'player';
            ball.vx = 1580;
            ball.vy = -25;
            powerSystem?.addPower(35);

            if (this.superShots) {
              const activeLaser = this.superShots.activeAbilities.find(a => a.type === 'laser');
              if (activeLaser) {
                activeLaser.dir = 1;
                activeLaser.owner = 'player';
                activeLaser.x = player.x;
                activeLaser.colors = ['#ffd700', '#ffffff', '#00f0ff'];
                activeLaser.isReflected = true;
                activeLaser.hasHitOpponent = false;
                activeLaser.hasSuperchargedBall = true;
                activeLaser.life = 0.65;
              }
            }

            this.soundManager.play('superPower');
            this.soundManager.play('laser');
            this.soundManager.playSubBassKick();
            this.particleSystem.spawnSonicBoom(player.headHitbox.x, player.headHitbox.y, 1, '#ffd700');
            this.particleSystem.spawnSparks(ball.x, ball.y, 45, '#ffd700');
            this.triggerShake(16);
            this.triggerHitStop(0.09);
            this.addFloatingText('🪞⚡ ¡REFLEJO PRISMÁTICO! ⚡🪞', player.x, player.y - 110, '#ffd700', 26);
          } else {
            // Standard Super Parry
            ball.isSuper = false;
            ball.lastKickedBy = 'player';
            ball.vx = 820;
            ball.vy = -240;
            powerSystem?.addPower(25);
            this.soundManager.playSubBassKick();
            this.particleSystem.spawnSonicBoom(player.headHitbox.x, player.headHitbox.y, 1, '#ffd700');
            this.particleSystem.spawnSparks(ball.x, ball.y, 35, '#00ffff');
            this.triggerShake(14);
            this.triggerHitStop(0.065);
            this.addFloatingText('⚡ ¡PARRY PERFECTO! 🛡️', player.x, player.y - 100, '#00f0ff', 24);
          }
        } else {
          // RIVAL ULTI BLAST HITS UNGUARDED PLAYER!
          const isLaser = ball.superType === 'laser';
          const stunDur = isLaser ? 2.6 : 0.65;
          const dmg = isLaser ? 35 : 25;
          this.applyDamage(player, dmg, ragdollSystem, -420, -380, true, stunDur);
          this.particleSystem.spawnSparks(ball.x, ball.y, 45, '#ff3700');
          this.soundManager.play('superExplode');
          this.soundManager.play('knockout');
          ball.isSuper = false;
          ball.superType = null;
          // Ball collides with player, damages, and launches high into the air!
          ball.vx = 380 + Math.random() * 100;
          ball.vy = -720 - Math.random() * 120;
          ball.spin = -14;
        }
      } else if (isViolentRivalShot) {
        // FAST RIVAL SHOT DEFLECTED BY FOREHEAD — REWARDING SOCCER BLOCK, NO DAMAGE, NO STUN!
        ball.vx = Math.abs(ball.vx) * 0.6 + 120;
        ball.vy = -Math.abs(ball.vy) * 0.5 - 140;
        ball.lastKickedBy = 'player';
        this.particleSystem.spawnSparks(ball.x, ball.y, 22, '#ffd700');
        this.soundManager.play('headImpact');
        powerSystem?.addPower(12);
        this.addFloatingText('🛡️ ¡CABEZAZO DEFENSIVO!', player.x, player.y - 85, '#ffd700', 18);
      } else {
        // PURE SOCCER HEADER
        const powerMult = (player.character?.stats?.power || 1.0) * (player.activePowerMultiplier || 1.0);
        const dir = player.direction;

        if (curAnim === 'smash_header') {
          if (this.kickCooldown <= 0) {
            this.kickCooldown = 0.22;
            ball.kick(dir * (880 + Math.random() * 60) * powerMult, 360 * powerMult, false, 'player', 'smash');
            powerSystem?.addPower(20);
            this.particleSystem.spawnTurfSpray(ball.x, groundY, dir, 18);
            this.particleSystem.spawnKickImpact(ball.x, ball.y, dir, '#ffd700', 26);
            this.soundManager.play('headImpact');
            this.triggerShake(12);
            this.triggerHitStop(0.045);
            this.addFloatingText('💥 ¡CABEZAZO DEMOLEDOR!', player.x, player.y - 95, '#ffd700', 22);
          }
        } else if (curAnim === 'diving_header') {
          if (this.kickCooldown <= 0) {
            this.kickCooldown = 0.22;
            ball.kick(dir * (1040 + Math.random() * 60) * powerMult, -170 * powerMult, false, 'player', 'palomita');
            powerSystem?.addPower(20);
            this.particleSystem.spawnSonicBoom(ball.x, ball.y, dir, '#00ffcc');
            this.particleSystem.spawnKickImpact(ball.x, ball.y, dir, '#00ffcc', 24);
            this.soundManager.play('headImpact');
            this.triggerShake(11);
            this.triggerHitStop(0.04);
            this.addFloatingText('⚡ ¡PALOMITA AGRESIVA!', player.x, player.y - 95, '#00ffcc', 22);
          }
        } else if (isJumping) {
          // ACTIVE JUMP HEADER (W pressed in air)
          if (this.kickCooldown <= 0) {
            this.kickCooldown = 0.20;
            ball.kick(
              dir * (680 + Math.random() * 80) * powerMult,
              -Math.abs(ball.vy) * 0.75 - 240,
              false,
              'player',
              'header'
            );
            powerSystem?.addPower(16);
            this.particleSystem.spawnKickImpact(ball.x, ball.y, dir, '#ffd700', 20);
            this.soundManager.play('headImpact');
            this.triggerShake(8);
          }
        } else if (isMoving) {
          // RUNNING HEADER (Running forward)
          if (this.kickCooldown <= 0) {
            this.kickCooldown = 0.15;
            ball.kick(
              dir * 420 * powerMult,
              -Math.abs(ball.vy) * 0.6 - 160,
              false,
              'player'
            );
            powerSystem?.addPower(8);
            this.particleSystem.spawnSparks(ball.x, ball.y, 10, '#ffd700');
            this.soundManager.play('headImpact');
          }
        } else {
          // STANDING STILL (Passive ball drop on head)
          if (this.kickCooldown <= 0) {
            this.kickCooldown = 0.16;
            ball.vx = dir * 135;
            ball.vy = -Math.abs(ball.vy) * 0.55 - 90;
            ball.lastKickedBy = 'player';
            this.soundManager.play('bounce');
            this.particleSystem.spawnSparks(ball.x, ball.y, 6, '#ffd700');
          }
        }
      }
    }

    // --- C. TORSO / BODY TRAP COLLISION ---
    const distTorso = Math.hypot(ball.x - player.torsoHitbox.x, ball.y - player.torsoHitbox.y);
    if (distTorso < ball.radius + player.torsoHitbox.radius && distFoot >= ball.radius + player.kickHitbox.radius && distHead >= ball.radius + player.headHitbox.radius) {
      const isRivalSuper = ball.isSuper && ball.lastKickedBy === 'rival';
      if (isRivalSuper) {
        if (isKicking || isJumping) {
          // CLUTCH CHEST-TRAP PARRY!
          ball.isSuper = false;
          ball.lastKickedBy = 'player';
          ball.vx = 820;
          ball.vy = -220;
          powerSystem?.addPower(25);
          this.soundManager.playSubBassKick();
          this.particleSystem.spawnSonicBoom(player.torsoHitbox.x, player.torsoHitbox.y, 1, '#ffd700');
          this.particleSystem.spawnSparks(ball.x, ball.y, 35, '#00ffff');
          this.triggerShake(14);
          this.triggerHitStop(0.065);
          this.addFloatingText('⚡ ¡PARRY CORPORAL! 🛡️', player.x, player.y - 100, '#00f0ff', 24);
          return;
        } else {
          this.applyDamage(player, 25, ragdollSystem, -320, -360, true);
          this.particleSystem.spawnSparks(ball.x, ball.y, 45, '#ff3700');
          this.soundManager.play('superExplode');
          ball.isSuper = false;
          ball.vx = Math.abs(ball.vx) * 0.35 + 80;
          ball.vy = -Math.abs(ball.vy) * 0.5 - 120;
          return;
        }
      }

      if (this.kickCooldown <= 0) {
        this.kickCooldown = 0.16;
        ball.vx = player.direction * (isMoving ? 190 : 80);
        ball.vy = -Math.abs(ball.vy) * 0.35 - 50;
        ball.lastKickedBy = 'player';
        this.soundManager.play('bounce');
      }
    }

    // 3. Player vs Rival Interactions (Tackles & Super Shot Hits)
    if (rivalBot && rivalBot.enabled) {
      // Player kicks rival directly in close combat
      const distFootRival = Math.hypot(player.kickHitbox.x - rivalBot.x, player.kickHitbox.y - (rivalBot.y - 25));
      const isPlayerKicking = ['kick', 'rocket_kick', 'bicycle_kick', 'diving_header', 'scorpion_kick', 'smash_header'].includes(player.animController.currentAnim);
      if (isPlayerKicking && distFootRival < 60 && !rivalBot.isStunned) {
        rivalBot.takeDamage(15, 220, -160, false); // Light chip damage & pushback, NO STUN!
        this.addFloatingText('💥 ¡PATADA!', rivalBot.x, rivalBot.y - 85, '#00ffcc', 18);
        this.onRivalDamageCallbacks.forEach(fn => fn(rivalBot.hp));
      }

      // Player Super Shot ball impacts rival
      if (ball.isSuper && ball.lastKickedBy === 'player') {
        const distBallRival = Math.hypot(ball.x - rivalBot.x, ball.y - (rivalBot.y - 65));
        if (distBallRival < ball.radius + 45) {
          const isRivalGuarding = rivalBot.isJumping || rivalBot.animController.currentAnim === 'kick';
          if (isRivalGuarding && !rivalBot.isStunned) {
            // Rival blocks / parries!
            ball.isSuper = false;
            ball.lastKickedBy = 'rival';
            ball.vx = -680;
            ball.vy = -240;
            rivalBot.takeDamage(12, 160, -120, false);
            this.soundManager.play('headImpact');
            this.particleSystem.spawnSparks(rivalBot.x, rivalBot.y - 60, 25, '#ffd700');
            this.addFloatingText('🛡️ ¡PARADA DEL RIVAL!', rivalBot.x, rivalBot.y - 95, '#ffd700', 20);
            this.triggerShake(10);
            this.triggerHitStop(0.045);
          } else {
            rivalBot.takeDamage(32, 380, -420, true);
            this.soundManager.play('superExplode');
            this.particleSystem.spawnSparks(rivalBot.x, rivalBot.y - 60, 45, '#ff3700');
            this.addFloatingText('🔥 ¡SUPER IMPACTO! 🔥', rivalBot.x, rivalBot.y - 95, '#ff3700', 24);
            ball.isSuper = false;
            ball.vx = 360;
          }
          this.onRivalDamageCallbacks.forEach(fn => fn(rivalBot.hp));
        }
      }
    }

    // Post, Crossbar & Top Corner joint collision event hook
    if (!ball.onCrossbarHit) {
      ball.onCrossbarHit = (cx, barY, speed, hitType = 'crossbar', isRight = false) => {
        this.soundManager.play('postClang');
        this.particleSystem.spawnPostHit(cx, barY);
        this.triggerShake(speed > 450 ? 12 : 8);

        let bannerText = '💥 ¡TRAVESAÑO!';
        let bannerColor = '#ffd700';

        if (hitType === 'corner') {
          bannerText = '📐 ¡A LA ESCUADRA!';
          bannerColor = '#00ffcc';
          this.triggerHitStop(0.045);
        } else if (hitType === 'post') {
          bannerText = '💥 ¡POSTE!';
          bannerColor = '#ff9900';
        }

        this.addFloatingText(bannerText, cx, barY - 35, bannerColor, 22);
        this.onPostHitCallbacks.forEach(fn => fn(isRight, cx, barY, speed, hitType));
      };
    }

    // Right Goal: Player scores! (Front line at stageWidth - 78)
    const rightGoalFrontX = stageWidth - 78;
    const goalH = 210;

    if (ball.x >= rightGoalFrontX && ball.y > groundY - goalH) {
      this.triggerPlayerGoal(stageWidth, groundY, ball, powerSystem, rivalBot);
    }

    // Left Goal: Rival scores! (Front line at 78)
    const leftGoalFrontX = 78;
    if (ball.x <= leftGoalFrontX && ball.y > groundY - goalH) {
      this.triggerRivalGoal(stageWidth, groundY, ball, rivalBot);
    }
  }

  triggerPlayerGoal(stageWidth, groundY, ball, powerSystem, rivalBot) {
    if (this.isMatchOver || this.goalCooldown > 0) return;
    this.goalCooldown = 2.5;
    this.playerGoals++;

    powerSystem?.addPower(35);
    this.soundManager.play('goalWhistle');
    this.soundManager.play('crowdCheer');
    this.particleSystem.spawnSparks(stageWidth - 55, groundY - 90, 45, '#00ffcc');
    this.particleSystem.spawnSparks(stageWidth - 55, groundY - 140, 45, '#ffcc00');
    this.particleSystem.spawnConfetti(stageWidth - 70, groundY - 140, 48);

    if (rivalBot) {
      rivalBot.animController.play('stun');
    }

    // Soft dampening inside the net
    ball.vx = -Math.abs(ball.vx) * 0.35 - 75;
    this.onGoalCallbacks.forEach(fn => fn(this.playerGoals, 'player', ball));

    // Reset ball to center after brief celebration
    setTimeout(() => {
      if (this.isMatchOver) return;
      ball.x = stageWidth * 0.5;
      ball.y = groundY - 180;
      ball.vx = 0;
      ball.vy = -180;
      ball.isSuper = false;
      ball.lastKickedBy = null;
    }, 1200);
  }

  triggerRivalGoal(stageWidth, groundY, ball, rivalBot) {
    if (this.isMatchOver || this.goalCooldown > 0) return;
    this.goalCooldown = 2.5;
    this.rivalGoals++;

    if (rivalBot) rivalBot.power = Math.min(100, rivalBot.power + 35);
    this.soundManager.play('goalWhistle');
    this.soundManager.play('crowdCheer');
    this.particleSystem.spawnSparks(55, groundY - 90, 45, '#ff3700');
    this.particleSystem.spawnSparks(55, groundY - 140, 45, '#ff9900');
    this.particleSystem.spawnConfetti(70, groundY - 140, 48);

    ball.vx = Math.abs(ball.vx) * 0.35 + 75;
    this.onRivalGoalCallbacks.forEach(fn => fn(this.rivalGoals, 'rival', ball));

    // Reset ball to center
    setTimeout(() => {
      ball.x = stageWidth * 0.5;
      ball.y = groundY - 180;
      ball.vx = 0;
      ball.vy = -180;
      ball.isSuper = false;
      ball.lastKickedBy = null;
    }, 1200);
  }

  renderFloatingTexts(ctx) {
    ctx.save();
    for (const ft of this.floatingTexts) {
      ctx.globalAlpha = Math.max(0, Math.min(1, ft.life));
      ctx.font = `900 ${ft.size}px "Outfit", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = ft.color;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.strokeText(ft.text, ft.x, ft.y);
      ctx.fillText(ft.text, ft.x, ft.y);
    }
    ctx.restore();
  }
}

exports.CollisionSystem = CollisionSystem;
};

__mods['physics/NetPhysics.js'] = function(exports, __req) {
/**
 * Real-Time 2D Verlet Integration Cloth / Spring-Mass Soccer Net Simulation.
 * Provides authentic physical net ballooning, ball wrapping, tension propagation,
 * and natural cloth ripples when shots enter either goal.
 */

class VerletParticle {
  constructor(x, y, pinned = false) {
    this.x = x;
    this.y = y;
    this.oldX = x;
    this.oldY = y;
    this.pinned = pinned;
  }
}

class VerletConstraint {
  constructor(p1, p2, stiffness = 0.95) {
    this.p1 = p1;
    this.p2 = p2;
    this.restLength = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    this.stiffness = stiffness;
  }

  resolve() {
    const dx = this.p2.x - this.p1.x;
    const dy = this.p2.y - this.p1.y;
    const dist = Math.hypot(dx, dy);
    if (dist === 0) return;

    const diff = (this.restLength - dist) / dist * 0.5 * this.stiffness;
    const offsetX = dx * diff;
    const offsetY = dy * diff;

    if (!this.p1.pinned) {
      this.p1.x -= offsetX;
      this.p1.y -= offsetY;
    }
    if (!this.p2.pinned) {
      this.p2.x += offsetX;
      this.p2.y += offsetY;
    }
  }
}

class GoalNetSimulation {
  constructor(isRight, frontX, backX, topY, groundY, cols = 7, rows = 11) {
    this.isRight = isRight;
    this.frontX = frontX;
    this.backX = backX;
    this.topY = topY;
    this.groundY = groundY;
    this.cols = cols;
    this.rows = rows;

    this.particles = [];
    this.constraints = [];
    this.grid = []; // grid[r][c]

    this.damping = 0.965; // cloth air damping
    this.gravity = 140;   // subtle net sag
    this.lastDisplacement = 0;

    this.buildGrid();
  }

  buildGrid() {
    this.particles = [];
    this.constraints = [];
    this.grid = [];

    const depth = Math.abs(this.frontX - this.backX);
    const height = this.groundY - this.topY;
    const startX = Math.min(this.frontX, this.backX);

    for (let r = 0; r <= this.rows; r++) {
      this.grid[r] = [];
      const normY = r / this.rows;
      const y = this.topY + normY * height;

      for (let c = 0; c <= this.cols; c++) {
        const normX = c / this.cols;
        const x = this.isRight
          ? this.frontX + normX * depth
          : this.frontX - normX * depth;

        // Pin conditions:
        // Top crossbar (r === 0)
        // Front upright post (c === 0)
        // Back ground anchor (r === this.rows && c === this.cols)
        const isPinned = (r === 0) || (c === 0 && (r === 0 || r === this.rows)) || (r === this.rows);

        const p = new VerletParticle(x, y, isPinned);
        this.particles.push(p);
        this.grid[r][c] = p;
      }
    }

    // Structural Constraints (Horizontal & Vertical)
    for (let r = 0; r <= this.rows; r++) {
      for (let c = 0; c <= this.cols; c++) {
        const current = this.grid[r][c];

        // Horizontal neighbor
        if (c < this.cols) {
          const right = this.grid[r][c + 1];
          this.constraints.push(new VerletConstraint(current, right, 0.92));
        }

        // Vertical neighbor
        if (r < this.rows) {
          const down = this.grid[r + 1][c];
          this.constraints.push(new VerletConstraint(current, down, 0.94));
        }

        // Diagonal Shear Constraints (prevents collapsing like a loose string)
        if (r < this.rows && c < this.cols) {
          const diag1 = this.grid[r + 1][c + 1];
          this.constraints.push(new VerletConstraint(current, diag1, 0.65));

          const diag2 = this.grid[r + 1][c];
          const diag3 = this.grid[r][c + 1];
          this.constraints.push(new VerletConstraint(diag2, diag3, 0.65));
        }
      }
    }
  }

  update(dt, ball, soundManager = null) {
    const fixedDt = Math.min(dt, 0.033);
    const timeSq = fixedDt * fixedDt;
    let netDisplacementThisFrame = 0;

    // 1. Verlet Integration Step
    for (const p of this.particles) {
      if (p.pinned) continue;

      const vx = (p.x - p.oldX) * this.damping;
      const vy = (p.y - p.oldY) * this.damping;

      p.oldX = p.x;
      p.oldY = p.y;

      p.x += vx;
      p.y += vy + this.gravity * timeSq;
    }

    // 2. Ball-to-Net Elastic Collision
    if (ball) {
      const ballRadius = ball.radius || 21;
      const collisionRadius = ballRadius + 4;
      const radiusSq = collisionRadius * collisionRadius;

      for (const p of this.particles) {
        const dx = p.x - ball.x;
        const dy = p.y - ball.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < radiusSq && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const nx = dx / dist;
          const ny = dy / dist;
          const push = collisionRadius - dist;

          if (!p.pinned) {
            p.x += nx * push * 0.85;
            p.y += ny * push * 0.85;
            netDisplacementThisFrame += push;
          }

          // Transfer net friction and drag to ball
          ball.vx *= 0.95;
          ball.vy *= 0.96;
        }
      }
    }

    // 3. Satisfy Distance Constraints (Relaxation iterations)
    const iterations = 4;
    for (let iter = 0; iter < iterations; iter++) {
      for (const c of this.constraints) {
        c.resolve();
      }
    }

    // Play net rustle sound on significant physical interaction
    if (netDisplacementThisFrame > 15 && this.lastDisplacement <= 15 && soundManager) {
      soundManager.play('netRustle');
    }
    this.lastDisplacement = netDisplacementThisFrame;
  }

  render(ctx, color = 'rgba(255, 255, 255, 0.55)', style = 'hexagon') {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;

    if (style === 'diamond' || style === 'classic') {
      // Draw all structural constraints as net cords
      ctx.beginPath();
      for (let r = 0; r <= this.rows; r++) {
        for (let c = 0; c <= this.cols; c++) {
          const p = this.grid[r][c];
          if (c < this.cols) {
            const right = this.grid[r][c + 1];
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(right.x, right.y);
          }
          if (r < this.rows) {
            const down = this.grid[r + 1][c];
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(down.x, down.y);
          }
        }
      }
      ctx.stroke();
    } else {
      // Hexagonal Honeycomb mesh derived from Verlet grid points
      ctx.beginPath();
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          const p0 = this.grid[r][c];
          const p1 = this.grid[r][c + 1];
          const p2 = this.grid[r + 1][c + 1];
          const p3 = this.grid[r + 1][c];

          const midTopX = (p0.x + p1.x) * 0.5;
          const midTopY = (p0.y + p1.y) * 0.5;
          const midBotX = (p3.x + p2.x) * 0.5;
          const midBotY = (p3.y + p2.y) * 0.5;

          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(midTopX, midTopY);
          ctx.lineTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(midBotX, midBotY);
          ctx.lineTo(p3.x, p3.y);
        }
      }
      ctx.stroke();
    }

    ctx.restore();
  }
}

exports.VerletParticle = VerletParticle;
exports.VerletConstraint = VerletConstraint;
exports.GoalNetSimulation = GoalNetSimulation;
};

__mods['physics/ParticleSystem.js'] = function(exports, __req) {
/**
 * Manages particle effects (sparks, flame auras, goal celebrations).
 */
class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  spawnSparks(x, y, count = 12, color = '#ffcc00') {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 2;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        radius: Math.random() * 4 + 2,
        life: 1.0,
        decay: Math.random() * 0.04 + 0.02,
        color: color
      });
    }
  }

  spawnFlameAura(x, y, colors = ['#ff3700', '#ffd000']) {
    if (this.particles.length > 160) return;
    for (let i = 0; i < 3; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 55,
        y: y + (Math.random() - 0.5) * 75,
        vx: (Math.random() - 0.5) * 2.5,
        vy: -Math.random() * 5 - 2,
        radius: Math.random() * 6 + 3,
        life: 1.0,
        decay: Math.random() * 0.06 + 0.04,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  /** Small lingering puff left behind a super-shot ball. */
  spawnTrail(x, y, color) {
    if (this.particles.length > 260) return;
    this.particles.push({
      x: x + (Math.random() - 0.5) * 14,
      y: y + (Math.random() - 0.5) * 14,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      radius: Math.random() * 7 + 5,
      life: 1.0,
      decay: 0.06,
      color
    });
  }

  /** Grass/dust kick-up when landing or sprint-turning. */
  spawnDust(x, y, count = 6) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 30,
        y,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 2 - 0.5,
        radius: Math.random() * 4 + 2,
        life: 0.8,
        decay: 0.04,
        color: Math.random() > 0.5 ? 'rgba(220, 255, 200, 0.8)' : 'rgba(120, 200, 90, 0.8)'
      });
    }
  }

  /** Air shockwave puff ring for double jump and sonic dash */
  spawnAirRing(x, y, color = '#00f0ff') {
    this.particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      radius: 8,
      maxRadius: 36,
      isRing: true,
      life: 1.0,
      decay: 0.08,
      color
    });
  }

  /** Festive confetti blast for goals */
  spawnConfetti(x, y, count = 40) {
    const palette = ['#ff0055', '#00ffcc', '#ffd700', '#ff8800', '#7928ca', '#ffffff', '#0099ff'];
    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI) + Math.PI; // upward fountain
      const speed = Math.random() * 9 + 4;
      this.particles.push({
        x: x + (Math.random() - 0.5) * 60,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: 0.18,
        width: Math.random() * 8 + 4,
        height: Math.random() * 5 + 3,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.28,
        isConfetti: true,
        life: 1.0,
        decay: Math.random() * 0.015 + 0.012,
        color: palette[Math.floor(Math.random() * palette.length)]
      });
    }
  }

  /** Metallic spark flash and shockwave when hitting the crossbar */
  spawnPostHit(x, y) {
    this.spawnAirRing(x, y, '#ffd700');
    this.spawnSparks(x, y, 16, '#ffffff');
    this.spawnSparks(x, y, 14, '#ffd700');
  }

  /** Directional Kick Impact Burst with shockwave ring and high-speed sparks */
  spawnKickImpact(x, y, dir = 1, color = '#00f0ff', count = 24) {
    // 1. Expanding shockwave ring
    this.particles.push({
      x,
      y,
      vx: dir * 4,
      vy: 0,
      radius: 10,
      maxRadius: 52,
      isRing: true,
      life: 1.0,
      decay: 0.08,
      color: '#ffffff'
    });

    // 2. High-speed directional sparks
    for (let i = 0; i < count; i++) {
      const spreadAngle = (Math.random() - 0.5) * 1.1; // Cone in direction
      const baseAngle = dir > 0 ? 0 : Math.PI;
      const angle = baseAngle + spreadAngle;
      const speed = Math.random() * 12 + 6;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        radius: Math.random() * 5 + 2,
        life: 1.0,
        decay: Math.random() * 0.04 + 0.025,
        color,
        additive: true
      });
    }
  }

  /** Supersonic boom rings traveling forward behind explosive strikes */
  spawnSonicBoom(x, y, dir = 1, color = '#00f0ff') {
    for (let i = 0; i < 3; i++) {
      this.particles.push({
        x: x + dir * i * 22,
        y,
        vx: dir * (10 + i * 3),
        vy: 0,
        radius: 12 + i * 8,
        maxRadius: 48 + i * 16,
        isRing: true,
        life: 1.0,
        decay: 0.07,
        color
      });
    }
  }

  /** Grass & Turf spray kicked up from the pitch during powerful volleys */
  spawnTurfSpray(x, y, dir = 1, count = 12) {
    for (let i = 0; i < count; i++) {
      const angle = dir > 0 ? -Math.PI * 0.75 + (Math.random() - 0.5) * 0.6 : -Math.PI * 0.25 + (Math.random() - 0.5) * 0.6;
      const speed = Math.random() * 8 + 3;
      this.particles.push({
        x: x + (Math.random() - 0.5) * 16,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: 0.32,
        width: Math.random() * 6 + 3,
        height: Math.random() * 3 + 2,
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.4,
        isConfetti: true,
        life: 1.0,
        decay: 0.035,
        color: Math.random() > 0.4 ? '#4caf50' : '#2e7d32'
      });
    }
  }

  /** High-energy flame burst for super dragon kicks and fireballs */
  spawnFlameBurst(x, y, count = 28, colors = ['#ff3700', '#ffd700', '#ff0055']) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 11 + 3;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        radius: Math.random() * 8 + 4,
        life: 1.0,
        decay: Math.random() * 0.05 + 0.03,
        color: colors[Math.floor(Math.random() * colors.length)],
        additive: true
      });
    }
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.isConfetti || p.gravity) {
        p.vy += p.gravity || 0.18;
        p.rotation += p.rotSpeed || 0.15;
      }
      p.life -= p.decay;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  render(ctx) {
    ctx.save();
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.life);
      if (p.additive) {
        ctx.globalCompositeOperation = 'lighter';
      } else {
        ctx.globalCompositeOperation = 'source-over';
      }

      if (p.isConfetti) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.width * 0.5, -p.height * 0.5, p.width, p.height);
        ctx.restore();
      } else if (p.isRing) {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 3.5 * p.life;
        ctx.beginPath();
        const r = p.radius + (p.maxRadius - p.radius) * (1.0 - p.life);
        ctx.ellipse(p.x, p.y, r, r * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }
    }
    ctx.restore();
  }
}

exports.ParticleSystem = ParticleSystem;
};

__mods['physics/PowerSystem.js'] = function(exports, __req) {
/**
 * Head Soccer Arcade Super Power System.
 * Automatically builds up Power (0-100%) during match play, hits, and passive time.
 * Unleashes instant devastating Super Shots without slow charging delays.
 */
class PowerSystem {
  constructor() {
    this.power = 30; // Starts with partial power for fast action
    this.maxPower = 100;
    this.isReady = false;
    this.onReadyCallbacks = [];
  }

  onReady(fn) {
    this.onReadyCallbacks.push(fn);
  }

  addPower(amount) {
    const prev = this.power;
    this.power = Math.min(this.maxPower, this.power + amount);

    if (prev < this.maxPower && this.power >= this.maxPower) {
      this.isReady = true;
      this.onReadyCallbacks.forEach(fn => fn());
    }
  }

  canUseSuper() {
    return this.power >= 80;
  }

  consumeSuper() {
    if (!this.canUseSuper()) return false;
    this.power = 0;
    this.isReady = false;
    return true;
  }

  update(dt) {
    // Passive arcade energy accumulation (~8% per second)
    if (this.power < this.maxPower) {
      this.addPower(8.5 * dt);
    }
  }

  getRatio() {
    return this.power / this.maxPower;
  }
}

exports.PowerSystem = PowerSystem;
};

__mods['physics/PowerUpSystem.js'] = function(exports, __req) {
/**
 * Mystery Air Drop Crates & Match Mutator System for Head Soccer.
 * Spawns parachute supply crates every 18s that can be cracked open by players or the ball,
 * unleashing game-changing abilities: Speed Boots, Freeze Bomb, Rocket Glove, Ticking Dynamite,
 * Reflector Shield, and Giant Head!
 */
class PowerUpSystem {
  /**
   * @param {import('../audio/SoundManager.js').SoundManager} soundManager
   * @param {import('./ParticleSystem.js').ParticleSystem} particleSystem
   */
  constructor(soundManager, particleSystem) {
    this.soundManager = soundManager;
    this.particleSystem = particleSystem;

    this.crates = [];
    this.spawnTimer = 8.0; // First air drop 8s into match!
    this.gloves = []; // Active rocket boxing gloves
    this.bombState = null; // Active dynamite on ball: { timer: 5.0, maxTime: 5.0 }

    // Active Buffs
    this.playerBuffs = { speed: 0, shield: 0, giant: 0 };
    this.rivalBuffs = { speed: 0, shield: 0, giant: 0 };
  }

  reset() {
    this.crates.length = 0;
    this.gloves.length = 0;
    this.bombState = null;
    this.spawnTimer = 8.0;
    this.playerBuffs = { speed: 0, shield: 0, giant: 0 };
    this.rivalBuffs = { speed: 0, shield: 0, giant: 0 };
  }

  update(dt, stageWidth, groundY, player, rivalBot, ball, collisionSystem) {
    // 1. Air Drop Spawn Timer
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0 && this.crates.length < 2) {
      this.spawnTimer = 16.0 + Math.random() * 8.0;
      this.spawnCrate(stageWidth);
    }

    // 2. Update Crates
    for (let i = this.crates.length - 1; i >= 0; i--) {
      const crate = this.crates[i];
      crate.time += dt;

      if (!crate.isGrounded) {
        crate.y += 95 * dt;
        crate.x += Math.sin(crate.time * 2.8) * 45 * dt;

        if (crate.y >= groundY - 22) {
          crate.y = groundY - 22;
          crate.isGrounded = true;
          this.soundManager.play('bounce');
          this.particleSystem.spawnSparks(crate.x, groundY, 10, '#ffd700');
        }
      } else {
        crate.groundLife -= dt;
        if (crate.groundLife <= 0) {
          this.crates.splice(i, 1);
          continue;
        }
      }

      // Check collision with Player
      const distP1 = Math.hypot(crate.x - player.x, crate.y - (player.y - 45));
      if (distP1 < 48) {
        this.collectCrate(crate, 'player', player, rivalBot, ball, collisionSystem);
        this.crates.splice(i, 1);
        continue;
      }

      // Check collision with Rival
      if (rivalBot && rivalBot.enabled) {
        const distRival = Math.hypot(crate.x - rivalBot.x, crate.y - (rivalBot.y - 45));
        if (distRival < 48) {
          this.collectCrate(crate, 'rival', player, rivalBot, ball, collisionSystem);
          this.crates.splice(i, 1);
          continue;
        }
      }

      // Check collision with Ball
      const distBall = Math.hypot(crate.x - ball.x, crate.y - ball.y);
      if (distBall < ball.radius + 24) {
        const beneficiary = ball.lastKickedBy === 'rival' ? 'rival' : 'player';
        this.collectCrate(crate, beneficiary, player, rivalBot, ball, collisionSystem);
        this.crates.splice(i, 1);
        continue;
      }
    }

    // 3. Update Active Boxing Gloves
    for (let i = this.gloves.length - 1; i >= 0; i--) {
      const g = this.gloves[i];
      g.x += g.vx * dt;
      g.life -= dt;

      // Particle smoke trail
      this.particleSystem.spawnTrail(g.x, g.y, '#ff3700');

      // Check hit opponent
      const target = g.owner === 'player' ? rivalBot : player;
      if (target && !target.isStunned) {
        const dist = Math.hypot(g.x - target.x, g.y - (target.y - 50));
        if (dist < 55) {
          this.soundManager.play('punch');
          this.soundManager.play('superExplode');
          target.takeDamage ? target.takeDamage(35, g.vx * 0.45, -380, true) : collisionSystem.applyDamage(player, 35, null, g.vx * 0.45, -380, true);
          collisionSystem.addFloatingText('🥊 ¡K.O. GUANTAZO! 🥊', target.x, target.y - 100, '#ff3700', 24);
          this.particleSystem.spawnSparks(target.x, target.y - 50, 30, '#ffd700');
          this.gloves.splice(i, 1);
          continue;
        }
      }

      if (g.life <= 0 || g.x < 40 || g.x > stageWidth - 40) {
        this.gloves.splice(i, 1);
      }
    }

    // 4. Update Ticking Bomb on Ball
    if (this.bombState) {
      this.bombState.timer -= dt;
      ball.isBomb = true;
      ball.bombTimer = this.bombState.timer;

      // Spark fuse
      this.particleSystem.spawnSparks(ball.x, ball.y - ball.radius - 8, 3, '#ffd700');

      if (this.bombState.timer <= 0) {
        // DETONATION!
        this.bombState = null;
        ball.isBomb = false;
        this.soundManager.play('superExplode');
        this.particleSystem.spawnSparks(ball.x, ball.y, 60, '#ff3700');
        this.particleSystem.spawnSparks(ball.x, ball.y, 40, '#ffd700');
        collisionSystem.addFloatingText('💥 ¡BOOOOM! 💣', ball.x, ball.y - 90, '#ff3700', 32);

        // Blast nearby characters
        const dP1 = Math.hypot(ball.x - player.x, ball.y - player.y);
        if (dP1 < 160) {
          collisionSystem.applyDamage(player, 35, null, (player.x - ball.x) * 4, -520, true);
        }
        if (rivalBot && rivalBot.enabled) {
          const dRival = Math.hypot(ball.x - rivalBot.x, ball.y - rivalBot.y);
          if (dRival < 160) {
            rivalBot.takeDamage(35, (rivalBot.x - ball.x) * 4, -520, true);
          }
        }
      }
    } else {
      ball.isBomb = false;
    }

    // 5. Update Active Buffs
    this.updateBuffs(this.playerBuffs, player, dt);
    if (rivalBot) this.updateBuffs(this.rivalBuffs, rivalBot, dt);
  }

  updateBuffs(buffs, entity, dt) {
    if (buffs.speed > 0) {
      buffs.speed -= dt;
      entity.speedMultiplier = 1.65;
      this.particleSystem.spawnTrail(entity.x, entity.y - 20, '#00f0ff');
    } else {
      entity.speedMultiplier = 1.0;
    }

    if (buffs.shield > 0) {
      buffs.shield -= dt;
      entity.hasShield = true;
    } else {
      entity.hasShield = false;
    }

    if (buffs.giant > 0) {
      buffs.giant -= dt;
      entity.giantHeadMultiplier = 1.65;
    } else {
      entity.giantHeadMultiplier = 1.0;
    }
  }

  spawnCrate(stageWidth) {
    const x = stageWidth * (0.24 + Math.random() * 0.52);
    const crateTypes = ['speed', 'freeze', 'glove', 'bomb', 'shield', 'giant'];
    const type = crateTypes[Math.floor(Math.random() * crateTypes.length)];

    this.crates.push({
      x,
      y: -50,
      type,
      time: 0,
      isGrounded: false,
      groundLife: 15.0
    });
  }

  collectCrate(crate, recipient, player, rivalBot, ball, collisionSystem) {
    this.soundManager.play('powerup');
    this.particleSystem.spawnSparks(crate.x, crate.y, 35, '#ffd700');
    this.particleSystem.spawnSparks(crate.x, crate.y, 25, '#00f0ff');

    const isP1 = recipient === 'player';
    const collector = isP1 ? player : rivalBot;
    const opponent = isP1 ? rivalBot : player;
    const buffs = isP1 ? this.playerBuffs : this.rivalBuffs;
    const prefix = isP1 ? '⭐ ' : '🤖 ';

    switch (crate.type) {
      case 'speed':
        buffs.speed = 6.5;
        collisionSystem.addFloatingText(`${prefix}¡BOTAS SÓNICAS! ⚡`, collector.x, collector.y - 90, '#00f0ff', 22);
        break;

      case 'freeze':
        if (opponent && opponent.freeze) {
          opponent.freeze(2.2);
          this.soundManager.play('freeze');
          collisionSystem.addFloatingText(`${prefix}¡BOMBA DE HIELO! 🧊`, opponent.x, opponent.y - 90, '#00ffff', 22);
        }
        break;

      case 'glove':
        const dir = isP1 ? (collector.direction || 1) : -1;
        this.soundManager.play('glove');
        this.gloves.push({
          x: collector.x + dir * 40,
          y: collector.y - 45,
          vx: dir * 1150,
          owner: recipient,
          life: 1.8
        });
        collisionSystem.addFloatingText(`${prefix}¡GUANTE COHETE! 🥊`, collector.x, collector.y - 90, '#ff3700', 22);
        break;

      case 'bomb':
        this.bombState = { timer: 5.0, maxTime: 5.0 };
        collisionSystem.addFloatingText('💣 ¡BALÓN DINAMITA! 💣', ball.x, ball.y - 90, '#ff0044', 24);
        break;

      case 'shield':
        buffs.shield = 7.0;
        collisionSystem.addFloatingText(`${prefix}¡ESCUDO DEFLECTOR! 🛡️`, collector.x, collector.y - 90, '#ffd700', 22);
        break;

      case 'giant':
        buffs.giant = 8.0;
        collisionSystem.addFloatingText(`${prefix}¡MEGA CABEZA! 🍄`, collector.x, collector.y - 90, '#ff00ff', 22);
        break;
    }
  }

  render(ctx) {
    const time = performance.now() * 0.005;

    // 1. Render Air Drop Crates
    for (const c of this.crates) {
      ctx.save();
      ctx.translate(c.x, c.y);

      // Parachute if in air
      if (!c.isGrounded) {
        ctx.save();
        const sway = Math.sin(time + c.x * 0.01) * 0.12;
        ctx.rotate(sway);

        // Parachute suspension rigging cords
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(-32, -42);
        ctx.lineTo(-14, -16);
        ctx.moveTo(32, -42);
        ctx.lineTo(14, -16);
        ctx.moveTo(-16, -42);
        ctx.lineTo(-6, -16);
        ctx.moveTo(16, -42);
        ctx.lineTo(6, -16);
        ctx.stroke();

        // Parachute Canopy Base Dome
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 4;

        // Alternating Striped Silk Canopy
        const canopyW = 34;
        const canopyH = 26;
        const canopyY = -42;

        // Outer Orange Gores
        ctx.fillStyle = '#ff5500';
        ctx.beginPath();
        ctx.moveTo(-canopyW, canopyY);
        ctx.quadraticCurveTo(-canopyW * 0.85, canopyY - canopyH, 0, canopyY - canopyH);
        ctx.quadraticCurveTo(canopyW * 0.85, canopyY - canopyH, canopyW, canopyY);
        ctx.quadraticCurveTo(0, canopyY + 6, -canopyW, canopyY);
        ctx.fill();

        // Center White Panel Gore
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(-canopyW * 0.42, canopyY);
        ctx.quadraticCurveTo(-canopyW * 0.25, canopyY - canopyH, 0, canopyY - canopyH);
        ctx.quadraticCurveTo(canopyW * 0.25, canopyY - canopyH, canopyW * 0.42, canopyY);
        ctx.quadraticCurveTo(0, canopyY + 4, -canopyW * 0.42, canopyY);
        ctx.fill();

        // Inner Shadow / Depth Arc
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-canopyW, canopyY);
        ctx.quadraticCurveTo(0, canopyY + 6, canopyW, canopyY);
        ctx.stroke();

        ctx.restore();
      }

      // Fortified High-Tech Supply Crate
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 3;

      // Dark reinforced metal body
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(-18, -18, 36, 36, 5);
      ctx.fill();

      // Industrial hazard gold inner face
      const crateGrad = ctx.createLinearGradient(-15, -15, 15, 15);
      crateGrad.addColorStop(0, '#f59e0b');
      crateGrad.addColorStop(1, '#b45309');
      ctx.fillStyle = crateGrad;
      ctx.beginPath();
      ctx.roundRect(-14, -14, 28, 28, 3);
      ctx.fill();

      // Corner steel bracket reinforcements
      ctx.fillStyle = '#0f172a';
      const bSize = 7;
      ctx.fillRect(-18, -18, bSize, bSize);
      ctx.fillRect(18 - bSize, -18, bSize, bSize);
      ctx.fillRect(-18, 18 - bSize, bSize, bSize);
      ctx.fillRect(18 - bSize, 18 - bSize, bSize, bSize);

      // Steel Rivets
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-16, -16, 3, 3);
      ctx.fillRect(13, -16, 3, 3);
      ctx.fillRect(-16, 13, 3, 3);
      ctx.fillRect(13, 13, 3, 3);

      // Pulsing Holographic Core & Question Mark
      const pulse = 0.85 + Math.sin(time * 3) * 0.15;
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 14 * pulse;
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 20px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('?', 0, 1);

      ctx.restore();
      ctx.restore();
    }

    // 2. Render Rocket Boxing Gloves (High-Fidelity Arcade Sprite)
    for (const g of this.gloves) {
      ctx.save();
      ctx.translate(g.x, g.y);
      const dir = Math.sign(g.vx);
      if (dir < 0) {
        ctx.scale(-1, 1);
      }

      // Jet Engine Exhaust Flame
      const flameFlicker = 1.0 + Math.sin(time * 12) * 0.25;
      const flameGrad = ctx.createLinearGradient(-14, 0, -42 * flameFlicker, 0);
      flameGrad.addColorStop(0, '#ffffff');
      flameGrad.addColorStop(0.2, '#00f0ff');
      flameGrad.addColorStop(0.6, '#ff5500');
      flameGrad.addColorStop(1, 'rgba(255, 0, 0, 0)');

      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 16;
      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.moveTo(-14, -8);
      ctx.lineTo(-42 * flameFlicker, 0);
      ctx.lineTo(-14, 8);
      ctx.closePath();
      ctx.fill();

      // Chrome Rocket Thruster Nozzle
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = '#475569';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-16, -11, 10, 22, 2);
      ctx.fill();
      ctx.stroke();

      // Boxing Glove Main Leather Fist
      ctx.fillStyle = '#dc2626';
      ctx.strokeStyle = '#7f1d1d';
      ctx.lineWidth = 2.2;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.moveTo(-6, -16);
      ctx.quadraticCurveTo(18, -18, 24, -4);
      ctx.quadraticCurveTo(26, 12, 14, 18);
      ctx.quadraticCurveTo(0, 18, -6, 12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Glove Thumb
      ctx.beginPath();
      ctx.moveTo(8, -10);
      ctx.quadraticCurveTo(16, -6, 12, 4);
      ctx.stroke();

      // Golden Wrist Binding Cuff
      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1.2;
      ctx.fillRect(-9, -13, 5, 26);
      ctx.strokeRect(-9, -13, 5, 26);

      ctx.restore();
    }
  }
}

exports.PowerUpSystem = PowerUpSystem;
};

__mods['physics/RagdollSystem.js'] = function(exports, __req) {
/**
 * 2D Floppy Ragdoll Physics Simulator for Head Soccer Knockouts.
 * Uses Verlet integration and distance constraints to simulate comical floppy doll tumbles.
 */
class RagdollSystem {
  /**
   * @param {import('../core/Skeleton.js').Skeleton} skeleton
   * @param {import('../audio/SoundManager.js').SoundManager} soundManager
   * @param {import('./ParticleSystem.js').ParticleSystem} particleSystem
   */
  constructor(skeleton, soundManager, particleSystem) {
    this.skeleton = skeleton;
    this.soundManager = soundManager;
    this.particleSystem = particleSystem;

    this.isActive = false;
    this.timer = 0;
    this.maxDuration = 1.4; // 1.4 seconds of comical tumbling and fast recovery

    // Ragdoll point masses
    this.points = [];
    this.constraints = [];

    this.gravity = 980;
    this.friction = 0.985;
    this.groundFriction = 0.88;

    this.onRecoverCallbacks = [];
  }

  onRecover(fn) {
    this.onRecoverCallbacks.push(fn);
  }

  start(player, impulseX = -420, impulseY = -540) {
    this.isActive = true;
    this.timer = this.maxDuration;
    player.isKnockedOut = true;

    // Snapshot current bone world positions to initialize ragdoll particles
    const s = this.skeleton;
    const px = player.x;
    const py = player.y;

    // Give head and torso extra rotational torque for comical somersaults
    this.points = [
      { id: 'hip', x: s.hip.worldX || px, y: s.hip.worldY || (py - 32), oldX: (s.hip.worldX || px) - impulseX * 0.016, oldY: (s.hip.worldY || (py - 32)) - impulseY * 0.016, radius: 14 },
      { id: 'torso', x: s.torso.worldX || px, y: s.torso.worldY || (py - 58), oldX: (s.torso.worldX || px) - impulseX * 0.019, oldY: (s.torso.worldY || (py - 58)) - (impulseY + 50) * 0.019, radius: 18 },
      { id: 'head', x: s.head.worldX || px, y: s.head.worldY || (py - 90), oldX: (s.head.worldX || px) - (impulseX * 1.25) * 0.024, oldY: (s.head.worldY || (py - 90)) - (impulseY + 120) * 0.024, radius: 36 },
      { id: 'foot_front', x: s.footFront.worldX || (px + 12), y: s.footFront.worldY || (py - 10), oldX: (s.footFront.worldX || (px + 12)) - impulseX * 0.014, oldY: (s.footFront.worldY || (py - 10)) - impulseY * 0.014, radius: 10 },
      { id: 'foot_back', x: s.footBack.worldX || (px - 12), y: s.footBack.worldY || (py - 10), oldX: (s.footBack.worldX || (px - 12)) - impulseX * 0.012, oldY: (s.footBack.worldY || (py - 10)) - impulseY * 0.012, radius: 10 },
      { id: 'arm_front', x: s.armFront?.worldX || (px + 16), y: s.armFront?.worldY || (py - 45), oldX: (s.armFront?.worldX || (px + 16)) - (impulseX * 1.1) * 0.020, oldY: (s.armFront?.worldY || (py - 45)) - impulseY * 0.020, radius: 8 },
      { id: 'arm_back', x: s.armBack?.worldX || (px - 16), y: s.armBack?.worldY || (py - 45), oldX: (s.armBack?.worldX || (px - 16)) - (impulseX * 0.9) * 0.016, oldY: (s.armBack?.worldY || (py - 45)) - impulseY * 0.016, radius: 8 }
    ];

    // Distance constraints (connecting floppy ragdoll bones)
    this.constraints = [
      this.createConstraint('hip', 'torso'),
      this.createConstraint('torso', 'head'),
      this.createConstraint('hip', 'foot_front'),
      this.createConstraint('hip', 'foot_back'),
      this.createConstraint('torso', 'arm_front'),
      this.createConstraint('torso', 'arm_back'),
      this.createConstraint('head', 'hip'), // prevents head from inverting through torso
      this.createConstraint('foot_front', 'foot_back') // prevents splits
    ];

    this.soundManager.play('knockout');
    this.particleSystem.spawnSparks(this.points[2].x, this.points[2].y, 30, '#ffd700');
    this.particleSystem.spawnSparks(this.points[2].x, this.points[2].y, 15, '#ff3700');
  }

  createConstraint(idA, idB) {
    const pA = this.getPoint(idA);
    const pB = this.getPoint(idB);
    const dist = Math.hypot(pA.x - pB.x, pA.y - pB.y);
    return { a: pA, b: pB, length: Math.max(14, dist) };
  }

  getPoint(id) {
    return this.points.find(p => p.id === id);
  }

  update(dt, groundY, stageWidth, player) {
    if (!this.isActive) return;

    this.timer -= dt;

    // 1. Verlet Integration on particles
    for (const p of this.points) {
      const vx = (p.x - p.oldX) * this.friction;
      const vy = (p.y - p.oldY) * this.friction + this.gravity * (dt * dt);

      p.oldX = p.x;
      p.oldY = p.y;
      p.x += vx;
      p.y += vy;

      // Ground collision & comical bouncy restitution
      if (p.y + p.radius > groundY) {
        const impactSpeed = Math.abs(vy);
        p.y = groundY - p.radius;
        p.oldY = p.y + vy * 0.48; // bounciness
        p.oldX = p.x - (p.x - p.oldX) * this.groundFriction;

        if (impactSpeed > 1.2 && Math.random() < 0.35) {
          this.soundManager.play('bounce');
          this.particleSystem.spawnSparks(p.x, groundY, 4, '#aaa');
        }
      }

      // Left & Right Pitch Boundaries
      if (p.x - p.radius < 30) {
        p.x = 30 + p.radius;
        p.oldX = p.x + vx * 0.55;
      }
      if (p.x + p.radius > stageWidth - 30) {
        p.x = stageWidth - 30 - p.radius;
        p.oldX = p.x + vx * 0.55;
      }
    }

    // 2. Solve Distance Constraints (relaxation loops)
    for (let iter = 0; iter < 4; iter++) {
      for (const c of this.constraints) {
        const dx = c.b.x - c.a.x;
        const dy = c.b.y - c.a.y;
        const currentDist = Math.hypot(dx, dy) || 1;
        const delta = (currentDist - c.length) / currentDist;

        c.a.x += dx * 0.5 * delta;
        c.a.y += dy * 0.5 * delta;
        c.b.x -= dx * 0.5 * delta;
        c.b.y -= dy * 0.5 * delta;
      }
    }

    // 3. Sync ragdoll positions back to Player and Skeleton
    const pHip = this.getPoint('hip');
    const pTorso = this.getPoint('torso');
    const pHead = this.getPoint('head');
    const pFootF = this.getPoint('foot_front');
    const pFootB = this.getPoint('foot_back');
    const pArmF = this.getPoint('arm_front');
    const pArmB = this.getPoint('arm_back');

    player.x = pHip.x;
    player.y = pHip.y + 28;

    // Apply world positions directly
    const s = this.skeleton;
    s.root.worldX = pHip.x;
    s.root.worldY = pHip.y + 28;

    s.hip.worldX = pHip.x;
    s.hip.worldY = pHip.y;
    s.hip.worldRotation = Math.atan2(pTorso.y - pHip.y, pTorso.x - pHip.x) * (180 / Math.PI);

    s.torso.worldX = pTorso.x;
    s.torso.worldY = pTorso.y;
    s.torso.worldRotation = Math.atan2(pHead.y - pTorso.y, pHead.x - pTorso.x) * (180 / Math.PI);

    s.head.worldX = pHead.x;
    s.head.worldY = pHead.y;
    // Comical head flopping oscillation
    s.head.worldRotation = s.torso.worldRotation + Math.sin(this.timer * 18) * 25;

    s.footFront.worldX = pFootF.x;
    s.footFront.worldY = pFootF.y;
    s.footFront.worldRotation = Math.atan2(pFootF.y - pHip.y, pFootF.x - pHip.x) * (180 / Math.PI) - 90;

    s.footBack.worldX = pFootB.x;
    s.footBack.worldY = pFootB.y;
    s.footBack.worldRotation = Math.atan2(pFootB.y - pHip.y, pFootB.x - pHip.x) * (180 / Math.PI) - 90;

    if (s.armFront) {
      s.armFront.worldX = pArmF.x;
      s.armFront.worldY = pArmF.y;
      s.armFront.worldRotation = Math.atan2(pArmF.y - pTorso.y, pArmF.x - pTorso.x) * (180 / Math.PI) - 90;
    }
    if (s.armBack) {
      s.armBack.worldX = pArmB.x;
      s.armBack.worldY = pArmB.y;
      s.armBack.worldRotation = Math.atan2(pArmB.y - pTorso.y, pArmB.x - pTorso.x) * (180 / Math.PI) - 90;
    }

    // Recover after duration ends
    if (this.timer <= 0) {
      this.recover(player, groundY);
    }
  }

  renderDizzyStars(ctx) {
    if (!this.isActive) return;
    const pHead = this.getPoint('head');
    if (!pHead) return;

    ctx.save();
    const starCount = 4;
    const time = (this.maxDuration - this.timer) * 7;
    const radiusX = 46;
    const radiusY = 18;

    for (let i = 0; i < starCount; i++) {
      const angle = time + (i * (Math.PI * 2 / starCount));
      const sx = pHead.x + Math.cos(angle) * radiusX;
      const sy = pHead.y - 45 + Math.sin(angle) * radiusY;

      ctx.font = '22px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 12;
      ctx.fillText(i % 2 === 0 ? '⭐' : '💫', sx, sy);
    }
    ctx.restore();
  }

  recover(player, groundY) {
    this.isActive = false;
    player.isKnockedOut = false;
    player.y = groundY;
    player.hp = player.maxHp || 100;
    this.skeleton.setPosition(player.x, player.y);
    this.skeleton.updateTransforms();
    this.soundManager.play('recover');
    this.particleSystem.spawnSparks(player.x, groundY - 30, 30, '#00ffcc');
    this.particleSystem.spawnSparks(player.x, groundY - 60, 20, '#ffd700');
    this.onRecoverCallbacks.forEach(fn => fn());
  }
}

exports.RagdollSystem = RagdollSystem;
};

__mods['physics/RivalBot.js'] = function(exports, __req) {
const {  Skeleton  } = __req('core/Skeleton.js');
const {  AnimationController  } = __req('animation/AnimationController.js');
const {  getCharacter  } = __req('data/Characters.js');

/**
 * Autonomous CPU Rival Opponent for 1v1 Head Soccer.
 * Defends the right goal, tracks the ball, performs header jumps, tackles,
 * and launches character-specific Rival Super Shots!
 */
class RivalBot {
  /**
   * @param {number} groundY
   * @param {number} stageWidth
   * @param {import('../audio/SoundManager.js').SoundManager} soundManager
   * @param {import('./ParticleSystem.js').ParticleSystem} particleSystem
   */
  constructor(groundY, stageWidth, soundManager, particleSystem) {
    this.groundY = groundY;
    this.stageWidth = stageWidth;
    this.soundManager = soundManager;
    this.particleSystem = particleSystem;

    this.skeleton = new Skeleton();
    this.animController = new AnimationController(this.skeleton);
    this.animController.headScaleMultiplier = 1.0;

    this.character = getCharacter('luchador'); // Defaults to El Toro 🇲🇽

    this.x = stageWidth - 230;
    this.y = groundY;
    this.vx = 0;
    this.vy = 0;
    this.direction = -1; // Primary facing: LEFT towards player & field
    this.isGrounded = true;
    this.isStunned = false;
    this.stunTimer = 0;
    this.hp = 100;
    this.maxHp = 100;
    this.power = 30; // Starts with partial super gauge
    this.kickHitbox = { x: 0, y: 0, radius: 26 };
    this.headHitbox = { x: 0, y: 0, radius: 48 };
    this.foreheadHitbox = { x: 0, y: 0, radius: 30 };
    this.torsoHitbox = { x: 0, y: 0, radius: 24 };
    this.hitFlashTimer = 0;
    this.isFrozen = false;
    this.freezeTimer = 0;
    this.hasShield = false;
    this.speedMultiplier = 1.0;
    this.giantHeadMultiplier = 1.0;

    this.isHumanControlled = false;
    this.canDoubleJump = true;
    this.isDashing = false;
    this.dashTimer = 0;
    this.dashVx = 0;
    this.dashCooldown = 0;
    this.dashGhosts = [];
    this.isSpinning = false;
    this.spinTime = 0;
    this.spinDuration = 0.36;
    this.flipAngle = 0;
    this.isMoving = false;
    this.activePowerMultiplier = 1.0;

    this.kickCooldown = 0;
    this.tackleCooldown = 0;
    this.jumpCooldown = 0;
    this.enabled = true;
    this.difficulty = 'medium';
  }

  setHumanControlled(isHuman) {
    this.isHumanControlled = !!isHuman;
  }

  setDifficulty(level = 'medium') {
    this.difficulty = level;
    if (level === 'easy') {
      this.speedMultiplier = 0.82;
    } else if (level === 'medium') {
      this.speedMultiplier = 1.0;
    } else if (level === 'hard') {
      this.speedMultiplier = 1.25;
    } else if (level === 'champion') {
      this.speedMultiplier = 1.45;
    }
  }

  freeze(duration = 2.0) {
    if (this.hasShield) return;
    this.isFrozen = true;
    this.freezeTimer = duration;
    this.vx = 0;
    this.soundManager.play('freeze');
    this.particleSystem.spawnSparks(this.x, this.y - 45, 25, '#00ffff');
  }

  setCharacter(character) {
    this.character = character;
    this.hp = 100;
    this.maxHp = 100;
    this.animController.play('idle');
  }

  resetPosition() {
    this.x = this.stageWidth - 230;
    this.y = this.groundY;
    this.vx = 0;
    this.vy = 0;
    this.isGrounded = true;
    this.isStunned = false;
    this.isFrozen = false;
    this.freezeTimer = 0;
    this.stunTimer = 0;
    this.direction = -1;
    this.isDashing = false;
    this.dashTimer = 0;
    this.dashVx = 0;
    this.dashGhosts = [];
    this.isSpinning = false;
    this.spinTime = 0;
    this.flipAngle = 0;
    this.canDoubleJump = true;
    this.isMoving = false;
    this.activePowerMultiplier = 1.0;
    this.animController.play('idle');
  }

  triggerJump() {
    if (this.isStunned || this.isFrozen || !this.enabled) return;
    this.soundManager.init();

    if (this.isGrounded) {
      const jumpMult = this.character?.stats?.jump || 1.0;
      this.vy = -750 * jumpMult;
      this.isGrounded = false;
      this.canDoubleJump = true;
      this.animController.play('jump');
      this.animController.triggerJumpStretch(1.25);
      this.soundManager.play('headImpact');
      this.particleSystem.spawnDust(this.x, this.y, 8);
    } else if (this.canDoubleJump) {
      const jumpMult = this.character?.stats?.jump || 1.0;
      this.vy = -520 * jumpMult;
      this.canDoubleJump = false;
      this.isSpinning = true;
      this.spinTime = 0;
      this.spinDuration = 0.36;
      this.flipAngle = 0;
      this.soundManager.play('recover');
      this.particleSystem.spawnAirRing(this.x, this.y - 5, '#ff3700');
      this.particleSystem.spawnSparks(this.x, this.y - 5, 14, '#ff3700');
      this.animController.play('jump');
      this.animController.triggerJumpStretch(1.0);
    }
  }

  triggerDash() {
    if (this.isStunned || this.isFrozen || !this.enabled) return;
    if (this.dashCooldown > 0) return;
    this.soundManager.init();

    const dir = this.direction || -1;
    this.dashCooldown = 0.45;
    this.isDashing = true;
    this.dashTimer = 0.16;

    if (!this.isGrounded) {
      this.dashVx = dir * 960;
      this.vy = -60;
      this.soundManager.play('laser');
      this.particleSystem.spawnAirRing(this.x, this.y - 30, '#ffd700');
      this.particleSystem.spawnSparks(this.x, this.y - 30, 16, '#ffd700');
    } else {
      this.dashVx = dir * 1020;
      this.soundManager.play('kick');
      this.particleSystem.spawnAirRing(this.x, this.y - 15, '#ff3700');
      this.particleSystem.spawnSparks(this.x - dir * 25, this.y - 15, 14, '#ff3700');
    }
  }

  triggerKick(ball, player, collisionSystem, chargeRatio = null) {
    if (this.isStunned || this.isFrozen || !this.enabled) return;
    this.soundManager.init();

    if (chargeRatio !== null) {
      const powerMult = this.character?.stats?.power || 1.0;
      this.activePowerMultiplier = (1.4 + chargeRatio * 0.7) * powerMult;

      this.soundManager.playSubBassKick();
      this.soundManager.play('kick');
      this.soundManager.play('chargedBlast');

      this.animController.play('kick');
      this.particleSystem.spawnSonicBoom(this.x, this.y - 20, this.direction, '#ff3700');
      this.particleSystem.spawnFlameBurst(this.x, this.y - 20, 24, ['#ff3700', '#ffffff', '#ffd000']);
      const pct = Math.round(50 + chargeRatio * 50);
      collisionSystem?.addFloatingText(`⚡ ¡CAÑONAZO P2 ${pct}%! ⚡`, this.x, this.y - 95, '#ff3700', 24);
      this.performHitCheck(ball, player, collisionSystem, true);
      return;
    }

    const powerMult = this.character?.stats?.power || 1.0;
    this.activePowerMultiplier = 1.25 * powerMult;

    let chosenAnim = 'kick';
    const dx = (ball.x - this.x) * this.direction;
    const dy = ball.y - this.y;
    const dist = Math.hypot(ball.x - this.x, ball.y - this.y);

    if (!this.isGrounded) {
      if (dy < -35 && dist < 170) {
        chosenAnim = 'bicycle_kick';
        this.vy = -380;
        this.particleSystem.spawnAirRing(this.x, this.y - 30, '#ffd700');
        this.soundManager.play('chargedBlast');
      } else if (dy > -20 && dx > 15 && dist < 150) {
        chosenAnim = 'smash_header';
        this.particleSystem.spawnAirRing(this.x, this.y - 20, '#ffcc00');
        this.soundManager.play('headImpact');
      } else {
        chosenAnim = 'diving_header';
        this.vx = this.direction * 320;
        this.particleSystem.spawnAirRing(this.x, this.y - 20, '#ff5500');
        this.soundManager.play('kick');
      }
    } else {
      if (dx < -15 && dist < 100) {
        chosenAnim = 'scorpion_kick';
        this.soundManager.play('kick');
      } else if (this.isMoving && dx > 10) {
        chosenAnim = 'rocket_kick';
        this.particleSystem.spawnTurfSpray(this.x, this.groundY, this.direction, 14);
        this.soundManager.play('laser');
      } else {
        chosenAnim = 'kick';
        this.soundManager.play('kick');
      }
    }

    this.animController.play(chosenAnim);
    this.particleSystem.spawnSparks(this.x + 35 * this.direction, this.y - 15, 14, '#ff3700');
    this.performHitCheck(ball, player, collisionSystem);
  }

  triggerSuper(ball, player, collisionSystem, superShots) {
    if (this.isStunned || this.isFrozen || !this.enabled) return;
    this.soundManager.init();

    if (this.power >= 100) {
      this.power = 0;
      const powerMult = this.character?.stats?.power || 1.0;
      this.activePowerMultiplier = 2.4 * powerMult;
      this.animController.play('super_shot');
      this.soundManager.play('superPower');
      this.soundManager.play('chargedBlast');

      const superColors = this.character?.super?.colors || ['#ff3700', '#ffd000'];
      this.particleSystem.spawnFlameAura(this.x, this.y - 65, superColors);

      if (superShots) {
        superShots.launch(ball, this.character, this.direction, 'rival', { player, rivalBot: this });
      } else {
        ball.kick(this.direction * 980, -320, true, 'rival');
      }
      collisionSystem?.addFloatingText(`🔥 ¡${this.character?.super?.name || 'SUPER TIRO P2'}! 🔥`, this.x, this.y - 95, superColors[0] || '#ff3700', 24);
    } else {
      this.triggerKick(ball, player, collisionSystem);
      collisionSystem?.addFloatingText('⚡ POWER INSUFICIENTE P2', this.x, this.y - 95, '#ff5500', 16);
    }
  }

  performHitCheck(ball, player, collisionSystem, forceHit = false) {
    const footTip = this.skeleton.footFront.getWorldTip();
    const footOffsetX = Math.abs(footTip.x - this.skeleton.root.x);
    this.kickHitbox.x = this.x + this.direction * footOffsetX;
    this.kickHitbox.y = footTip.y;

    const distFootBall = Math.hypot(ball.x - this.kickHitbox.x, ball.y - this.kickHitbox.y);
    const reach = forceHit ? ball.radius + this.kickHitbox.radius + 36 : ball.radius + this.kickHitbox.radius + 18;

    if (distFootBall <= reach) {
      this.kickCooldown = 0.28;
      const powerMult = (this.character?.stats?.power || 1.0) * (this.activePowerMultiplier || 1.0);
      const cur = this.animController.currentAnim;
      const dir = this.direction;

      if (cur === 'bicycle_kick') {
        ball.kick(dir * (1160 + Math.random() * 80) * powerMult, -280 * powerMult, false, 'rival', 'bicycle', dir * 3.6);
        this.power = Math.min(100, this.power + 22);
        this.particleSystem.spawnSonicBoom(ball.x, ball.y, dir, '#ffd700');
        this.particleSystem.spawnKickImpact(ball.x, ball.y, dir, '#ffd700', 30);
        this.soundManager.play('chargedBlast');
        this.soundManager.play('kick');
        collisionSystem?.triggerShake(13);
        collisionSystem?.addFloatingText('🤸 ¡CHILENA P2!', this.x, this.y - 95, '#ffd700', 22);
      } else if (cur === 'rocket_kick') {
        ball.kick(dir * (1120 + Math.random() * 70) * powerMult, -85 * powerMult, false, 'rival', 'rocket', dir * 1.4);
        this.power = Math.min(100, this.power + 20);
        this.particleSystem.spawnTurfSpray(ball.x, this.groundY, dir, 20);
        this.particleSystem.spawnSonicBoom(ball.x, ball.y, dir, '#ff5500');
        this.particleSystem.spawnKickImpact(ball.x, ball.y, dir, '#ff5500', 26);
        this.soundManager.play('laser');
        this.soundManager.play('kick');
        collisionSystem?.triggerShake(11);
        collisionSystem?.addFloatingText('🚀 ¡CAÑONAZO P2!', this.x, this.y - 95, '#ff5500', 22);
      } else if (cur === 'diving_header') {
        ball.kick(dir * (1040 + Math.random() * 60) * powerMult, -170 * powerMult, false, 'rival', 'palomita', dir * 2.0);
        this.power = Math.min(100, this.power + 18);
        this.particleSystem.spawnKickImpact(ball.x, ball.y, dir, '#ff9900', 22);
        this.soundManager.play('headImpact');
        collisionSystem?.addFloatingText('⚡ ¡PALOMITA P2!', this.x, this.y - 95, '#ff9900', 20);
      } else if (cur === 'scorpion_kick') {
        ball.kick(dir * (960 + Math.random() * 60) * powerMult, -440 * powerMult, false, 'rival', 'scorpion', -dir * 3.4);
        this.power = Math.min(100, this.power + 18);
        this.particleSystem.spawnKickImpact(ball.x, ball.y, dir, '#ff00aa', 22);
        this.soundManager.play('kick');
        collisionSystem?.addFloatingText('🦂 ¡TIRO ESCORPIÓN P2!', this.x, this.y - 95, '#ff00aa', 20);
      } else if (cur === 'smash_header') {
        ball.kick(dir * (880 + Math.random() * 60) * powerMult, 360 * powerMult, false, 'rival', 'smash', dir * 2.6);
        this.power = Math.min(100, this.power + 18);
        this.particleSystem.spawnTurfSpray(ball.x, this.groundY, dir, 18);
        this.particleSystem.spawnKickImpact(ball.x, ball.y, dir, '#ffd700', 24);
        this.soundManager.play('headImpact');
        collisionSystem?.addFloatingText('💥 ¡MARTILLAZO P2!', this.x, this.y - 95, '#ffd700', 20);
      } else {
        const isCharged = this.activePowerMultiplier > 1.35;
        ball.kick(
          dir * (780 + Math.random() * 80) * powerMult,
          (-340 - Math.random() * 80) * powerMult,
          false,
          'rival',
          isCharged ? 'rocket' : 'drive'
        );
        this.power = Math.min(100, this.power + (isCharged ? 22 : 14));
        this.particleSystem.spawnKickImpact(footTip.x, footTip.y, dir, isCharged ? '#ffd700' : '#ff9900', isCharged ? 28 : 18);
        this.soundManager.play('kick');
      }
    }
  }

  update(dt, ball, player, collisionSystem, ragdollSystem, superShots, inputManager = null) {
    if (!this.enabled) return { face: 'idle' };

    if (this.kickCooldown > 0) this.kickCooldown -= dt;
    if (this.tackleCooldown > 0) this.tackleCooldown -= dt;
    if (this.jumpCooldown > 0) this.jumpCooldown -= dt;
    if (this.hitFlashTimer > 0) this.hitFlashTimer = Math.max(0, this.hitFlashTimer - dt);

    // Freeze recovery
    if (this.isFrozen) {
      this.freezeTimer -= dt;
      if (this.freezeTimer <= 0) {
        this.isFrozen = false;
        this.soundManager.play('shatter');
        this.particleSystem.spawnSparks(this.x, this.y - 45, 30, '#00ffff');
      }
      this.skeleton.setPosition(this.x, this.y);
      this.skeleton.setFacing(this.direction);
      return { face: 'ko', squashY: 1.0, stretchX: 1.0, aura: false };
    }

    // Passive power meter build-up (balanced arcade rate)
    if (this.power < 100) {
      this.power = Math.min(100, this.power + dt * 6.0);
    }

    // Stun recovery
    if (this.isStunned) {
      this.stunTimer -= dt;
      if (this.stunTimer <= 0) {
        this.isStunned = false;
        this.animController.play('idle');
        this.soundManager.play('recover');
        this.particleSystem.spawnSparks(this.x, this.y - 45, 20, '#00ffcc');
        this.hp = Math.min(100, this.hp + 20);
      }
      this.skeleton.setPosition(this.x, this.y);
      this.skeleton.setFacing(this.direction);
      return this.animController.update(dt);
    }

    // === PLAYER 2 HUMAN CONTROLLED BRANCH ===
    if (this.isHumanControlled) {
      // Dash Cooldown decrement
      if (this.dashCooldown > 0) {
        this.dashCooldown = Math.max(0, this.dashCooldown - dt);
      }

      // Smooth Physics Dash with Continuous Velocity Deceleration & Afterimages
      if (this.isDashing) {
        this.dashTimer -= dt;
        this.x += this.dashVx * dt;
        this.dashVx *= 0.92;

        if (!this.dashGhosts) this.dashGhosts = [];
        this.dashGhosts.push({
          x: this.x,
          y: this.y,
          direction: this.direction || -1,
          alpha: 0.65,
          color: this.character?.super?.colors?.[0] || 'rgba(255, 55, 0, 0.45)'
        });

        if (this.dashTimer <= 0) {
          this.isDashing = false;
          this.dashVx = 0;
        }
      }

      // Fade dash ghost afterimages
      if (this.dashGhosts && this.dashGhosts.length > 0) {
        for (let i = this.dashGhosts.length - 1; i >= 0; i--) {
          this.dashGhosts[i].alpha -= dt * 4.2;
          if (this.dashGhosts[i].alpha <= 0) {
            this.dashGhosts.splice(i, 1);
          }
        }
      }

      // Athletic Double Jump 360 Flip / Spin
      if (this.isSpinning) {
        this.spinTime += dt;
        const progress = Math.min(1.0, this.spinTime / this.spinDuration);
        this.flipAngle = progress * Math.PI * 2 * (this.direction || -1);
        if (progress >= 1.0) {
          this.isSpinning = false;
          this.flipAngle = 0;
        }
      }

      const speedMult = (this.character?.stats?.speed || 1.0) * (this.speedMultiplier || 1.0);
      const moveSpeed = 360 * speedMult;
      let isMoving = false;

      if (!this.isStunned && !this.isFrozen && !this.isDashing && inputManager) {
        if (inputManager.isP2KeyDown('left')) {
          this.x -= moveSpeed * dt;
          this.direction = -1;
          isMoving = true;
        }
        if (inputManager.isP2KeyDown('right')) {
          this.x += moveSpeed * dt;
          this.direction = 1;
          isMoving = true;
        }
      }
      this.isMoving = isMoving;

      // Clamp to pitch boundaries
      this.x = Math.max(78, Math.min(this.x, this.stageWidth - 78));

      // Vertical gravity & platform physics
      if (!this.isGrounded) {
        this.vy += 1580 * dt;
        this.y += this.vy * dt;

        if (this.y >= this.groundY) {
          const impact = Math.min(1.6, Math.abs(this.vy) / 450);
          this.y = this.groundY;
          this.vy = 0;
          this.isGrounded = true;
          this.canDoubleJump = true;
          this.animController.triggerLandingSquash(impact);
          this.particleSystem.spawnDust(this.x, this.groundY, 7);
          this.particleSystem.spawnSparks(this.x, this.groundY, 8, 'rgba(255,255,255,0.6)');
        }
      } else {
        this.y = this.groundY;
        this.vy = 0;
        this.canDoubleJump = true;
      }

      // Hitboxes updates (Anatomically calibrated for Chibi 1.25x caricature proportion)
      const headScale = (this.userHeadScale || 1.0) * (this.giantHeadMultiplier || 1.0) * 1.25;
      const footTip = this.skeleton.footFront.getWorldTip();
      const footOffsetX = Math.abs(footTip.x - this.skeleton.root.x);
      this.kickHitbox.x = this.x + this.direction * (footOffsetX + 4);
      this.kickHitbox.y = footTip.y - 2;
      this.kickHitbox.radius = 26;

      this.headHitbox.x = this.skeleton.head.worldX + this.direction * (14 * headScale);
      this.headHitbox.y = this.skeleton.head.worldY - (50 * headScale);
      this.headHitbox.radius = Math.round(48 * headScale);

      if (!this.foreheadHitbox) this.foreheadHitbox = { x: 0, y: 0, radius: 30 };
      this.foreheadHitbox.x = this.skeleton.head.worldX + this.direction * (28 * headScale);
      this.foreheadHitbox.y = this.skeleton.head.worldY - (58 * headScale);
      this.foreheadHitbox.radius = Math.round(30 * headScale);

      if (!this.torsoHitbox) this.torsoHitbox = { x: 0, y: 0, radius: 24 };
      this.torsoHitbox.x = this.skeleton.torso.worldX + this.direction * 4;
      this.torsoHitbox.y = this.skeleton.torso.worldY - 12;
      this.torsoHitbox.radius = 24;

      // Continuous collision check if kick animation is active
      const curAnim = this.animController.currentAnim;
      const isOneShotKick = ['kick', 'rocket_kick', 'bicycle_kick', 'diving_header', 'scorpion_kick', 'smash_header'].includes(curAnim);
      const distFootBall = Math.hypot(ball.x - this.kickHitbox.x, ball.y - this.kickHitbox.y);
      if (isOneShotKick && this.kickCooldown <= 0 && distFootBall < ball.radius + this.kickHitbox.radius) {
        this.performHitCheck(ball, player, collisionSystem);
      }

      // Header collision check (Forehead sweetspot + Cranium mass)
      const distHeadBall = Math.hypot(ball.x - this.headHitbox.x, ball.y - this.headHitbox.y);
      const distForeheadBall = this.foreheadHitbox ? Math.hypot(ball.x - this.foreheadHitbox.x, ball.y - this.foreheadHitbox.y) : 999;
      const isHeadHit = distHeadBall < ball.radius + this.headHitbox.radius || (this.foreheadHitbox && distForeheadBall < ball.radius + this.foreheadHitbox.radius);
      if (this.kickCooldown <= 0 && isHeadHit) {
        this.hitFlashTimer = 0.12;
        this.kickCooldown = 0.22;
        const powerMult = (this.character?.stats?.power || 1.0) * (this.activePowerMultiplier || 1.0);
        const dir = this.direction;

        const isLaser = (ball.superType === 'laser' || ball.superType === 'laser_reflected') && ball.lastKickedBy === 'player';
        if (isLaser && (!this.isGrounded || curAnim === 'smash_header' || isOneShotKick)) {
          // OPTION 1: P2 REFLEJO PRISMATICO!
          ball.isSuper = true;
          ball.superType = 'laser_reflected';
          ball.superColors = ['#ffd700', '#ffffff', '#00f0ff'];
          ball.lastKickedBy = 'rival';
          ball.kick(dir * 1580, -25, true, 'rival');
          this.particleSystem.spawnSonicBoom(this.headHitbox.x, this.headHitbox.y, dir, '#ffd700');
          this.particleSystem.spawnSparks(ball.x, ball.y, 45, '#ffd700');
          this.soundManager.play('superPower');
          this.soundManager.play('laser');
          collisionSystem?.triggerHitStop(0.09);
          collisionSystem?.triggerShake(16);
          collisionSystem?.addFloatingText('🪞⚡ ¡REFLEJO P2! ⚡🪞', this.x, this.y - 110, '#ffd700', 26);
          return;
        }

        if (!this.isGrounded && curAnim === 'smash_header') {
          ball.kick(dir * (880 + Math.random() * 60) * powerMult, 360 * powerMult, false, 'rival', 'smash', dir * 2.6);
          this.particleSystem.spawnTurfSpray(ball.x, this.groundY, dir, 16);
          this.particleSystem.spawnKickImpact(ball.x, ball.y, dir, '#ffd700', 22);
          this.soundManager.play('headImpact');
          collisionSystem?.addFloatingText('💥 ¡MARTILLAZO P2!', this.x, this.y - 95, '#ffd700', 20);
        } else if (!this.isGrounded) {
          ball.kick(dir * (680 + Math.random() * 80) * powerMult, -Math.abs(ball.vy) * 0.75 - 240, false, 'rival', 'header');
          this.particleSystem.spawnKickImpact(ball.x, ball.y, dir, '#ffd700', 20);
          this.soundManager.play('headImpact');
        } else if (isMoving) {
          ball.kick(dir * 420 * powerMult, -Math.abs(ball.vy) * 0.6 - 160, false, 'rival');
          this.soundManager.play('headImpact');
        } else {
          ball.vx = dir * 135;
          ball.vy = -Math.abs(ball.vy) * 0.55 - 90;
          ball.lastKickedBy = 'rival';
          this.soundManager.play('bounce');
        }
      }

      // State machine
      const isOneShot = ['kick', 'rocket_kick', 'bicycle_kick', 'diving_header', 'scorpion_kick', 'smash_header', 'super_shot'].includes(curAnim);
      const isFinished = isOneShot && (this.animController.animTime >= this.animController.getClip().duration * 0.95);

      if (this.isStunned) {
        if (curAnim !== 'stun') this.animController.play('stun');
      } else if (!isOneShot || isFinished) {
        if (!this.isGrounded) {
          if (curAnim !== 'jump') this.animController.play('jump');
        } else if (isMoving) {
          if (curAnim !== 'run') this.animController.play('run');
        } else {
          if (curAnim !== 'idle') this.animController.play('idle');
        }
      }

      this.skeleton.setPosition(this.x, this.y);
      this.skeleton.setFacing(this.direction);
      this.animController.setLookTarget(ball.x, ball.y);
      const animState = this.animController.update(this.isFrozen ? 0 : dt);

      if (animState.aura || curAnim === 'super_shot') {
        const colors = this.character?.super?.colors || ['#ff3700', '#ffd000'];
        this.particleSystem.spawnFlameAura(this.x, this.y - 75, colors);
      }

      return animState;
    }

    // 1. Positioning AI: Defend right goal or press the ball
    const targetDefendX = this.stageWidth - 170;
    let targetX = targetDefendX;

    const ballInRivalZone = ball.x > this.stageWidth * 0.35;
    if (ballInRivalZone) {
      // Approach ball with slight offset to kick towards the left
      targetX = Math.min(this.stageWidth - 82, Math.max(this.stageWidth * 0.36, ball.x + 32));
    }

    const distToTarget = targetX - this.x;
    const speedMult = (this.character?.stats?.speed || 1.0) * (this.speedMultiplier || 1.0);
    const moveSpeed = 330 * speedMult;
    let isMoving = false;

    if (Math.abs(distToTarget) > 16) {
      this.x += Math.sign(distToTarget) * moveSpeed * dt;
      isMoving = true;
    }

    // Primary facing: Rival ALWAYS defends facing LEFT towards Player 1 and field.
    // Only turn right if ball bypassed the rival into the net behind them.
    if (ball.x > this.x + 35 && ball.x > this.stageWidth - 110) {
      this.direction = 1;
    } else {
      this.direction = -1;
    }

    // Keep within pitch bounds
    this.x = Math.max(this.stageWidth * 0.34, Math.min(this.stageWidth - 80, this.x));

    // Jump AI for headers
    const distBallRival = Math.hypot(ball.x - this.x, ball.y - (this.y - 65));
    if (this.isGrounded && this.jumpCooldown <= 0 && distBallRival < 115 && ball.y < this.groundY - 55 && ball.vy > -240) {
      const jumpMult = this.character?.stats?.jump || 1.0;
      this.vy = -720 * jumpMult;
      this.isGrounded = false;
      this.jumpCooldown = 1.1;
      this.animController.play('jump');
      this.animController.triggerJumpStretch(1.2);
      this.soundManager.play('headImpact');
    }

    // Vertical physics
    if (!this.isGrounded) {
      this.vy += 1580 * dt;
      this.y += this.vy * dt;
      if (this.y >= this.groundY) {
        const impact = Math.min(1.5, Math.abs(this.vy) / 450);
        this.y = this.groundY;
        this.vy = 0;
        this.isGrounded = true;
        this.animController.triggerLandingSquash(impact);
      }
    } else {
      this.y = this.groundY;
      this.vy = 0;
    }

    // 2. Kicking Strike Logic (Anatomically calibrated)
    const footTip = this.skeleton.footFront.getWorldTip();
    const footOffsetX = Math.abs(footTip.x - this.skeleton.root.x);
    this.kickHitbox.x = this.x + this.direction * (footOffsetX + 4);
    this.kickHitbox.y = footTip.y - 2;
    this.kickHitbox.radius = 26;

    if (!this.torsoHitbox) this.torsoHitbox = { x: 0, y: 0, radius: 24 };
    this.torsoHitbox.x = this.skeleton.torso.worldX + this.direction * 4;
    this.torsoHitbox.y = this.skeleton.torso.worldY - 12;
    this.torsoHitbox.radius = 24;

    // Remote / Ranged Super Ability cast:
    // If RivalBot has full power (100) and ball is in attacking half, unleash special ability with telegraph!
    const ballInAttackZone = ball.x > this.stageWidth * 0.28 && ball.x < this.x;
    if (this.power >= 100 && this.kickCooldown <= 0 && ballInAttackZone && Math.random() < 0.006) {
      this.power = 0;
      this.kickCooldown = 1.2;
      this.animController.play('super_shot');
      this.soundManager.play('superPower');
      this.soundManager.play('chargedBlast');
      const colors = this.character?.super?.colors || ['#ff3700', '#ffd000'];
      this.particleSystem.spawnFlameAura(this.x, this.y - 65, colors);

      if (superShots) {
        superShots.launch(ball, this.character, -1, 'rival', { player, rivalBot: this });
      }
      collisionSystem.addFloatingText('⚠️ ¡SUPER TIRO RIVAL! ⚠️', this.x, this.y - 120, '#ff1744', 22);
      collisionSystem.addFloatingText(`🔥 ¡${this.character?.super?.name || 'TIRO RIVAL'}! 🔥`, this.x, this.y - 95, colors[0] || '#ff3700', 20);
    }

    const distFootBall = Math.hypot(ball.x - this.kickHitbox.x, ball.y - this.kickHitbox.y);
    if (this.kickCooldown <= 0 && distFootBall < ball.radius + this.kickHitbox.radius) {
      this.kickCooldown = 0.35;
      const useSuper = this.power >= 100;

      if (useSuper) {
        this.power = 0;
        this.animController.play('super_shot');
        this.soundManager.play('superPower');
        this.soundManager.play('chargedBlast');
        const colors = this.character?.super?.colors || ['#ff3700', '#ffd000'];
        this.particleSystem.spawnFlameAura(this.x, this.y - 65, colors);

        if (superShots) {
          superShots.launch(ball, this.character, -1, 'rival', { player, rivalBot: this });
        } else {
          ball.kick(-860, -320, true, 'rival');
        }
        collisionSystem.addFloatingText(`🔥 ¡${this.character?.super?.name || 'TIRO RIVAL'}! 🔥`, this.x, this.y - 95, colors[0] || '#ff3700', 22);
      } else {
        const powerMult = this.character?.stats?.power || 1.0;
        if (!this.isGrounded) {
          if (ball.y < this.y - 35) {
            // Acrobatic Bicycle Kick
            this.animController.play('bicycle_kick');
            ball.kick((-980 - Math.random() * 80) * powerMult, -260 * powerMult, false, 'rival', 'bicycle');
            this.particleSystem.spawnSonicBoom(ball.x, ball.y, -1, '#ff3700');
            this.particleSystem.spawnKickImpact(ball.x, ball.y, -1, '#ff3700', 24);
            this.soundManager.play('chargedBlast');
            this.soundManager.play('kick');
            collisionSystem?.addFloatingText('🤸 ¡CHILENA RIVAL!', this.x, this.y - 95, '#ff3700', 20);
            collisionSystem?.triggerShake(10);
          } else {
            // Diving Header Torpedo
            this.animController.play('diving_header');
            ball.kick((-920 - Math.random() * 70) * powerMult, -170 * powerMult, false, 'rival', 'palomita');
            this.particleSystem.spawnKickImpact(ball.x, ball.y, -1, '#ff9900', 20);
            this.soundManager.play('headImpact');
            collisionSystem?.addFloatingText('⚡ ¡PALOMITA RIVAL!', this.x, this.y - 95, '#ff9900', 20);
          }
        } else if (isMoving && Math.random() < 0.45) {
          // Low Rocket Drive
          this.animController.play('rocket_kick');
          ball.kick((-950 - Math.random() * 90) * powerMult, -80 * powerMult, false, 'rival', 'rocket');
          this.particleSystem.spawnTurfSpray(ball.x, this.groundY, -1, 16);
          this.particleSystem.spawnSonicBoom(ball.x, ball.y, -1, '#ff5500');
          this.particleSystem.spawnKickImpact(ball.x, ball.y, -1, '#ff5500', 22);
          this.soundManager.play('laser');
          this.soundManager.play('kick');
          collisionSystem?.addFloatingText('🚀 ¡CAÑONAZO RIVAL!', this.x, this.y - 95, '#ff5500', 20);
          collisionSystem?.triggerShake(9);
        } else {
          // Standard Strike
          this.animController.play('kick');
          this.soundManager.play('kick');
          this.particleSystem.spawnKickImpact(footTip.x, footTip.y, -1, '#ff9900', 16);
          ball.kick((-680 - Math.random() * 100) * powerMult, (-340 - Math.random() * 80) * powerMult, false, 'rival');
        }
      }
    }

    // 3. Header Strike Logic for Rival (Anatomically calibrated for Chibi proportion)
    const headScale = (this.userHeadScale || 1.0) * (this.giantHeadMultiplier || 1.0) * 1.25;
    this.headHitbox.x = this.skeleton.head.worldX + this.direction * (14 * headScale);
    this.headHitbox.y = this.skeleton.head.worldY - (50 * headScale);
    this.headHitbox.radius = Math.round(48 * headScale);

    if (!this.foreheadHitbox) this.foreheadHitbox = { x: 0, y: 0, radius: 30 };
    this.foreheadHitbox.x = this.skeleton.head.worldX + this.direction * (28 * headScale);
    this.foreheadHitbox.y = this.skeleton.head.worldY - (58 * headScale);
    this.foreheadHitbox.radius = Math.round(30 * headScale);

    const distHeadBall = Math.hypot(ball.x - this.headHitbox.x, ball.y - this.headHitbox.y);
    const distForeheadBall = this.foreheadHitbox ? Math.hypot(ball.x - this.foreheadHitbox.x, ball.y - this.foreheadHitbox.y) : 999;
    const isHeadHit = distHeadBall < ball.radius + this.headHitbox.radius || (this.foreheadHitbox && distForeheadBall < ball.radius + this.foreheadHitbox.radius);
    if (this.kickCooldown <= 0 && isHeadHit) {
      this.hitFlashTimer = 0.12;
      this.kickCooldown = 0.32;
      const powerMult = this.character?.stats?.power || 1.0;
      const isLaser = (ball.superType === 'laser' || ball.superType === 'laser_reflected') && ball.lastKickedBy === 'player';
      if (isLaser && (!this.isGrounded || curAnim === 'smash_header' || Math.random() < 0.65)) {
        // OPTION 1: AI REFLEJO PRISMATICO!
        ball.isSuper = true;
        ball.superType = 'laser_reflected';
        ball.superColors = ['#ffd700', '#ffffff', '#00f0ff'];
        ball.lastKickedBy = 'rival';
        ball.kick(-1580, -25, true, 'rival');
        this.particleSystem.spawnSonicBoom(this.headHitbox.x, this.headHitbox.y, -1, '#ffd700');
        this.particleSystem.spawnSparks(ball.x, ball.y, 45, '#ffd700');
        this.soundManager.play('superPower');
        this.soundManager.play('laser');
        collisionSystem?.triggerHitStop(0.09);
        collisionSystem?.triggerShake(16);
        collisionSystem?.addFloatingText('🪞⚡ ¡REFLEJO RIVAL! ⚡🪞', this.x, this.y - 110, '#ffd700', 26);
        return;
      }

      if (!this.isGrounded && ball.y > this.y - 45) {
        this.animController.play('smash_header');
        ball.kick((-820 - Math.random() * 80) * powerMult, 320 * powerMult, false, 'rival', 'smash');
        this.particleSystem.spawnTurfSpray(ball.x, this.groundY, -1, 14);
        this.particleSystem.spawnKickImpact(ball.x, ball.y, -1, '#ffd700', 20);
        this.soundManager.play('headImpact');
        collisionSystem?.addFloatingText('💥 ¡MARTILLAZO RIVAL!', this.x, this.y - 95, '#ffd700', 20);
      } else {
        ball.kick((-560 - Math.random() * 100) * powerMult, -Math.abs(ball.vy) * 0.85 - 220, false, 'rival');
        this.particleSystem.spawnKickImpact(ball.x, ball.y, -1, '#ffd700', 16);
        this.soundManager.play('headImpact');
      }
    }

    // 4. Physical Rival vs Player Close Combat Tackle
    const distToPlayer = Math.abs(this.x - player.x);
    if (this.tackleCooldown <= 0 && distToPlayer < 55 && Math.abs(this.y - player.y) < 40) {
      this.tackleCooldown = 2.4; // 2.4s cooldown so no tackle spam!
      this.animController.play('kick');
      this.soundManager.play('punch');
      this.particleSystem.spawnSparks((this.x + player.x) * 0.5, player.y - 45, 14, '#ff9900');
      const tackleDmg = Math.round(14 * (this.character?.stats?.power || 1.0));
      // isHeavyBlast = false -> NO STUN, just pushback!
      collisionSystem.applyDamage(player, tackleDmg, ragdollSystem, -220, -160, false);
      collisionSystem.addFloatingText('💥 ¡TACKLE!', player.x, player.y - 85, '#ff9900', 16);
    }

    // 5. Animation transitions
    const cur = this.animController.currentAnim;
    const isOneShot = ['kick', 'rocket_kick', 'bicycle_kick', 'diving_header', 'scorpion_kick', 'smash_header', 'super_shot'].includes(cur);
    const isFinished = isOneShot && (this.animController.animTime >= this.animController.getClip().duration * 0.95);

    if (!isOneShot || isFinished) {
      if (!this.isGrounded) {
        if (cur !== 'jump') this.animController.play('jump');
      } else if (isMoving) {
        if (cur !== 'run') this.animController.play('run');
      } else {
        if (cur !== 'idle') this.animController.play('idle');
      }
    }

    this.skeleton.setPosition(this.x, this.y);
    this.skeleton.setFacing(this.direction);
    this.animController.setLookTarget(ball.x, ball.y);
    this.animController.setVelocity(this.vx, this.vy);
    const animState = this.animController.update(dt);

    if (animState.aura || cur === 'super_shot') {
      const colors = this.character?.super?.colors || ['#ff3700', '#ffd000'];
      this.particleSystem.spawnFlameAura(this.x, this.y - 75, colors);
    }

    return animState;
  }

  takeDamage(amount, impulseX = 320, impulseY = -380, isHeavyBlast = false, customStunTimer = null) {
    if (this.hasShield) {
      this.soundManager.play('bounce');
      this.particleSystem.spawnSparks(this.x, this.y - 60, 20, '#ffd700');
      return;
    }
    if (this.isStunned) return;
    this.hp = Math.max(10, this.hp - amount);
    this.soundManager.play('punch');
    this.particleSystem.spawnSparks(this.x, this.y - 60, 20, '#ff3700');

    // Rival ONLY stuns on heavy blast (super shots, bombs, gloves) or critical guard break!
    const isGuardBroken = this.hp <= 15 && amount >= 25;
    if (isHeavyBlast || isGuardBroken) {
      this.isStunned = true;
      this.stunTimer = customStunTimer != null ? customStunTimer : 0.65;
      this.animController.play('stun');
      this.soundManager.play('knockout');
    } else {
      // Light pushback without locking movement
      this.x += Math.sign(impulseX) * 20;
    }
  }
}

exports.RivalBot = RivalBot;
};

__mods['physics/SuperShots.js'] = function(exports, __req) {
/**
 * Special Abilities & Projectiles Engine for Head Soccer.
 * Character abilities can be fired from ANYWHERE on the pitch!
 * They create active field entities (laser beams, blizzard waves, Excalibur sword slashes,
 * lightning strikes, sand cyclones, black holes, shurikens, and dragon fireballs)
 * that physically interact with both the ball and players.
 */
class SuperShots {
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

exports.SuperShots = SuperShots;
};

__mods['renderer/AssetLoader.js'] = function(exports, __req) {
const {  CHARACTERS  } = __req('data/Characters.js');

/**
 * Preloads and manages game sprite textures, including every roster head.
 * Character heads are registered under the key `<characterId>:<expression>`.
 */
class AssetLoader {
  constructor() {
    this.sprites = {};
    this.loaded = false;
  }

  buildManifest() {
    const manifest = [
      { key: 'stadium', src: 'assets/stadium.jpg' },
      { key: 'headIdle', src: 'assets/head_idle.png' },
      { key: 'headKick', src: 'assets/head_kick.png' },
      { key: 'headKo', src: 'assets/head_ko.png' },
      { key: 'torso', src: 'assets/torso.png' },
      { key: 'boot', src: 'assets/boot.png' },
      { key: 'ball', src: 'assets/ball.png' },
      { key: 'arm', src: 'assets/arm.png' }
    ];

    for (const char of CHARACTERS) {
      for (const [expr, src] of Object.entries(char.heads)) {
        manifest.push({ key: `${char.id}:${expr}`, src });
      }
    }
    return manifest;
  }

  load() {
    const manifest = this.buildManifest();
    return Promise.all(manifest.map(item => new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => {
        console.warn(`[AssetLoader] Failed to load ${item.src}`);
        resolve();
      };
      img.src = `${item.src}?v=sprites_hd_v32`;
      this.sprites[item.key] = img;
    }))).then(() => {
      this.loaded = true;
      return this.sprites;
    });
  }

  get(name) {
    return this.sprites[name];
  }

  /**
   * @param {string} characterId
   * @param {'idle'|'kick'|'ko'} expression
   */
  getHead(characterId, expression) {
    return this.sprites[`${characterId}:${expression}`] || this.sprites.headIdle;
  }
}

exports.AssetLoader = AssetLoader;
};

__mods['renderer/CharacterRenderer.js'] = function(exports, __req) {
/**
 * Renders a Head Soccer character by binding sprites to the FK skeleton bones.
 * Appearance (head sprites, head pivot, jersey tint) comes from a roster entry
 * in data/Characters.js, so any character can be drawn on either side.
 */
class CharacterRenderer {
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

exports.CharacterRenderer = CharacterRenderer;
};

__mods['renderer/GameRenderer.js'] = function(exports, __req) {
const {  StadiumRenderer  } = __req('renderer/StadiumRenderer.js');
const {  CharacterRenderer  } = __req('renderer/CharacterRenderer.js');
const {  SpineDebugger  } = __req('renderer/SpineDebugger.js');

/**
 * Main game rendering pipeline coordinator with dynamic camera juice (shake & flash).
 */
class GameRenderer {
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

exports.GameRenderer = GameRenderer;
};

__mods['renderer/SpineDebugger.js'] = function(exports, __req) {
/**
 * Visualizer for Spine 2D diamond bones, joint nodes, and collision hitboxes.
 */
class SpineDebugger {
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
    if (!player) return;
    ctx.save();

    const isKicking = player.animController?.currentAnim === 'kick' || player.animController?.currentAnim === 'super_shot';
    const isJumping = player.animController?.currentAnim === 'jump' || !player.isGrounded;
    const isHitActive = (player.hitFlashTimer || 0) > 0;

    // 1. Kick Hitbox (Toe / Cleat Strike Zone)
    if (player.kickHitbox) {
      ctx.lineWidth = isKicking ? 3 : 1.5;
      ctx.setLineDash(isKicking ? [] : [3, 3]);
      ctx.strokeStyle = isKicking ? '#00f0ff' : 'rgba(0, 240, 255, 0.65)';
      ctx.fillStyle = isKicking ? 'rgba(0, 240, 255, 0.35)' : 'rgba(0, 240, 255, 0.08)';
      ctx.beginPath();
      ctx.arc(player.kickHitbox.x, player.kickHitbox.y, player.kickHitbox.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Cleat center pip
      ctx.fillStyle = '#00f0ff';
      ctx.beginPath();
      ctx.arc(player.kickHitbox.x, player.kickHitbox.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Cranium Head Hitbox (Full Skull Mass: Crown to Jaw)
    if (player.headHitbox) {
      ctx.lineWidth = isJumping ? 2.5 : 1.5;
      ctx.setLineDash(isJumping ? [] : [4, 4]);
      ctx.strokeStyle = isHitActive ? '#ffffff' : isJumping ? '#ffd700' : 'rgba(255, 215, 0, 0.60)';
      ctx.fillStyle = isHitActive ? 'rgba(255, 255, 255, 0.4)' : isJumping ? 'rgba(255, 215, 0, 0.25)' : 'rgba(255, 215, 0, 0.08)';
      ctx.beginPath();
      ctx.arc(player.headHitbox.x, player.headHitbox.y, player.headHitbox.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // 2b. Forehead Header Sweetspot Reticle (Precision Impact Target)
    if (player.foreheadHitbox) {
      const fh = player.foreheadHitbox;
      ctx.lineWidth = isJumping ? 2.5 : 1.5;
      ctx.setLineDash([]);
      ctx.strokeStyle = isHitActive ? '#ffffff' : '#ff9100';
      ctx.fillStyle = isHitActive ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 145, 0, 0.22)';
      ctx.beginPath();
      ctx.arc(fh.x, fh.y, fh.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Precision Sweetspot Crosshair Target
      ctx.strokeStyle = isHitActive ? '#ffffff' : 'rgba(255, 220, 100, 0.9)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(fh.x - fh.radius * 0.5, fh.y);
      ctx.lineTo(fh.x + fh.radius * 0.5, fh.y);
      ctx.moveTo(fh.x, fh.y - fh.radius * 0.5);
      ctx.lineTo(fh.x, fh.y + fh.radius * 0.5);
      ctx.stroke();

      ctx.fillStyle = isHitActive ? '#ffffff' : '#ffd700';
      ctx.beginPath();
      ctx.arc(fh.x, fh.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Torso / Chest Hitbox (Control & Trap Zone)
    if (player.torsoHitbox) {
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = 'rgba(255, 120, 0, 0.65)';
      ctx.fillStyle = 'rgba(255, 120, 0, 0.08)';
      ctx.beginPath();
      ctx.arc(player.torsoHitbox.x, player.torsoHitbox.y, player.torsoHitbox.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }
}

exports.SpineDebugger = SpineDebugger;
};

__mods['renderer/StadiumRenderer.js'] = function(exports, __req) {
/**
 * Authentic Stadium & Goal System Renderer:
 * Advanced Goalposts with Metallic Tubular Shading, Hexagonal & Diamond Net Physics,
 * Localized Net Bulging on Ball Impact, Harmonic Post Vibration, LED Goal Sensors,
 * and Aerodynamic Corner Flags.
 */

const {  GoalNetSimulation  } = __req('physics/NetPhysics.js');

const GOAL_NET_STYLES = {
  HEXAGON: 'hexagon',
  DIAMOND: 'diamond',
  CLASSIC: 'classic'
};

const GOAL_NET_COLORS = {
  CHAMPIONS: 'champions', // Deep silver white cords with golden tension seams
  CLASSIC: 'classic',     // Crisp stadium white
  GOLD: 'gold',           // Championship tournament gold
  NEON_CYAN: 'neon_cyan'  // Cyber arcade neon glow
};

class StadiumRenderer {
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

exports.StadiumRenderer = StadiumRenderer;
exports.GOAL_NET_STYLES = GOAL_NET_STYLES;
exports.GOAL_NET_COLORS = GOAL_NET_COLORS;
};

__mods['tournament/TournamentManager.js'] = function(exports, __req) {
const {  CHARACTERS, getCharacter  } = __req('data/Characters.js');

const GAME_MODES = {
  QUICK: 'quick',
  TOURNAMENT: 'tournament',
  SURVIVAL: 'survival',
  GOLDEN_GOAL: 'golden_goal',
  LOCAL_2P: 'local_2p'
};

/**
 * Tournament & Game Modes Coordinator
 * Manages Copa Mundial knockout bracket, Survival gauntlet streaks, and Sudden Death Golden Goal.
 */
class TournamentManager {
  constructor() {
    this.currentMode = GAME_MODES.QUICK;
    this.active = false;

    // Tournament Bracket (Copa Mundial)
    this.tournamentRound = 0; // 0: Cuartos, 1: Semifinal, 2: Final, 3: Champion!
    this.bracket = null;
    this.playerChar = null;

    // Survival Mode State
    this.survivalStreak = 0;
    this.bestSurvivalStreak = parseInt(localStorage.getItem('head_soccer_best_streak') || '0', 10);
    this.survivalHealth = 100;

    // Callbacks
    this.onStateChangeCallbacks = [];
  }

  onStateChange(fn) {
    this.onStateChangeCallbacks.push(fn);
  }

  notify() {
    this.onStateChangeCallbacks.forEach(fn => fn(this.getState()));
  }

  getState() {
    return {
      mode: this.currentMode,
      active: this.active,
      tournamentRound: this.tournamentRound,
      bracket: this.bracket,
      survivalStreak: this.survivalStreak,
      bestSurvivalStreak: this.bestSurvivalStreak,
      survivalHealth: this.survivalHealth
    };
  }

  /**
   * Starts a new Copa Mundial tournament bracket
   */
  startCopaMundial(playerCharId) {
    this.currentMode = GAME_MODES.TOURNAMENT;
    this.active = true;
    this.tournamentRound = 0;
    this.playerChar = getCharacter(playerCharId);

    // Pick 7 distinct opponents from roster
    const allOthers = CHARACTERS.filter(c => c.id !== playerCharId);
    const shuffled = [...allOthers].sort(() => 0.5 - Math.random());
    const rivals = shuffled.slice(0, 7);

    // Build 8-team tree
    // Quarterfinals (4 matches)
    const qf = [
      { id: 'qf1', teamA: this.playerChar, teamB: rivals[0], scoreA: null, scoreB: null, winner: null, isPlayer: true },
      { id: 'qf2', teamA: rivals[1], teamB: rivals[2], scoreA: null, scoreB: null, winner: null, isPlayer: false },
      { id: 'qf3', teamA: rivals[3], teamB: rivals[4], scoreA: null, scoreB: null, winner: null, isPlayer: false },
      { id: 'qf4', teamA: rivals[5], teamB: rivals[6], scoreA: null, scoreB: null, winner: null, isPlayer: false }
    ];

    // Semifinals (2 matches)
    const sf = [
      { id: 'sf1', teamA: null, teamB: null, scoreA: null, scoreB: null, winner: null, isPlayer: true },
      { id: 'sf2', teamA: null, teamB: null, scoreA: null, scoreB: null, winner: null, isPlayer: false }
    ];

    // Gran Final (1 match)
    const fn = [
      { id: 'fn1', teamA: null, teamB: null, scoreA: null, scoreB: null, winner: null, isPlayer: true }
    ];

    this.bracket = { qf, sf, fn };
    this.notify();
    return this.getCurrentRival();
  }

  /**
   * Starts Survival Mode gauntlet
   */
  startSurvival(playerCharId) {
    this.currentMode = GAME_MODES.SURVIVAL;
    this.active = true;
    this.playerChar = getCharacter(playerCharId);
    this.survivalStreak = 0;
    this.survivalHealth = 100;
    this.notify();
    return this.getRandomRival();
  }

  /**
   * Starts Sudden Death (Golden Goal)
   */
  startGoldenGoal(playerCharId, rivalCharId) {
    this.currentMode = GAME_MODES.GOLDEN_GOAL;
    this.active = true;
    this.playerChar = getCharacter(playerCharId);
    this.notify();
    return getCharacter(rivalCharId);
  }

  /**
   * Starts 1 vs 1 Local Multiplayer
   */
  startLocal2P(playerCharId, rivalCharId) {
    this.currentMode = GAME_MODES.LOCAL_2P;
    this.active = true;
    this.playerChar = getCharacter(playerCharId);
    this.notify();
    return getCharacter(rivalCharId);
  }

  /**
   * Sets quick match mode
   */
  setQuickMatch() {
    this.currentMode = GAME_MODES.QUICK;
    this.active = false;
    this.notify();
  }

  getCurrentRival() {
    if (this.currentMode === GAME_MODES.TOURNAMENT && this.bracket) {
      if (this.tournamentRound === 0) {
        return this.bracket.qf[0].teamB;
      } else if (this.tournamentRound === 1) {
        return this.bracket.sf[0].teamB;
      } else if (this.tournamentRound === 2) {
        return this.bracket.fn[0].teamB;
      }
    }
    return this.getRandomRival();
  }

  getRandomRival() {
    const list = CHARACTERS.filter(c => !this.playerChar || c.id !== this.playerChar.id);
    return list[Math.floor(Math.random() * list.length)] || CHARACTERS[1];
  }

  getCurrentDifficulty() {
    if (this.currentMode === GAME_MODES.TOURNAMENT) {
      if (this.tournamentRound === 0) return 'medium'; // Cuartos
      if (this.tournamentRound === 1) return 'hard';   // Semifinal
      if (this.tournamentRound === 2) return 'champion'; // Final!
    }
    if (this.currentMode === GAME_MODES.SURVIVAL) {
      if (this.survivalStreak < 2) return 'easy';
      if (this.survivalStreak < 5) return 'medium';
      if (this.survivalStreak < 8) return 'hard';
      return 'champion';
    }
    return 'medium';
  }

  /**
   * Records match outcome and advances stage
   * @returns {{ status: 'advanced'|'won_championship'|'eliminated'|'streak_continued'|'game_over', nextRival: object|null }}
   */
  recordMatchResult(playerScore, rivalScore) {
    const playerWon = playerScore > rivalScore;

    if (this.currentMode === GAME_MODES.TOURNAMENT && this.bracket) {
      if (this.tournamentRound === 0) {
        // Quarterfinals
        this.bracket.qf[0].scoreA = playerScore;
        this.bracket.qf[0].scoreB = rivalScore;
        this.bracket.qf[0].winner = playerWon ? this.playerChar : this.bracket.qf[0].teamB;

        if (!playerWon) {
          return { status: 'eliminated', nextRival: null };
        }

        // Simulate other QF matches
        this.simulateMatch(this.bracket.qf[1]);
        this.simulateMatch(this.bracket.qf[2]);
        this.simulateMatch(this.bracket.qf[3]);

        // Setup Semifinals
        this.bracket.sf[0].teamA = this.playerChar;
        this.bracket.sf[0].teamB = this.bracket.qf[1].winner;
        this.bracket.sf[1].teamA = this.bracket.qf[2].winner;
        this.bracket.sf[1].teamB = this.bracket.qf[3].winner;

        this.tournamentRound = 1;
        this.notify();
        return { status: 'advanced', nextRival: this.bracket.sf[0].teamB, roundName: 'Semifinal' };
      } else if (this.tournamentRound === 1) {
        // Semifinals
        this.bracket.sf[0].scoreA = playerScore;
        this.bracket.sf[0].scoreB = rivalScore;
        this.bracket.sf[0].winner = playerWon ? this.playerChar : this.bracket.sf[0].teamB;

        if (!playerWon) {
          return { status: 'eliminated', nextRival: null };
        }

        // Simulate SF 2
        this.simulateMatch(this.bracket.sf[1]);

        // Setup Gran Final
        this.bracket.fn[0].teamA = this.playerChar;
        this.bracket.fn[0].teamB = this.bracket.sf[1].winner;

        this.tournamentRound = 2;
        this.notify();
        return { status: 'advanced', nextRival: this.bracket.fn[0].teamB, roundName: 'Gran Final' };
      } else if (this.tournamentRound === 2) {
        // Gran Final!
        this.bracket.fn[0].scoreA = playerScore;
        this.bracket.fn[0].scoreB = rivalScore;
        this.bracket.fn[0].winner = playerWon ? this.playerChar : this.bracket.fn[0].teamB;

        if (playerWon) {
          this.tournamentRound = 3; // Champion!
          this.notify();
          return { status: 'won_championship', nextRival: null };
        } else {
          return { status: 'eliminated', nextRival: null };
        }
      }
    }

    if (this.currentMode === GAME_MODES.SURVIVAL) {
      if (playerWon) {
        this.survivalStreak += 1;
        if (this.survivalStreak > this.bestSurvivalStreak) {
          this.bestSurvivalStreak = this.survivalStreak;
          localStorage.setItem('head_soccer_best_streak', this.bestSurvivalStreak.toString());
        }
        // Health bonus: +30 HP up to 100 max
        this.survivalHealth = Math.min(100, this.survivalHealth + 30);
        this.notify();
        const nextRival = this.getRandomRival();
        return { status: 'streak_continued', nextRival, streak: this.survivalStreak, bonusHp: 30 };
      } else {
        const finalStreak = this.survivalStreak;
        this.survivalStreak = 0;
        this.notify();
        return { status: 'game_over', finalStreak, bestStreak: this.bestSurvivalStreak };
      }
    }

    if (this.currentMode === GAME_MODES.LOCAL_2P) {
      if (playerScore > rivalScore) {
        return { status: 'p1_victory', winner: 'P1', p1Score: playerScore, p2Score: rivalScore };
      } else if (rivalScore > playerScore) {
        return { status: 'p2_victory', winner: 'P2', p1Score: playerScore, p2Score: rivalScore };
      } else {
        return { status: 'draw', winner: null, p1Score: playerScore, p2Score: rivalScore };
      }
    }

    return { status: playerWon ? 'victory' : 'defeat', nextRival: null };
  }

  simulateMatch(match) {
    const scoreA = Math.floor(Math.random() * 5);
    let scoreB = Math.floor(Math.random() * 5);
    if (scoreA === scoreB) scoreB += 1; // no ties in knockout bracket
    match.scoreA = scoreA;
    match.scoreB = scoreB;
    match.winner = scoreA > scoreB ? match.teamA : match.teamB;
  }
}

exports.TournamentManager = TournamentManager;
exports.GAME_MODES = GAME_MODES;
};

__mods['ui/InputManager.js'] = function(exports, __req) {
/**
 * Manages player keyboard input, mobile multi-touch controls, and interactive ball drag physics.
 * Pure arcade responsiveness with instantaneous strikes, jumps, directional sprint, and tactile haptics.
 */
class InputManager {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {import('../physics/Ball.js').Ball} ball
   * @param {import('../audio/SoundManager.js').SoundManager} soundManager
   */
  constructor(canvas, ball, soundManager) {
    this.canvas = canvas;
    this.ball = ball;
    this.soundManager = soundManager;
    this.keys = {};
    this.onActionCallbacks = [];
    this.lastKickTime = 0;
    this.touchMoves = { left: false, right: false };
    this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    this.kickPressTime = 0;
    this.isKickHolding = false;
    this.twoPlayerMode = false;
    this.onP2ActionCallbacks = [];
    this.isP2KickHolding = false;
    this.p2KickPressTime = 0;
    this.gamepadPrev = [{}, {}];
    this.setupListeners();
  }

  setTwoPlayerMode(enabled) {
    this.twoPlayerMode = !!enabled;
  }

  startKickCharge() {
    if (!this.isKickHolding) {
      this.soundManager.init();
      this.isKickHolding = true;
      this.kickPressTime = performance.now();
      this.vibrate(15);
    }
  }

  releaseKickCharge() {
    if (this.isKickHolding) {
      const duration = (performance.now() - this.kickPressTime) / 1000;
      this.isKickHolding = false;
      this.lastKickTime = performance.now();

      if (duration >= 0.22) {
        const chargeRatio = Math.min(1.0, (duration - 0.22) / 0.45);
        this.vibrate(35);
        this.emitAction('charged_kick', chargeRatio);
      } else {
        this.vibrate(20);
        this.emitAction('kick');
      }
    }
  }

  getKickChargeRatio() {
    if (!this.isKickHolding) return 0;
    const elapsed = (performance.now() - this.kickPressTime) / 1000;
    if (elapsed < 0.18) return 0;
    return Math.min(1.0, (elapsed - 0.18) / 0.45);
  }

  startP2KickCharge() {
    if (!this.isP2KickHolding) {
      this.soundManager.init();
      this.isP2KickHolding = true;
      this.p2KickPressTime = performance.now();
      this.vibrate(15);
    }
  }

  releaseP2KickCharge() {
    if (this.isP2KickHolding) {
      const duration = (performance.now() - this.p2KickPressTime) / 1000;
      this.isP2KickHolding = false;

      if (duration >= 0.22) {
        const chargeRatio = Math.min(1.0, (duration - 0.22) / 0.45);
        this.vibrate(35);
        this.emitP2Action('charged_kick', chargeRatio);
      } else {
        this.vibrate(20);
        this.emitP2Action('kick');
      }
    }
  }

  getP2KickChargeRatio() {
    if (!this.isP2KickHolding) return 0;
    const elapsed = (performance.now() - this.p2KickPressTime) / 1000;
    if (elapsed < 0.18) return 0;
    return Math.min(1.0, (elapsed - 0.18) / 0.45);
  }

  onAction(fn) {
    this.onActionCallbacks.push(fn);
  }

  onP2Action(fn) {
    this.onP2ActionCallbacks.push(fn);
  }

  isKeyDown(key) {
    const k = key.toLowerCase();
    if (this.twoPlayerMode) {
      // In 2P mode, Arrow keys strictly belong to Player 2!
      if (k === 'a') return !!this.keys['a'] || !!this.keys['keya'] || this.touchMoves.left;
      if (k === 'd') return !!this.keys['d'] || !!this.keys['keyd'] || this.touchMoves.right;
      return !!this.keys[k];
    }

    // In 1P mode, both WASD and Arrow Keys control Player 1
    if (k === 'a' || k === 'arrowleft') {
      return !!this.keys['a'] || !!this.keys['keya'] || !!this.keys['arrowleft'] || this.touchMoves.left;
    }
    if (k === 'd' || k === 'arrowright') {
      return !!this.keys['d'] || !!this.keys['keyd'] || !!this.keys['arrowright'] || this.touchMoves.right;
    }
    return !!this.keys[k];
  }

  isP2KeyDown(key) {
    const k = key.toLowerCase();
    if (k === 'left' || k === 'arrowleft') {
      return !!this.keys['arrowleft'] || !!this.keys['numpad4'];
    }
    if (k === 'right' || k === 'arrowright') {
      return !!this.keys['arrowright'] || !!this.keys['numpad6'];
    }
    if (k === 'up' || k === 'arrowup') {
      return !!this.keys['arrowup'] || !!this.keys['numpad8'];
    }
    if (k === 'down' || k === 'arrowdown') {
      return !!this.keys['arrowdown'] || !!this.keys['numpad2'];
    }
    return !!this.keys[k];
  }

  vibrate(ms = 25) {
    try {
      if (navigator.vibrate) {
        navigator.vibrate(ms);
      }
    } catch (_) {}
  }

  pollGamepads() {
    if (!navigator.getGamepads) return;
    const gamepads = navigator.getGamepads();

    const handlePad = (gp, isP1) => {
      if (!gp || !gp.connected) return;
      const prev = this.gamepadPrev[isP1 ? 0 : 1] || {};

      // D-Pad or Left Stick Horizontal
      const stickX = gp.axes[0] || 0;
      const dpadLeft = gp.buttons[14]?.pressed || stickX < -0.35;
      const dpadRight = gp.buttons[15]?.pressed || stickX > 0.35;
      const dpadUp = gp.buttons[12]?.pressed || (gp.axes[1] && gp.axes[1] < -0.45);
      const dpadDown = gp.buttons[13]?.pressed || (gp.axes[1] && gp.axes[1] > 0.45);

      if (isP1) {
        if (dpadLeft) this.keys['a'] = true;
        else if (this.keys['a'] && !this.keys['keya']) this.keys['a'] = false;

        if (dpadRight) this.keys['d'] = true;
        else if (this.keys['d'] && !this.keys['keyd']) this.keys['d'] = false;
      } else {
        if (dpadLeft) this.keys['arrowleft'] = true;
        else this.keys['arrowleft'] = false;

        if (dpadRight) this.keys['arrowright'] = true;
        else this.keys['arrowright'] = false;
      }

      // Button 0 (A / Cross): Jump
      const btnJump = gp.buttons[0]?.pressed;
      if (btnJump && !prev.btnJump) {
        if (isP1) this.emitAction('jump');
        else this.emitP2Action('jump');
      }

      // Button 1 (B / Circle) or Button 2 (X / Square): Kick / Charge
      const btnKick = gp.buttons[1]?.pressed || gp.buttons[2]?.pressed;
      if (btnKick && !prev.btnKick) {
        if (isP1) this.startKickCharge();
        else this.startP2KickCharge();
      } else if (!btnKick && prev.btnKick) {
        if (isP1) this.releaseKickCharge();
        else this.releaseP2KickCharge();
      }

      // Button 3 (Y / Triangle) or Button 5 (RB / R1): Super Shot
      const btnSuper = gp.buttons[3]?.pressed || gp.buttons[5]?.pressed;
      if (btnSuper && !prev.btnSuper) {
        if (isP1) this.emitAction('super_shot');
        else this.emitP2Action('super_shot');
      }

      // Button 4 (LB / L1) or Dpad Down: Dash
      if (dpadDown && !prev.dpadDown) {
        if (isP1) this.emitAction('dash');
        else this.emitP2Action('dash');
      }

      this.gamepadPrev[isP1 ? 0 : 1] = {
        btnJump,
        btnKick,
        btnSuper,
        dpadDown
      };
    };

    if (gamepads[0]) handlePad(gamepads[0], true);
    if (gamepads[1]) handlePad(gamepads[1], false);
  }

  setupListeners() {
    window.addEventListener('keydown', (e) => {
      this.soundManager.init();
      const k = e.key.toLowerCase();
      this.keys[k] = true;
      this.keys[e.code] = true;

      // Blur any focused DOM element so Space never triggers buttons
      if (document.activeElement && document.activeElement.blur) {
        document.activeElement.blur();
      }

      // Ignore browser auto-repeat for actions
      if (e.repeat) return;

      // === PLAYER 2 DEDICATED CONTROLS ===
      if (this.twoPlayerMode) {
        if (e.code === 'Enter' || e.code === 'Numpad0' || e.code === 'KeyL' || e.code === 'Period') {
          e.preventDefault();
          this.startP2KickCharge();
          return;
        } else if (e.code === 'ArrowUp' || e.code === 'Numpad8') {
          e.preventDefault();
          this.vibrate(15);
          this.emitP2Action('jump');
          return;
        } else if (e.code === 'ArrowDown' || e.code === 'Numpad2') {
          e.preventDefault();
          this.vibrate(20);
          this.emitP2Action('dash');
          return;
        } else if (e.code === 'ShiftRight' || e.code === 'KeyP' || e.code === 'Numpad1' || e.code === 'KeyO') {
          e.preventDefault();
          this.vibrate(35);
          this.emitP2Action('super_shot');
          return;
        } else if (e.code === 'KeyI') {
          e.preventDefault();
          this.emitP2Action('bicycle_kick');
          return;
        } else if (e.code === 'KeyU') {
          e.preventDefault();
          this.emitP2Action('diving_header');
          return;
        }
      }

      // === PLAYER 1 CONTROLS ===
      if (e.code === 'Space' || e.code === 'KeyJ' || e.code === 'KeyX') {
        e.preventDefault();
        this.startKickCharge();
      } else if (e.code === 'KeyV') {
        e.preventDefault();
        this.vibrate(25);
        this.emitAction('bicycle_kick');
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        this.vibrate(25);
        this.emitAction('rocket_kick');
      } else if (e.code === 'KeyE') {
        e.preventDefault();
        this.vibrate(25);
        this.emitAction('diving_header');
      } else if (e.code === 'KeyQ') {
        e.preventDefault();
        this.vibrate(25);
        this.emitAction('scorpion_kick');
      } else if (e.code === 'KeyW' || (!this.twoPlayerMode && e.code === 'ArrowUp')) {
        e.preventDefault();
        this.vibrate(15);
        this.emitAction('jump');
      } else if (e.code === 'KeyS' || (!this.twoPlayerMode && e.code === 'ArrowDown') || e.code === 'KeyC') {
        e.preventDefault();
        this.vibrate(20);
        this.emitAction('dash');
      } else if (e.code === 'KeyF' || e.code === 'KeyK' || e.code === 'KeyZ' || e.code === 'ShiftLeft' || (!this.twoPlayerMode && e.code === 'ShiftRight')) {
        e.preventDefault();
        this.vibrate(35);
        this.emitAction('super_shot');
      } else if (e.code === 'KeyH') {
        this.emitAction('hurt');
      }
    });

    window.addEventListener('keyup', (e) => {
      const k = e.key.toLowerCase();
      this.keys[k] = false;
      this.keys[e.code] = false;

      if (this.twoPlayerMode && (e.code === 'Enter' || e.code === 'Numpad0' || e.code === 'KeyL' || e.code === 'Period')) {
        e.preventDefault();
        this.releaseP2KickCharge();
        return;
      }

      if (e.code === 'Space' || e.code === 'KeyJ' || e.code === 'KeyX') {
        e.preventDefault();
        this.releaseKickCharge();
      }
    });

    // Mouse drag ball interaction
    this.canvas.addEventListener('mousedown', (e) => {
      this.soundManager.init();
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const dist = Math.hypot(mx - this.ball.x, my - this.ball.y);
      if (dist < this.ball.radius * 2.5) {
        this.ball.isDragging = true;
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (this.ball.isDragging) {
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        this.ball.vx = (mx - this.ball.x) * 0.45;
        this.ball.vy = (my - this.ball.y) * 0.45;
        this.ball.x = mx;
        this.ball.y = my;
      }
    });

    window.addEventListener('mouseup', () => {
      this.ball.isDragging = false;
    });

    // Touch drag ball interaction for mobile screens
    this.canvas.addEventListener('touchstart', (e) => {
      this.soundManager.init();
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const tx = touch.clientX - rect.left;
        const ty = touch.clientY - rect.top;
        const dist = Math.hypot(tx - this.ball.x, ty - this.ball.y);
        if (dist < this.ball.radius * 2.8) {
          this.ball.isDragging = true;
        }
      }
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      if (this.ball.isDragging && e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const tx = touch.clientX - rect.left;
        const ty = touch.clientY - rect.top;
        this.ball.vx = (tx - this.ball.x) * 0.45;
        this.ball.vy = (ty - this.ball.y) * 0.45;
        this.ball.x = tx;
        this.ball.y = ty;
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', () => {
      this.ball.isDragging = false;
    });
  }

  emitAction(actionName, data = null) {
    this.onActionCallbacks.forEach(fn => fn(actionName, data));
  }

  emitP2Action(actionName, data = null) {
    this.onP2ActionCallbacks.forEach(fn => fn(actionName, data));
  }
}

exports.InputManager = InputManager;
};

__mods['ui/UIManager.js'] = function(exports, __req) {
const {  CHARACTERS  } = __req('data/Characters.js');

/**
 * Coordinates all Arcade HUD elements, touch controls, match scoreboard,
 * character select modal, and optional floating debug panel.
 */
class UIManager {
  /**
   * @param {import('../core/Skeleton.js').Skeleton} skeleton
   * @param {import('../animation/AnimationController.js').AnimationController} animController
   * @param {import('../audio/SoundManager.js').SoundManager} soundManager
   */
  constructor(skeleton, animController, soundManager) {
    this.skeleton = skeleton;
    this.animController = animController;
    this.soundManager = soundManager;

    this.onPlayActionCallbacks = [];
    this.onSelectPlayerCharCallbacks = [];
    this.onSelectRivalCharCallbacks = [];
    this.onRestartMatchCallbacks = [];
    this.onStartTournMatchCallbacks = [];
    this.onStartSurvivalCallbacks = [];
    this.onStartGoldenGoalCallbacks = [];
    this.onStartQuickMatchCallbacks = [];
    this.onStartLocal2PCallbacks = [];
    this.onToggle2PCallbacks = [];

    this.isMobileMode = ('ontouchstart' in window) || (window.innerWidth <= 900);
    this.isTwoPlayerMode = false;
    this.currentP1Char = CHARACTERS[0]; // Kenta 🇯🇵
    this.currentRivalChar = CHARACTERS[1]; // El Toro 🇲🇽

    this.toggles = {
      showBones: false,
      showJoints: false,
      showMesh: false,
      showHitboxes: false,
      showSkin: true,
      rival: true
    };

    this.initDOM();
  }

  onStartTournMatch(fn) {
    this.onStartTournMatchCallbacks.push(fn);
  }

  onStartSurvival(fn) {
    this.onStartSurvivalCallbacks.push(fn);
  }

  onStartGoldenGoal(fn) {
    this.onStartGoldenGoalCallbacks.push(fn);
  }

  onStartQuickMatch(fn) {
    this.onStartQuickMatchCallbacks.push(fn);
  }

  onStartLocal2P(fn) {
    this.onStartLocal2PCallbacks.push(fn);
  }

  onToggle2P(fn) {
    this.onToggle2PCallbacks.push(fn);
  }

  setTwoPlayerMode(enabled) {
    this.isTwoPlayerMode = !!enabled;
    const btn2P = document.getElementById('btnToggle2P');
    if (btn2P) {
      if (this.isTwoPlayerMode) {
        btn2P.textContent = '👥 2P Local: ON';
        btn2P.style.background = 'linear-gradient(135deg, rgba(0, 240, 255, 0.25), rgba(255, 55, 0, 0.25))';
        btn2P.style.borderColor = '#00f0ff';
        btn2P.style.boxShadow = '0 0 14px rgba(0, 240, 255, 0.55)';
      } else {
        btn2P.textContent = '👥 2P Local: OFF';
        btn2P.style.background = '';
        btn2P.style.borderColor = 'rgba(0, 240, 255, 0.6)';
        btn2P.style.boxShadow = '';
      }
    }
    this.setRivalInfo(this.currentRivalChar);
  }

  onPlayAction(fn) {
    this.onPlayActionCallbacks.push(fn);
  }

  onSelectPlayerCharacter(fn) {
    this.onSelectPlayerCharCallbacks.push(fn);
  }

  onSelectRivalCharacter(fn) {
    this.onSelectRivalCharCallbacks.push(fn);
  }

  onSelectBone(fn) {
    this.onSelectBoneCallbacks = this.onSelectBoneCallbacks || [];
    this.onSelectBoneCallbacks.push(fn);
  }

  onRestartMatch(fn) {
    this.onRestartMatchCallbacks.push(fn);
  }

  setActiveAnim(animName) {
    // Optionally log or highlight active animation state
  }

  updateTelemetry(speedKmH) {
    // Optionally update telemetry badges if visible
  }

  updateTimeline(animTime, duration) {
    // Optionally update timeline if visible
  }

  updateBoneInspector() {
    // Debugger inspector update
  }

  initDOM() {
    // 1. Audio toggle in header
    const audioBtn = document.getElementById('audioToggleBtn');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const isEnabled = this.soundManager.toggle();
        audioBtn.textContent = isEnabled ? '🔊 Audio: ON' : '🔇 Audio: OFF';
      });
    }

    // 2. Character Select Modal Open / Close
    const modal = document.getElementById('charSelectModal');
    const btnOpenRoster = document.getElementById('btnOpenRoster');
    const btnCloseRoster = document.getElementById('btnCloseRosterModal');

    if (btnOpenRoster && modal) {
      btnOpenRoster.addEventListener('click', () => {
        modal.classList.add('open');
        this.renderModalRoster();
      });
    }

    if (btnCloseRoster && modal) {
      btnCloseRoster.addEventListener('click', () => {
        modal.classList.remove('open');
      });
    }

    // Close modal on clicking outside or ESC
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
      });
    }

    // 2b. Tournament Modal Open / Close & Tab Switching
    const tournModal = document.getElementById('tournamentModal');
    const btnOpenTourn = document.getElementById('btnOpenTournaments');
    const btnCloseTourn = document.getElementById('btnCloseTournModal');

    if (btnOpenTourn && tournModal) {
      btnOpenTourn.addEventListener('click', () => {
        tournModal.classList.add('open');
      });
    }

    if (btnCloseTourn && tournModal) {
      btnCloseTourn.addEventListener('click', () => {
        tournModal.classList.remove('open');
      });
    }

    if (tournModal) {
      tournModal.addEventListener('click', (e) => {
        if (e.target === tournModal) tournModal.classList.remove('open');
      });
    }

    // Tournament Tabs Switching
    const tabBtns = document.querySelectorAll('.tourn-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.dataset.tab;
        document.querySelectorAll('.tourn-tab-content').forEach(c => c.classList.remove('active'));
        const activeContent = document.getElementById(`tabContent${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
        if (activeContent) activeContent.classList.add('active');
      });
    });

    // 2c. Mobile Mode & Fullscreen Toggles
    const btnMobile = document.getElementById('btnToggleMobile');
    if (this.isMobileMode) {
      document.body.classList.add('mobile-mode');
      if (btnMobile) btnMobile.textContent = '📱 Móvil: ON';
    }

    if (btnMobile) {
      btnMobile.addEventListener('click', () => {
        const isMob = document.body.classList.toggle('mobile-mode');
        this.isMobileMode = isMob;
        btnMobile.textContent = isMob ? '📱 Móvil: ON' : '📱 Móvil: OFF';
      });
    }

    const btnFs = document.getElementById('btnFullscreen');
    if (btnFs) {
      btnFs.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen?.().catch(() => {});
        } else {
          document.exitFullscreen?.().catch(() => {});
        }
      });
    }

    // 2d. Tournament Action Buttons
    const btnStartTournMatch = document.getElementById('btnStartTournMatch');
    if (btnStartTournMatch) {
      btnStartTournMatch.addEventListener('click', () => {
        if (tournModal) tournModal.classList.remove('open');
        this.onStartTournMatchCallbacks.forEach(fn => fn());
      });
    }

    const btnStartSurvival = document.getElementById('btnStartSurvival');
    if (btnStartSurvival) {
      btnStartSurvival.addEventListener('click', () => {
        if (tournModal) tournModal.classList.remove('open');
        this.onStartSurvivalCallbacks.forEach(fn => fn());
      });
    }

    const btnStartGolden = document.getElementById('btnStartGoldenGoal');
    if (btnStartGolden) {
      btnStartGolden.addEventListener('click', () => {
        if (tournModal) tournModal.classList.remove('open');
        this.onStartGoldenGoalCallbacks.forEach(fn => fn());
      });
    }

    const btnStartQuick = document.getElementById('btnStartQuickMatch');
    if (btnStartQuick) {
      btnStartQuick.addEventListener('click', () => {
        if (tournModal) tournModal.classList.remove('open');
        this.onStartQuickMatchCallbacks.forEach(fn => fn());
      });
    }

    const btnStartLocal2P = document.getElementById('btnStartLocal2P');
    if (btnStartLocal2P) {
      btnStartLocal2P.addEventListener('click', () => {
        if (tournModal) tournModal.classList.remove('open');
        this.onStartLocal2PCallbacks.forEach(fn => fn());
      });
    }

    const btnToggle2P = document.getElementById('btnToggle2P');
    if (btnToggle2P) {
      btnToggle2P.addEventListener('click', () => {
        this.onToggle2PCallbacks.forEach(fn => fn());
      });
    }

    // Trophy Claim Button
    const btnClaim = document.getElementById('btnClaimTrophy');
    if (btnClaim) {
      btnClaim.addEventListener('click', () => {
        this.hideTrophyModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (modal?.classList.contains('open')) modal.classList.remove('open');
        if (tournModal?.classList.contains('open')) tournModal.classList.remove('open');
        this.hideTrophyModal();
      }
      if ((e.key === 'c' || e.key === 'C') && !modal?.classList.contains('open') && !tournModal?.classList.contains('open')) {
        modal?.classList.add('open');
        this.renderModalRoster();
      }
      if ((e.key === 't' || e.key === 'T') && !modal?.classList.contains('open') && !tournModal?.classList.contains('open')) {
        tournModal?.classList.add('open');
      }
    });

    // 3. Floating Debug Panel Toggle
    const debugPanel = document.getElementById('floatingDebugPanel');
    const btnToggleDebug = document.getElementById('btnToggleDebug');
    const btnCloseDebug = document.getElementById('btnCloseDebug');

    if (btnToggleDebug && debugPanel) {
      btnToggleDebug.addEventListener('click', () => {
        debugPanel.classList.toggle('open');
      });
    }

    if (btnCloseDebug && debugPanel) {
      btnCloseDebug.addEventListener('click', () => {
        debugPanel.classList.remove('open');
      });
    }

    // Debug Toggles
    const bindToggle = (id, key) => {
      const el = document.getElementById(id);
      if (el) {
        el.checked = !!this.toggles[key];
        const update = () => { this.toggles[key] = el.checked; };
        el.addEventListener('change', update);
        el.addEventListener('input', update);
        el.addEventListener('click', update);
      }
    };
    bindToggle('dbgHitboxes', 'showHitboxes');
    bindToggle('dbgBones', 'showBones');
    bindToggle('dbgMesh', 'showMesh');
    bindToggle('dbgRival', 'rival');

    // Debug Sliders
    const sliderHead = document.getElementById('dbgSliderHead');
    if (sliderHead) {
      sliderHead.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.animController.headScaleMultiplier = val;
        document.getElementById('dbgValHead').textContent = val.toFixed(1) + 'x';
      });
    }

    const sliderSpeed = document.getElementById('dbgSliderSpeed');
    if (sliderSpeed) {
      sliderSpeed.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.animController.speed = val;
        document.getElementById('dbgValSpeed').textContent = val.toFixed(1) + 'x';
      });
    }

    // Goal Properties Dynamic Configuration
    const selNetStyle = document.getElementById('dbgNetStyle');
    if (selNetStyle) {
      selNetStyle.addEventListener('change', (e) => {
        window.stadiumRenderer?.setGoalProps({ netStyle: e.target.value });
      });
    }

    const selNetColor = document.getElementById('dbgNetColor');
    if (selNetColor) {
      selNetColor.addEventListener('change', (e) => {
        window.stadiumRenderer?.setGoalProps({ netColor: e.target.value });
      });
    }

    const chkGoalLed = document.getElementById('dbgGoalLed');
    if (chkGoalLed) {
      chkGoalLed.addEventListener('change', (e) => {
        window.stadiumRenderer?.setGoalProps({ ledSensors: e.target.checked });
      });
    }

    const chkGoalLaser = document.getElementById('dbgGoalLaser');
    if (chkGoalLaser) {
      chkGoalLaser.addEventListener('change', (e) => {
        window.stadiumRenderer?.setGoalProps({ laserLine: e.target.checked });
      });
    }

    const chkGoalVibe = document.getElementById('dbgGoalVibe');
    if (chkGoalVibe) {
      chkGoalVibe.addEventListener('change', (e) => {
        window.stadiumRenderer?.setGoalProps({ vibration: e.target.checked });
      });
    }

    // 4. Restart Match Button
    const btnRestart = document.getElementById('btnRestartMatch');
    if (btnRestart) {
      btnRestart.addEventListener('click', () => {
        this.onRestartMatchCallbacks.forEach(fn => fn());
      });
    }

    // 5. Arcade Action Buttons (Touch / Click)
    const bindActionBtn = (id, actionName) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('mousedown', (e) => {
          e.preventDefault();
          btn.blur();
          this.onPlayActionCallbacks.forEach(fn => fn(actionName));
        });
        btn.addEventListener('touchstart', (e) => {
          e.preventDefault();
          this.onPlayActionCallbacks.forEach(fn => fn(actionName));
        }, { passive: false });
      }
    };

    bindActionBtn('btnJump', 'jump');
    bindActionBtn('btnSuper', 'super_shot');
    bindActionBtn('btnDash', 'dash');

    // Prevent focus outline on buttons so Space key doesn't trigger button clicks
    document.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('focus', () => btn.blur());
    });

    // 6. Initial Render of Modal Roster
    this.renderModalRoster();
  }

  setPlayerInfo(char) {
    this.currentP1Char = char;
    const nameEl = document.getElementById('p1Name');
    const flagEl = document.getElementById('p1Flag');
    const superBtnName = document.getElementById('superBtnName');

    if (nameEl) nameEl.textContent = `${char.name.toUpperCase()} #10`;
    if (flagEl) flagEl.textContent = char.country;
    if (superBtnName) superBtnName.textContent = `🔥 ${char.super.name.toUpperCase()}`;

    this.renderModalRoster();
  }

  setRivalInfo(char) {
    this.currentRivalChar = char;
    const nameEl = document.getElementById('rivalName');
    const flagEl = document.getElementById('rivalFlag');

    const prefix = this.isTwoPlayerMode ? '🎮 P2: ' : '';
    if (nameEl) nameEl.textContent = `${prefix}${char.name.toUpperCase()} #7`;
    if (flagEl) flagEl.textContent = char.country;

    this.renderModalRoster();
  }

  setPlayerHp(hp, maxHp = 100) {
    const ratio = Math.max(0, Math.min(1, hp / maxHp));
    const lifeBar = document.getElementById('p1LifeBar');
    const ghostBar = document.getElementById('p1DamageGhost');
    const hpText = document.getElementById('p1HpText');

    if (lifeBar) {
      lifeBar.style.width = `${ratio * 100}%`;
      if (ratio < 0.35) {
        lifeBar.style.background = 'linear-gradient(90deg, #ff0044, #ff5500)';
      } else {
        lifeBar.style.background = 'linear-gradient(90deg, #00ff88, #ffd700)';
      }
    }

    if (ghostBar) {
      setTimeout(() => {
        ghostBar.style.width = `${ratio * 100}%`;
      }, 200);
    }

    if (hpText) {
      hpText.textContent = `${hp}/${maxHp}`;
    }
  }

  setRivalHp(hp, maxHp = 100) {
    const ratio = Math.max(0, Math.min(1, hp / maxHp));
    const lifeBar = document.getElementById('rivalLifeBar');
    const ghostBar = document.getElementById('rivalDamageGhost');
    const hpText = document.getElementById('rivalHpText');

    if (lifeBar) {
      lifeBar.style.width = `${ratio * 100}%`;
      if (ratio < 0.35) {
        lifeBar.style.background = 'linear-gradient(-90deg, #ff0044, #ff5500)';
      } else {
        lifeBar.style.background = 'linear-gradient(-90deg, #00ff88, #ffd700)';
      }
    }

    if (ghostBar) {
      setTimeout(() => {
        ghostBar.style.width = `${ratio * 100}%`;
      }, 200);
    }

    if (hpText) {
      hpText.textContent = `${hp}/${maxHp}`;
    }
  }

  setPowerMeter(ratio, isReady) {
    const p1Bar = document.getElementById('p1PowerBar');
    const p1Text = document.getElementById('p1PowerPct');
    const btnSuper = document.getElementById('btnSuper');

    if (p1Bar) {
      p1Bar.style.width = `${Math.min(1, ratio) * 100}%`;
      p1Bar.classList.toggle('ready', isReady);
    }

    if (p1Text) {
      p1Text.textContent = isReady ? '¡LISTO!' : `${Math.floor(ratio * 100)}%`;
      p1Text.style.color = isReady ? '#ffd700' : '#fff';
    }

    if (btnSuper) {
      btnSuper.classList.toggle('ready', isReady);
    }
  }

  setRivalPowerMeter(ratio, isReady) {
    const rivalBar = document.getElementById('rivalPowerBar');
    const rivalText = document.getElementById('rivalPowerPct');

    if (rivalBar) {
      rivalBar.style.width = `${Math.min(1, ratio) * 100}%`;
      rivalBar.classList.toggle('ready', isReady);
    }

    if (rivalText) {
      rivalText.textContent = isReady ? '¡LISTO!' : `${Math.floor(ratio * 100)}%`;
    }
  }

  setScore(p1Goals, rivalGoals) {
    const p1El = document.getElementById('p1Score');
    const rivalEl = document.getElementById('rivalScore');
    if (p1El) p1El.textContent = p1Goals;
    if (rivalEl) rivalEl.textContent = rivalGoals;
  }

  setMatchTimer(seconds) {
    const clock = document.getElementById('matchClock');
    if (clock) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      clock.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
      clock.style.color = seconds <= 10 ? '#ff3700' : '#fff';
    }
  }

  showGoalBanner(scorerName = '', scorerFlag = '⚽') {
    const banner = document.getElementById('goalBanner');
    if (banner) {
      if (scorerName) {
        banner.innerHTML = `<span style="font-size: 0.58em; display: block; color: #ffd700; text-shadow: 0 0 20px rgba(255,215,0,0.9); letter-spacing: 2px;">¡¡¡GOOOOOOLAZO!!!</span>${scorerFlag} ${scorerName.toUpperCase()}`;
      } else {
        banner.textContent = '¡¡¡GOOOOOOOLAZO!!! 🔥';
      }
      banner.classList.add('show');
      setTimeout(() => banner.classList.remove('show'), 2200);
    }
  }

  showMatchOver(title, subtitle) {
    const overlay = document.getElementById('matchOverBanner');
    const titleEl = document.getElementById('matchOverTitle');
    const subEl = document.getElementById('matchOverSub');
    if (overlay) {
      if (titleEl) titleEl.textContent = title;
      if (subEl) subEl.textContent = subtitle;
      overlay.classList.add('show');
    }
  }

  hideMatchOver() {
    const overlay = document.getElementById('matchOverBanner');
    if (overlay) overlay.classList.remove('show');
  }

  setDizzyActive(isActive) {
    const pill = document.getElementById('pillDizzy');
    if (pill) pill.style.display = isActive ? 'block' : 'none';
  }

  setStunActive(isActive) {
    this.setDizzyActive(isActive);
  }

  setKnockdownActive(isActive) {
    const pill = document.getElementById('pillKnockdown');
    if (pill) pill.style.display = isActive ? 'block' : 'none';
  }

  setRagdollActive(isActive) {
    this.setKnockdownActive(isActive);
  }

  renderModalRoster() {
    const grid = document.getElementById('modalRosterGrid');
    if (!grid) return;
    grid.innerHTML = '';

    CHARACTERS.forEach(char => {
      const isP1 = char.id === this.currentP1Char.id;
      const isRival = char.id === this.currentRivalChar.id;

      const card = document.createElement('div');
      card.className = 'modal-char-card' + (isP1 ? ' active-p1' : '') + (isRival ? ' active-rival' : '');

      const speedPct = Math.round((char.stats.speed / 1.3) * 100);
      const jumpPct = Math.round((char.stats.jump / 1.3) * 100);
      const powerPct = Math.round((char.stats.power / 1.3) * 100);

      card.innerHTML = `
        <div class="modal-char-avatar-box">
          <img src="${char.heads.idle}" alt="${char.name}">
        </div>

        <div class="modal-char-info">
          <div class="modal-char-name">${char.country} ${char.name}</div>
          <div class="modal-char-title">${char.title}</div>
          <div class="modal-super-badge">⚡ ${char.super.name}</div>
        </div>

        <div class="modal-stat-bars">
          <div class="stat-line">
            <span>Velocidad</span>
            <div class="stat-track"><div class="stat-fill" style="width: ${speedPct}%; background: #00f0ff;"></div></div>
          </div>
          <div class="stat-line">
            <span>Salto</span>
            <div class="stat-track"><div class="stat-fill" style="width: ${jumpPct}%; background: #ffd700;"></div></div>
          </div>
          <div class="stat-line">
            <span>Poder</span>
            <div class="stat-track"><div class="stat-fill" style="width: ${powerPct}%; background: #ff3700;"></div></div>
          </div>
        </div>

        <div class="modal-card-buttons">
          <button class="btn-card-choose p1${isP1 ? ' active' : ''}">
            ${isP1 ? '⭐ P1' : 'Elegir P1'}
          </button>
          <button class="btn-card-choose rival${isRival ? ' active' : ''}">
            ${this.isTwoPlayerMode ? (isRival ? '🎮 P2' : 'Elegir P2') : (isRival ? '🤖 CPU' : 'Elegir CPU')}
          </button>
        </div>
      `;

      card.querySelector('.btn-card-choose.p1').addEventListener('click', (e) => {
        e.stopPropagation();
        this.onSelectPlayerCharCallbacks.forEach(fn => fn(char.id));
        const m = document.getElementById('charSelectModal');
        if (m) m.classList.remove('open');
      });

      card.querySelector('.btn-card-choose.rival').addEventListener('click', (e) => {
        e.stopPropagation();
        this.onSelectRivalCharCallbacks.forEach(fn => fn(char.id));
        const m = document.getElementById('charSelectModal');
        if (m) m.classList.remove('open');
      });

      grid.appendChild(card);
    });
  }

  updateTournamentPill(title, icon = '🏆') {
    const pill = document.getElementById('hudTournamentPill');
    const textEl = document.getElementById('tournStatusText');
    const iconEl = pill?.querySelector('.tourn-icon');
    if (textEl) textEl.textContent = title;
    if (iconEl) iconEl.textContent = icon;
  }

  updateSurvivalStats(currentStreak, bestStreak) {
    const curEl = document.getElementById('survivalCurrentStreak');
    const bestEl = document.getElementById('survivalBestStreak');
    if (curEl) curEl.textContent = currentStreak.toString();
    if (bestEl) bestEl.textContent = bestStreak.toString();
  }

  renderTournamentBracket(bracket, currentRound = 0) {
    const container = document.getElementById('bracketTreeRoot');
    const titleEl = document.getElementById('bracketRoundTitle');
    const actionBtn = document.getElementById('btnStartTournMatch');
    if (!container || !bracket) return;

    const roundNames = ['CUARTOS DE FINAL', 'SEMIFINAL', 'GRAN FINAL', '¡CAMPEÓN MUNDIAL!'];
    if (titleEl) {
      titleEl.textContent = `ESTADO: ${roundNames[Math.min(3, currentRound)]}`;
    }

    if (actionBtn) {
      if (currentRound === 0) actionBtn.textContent = '⚔️ ¡JUGAR CUARTOS DE FINAL!';
      else if (currentRound === 1) actionBtn.textContent = '🔥 ¡JUGAR SEMIFINAL!';
      else if (currentRound === 2) actionBtn.textContent = '👑 ¡JUGAR GRAN FINAL!';
      else actionBtn.textContent = '🏆 ¡COPA CONQUISTADA!';
      actionBtn.style.display = currentRound >= 3 ? 'none' : 'block';
    }

    const renderTeamSlot = (team, score, isWinner, isUser) => {
      if (!team) {
        return `<div class="bracket-team-slot placeholder"><span>Por Definir...</span></div>`;
      }
      return `
        <div class="bracket-team-slot${isWinner ? ' winner' : ''}${isUser ? ' is-user' : ''}">
          <span class="slot-flag">${team.country}</span>
          <span class="slot-name">${team.name}</span>
          <span class="slot-score">${score !== null ? score : '-'}</span>
        </div>
      `;
    };

    container.innerHTML = `
      <!-- Column 1: Cuartos de Final -->
      <div class="bracket-column">
        <div class="bracket-col-header">CUARTOS</div>
        <div class="bracket-col-matches">
          ${bracket.qf.map(m => `
            <div class="bracket-match-card${m.isPlayer ? ' player-match' : ''}">
              ${renderTeamSlot(m.teamA, m.scoreA, m.winner === m.teamA, m.teamA?.id === this.currentP1Char.id)}
              <div class="bracket-vs-divider">VS</div>
              ${renderTeamSlot(m.teamB, m.scoreB, m.winner === m.teamB, m.teamB?.id === this.currentP1Char.id)}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Column 2: Semifinales -->
      <div class="bracket-column">
        <div class="bracket-col-header">SEMIFINAL</div>
        <div class="bracket-col-matches spread">
          ${bracket.sf.map(m => `
            <div class="bracket-match-card${m.isPlayer ? ' player-match' : ''}">
              ${renderTeamSlot(m.teamA, m.scoreA, m.winner === m.teamA, m.teamA?.id === this.currentP1Char.id)}
              <div class="bracket-vs-divider">VS</div>
              ${renderTeamSlot(m.teamB, m.scoreB, m.winner === m.teamB, m.teamB?.id === this.currentP1Char.id)}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Column 3: Gran Final -->
      <div class="bracket-column final-col">
        <div class="bracket-col-header" style="color: #ffd700;">GRAN FINAL</div>
        <div class="bracket-col-matches centered">
          ${bracket.fn.map(m => `
            <div class="bracket-match-card gold-border${m.isPlayer ? ' player-match' : ''}">
              ${renderTeamSlot(m.teamA, m.scoreA, m.winner === m.teamA, m.teamA?.id === this.currentP1Char.id)}
              <div class="bracket-vs-divider gold">👑 FINAL</div>
              ${renderTeamSlot(m.teamB, m.scoreB, m.winner === m.teamB, m.teamB?.id === this.currentP1Char.id)}
            </div>
          `).join('')}
          <div class="bracket-cup-symbol">🏆</div>
        </div>
      </div>
    `;
  }

  showTrophyModal(championChar) {
    const modal = document.getElementById('trophyModal');
    const flagEl = document.getElementById('trophyFlag');
    const nameEl = document.getElementById('trophyName');
    if (flagEl) flagEl.textContent = championChar.country;
    if (nameEl) nameEl.textContent = `${championChar.name.toUpperCase()} #10`;
    if (modal) modal.classList.add('open');
  }

  hideTrophyModal() {
    const modal = document.getElementById('trophyModal');
    if (modal) modal.classList.remove('open');
  }
}

exports.UIManager = UIManager;
};

__req('main.js');
})();
