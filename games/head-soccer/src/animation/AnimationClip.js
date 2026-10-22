/**
 * Authentic Head Soccer keyframe animations and easing curves.
 * Fast, dynamic, arcade animations with fluid Chibi character motion.
 */
export const AnimationClips = {
  idle: {
    name: 'idle',
    duration: 0.8,
    loop: true,
    evaluate: (t) => {
      // Natural cartoon breathing bounce
      const cycle = t * Math.PI * 2;
      const bounce = Math.sin(cycle);
      const squash = Math.cos(cycle);

      return {
        hipY: -32 + bounce * 2.5,
        torsoRot: bounce * 1.5,
        headRot: -bounce * 2.0,
        headScaleX: 1.0 + squash * 0.03,
        headScaleY: 1.0 - squash * 0.03,
        hairRot: 35 + bounce * 10,
        legFrontRot: 195,
        footFrontRot: -105 + bounce * 2,
        legBackRot: 165,
        footBackRot: -75,
        armFrontRot: 125 + bounce * 6,
        armBackRot: -145 - bounce * 6,
        face: 'idle'
      };
    }
  },

  run: {
    name: 'run',
    duration: 0.45,
    loop: true,
    evaluate: (t) => {
      // High-energy arcade sprint
      const cycle = t * Math.PI * 2;
      const sin = Math.sin(cycle);
      const cos = Math.cos(cycle);
      const bounce = Math.abs(Math.sin(cycle * 2));

      return {
        hipY: -32 - bounce * 4.5,
        torsoRot: -12 + sin * 3, // leaning forward into sprint
        headRot: -sin * 4,
        headScaleX: 1.02,
        headScaleY: 0.98,
        hairRot: 55 + sin * 18, // hair whips back with wind
        legFrontRot: 195 + sin * 42, // energetic leg stride
        footFrontRot: -105 + cos * 25,
        legBackRot: 195 - sin * 42,
        footBackRot: -105 - cos * 25,
        armFrontRot: 125 - sin * 45, // arms pumping
        armBackRot: -145 + sin * 45,
        face: 'idle'
      };
    }
  },

  kick: {
    name: 'kick',
    duration: 0.24, // Ultra-snappy arcade kick
    loop: false,
    evaluate: (t) => {
      let hipY = -32;
      let legAngle = 195;
      let footAngle = -105;
      let torsoRot = 0;
      let headRot = 0;
      let armFrontRot = 125;
      let armBackRot = -145;
      let face = 'strain';

      if (t < 0.25) {
        // Quick windup & leg pull
        const p = t / 0.25;
        legAngle = 195 + p * 35; // 230°
        footAngle = -105 - p * 20;
        torsoRot = -p * 12;
        headRot = p * 6;
        hipY = -32 - p * 3;
        armFrontRot = 125 - p * 35;
        armBackRot = -145 - p * 25;
      } else if (t < 0.65) {
        // Explosive snap forward!
        const p = (t - 0.25) / 0.40;
        const ease = Math.sin(p * Math.PI * 0.5);
        legAngle = 230 - ease * 135; // snaps forward to 95°
        footAngle = -125 + ease * 115;
        torsoRot = -12 + ease * 22;
        headRot = 6 - ease * 14;
        hipY = -35 + ease * 5;
        armFrontRot = 90 + ease * 65;
        armBackRot = -170 + ease * 35;
      } else {
        // Crisp return
        const p = (t - 0.65) / 0.35;
        legAngle = 95 + p * 100;
        footAngle = -10 - p * 95;
        torsoRot = 10 - p * 10;
        headRot = -8 + p * 8;
        hipY = -30 - p * 2;
        armFrontRot = 155 - p * 30;
        armBackRot = -135 - p * 10;
        face = 'idle';
      }

      return {
        hipY,
        torsoRot,
        headRot,
        headScaleX: 1.04,
        headScaleY: 0.96,
        hairRot: 35 - torsoRot * 0.8,
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
    duration: 0.55,
    loop: false,
    evaluate: (t) => {
      // Dynamic in-air pose: legs tuck, torso and head prepare for header
      const cycle = Math.sin(t * Math.PI);
      return {
        hipY: -32 - cycle * 8,
        torsoRot: cycle * 12,
        headRot: cycle * 14, // lunging forward for header
        headScaleX: 1.05,
        headScaleY: 0.96,
        hairRot: 35 + cycle * 22,
        legFrontRot: 195 - cycle * 45, // tucked legs
        footFrontRot: -105 + cycle * 35,
        legBackRot: 165 - cycle * 30,
        footBackRot: -75 + cycle * 25,
        armFrontRot: 125 - cycle * 55, // arms spread for air balance
        armBackRot: -145 + cycle * 55,
        face: 'strain'
      };
    }
  },

  stun: {
    name: 'stun',
    duration: 1.2,
    loop: true,
    evaluate: (t) => {
      // Comical arcade dizzy stagger
      const cycle = t * Math.PI * 6;
      const wobble = Math.sin(cycle);
      const sway = Math.cos(cycle * 0.5);

      return {
        hipY: -32 + Math.abs(wobble) * 2,
        torsoRot: sway * 14,
        headRot: -sway * 18 + wobble * 6,
        headScaleX: 1.0 + wobble * 0.04,
        headScaleY: 1.0 - wobble * 0.04,
        hairRot: 35 + sway * 15,
        legFrontRot: 195 + wobble * 10,
        footFrontRot: -105,
        legBackRot: 165 - wobble * 10,
        footBackRot: -75,
        armFrontRot: 125 + sway * 30, // limp floppy arms wobbling
        armBackRot: -145 - sway * 30,
        face: 'ko'
      };
    }
  },

  super_shot: {
    name: 'super_shot',
    duration: 0.65, // Fast powerful special move
    loop: false,
    evaluate: (t) => {
      let hipY = -32;
      let legAngle = 195;
      let footAngle = -105;
      let headRot = 0;
      let armFrontRot = 125;
      let armBackRot = -145;

      if (t < 0.3) {
        // Instant power windup leap
        const p = t / 0.3;
        hipY = -32 - p * 40;
        legAngle = 195 + p * 45;
        headRot = -p * 15;
        armFrontRot = 125 - p * 60;
        armBackRot = -145 + p * 40;
      } else if (t < 0.7) {
        // Devastating Dragon Kick!
        const p = (t - 0.3) / 0.4;
        hipY = -72;
        legAngle = 240 - p * 165;
        footAngle = -130 + p * 125;
        headRot = -15 + p * 30;
        armFrontRot = 65 + p * 110;
        armBackRot = -105 - p * 40;
      } else {
        // Crisp touchdown
        const p = (t - 0.7) / 0.3;
        hipY = -72 + p * 40;
        legAngle = 75 + p * 120;
        footAngle = -5 - p * 100;
        headRot = 15 - p * 15;
        armFrontRot = 175 - p * 50;
        armBackRot = -145;
      }

      return {
        hipY,
        torsoRot: headRot * 0.4,
        headRot,
        headScaleX: 1.08,
        headScaleY: 0.94,
        hairRot: 55 + (Math.random() - 0.5) * 35,
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
    duration: 0.45,
    loop: false,
    evaluate: (t) => {
      // Acrobatic overhead backflip bicycle kick!
      const spinAngle = t * Math.PI * 2;
      const arc = Math.sin(t * Math.PI);
      const legSnap = t > 0.4 && t < 0.75 ? 1.0 : 0.0;

      return {
        hipY: -32 - arc * 55,
        torsoRot: -180 + t * 360,
        headRot: -25 + arc * 30,
        headScaleX: 1.06,
        headScaleY: 0.94,
        hairRot: 65 + Math.sin(spinAngle) * 35,
        legFrontRot: 195 - legSnap * 145 - arc * 35,
        footFrontRot: -105 + legSnap * 125,
        legBackRot: 165 + arc * 45,
        footBackRot: -75 - arc * 25,
        armFrontRot: 125 + Math.sin(spinAngle) * 75,
        armBackRot: -145 - Math.sin(spinAngle) * 75,
        face: 'strain',
        aura: t > 0.3 && t < 0.7
      };
    }
  },

  diving_header: {
    name: 'diving_header',
    duration: 0.5,
    loop: false,
    evaluate: (t) => {
      // Bullet horizontal dive forward
      const diveArc = Math.sin(t * Math.PI);
      return {
        hipY: -32 - diveArc * 35,
        torsoRot: 78 * diveArc, // prone horizontal flying pose
        headRot: 35 * diveArc,
        headScaleX: 1.1,
        headScaleY: 0.92,
        hairRot: 75,
        legFrontRot: 195 - diveArc * 85, // legs trailing behind horizontally
        footFrontRot: -105 + diveArc * 65,
        legBackRot: 165 - diveArc * 65,
        footBackRot: -75 + diveArc * 45,
        armFrontRot: 125 + diveArc * 95, // arms thrusting forward
        armBackRot: -145 + diveArc * 85,
        face: 'strain'
      };
    }
  },

  celebration: {
    name: 'celebration',
    duration: 1.2,
    loop: true,
    evaluate: (t) => {
      // Euphoric Goal Celebration: pumping fists in the air, jumping with joy!
      const cycle = t * Math.PI * 4;
      const jump = Math.abs(Math.sin(cycle));
      return {
        hipY: -32 - jump * 22,
        torsoRot: Math.sin(cycle) * 8,
        headRot: -18 + Math.cos(cycle) * 12, // looking up at the sky
        headScaleX: 1.05,
        headScaleY: 0.95,
        hairRot: 45 + Math.sin(cycle) * 20,
        legFrontRot: 195 - jump * 35,
        footFrontRot: -105 + jump * 20,
        legBackRot: 165 - jump * 25,
        footBackRot: -75 + jump * 15,
        armFrontRot: 35 + Math.sin(cycle) * 30, // hands high in the air!
        armBackRot: -35 - Math.sin(cycle) * 30,
        face: 'idle'
      };
    }
  },

  defeat: {
    name: 'defeat',
    duration: 1.5,
    loop: true,
    evaluate: (t) => {
      // Slumped shoulders, head in hands in heartbreak
      const sob = Math.sin(t * Math.PI * 6) * 2.5;
      return {
        hipY: -22 + sob,
        torsoRot: 32, // slumped forward
        headRot: 45 + sob * 1.5, // head looking down
        headScaleX: 0.98,
        headScaleY: 1.02,
        hairRot: 15,
        legFrontRot: 180,
        footFrontRot: -90,
        legBackRot: 150,
        footBackRot: -60,
        armFrontRot: 75,
        armBackRot: -75,
        face: 'ko'
      };
    }
  },

  super_charge: {
    name: 'super_charge',
    duration: 0.8,
    loop: true,
    evaluate: (t) => {
      // DBZ-style super Saiyan energy charge vibrating posture
      const vibrate = (Math.random() - 0.5) * 4;
      const breathe = Math.sin(t * Math.PI * 4);
      return {
        hipY: -34 + vibrate,
        torsoRot: -8 + vibrate * 0.5,
        headRot: -12 + breathe * 4,
        headScaleX: 1.08 + Math.abs(vibrate) * 0.02,
        headScaleY: 0.94 - Math.abs(vibrate) * 0.02,
        hairRot: 55 + vibrate * 5,
        legFrontRot: 215, // wide grounded athletic stance
        footFrontRot: -120,
        legBackRot: 145,
        footBackRot: -60,
        armFrontRot: 85 + vibrate * 4, // clenched tensed fists
        armBackRot: -115 - vibrate * 4,
        face: 'power',
        aura: true
      };
    }
  },

  rocket_kick: {
    name: 'rocket_kick',
    duration: 0.28,
    loop: false,
    evaluate: (t) => {
      // Powerful low drive cannon shot with deep windup and explosive follow-through!
      let legAngle = 195;
      let footAngle = -105;
      let torsoRot = 0;
      let hipY = -32;

      if (t < 0.25) {
        const p = t / 0.25;
        legAngle = 195 + p * 55; // huge backward pull
        footAngle = -105 - p * 30;
        torsoRot = -p * 22; // leaning back to coil power
        hipY = -30 + p * 4;
      } else if (t < 0.65) {
        const p = (t - 0.25) / 0.4;
        const ease = Math.sin(p * Math.PI * 0.5);
        legAngle = 250 - ease * 180; // explosive whip to 70°!
        footAngle = -135 + ease * 145;
        torsoRot = -22 + ease * 36; // chest driving over ball
        hipY = -26 - ease * 8;
      } else {
        const p = (t - 0.65) / 0.35;
        legAngle = 70 + p * 125;
        footAngle = 10 - p * 115;
        torsoRot = 14 - p * 14;
        hipY = -34 + p * 2;
      }

      return {
        hipY,
        torsoRot,
        headRot: -torsoRot * 0.7,
        headScaleX: 1.05,
        headScaleY: 0.95,
        hairRot: 65,
        legFrontRot: legAngle,
        footFrontRot: footAngle,
        legBackRot: 145,
        footBackRot: -60,
        armFrontRot: 165 - (t * 60),
        armBackRot: -155 + (t * 60),
        face: 'strain'
      };
    }
  },

  scorpion_kick: {
    name: 'scorpion_kick',
    duration: 0.42,
    loop: false,
    evaluate: (t) => {
      // Acrobatic back heel flip over head!
      const arc = Math.sin(t * Math.PI);
      const heelSnap = t > 0.35 && t < 0.75 ? 1.0 : 0.0;
      return {
        hipY: -32 - arc * 40,
        torsoRot: 45 * arc, // chest arched downward
        headRot: -30 * arc, // looking back over shoulder
        headScaleX: 1.06,
        headScaleY: 0.94,
        hairRot: 25 - arc * 30,
        legFrontRot: 195 + heelSnap * 95, // heels flipping backward over back!
        footFrontRot: -105 + heelSnap * 90,
        legBackRot: 165 + arc * 60,
        footBackRot: -75 + arc * 45,
        armFrontRot: 135 - arc * 55,
        armBackRot: -135 + arc * 55,
        face: 'strain'
      };
    }
  },

  smash_header: {
    name: 'smash_header',
    duration: 0.32,
    loop: false,
    evaluate: (t) => {
      // Violent downward spiking header smash!
      const snap = Math.sin(t * Math.PI);
      return {
        hipY: -32 - snap * 24,
        torsoRot: -15 + snap * 45, // powerful torso whip forward
        headRot: -20 + snap * 55,  // forehead lunging downwards into ball
        headScaleX: 1.12,
        headScaleY: 0.9,
        hairRot: 75,
        legFrontRot: 195 - snap * 40,
        footFrontRot: -105 + snap * 30,
        legBackRot: 165 - snap * 25,
        footBackRot: -75 + snap * 20,
        armFrontRot: 125 + snap * 60,
        armBackRot: -145 - snap * 60,
        face: 'strain'
      };
    }
  }
};
