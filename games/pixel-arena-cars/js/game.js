// Controlador Principal del Juego — PIXEL ARENA CARS: EDICIÓN COMERCIAL COMPLETA

class PixelArenaGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        this.width = 960;
        this.height = 560;

        // Configuración de partida y modos
        this.mode = 'cpu'; // 'cpu' | '2p' | 'koth' | 'mission'
        this.activeMission = null;
        this.p1CarChoice = 'random';
        this.p2CarChoice = 'random';
        this.arenaChoice = 'spinning_wheel';

        this.scores = { 1: 0, 2: 0 };
        this.targetStars = 5;
        this.kothStreak = 0;
        this.roundNumber = 1;

        this.state = 'MENU'; // 'MENU' | 'PLAYING' | 'KO_SLOWMO' | 'MATCH_OVER'
        this.roundTimer = 0;
        this.lastCountdownSec = -1;
        this.slowmoTimer = 0;
        this.koFocus = { x: 480, y: 280 };
        this.shakeIntensity = 0;
        this.flashAlpha = 0;

        this.arena = new window.ArenaInstance('spinning_wheel', this.width, this.height);
        this.cars = [];
        this.projectiles = [];
        this.particles = [];
        this.floatingTexts = [];

        this.keys = {};
        this.touchInputs = { p1: 0, p2: 0 };

        this.setupInputs();
        this.setupMenuUI();
        this.refreshCoinsUI();
        this.spawnPreviewDemo();

        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.loop(t));
    }

    setupInputs() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) {
                if (this.state === 'PLAYING') e.preventDefault();
            }
            if (e.code === 'KeyR' && this.state === 'PLAYING') {
                this.startRound();
            }
            if (e.code === 'Escape' && this.state === 'PLAYING') {
                this.showMenu();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        const bindTouch = (btnId, player, dir) => {
            const btn = document.getElementById(btnId);
            if (!btn) return;
            const setVal = (v, ev) => {
                if (ev) ev.preventDefault();
                this.touchInputs[player] = v;
                btn.classList.toggle('active', v !== 0);
                if (v !== 0) {
                    try { if (navigator.vibrate) navigator.vibrate(10); } catch (err) {}
                }
            };
            btn.addEventListener('mousedown', (e) => setVal(dir, e));
            btn.addEventListener('mouseup', (e) => setVal(0, e));
            btn.addEventListener('mouseleave', (e) => setVal(0, e));
            btn.addEventListener('pointerdown', (e) => {
                try { btn.setPointerCapture(e.pointerId); } catch (err) {}
                setVal(dir, e);
            });
            btn.addEventListener('pointerup', (e) => setVal(0, e));
            btn.addEventListener('pointercancel', (e) => setVal(0, e));
            btn.addEventListener('touchstart', (e) => setVal(dir, e), { passive: false });
            btn.addEventListener('touchend', (e) => setVal(0, e), { passive: false });
            btn.addEventListener('touchcancel', (e) => setVal(0, e), { passive: false });
        };

        bindTouch('btn-p1-left', 'p1', -1);
        bindTouch('btn-p1-right', 'p1', 1);
        bindTouch('btn-p2-left', 'p2', -1);
        bindTouch('btn-p2-right', 'p2', 1);
    }

    setupMenuUI() {
        this.populateSelectDropdowns();

        // Selector de Modo Principal
        document.querySelectorAll('.mode-btn[data-mode]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.mode-btn[data-mode]').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.mode = btn.dataset.mode;

                if (this.mode === 'mission') {
                    this.openMissionsModal();
                }
            });
        });

        // Botón JUGAR AHORA
        const startBtn = document.getElementById('btnStartMatch');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                window.retroAudio.init();
                const p1Select = document.getElementById('p1CarSelect');
                const p2Select = document.getElementById('p2CarSelect');
                const arenaSelect = document.getElementById('arenaSelect');
                this.p1CarChoice = p1Select ? p1Select.value : 'random';
                this.p2CarChoice = p2Select ? p2Select.value : 'random';
                this.arenaChoice = arenaSelect ? arenaSelect.value : 'spinning_wheel';
                if (this.mode === 'mission' && !this.activeMission) {
                    this.openMissionsModal();
                    return;
                }
                this.startMatch();
            });
        }

        // Botón Abrir Garaje / Ruleta
        const garageBtn = document.getElementById('btnOpenGarage');
        if (garageBtn) {
            garageBtn.addEventListener('click', () => {
                window.retroAudio.init();
                this.openGarageModal();
            });
        }

        const closeGarageBtn = document.getElementById('btnCloseGarage');
        if (closeGarageBtn) {
            closeGarageBtn.addEventListener('click', () => {
                document.getElementById('garageModal').classList.add('hidden');
                this.populateSelectDropdowns();
            });
        }

        // Botón Abrir Misiones
        const missionsBtn = document.getElementById('btnOpenMissions');
        if (missionsBtn) {
            missionsBtn.addEventListener('click', () => {
                window.retroAudio.init();
                this.openMissionsModal();
            });
        }

        const closeMissionsBtn = document.getElementById('btnCloseMissions');
        if (closeMissionsBtn) {
            closeMissionsBtn.addEventListener('click', () => {
                document.getElementById('missionsModal').classList.add('hidden');
            });
        }

        // Botón Máquina de Premios (Gacha 100 monedas)
        const gachaBtn = document.getElementById('btnRollGacha');
        if (gachaBtn) {
            gachaBtn.addEventListener('click', () => this.rollPrizeMachine());
        }

        // Botón Desbloquear Todo (Modo Arcade Libre)
        const unlockAllBtn = document.getElementById('btnToggleUnlockAll');
        if (unlockAllBtn) {
            unlockAllBtn.addEventListener('click', () => {
                const active = window.gameStorage.toggleUnlockAll();
                unlockAllBtn.textContent = active
                    ? '✅ MODO ARCADE LIBRE: TODO DESBLOQUEADO'
                    : '🔓 ACTIVAR MODO LIBRE (DESBLOQUEAR TODO)';
                window.retroAudio.starWin();
                this.renderGarageItems();
                this.populateSelectDropdowns();
            });
        }

        // Botones del HUD superior
        const quickArenaBtn = document.getElementById('btnNextArena');
        if (quickArenaBtn) {
            quickArenaBtn.addEventListener('click', () => {
                const idx = window.ARENA_CATALOG.findIndex(a => a.id === this.arena.id);
                const next = window.ARENA_CATALOG[(idx + 1) % window.ARENA_CATALOG.length];
                this.arenaChoice = next.id;
                this.startRound();
            });
        }

        const menuBtn = document.getElementById('btnBackMenu');
        if (menuBtn) {
            menuBtn.addEventListener('click', () => this.showMenu());
        }

        const rematchBtn = document.getElementById('btnRematch');
        if (rematchBtn) {
            rematchBtn.addEventListener('click', () => {
                document.getElementById('victoryModal').classList.add('hidden');
                this.startMatch();
            });
        }

        const victoryMenuBtn = document.getElementById('btnVictoryMenu');
        if (victoryMenuBtn) {
            victoryMenuBtn.addEventListener('click', () => {
                document.getElementById('victoryModal').classList.add('hidden');
                this.showMenu();
            });
        }

        const muteBtn = document.getElementById('btnMute');
        if (muteBtn) {
            muteBtn.addEventListener('click', () => {
                const muted = window.retroAudio.toggleMute();
                muteBtn.textContent = muted ? '🔇 AUDIO OFF' : '🔊 AUDIO ON';
            });
        }
    }

    populateSelectDropdowns() {
        const p1Select = document.getElementById('p1CarSelect');
        const p2Select = document.getElementById('p2CarSelect');
        const arenaSelect = document.getElementById('arenaSelect');

        if (p1Select && p2Select) {
            const prev1 = p1Select.value || 'random';
            const prev2 = p2Select.value || 'random';
            p1Select.innerHTML = '<option value="random">🎲 ALEATORIO EN CADA RONDA</option>';
            p2Select.innerHTML = '<option value="random">🎲 ALEATORIO EN CADA RONDA</option>';

            window.VEHICLE_CATALOG.forEach(v => {
                const unlocked = window.gameStorage.isCarUnlocked(v.id);
                const opt1 = document.createElement('option');
                opt1.value = v.id;
                opt1.disabled = !unlocked;
                opt1.textContent = unlocked
                    ? `${v.name} [${v.tier}] — ${v.special}`
                    : `🔒 ${v.name} (Desbloquear en Garaje)`;
                p1Select.appendChild(opt1);

                const opt2 = document.createElement('option');
                opt2.value = v.id;
                opt2.textContent = `${v.name} [${v.tier}] — ${v.special}`;
                p2Select.appendChild(opt2);
            });

            p1Select.value = prev1;
            p2Select.value = prev2;
        }

        if (arenaSelect && arenaSelect.options.length <= 1) {
            window.ARENA_CATALOG.forEach(a => {
                const opt = document.createElement('option');
                opt.value = a.id;
                opt.textContent = `${a.name} — ${a.subtitle}`;
                arenaSelect.appendChild(opt);
            });
            arenaSelect.value = 'spinning_wheel';
        }
    }

    refreshCoinsUI() {
        const c1 = document.getElementById('hudCoins');
        const c2 = document.getElementById('garageCoins');
        const coins = window.gameStorage.data.coins;
        if (c1) c1.textContent = `🪙 ${coins}`;
        if (c2) c2.textContent = `🪙 ${coins}`;
    }

    openGarageModal() {
        this.refreshCoinsUI();
        this.renderGarageItems();
        const unlockAllBtn = document.getElementById('btnToggleUnlockAll');
        if (unlockAllBtn) {
            unlockAllBtn.textContent = window.gameStorage.data.freePlayUnlockAll
                ? '✅ MODO ARCADE LIBRE: TODO DESBLOQUEADO'
                : '🔓 ACTIVAR MODO LIBRE (DESBLOQUEAR TODO)';
        }
        document.getElementById('garageModal').classList.remove('hidden');
    }

    renderGarageItems() {
        const carsGrid = document.getElementById('garageCarsGrid');
        const helmetsGrid = document.getElementById('garageHelmetsGrid');
        if (!carsGrid || !helmetsGrid) return;

        carsGrid.innerHTML = '';
        window.VEHICLE_CATALOG.forEach(v => {
            const unlocked = window.gameStorage.isCarUnlocked(v.id);
            const card = document.createElement('div');
            card.className = 'garage-item-card ' + (unlocked ? 'unlocked' : 'locked');
            card.innerHTML = `
                <div class="tier-pill tier-${v.tier.toLowerCase()}">${v.tier}</div>
                <div class="item-title">${v.name}</div>
                <div class="item-special">⚡ ${v.special}</div>
                <div class="stat-bars">
                    <div>VEL: ${'▮'.repeat(Math.round(v.speed * 4))}</div>
                    <div>PESO: ${'▮'.repeat(Math.round(v.mass * 3))}</div>
                </div>
                <button class="item-action-btn">${unlocked ? '✅ USAR CON J1' : `🔓 COMPRAR (${v.cost} 🪙)`}</button>
            `;
            card.querySelector('button').addEventListener('click', () => {
                if (unlocked) {
                    this.p1CarChoice = v.id;
                    const p1Select = document.getElementById('p1CarSelect');
                    if (p1Select) p1Select.value = v.id;
                    window.retroAudio.coinDing();
                    document.getElementById('garageModal').classList.add('hidden');
                } else if (window.gameStorage.data.coins >= v.cost) {
                    window.gameStorage.addCoins(-v.cost);
                    window.gameStorage.unlockCar(v.id);
                    window.retroAudio.starWin();
                    this.refreshCoinsUI();
                    this.renderGarageItems();
                } else {
                    window.retroAudio.bump(1.5);
                }
            });
            carsGrid.appendChild(card);
        });

        helmetsGrid.innerHTML = '';
        window.HELMET_CATALOG.forEach(h => {
            const unlocked = window.gameStorage.isHelmetUnlocked(h.id);
            const isSelected = window.gameStorage.data.selectedP1Helmet === h.id;
            const card = document.createElement('div');
            card.className = 'garage-item-card ' + (unlocked ? 'unlocked' : 'locked') + (isSelected ? ' equipped' : '');
            card.innerHTML = `
                <div class="item-title">🪖 ${h.name}</div>
                <div class="item-special">${h.desc}</div>
                <button class="item-action-btn">${
                    isSelected ? '⭐ EQUIPADO' : (unlocked ? 'EQUIPAR' : `🔓 ${h.cost} 🪙`)
                }</button>
            `;
            card.querySelector('button').addEventListener('click', () => {
                if (unlocked) {
                    window.gameStorage.data.selectedP1Helmet = h.id;
                    window.gameStorage.save();
                    window.retroAudio.coinDing();
                    this.renderGarageItems();
                } else if (window.gameStorage.data.coins >= h.cost) {
                    window.gameStorage.addCoins(-h.cost);
                    window.gameStorage.unlockHelmet(h.id);
                    window.gameStorage.data.selectedP1Helmet = h.id;
                    window.gameStorage.save();
                    window.retroAudio.starWin();
                    this.refreshCoinsUI();
                    this.renderGarageItems();
                } else {
                    window.retroAudio.bump(1.5);
                }
            });
            helmetsGrid.appendChild(card);
        });
    }

    rollPrizeMachine() {
        const cost = 100;
        const statusEl = document.getElementById('gachaResultText');
        if (window.gameStorage.data.coins < cost) {
            if (statusEl) statusEl.textContent = '❌ ¡Necesitas 100 🪙! Juega partidas o haz mortales para ganar monedas.';
            window.retroAudio.bump(1.5);
            return;
        }

        window.gameStorage.addCoins(-cost);
        this.refreshCoinsUI();

        // Buscar vehículos o cascos bloqueados
        const lockedCars = window.VEHICLE_CATALOG.filter(v => !window.gameStorage.isCarUnlocked(v.id));
        const lockedHelmets = window.HELMET_CATALOG.filter(h => !window.gameStorage.isHelmetUnlocked(h.id));

        let ticks = 0;
        const timer = setInterval(() => {
            ticks++;
            window.retroAudio.gachaTick(1 + ticks * 0.06);
            if (statusEl) statusEl.textContent = '🎰 Girando la Máquina de Premios...';
            if (ticks >= 10) {
                clearInterval(timer);
                if (lockedCars.length > 0 && (Math.random() < 0.65 || lockedHelmets.length === 0)) {
                    const prize = lockedCars[Math.floor(Math.random() * lockedCars.length)];
                    window.gameStorage.unlockCar(prize.id);
                    window.retroAudio.matchVictory();
                    if (statusEl) statusEl.textContent = `🎉 ¡NUEVO VEHÍCULO DESBLOQUEADO: ${prize.name}!`;
                } else if (lockedHelmets.length > 0) {
                    const prize = lockedHelmets[Math.floor(Math.random() * lockedHelmets.length)];
                    window.gameStorage.unlockHelmet(prize.id);
                    window.retroAudio.matchVictory();
                    if (statusEl) statusEl.textContent = `🎉 ¡NUEVO CASCO DESBLOQUEADO: ${prize.name}!`;
                } else {
                    window.gameStorage.addCoins(160);
                    window.retroAudio.starWin();
                    if (statusEl) statusEl.textContent = '💰 ¡Ya tienes todo! Premio Jackpot: +160 🪙';
                }
                this.refreshCoinsUI();
                this.renderGarageItems();
            }
        }, 75);
    }

    openMissionsModal() {
        const list = document.getElementById('missionsGrid');
        if (!list) return;
        list.innerHTML = '';

        window.MISSIONS_CATALOG.forEach(m => {
            const done = window.gameStorage.data.completedMissions.includes(m.id);
            const card = document.createElement('div');
            card.className = 'mission-card ' + (done ? 'completed' : '');
            card.innerHTML = `
                <div class="mission-header">
                    <span class="mission-title">${done ? '✅ ' : '🎯 '}${m.title}</span>
                    <span class="mission-reward">+${m.reward} 🪙</span>
                </div>
                <p class="mission-desc">${m.desc}</p>
                <div class="mission-footer">
                    <span class="diff-badge">${m.difficulty} • Meta: ${m.targetStars} ★</span>
                    <button class="hud-btn">⚡ JUGAR MISIÓN</button>
                </div>
            `;
            card.querySelector('button').addEventListener('click', () => {
                this.mode = 'mission';
                this.activeMission = m;
                this.p1CarChoice = m.p1Car;
                this.p2CarChoice = m.p2Car;
                this.arenaChoice = m.arena;
                document.getElementById('missionsModal').classList.add('hidden');
                this.startMatch();
            });
            list.appendChild(card);
        });

        document.getElementById('missionsModal').classList.remove('hidden');
    }

    showMenu() {
        this.state = 'MENU';
        window.retroAudio.setSuddenDeathTempo(false);
        document.getElementById('menuOverlay').classList.remove('hidden');
        document.getElementById('victoryModal').classList.add('hidden');
        document.getElementById('koPolaroid').classList.add('hidden');
        this.populateSelectDropdowns();
        this.refreshCoinsUI();
        this.spawnPreviewDemo();
    }

    spawnPreviewDemo() {
        this.arena = new window.ArenaInstance('spinning_wheel', this.width, this.height);
        const spawns = this.arena.getSpawnPositions();
        const s1 = window.VEHICLE_CATALOG[0];
        const s2 = window.VEHICLE_CATALOG[5];
        this.cars = [
            new window.PhysicsCar(1, s1, spawns.p1.x, spawns.p1.y, 1, 'crown'),
            new window.PhysicsCar(2, s2, spawns.p2.x, spawns.p2.y, -1, 'skull')
        ];
        this.projectiles = [];
    }

    pickVehicle(choice, forPlayer1 = false) {
        if (choice === 'random') {
            const pool = forPlayer1
                ? window.VEHICLE_CATALOG.filter(v => window.gameStorage.isCarUnlocked(v.id))
                : window.VEHICLE_CATALOG;
            const list = pool.length > 0 ? pool : window.VEHICLE_CATALOG;
            return list[Math.floor(Math.random() * list.length)];
        }
        return window.VEHICLE_CATALOG.find(v => v.id === choice) || window.VEHICLE_CATALOG[0];
    }

    pickArena(choice) {
        if (choice === 'random') {
            const idx = Math.floor(Math.random() * window.ARENA_CATALOG.length);
            return window.ARENA_CATALOG[idx].id;
        }
        return choice;
    }

    startMatch() {
        this.scores = { 1: 0, 2: 0 };
        this.kothStreak = 0;
        this.roundNumber = 1;
        this.targetStars = (this.mode === 'mission' && this.activeMission) ? this.activeMission.targetStars : 5;

        this.updateScoreboardUI();
        document.getElementById('menuOverlay').classList.add('hidden');
        document.getElementById('victoryModal').classList.add('hidden');
        document.getElementById('koPolaroid').classList.add('hidden');

        const p2Touch = document.getElementById('touch-p2-group');
        const touchBar = document.querySelector('.touch-controls-bar');
        if (p2Touch) {
            p2Touch.style.display = this.mode === '2p' ? 'flex' : 'none';
        }
        if (touchBar) {
            touchBar.classList.toggle('mode-2p', this.mode === '2p');
        }

        const p2Label = document.getElementById('p2LabelTag');
        if (p2Label) {
            if (this.mode === 'koth') p2Label.textContent = `RACHA REY: ${this.kothStreak} 👑`;
            else if (this.mode === '2p') p2Label.textContent = 'J2 ROJO';
            else if (this.mode === 'mission' && this.activeMission) p2Label.textContent = 'JEFE MISIÓN';
            else p2Label.textContent = 'CPU ROJO';
        }

        this.startRound();
    }

    startRound() {
        window.retroAudio.setSuddenDeathTempo(false);
        document.getElementById('koPolaroid').classList.add('hidden');

        const arenaId = this.pickArena(this.arenaChoice);
        this.arena = new window.ArenaInstance(arenaId, this.width, this.height);
        const spawns = this.arena.getSpawnPositions();

        const spec1 = this.pickVehicle(this.p1CarChoice, true);
        const spec2 = this.pickVehicle(this.p2CarChoice, false);
        const h1 = window.gameStorage.data.selectedP1Helmet || 'classic';
        const h2 = this.mode === '2p' ? 'astro' : 'skull';

        this.cars = [
            new window.PhysicsCar(1, spec1, spawns.p1.x, spawns.p1.y, spawns.p1.dir, h1),
            new window.PhysicsCar(2, spec2, spawns.p2.x, spawns.p2.y, spawns.p2.dir, h2)
        ];

        this.projectiles = [];
        this.particles = [];
        this.floatingTexts = [];
        this.roundTimer = 0;
        this.lastCountdownSec = -1;
        this.state = 'PLAYING';

        const subText = this.mode === 'koth'
            ? `¡Sobrevive a las oleadas infinitas! Récord: ${window.gameStorage.data.kothBestStreak} 👑`
            : `${spec1.name} vs ${spec2.name}`;
        this.showBanner(`${this.arena.meta.name}`, subText, '#ffd600', 1450);
        window.retroAudio.countdownBeep(true);

        const arenaLabel = document.getElementById('hudArenaName');
        if (arenaLabel) arenaLabel.textContent = this.arena.meta.name;
    }

    spawnKothChallenger() {
        const spawns = this.arena.getSpawnPositions();
        const spec = this.pickVehicle('random', false);
        const side = Math.random() < 0.5 ? spawns.p2 : spawns.p1;
        const newCar = new window.PhysicsCar(
            2,
            spec,
            side.x + (Math.random() - 0.5) * 40,
            side.y - 60,
            side.dir,
            'skull'
        );
        this.cars.push(newCar);
        this.addFloatingText(newCar.x, newCar.y - 40, `¡ENTRA ${spec.name}!`, '#ff5252');
    }

    showBanner(title, subtitle = '', color = '#ffd600', duration = 1400) {
        const banner = document.getElementById('roundBanner');
        const bTitle = document.getElementById('bannerTitle');
        const bSub = document.getElementById('bannerSub');
        if (!banner || !bTitle || !bSub) return;

        bTitle.textContent = title;
        bTitle.style.color = color;
        bSub.textContent = subtitle;
        banner.classList.remove('hidden');

        if (this.bannerTimeout) clearTimeout(this.bannerTimeout);
        this.bannerTimeout = setTimeout(() => {
            banner.classList.add('hidden');
        }, duration);
    }

    addFloatingText(x, y, text, color = '#ffd600') {
        this.floatingTexts.push({
            x,
            y,
            text,
            color,
            life: 1.0
        });
    }

    updateScoreboardUI() {
        for (const p of [1, 2]) {
            const container = document.getElementById(`p${p}Stars`);
            if (!container) continue;
            container.innerHTML = '';
            if (this.mode === 'koth' && p === 2) {
                continue;
            }
            for (let i = 0; i < this.targetStars; i++) {
                const span = document.createElement('span');
                span.className = 'star ' + (i < this.scores[p] ? 'earned' : '');
                span.textContent = '★';
                container.appendChild(span);
            }
        }
    }

    readPlayerInputs() {
        if (this.cars.length === 0) return;
        const c1 = this.cars[0];

        if (this.state === 'MENU') {
            for (let i = 0; i < this.cars.length; i++) {
                const other = this.cars[(i + 1) % this.cars.length];
                this.cars[i].input = this.computeAIInput(this.cars[i], other);
            }
            return;
        }

        let p1 = this.touchInputs.p1;
        if (this.keys['KeyA']) p1 = -1;
        if (this.keys['KeyD']) p1 = 1;
        if (this.mode !== '2p') {
            if (this.keys['ArrowLeft']) p1 = -1;
            if (this.keys['ArrowRight']) p1 = 1;
        }
        c1.input = p1;

        for (let i = 1; i < this.cars.length; i++) {
            const enemy = this.cars[i];
            if (this.mode === '2p' && i === 1) {
                let p2 = this.touchInputs.p2;
                if (this.keys['ArrowLeft'] || this.keys['KeyJ']) p2 = -1;
                if (this.keys['ArrowRight'] || this.keys['KeyL']) p2 = 1;
                enemy.input = p2;
            } else {
                enemy.input = this.computeAIInput(enemy, c1);
            }
        }
    }

    computeAIInput(aiCar, targetCar) {
        if (aiCar.dead) return 0;

        let normAngle = ((aiCar.angle + Math.PI) % (Math.PI * 2));
        if (normAngle < 0) normAngle += Math.PI * 2;
        normAngle -= Math.PI;

        // 1. Si está muy inclinado o en el aire a punto de volcar, enderezarse con el torque correcto
        if (Math.abs(normAngle) > 0.65) {
            return normAngle > 0 ? 1 : -1;
        }

        // 2. Evitar caer a los bordes en arenas abiertas
        if (['seesaw_lava', 'twin_gears', 'suspension_bridge', 'ice_glacier', 'pirate_galleon'].includes(this.arena.id)) {
            const distFromCenter = aiCar.x - this.width * 0.5;
            if (Math.abs(distFromCenter) > 275) {
                return distFromCenter > 0 ? -1 : 1;
            }
        }

        // 3. Embestir al jugador y alternar pulso rápido a corta distancia para levantar caballito (wheelie)
        const dx = targetCar.x - aiCar.x;
        if (Math.abs(dx) < 110 && Math.floor(this.arena.time) % 18 < 4) {
            return dx > 0 ? -1 : 1;
        }
        return dx > 0 ? 1 : -1;
    }

    spawnParticles(x, y, count, colors, speed = 6, size = 5) {
        for (let i = 0; i < count; i++) {
            const a = Math.random() * Math.PI * 2;
            const s = (0.3 + Math.random() * 0.9) * speed;
            this.particles.push({
                x,
                y,
                vx: Math.cos(a) * s,
                vy: Math.sin(a) * s - 1.5,
                size: Math.max(3, Math.round(size * (0.6 + Math.random() * 0.7))),
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1.0,
                decay: 0.02 + Math.random() * 0.025
            });
        }
    }

    handleImpact(x, y, intensity, sparks = false) {
        this.shakeIntensity = Math.min(15, this.shakeIntensity + intensity * 2.4);
        if (sparks) {
            this.spawnParticles(x, y, Math.min(15, Math.ceil(intensity * 5)), ['#ffd600', '#ff9100', '#ffffff'], 6.5, 4);
            window.retroAudio.bump(intensity);
        }
    }

    handleStuntFlip(car, isBackflip) {
        if (this.state !== 'PLAYING') return;
        const label = isBackflip ? '¡MORTAL ATRÁS!' : '¡MORTAL ADELANTE!';
        window.retroAudio.stuntFlip();
        this.spawnParticles(car.x, car.y, 14, ['#00e5ff', '#ffd600', '#ffffff'], 5, 4);

        if (car.playerNum === 1) {
            window.gameStorage.addCoins(15);
            window.gameStorage.data.totalFlips++;
            window.gameStorage.save();
            this.refreshCoinsUI();
            this.addFloatingText(car.x, car.y - 35, `${label} +15🪙`, '#00e5ff');
        } else {
            this.addFloatingText(car.x, car.y - 35, `${label} ¡TURBO!`, '#ffea00');
        }
    }

    captureKOPolaroid(hitX, hitY, reason) {
        const polaroidBox = document.getElementById('koPolaroid');
        const polaroidCanvas = document.getElementById('polaroidCanvas');
        const polaroidCaption = document.getElementById('polaroidCaption');
        if (!polaroidBox || !polaroidCanvas) return;

        const pCtx = polaroidCanvas.getContext('2d');
        pCtx.imageSmoothingEnabled = false;

        // Recortar la zona del impacto del canvas principal
        const cropW = 240;
        const cropH = 150;
        const sx = Math.max(0, Math.min(this.width - cropW, hitX - cropW * 0.5));
        const sy = Math.max(0, Math.min(this.height - cropH, hitY - cropH * 0.5));

        pCtx.clearRect(0, 0, polaroidCanvas.width, polaroidCanvas.height);
        pCtx.drawImage(this.canvas, sx, sy, cropW, cropH, 0, 0, polaroidCanvas.width, polaroidCanvas.height);

        if (polaroidCaption) {
            polaroidCaption.textContent = `📸 ${reason}`;
        }
        polaroidBox.classList.remove('hidden');
        this.flashAlpha = 0.85;
        window.retroAudio.cameraShutter();
    }

    handleKO(victimCar, hitX, hitY, reason) {
        if (victimCar.dead) return;
        if (this.state !== 'PLAYING' && this.state !== 'MENU') return;

        victimCar.dead = true;
        victimCar.head.vx = (Math.random() - 0.5) * 11;
        victimCar.head.vy = -9.5;
        // Hacer que las ruedas salgan disparadas en el KO
        for (const w of victimCar.wheels) {
            w.vx += (Math.random() - 0.5) * 12;
            w.vy -= 5 + Math.random() * 5;
        }

        this.spawnParticles(hitX, hitY, 45, ['#ff1744', '#ff9100', '#ffea00', '#ffffff', '#263238'], 11.5, 7);
        this.shakeIntensity = 22;
        this.koFocus = { x: hitX, y: hitY };
        this.arena.crowdExcitement = 80;

        if (this.state === 'MENU') {
            setTimeout(() => {
                if (this.state === 'MENU') this.spawnPreviewDemo();
            }, 900);
            return;
        }

        // Modo Rey de la Colina (Oleadas Infinitas)
        if (this.mode === 'koth') {
            if (victimCar.playerNum !== 1) {
                // ¡Enemigo derrotado! Sube la racha y aparece otro sin cortar la ronda
                window.retroAudio.koExplosion();
                window.retroAudio.starWin();
                this.kothStreak++;
                window.gameStorage.addCoins(30);
                if (this.kothStreak > window.gameStorage.data.kothBestStreak) {
                    window.gameStorage.data.kothBestStreak = this.kothStreak;
                }
                window.gameStorage.save();
                this.refreshCoinsUI();

                const p2Label = document.getElementById('p2LabelTag');
                if (p2Label) p2Label.textContent = `RACHA REY: ${this.kothStreak} 👑`;
                this.addFloatingText(hitX, hitY - 25, `¡KO #${this.kothStreak}! +30🪙`, '#ffd600');

                setTimeout(() => {
                    this.cars = this.cars.filter(c => !c.dead);
                    if (this.state === 'PLAYING') {
                        this.spawnKothChallenger();
                        // A partir de racha 4, puede haber 2 rivales simultáneos
                        if (this.kothStreak >= 4 && this.cars.length < 3) {
                            this.spawnKothChallenger();
                        }
                    }
                }, 900);
                return;
            } else {
                // El Jugador 1 cayó en Rey de la Colina -> Fin de la racha
                window.retroAudio.koExplosion();
                this.captureKOPolaroid(hitX, hitY, reason);
                this.state = 'KO_SLOWMO';
                this.slowmoTimer = 95;
                this.scores[2] = this.targetStars; // Terminar partida mostrando récord
                this.showBanner('💥 ¡FIN DE LA RACHA!', `Derrotaste a ${this.kothStreak} rivales seguidos`, '#ff5252', 1900);
                return;
            }
        }

        // Modo Clásico / 2P / Misión
        window.retroAudio.koExplosion();
        this.captureKOPolaroid(hitX, hitY, reason);
        this.state = 'KO_SLOWMO';
        this.slowmoTimer = 95;

        const winnerNum = victimCar.playerNum === 1 ? 2 : 1;
        this.scores[winnerNum]++;
        this.updateScoreboardUI();

        if (winnerNum === 1) {
            window.gameStorage.addCoins(25);
            window.gameStorage.data.totalKOs++;
            window.gameStorage.save();
            this.refreshCoinsUI();
            this.addFloatingText(hitX, hitY - 30, '¡KO! +25🪙', '#ffd600');
        }

        const winnerName = winnerNum === 1
            ? '¡PUNTO AZUL (J1)!'
            : (this.mode === '2p' ? '¡PUNTO ROJO (J2)!' : '¡PUNTO RIVAL!');
        const winColor = winnerNum === 1 ? '#00e5ff' : '#ff5252';

        this.showBanner(winnerName, `¡${reason}!`, winColor, 1800);
        setTimeout(() => window.retroAudio.starWin(), 320);
    }

    checkMatchOver() {
        for (const p of [1, 2]) {
            if (this.scores[p] >= this.targetStars) {
                this.state = 'MATCH_OVER';
                window.retroAudio.setSuddenDeathTempo(false);
                window.retroAudio.matchVictory();

                const modal = document.getElementById('victoryModal');
                const title = document.getElementById('victoryTitle');
                const sub = document.getElementById('victorySub');

                if (modal && title && sub) {
                    if (this.mode === 'koth') {
                        title.textContent = `👑 RACHA FINAL: ${this.kothStreak}`;
                        title.style.color = '#ffd600';
                        sub.textContent = `Mejor Récord Histórico: ${window.gameStorage.data.kothBestStreak} 👑`;
                    } else {
                        const isP1 = p === 1;
                        let bonusText = '';
                        if (isP1) {
                            if (this.mode === 'mission' && this.activeMission) {
                                const first = window.gameStorage.completeMission(this.activeMission.id, this.activeMission.reward);
                                bonusText = first
                                    ? ` • ¡Misión Completada +${this.activeMission.reward} 🪙!`
                                    : ` • Bono Repetición +${Math.floor(this.activeMission.reward * 0.25)} 🪙`;
                            } else {
                                window.gameStorage.addCoins(60);
                                bonusText = ' • ¡Bono Victoria +60 🪙!';
                            }
                            window.gameStorage.data.totalMatchesWon++;
                            window.gameStorage.save();
                            this.refreshCoinsUI();
                        }

                        title.textContent = isP1
                            ? '🏆 ¡JUGADOR 1 GANA!'
                            : (this.mode === '2p' ? '🏆 ¡JUGADOR 2 GANA!' : '🤖 ¡RIVAL GANA!');
                        title.style.color = isP1 ? '#00e5ff' : '#ff5252';
                        sub.textContent = `Marcador: ${this.scores[1]} ★ — ${this.scores[2]} ★${bonusText}`;
                    }
                    modal.classList.remove('hidden');
                }
                return true;
            }
        }
        return false;
    }

    update(dtScale) {
        this.readPlayerInputs();

        const simDt = this.state === 'KO_SLOWMO' ? dtScale * 0.22 : dtScale;

        if (this.state === 'PLAYING') {
            this.roundTimer += dtScale;

            // Cuenta regresiva de 5 segundos antes de Muerte Súbita (entre 10s y 15s)
            const secElapsed = Math.floor(this.roundTimer / 60);
            if (secElapsed >= 10 && secElapsed < 15 && !this.arena.suddenDeath) {
                const remain = 15 - secElapsed;
                if (remain !== this.lastCountdownSec) {
                    this.lastCountdownSec = remain;
                    window.retroAudio.countdownBeep(false);
                    this.showBanner(`⏳ MUERTE SÚBITA EN ${remain}...`, '¡Ataca antes de que empiece el caos!', '#ff9100', 950);
                }
            }

            if (this.roundTimer > 900 && !this.arena.suddenDeath) {
                this.arena.triggerSuddenDeath();
                window.retroAudio.suddenDeathSiren();
                window.retroAudio.setSuddenDeathTempo(true);
                const sdDesc = this.arena.suddenDeathType === 'COWS'
                    ? '🐄 ¡LLUVIA DE VACAS EN LLAMAS Y LAVA!'
                    : (this.arena.suddenDeathType === 'SAWS' ? '⚙️ ¡CAEN SIERRAS RODANTES GIGANTES!' : '☄️ ¡LLUVIA DE METEORITOS Y LAVA!');
                this.showBanner('⚠️ ¡MUERTE SÚBITA! ⚠️', sdDesc, '#ff1744', 1900);
            }
        } else if (this.state === 'KO_SLOWMO') {
            this.slowmoTimer -= dtScale;
            if (this.slowmoTimer <= 0) {
                if (!this.checkMatchOver()) {
                    this.roundNumber++;
                    this.startRound();
                }
            }
        }

        // Actualizar Arena
        this.arena.update(simDt, (ex, ey, power) => {
            this.handleImpact(ex, ey, power, true);
        });

        // Actualizar Físicas de Coches y Proyectiles
        window.PhysicsEngine.step(this.cars, this.arena, this.projectiles, simDt, {
            onImpact: (ix, iy, pow, sparks) => this.handleImpact(ix, iy, pow, sparks),
            onKO: (victim, hx, hy, reason) => this.handleKO(victim, hx, hy, reason),
            onStuntFlip: (car, isBackflip) => this.handleStuntFlip(car, isBackflip),
            onCannonFire: (mx, my) => {
                window.retroAudio.cannonFire();
                this.spawnParticles(mx, my, 12, ['#ffea00', '#ff6d00', '#cfd8dc'], 7, 5);
            },
            onPartDetached: (px, py, pNum) => {
                const col = pNum === 1 ? '#2979ff' : '#ff1744';
                this.spawnParticles(px, py, 16, [col, '#90a4ae', '#ffd600'], 9, 6);
                this.addFloatingText(px, py - 18, '¡BLINDAJE ROTO!', '#ff9100');
            }
        });

        // Feedback táctil de conducción: petardeo de escape, derrape por superficie, impacto de aterrizaje y estelas
        const theme = this.arena ? this.arena.theme : 'stadium';
        for (const car of this.cars) {
            const anyGrounded = car.wheels.some(w => w.grounded);

            // 1. Impacto táctil al aterrizar tras un salto (polvo + micro-sacudida según el peso del vehículo)
            if (!car.dead && anyGrounded && !car.wasGrounded) {
                const impactVel = Math.hypot(car.vx, car.vy);
                if (impactVel > 3.2) {
                    const heavyFactor = Math.min(2.2, car.mass / 1.4);
                    this.shakeIntensity = Math.max(this.shakeIntensity, Math.min(6.5, impactVel * 0.35 * heavyFactor));
                    for (const w of car.wheels) {
                        if (!w.grounded) continue;
                        for (let k = 0; k < 5; k++) {
                            this.particles.push({
                                x: w.x + (Math.random() - 0.5) * 14,
                                y: w.y + w.r * 0.75,
                                vx: (Math.random() - 0.5) * 4.5,
                                vy: -0.8 - Math.random() * 2.2,
                                size: 4 + Math.floor(Math.random() * 4),
                                color: theme === 'glacier' ? '#e0f7fa' : (theme === 'volcano' ? '#ff9100' : 'rgba(210, 200, 185, 0.75)'),
                                life: 0.65,
                                decay: 0.045
                            });
                        }
                    }
                }
            }
            car.wasGrounded = anyGrounded;

            // 2. Petardeo de escape (Backfire Pop) al cambiar bruscamente de dirección ("Rocking")
            if (!car.dead && car.input !== 0 && car.input !== (car.prevInput || 0)) {
                const rearX = car.x - Math.cos(car.angle) * (car.width * 0.48 * car.dir);
                const rearY = car.y - Math.sin(car.angle) * (car.width * 0.48 * car.dir);
                for (let k = 0; k < 4; k++) {
                    this.particles.push({
                        x: rearX + (Math.random() - 0.5) * 6,
                        y: rearY + (Math.random() - 0.5) * 6,
                        vx: -car.input * (2.5 + Math.random() * 2.5),
                        vy: (Math.random() - 0.5) * 2.0,
                        size: 5 + Math.floor(Math.random() * 3),
                        color: k % 2 === 0 ? '#ffea00' : '#ff3d00',
                        life: 0.45,
                        decay: 0.07
                    });
                }
            }
            car.prevInput = car.input;

            // 3. Burnout de llantas y chispas/esquirlas según el material del mapa
            if (!car.dead && car.input !== 0 && anyGrounded) {
                const isPeelOut = (car.input * car.vx < 1.5) || Math.abs(car.vx) > 7.5 || car.turboTimer > 0;
                if (isPeelOut && Math.random() < 0.55) {
                    for (const w of car.wheels) {
                        if (!w.grounded) continue;
                        let sparkColor = 'rgba(220, 225, 235, 0.65)';
                        if (theme === 'glacier') sparkColor = Math.random() < 0.5 ? '#80deea' : '#ffffff';
                        else if (theme === 'volcano') sparkColor = Math.random() < 0.5 ? '#ff6d00' : '#ffd600';
                        else if (theme === 'factory' || theme === 'cyber') sparkColor = Math.random() < 0.5 ? '#ffea00' : '#00e5ff';

                        this.particles.push({
                            x: w.x + (Math.random() - 0.5) * 8,
                            y: w.y + w.r * 0.82,
                            vx: -car.input * (1.8 + Math.random() * 2.4),
                            vy: -0.9 - Math.random() * 1.8,
                            size: 4,
                            color: sparkColor,
                            life: 0.55,
                            decay: 0.05
                        });
                    }
                }
            }

            // 4. Historial de estela fantasma (Afterimage) para alta velocidad o Turbo
            if (!car.trailHistory) car.trailHistory = [];
            const speed = Math.hypot(car.vx, car.vy);
            if (!car.dead && (car.turboTimer > 0 || speed > 10.5)) {
                car.trailHistory.push({ x: car.x, y: car.y, angle: car.angle, alpha: 0.32 });
                if (car.trailHistory.length > 4) car.trailHistory.shift();
            } else if (car.trailHistory.length > 0) {
                car.trailHistory.shift();
            }

            // 5. Humo de escape continuo y fuego en coches derrotados
            if (car.dead && Math.random() < 0.45) {
                this.particles.push({
                    x: car.x + (Math.random() - 0.5) * 30,
                    y: car.y - 6,
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: -1.8 - Math.random() * 1.5,
                    size: 6,
                    color: Math.random() < 0.5 ? '#ff5722' : '#455a64',
                    life: 0.85,
                    decay: 0.035
                });
            } else if (!car.dead && car.input !== 0 && Math.random() < 0.35) {
                const rearX = car.x - Math.cos(car.angle) * (car.width * 0.45 * car.dir);
                const rearY = car.y - Math.sin(car.angle) * (car.width * 0.45 * car.dir);
                this.particles.push({
                    x: rearX,
                    y: rearY,
                    vx: -car.input * 1.6 + (Math.random() - 0.5),
                    vy: -0.8 - Math.random(),
                    size: 5,
                    color: car.turboTimer > 0 ? '#00e5ff' : 'rgba(200, 210, 220, 0.55)',
                    life: 0.7,
                    decay: 0.04
                });
            }
        }

        // Actualizar partículas
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const pt = this.particles[i];
            pt.x += pt.vx * simDt;
            pt.y += pt.vy * simDt;
            pt.vy += 0.18 * simDt;
            pt.life -= pt.decay * simDt;
            if (pt.life <= 0) this.particles.splice(i, 1);
        }

        // Actualizar textos flotantes
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const ft = this.floatingTexts[i];
            ft.y -= 1.1 * dtScale;
            ft.life -= 0.02 * dtScale;
            if (ft.life <= 0) this.floatingTexts.splice(i, 1);
        }

        if (this.flashAlpha > 0) {
            this.flashAlpha = Math.max(0, this.flashAlpha - 0.06 * dtScale);
        }

        if (this.shakeIntensity > 0) {
            this.shakeIntensity *= Math.pow(0.86, dtScale);
            if (this.shakeIntensity < 0.2) this.shakeIntensity = 0;
        }
    }

    draw() {
        const ctx = this.ctx;
        ctx.save();

        if (this.state === 'KO_SLOWMO') {
            const zoom = 1.26;
            const tx = this.width * 0.5 - this.koFocus.x * zoom;
            const ty = this.height * 0.5 - this.koFocus.y * zoom;
            const clampedX = Math.max(this.width * (1 - zoom), Math.min(0, tx));
            const clampedY = Math.max(this.height * (1 - zoom), Math.min(0, ty));
            ctx.translate(clampedX, clampedY);
            ctx.scale(zoom, zoom);
        }

        if (this.shakeIntensity > 0) {
            const sx = (Math.random() - 0.5) * this.shakeIntensity * 2;
            const sy = (Math.random() - 0.5) * this.shakeIntensity * 2;
            ctx.translate(sx, sy);
        }

        // 1. Dibujar Arena
        this.arena.draw(ctx);

        // 2. Dibujar Proyectiles de Cañón
        for (const proj of this.projectiles) {
            ctx.save();
            ctx.translate(proj.x, proj.y);
            ctx.fillStyle = '#11131a';
            ctx.fillRect(-proj.r, -proj.r, proj.r * 2, proj.r * 2);
            ctx.fillStyle = '#ffea00';
            ctx.fillRect(-proj.r + 2, -proj.r + 2, (proj.r - 2) * 2, (proj.r - 2) * 2);
            ctx.restore();
        }

        // 3. Dibujar Coches
        for (const car of this.cars) {
            this.drawCar(ctx, car);
        }

        // 4. Dibujar Partículas Pixeladas
        for (const pt of this.particles) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, pt.life);
            ctx.fillStyle = pt.color;
            ctx.fillRect(Math.round(pt.x - pt.size * 0.5), Math.round(pt.y - pt.size * 0.5), pt.size, pt.size);
            ctx.restore();
        }

        // 5. Textos Flotantes de Acrobacias y Monedas
        for (const ft of this.floatingTexts) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, ft.life);
            ctx.font = 'bold 14px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#000000';
            ctx.fillText(ft.text, ft.x + 2, ft.y + 2);
            ctx.fillStyle = ft.color;
            ctx.fillText(ft.text, ft.x, ft.y);
            ctx.restore();
        }

        ctx.restore();

        // Flash blanco de cámara fotográfica en KO
        if (this.flashAlpha > 0) {
            ctx.save();
            ctx.fillStyle = `rgba(255, 255, 255, ${this.flashAlpha})`;
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.restore();
        }
    }

    drawCar(ctx, car) {
        // 0. Estelas fantasma (Afterimage) cuando el coche va a máxima velocidad o con Turbo
        if (car.trailHistory && car.trailHistory.length > 0 && !car.dead) {
            for (let i = 0; i < car.trailHistory.length; i++) {
                const ghost = car.trailHistory[i];
                ctx.save();
                ctx.globalAlpha = ((i + 1) / car.trailHistory.length) * 0.22;
                ctx.translate(ghost.x, ghost.y);
                ctx.rotate(ghost.angle);
                window.PixelSpriteRenderer.drawChassis(
                    ctx,
                    car.spec,
                    car.playerNum,
                    car.dir,
                    this.arena.time,
                    false,
                    false
                );
                ctx.restore();
            }
        }

        // 1. Amortiguadores hidráulicos y resortes de suspensión visibles
        if (!car.dead && car.spec.id !== 'ufo') {
            for (const w of car.wheels) {
                const anchor = car.getWheelAnchor(w);
                ctx.save();
                // Cilindro hidráulico interior oscuro
                ctx.strokeStyle = '#263238';
                ctx.lineWidth = 6;
                ctx.beginPath();
                ctx.moveTo(anchor.x, anchor.y);
                ctx.lineTo(w.x, w.y);
                ctx.stroke();

                // Vástago cromado y espiral de resorte coloreado según jugador
                ctx.strokeStyle = car.playerNum === 1 ? '#4fc3f7' : '#ff8a65';
                ctx.lineWidth = 2.5;
                ctx.setLineDash([3, 3]);
                ctx.beginPath();
                ctx.moveTo(anchor.x, anchor.y);
                ctx.lineTo(w.x, w.y);
                ctx.stroke();
                ctx.restore();
            }
        }

        // 2. Bola de demolición con cadena física
        if (car.wreckingBall) {
            const anchor = car.getCraneAnchor();
            window.PixelSpriteRenderer.drawWreckingBall(
                ctx,
                anchor.x,
                anchor.y,
                car.wreckingBall.x,
                car.wreckingBall.y,
                car.wreckingBall.r
            );
        }

        // 3. Casco personalizado del piloto
        window.PixelSpriteRenderer.drawHelmet(
            ctx,
            car.head.x,
            car.head.y,
            car.head.r,
            car.head.angle,
            car.playerNum,
            car.dir,
            car.dead,
            car.helmetId
        );

        // 4. Chasis Pixel Art con vibración de motor, faros, calaveras de freno y sub-partes animadas
        const isAccelerating = car.input !== 0 || car.turboTimer > 0;
        const isReversing = (car.input * car.dir) < 0;
        ctx.save();
        ctx.translate(car.x, car.y);
        ctx.rotate(car.angle);
        window.PixelSpriteRenderer.drawChassis(
            ctx,
            car.spec,
            car.playerNum,
            car.dir,
            this.arena.time,
            isAccelerating,
            isReversing
        );
        ctx.restore();

        // 5. Sierra frontal si el coche la incluye (Coche Sierra / T-Rex)
        const fSaw = car.getFrontSawPos();
        if (fSaw) {
            window.PixelSpriteRenderer.drawSawblade(ctx, fSaw.x, fSaw.y, fSaw.r, car.sawAngle);
        }

        // 6. Ruedas con estilo específico y anillo de desenfoque por velocidad angular (spinSpeed)
        for (const w of car.wheels) {
            window.PixelSpriteRenderer.drawWheel(ctx, w.x, w.y, w.r, w.angle, car.playerNum, w.style, w.va);
        }

        // 7. Indicador flotante sobre el jugador
        if (!car.dead && this.state === 'PLAYING') {
            ctx.save();
            ctx.font = 'bold 11px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.fillStyle = car.playerNum === 1 ? '#00e5ff' : '#ff5252';
            const tag = car.playerNum === 1 ? '▼ J1' : (this.mode === '2p' ? '▼ J2' : '▼ CPU');
            ctx.fillText(tag, car.x, car.head.y - 22);
            ctx.restore();
        }
    }

    loop(now) {
        const elapsed = Math.min(50, now - this.lastTime);
        this.lastTime = now;
        const dtScale = elapsed / 16.6667;

        this.update(dtScale);
        this.draw();

        requestAnimationFrame((t) => this.loop(t));
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.game = new PixelArenaGame();
});
