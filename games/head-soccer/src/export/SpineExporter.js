/**
 * Generates official Spine 3.8 / 4.0 JSON format for export into Spine Editor, Unity, or Godot.
 */
export class SpineExporter {
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
