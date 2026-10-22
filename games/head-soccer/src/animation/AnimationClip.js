/**
 * Authentic Head Soccer Arcade Keyframe Animation Engine.
 * Features realistic athletic sprint physics, explosive multi-phase kick snaps,
 * contralateral arm swings, and secondary harmonic follow-through.
 */
export const AnimationClips = {
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
