// 12 Arenas Interactivas con Shaders Procedurales 2D (Lava/Ácido/Agua con Bloom Aditivo, Reflectores Volumétricos, Aurora Boreal, Volcán en Erupción y Rejilla Synthwave)

const ARENA_CATALOG = [
    {
        id: 'spinning_wheel',
        name: 'LA RUEDA LOCA',
        subtitle: 'Jaula giratoria gigante con paletas de acero y franjas de peligro',
        themeColor: '#ff9100',
        bgTop: '#140b29',
        bgBottom: '#2d143c'
    },
    {
        id: 'centrifuge_rings',
        name: 'CENTRIFUGADORA DOBLE',
        subtitle: 'Rueda exterior girando a un lado y barra interior girando al revés',
        themeColor: '#ff4081',
        bgTop: '#1f0826',
        bgBottom: '#3d1047'
    },
    {
        id: 'loop_stadium',
        name: 'MOTORDOME 360°',
        subtitle: 'Pista con pianos de carreras, turbos en el piso y sierra en el techo',
        themeColor: '#ffd600',
        bgTop: '#16192b',
        bgBottom: '#1f2b4d'
    },
    {
        id: 'rotor_dome',
        name: 'ROTOR DEMOLEDOR',
        subtitle: 'Medio tubo acrobático con hélice cuádruple giratoria en el centro',
        themeColor: '#00e5ff',
        bgTop: '#0b192c',
        bgBottom: '#1e3e62'
    },
    {
        id: 'seesaw_lava',
        name: 'BALANCÍN VOLCÁNICO',
        subtitle: 'Puente de roca basáltica con grietas de magma sobre lava hirviendo',
        themeColor: '#ff1744',
        bgTop: '#240b0b',
        bgBottom: '#4a1212'
    },
    {
        id: 'twin_gears',
        name: 'DOBLE ENGRANAJE',
        subtitle: 'Dos ruedas dentadas industriales girando sobre foso de ácido',
        themeColor: '#76ff03',
        bgTop: '#0d2114',
        bgBottom: '#1a3b24'
    },
    {
        id: 'suspension_bridge',
        name: 'PUENTE COLGANTE',
        subtitle: 'Tablones de madera con cables de acero sobre agua con tiburón',
        themeColor: '#29b6f6',
        bgTop: '#081c2e',
        bgBottom: '#0d3b66'
    },
    {
        id: 'pinball_dome',
        name: 'PINBALL + BALÓN BOMBA',
        subtitle: 'Rebotadores de pinball neón y un balón gigante que explota al chocar cascos',
        themeColor: '#e040fb',
        bgTop: '#1a0933',
        bgBottom: '#3b0d54'
    },
    {
        id: 'crusher_factory',
        name: 'PRENSA Y CINTA',
        subtitle: 'Cinta transportadora animada que arrastra hacia la prensa hidráulica',
        themeColor: '#ffab00',
        bgTop: '#1c1917',
        bgBottom: '#332922'
    },
    {
        id: 'ice_glacier',
        name: 'GLACIAR RESBALADIZO',
        subtitle: 'Iceberg cristalino con carámbanos de hielo sobre agua ártica',
        themeColor: '#80deea',
        bgTop: '#071a26',
        bgBottom: '#10374f'
    },
    {
        id: 'pirate_galleon',
        name: 'GALEÓN PIRATA',
        subtitle: 'Cubierta de madera mecida por las olas con velas piratas y tiburón',
        themeColor: '#ffb300',
        bgTop: '#0a192f',
        bgBottom: '#113f67'
    },
    {
        id: 'cyber_lasers',
        name: 'ESTADIO NEÓN LÁSER',
        subtitle: 'Arena synthwave con rampas cibernéticas, turbos y núcleo de sierras',
        themeColor: '#00e676',
        bgTop: '#090d16',
        bgBottom: '#1b1035'
    }
];

class ArenaInstance {
    constructor(arenaId, width = 960, height = 560) {
        this.id = arenaId;
        this.width = width;
        this.height = height;
        this.cx = width * 0.5;
        this.cy = height * 0.52;
        this.time = 0;

        this.meta = ARENA_CATALOG.find(a => a.id === arenaId) || ARENA_CATALOG[0];

        this.wheelAngle = 0;
        this.wheelSpeed = 0.0145;
        this.targetWheelSpeed = 0.0145;
        this.nextReverseTimer = 340;

        this.seesawAngle = 0;
        this.seesawVa = 0;

        this.crusherY = 125;
        this.crusherState = 'WAIT';
        this.crusherTimer = 110;

        this.bridgePlanks = [];
        this.bumpers = [];
        this.bombBall = null;

        this.suddenDeath = false;
        this.suddenDeathType = 'METEORS';
        this.lavaLevel = height + 60;
        this.liquidType = 'lava';
        this.sharkX = this.cx;
        this.sharkDir = 1;
        this.sawblades = [];
        this.fallingHazards = [];
        this.crowdExcitement = 0;

        // Burbujas y partículas ambientales para el shader de fluidos y fondo
        this.liquidBubbles = [];
        for (let i = 0; i < 18; i++) {
            this.liquidBubbles.push({
                x: Math.random() * width,
                yOffset: Math.random() * 36,
                r: 2 + Math.random() * 5,
                speed: 0.4 + Math.random() * 0.8,
                phase: Math.random() * Math.PI * 2
            });
        }

        this.cameraFlashes = [];
        for (let i = 0; i < 8; i++) {
            this.cameraFlashes.push({
                x: 80 + Math.random() * (width - 160),
                y: 100 + Math.floor(Math.random() * 4) * 48,
                timer: Math.random() * 90
            });
        }

        this.initArenaSpecifics();
    }

    initArenaSpecifics() {
        this.sawblades = [];
        this.bumpers = [];
        this.bridgePlanks = [];
        this.bombBall = null;

        if (this.id === 'seesaw_lava') {
            this.lavaLevel = this.height - 34;
            this.liquidType = 'lava';
            this.sawblades.push(
                { x: 140, y: 165, r: 28, angle: 0 },
                { x: this.width - 140, y: 165, r: 28, angle: 0 }
            );
        } else if (this.id === 'ice_glacier') {
            this.lavaLevel = this.height - 36;
            this.liquidType = 'water';
        } else if (this.id === 'pirate_galleon') {
            this.lavaLevel = this.height - 38;
            this.liquidType = 'water';
        } else if (this.id === 'loop_stadium') {
            this.sawblades.push(
                { x: this.cx, y: 105, r: 26, angle: 0, patrol: true }
            );
        } else if (this.id === 'cyber_lasers') {
            this.sawblades.push(
                { x: this.cx - 120, y: this.cy - 40, r: 24, angle: 0, patrol: true },
                { x: this.cx + 120, y: 110, r: 24, angle: 0 }
            );
        } else if (this.id === 'twin_gears') {
            this.lavaLevel = this.height - 30;
            this.liquidType = 'acid';
        } else if (this.id === 'suspension_bridge') {
            this.lavaLevel = this.height - 42;
            this.liquidType = 'water';
            const numPlanks = 7;
            const startX = 175;
            const endX = this.width - 175;
            const plankW = (endX - startX) / numPlanks;
            for (let i = 0; i < numPlanks; i++) {
                this.bridgePlanks.push({
                    x1: startX + i * plankW + 3,
                    x2: startX + (i + 1) * plankW - 3,
                    baseY: this.cy + 85,
                    sag: 0,
                    hp: 18,
                    broken: false
                });
            }
        } else if (this.id === 'pinball_dome') {
            this.bumpers = [
                { x: this.cx - 145, y: this.cy - 25, r: 30, flash: 0, color: '#00e5ff' },
                { x: this.cx + 145, y: this.cy - 25, r: 30, flash: 0, color: '#ff4081' },
                { x: this.cx, y: this.cy - 115, r: 34, flash: 0, color: '#ffd600' }
            ];
            this.bombBall = {
                x: this.cx,
                y: this.cy + 50,
                vx: 0,
                vy: -2,
                r: 26,
                angle: 0
            };
        } else if (this.id === 'crusher_factory') {
            this.sawblades.push(
                { x: 115, y: this.cy + 140, r: 26, angle: 0 },
                { x: this.width - 115, y: this.cy + 140, r: 26, angle: 0 }
            );
        }
    }

    getSpawnPositions() {
        if (this.id === 'spinning_wheel' || this.id === 'centrifuge_rings') {
            return {
                p1: { x: this.cx - 115, y: this.cy + 155, dir: 1 },
                p2: { x: this.cx + 115, y: this.cy + 155, dir: -1 }
            };
        }
        if (this.id === 'seesaw_lava' || this.id === 'ice_glacier' || this.id === 'pirate_galleon') {
            return {
                p1: { x: this.cx - 185, y: this.cy + 2, dir: 1 },
                p2: { x: this.cx + 185, y: this.cy + 2, dir: -1 }
            };
        }
        if (this.id === 'twin_gears') {
            return {
                p1: { x: this.cx - 165, y: this.cy - 110, dir: 1 },
                p2: { x: this.cx + 165, y: this.cy - 110, dir: -1 }
            };
        }
        if (this.id === 'suspension_bridge') {
            return {
                p1: { x: this.cx - 245, y: this.cy + 42, dir: 1 },
                p2: { x: this.cx + 245, y: this.cy + 42, dir: -1 }
            };
        }
        return {
            p1: { x: this.cx - 240, y: this.cy + 172, dir: 1 },
            p2: { x: this.cx + 240, y: this.cy + 172, dir: -1 }
        };
    }

    triggerSuddenDeath() {
        if (this.suddenDeath) return;
        this.suddenDeath = true;
        const types = ['METEORS', 'SAWS', 'COWS'];
        this.suddenDeathType = types[Math.floor(Math.random() * types.length)];
        if (this.lavaLevel > this.height) {
            this.lavaLevel = this.height - 8;
        }
        this.crowdExcitement = 60;
    }

    update(dtScale = 1, onExplosion = null) {
        this.time += dtScale;
        if (this.crowdExcitement > 0) this.crowdExcitement -= dtScale * 0.4;

        // Actualizar flashes de cámaras en las gradas
        for (const cf of this.cameraFlashes) {
            cf.timer -= dtScale * (this.crowdExcitement > 0 ? 2.2 : 1.0);
            if (cf.timer <= -8) {
                cf.x = 60 + Math.random() * (this.width - 120);
                cf.y = 96 + Math.floor(Math.random() * 4) * 48;
                cf.timer = 45 + Math.random() * 85;
            }
        }

        // Giro de la Rueda Loca / Centrifugadora / Rotores
        this.nextReverseTimer -= dtScale;
        if (this.nextReverseTimer <= 0) {
            this.nextReverseTimer = 280 + Math.random() * 220;
            const dir = this.targetWheelSpeed >= 0 ? -1 : 1;
            const fast = this.suddenDeath ? 0.026 : (0.0135 + Math.random() * 0.011);
            this.targetWheelSpeed = dir * fast;
        }
        this.wheelSpeed += (this.targetWheelSpeed - this.wheelSpeed) * 0.032 * dtScale;
        this.wheelAngle += this.wheelSpeed * dtScale;

        // Balancín / Glaciar Flotante / Galeón Pirata
        if (this.id === 'seesaw_lava' || this.id === 'ice_glacier' || this.id === 'pirate_galleon') {
            const waveForce = this.id === 'pirate_galleon' ? Math.sin(this.time * 0.04) * 0.00035 : 0;
            this.seesawVa += (-this.seesawAngle * 0.0012 + waveForce) * dtScale;
            this.seesawVa *= Math.pow(0.96, dtScale);
            this.seesawAngle += this.seesawVa * dtScale;
            const maxTilt = this.id === 'ice_glacier' ? 0.32 : (this.id === 'pirate_galleon' ? 0.28 : 0.40);
            if (this.seesawAngle > maxTilt) { this.seesawAngle = maxTilt; this.seesawVa *= -0.4; }
            if (this.seesawAngle < -maxTilt) { this.seesawAngle = -maxTilt; this.seesawVa *= -0.4; }
        }

        // Prensa Hidráulica
        if (this.id === 'crusher_factory') {
            this.crusherTimer -= dtScale;
            if (this.crusherState === 'WAIT' && this.crusherTimer <= 0) {
                this.crusherState = 'SLAM';
            } else if (this.crusherState === 'SLAM') {
                this.crusherY += 11.5 * dtScale;
                if (this.crusherY >= this.cy + 145) {
                    this.crusherY = this.cy + 145;
                    this.crusherState = 'RISE';
                    this.crusherTimer = 45;
                    if (onExplosion) onExplosion(this.cx, this.crusherY + 25, 1.8);
                }
            } else if (this.crusherState === 'RISE' && this.crusherTimer <= 0) {
                this.crusherY -= 2.8 * dtScale;
                if (this.crusherY <= 125) {
                    this.crusherY = 125;
                    this.crusherState = 'WAIT';
                    this.crusherTimer = 110 + Math.random() * 60;
                }
            }
        }

        for (const p of this.bridgePlanks) {
            p.sag *= Math.pow(0.88, dtScale);
        }

        if (this.liquidType === 'water') {
            this.sharkX += this.sharkDir * 2.4 * dtScale;
            if (this.sharkX > this.width - 140) this.sharkDir = -1;
            if (this.sharkX < 140) this.sharkDir = 1;
        }

        for (const b of this.bumpers) {
            if (b.flash > 0) b.flash -= dtScale;
        }

        for (const saw of this.sawblades) {
            saw.angle += 0.19 * dtScale;
            if (saw.patrol) {
                saw.x = this.cx + Math.sin(this.time * 0.032) * 235;
            }
        }

        const segments = this.getSegments();
        if (this.bombBall) {
            const bb = this.bombBall;
            bb.vy += 0.35 * dtScale;
            bb.vx *= Math.pow(0.995, dtScale);
            bb.vy *= Math.pow(0.995, dtScale);
            bb.x += bb.vx * dtScale;
            bb.y += bb.vy * dtScale;
            bb.angle += bb.vx * 0.03 * dtScale;

            for (const seg of segments) {
                const hit = window.PhysicsEngine.circleSegmentDistance(bb.x, bb.y, bb.r + 6, seg.x1, seg.y1, seg.x2, seg.y2);
                if (hit.hit) {
                    bb.x += hit.nx * hit.pen;
                    bb.y += hit.ny * hit.pen;
                    const vn = bb.vx * hit.nx + bb.vy * hit.ny;
                    if (vn < 0) {
                        bb.vx -= hit.nx * vn * 1.75;
                        bb.vy -= hit.ny * vn * 1.75;
                    }
                }
            }
            for (const b of this.bumpers) {
                const d = Math.hypot(bb.x - b.x, bb.y - b.y);
                if (d < bb.r + b.r && d > 0.01) {
                    const nx = (bb.x - b.x) / d;
                    const ny = (bb.y - b.y) / d;
                    bb.vx = nx * 13;
                    bb.vy = ny * 13;
                    b.flash = 12;
                }
            }
        }

        // Muerte Súbita
        if (this.suddenDeath) {
            const minLavaY = this.cy + 125;
            if (this.lavaLevel > minLavaY) {
                this.lavaLevel -= 0.28 * dtScale;
            }
            if (Math.random() < 0.022 * dtScale && this.fallingHazards.length < 6) {
                this.fallingHazards.push({
                    type: this.suddenDeathType,
                    x: this.cx + (Math.random() - 0.5) * 540,
                    y: 42,
                    vx: (Math.random() - 0.5) * 3.5,
                    vy: 1.8,
                    r: this.suddenDeathType === 'SAWS' ? 20 : 15,
                    angle: 0,
                    bounces: 0
                });
            }
        }

        for (let i = this.fallingHazards.length - 1; i >= 0; i--) {
            const h = this.fallingHazards[i];
            h.vy += 0.24 * dtScale;
            h.x += h.vx * dtScale;
            h.y += h.vy * dtScale;
            h.angle += 0.16 * dtScale;

            let remove = false;
            for (const seg of segments) {
                if (seg.broken) continue;
                const hit = window.PhysicsEngine.circleSegmentDistance(h.x, h.y, h.r, seg.x1, seg.y1, seg.x2, seg.y2);
                if (hit.hit) {
                    if (h.type === 'SAWS' && h.bounces < 4) {
                        h.x += hit.nx * hit.pen;
                        h.y += hit.ny * hit.pen;
                        const vn = h.vx * hit.nx + h.vy * hit.ny;
                        h.vx -= hit.nx * vn * 1.6 + hit.ny * 1.5;
                        h.vy -= hit.ny * vn * 1.6;
                        h.bounces++;
                    } else {
                        remove = true;
                    }
                    break;
                }
            }
            if (h.y >= this.lavaLevel || h.y > this.height + 40) remove = true;

            if (remove) {
                if (onExplosion) onExplosion(h.x, h.y, 1.4);
                this.fallingHazards.splice(i, 1);
            }
        }
    }

    getSegments() {
        const segs = [];

        if (this.id === 'spinning_wheel' || this.id === 'centrifuge_rings') {
            const sides = 20;
            const radius = 236;
            const cx = this.cx;
            const cy = this.cy - 6;
            const omega = this.wheelSpeed;

            for (let i = 0; i < sides; i++) {
                const a1 = this.wheelAngle + (i / sides) * Math.PI * 2;
                const a2 = this.wheelAngle + ((i + 1) / sides) * Math.PI * 2;
                const x1 = cx + Math.cos(a1) * radius;
                const y1 = cy + Math.sin(a1) * radius;
                const x2 = cx + Math.cos(a2) * radius;
                const y2 = cy + Math.sin(a2) * radius;

                segs.push({
                    x1, y1, x2, y2,
                    thickness: 18,
                    friction: 1.4,
                    bounciness: 0.24,
                    texture: i % 2 === 0 ? 'hazard' : 'steel_girder',
                    color: i % 2 === 0 ? this.meta.themeColor : '#ffd600',
                    getSurfaceVx: (px, py) => -omega * (py - cy),
                    getSurfaceVy: (px, py) => omega * (px - cx)
                });

                if (i % 5 === 0) {
                    const bx = cx + Math.cos(a1) * (radius - 38);
                    const by = cy + Math.sin(a1) * (radius - 38);
                    segs.push({
                        x1, y1, x2: bx, y2: by,
                        thickness: 14,
                        friction: 1.45,
                        bounciness: 0.38,
                        texture: 'hazard',
                        color: '#ff3d00',
                        getSurfaceVx: (px, py) => -omega * (py - cy),
                        getSurfaceVy: (px, py) => omega * (px - cx)
                    });
                }
            }

            if (this.id === 'centrifuge_rings') {
                const innerOmega = -omega * 1.75;
                const innerAngle = -this.wheelAngle * 1.75;
                const barLen = 92;
                segs.push({
                    x1: cx - Math.cos(innerAngle) * barLen,
                    y1: cy - Math.sin(innerAngle) * barLen,
                    x2: cx + Math.cos(innerAngle) * barLen,
                    y2: cy + Math.sin(innerAngle) * barLen,
                    thickness: 16,
                    friction: 1.3,
                    bounciness: 0.45,
                    texture: 'neon',
                    color: '#00e5ff',
                    getSurfaceVx: (px, py) => -innerOmega * (py - cy),
                    getSurfaceVy: (px, py) => innerOmega * (px - cx)
                });
            }
        } else if (this.id === 'rotor_dome') {
            this.addStadiumWalls(segs, 405, 218, false, false, 'steel_girder');

            const rCx = this.cx;
            const rCy = this.cy + 15;
            const bladeLen = 108;
            const omega = this.wheelSpeed * 1.65;

            for (let b = 0; b < 4; b++) {
                const a = this.wheelAngle * 1.6 + (b * Math.PI * 0.5);
                const x2 = rCx + Math.cos(a) * bladeLen;
                const y2 = rCy + Math.sin(a) * bladeLen;
                segs.push({
                    x1: rCx, y1: rCy, x2, y2,
                    thickness: 14,
                    friction: 1.25,
                    bounciness: 0.55,
                    texture: 'hazard',
                    color: '#00e5ff',
                    getSurfaceVx: (px, py) => -omega * (py - rCy),
                    getSurfaceVy: (px, py) => omega * (px - rCx)
                });
            }
        } else if (this.id === 'seesaw_lava' || this.id === 'ice_glacier' || this.id === 'pirate_galleon') {
            const isIce = this.id === 'ice_glacier';
            const isPirate = this.id === 'pirate_galleon';
            const halfLen = isIce ? 315 : (isPirate ? 325 : 335);
            const pCx = this.cx;
            const pCy = this.cy + (isIce || isPirate ? 55 + Math.sin(this.time * 0.05) * 8 : 45);
            const cos = Math.cos(this.seesawAngle);
            const sin = Math.sin(this.seesawAngle);
            const omega = this.seesawVa;

            const x1 = pCx - cos * halfLen;
            const y1 = pCy - sin * halfLen;
            const x2 = pCx + cos * halfLen;
            const y2 = pCy + sin * halfLen;

            segs.push({
                x1, y1, x2, y2,
                thickness: isIce ? 26 : 22,
                friction: isIce ? 0.42 : 1.28,
                bounciness: 0.2,
                texture: isIce ? 'ice' : (isPirate ? 'wood' : 'volcano'),
                color: isIce ? '#80deea' : (isPirate ? '#ffb300' : '#ff9100'),
                getSurfaceVx: (px, py) => -omega * (py - pCy),
                getSurfaceVy: (px, py) => omega * (px - pCx),
                onWeightImpulse: (px, py, fx, fy) => {
                    const rx = px - pCx;
                    const ry = py - pCy;
                    const torque = (rx * fy - ry * fx) * 0.000018;
                    this.seesawVa += torque;
                }
            });

            if (!isIce) {
                const lipH = isPirate ? 38 : 26;
                segs.push({
                    x1, y1,
                    x2: x1 + sin * lipH, y2: y1 - cos * lipH,
                    thickness: 16,
                    texture: isPirate ? 'wood' : 'hazard',
                    color: isPirate ? '#8d6e63' : '#ff3d00',
                    getSurfaceVx: (px, py) => -omega * (py - pCy),
                    getSurfaceVy: (px, py) => omega * (px - pCx)
                });
                segs.push({
                    x1: x2, y1: y2,
                    x2: x2 + sin * lipH, y2: y2 - cos * lipH,
                    thickness: 16,
                    texture: isPirate ? 'wood' : 'hazard',
                    color: isPirate ? '#8d6e63' : '#ff3d00',
                    getSurfaceVx: (px, py) => -omega * (py - pCy),
                    getSurfaceVy: (px, py) => omega * (px - pCx)
                });
            }

            segs.push({ x1: 60, y1: 60, x2: this.width - 60, y2: 60, thickness: 16, texture: 'steel_girder', color: '#455a64' });
            segs.push({ x1: 60, y1: 60, x2: 60, y2: 380, thickness: 16, texture: 'steel_girder', color: '#455a64' });
            segs.push({ x1: this.width - 60, y1: 60, x2: this.width - 60, y2: 380, thickness: 16, texture: 'steel_girder', color: '#455a64' });
        } else if (this.id === 'twin_gears') {
            const gears = [
                { x: this.cx - 165, y: this.cy + 45, r: 125, dir: 1 },
                { x: this.cx + 165, y: this.cy + 45, r: 125, dir: -1 }
            ];
            const sides = 12;

            for (const g of gears) {
                const omega = Math.abs(this.wheelSpeed) * 1.15 * g.dir;
                const baseAngle = this.wheelAngle * 1.15 * g.dir;
                for (let i = 0; i < sides; i++) {
                    const a1 = baseAngle + (i / sides) * Math.PI * 2;
                    const a2 = baseAngle + ((i + 1) / sides) * Math.PI * 2;
                    const x1 = g.x + Math.cos(a1) * g.r;
                    const y1 = g.y + Math.sin(a1) * g.r;
                    const x2 = g.x + Math.cos(a2) * g.r;
                    const y2 = g.y + Math.sin(a2) * g.r;
                    segs.push({
                        x1, y1, x2, y2,
                        thickness: 16, friction: 1.4, bounciness: 0.25,
                        texture: 'gear',
                        color: i % 2 === 0 ? '#76ff03' : '#33691e',
                        getSurfaceVx: (px, py) => -omega * (py - g.y),
                        getSurfaceVy: (px, py) => omega * (px - g.x)
                    });

                    if (i % 2 === 0) {
                        const am = (a1 + a2) * 0.5;
                        const tx = g.x + Math.cos(am) * (g.r + 22);
                        const ty = g.y + Math.sin(am) * (g.r + 22);
                        segs.push({
                            x1: (x1 + x2) * 0.5, y1: (y1 + y2) * 0.5,
                            x2: tx, y2: ty,
                            thickness: 14, friction: 1.4,
                            texture: 'hazard',
                            color: '#b2ff59',
                            getSurfaceVx: (px, py) => -omega * (py - g.y),
                            getSurfaceVy: (px, py) => omega * (px - g.x)
                        });
                    }
                }
            }

            segs.push({ x1: 55, y1: 55, x2: this.width - 55, y2: 55, thickness: 16, texture: 'steel_girder', color: '#455a64' });
            segs.push({ x1: 55, y1: 55, x2: 55, y2: 430, thickness: 16, texture: 'steel_girder', color: '#455a64' });
            segs.push({ x1: this.width - 55, y1: 55, x2: this.width - 55, y2: 430, thickness: 16, texture: 'steel_girder', color: '#455a64' });
        } else if (this.id === 'suspension_bridge') {
            const pierY = this.cy + 85;
            segs.push({ x1: 55, y1: pierY, x2: 175, y2: pierY, thickness: 22, friction: 1.3, texture: 'steel_girder', color: '#90a4ae' });
            segs.push({ x1: this.width - 175, y1: pierY, x2: this.width - 55, y2: pierY, thickness: 22, friction: 1.3, texture: 'steel_girder', color: '#90a4ae' });
            segs.push({ x1: 55, y1: 65, x2: 55, y2: pierY, thickness: 18, texture: 'steel_girder', color: '#607d8b' });
            segs.push({ x1: this.width - 55, y1: 65, x2: this.width - 55, y2: pierY, thickness: 18, texture: 'steel_girder', color: '#607d8b' });
            segs.push({ x1: 55, y1: 65, x2: this.width - 55, y2: 65, thickness: 16, texture: 'steel_girder', color: '#607d8b' });

            for (const plank of this.bridgePlanks) {
                if (plank.broken) continue;
                const py = plank.baseY + plank.sag;
                segs.push({
                    x1: plank.x1, y1: py,
                    x2: plank.x2, y2: py,
                    thickness: 16,
                    friction: 1.25,
                    texture: 'wood',
                    color: plank.hp > 9 ? '#ffb300' : '#ff3d00',
                    onWeightImpulse: () => {
                        plank.sag = Math.min(18, plank.sag + 1.5);
                    },
                    onImpactDamage: (dmg) => {
                        plank.hp -= dmg;
                        if (plank.hp <= 0) {
                            plank.broken = true;
                        }
                    }
                });
            }
        } else if (this.id === 'pinball_dome') {
            this.addStadiumWalls(segs, 415, 220, false, false, 'neon');
            const floorY = this.cy + 220;
            segs.push({ x1: this.cx - 260, y1: floorY, x2: this.cx - 90, y2: floorY - 36, thickness: 16, texture: 'neon', color: '#e040fb' });
            segs.push({ x1: this.cx + 90, y1: floorY - 36, x2: this.cx + 260, y2: floorY, thickness: 16, texture: 'neon', color: '#00e5ff' });
        } else if (this.id === 'crusher_factory') {
            this.addStadiumWalls(segs, 415, 220, true, false, 'steel_girder');
            const cw = 95;
            const cy = this.crusherY;
            const vy = this.crusherState === 'SLAM' ? 11.5 : (this.crusherState === 'RISE' ? -2.8 : 0);
            segs.push({
                x1: this.cx - cw, y1: cy,
                x2: this.cx + cw, y2: cy,
                thickness: 24,
                texture: 'hazard',
                color: '#ffab00',
                vy,
                getSurfaceVx: () => 0,
                getSurfaceVy: () => vy
            });
        } else if (this.id === 'cyber_lasers') {
            this.addStadiumWalls(segs, 415, 220, false, true, 'neon');
            const floorY = this.cy + 220;
            segs.push({
                x1: this.cx - 180, y1: floorY,
                x2: this.cx - 60, y2: floorY - 48,
                thickness: 16, friction: 1.3, texture: 'neon', color: '#00e676'
            });
            segs.push({
                x1: this.cx - 60, y1: floorY - 48,
                x2: this.cx + 60, y2: floorY - 48,
                thickness: 16, friction: 1.3, texture: 'neon', color: '#00e5ff'
            });
            segs.push({
                x1: this.cx + 60, y1: floorY - 48,
                x2: this.cx + 180, y2: floorY,
                thickness: 16, friction: 1.3, texture: 'neon', color: '#00e676'
            });
        } else {
            this.addStadiumWalls(segs, 415, 220, false, true, 'race_curb');
            const floorY = this.cy + 220;
            segs.push({
                x1: this.cx - 135, y1: floorY,
                x2: this.cx, y2: floorY - 58,
                thickness: 16, friction: 1.25, texture: 'race_curb', color: '#ffd600'
            });
            segs.push({
                x1: this.cx, y1: floorY - 58,
                x2: this.cx + 135, y2: floorY,
                thickness: 16, friction: 1.25, texture: 'race_curb', color: '#ffd600'
            });
        }

        return segs;
    }

    addStadiumWalls(segs, halfW, halfH, conveyorFloor = false, boosterFloor = false, wallTex = 'steel_girder') {
        const left = this.cx - halfW;
        const right = this.cx + halfW;
        const top = this.cy - halfH;
        const bottom = this.cy + halfH;
        const cornerR = 122;

        if (conveyorFloor) {
            segs.push({
                x1: left + cornerR, y1: bottom, x2: this.cx, y2: bottom,
                thickness: 20, friction: 1.35, texture: 'conveyor', conveyorDir: 1, color: '#ffab00',
                getSurfaceVx: () => 2.6, getSurfaceVy: () => 0
            });
            segs.push({
                x1: this.cx, y1: bottom, x2: right - cornerR, y2: bottom,
                thickness: 20, friction: 1.35, texture: 'conveyor', conveyorDir: -1, color: '#ffab00',
                getSurfaceVx: () => -2.6, getSurfaceVy: () => 0
            });
        } else {
            segs.push({
                x1: left + cornerR, y1: bottom, x2: right - cornerR, y2: bottom,
                thickness: 20, friction: 1.25,
                texture: boosterFloor ? 'race_curb' : wallTex,
                color: boosterFloor ? '#00e5ff' : '#eceff1',
                boosterSpeed: boosterFloor ? 0.35 : 0
            });
        }

        segs.push({ x1: left + cornerR, y1: top, x2: right - cornerR, y2: top, thickness: 18, friction: 1.25, texture: wallTex, color: '#90a4ae' });
        segs.push({ x1: left, y1: top + cornerR, x2: left, y2: bottom - cornerR, thickness: 18, friction: 1.3, texture: wallTex, color: '#b0bec5' });
        segs.push({ x1: right, y1: top + cornerR, x2: right, y2: bottom - cornerR, thickness: 18, friction: 1.3, texture: wallTex, color: '#b0bec5' });

        const corners = [
            { cx: left + cornerR, cy: bottom - cornerR, start: Math.PI * 0.5, end: Math.PI },
            { cx: left + cornerR, cy: top + cornerR, start: Math.PI, end: Math.PI * 1.5 },
            { cx: right - cornerR, cy: top + cornerR, start: Math.PI * 1.5, end: Math.PI * 2 },
            { cx: right - cornerR, cy: bottom - cornerR, start: 0, end: Math.PI * 0.5 }
        ];
        const steps = 7;
        for (const c of corners) {
            for (let i = 0; i < steps; i++) {
                const a1 = c.start + (i / steps) * (c.end - c.start);
                const a2 = c.start + ((i + 1) / steps) * (c.end - c.start);
                segs.push({
                    x1: c.cx + Math.cos(a1) * cornerR,
                    y1: c.cy + Math.sin(a1) * cornerR,
                    x2: c.cx + Math.cos(a2) * cornerR,
                    y2: c.cy + Math.sin(a2) * cornerR,
                    thickness: 18,
                    friction: 1.35,
                    texture: i % 2 === 0 ? wallTex : 'hazard',
                    color: '#ff9100'
                });
            }
        }
    }

    checkHazards(car, onImpact) {
        if (car.head.y + car.head.r >= this.lavaLevel || car.y > this.height + 60) {
            if (car.spec.floatsOnWater && this.liquidType === 'water') {
                if (Math.abs(car.angle) < 1.3) {
                    car.vy = Math.max(-2.2, car.vy - 0.55);
                } else {
                    return { x: car.head.x, y: this.lavaLevel, reason: 'NAUFRAGIO PIRATA' };
                }
            } else {
                const reason = this.liquidType === 'water'
                    ? 'DEVORADO EN EL AGUA'
                    : (this.liquidType === 'acid' ? 'DISUELTO EN ÁCIDO' : 'FUNDIDO EN LAVA');
                return { x: car.head.x, y: Math.min(car.head.y, this.lavaLevel), reason };
            }
        }
        for (const w of car.wheels) {
            if (w.y + w.r >= this.lavaLevel) {
                const buoyancy = car.spec.floatsOnWater ? 0.65 : 0.35;
                car.vy = Math.max(-2.4, car.vy - buoyancy);
                if (onImpact && Math.random() < 0.25) onImpact(w.x, this.lavaLevel, 0.5, true);
            }
        }

        if (this.id === 'crusher_factory' && this.crusherState === 'SLAM') {
            if (Math.abs(car.head.x - this.cx) < 95 && Math.abs(car.head.y - (this.crusherY + 14)) < car.head.r + 14) {
                return { x: car.head.x, y: car.head.y, reason: 'APLASTADO POR LA PRENSA' };
            }
        }

        if (this.bombBall) {
            const bb = this.bombBall;
            const dHead = Math.hypot(car.head.x - bb.x, car.head.y - bb.y);
            if (dHead < car.head.r + bb.r && Math.hypot(bb.vx, bb.vy) > 6.5) {
                return { x: bb.x, y: bb.y, reason: 'BALÓN EXPLOSIVO' };
            }
            const obb = car.getChassisOBB();
            const hit = window.PhysicsEngine.circleVsOBB(bb.x, bb.y, bb.r, obb);
            if (hit.hit) {
                bb.x += hit.nx * hit.pen;
                bb.y += hit.ny * hit.pen;
                bb.vx = hit.nx * 9.5 + car.vx * 0.5;
                bb.vy = hit.ny * 9.5 + car.vy * 0.5 - 1.5;
                car.vx = Math.max(-6.5, Math.min(6.5, car.vx - hit.nx * 1.6));
                car.vy = Math.max(-4.5, Math.min(6.5, car.vy - hit.ny * 1.2));
                if (onImpact) onImpact(hit.px, hit.py, 1.1, true);
            }
        }

        for (const b of this.bumpers) {
            for (const w of car.wheels) {
                const d = Math.hypot(w.x - b.x, w.y - b.y);
                if (d < w.r + b.r && d > 0.01) {
                    const nx = (w.x - b.x) / d;
                    const ny = (w.y - b.y) / d;
                    car.vx = Math.max(-6.8, Math.min(6.8, nx * 6.5));
                    car.vy = Math.max(-5.2, Math.min(6.0, ny * 5.2));
                    b.flash = 14;
                    if (onImpact) onImpact(b.x + nx * b.r, b.y + ny * b.r, 1.2, true);
                }
            }
        }

        for (const saw of this.sawblades) {
            const distHead = Math.hypot(car.head.x - saw.x, car.head.y - saw.y);
            if (distHead < car.head.r + saw.r) {
                return { x: car.head.x, y: car.head.y, reason: 'SIERRA MORTAL' };
            }
            for (const w of car.wheels) {
                const d = Math.hypot(w.x - saw.x, w.y - saw.y);
                if (d < w.r + saw.r && d > 0.01) {
                    const nx = (w.x - saw.x) / d;
                    const ny = (w.y - saw.y) / d;
                    car.vx = Math.max(-7.2, Math.min(7.2, nx * 7.2));
                    car.vy = Math.max(-5.2, Math.min(6.5, ny * 5.5));
                    car.va += (nx > 0 ? 0.08 : -0.08);
                    if (window.retroAudio) window.retroAudio.sawHit();
                    if (onImpact) onImpact(saw.x + nx * saw.r, saw.y + ny * saw.r, 1.5, true);
                }
            }
        }

        for (let i = this.fallingHazards.length - 1; i >= 0; i--) {
            const h = this.fallingHazards[i];
            const dHead = Math.hypot(car.head.x - h.x, car.head.y - h.y);
            const dCar = Math.hypot(car.x - h.x, car.y - h.y);
            if (dHead < car.head.r + h.r + 5) {
                this.fallingHazards.splice(i, 1);
                const reason = h.type === 'COWS' ? '¡VACA EN LLAMAS!' : (h.type === 'SAWS' ? 'SIERRA CAÍDA' : 'METEORITO');
                return { x: h.x, y: h.y, reason };
            }
            if (dCar < car.width * 0.5 + h.r) {
                this.fallingHazards.splice(i, 1);
                const nx = (car.x - h.x) / Math.max(1, dCar);
                const ny = (car.y - h.y) / Math.max(1, dCar);
                car.vx = Math.max(-7.5, Math.min(7.5, car.vx + nx * 7));
                car.vy = Math.max(-4.8, Math.min(6.5, car.vy + ny * 5 - 2));
                car.va += (Math.random() - 0.5) * 0.14;
                if (onImpact) onImpact(h.x, h.y, 2.0, true);
            }
        }

        return null;
    }

    draw(ctx) {
        const grad = ctx.createLinearGradient(0, 0, 0, this.height);
        grad.addColorStop(0, this.meta.bgTop);
        grad.addColorStop(1, this.meta.bgBottom);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, this.width, this.height);

        this.drawThemeScenery(ctx);
        this.drawStadiumBackdrop(ctx);

        if (this.id === 'spinning_wheel' || this.id === 'centrifuge_rings') {
            ctx.save();
            ctx.translate(this.cx, this.cy - 6);
            ctx.rotate(this.wheelAngle);

            // Halo energético radial en el centro de la rueda
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const rGlow = ctx.createRadialGradient(0, 0, 10, 0, 0, 160);
            rGlow.addColorStop(0, 'rgba(255, 145, 0, 0.25)');
            rGlow.addColorStop(1, 'rgba(255, 145, 0, 0)');
            ctx.fillStyle = rGlow;
            ctx.beginPath();
            ctx.arc(0, 0, 160, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            ctx.strokeStyle = 'rgba(255, 145, 0, 0.24)';
            ctx.lineWidth = 12;
            for (let i = 0; i < 8; i++) {
                const a = (i / 8) * Math.PI * 2;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(Math.cos(a) * 232, Math.sin(a) * 232);
                ctx.stroke();
            }

            ctx.fillStyle = '#1e272c';
            ctx.beginPath();
            ctx.arc(0, 0, 42, 0, Math.PI * 2);
            ctx.fill();
            ctx.lineWidth = 5;
            ctx.strokeStyle = this.meta.themeColor;
            ctx.stroke();

            ctx.fillStyle = '#ffd600';
            const dirSign = this.wheelSpeed >= 0 ? 1 : -1;
            ctx.font = 'bold 24px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(dirSign > 0 ? '↻' : '↺', 0, 0);
            ctx.restore();
        }

        if (this.id === 'crusher_factory') {
            const pX = this.cx - 30;
            const pH = Math.max(10, this.crusherY - 65);
            ctx.fillStyle = '#37474f';
            ctx.fillRect(pX, 65, 60, pH);
            ctx.fillStyle = '#546e7a';
            ctx.fillRect(pX + 10, 65, 16, pH);
            ctx.fillStyle = '#263238';
            for (let y = 75; y < this.crusherY - 12; y += 18) {
                ctx.fillRect(pX + 4, y, 52, 4);
            }
            ctx.strokeStyle = '#11131a';
            ctx.lineWidth = 4;
            ctx.strokeRect(pX, 65, 60, pH);

            for (let x = this.cx - 85; x <= this.cx + 75; x += 22) {
                ctx.fillStyle = '#ff1744';
                ctx.beginPath();
                ctx.moveTo(x, this.crusherY + 10);
                ctx.lineTo(x + 11, this.crusherY + 30);
                ctx.lineTo(x + 22, this.crusherY + 10);
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = '#11131a';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }

        if (this.id === 'seesaw_lava') {
            ctx.fillStyle = '#263238';
            ctx.beginPath();
            ctx.moveTo(this.cx, this.cy + 45);
            ctx.lineTo(this.cx - 54, this.height);
            ctx.lineTo(this.cx + 54, this.height);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#11131a';
            ctx.lineWidth = 4;
            ctx.stroke();

            ctx.fillStyle = '#ff6d00';
            ctx.fillRect(this.cx - 6, this.cy + 70, 12, 50);
            ctx.fillStyle = '#ffd600';
            ctx.beginPath();
            ctx.arc(this.cx, this.cy + 48, 8, 0, Math.PI * 2);
            ctx.fill();
        }

        for (const b of this.bumpers) {
            ctx.save();
            ctx.translate(b.x, b.y);
            const r = b.r + (b.flash > 0 ? 5 : 0);

            // Shader de resplandor neón alrededor del bumper
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const bGlow = ctx.createRadialGradient(0, 0, r * 0.4, 0, 0, r * 1.9);
            bGlow.addColorStop(0, b.flash > 0 ? 'rgba(255,255,255,0.7)' : 'rgba(224, 64, 251, 0.35)');
            bGlow.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = bGlow;
            ctx.beginPath();
            ctx.arc(0, 0, r * 1.9, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.fillStyle = b.flash > 0 ? '#ffffff' : b.color;
            ctx.fill();
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#11131a';
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(0, 0, r * 0.62, 0, Math.PI * 2);
            ctx.fillStyle = '#1a0933';
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();

            ctx.fillStyle = '#ffd600';
            ctx.font = 'bold 15px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('★', 0, 1);
            ctx.restore();
        }

        if (this.bombBall) {
            const bb = this.bombBall;
            ctx.save();
            ctx.translate(bb.x, bb.y);
            ctx.rotate(bb.angle);
            const hot = Math.hypot(bb.vx, bb.vy) > 6.5;

            if (hot) {
                ctx.save();
                ctx.globalCompositeOperation = 'lighter';
                const hotGlow = ctx.createRadialGradient(0, 0, 8, 0, 0, bb.r * 1.8);
                hotGlow.addColorStop(0, 'rgba(255, 23, 68, 0.65)');
                hotGlow.addColorStop(1, 'rgba(255, 23, 68, 0)');
                ctx.fillStyle = hotGlow;
                ctx.beginPath();
                ctx.arc(0, 0, bb.r * 1.8, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            ctx.beginPath();
            ctx.arc(0, 0, bb.r, 0, Math.PI * 2);
            ctx.fillStyle = hot ? '#ff1744' : '#eceff1';
            ctx.fill();
            ctx.lineWidth = 3.5;
            ctx.strokeStyle = '#11131a';
            ctx.stroke();

            ctx.fillStyle = hot ? '#ffea00' : '#263238';
            ctx.fillRect(-8, -8, 16, 16);
            ctx.fillRect(-bb.r + 3, -4, 6, 8);
            ctx.fillRect(bb.r - 9, -4, 6, 8);
            ctx.fillRect(-4, -bb.r + 3, 8, 6);
            ctx.fillRect(-4, bb.r - 9, 8, 6);
            ctx.restore();
        }

        const segs = this.getSegments();
        for (const seg of segs) {
            if (seg.broken) continue;
            this.drawTexturedSegment(ctx, seg);
        }

        for (const saw of this.sawblades) {
            window.PixelSpriteRenderer.drawSawblade(ctx, saw.x, saw.y, saw.r, saw.angle);
        }

        for (const h of this.fallingHazards) {
            if (h.type === 'SAWS') {
                window.PixelSpriteRenderer.drawSawblade(ctx, h.x, h.y, h.r, h.angle);
            } else if (h.type === 'COWS') {
                ctx.save();
                ctx.translate(h.x, h.y);
                ctx.rotate(h.angle * 0.4);
                ctx.fillStyle = '#ff6d00';
                ctx.fillRect(-18, -18, 36, 36);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(-13, -10, 26, 18);
                ctx.fillStyle = '#11131a';
                ctx.fillRect(-9, -7, 8, 7);
                ctx.fillRect(3, -3, 7, 8);
                ctx.fillStyle = '#f48fb1';
                ctx.fillRect(9, -6, 6, 6);
                ctx.restore();
            } else {
                ctx.save();
                ctx.translate(h.x, h.y);
                ctx.fillStyle = '#ff3d00';
                ctx.fillRect(-h.r - 3, -h.r - 8, (h.r + 3) * 2, (h.r + 6) * 2);
                ctx.fillStyle = '#11131a';
                ctx.fillRect(-h.r, -h.r, h.r * 2, h.r * 2);
                ctx.fillStyle = Math.floor(this.time * 0.3) % 2 === 0 ? '#ff1744' : '#ffea00';
                ctx.fillRect(-h.r + 3, -h.r + 3, (h.r - 3) * 2, (h.r - 3) * 2);
                ctx.restore();
            }
        }

        // Shader de Lava / Ácido / Agua con resplandor térmico aditivo
        if (this.lavaLevel < this.height + 10) {
            this.drawLiquidShader(ctx);
        }
    }

    drawTexturedSegment(ctx, seg) {
        const dx = seg.x2 - seg.x1;
        const dy = seg.y2 - seg.y1;
        const len = Math.hypot(dx, dy);
        if (len < 1) return;

        const angle = Math.atan2(dy, dx);
        const thick = seg.thickness || 16;
        const halfT = thick * 0.5;
        const tex = seg.texture || 'steel_girder';

        if (this.id === 'suspension_bridge' && tex === 'wood') {
            const midX = (seg.x1 + seg.x2) * 0.5;
            const midY = (seg.y1 + seg.y2) * 0.5;
            ctx.strokeStyle = 'rgba(176, 190, 197, 0.45)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(midX, 68);
            ctx.lineTo(midX, midY);
            ctx.stroke();
        }

        ctx.save();
        ctx.translate(seg.x1, seg.y1);
        ctx.rotate(angle);

        ctx.fillStyle = '#11131a';
        ctx.fillRect(-3, -halfT - 3, len + 6, thick + 6);

        let baseColor = seg.color || '#90a4ae';
        if (tex === 'wood') baseColor = seg.color === '#ff3d00' ? '#bf360c' : '#8d6e63';
        else if (tex === 'volcano') baseColor = '#3e2723';
        else if (tex === 'ice') baseColor = '#4dd0e1';
        else if (tex === 'conveyor') baseColor = '#263238';
        else if (tex === 'steel_girder') baseColor = '#546e7a';
        else if (tex === 'gear') baseColor = '#33691e';

        ctx.fillStyle = baseColor;
        ctx.fillRect(0, -halfT, len, thick);

        if (tex === 'hazard') {
            ctx.fillStyle = '#ffd600';
            ctx.fillRect(0, -halfT, len, thick);
            ctx.fillStyle = '#1a1c24';
            const stripeW = 12;
            for (let x = 4; x < len - 6; x += stripeW * 2) {
                ctx.beginPath();
                ctx.moveTo(x, -halfT);
                ctx.lineTo(Math.min(len, x + stripeW), -halfT);
                ctx.lineTo(Math.max(0, x + stripeW - 6), halfT);
                ctx.lineTo(Math.max(0, x - 6), halfT);
                ctx.closePath();
                ctx.fill();
            }
        } else if (tex === 'conveyor') {
            const dir = seg.conveyorDir || 1;
            const offset = ((this.time * 2.2 * dir) % 24 + 24) % 24;
            ctx.fillStyle = '#ffab00';
            for (let x = offset; x < len - 8; x += 24) {
                ctx.fillRect(x, -halfT + 3, 6, 4);
                ctx.fillRect(x + (dir > 0 ? 4 : -4), -2, 6, 4);
                ctx.fillRect(x, halfT - 7, 6, 4);
            }
            ctx.fillStyle = '#90a4ae';
            ctx.fillRect(2, -halfT + 2, 8, thick - 4);
            ctx.fillRect(len - 10, -halfT + 2, 8, thick - 4);
        } else if (tex === 'wood') {
            ctx.fillStyle = '#5d4037';
            ctx.fillRect(0, -2, len, 2);
            ctx.fillRect(0, halfT - 4, len, 3);
            ctx.fillStyle = '#a1887f';
            ctx.fillRect(0, -halfT, len, 3);
            for (let x = 18; x < len - 8; x += 22) {
                ctx.fillStyle = '#3e2723';
                ctx.fillRect(x, -halfT, 3, thick);
                ctx.fillStyle = '#cfd8dc';
                ctx.fillRect(x + 5, -halfT + 2, 3, 3);
                ctx.fillRect(x + 5, halfT - 5, 3, 3);
            }
        } else if (tex === 'ice') {
            ctx.fillStyle = '#e0f7fa';
            ctx.fillRect(0, -halfT, len, 5);
            ctx.fillStyle = '#80deea';
            for (let x = 10; x < len - 14; x += 28) {
                ctx.fillRect(x, -halfT + 6, 14, 4);
                ctx.fillRect(x + 6, 1, 10, 3);
                ctx.fillStyle = '#b2ebf2';
                ctx.fillRect(x + 4, halfT + 2, 6, 7);
                ctx.fillRect(x + 6, halfT + 9, 3, 5);
                ctx.fillStyle = '#80deea';
            }
        } else if (tex === 'volcano') {
            ctx.fillStyle = '#212121';
            for (let x = 12; x < len - 12; x += 26) {
                ctx.fillRect(x, -halfT + 2, 20, thick - 4);
            }
            const glow = Math.floor(this.time * 0.15) % 2 === 0 ? '#ff6d00' : '#ffd600';
            ctx.fillStyle = glow;
            for (let x = 8; x < len - 10; x += 26) {
                ctx.fillRect(x, -halfT + 3, 3, thick - 6);
                ctx.fillRect(x - 4, 0, 10, 3);
            }
        } else if (tex === 'race_curb') {
            const blockW = 18;
            for (let x = 0; x < len; x += blockW) {
                const idx = Math.floor(x / blockW);
                const w = Math.min(blockW, len - x);
                if (seg.boosterSpeed) {
                    const pulse = Math.floor(x / blockW - this.time * 0.25) % 3 === 0;
                    ctx.fillStyle = pulse ? '#ffffff' : (idx % 2 === 0 ? '#00e5ff' : '#0277bd');
                } else {
                    ctx.fillStyle = idx % 2 === 0 ? '#ff1744' : '#eceff1';
                }
                ctx.fillRect(x, -halfT, w, thick);
            }
        } else if (tex === 'neon') {
            ctx.fillStyle = '#120724';
            ctx.fillRect(0, -halfT, len, thick);
            ctx.fillStyle = seg.color || '#00e5ff';
            ctx.fillRect(0, -halfT, len, 4);
            ctx.fillRect(0, halfT - 4, len, 4);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(4, -1.5, Math.max(0, len - 8), 3);
        } else {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
            ctx.fillRect(4, -halfT + 4, Math.max(0, len - 8), thick - 8);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
            for (let x = 10; x < len - 8; x += 18) {
                ctx.fillRect(x, -halfT + 2, 3, thick - 4);
                ctx.fillRect(x + 7, -2, 4, 4);
            }
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 0.24)';
        ctx.fillRect(0, -halfT, len, 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
        ctx.fillRect(0, halfT - 2, len, 2);

        ctx.fillStyle = '#cfd8dc';
        ctx.fillRect(2, -2, 4, 4);
        ctx.fillRect(Math.max(2, len - 6), -2, 4, 4);

        ctx.restore();
    }

    drawThemeScenery(ctx) {
        if (this.id === 'seesaw_lava') {
            // Shader de resplandor volcánico y volcanes en erupción
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const craterGlow = ctx.createRadialGradient(235, 230, 10, 235, 230, 190);
            craterGlow.addColorStop(0, 'rgba(255, 109, 0, 0.42)');
            craterGlow.addColorStop(0.5, 'rgba(255, 23, 68, 0.18)');
            craterGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = craterGlow;
            ctx.fillRect(40, 40, 400, 380);
            ctx.restore();

            ctx.fillStyle = 'rgba(22, 6, 6, 0.78)';
            ctx.beginPath();
            ctx.moveTo(70, this.height);
            ctx.lineTo(205, 225);
            ctx.lineTo(265, 225);
            ctx.lineTo(400, this.height);
            ctx.fill();

            // Lava desbordando por el cráter del volcán
            ctx.fillStyle = '#ff6d00';
            ctx.fillRect(215, 225, 40, 8);
            ctx.fillStyle = '#ffea00';
            ctx.fillRect(225, 225, 18, 18 + Math.sin(this.time * 0.15) * 6);

            // Chispas y pavesas incandescentes subiendo
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            for (let i = 0; i < 16; i++) {
                const ex = (i * 71 + Math.sin(this.time * 0.04 + i) * 35 + this.width) % this.width;
                const ey = this.height - ((i * 53 + this.time * 1.9) % 440);
                ctx.fillStyle = i % 2 === 0 ? '#ffab00' : '#ff3d00';
                ctx.fillRect(ex, ey, 5, 5);
            }
            ctx.restore();
        } else if (this.id === 'ice_glacier') {
            // Shader de AURORA BOREAL ondulante en el cielo ártico
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            for (let band = 0; band < 3; band++) {
                const grad = ctx.createLinearGradient(0, 40 + band * 25, 0, 190 + band * 30);
                const c1 = band === 0 ? 'rgba(0, 230, 118, 0.22)' : (band === 1 ? 'rgba(0, 229, 255, 0.18)' : 'rgba(213, 0, 249, 0.14)');
                grad.addColorStop(0, 'rgba(0,0,0,0)');
                grad.addColorStop(0.5, c1);
                grad.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = grad;

                for (let x = 0; x < this.width; x += 32) {
                    const waveY = Math.sin(x * 0.008 + this.time * 0.03 + band) * 24;
                    ctx.fillRect(x, 55 + band * 22 + waveY, 28, 95);
                }
            }
            ctx.restore();

            // Copos de nieve cayendo
            ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
            for (let i = 0; i < 18; i++) {
                const sx = (i * 73 + Math.sin(this.time * 0.03 + i) * 24 + this.width) % this.width;
                const sy = (i * 47 + this.time * 1.3) % this.height;
                ctx.fillRect(sx, sy, 4, 4);
            }
        } else if (this.id === 'pirate_galleon') {
            ctx.save();
            ctx.translate(this.cx, this.cy + 55);
            ctx.rotate(this.seesawAngle);
            ctx.fillStyle = '#4e342e';
            ctx.fillRect(-8, -260, 16, 260);
            ctx.strokeStyle = '#11131a';
            ctx.lineWidth = 3;
            ctx.strokeRect(-8, -260, 16, 260);

            const billow = Math.sin(this.time * 0.06) * 8;
            ctx.fillStyle = 'rgba(236, 239, 241, 0.20)';
            ctx.fillRect(-110 + billow, -220, 220, 115);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
            ctx.strokeRect(-110 + billow, -220, 220, 115);

            ctx.fillStyle = '#11131a';
            ctx.fillRect(8, -260, 44, 24);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(22, -254, 12, 12);
            ctx.restore();
        } else if (this.id === 'suspension_bridge') {
            ctx.strokeStyle = 'rgba(144, 164, 174, 0.38)';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(165, 70);
            ctx.quadraticCurveTo(this.cx, 250, this.width - 165, 70);
            ctx.stroke();
        } else if (this.id === 'pinball_dome' || this.id === 'cyber_lasers') {
            // Sol Synthwave segmentado + Rejilla 3D en movimiento
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const sunGrad = ctx.createLinearGradient(0, 160, 0, 320);
            sunGrad.addColorStop(0, 'rgba(255, 214, 0, 0.28)');
            sunGrad.addColorStop(0.5, 'rgba(255, 23, 68, 0.24)');
            sunGrad.addColorStop(1, 'rgba(224, 64, 251, 0.05)');
            ctx.fillStyle = sunGrad;
            ctx.beginPath();
            ctx.arc(this.cx, 255, 85, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Cortes horizontales scanline sobre el sol synthwave
            ctx.fillStyle = this.meta.bgBottom;
            for (let y = 265; y < 340; y += 12) {
                ctx.fillRect(this.cx - 90, y, 180, 4);
            }

            // Rejilla láser 3D en perspectiva animada
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.16)';
            ctx.lineWidth = 2;
            const scrollY = (this.time * 0.8) % 24;
            for (let y = 310 + scrollY; y < this.height; y += 24) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(this.width, y);
                ctx.stroke();
            }
            for (let x = -200; x <= this.width + 200; x += 90) {
                ctx.beginPath();
                ctx.moveTo(this.cx + (x - this.cx) * 0.25, 310);
                ctx.lineTo(x, this.height);
                ctx.stroke();
            }
        } else if (this.id === 'crusher_factory' || this.id === 'twin_gears') {
            // Sirenas industriales giratorias en la fábrica
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            for (const bx of [190, this.width - 190]) {
                const by = 82;
                const a = this.time * 0.08;
                const beamX = Math.cos(a) * 140;
                const beamY = Math.sin(a) * 140;
                const bGrad = ctx.createRadialGradient(bx, by, 4, bx, by, 75);
                bGrad.addColorStop(0, 'rgba(255, 171, 0, 0.38)');
                bGrad.addColorStop(1, 'rgba(255, 61, 0, 0)');
                ctx.fillStyle = bGrad;
                ctx.beginPath();
                ctx.moveTo(bx, by);
                ctx.lineTo(bx + beamX - 30, by + beamY);
                ctx.lineTo(bx + beamX + 30, by + beamY);
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();
        }
    }

    drawLiquidShader(ctx) {
        const isAcid = this.liquidType === 'acid';
        const isWater = this.liquidType === 'water';

        let coreColor = '#ffffff';
        let topColor = '#ffea00';
        let midColor = '#ff3d00';
        let bodyColor = 'rgba(183, 28, 28, 0.94)';
        let glowTop = 'rgba(255, 87, 34, 0.42)';
        let glowMid = 'rgba(255, 23, 68, 0.16)';

        if (isAcid) {
            coreColor = '#f4ff81';
            topColor = '#b2ff59';
            midColor = '#76ff03';
            bodyColor = 'rgba(27, 94, 32, 0.92)';
            glowTop = 'rgba(118, 255, 3, 0.36)';
            glowMid = 'rgba(0, 230, 118, 0.14)';
        } else if (isWater) {
            coreColor = '#e0f7fa';
            topColor = '#80d8ff';
            midColor = '#00b0ff';
            bodyColor = 'rgba(1, 87, 155, 0.90)';
            glowTop = 'rgba(0, 229, 255, 0.28)';
            glowMid = 'rgba(41, 121, 255, 0.10)';
        }

        // 1. SHADER DE RESPLANDOR TÉRMICO ADITIVO (Ilumina el aire y los coches sobre la lava/ácido/agua)
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const pulse = Math.sin(this.time * 0.08) * 14;
        const glowGrad = ctx.createLinearGradient(0, this.lavaLevel - 95 - pulse, 0, this.lavaLevel + 30);
        glowGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        glowGrad.addColorStop(0.65, glowMid);
        glowGrad.addColorStop(1, glowTop);
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, this.lavaLevel - 105, this.width, 135);
        ctx.restore();

        // 2. Tiburón animado con mandíbula en mapas de agua
        if (isWater) {
            ctx.save();
            ctx.translate(this.sharkX, this.lavaLevel - 6 + Math.sin(this.time * 0.12) * 3);
            if (this.sharkDir < 0) ctx.scale(-1, 1);
            ctx.fillStyle = '#37474f';
            ctx.beginPath();
            ctx.moveTo(-20, 12);
            ctx.lineTo(-4, -18);
            ctx.lineTo(16, 12);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#11131a';
            ctx.lineWidth = 2.5;
            ctx.stroke();
            // Ojo feroz del tiburón
            ctx.fillStyle = '#ff1744';
            ctx.fillRect(6, 2, 4, 3);
            ctx.restore();
        }

        // 3. Cuerpo profundo del fluido con gradiente de plasma
        const deepGrad = ctx.createLinearGradient(0, this.lavaLevel, 0, this.height);
        deepGrad.addColorStop(0, midColor);
        deepGrad.addColorStop(0.35, bodyColor);
        deepGrad.addColorStop(1, '#090a0f');
        ctx.fillStyle = deepGrad;
        ctx.fillRect(0, this.lavaLevel, this.width, this.height - this.lavaLevel + 24);

        // 4. Corrientes convectivas de plasma / cáusticas submarinas (Shader multi-octava)
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 18; i++) {
            const bx = (i * 58 + Math.sin(this.time * 0.04 + i * 0.7) * 28 + this.width) % this.width;
            const by = this.lavaLevel + 8 + ((i * 17 + Math.cos(this.time * 0.06 + i) * 8 + 30) % 32);
            const w = 18 + Math.sin(this.time * 0.1 + i) * 8;
            ctx.fillStyle = isWater ? 'rgba(128, 216, 255, 0.25)' : (isAcid ? 'rgba(178, 255, 89, 0.35)' : 'rgba(255, 234, 0, 0.42)');
            ctx.fillRect(bx, by, w, 4);
        }

        // Burbujas emergentes que crecen y estallan en la superficie
        for (const b of this.liquidBubbles) {
            b.yOffset -= b.speed;
            if (b.yOffset < -6) {
                b.yOffset = 34;
                b.x = Math.random() * this.width;
            }
            const bx = b.x + Math.sin(this.time * 0.08 + b.phase) * 6;
            const by = this.lavaLevel + b.yOffset;
            ctx.fillStyle = b.yOffset < 3 ? coreColor : topColor;
            const sz = b.yOffset < 3 ? b.r * 1.4 : b.r;
            ctx.fillRect(bx - sz * 0.5, by - sz * 0.5, sz, sz);
        }
        ctx.restore();

        // 5. Superficie de ondas de plasma de 3 octavas con núcleo incandescente
        const step = 14;
        for (let x = 0; x < this.width; x += step) {
            const w1 = Math.sin(this.time * 0.11 + x * 0.035) * 4.5;
            const w2 = Math.cos(this.time * 0.17 - x * 0.07) * 2.5;
            const waveY = Math.round(w1 + w2);

            ctx.fillStyle = midColor;
            ctx.fillRect(x, this.lavaLevel + waveY - 2, step, 10);
            ctx.fillStyle = topColor;
            ctx.fillRect(x, this.lavaLevel + waveY - 5, step - 1, 5);
            ctx.fillStyle = coreColor;
            ctx.fillRect(x + 2, this.lavaLevel + waveY - 6, step - 4, 2.5);
        }
    }

    drawStadiumBackdrop(ctx) {
        // 1. Reflectores volumétricos animados (oscilan iluminando la arena)
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 4; i++) {
            const lx = 150 + i * 220;
            const sway = Math.sin(this.time * 0.022 + i * 1.6) * 85;
            const beamGrad = ctx.createLinearGradient(lx, 0, lx + sway, this.height);
            beamGrad.addColorStop(0, 'rgba(255, 245, 157, 0.12)');
            beamGrad.addColorStop(0.6, 'rgba(0, 229, 255, 0.04)');
            beamGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = beamGrad;

            ctx.beginPath();
            ctx.moveTo(lx - 16, 0);
            ctx.lineTo(lx + 16, 0);
            ctx.lineTo(lx + sway + 115, this.height);
            ctx.lineTo(lx + sway - 115, this.height);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = 'rgba(255, 245, 157, 0.45)';
            ctx.fillRect(lx - 14, 4, 28, 6);
        }
        ctx.restore();

        // 2. Pantalla Gigante Jumbotron Pixel-Art con scanlines
        const jbW = 256;
        const jbH = 46;
        const jbX = this.cx - jbW * 0.5;
        const jbY = 12;
        ctx.fillStyle = 'rgba(10, 14, 26, 0.80)';
        ctx.fillRect(jbX, jbY, jbW, jbH);
        ctx.strokeStyle = this.suddenDeath ? '#ff1744' : 'rgba(255, 214, 0, 0.55)';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(jbX, jbY, jbW, jbH);

        for (let b = 0; b < 6; b++) {
            const bh = 6 + Math.abs(Math.sin(this.time * 0.20 + b)) * 20;
            ctx.fillStyle = this.suddenDeath ? '#ff1744' : '#00e5ff';
            ctx.fillRect(jbX + 10 + b * 8, jbY + jbH - 8 - bh, 5, bh);
            ctx.fillRect(jbX + jbW - 15 - b * 8, jbY + jbH - 8 - bh, 5, bh);
        }

        ctx.fillStyle = this.suddenDeath ? '#ff5252' : '#ffd600';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.suddenDeath ? '⚠ MUERTE SÚBITA ⚠' : `★ ${this.meta.name} ★`, this.cx, jbY + 16);
        ctx.fillStyle = 'rgba(255,255,255,0.68)';
        ctx.font = '9px monospace';
        ctx.fillText('STADIUM TV • EN VIVO 60FPS', this.cx, jbY + 32);

        // 3. Gradas del estadio con público vivo y flashes de cámaras fotográficas
        const bounceAmp = this.crowdExcitement > 0 ? 7.5 : 3.2;
        const bounceFreq = this.crowdExcitement > 0 ? 0.30 : 0.13;

        for (let row = 0; row < 4; row++) {
            const y = 104 + row * 48;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.30)';
            ctx.fillRect(0, y, this.width, 16);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
            ctx.fillRect(0, y, this.width, 2);

            for (let x = 24; x < this.width; x += 34) {
                const jump = Math.round(Math.sin(this.time * bounceFreq + x + row) * bounceAmp);
                ctx.fillStyle = (x + row) % 3 === 0
                    ? 'rgba(41, 121, 255, 0.25)'
                    : ((x + row) % 2 === 0 ? 'rgba(255, 23, 68, 0.25)' : 'rgba(255, 214, 0, 0.25)');
                ctx.fillRect(x, y - 10 + jump, 10, 10);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
                ctx.fillRect(x + 2, y - 15 + jump, 6, 5);
            }
        }

        // Flashes de cámaras fotográficas en el público (destellos estelares)
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (const cf of this.cameraFlashes) {
            if (cf.timer < 0) {
                const alpha = 1 - Math.abs(cf.timer + 4) / 4;
                ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, alpha * 0.75)})`;
                ctx.fillRect(cf.x - 10, cf.y - 2, 20, 4);
                ctx.fillRect(cf.x - 2, cf.y - 10, 4, 20);
                ctx.fillStyle = `rgba(0, 229, 255, ${Math.max(0, alpha * 0.5)})`;
                ctx.fillRect(cf.x - 5, cf.y - 5, 10, 10);
            }
        }
        ctx.restore();
    }
}

window.ARENA_CATALOG = ARENA_CATALOG;
window.ArenaInstance = ArenaInstance;
