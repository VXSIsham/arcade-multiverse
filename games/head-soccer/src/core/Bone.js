/**
 * Class representing a 2D Bone node in a Forward Kinematics (FK) skeletal rig.
 * Compatible with Spine 2D and DragonBones transformation matrices.
 */
export class Bone {
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
