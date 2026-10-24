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
        } else if (e.code === 'KeyY' || e.code === 'Numpad3' || e.code === 'KeyM') {
          e.preventDefault();
          this.vibrate(20);
          this.emitP2Action('taunt');
          return;
        }
      }

      // === PLAYER 1 CONTROLS ===
      if (e.code === 'Space' || e.code === 'KeyJ' || e.code === 'KeyX') {
        e.preventDefault();
        this.startKickCharge();
      } else if (e.code === 'KeyT') {
        e.preventDefault();
        this.vibrate(20);
        this.emitAction('taunt');
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
