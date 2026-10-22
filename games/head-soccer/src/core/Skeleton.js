import { Bone } from './Bone.js';

/**
 * Head Soccer Skeletal Rig.
 * Proportions calibrated to the authentic D&D Dream 1.4:1 Chibi Caricature ratio.
 */
export class Skeleton {
  constructor() {
    // Root at pitch touchline level
    this.root = new Bone('root', null, 0, 0, 0, 0);

    // Hip / Pelvis: base of shorts
    this.hip = new Bone('hip', this.root, 24, 0, -32, -90);

    // Torso: compact jersey #10 (pointing straight up)
    this.torso = new Bone('torso', this.hip, 26, 24, 0, 0);

    // Head: rests directly on the jersey collar
    this.head = new Bone('head', this.torso, 36, 24, 0, 0, 1.0, 1.0);

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
