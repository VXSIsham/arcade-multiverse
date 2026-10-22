// Motor de Físicas 2D Arcade v8 — Cuerpo Rígido Puro Estilo Box2D / Drive Ahead!
// Características clave v8:
// 1. CERO gravedad artificial o "imán al piso": al caer en La Rueda Loca o de un salto, el coche cae libremente
//    y pivota de forma 100% natural sobre la llanta que toca primero (usando masa efectiva Box2D: invMass + rCrossN² * invI).
// 2. El agarre magnético (downforce) en paredes y techos ahora es EXCLUSIVO de 2 vehículos especiales (Turbo F1 y OVNI).
//    Los otros 18 coches usan pura inercia centrífuga y gravedad natural (0.36).
// 3. Caballitos (Wheelies) físicos por palanca real de tracción (rCrossT = rx*ty - ry*tx): acelerar y hacer "Rocking"
//    transfiere el peso al eje trasero de forma orgánica.

class PhysicsCar {
    constructor(playerNum, spec, startX, startY, facingDir, helmetId = 'classic') {
        this.playerNum = playerNum;
        this.spec = spec;
        this.dir = facingDir; // 1 = derecha, -1 = izquierda
        this.helmetId = helmetId;

        this.x = startX;
        this.y = startY;
        this.vx = 0;
        this.vy = 0;
        this.angle = 0;
        this.va = 0;

        this.width = spec.chassisWidth;
        this.height = spec.chassisHeight;
        this.mass = spec.mass;
        this.invMass = 1 / spec.mass;
        // Momento de inercia físico 2D realista del chasis (evita que el coche se voltee solo al acelerar)
        this.inertia = spec.mass * 1450;
        this.invI = 1 / this.inertia;

        this.dead = false;
        this.input = 0;
        this.prevInput = 0;
        this.wheelieTimer = 0;
        this.turboTimer = 0;
        this.airRotation = 0;
        this.airTime = 0;
        this.spawnGrace = 12;
        this.cannonCooldown = 110 + Math.floor(Math.random() * 45);
        this.sawAngle = 0;

        this.armorParts = [
            { id: 'front_bumper', lx: this.width * 0.44, ly: 2, w: 8, h: 12, hp: 14, detached: false },
            { id: 'rear_spoiler', lx: -this.width * 0.42, ly: -8, w: 10, h: 8, hp: 12, detached: false }
        ];

        this.wheels = [
            this.createWheel(spec.rearWheel, true),
            this.createWheel(spec.frontWheel, false)
        ];

        this.head = {
            x: startX,
            y: startY - 20,
            r: spec.headOffset.r,
            vx: 0,
            vy: 0,
            angle: 0
        };

        this.wreckingBall = null;
        if (spec.hasWreckingBall) {
            this.wreckingBall = {
                x: startX - facingDir * 55,
                y: startY - 45,
                vx: 0,
                vy: 0,
                r: 14,
                chainLen: 66
            };
        }

        this.updatePositionsFromChassis();
    }

    createWheel(wSpec, isRear) {
        const restOy = Math.min(16, wSpec.oy);
        return {
            isRear,
            ox: wSpec.ox,
            oy: restOy,
            r: wSpec.r,
            style: wSpec.style || 'offroad',
            comp: 0,
            x: this.x + wSpec.ox * this.dir,
            y: this.y + restOy,
            vx: 0,
            vy: 0,
            angle: 0,
            va: 0,
            grounded: false,
            nx: 0,
            ny: -1
        };
    }

    localToWorld(lx, ly) {
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);
        return {
            x: this.x + (lx * this.dir) * cos - ly * sin,
            y: this.y + (lx * this.dir) * sin + ly * cos
        };
    }

    getWheelAnchor(w) {
        return this.localToWorld(w.ox, w.oy * 0.25);
    }

    getCraneAnchor() {
        return this.localToWorld(-34, -20);
    }

    getFrontSawPos() {
        if (!this.spec.frontSaw) return null;
        const pt = this.localToWorld(this.spec.frontSaw.ox, this.spec.frontSaw.oy);
        return { x: pt.x, y: pt.y, r: this.spec.frontSaw.r };
    }

    updatePositionsFromChassis() {
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);

        for (const w of this.wheels) {
            if (!this.dead) {
                const lx = w.ox * this.dir;
                const ly = w.oy - w.comp;
                w.x = this.x + lx * cos - ly * sin;
                w.y = this.y + lx * sin + ly * cos;

                const rx = w.x - this.x;
                const ry = w.y - this.y;
                w.vx = this.vx - this.va * ry;
                w.vy = this.vy + this.va * rx;
            }
        }

        if (!this.dead) {
            const hPt = this.localToWorld(this.spec.headOffset.ox, this.spec.headOffset.oy);
            this.head.x = hPt.x;
            this.head.y = hPt.y;
            this.head.angle = this.angle;
        }
    }

    getChassisOBB() {
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);
        return {
            cx: this.x,
            cy: this.y,
            hw: this.width * 0.5,
            hh: this.height * 0.5,
            ux: cos,
            uy: sin,
            vx: -sin,
            vy: cos
        };
    }
}

class PhysicsEngine {
    static normalizeAngle(a) {
        let n = (a + Math.PI) % (Math.PI * 2);
        if (n < 0) n += Math.PI * 2;
        return n - Math.PI;
    }

    static step(cars, arena, projectiles, dtScale = 1, callbacks = {}) {
        const { onImpact, onKO, onStuntFlip, onCannonFire, onPartDetached } = callbacks;
        const subSteps = 6;
        const dt = dtScale / subSteps;
        const gravity = 0.36; // Gravedad natural arcade (sin jalón artificial al caer)
        const isLoopArena = arena && ['loop_stadium', 'spinning_wheel', 'centrifuge_rings'].includes(arena.id);

        for (let step = 0; step < subSteps; step++) {
            // 1. Integrar fuerzas, gravedad natural y rotación en el aire
            for (const car of cars) {
                car.sawAngle += 0.36 * dt;
                if (car.turboTimer > 0) car.turboTimer -= dt;
                if (car.wheelieTimer > 0) car.wheelieTimer -= dt;
                if (car.spawnGrace > 0) car.spawnGrace -= dt;

                if (car.dead) {
                    car.head.vy += gravity * dt;
                    car.head.x += car.head.vx * dt;
                    car.head.y += car.head.vy * dt;
                    car.head.angle += 0.14 * dt;

                    for (const w of car.wheels) {
                        w.vy += gravity * dt;
                        w.x += w.vx * dt;
                        w.y += w.vy * dt;
                        w.angle += 0.2 * dt;
                    }
                }

                // Disparo automático de cañón (Tanque / Barco Pirata / OVNI)
                if (!car.dead && car.spec.hasCannon && step === 0) {
                    car.cannonCooldown -= dtScale;
                    if (car.cannonCooldown <= 0) {
                        car.cannonCooldown = 180 + Math.floor(Math.random() * 45);
                        const muzzle = car.localToWorld(car.width * 0.52, -6);
                        const fireAngle = car.angle + (car.dir < 0 ? Math.PI : 0);
                        const speed = 13.0;
                        projectiles.push({
                            ownerNum: car.playerNum,
                            x: muzzle.x,
                            y: muzzle.y,
                            vx: Math.cos(fireAngle) * speed + car.vx * 0.3,
                            vy: Math.sin(fireAngle) * speed - 1.2,
                            r: 8,
                            life: 160
                        });
                        car.vx -= Math.cos(fireAngle) * 2.2 * car.invMass;
                        car.vy -= Math.sin(fireAngle) * 1.2 * car.invMass;
                        car.va -= car.dir * 0.012;
                        if (onCannonFire) onCannonFire(muzzle.x, muzzle.y);
                    }
                }

                // Gravedad vertical pura
                car.vy += gravity * dt;

                const anyGrounded = car.wheels[0].grounded || car.wheels[1].grounded;

                // Control de rotación en el aire: SOLO cuando realmente llevas tiempo en el aire (car.airTime > 8),
                // nunca en micro-botes de piso para que acelerar jamás te voltee por accidente
                if (!car.dead && car.spawnGrace <= 0 && !anyGrounded && car.airTime > 8 && car.input !== 0) {
                    const boostMult = car.turboTimer > 0 ? 1.12 : 1.0;
                    const airTorque = 0.0020 * car.spec.flipTorque * boostMult;
                    car.va += (-car.input) * airTorque * dt;
                }

                if (!car.dead && car.input !== 0 && step === 0 && Math.random() < 0.25 && window.retroAudio) {
                    window.retroAudio.engineTick(Math.min(1, Math.hypot(car.vx, car.vy) / 7));
                }

                // Detección de Mortales en el Aire (Backflip / Frontflip)
                if (!car.dead) {
                    if (!anyGrounded) {
                        car.airTime += dt;
                        car.airRotation += car.va * dt;
                        if (Math.abs(car.airRotation) >= Math.PI * 1.80) {
                            const isBackflip = (car.airRotation * car.dir) < 0;
                            car.airRotation = 0;
                            car.turboTimer = 50;
                            if (onStuntFlip) onStuntFlip(car, isBackflip);
                        }
                    } else {
                        car.airTime = 0;
                        car.airRotation *= 0.82;
                    }
                }

                // Amortiguación angular suave
                car.va *= Math.pow(anyGrounded ? 0.90 : 0.990, dt);
                car.va = Math.max(-0.15, Math.min(0.15, car.va));
                car.vx *= Math.pow(0.995, dt);
                car.vy *= Math.pow(0.995, dt);

                // Topes de seguridad contra glitches de velocidad extrema
                car.vx = Math.max(-8.8, Math.min(8.8, car.vx));
                car.vy = Math.max(-6.8, Math.min(10.5, car.vy));

                car.x += car.vx * dt;
                car.y += car.vy * dt;
                car.angle += car.va * dt;

                for (const w of car.wheels) {
                    if (!w.grounded) {
                        w.comp *= Math.pow(0.82, dt);
                    }
                    if (!car.dead) {
                        if (car.input !== 0) {
                            w.va = car.input * 0.35 * car.spec.speed;
                        } else {
                            w.va *= Math.pow(0.92, dt);
                        }
                        w.angle += w.va * dt;
                    }
                    w.grounded = false;
                }

                car.updatePositionsFromChassis();

                // Bola de Demolición con cadena física
                if (car.wreckingBall) {
                    const wb = car.wreckingBall;
                    wb.vy += gravity * dt;
                    wb.vx *= Math.pow(0.994, dt);
                    wb.vy *= Math.pow(0.994, dt);
                    wb.x += wb.vx * dt;
                    wb.y += wb.vy * dt;

                    const anchor = car.getCraneAnchor();
                    const dx = wb.x - anchor.x;
                    const dy = wb.y - anchor.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist > wb.chainLen && dist > 0.001) {
                        const nx = dx / dist;
                        const ny = dy / dist;
                        const excess = dist - wb.chainLen;
                        wb.x -= nx * excess * 0.90;
                        wb.y -= ny * excess * 0.90;

                        const rvx = wb.vx - car.vx;
                        const rvy = wb.vy - car.vy;
                        const vn = rvx * nx + rvy * ny;
                        if (vn > 0) {
                            wb.vx -= nx * vn * 0.85;
                            wb.vy -= ny * vn * 0.85;
                            car.vx += nx * vn * 0.04;
                            if (ny > 0) car.vy += ny * vn * 0.04;
                        }
                    }
                }
            }

            // 2. Colisiones Simultáneas de Ruedas y Chasis contra la Arena (sin sesgo hacia la llanta trasera)
            const segments = arena.getSegments();
            for (const car of cars) {
                let sumNx = 0;
                let sumNy = 0;
                let sumSurfVx = 0;
                let sumSurfVy = 0;
                let sumFriction = 0;
                let maxBooster = 0;
                let groundedWheels = 0;

                // Primero recolectar contactos de TODAS las ruedas desde el mismo estado previo del chasis
                const skin = car.dead ? 0 : 1.4;
                const wheelContacts = [];
                for (const w of car.wheels) {
                    let bestSeg = null;
                    let bestHit = null;

                    for (const seg of segments) {
                        if (seg.broken) continue;
                        const thick = (seg.thickness || 8) * 0.5;
                        const hit = this.circleSegmentDistance(w.x, w.y, w.r + thick + skin, seg.x1, seg.y1, seg.x2, seg.y2);
                        if (hit.hit && (!bestHit || hit.pen > bestHit.pen)) {
                            bestHit = hit;
                            bestSeg = seg;
                        }
                    }

                    if (bestHit && bestSeg) {
                        wheelContacts.push({ w, seg: bestSeg, hit: bestHit });
                    }
                }

                // Resolver contactos de ruedas de forma simétrica (sin que la rueda 0 empuje antes que la rueda 1)
                if (wheelContacts.length > 0) {
                    const share = 1 / wheelContacts.length;
                    let totalDx = 0, totalDy = 0, totalDAngle = 0;
                    let totalDvx = 0, totalDvy = 0, totalDva = 0;

                    for (const wc of wheelContacts) {
                        const res = this.resolveWheelSegmentBox2D(car, wc.w, wc.seg, wc.hit, skin, isLoopArena, share, onImpact);
                        if (res) {
                            totalDx += res.dx;
                            totalDy += res.dy;
                            totalDAngle += res.dAngle;
                            totalDvx += res.dvx;
                            totalDvy += res.dvy;
                            totalDva += res.dva;

                            if (res.isFloor) {
                                sumNx += res.nx;
                                sumNy += res.ny;
                                sumSurfVx += res.surfVx;
                                sumSurfVy += res.surfVy;
                                sumFriction += res.friction;
                                if (res.boosterSpeed > maxBooster) maxBooster = res.boosterSpeed;
                                groundedWheels++;
                            }
                        }
                    }

                    if (!car.dead) {
                        car.x += totalDx;
                        car.y += totalDy;
                        car.angle += totalDAngle;
                        car.vx += totalDvx;
                        car.vy += totalDvy;
                        car.va += totalDva;
                        car.updatePositionsFromChassis();
                    }
                }

                // Tracción Tangencial Estable: acelerar hacia adelante planta el coche y NUNCA lo voltea solo
                if (!car.dead && groundedWheels > 0) {
                    const invG = 1 / groundedWheels;
                    const avgLen = Math.hypot(sumNx, sumNy) || 1;
                    const avgNx = sumNx / avgLen;
                    const avgNy = sumNy / avgLen;
                    const avgSurfVx = sumSurfVx * invG;
                    const avgSurfVy = sumSurfVy * invG;
                    const avgFriction = sumFriction * invG;

                    const tx = -avgNy;
                    const ty = avgNx;
                    const dirSign = avgNy > 0.55 ? -1 : 1;
                    const vt = (car.vx - avgSurfVx) * tx + (car.vy - avgSurfVy) * ty;

                    // Ángulo del chasis respecto a la pendiente actual del suelo
                    const surfaceAngle = Math.atan2(avgNx, -avgNy);
                    const relPitch = this.normalizeAngle(car.angle - surfaceAngle);

                    if (car.input !== 0) {
                        const boostMult = car.turboTimer > 0 ? 1.22 : 1.0;
                        const maxSpeed = 6.2 * car.spec.speed * boostMult;
                        const desiredVt = car.input * dirSign * maxSpeed;

                        const reversing = (vt * desiredVt) < -0.65 && Math.abs(vt) > 1.2;
                        const accelRate = (reversing ? 0.14 : 0.085) * avgFriction / Math.sqrt(car.mass);
                        const dv = (desiredVt - vt) * accelRate * dt;

                        car.vx += tx * dv;
                        // En rampas empinadas, moderar el empuje vertical para no salir disparado como cohete
                        const vyChange = ty * dv;
                        if (vyChange < 0 && !isLoopArena) {
                            car.vy += vyChange * Math.max(0, -avgNy * 0.55);
                        } else {
                            car.vy += vyChange;
                        }

                        // Cuánto está levantada la nariz en la dirección de avance actual
                        const noseUp = relPitch * (-car.input * dirSign);

                        if (reversing) {
                            // SOLO al hacer "Rocking" (cambio brusco de dirección) se levanta un caballito controlado
                            // con tope estricto a ~16° (0.28 rad) para jamás voltearse de espaldas en plano
                            if (noseUp < 0.28) {
                                const rockTorque = (0.0024 / Math.sqrt(car.mass)) * car.spec.flipTorque;
                                car.va += (-car.input * dirSign) * rockTorque * dt;
                            }
                        } else {
                            // Al darle solo hacia adelante (o atrás continuo): el coche se mantiene PLANTADO al piso.
                            // Si una llanta se levanta de más (> 5°), el propio peso del motor baja el frente suavemente.
                            if (noseUp > 0.08 && Math.abs(relPitch) < 0.85) {
                                car.va -= relPitch * 0.045 * dt;
                                if ((car.va * (-car.input * dirSign)) > 0) {
                                    car.va *= Math.pow(0.75, dt);
                                }
                            }
                        }

                        // EXCLUSIVO para los 2 coches con agarre magnético (Turbo F1 y OVNI Alienígena):
                        if (car.spec.downforce) {
                            const downforce = car.spec.downforce;
                            car.vx -= avgNx * downforce * dt;
                            car.vy -= avgNy * downforce * dt;
                        }
                    } else {
                        // Fricción de rodadura suave cuando sueltas el acelerador
                        const grip = 0.075 * avgFriction * dt;
                        car.vx -= tx * vt * grip;
                        car.vy -= ty * vt * grip;

                        if (car.spec.downforce) {
                            car.vx -= avgNx * (car.spec.downforce * 0.5) * dt;
                            car.vy -= avgNy * (car.spec.downforce * 0.5) * dt;
                        }
                    }

                    if (maxBooster > 0 && car.input !== 0) {
                        car.vx += tx * car.input * dirSign * maxBooster * 0.45 * dt;
                        car.vy += ty * car.input * dirSign * maxBooster * 0.45 * dt;
                        car.turboTimer = Math.max(car.turboTimer, 20);
                    }
                }

                // Parachoques superiores y techo del chasis
                const obb = car.getChassisOBB();
                const upperH = obb.hh * 0.35;
                const corners = [
                    { x: obb.cx - obb.ux * obb.hw - obb.vx * obb.hh, y: obb.cy - obb.uy * obb.hw - obb.vy * obb.hh },
                    { x: obb.cx + obb.ux * obb.hw - obb.vx * obb.hh, y: obb.cy + obb.uy * obb.hw - obb.vy * obb.hh },
                    { x: obb.cx + obb.ux * obb.hw + obb.vx * upperH, y: obb.cy + obb.uy * obb.hw + obb.vy * upperH },
                    { x: obb.cx - obb.ux * obb.hw + obb.vx * upperH, y: obb.cy - obb.uy * obb.hw + obb.vy * upperH }
                ];
                for (const corner of corners) {
                    let bestSeg = null;
                    let bestHit = null;
                    for (const seg of segments) {
                        if (seg.broken) continue;
                        const thick = (seg.thickness || 8) * 0.5;
                        const hit = this.circleSegmentDistance(corner.x, corner.y, 2 + thick, seg.x1, seg.y1, seg.x2, seg.y2);
                        if (hit.hit && (!bestHit || hit.pen > bestHit.pen)) {
                            bestHit = hit;
                            bestSeg = seg;
                        }
                    }
                    if (bestHit && bestSeg) {
                        this.resolveCornerSegment(car, corner, bestSeg, bestHit, onImpact);
                    }
                }

                if (car.wreckingBall) {
                    const wb = car.wreckingBall;
                    for (const seg of segments) {
                        if (seg.broken) continue;
                        const hit = this.circleSegmentDistance(wb.x, wb.y, wb.r + 4, seg.x1, seg.y1, seg.x2, seg.y2);
                        if (hit.hit) {
                            wb.x += hit.nx * hit.pen;
                            wb.y += hit.ny * hit.pen;
                            const vn = wb.vx * hit.nx + wb.vy * hit.ny;
                            if (vn < 0) {
                                wb.vx -= hit.nx * vn * 1.35;
                                wb.vy -= hit.ny * vn * 1.35;
                            }
                        }
                    }
                }

                car.updatePositionsFromChassis();

                // Cabeza del piloto contra segmentos de la arena -> ¡KO!
                if (!car.dead) {
                    for (const seg of segments) {
                        if (seg.broken) continue;
                        const hit = this.circleSegmentDistance(car.head.x, car.head.y, car.head.r, seg.x1, seg.y1, seg.x2, seg.y2);
                        if (hit.hit) {
                            if (onKO) onKO(car, hit.cx, hit.cy, 'IMPACTO CONTRA EL SUELO');
                            break;
                        }
                    }
                }
            }

            // 3. Proyectiles de Cañón
            for (let pIdx = projectiles.length - 1; pIdx >= 0; pIdx--) {
                const proj = projectiles[pIdx];
                proj.vy += gravity * 0.42 * dt;
                proj.x += proj.vx * dt;
                proj.y += proj.vy * dt;
                proj.life -= dt;

                let explode = proj.life <= 0;

                for (const seg of segments) {
                    if (seg.broken) continue;
                    const hit = this.circleSegmentDistance(proj.x, proj.y, proj.r + 4, seg.x1, seg.y1, seg.x2, seg.y2);
                    if (hit.hit) {
                        explode = true;
                        break;
                    }
                }

                if (!explode) {
                    for (const car of cars) {
                        if (car.playerNum === proj.ownerNum || car.dead) continue;
                        const dHead = Math.hypot(car.head.x - proj.x, car.head.y - proj.y);
                        if (dHead < car.head.r + proj.r + 4) {
                            explode = true;
                            if (onKO) onKO(car, proj.x, proj.y, 'CAÑONAZO DIRECTO');
                            break;
                        }
                        const obb = car.getChassisOBB();
                        const cHit = this.circleVsOBB(proj.x, proj.y, proj.r + 4, obb);
                        if (cHit.hit) {
                            explode = true;
                            car.vx += proj.vx * 0.35 * car.invMass;
                            car.vy = Math.max(-3.5, car.vy - 2.2 * car.invMass);
                            car.va += (proj.vx > 0 ? 0.035 : -0.035);
                            break;
                        }
                    }
                }

                if (explode) {
                    if (onImpact) onImpact(proj.x, proj.y, 1.6, true);
                    projectiles.splice(pIdx, 1);
                }
            }

            // 4. Peligros de la Arena
            if (step === subSteps - 1) {
                for (const car of cars) {
                    if (car.dead) continue;
                    const hazardHit = arena.checkHazards(car, onImpact);
                    if (hazardHit && onKO) {
                        onKO(car, hazardHit.x, hazardHit.y, hazardHit.reason);
                    }
                }
            }

            // 5. Colisiones Coche contra Coche
            for (let i = 0; i < cars.length; i++) {
                for (let j = i + 1; j < cars.length; j++) {
                    this.resolveCarVsCar(cars[i], cars[j], dt, onImpact, onKO, onPartDetached);
                }
            }
        }
    }

    static circleSegmentDistance(cx, cy, r, x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const lenSq = dx * dx + dy * dy;
        let t = 0;
        if (lenSq > 0.0001) {
            t = ((cx - x1) * dx + (cy - y1) * dy) / lenSq;
            t = Math.max(0, Math.min(1, t));
        }
        const px = x1 + t * dx;
        const py = y1 + t * dy;
        const distX = cx - px;
        const distY = cy - py;
        const dist = Math.hypot(distX, distY);
        if (dist < r) {
            const nx = dist > 0.0001 ? distX / dist : 0;
            const ny = dist > 0.0001 ? distY / dist : -1;
            return { hit: true, pen: r - dist, nx, ny, cx: px, cy: py, t };
        }
        return { hit: false };
    }

    static resolveWheelSegmentBox2D(car, w, seg, hit, skin, isLoopArena, share, onImpact) {
        if (car.dead) {
            w.x += hit.nx * hit.pen;
            w.y += hit.ny * hit.pen;
            const vn = w.vx * hit.nx + w.vy * hit.ny;
            if (vn < 0) {
                w.vx -= hit.nx * vn * 1.3;
                w.vy -= hit.ny * vn * 1.3;
            }
            return null;
        }

        const rx = w.x - car.x;
        const ry = w.y - car.y;
        const rCrossN = rx * hit.ny - ry * hit.nx;
        // Masa efectiva Box2D en el punto de contacto de la rueda
        const effMass = car.invMass + rCrossN * rCrossN * car.invI;

        let dx = 0, dy = 0, dAngle = 0;
        let dvx = 0, dvy = 0, dva = 0;

        const realPen = Math.max(0, hit.pen - skin);
        if (realPen > 0) {
            // Corrección de posición distribuida simétricamente entre las ruedas en contacto
            const posImpulse = (realPen * 0.72) / effMass;
            dx = hit.nx * (posImpulse * car.invMass) * share;
            dy = hit.ny * (posImpulse * car.invMass) * share;
            dAngle = rCrossN * (posImpulse * car.invI) * 0.55 * share;
            w.comp = Math.min(3.5, w.comp + realPen * 0.30);
        }

        const surfVx = seg.getSurfaceVx ? seg.getSurfaceVx(hit.cx, hit.cy) : (seg.vx || 0);
        const surfVy = seg.getSurfaceVy ? seg.getSurfaceVy(hit.cx, hit.cy) : (seg.vy || 0);

        // Velocidad real del punto de contacto de la llanta incluyendo la rotación del chasis
        const wheelVelX = (car.vx - car.va * ry) - surfVx;
        const wheelVelY = (car.vy + car.va * rx) - surfVy;
        const vn = wheelVelX * hit.nx + wheelVelY * hit.ny;

        const isDrivableFloor = hit.ny <= -0.38 || isLoopArena;

        if (vn < 0 && realPen > 0) {
            const bounce = Math.abs(vn) > 3.8 ? 0.14 : 0.02;
            const jn = -(1 + bounce) * vn / effMass;

            dvx = hit.nx * (jn * car.invMass) * share;
            dvy = hit.ny * (jn * car.invMass) * share;
            dva = rCrossN * (jn * car.invI) * share;

            if (Math.abs(vn) > 6.0 && onImpact) {
                onImpact(hit.cx, hit.cy, Math.abs(vn) * 0.15, false);
            }
            if (seg.onImpactDamage && Math.abs(vn) * car.mass > 6.5) {
                seg.onImpactDamage(Math.abs(vn) * car.mass);
            }
        }

        if (!isDrivableFloor) {
            return { isFloor: false, dx, dy, dAngle, dvx, dvy, dva };
        }

        w.grounded = true;
        w.nx = hit.nx;
        w.ny = hit.ny;

        if (seg.onWeightImpulse) {
            seg.onWeightImpulse(hit.cx, hit.cy, -hit.nx * 1.2 * share, -hit.ny * 1.2 * car.mass * share);
        }

        return {
            isFloor: true,
            dx,
            dy,
            dAngle,
            dvx,
            dvy,
            dva,
            nx: hit.nx,
            ny: hit.ny,
            surfVx,
            surfVy,
            friction: seg.friction !== undefined ? seg.friction : 1.0,
            boosterSpeed: seg.boosterSpeed || 0
        };
    }

    static resolveCornerSegment(car, corner, seg, hit, onImpact) {
        const rx = corner.x - car.x;
        const ry = corner.y - car.y;
        const rCrossN = rx * hit.ny - ry * hit.nx;
        const effMass = car.invMass + rCrossN * rCrossN * car.invI;

        const posImpulse = (hit.pen * 0.7) / effMass;
        car.x += hit.nx * (posImpulse * car.invMass);
        car.y += hit.ny * (posImpulse * car.invMass);
        car.angle += rCrossN * (posImpulse * car.invI) * 0.5;
        car.updatePositionsFromChassis();

        const surfVx = seg.getSurfaceVx ? seg.getSurfaceVx(hit.cx, hit.cy) : 0;
        const surfVy = seg.getSurfaceVy ? seg.getSurfaceVy(hit.cx, hit.cy) : 0;

        const velX = (car.vx - car.va * ry) - surfVx;
        const velY = (car.vy + car.va * rx) - surfVy;
        const vn = velX * hit.nx + velY * hit.ny;

        if (vn < 0) {
            const jn = -1.10 * vn / effMass;
            car.vx += hit.nx * (jn * car.invMass);
            const dyVel = hit.ny * (jn * car.invMass);
            car.vy += dyVel < 0 ? Math.max(-2.0, dyVel) : dyVel;
            car.va += rCrossN * (jn * car.invI) * 0.65;

            if (Math.abs(vn) > 5.0 && onImpact) {
                onImpact(hit.cx, hit.cy, Math.abs(vn) * 0.18, true);
            }
        }
    }

    static circleVsOBB(cx, cy, r, obb) {
        const dx = cx - obb.cx;
        const dy = cy - obb.cy;
        const localX = dx * obb.ux + dy * obb.uy;
        const localY = dx * obb.vx + dy * obb.vy;

        const clampedX = Math.max(-obb.hw, Math.min(obb.hw, localX));
        const clampedY = Math.max(-obb.hh, Math.min(obb.hh, localY));

        const closestX = obb.cx + clampedX * obb.ux + clampedY * obb.vx;
        const closestY = obb.cy + clampedX * obb.uy + clampedY * obb.vy;

        const distX = cx - closestX;
        const distY = cy - closestY;
        const dist = Math.hypot(distX, distY);

        if (dist < r) {
            let nx, ny;
            if (dist > 0.0001) {
                nx = distX / dist;
                ny = distY / dist;
            } else {
                nx = -obb.vx;
                ny = -obb.vy;
            }
            return { hit: true, pen: r - dist, nx, ny, px: closestX, py: closestY };
        }
        return { hit: false };
    }

    static resolveCarVsCar(c1, c2, dt, onImpact, onKO, onPartDetached) {
        const obb1 = c1.getChassisOBB();
        const obb2 = c2.getChassisOBB();

        // 0. Armas especiales (Bola de demolición y Sierra Frontal)
        for (const [attacker, defender, defObb] of [[c1, c2, obb2], [c2, c1, obb1]]) {
            if (attacker.dead || defender.dead) continue;

            if (attacker.wreckingBall) {
                const wb = attacker.wreckingBall;
                const dHead = Math.hypot(wb.x - defender.head.x, wb.y - defender.head.y);
                if (dHead < wb.r + defender.head.r) {
                    if (onKO) onKO(defender, defender.head.x, defender.head.y, 'BOLA DE DEMOLICIÓN');
                    return;
                }
                const hitCh = this.circleVsOBB(wb.x, wb.y, wb.r, defObb);
                if (hitCh.hit) {
                    defender.vx -= hitCh.nx * 0.8 * dt * defender.invMass;
                    defender.vy = Math.max(-2.8, defender.vy - hitCh.ny * 0.6 * dt * defender.invMass);
                    wb.vx += hitCh.nx * 3.5;
                    wb.vy += hitCh.ny * 3.5;
                    if (onImpact && Math.random() < 0.3) onImpact(hitCh.px, hitCh.py, 1.2, true);
                }
            }

            const fSaw = attacker.getFrontSawPos();
            if (fSaw) {
                const dHead = Math.hypot(fSaw.x - defender.head.x, fSaw.y - defender.head.y);
                if (dHead < fSaw.r + defender.head.r) {
                    if (onKO) onKO(defender, defender.head.x, defender.head.y, 'SIERRA FRONTAL');
                    return;
                }
                const hitCh = this.circleVsOBB(fSaw.x, fSaw.y, fSaw.r, defObb);
                if (hitCh.hit) {
                    defender.vy = Math.max(-3.0, defender.vy - 0.55 * dt);
                    defender.vx += attacker.dir * 0.55 * dt;
                    defender.va += attacker.dir * 0.008 * dt;
                    if (onImpact && Math.random() < 0.25) onImpact(hitCh.px, hitCh.py, 1.0, true);
                }
            }
        }

        // 1. Colisiones letales contra el casco del rival
        if (!c1.dead && !c2.dead) {
            for (const w of c1.wheels) {
                if (Math.hypot(w.x - c2.head.x, w.y - c2.head.y) < w.r + c2.head.r - 1) {
                    if (onKO) onKO(c2, c2.head.x, c2.head.y, 'LLANTAZO EN EL CASCO');
                    return;
                }
            }
            for (const w of c2.wheels) {
                if (Math.hypot(w.x - c1.head.x, w.y - c1.head.y) < w.r + c1.head.r - 1) {
                    if (onKO) onKO(c1, c1.head.x, c1.head.y, 'LLANTAZO EN EL CASCO');
                    return;
                }
            }

            const h2Hit = this.circleVsOBB(c2.head.x, c2.head.y, c2.head.r, obb1);
            if (h2Hit.hit) {
                if (onKO) onKO(c2, h2Hit.px, h2Hit.py, 'APLASTADO POR CHASIS');
                return;
            }

            const h1Hit = this.circleVsOBB(c1.head.x, c1.head.y, c1.head.r, obb2);
            if (h1Hit.hit) {
                if (onKO) onKO(c1, h1Hit.px, h1Hit.py, 'APLASTADO POR CHASIS');
                return;
            }

            const headDist = Math.hypot(c1.head.x - c2.head.x, c1.head.y - c2.head.y);
            if (headDist < c1.head.r + c2.head.r) {
                const mx = (c1.head.x + c2.head.x) * 0.5;
                const my = (c1.head.y + c2.head.y) * 0.5;
                if (c1.head.y < c2.head.y - 4) {
                    if (onKO) onKO(c2, mx, my, 'CABEZAZO AÉREO');
                } else if (c2.head.y < c1.head.y - 4) {
                    if (onKO) onKO(c1, mx, my, 'CABEZAZO AÉREO');
                } else {
                    const s1 = Math.hypot(c1.vx, c1.vy) * c1.mass;
                    const s2 = Math.hypot(c2.vx, c2.vy) * c2.mass;
                    if (onKO) onKO(s1 >= s2 ? c2 : c1, mx, my, 'CHOQUE DE CASCOS');
                }
                return;
            }
        }

        // 2. Ruedas contra Ruedas
        for (const w1 of c1.wheels) {
            for (const w2 of c2.wheels) {
                const dx = w2.x - w1.x;
                const dy = w2.y - w1.y;
                const dist = Math.hypot(dx, dy);
                const minDist = w1.r + w2.r;
                if (dist < minDist && dist > 0.001) {
                    const nx = dx / dist;
                    const ny = dy / dist;
                    const pen = minDist - dist;
                    c1.x -= nx * pen * 0.5;
                    c1.y -= ny * pen * 0.5;
                    c2.x += nx * pen * 0.5;
                    c2.y += ny * pen * 0.5;
                    c1.updatePositionsFromChassis();
                    c2.updatePositionsFromChassis();

                    const rvx = c2.vx - c1.vx;
                    const rvy = c2.vy - c1.vy;
                    const vn = rvx * nx + rvy * ny;
                    if (vn < 0) {
                        const j = -1.12 * vn * 0.5;
                        c1.vx -= nx * j;
                        c1.vy = Math.max(-3.2, c1.vy - ny * j * 0.5);
                        c2.vx += nx * j;
                        c2.vy = Math.max(-3.2, c2.vy + ny * j * 0.5);
                        const liftDir = c1.x < c2.x ? 1 : -1;
                        c1.va -= liftDir * Math.min(0.018, Math.abs(vn) * 0.0022);
                        c2.va += liftDir * Math.min(0.018, Math.abs(vn) * 0.0022);
                    }
                }
            }
        }

        // 3. Ruedas contra Chasis rival
        for (const [carA, carB, obbB] of [[c1, c2, obb2], [c2, c1, obb1]]) {
            for (const wA of carA.wheels) {
                const hit = this.circleVsOBB(wA.x, wA.y, wA.r, obbB);
                if (hit.hit) {
                    carA.x += hit.nx * hit.pen * 0.65;
                    carA.y += hit.ny * hit.pen * 0.65;
                    carB.x -= hit.nx * hit.pen * 0.35;
                    carB.y -= hit.ny * hit.pen * 0.35;
                    carA.updatePositionsFromChassis();
                    carB.updatePositionsFromChassis();
                    if (hit.ny < -0.25) {
                        wA.grounded = true;
                    }

                    const rvx = carA.vx - carB.vx;
                    const rvy = carA.vy - carB.vy;
                    const vn = rvx * hit.nx + rvy * hit.ny;
                    if (vn < 0) {
                        const j = -1.08 * vn;
                        carA.vx += hit.nx * j * 0.55;
                        carA.vy = Math.max(-2.8, carA.vy + hit.ny * j * 0.45);
                        carB.vx -= hit.nx * j * 0.45;
                        carB.vy = Math.max(-2.8, carB.vy - hit.ny * j * 0.45);
                        if (Math.abs(vn) > 4.5 && onImpact) onImpact(hit.px, hit.py, Math.abs(vn) * 0.16, true);
                    }

                    if (carA.input !== 0 && hit.ny < -0.2) {
                        const tx = -hit.ny;
                        const ty = hit.nx;
                        carA.vx += tx * carA.input * 0.16 * dt;
                        carA.vy = Math.max(-2.6, carA.vy + Math.max(0, ty * carA.input * 0.12 * dt));
                    }
                }
            }
        }

        // 4. Chasis contra Chasis
        const dx = c2.x - c1.x;
        const dy = c2.y - c1.y;
        const dist = Math.hypot(dx, dy);
        if (dist < (c1.width + c2.width) * 0.48) {
            const c1Corners = [
                { x: obb1.cx + obb1.ux * obb1.hw, y: obb1.cy + obb1.uy * obb1.hw },
                { x: obb1.cx - obb1.ux * obb1.hw, y: obb1.cy - obb1.uy * obb1.hw }
            ];
            for (const pt of c1Corners) {
                const hit = this.circleVsOBB(pt.x, pt.y, 10, obb2);
                if (hit.hit) {
                    const totalMass = c1.mass + c2.mass;
                    const r1 = c2.mass / totalMass;
                    const r2 = c1.mass / totalMass;
                    c1.x += hit.nx * hit.pen * r1;
                    c1.y += hit.ny * r1 * hit.pen;
                    c2.x -= hit.nx * hit.pen * r2;
                    c2.y -= hit.ny * r2 * hit.pen;
                    c1.updatePositionsFromChassis();
                    c2.updatePositionsFromChassis();

                    const rvx = c1.vx - c2.vx;
                    const rvy = c1.vy - c2.vy;
                    const vn = rvx * hit.nx + rvy * hit.ny;
                    if (vn < 0) {
                        const j = -1.15 * vn;
                        c1.vx += hit.nx * j * r1;
                        c1.vy = Math.max(-3.0, c1.vy + hit.ny * j * r1 * 0.5);
                        c2.vx -= hit.nx * j * r2;
                        c2.vy = Math.max(-3.0, c2.vy - hit.ny * j * r2 * 0.5);

                        if (c1.spec.hasForks || c1.spec.id === 'banana') {
                            c2.vy = Math.max(-3.6, c2.vy - 0.65 * dt);
                            c2.va += c1.dir * 0.012 * dt;
                        }
                        if (c2.spec.hasForks || c2.spec.id === 'banana') {
                            c1.vy = Math.max(-3.6, c1.vy - 0.65 * dt);
                            c1.va += c2.dir * 0.012 * dt;
                        }

                        if (Math.abs(vn) > 5.0) {
                            for (const car of [c1, c2]) {
                                for (const part of car.armorParts) {
                                    if (!part.detached) {
                                        part.hp -= Math.abs(vn);
                                        if (part.hp <= 0) {
                                            part.detached = true;
                                            const wp = car.localToWorld(part.lx, part.ly);
                                            if (onPartDetached) onPartDetached(wp.x, wp.y, car.playerNum);
                                        }
                                    }
                                }
                            }
                        }

                        if (Math.abs(vn) > 3.5 && onImpact) {
                            onImpact(hit.px, hit.py, Math.abs(vn) * 0.22, true);
                        }
                    }
                }
            }
        }
    }
}

window.PhysicsCar = PhysicsCar;
window.PhysicsEngine = PhysicsEngine;
