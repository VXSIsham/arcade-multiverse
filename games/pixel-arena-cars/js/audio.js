// Motor de Audio Arcade 16-Bit & Secuenciador Chiptune en Tiempo Real (Web Audio API)

class RetroAudio {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.musicEnabled = true;
        this.musicInterval = null;
        this.stepIndex = 0;
        this.fastTempo = false;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        if (this.musicEnabled && !this.musicInterval) {
            this.startMusic();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.muted) {
            this.stopMusic();
        } else if (this.musicEnabled) {
            this.startMusic();
        }
        return this.muted;
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (!this.musicEnabled) {
            this.stopMusic();
        } else if (!this.muted) {
            this.init();
            this.startMusic();
        }
        return this.musicEnabled;
    }

    setSuddenDeathTempo(fast) {
        if (this.fastTempo === fast) return;
        this.fastTempo = fast;
        if (this.musicInterval) {
            this.stopMusic();
            this.startMusic();
        }
    }

    startMusic() {
        if (this.muted || !this.musicEnabled) return;
        this.stopMusic();

        // Línea de bajo y melodía arcade energética estilo Drive Ahead!
        const bassNotes = [
            110, 110, 130.81, 146.83, 110, 110, 164.81, 146.83,
            98, 98, 130.81, 146.83, 130.81, 123.47, 110, 98
        ];
        const leadNotes = [
            440, 0, 523.25, 587.33, 659.25, 0, 587.33, 523.25,
            392, 0, 440, 523.25, 587.33, 523.25, 440, 392
        ];

        const stepMs = this.fastTempo ? 115 : 150;

        this.musicInterval = setInterval(() => {
            if (this.muted || !this.musicEnabled || !this.ctx || this.ctx.state !== 'running') return;

            const idx = this.stepIndex % bassNotes.length;
            const bass = bassNotes[idx];
            const lead = leadNotes[idx];

            // Bajo synth
            if (bass > 0) {
                this.playTone(bass * (this.fastTempo ? 1.12 : 1), 'triangle', 0.11, 0.045);
            }
            // Melodía chiptune
            if (lead > 0 && (this.stepIndex % 2 === 0 || this.fastTempo)) {
                this.playTone(lead * (this.fastTempo ? 1.12 : 1), 'square', 0.08, 0.025);
            }
            // Percusión hi-hat / snare pixel
            if (this.stepIndex % 4 === 2) {
                this.playNoise(0.04, 0.03, 1800);
            }

            this.stepIndex++;
        }, stepMs);
    }

    stopMusic() {
        if (this.musicInterval) {
            clearInterval(this.musicInterval);
            this.musicInterval = null;
        }
    }

    playTone(freq, type, duration, vol = 0.15, slideFreq = null) {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(Math.max(20, freq), now);
        if (slideFreq) {
            osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideFreq), now + duration);
        }
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + duration);
    }

    playNoise(duration, vol = 0.25, filterFreq = 800) {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const bufferSize = Math.max(1, Math.floor(this.ctx.sampleRate * duration));
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(filterFreq, now);
        filter.frequency.exponentialRampToValueAtTime(75, now + duration);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(now);
        noise.stop(now + duration);
    }

    bump(intensity = 1) {
        this.init();
        const vol = Math.min(0.24, 0.065 * intensity);
        this.playTone(130 + Math.random() * 65, 'square', 0.08, vol, 42);
        this.playNoise(0.07, vol * 0.85, 650);
    }

    sawHit() {
        this.init();
        this.playTone(420, 'sawtooth', 0.14, 0.18, 160);
        this.playNoise(0.12, 0.2, 2200);
    }

    cannonFire() {
        this.init();
        this.playNoise(0.22, 0.3, 950);
        this.playTone(150, 'sawtooth', 0.2, 0.22, 38);
    }

    waterSplash() {
        this.init();
        this.playNoise(0.28, 0.22, 1200);
        this.playTone(260, 'sine', 0.18, 0.1, 90);
    }

    stuntFlip() {
        this.init();
        this.playTone(587.33, 'square', 0.08, 0.12, 880);
        setTimeout(() => this.playTone(880, 'square', 0.12, 0.14, 1174.66), 65);
    }

    coinDing() {
        this.init();
        this.playTone(987.77, 'square', 0.07, 0.12);
        setTimeout(() => this.playTone(1318.51, 'square', 0.16, 0.14), 60);
    }

    cameraShutter() {
        this.init();
        this.playNoise(0.05, 0.22, 3200);
        setTimeout(() => this.playTone(1400, 'sine', 0.04, 0.12, 600), 35);
    }

    engineTick(speedRatio = 0.5) {
        if (this.muted || !this.ctx || Math.random() > 0.32) return;
        const freq = 52 + speedRatio * 98;
        this.playTone(freq, 'sawtooth', 0.038, 0.022, freq * 0.88);
    }

    koExplosion() {
        this.init();
        this.playNoise(0.6, 0.42, 1600);
        this.playTone(190, 'sawtooth', 0.48, 0.28, 25);
        setTimeout(() => this.playTone(95, 'square', 0.38, 0.22, 20), 75);
    }

    starWin() {
        this.init();
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((n, idx) => {
            setTimeout(() => this.playTone(n, 'square', 0.13, 0.14), idx * 65);
        });
    }

    matchVictory() {
        this.init();
        const melody = [
            [523.25, 0.11], [659.25, 0.11], [783.99, 0.11], [1046.5, 0.22],
            [783.99, 0.11], [1046.5, 0.38]
        ];
        let delay = 0;
        melody.forEach(([freq, dur]) => {
            setTimeout(() => this.playTone(freq, 'square', dur, 0.18), delay * 1000);
            delay += dur * 0.92;
        });
    }

    suddenDeathSiren() {
        this.init();
        this.playTone(440, 'sawtooth', 0.24, 0.18, 880);
        setTimeout(() => this.playTone(880, 'sawtooth', 0.26, 0.18, 440), 250);
    }

    countdownBeep(high = false) {
        this.init();
        this.playTone(high ? 880 : 440, 'square', high ? 0.22 : 0.11, 0.14);
    }

    gachaTick(pitch = 1) {
        this.init();
        this.playTone(360 * pitch, 'triangle', 0.05, 0.12);
    }
}

window.retroAudio = new RetroAudio();
