/**
 * Head Soccer Arcade Super Power System.
 * Automatically builds up Power (0-100%) during match play, hits, and passive time.
 * Unleashes instant devastating Super Shots without slow charging delays.
 */
export class PowerSystem {
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
