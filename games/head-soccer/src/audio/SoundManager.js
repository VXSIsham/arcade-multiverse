/**
 * Web Audio API procedural sound effects synthesizer. Zero external assets needed.
 */
export class SoundManager {
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
