/**
 * Manages player keyboard input, mobile multi-touch controls, and interactive ball drag physics.
 * Pure arcade responsiveness with instantaneous strikes, jumps, directional sprint, and tactile haptics.
 */
export class InputManager {
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
    this.setupListeners();
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

  onAction(fn) {
    this.onActionCallbacks.push(fn);
  }

  isKeyDown(key) {
    const k = key.toLowerCase();
    if (k === 'a' || k === 'arrowleft') {
      return !!this.keys[k] || this.touchMoves.left;
    }
    if (k === 'd' || k === 'arrowright') {
      return !!this.keys[k] || this.touchMoves.right;
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
      } else if (e.code === 'KeyW' || e.code === 'ArrowUp') {
        e.preventDefault();
        this.vibrate(15);
        this.emitAction('jump');
      } else if (e.code === 'KeyS' || e.code === 'ArrowDown' || e.code === 'KeyC') {
        e.preventDefault();
        this.vibrate(20);
        this.emitAction('dash');
      } else if (e.code === 'KeyF' || e.code === 'KeyK' || e.code === 'KeyZ' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
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

  emitAction(actionName) {
    this.onActionCallbacks.forEach(fn => fn(actionName));
  }
}
