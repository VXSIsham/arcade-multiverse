// Sistema de Progreso, Monedas, Misiones, Logros y Garaje (Persistencia en localStorage)

const HELMET_CATALOG = [
    { id: 'classic', name: 'CASCO RACING', cost: 0, desc: 'El casco clásico de piloto acrobático' },
    { id: 'crown', name: 'CORONA DORADA', cost: 150, desc: 'Para el verdadero Rey de la Colina' },
    { id: 'viking', name: 'CASCO VIKINGO', cost: 200, desc: 'Con cuernos pixelados de batalla' },
    { id: 'astro', name: 'ASTRONAUTA', cost: 250, desc: 'Visor dorado espacial reflectante' },
    { id: 'skull', name: 'CALAVERA', cost: 300, desc: 'Intimida a cualquier rival en la arena' },
    { id: 'knight', name: 'CABALLERO', cost: 350, desc: 'Yelmo medieval de acero templado' },
    { id: 'cyborg', name: 'CIBORG LÁSER', cost: 400, desc: 'Ojo biónico rojo de alta precisión' },
    { id: 'shark', name: 'ALETA TIBURÓN', cost: 500, desc: 'El terror de las arenas acuáticas' }
];

const MISSIONS_CATALOG = [
    {
        id: 'm_wheel',
        title: 'DOMADOR DE LA RUEDA',
        desc: 'Gana una partida (3 estrellas) dentro de LA RUEDA LOCA usando el Buggy Loco.',
        arena: 'spinning_wheel',
        p1Car: 'buggy',
        p2Car: 'monster',
        targetStars: 3,
        reward: 150,
        difficulty: 'NORMAL'
    },
    {
        id: 'm_saw_vs_tank',
        title: 'ACERO CONTRA ACERO',
        desc: 'Derrota al Tanque Goliath usando el Coche Sierra en el Motordome 360°.',
        arena: 'loop_stadium',
        p1Car: 'sawcar',
        p2Car: 'tank',
        targetStars: 3,
        reward: 200,
        difficulty: 'DIFÍCIL'
    },
    {
        id: 'm_wrecking',
        title: 'DEMOLICIÓN TOTAL',
        desc: 'Usa la Grúa con Bola de Demolición para ganar en el Puente Colgante.',
        arena: 'suspension_bridge',
        p1Car: 'wrecking',
        p2Car: 'dump',
        targetStars: 3,
        reward: 220,
        difficulty: 'NORMAL'
    },
    {
        id: 'm_pinball',
        title: 'CAOS DE PINBALL',
        desc: 'Gana con el Coche Plátano en la arena Pinball Caótico contra el Hot Rod V8.',
        arena: 'pinball_dome',
        p1Car: 'banana',
        p2Car: 'hotrod',
        targetStars: 3,
        reward: 250,
        difficulty: 'DIFÍCIL'
    },
    {
        id: 'm_crusher',
        title: 'BAJO PRESIÓN',
        desc: 'Sobrevive a la Prensa Hidráulica con el Montacargas frente al Camión Mamut.',
        arena: 'crusher_factory',
        p1Car: 'forklift',
        p2Car: 'dump',
        targetStars: 3,
        reward: 300,
        difficulty: 'EXPERTO'
    },
    {
        id: 'm_boss_trex',
        title: 'JEFE FINAL: DINO-BOT',
        desc: 'Derrota al legendario Mecha T-Rex en el Balancín Volcánico.',
        arena: 'seesaw_lava',
        p1Car: 'monster',
        p2Car: 'trex',
        targetStars: 5,
        reward: 500,
        difficulty: 'LEYENDA'
    },
    {
        id: 'm_police_chase',
        title: 'PERSECUCIÓN POLICIAL',
        desc: 'Intercepta al Carrito Hot-Dog usando la Patrulla V8 en los Engranajes Gemelos.',
        arena: 'twin_gears',
        p1Car: 'police',
        p2Car: 'hotdog',
        targetStars: 3,
        reward: 280,
        difficulty: 'DIFÍCIL'
    },
    {
        id: 'm_alien_train',
        title: 'INVASIÓN FERROVIARIA',
        desc: 'Domina con la Locomotora a Vapor frente al OVNI Alienígena en la Centrifugadora.',
        arena: 'centrifuge_rings',
        p1Car: 'train',
        p2Car: 'ufo',
        targetStars: 4,
        reward: 450,
        difficulty: 'LEYENDA'
    }
];

class GameStorage {
    constructor() {
        this.storageKey = 'pixel_arena_cars_save_v2';
        this.data = this.load();
    }

    getDefaultData() {
        return {
            coins: 300, // Monedas iniciales para probar la ruleta de inmediato
            kothBestStreak: 0,
            totalKOs: 0,
            totalMatchesWon: 0,
            totalFlips: 0,
            freePlayUnlockAll: false,
            unlockedCars: ['monster', 'buggy', 'hotrod', 'f1', 'motocross', 'police'],
            unlockedHelmets: ['classic'],
            completedMissions: [],
            selectedP1Helmet: 'classic',
            selectedP2Helmet: 'skull',
            aiDifficulty: 'normal' // 'easy' | 'normal' | 'hard'
        };
    }

    load() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            if (!raw) return this.getDefaultData();
            const parsed = JSON.parse(raw);
            const merged = Object.assign(this.getDefaultData(), parsed);
            for (const starter of ['monster', 'buggy', 'hotrod', 'f1', 'motocross', 'police']) {
                if (!merged.unlockedCars.includes(starter)) {
                    merged.unlockedCars.push(starter);
                }
            }
            return merged;
        } catch (e) {
            return this.getDefaultData();
        }
    }

    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (e) {
            // Ignorar errores de cuota
        }
    }

    addCoins(amount) {
        this.data.coins = Math.max(0, Math.floor(this.data.coins + amount));
        this.save();
        return this.data.coins;
    }

    isCarUnlocked(carId) {
        if (this.data.freePlayUnlockAll) return true;
        return this.data.unlockedCars.includes(carId);
    }

    unlockCar(carId) {
        if (!this.data.unlockedCars.includes(carId)) {
            this.data.unlockedCars.push(carId);
            this.save();
            return true;
        }
        return false;
    }

    isHelmetUnlocked(helmetId) {
        if (this.data.freePlayUnlockAll) return true;
        return this.data.unlockedHelmets.includes(helmetId);
    }

    unlockHelmet(helmetId) {
        if (!this.data.unlockedHelmets.includes(helmetId)) {
            this.data.unlockedHelmets.push(helmetId);
            this.save();
            return true;
        }
        return false;
    }

    completeMission(missionId, reward) {
        const firstTime = !this.data.completedMissions.includes(missionId);
        if (firstTime) {
            this.data.completedMissions.push(missionId);
            this.addCoins(reward);
        } else {
            this.addCoins(Math.floor(reward * 0.25));
        }
        this.save();
        return firstTime;
    }

    toggleUnlockAll() {
        this.data.freePlayUnlockAll = !this.data.freePlayUnlockAll;
        this.save();
        return this.data.freePlayUnlockAll;
    }
}

window.HELMET_CATALOG = HELMET_CATALOG;
window.MISSIONS_CATALOG = MISSIONS_CATALOG;
window.gameStorage = new GameStorage();
