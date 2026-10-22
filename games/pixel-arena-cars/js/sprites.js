// Catálogo Completo de 20 Vehículos Pixel-Art de Alta Definición, 8 Cascos y Renderizador con Textura Pixel-Bevel

const VEHICLE_CATALOG = [
    {
        id: 'monster',
        name: 'TRITURADOR 4X4',
        tier: 'COMÚN',
        cost: 0,
        special: 'Suspensión gigante aplasta-techos',
        desc: 'Llantas colosales y gran tracción para pasar por encima de cualquiera.',
        chassisWidth: 78,
        chassisHeight: 32,
        mass: 1.4,
        speed: 1.08,
        flipTorque: 1.18,
        suspensionStiffness: 0.36,
        rearWheel: { ox: -26, oy: 23, r: 20, style: 'monster' },
        frontWheel: { ox: 26, oy: 23, r: 20, style: 'monster' },
        headOffset: { ox: -3, oy: -22, r: 11 },
        pixelArt: [
            "       BBBBBBBBBB         ",
            "      BWWWWWWWWWWBB       ",
            "     BWLLLLWWWWWWWWB      ",
            "  BBBBWWWWWWWWWWWWWWBBBB  ",
            " BLLLLCCCCCCCCCCCCCCLLLLB ",
            "BCCCCYYYYCCCCCCCCYYYYCCCCB",
            "BCCCCCCYYYYCCCCYYYYCCCCCCB",
            "BDDDDDDDDCCCCCCCCDDDDDDDDB",
            " BGGGGGGGGGGGGGGGGGGGGGGGB",
            "  BBBBBBBBBBBBBBBBBBBBBB  "
        ]
    },
    {
        id: 'buggy',
        name: 'BUGGY DUNA',
        tier: 'COMÚN',
        cost: 0,
        special: 'Maestro de los mortales aéreos',
        desc: 'Jaula antivuelco ultra ligera; gira rapidísimo en el aire.',
        chassisWidth: 72,
        chassisHeight: 24,
        mass: 0.92,
        speed: 1.28,
        flipTorque: 1.48,
        suspensionStiffness: 0.32,
        rearWheel: { ox: -25, oy: 18, r: 16, style: 'offroad' },
        frontWheel: { ox: 26, oy: 18, r: 14, style: 'offroad' },
        headOffset: { ox: -2, oy: -18, r: 11 },
        pixelArt: [
            "     BBBBBBBBBB           ",
            "    BGGWWWWWWGGBB         ",
            "  BBBGGWWWWWWGGGGGBBBB    ",
            " BCCCLLLLCCCCCCCCLLLLCB   ",
            "BCYYYYCCCCCCCCCCCCCCYYCB  ",
            "BDDDDDDDDDDDDDDDDDDDDDDB  ",
            " BGGGGGGGGGGGGGGGGGGGGB   ",
            "  BBBBBBBBBBBBBBBBBBBB    "
        ]
    },
    {
        id: 'hotrod',
        name: 'HOT ROD V8',
        tier: 'COMÚN',
        cost: 0,
        special: 'Turbo de llamas + Motor V8',
        desc: 'Motor cromado sobrealimentado con aceleración explosiva.',
        chassisWidth: 82,
        chassisHeight: 26,
        mass: 1.18,
        speed: 1.35,
        flipTorque: 1.22,
        suspensionStiffness: 0.38,
        hasNitro: true,
        rearWheel: { ox: -27, oy: 17, r: 18, style: 'slick' },
        frontWheel: { ox: 28, oy: 19, r: 13, style: 'slick' },
        headOffset: { ox: -9, oy: -19, r: 11 },
        pixelArt: [
            "   BBBBBBBBB      GGGG    ",
            "  BWWWWWWWWWB    GLLLLG   ",
            "  BWLLLLWWWWB   BBBBBBBB  ",
            "BBCCCCCCCCCCCBBBGGGGGGGGB ",
            "BCFFYYYYCCCCCCCCGGGGCCCCCB",
            "BCCCFFFFYYYYCCCCCCCCCCCCCB",
            "BDDDDDDDDDDDDDDDDDDDDDDDDB",
            "BBBBBBBBBBBBBBBBBBBBBBBBBB"
        ]
    },
    {
        id: 'f1',
        name: 'TURBO F1',
        tier: 'COMÚN',
        cost: 0,
        special: 'Agarre magnético en loops y techos',
        desc: 'Alerones aerodinámicos que se pegan a las paredes curvas.',
        chassisWidth: 86,
        chassisHeight: 20,
        mass: 0.88,
        speed: 1.48,
        flipTorque: 1.38,
        suspensionStiffness: 0.44,
        hasNitro: true,
        downforce: 0.38,
        rearWheel: { ox: -28, oy: 13, r: 15, style: 'slick' },
        frontWheel: { ox: 29, oy: 13, r: 14, style: 'slick' },
        headOffset: { ox: -2, oy: -15, r: 10.5 },
        pixelArt: [
            "BBBB                      ",
            "BYYB     BBBBBB           ",
            "BCCB    BWWWWWWBB         ",
            "BCCCBBBBCCCCCCCCBBBBBB    ",
            "BCYYYYYYYYCCCCCCCCLLLLBBBB",
            "BDDDDDDDDDDDDDDDDDDDDDDDDB",
            "BBBBBBBBBBBBBBBBBBBBBBBBBB"
        ]
    },
    {
        id: 'motocross',
        name: 'MOTO EXTREMA',
        tier: 'COMÚN',
        cost: 0,
        special: 'Caballitos instantáneos y máxima agilidad',
        desc: 'Chasis ligero de motocross capaz de levantar el frente al instante.',
        chassisWidth: 64,
        chassisHeight: 22,
        mass: 0.78,
        speed: 1.42,
        flipTorque: 1.55,
        suspensionStiffness: 0.34,
        rearWheel: { ox: -22, oy: 16, r: 15, style: 'offroad' },
        frontWheel: { ox: 23, oy: 16, r: 15, style: 'offroad' },
        headOffset: { ox: -2, oy: -18, r: 10.5 },
        pixelArt: [
            "                BBBB      ",
            "    BBBB       BWWWWB     ",
            "  BBYYYYBBBBBBBCCCCCCBB   ",
            " BCCCCCCLLLLCCCCCCCCYYYB  ",
            "  BDDDDDGGGGGGGGDDDDDDB   ",
            "   BBBBBBBBBBBBBBBBBB     "
        ]
    },
    {
        id: 'police',
        name: 'PATRULLA V8',
        tier: 'COMÚN',
        cost: 0,
        special: 'Sirena policial activa + Interceptor Turbo',
        desc: 'Interceptor de alta velocidad con torreta luminosa y parachoques reforzado.',
        chassisWidth: 82,
        chassisHeight: 26,
        mass: 1.24,
        speed: 1.34,
        flipTorque: 1.20,
        suspensionStiffness: 0.40,
        hasNitro: true,
        hasSiren: true,
        rearWheel: { ox: -26, oy: 18, r: 15, style: 'slick' },
        frontWheel: { ox: 26, oy: 18, r: 15, style: 'slick' },
        headOffset: { ox: -3, oy: -19, r: 11 },
        pixelArt: [
            "        BBRRBBLLBB        ",
            "     BBBBWWWWWWWWBBBB     ",
            "    BWWWWWWWWWWWWWWWWB    ",
            " BBBDDDDDWWWWWWWWDDDDDBBB ",
            "BDDDDDDDDWWWWWWWWDDDDDDDDB",
            "BDDDDDDDDWWWWWWWWDDDDDDDDB",
            "BGGGGGGGGGGGGGGGGGGGGGGGGB",
            "BBBBBBBBBBBBBBBBBBBBBBBBBB"
        ]
    },
    {
        id: 'garbage',
        name: 'CAMIÓN BASURERO',
        tier: 'COMÚN',
        cost: 120,
        special: 'Compactador pesado blindado',
        desc: 'Caja trasera maciza que protege al piloto y empuja con gran tonelaje.',
        chassisWidth: 88,
        chassisHeight: 34,
        mass: 1.68,
        speed: 1.00,
        flipTorque: 0.98,
        suspensionStiffness: 0.42,
        rearWheel: { ox: -27, oy: 21, r: 18, style: 'industrial' },
        frontWheel: { ox: 27, oy: 21, r: 17, style: 'industrial' },
        headOffset: { ox: 14, oy: -20, r: 11 },
        pixelArt: [
            "BBBBBBBBBBBBBBBB  BBBBBB  ",
            "BEEEEEEEEEEEEEEB BWWWWWWB ",
            "BEGGGGGGGGGGGGEB BWWWWWWB ",
            "BEEEEEEEEEEEEEEBBBCCCCCCB ",
            "BEGGGGGGGGGGGGEBCCCCCCCCB ",
            "BDDDDDDDDDDDDDDDDDDDDDDDB ",
            "BBBBBBBBBBBBBBBBBBBBBBBBB "
        ]
    },
    {
        id: 'forklift',
        name: 'MONTACARGAS',
        tier: 'RARO',
        cost: 150,
        special: 'Horquilla delantera levanta-rivales',
        desc: 'Se mete debajo del coche enemigo y lo voltea de cabeza.',
        chassisWidth: 74,
        chassisHeight: 34,
        mass: 1.38,
        speed: 1.04,
        flipTorque: 1.1,
        suspensionStiffness: 0.4,
        hasForks: true,
        rearWheel: { ox: -23, oy: 20, r: 15, style: 'industrial' },
        frontWheel: { ox: 20, oy: 20, r: 15, style: 'industrial' },
        headOffset: { ox: -6, oy: -20, r: 11 },
        pixelArt: [
            "  BBBBBBBBBBBB    BBBB    ",
            "  BGGWWWWWWGGB    BGGB    ",
            "  BGGWWWWWWGGB    BGGB    ",
            "  BGGWWWWWWGGB    BGGB    ",
            "BBBCCCCCCCCCCBBBBBBGGB    ",
            "BYYYYCCCCCCCCYYYYCBGGB    ",
            "BCCCCCCCCCCCCCCCCCBGGBBBBB",
            "BDDDDDDDDDDDDDDDDDBGGGGGGG",
            "BBBBBBBBBBBBBBBBBBBBBBBBBB"
        ]
    },
    {
        id: 'sawcar',
        name: 'COCHE SIERRA',
        tier: 'RARO',
        cost: 200,
        special: 'Sierra circular activa en el parachoques',
        desc: 'Equipa una sierra giratoria frontal que rebota o liquida pilotos.',
        chassisWidth: 82,
        chassisHeight: 26,
        mass: 1.25,
        speed: 1.2,
        flipTorque: 1.18,
        suspensionStiffness: 0.38,
        frontSaw: { ox: 46, oy: 2, r: 15 },
        rearWheel: { ox: -26, oy: 18, r: 17, style: 'offroad' },
        frontWheel: { ox: 24, oy: 18, r: 16, style: 'offroad' },
        headOffset: { ox: -8, oy: -19, r: 11 },
        pixelArt: [
            "    BBBBBBBBBB            ",
            "   BWWWWWWWWWWB           ",
            "  BWLLLLWWWWWWWB   BBBB   ",
            " BBCCCCCCCCCCCCCBBBGGGGBB ",
            "BCYYYYCCCCCCCCYYYYCCCCCCCB",
            "BDDDDDDDDDDDDDDDDDDDDDDDDB",
            "BBBBBBBBBBBBBBBBBBBBBBBBBB"
        ]
    },
    {
        id: 'banana',
        name: 'BANANA SPLIT',
        tier: 'RARO',
        cost: 220,
        special: 'Rampa curva resbaladiza',
        desc: 'Diseño curvo en forma de plátano que actúa como rampa móvil.',
        chassisWidth: 84,
        chassisHeight: 22,
        mass: 0.96,
        speed: 1.36,
        flipTorque: 1.42,
        suspensionStiffness: 0.35,
        rearWheel: { ox: -26, oy: 15, r: 15, style: 'slick' },
        frontWheel: { ox: 26, oy: 15, r: 15, style: 'slick' },
        headOffset: { ox: 0, oy: -16, r: 11 },
        pixelArt: [
            "BB                      BB",
            "BYYBB    BBBBBBBB    BBYYB",
            "BYYYYBBBBWWWWWWWWBBBBYYYYB",
            " BYYYYYYYCCCCCCCCYYYYYYYB ",
            "  BYYYYYYYYYYYYYYYYYYYYB  ",
            "   BBBBBBBBBBBBBBBBBBBB   "
        ]
    },
    {
        id: 'bus',
        name: 'AUTOBÚS ESCOLAR',
        tier: 'RARO',
        cost: 240,
        special: 'Chasis extra largo anti-volcaduras',
        desc: 'Larguísimo autobús blindado difícil de volcar y excelente como barrera.',
        chassisWidth: 94,
        chassisHeight: 32,
        mass: 1.62,
        speed: 1.05,
        flipTorque: 0.95,
        suspensionStiffness: 0.40,
        rearWheel: { ox: -30, oy: 20, r: 16, style: 'industrial' },
        frontWheel: { ox: 30, oy: 20, r: 16, style: 'industrial' },
        headOffset: { ox: 12, oy: -20, r: 11 },
        pixelArt: [
            "BBBBBBBBBBBBBBBBBBBBBBBB  ",
            "BYYYYYYYYYYYYYYYYYYYYYYYB ",
            "BYWWBYWWBYWWBYWWBYWWBWWWB ",
            "BYYYYYYYYYYYYYYYYYYYYYYYBB",
            "BBBBBBBBBBBBBBBBBBBBBBBBYB",
            "BYYYYYYYYYYYYYYYYYYYYYYYYB",
            "BDDDDDDDDDDDDDDDDDDDDDDDDB",
            "BBBBBBBBBBBBBBBBBBBBBBBBBB"
        ]
    },
    {
        id: 'excavator',
        name: 'EXCAVADORA CAT',
        tier: 'RARO',
        cost: 260,
        special: 'Pala frontal + Orugas de alto agarre',
        desc: 'Levanta por los aires a los rivales con su pala hidráulica delantera.',
        chassisWidth: 84,
        chassisHeight: 32,
        mass: 1.58,
        speed: 1.02,
        flipTorque: 1.08,
        suspensionStiffness: 0.42,
        hasForks: true,
        rearWheel: { ox: -25, oy: 20, r: 17, style: 'tread' },
        frontWheel: { ox: 25, oy: 20, r: 17, style: 'tread' },
        headOffset: { ox: -4, oy: -21, r: 11 },
        pixelArt: [
            "      BBBBBBBB     BBBB   ",
            "     BYYYYYYYYB   BYYYB   ",
            "     BYWWWWWWYB  BBYYYB   ",
            "  BBBBYYYYYYYYBBBYYYYYB   ",
            " BYYYYYYYYYYYYYYYYYYYYBBBB",
            " BYYYYCCCCCCCCYYYYBGGGGGGG",
            " BDDDDDDDDDDDDDDDDBBBBBBBB",
            "  BBBBBBBBBBBBBBBB        "
        ]
    },
    {
        id: 'hotdog',
        name: 'HOT-DOG MÓVIL',
        tier: 'ÉPICO',
        cost: 280,
        special: 'Salchicha aerodinámica con rampa y turbo',
        desc: 'Bollo tostado con mostaza y turbo picante que se desliza bajo el enemigo.',
        chassisWidth: 88,
        chassisHeight: 26,
        mass: 1.08,
        speed: 1.38,
        flipTorque: 1.35,
        suspensionStiffness: 0.36,
        hasForks: true,
        hasNitro: true,
        rearWheel: { ox: -26, oy: 17, r: 15, style: 'slick' },
        frontWheel: { ox: 26, oy: 17, r: 15, style: 'slick' },
        headOffset: { ox: -2, oy: -18, r: 11 },
        pixelArt: [
            "    BBBBBBBBBBBBBBBBBB    ",
            "  BBFFFFFFFFFFFFFFFFFFBB  ",
            " BFFFFYYYYFFYYYYFFYYYYFFB ",
            "BFFFFFFFFFFFFFFFFFFFFFFFFB",
            " BYYYYYYYYYYYYYYYYYYYYYYB ",
            "  BDDDDDDDDDDDDDDDDDDDDB  ",
            "   BBBBBBBBBBBBBBBBBBBB   "
        ]
    },
    {
        id: 'tank',
        name: 'TANQUE GOLIATH',
        tier: 'ÉPICO',
        cost: 300,
        special: 'Dispara balas de cañón explosivas',
        desc: 'Blindaje pesado y cañón automático con retroceso físico.',
        chassisWidth: 84,
        chassisHeight: 32,
        mass: 1.75,
        speed: 0.94,
        flipTorque: 0.96,
        suspensionStiffness: 0.45,
        hasCannon: true,
        rearWheel: { ox: -27, oy: 20, r: 18, style: 'tread' },
        frontWheel: { ox: 27, oy: 20, r: 18, style: 'tread' },
        headOffset: { ox: -8, oy: -23, r: 11 },
        pixelArt: [
            "    BBBBBBBBBBBB          ",
            "   BGGGGCCCCCCCCBBBBBBBBBB",
            "  BGGGGCCCCCCCCCCCGGGGGGGB",
            " BBCCCCCCCCCCCCCCBBBBBBBBB",
            "BCLLLLCCCCCCCCLLLLCCCCCB  ",
            "BCGGGGGGGGGGGGGGGGGGGGCB  ",
            "BDDDDDDDDDDDDDDDDDDDDDDB  ",
            "BBBBBBBBBBBBBBBBBBBBBBBB  "
        ]
    },
    {
        id: 'wrecking',
        name: 'GRÚA DEMOLEDORA',
        tier: 'ÉPICO',
        cost: 340,
        special: 'Bola de demolición con cadena física',
        desc: 'Balancea una pesada bola con pinchos que aplasta cascos en el aire.',
        chassisWidth: 80,
        chassisHeight: 30,
        mass: 1.45,
        speed: 1.06,
        flipTorque: 1.15,
        suspensionStiffness: 0.38,
        hasWreckingBall: true,
        rearWheel: { ox: -26, oy: 20, r: 17, style: 'industrial' },
        frontWheel: { ox: 25, oy: 20, r: 17, style: 'industrial' },
        headOffset: { ox: 4, oy: -20, r: 11 },
        pixelArt: [
            "BYYB                      ",
            "BYYBB      BBBBBBBB       ",
            " BBYYBB   BWWWWWWWWB      ",
            "   BBYYBBBCCCCCCCCCCBBBB  ",
            "    BYYYYCCCCCCCCCCCCYYYB ",
            "    BCCCCCCCCCCCCCCCCCCCB ",
            "    BDDDDDDDDDDDDDDDDDDDB ",
            "    BBBBBBBBBBBBBBBBBBBBB "
        ]
    },
    {
        id: 'dump',
        name: 'CAMIÓN MAMUT',
        tier: 'ÉPICO',
        cost: 360,
        special: 'Peso colosal imparable',
        desc: 'El vehículo más pesado; empuja a cualquiera hacia las sierras o la lava.',
        chassisWidth: 90,
        chassisHeight: 34,
        mass: 1.9,
        speed: 0.96,
        flipTorque: 0.92,
        suspensionStiffness: 0.44,
        rearWheel: { ox: -29, oy: 22, r: 20, style: 'monster' },
        frontWheel: { ox: 28, oy: 22, r: 19, style: 'monster' },
        headOffset: { ox: 12, oy: -22, r: 11 },
        pixelArt: [
            "BBBBBBBBBBBBBB   BBBBBBB  ",
            "BYYYYYYYYYYYYB  BWWWWWWWB ",
            "BCCCCCCCCCCCCB  BWWWWWWWB ",
            "BCCCCCCCCCCCCBBBBCCCCCCCB ",
            "BYYYYYYYYYYYYCCCCCCCCCCCB ",
            "BDDDDDDDDDDDDDDDDDDDDDDDB ",
            "BBBBBBBBBBBBBBBBBBBBBBBBB "
        ]
    },
    {
        id: 'pirate',
        name: 'BARCO PIRATA',
        tier: 'LEGENDARIO',
        cost: 450,
        special: 'Flota sobre el agua/lava + Cañón naval',
        desc: 'Galeón con ruedas que flota en inundaciones y dispara cañonazos.',
        chassisWidth: 88,
        chassisHeight: 32,
        mass: 1.35,
        speed: 1.15,
        flipTorque: 1.2,
        suspensionStiffness: 0.36,
        floatsOnWater: true,
        hasCannon: true,
        rearWheel: { ox: -27, oy: 20, r: 16, style: 'wood' },
        frontWheel: { ox: 27, oy: 20, r: 16, style: 'wood' },
        headOffset: { ox: -8, oy: -22, r: 11 },
        pixelArt: [
            "BB        BBBB            ",
            "BYYB     BWWWWB         BB",
            "BCCCBB   BWWWWB       BBYB",
            "BCCCCCBBBBCCCCBBBBBBBBCCCB",
            " BCCCCYYYYGGGGYYYYCCCCCCB ",
            "  BDDDDDDDDDDDDDDDDDDDDB  ",
            "   BBBBBBBBBBBBBBBBBBBB   "
        ]
    },
    {
        id: 'ufo',
        name: 'OVNI ALIENÍGENA',
        tier: 'LEGENDARIO',
        cost: 520,
        special: 'Cañón de plasma + Antigravedad en loops y agua',
        desc: 'Platillo volador con ruedas de energía, cañón láser y agarre magnético.',
        chassisWidth: 84,
        chassisHeight: 26,
        mass: 1.05,
        speed: 1.40,
        flipTorque: 1.42,
        suspensionStiffness: 0.38,
        floatsOnWater: true,
        hasCannon: true,
        downforce: 0.42,
        rearWheel: { ox: -25, oy: 16, r: 15, style: 'slick' },
        frontWheel: { ox: 25, oy: 16, r: 15, style: 'slick' },
        headOffset: { ox: 0, oy: -17, r: 11 },
        pixelArt: [
            "        BBBBBBBBBB        ",
            "      BBWWWWWWWWWWBB      ",
            "    BBWWEEEEEEEEEEWWBB    ",
            "  BBGGGGGGGGGGGGGGGGGGGBB ",
            " BEEEEYYYYEEEEEEYYYYEEEEB ",
            "  BBDDDDDDDDDDDDDDDDDDBB  ",
            "    BBBBBBBBBBBBBBBBBB    "
        ]
    },
    {
        id: 'train',
        name: 'LOCOMOTORA VAPOR',
        tier: 'LEGENDARIO',
        cost: 560,
        special: 'Tumbaburros frontal + Caldera Turbo Imparable',
        desc: 'Bestia ferroviaria de hierro forjado que embiste y levanta a cualquier rival.',
        chassisWidth: 92,
        chassisHeight: 34,
        mass: 1.95,
        speed: 1.18,
        flipTorque: 0.96,
        suspensionStiffness: 0.45,
        hasForks: true,
        hasNitro: true,
        rearWheel: { ox: -29, oy: 21, r: 19, style: 'industrial' },
        frontWheel: { ox: 28, oy: 21, r: 17, style: 'industrial' },
        headOffset: { ox: -12, oy: -22, r: 11 },
        pixelArt: [
            "  BBBBBBBB         BBBB   ",
            "  BYYYYYYB         BRRB   ",
            "  BYWWWWYB        BGGGGB  ",
            "  BYYYYYYBBBBBBBBBBGGGGB  ",
            " BBCCCCCCDDDDDDDDDDDDDDDB ",
            "BCCCCCCCCDDDDYYYYDDDDDDDBB",
            "BDDDDDDDDDDDDDDDDDDDDDDRRB",
            "BBBBBBBBBBBBBBBBBBBBBBBBBB"
        ]
    },
    {
        id: 'trex',
        name: 'MECHA T-REX',
        tier: 'LEGENDARIO',
        cost: 600,
        special: 'Mandíbula mecánica + Salto sísmico',
        desc: 'Dinosaurio robótico gigante con sierra frontal en las fauces.',
        chassisWidth: 88,
        chassisHeight: 36,
        mass: 1.65,
        speed: 1.22,
        flipTorque: 1.26,
        suspensionStiffness: 0.4,
        frontSaw: { ox: 45, oy: -6, r: 14 },
        rearWheel: { ox: -28, oy: 23, r: 19, style: 'monster' },
        frontWheel: { ox: 26, oy: 23, r: 19, style: 'monster' },
        headOffset: { ox: -6, oy: -25, r: 11 },
        pixelArt: [
            "              BBBBBBBBBB  ",
            "             BCCCCCCCCRRB ",
            "            BCCCCCCCCCCCCB",
            "BB         BCCCCBBBBBBBBBB",
            "BCCBB     BCCCCB  WWWWWWW ",
            " BCCCBBBBBCCCCCCBBBBBBBB  ",
            "  BCCCCYYYYCCCCCCCCCCCCB  ",
            "   BDDDDDDDDDDDDDDDDDDB   ",
            "    BBBBBBBBBBBBBBBBBB    "
        ]
    }
];

const PLAYER_PALETTES = {
    1: {
        primary: '#2979FF',
        dark: '#1565C0',
        light: '#82B1FF',
        accent: '#FFD600',
        helmet: '#00E5FF',
        visor: '#0F172A',
        glow: 'rgba(41, 121, 255, 0.5)'
    },
    2: {
        primary: '#FF1744',
        dark: '#C62828',
        light: '#FF8A80',
        accent: '#FFEA00',
        helmet: '#FF3D00',
        visor: '#0F172A',
        glow: 'rgba(255, 23, 68, 0.5)'
    }
};

class PixelSpriteRenderer {
    static drawChassis(ctx, spec, playerNum, dir = 1, time = 0, isAccelerating = false, isReversing = false) {
        const pal = PLAYER_PALETTES[playerNum] || PLAYER_PALETTES[2];
        const rows = spec.pixelArt;
        const numRows = rows.length;
        const numCols = rows[0].length;
        const pw = spec.chassisWidth / numCols;
        const ph = spec.chassisHeight / numRows;

        ctx.save();
        if (dir < 0) {
            ctx.scale(-1, 1);
        }

        // Vibración mecánica del motor (más intensa al acelerar)
        const engineRumble = isAccelerating
            ? Math.sin(time * 1.45) * 1.15
            : Math.sin(time * 0.65) * 0.35;
        ctx.translate(0, engineRumble);

        const halfW = spec.chassisWidth * 0.5;
        const halfH = spec.chassisHeight * 0.5;
        const startX = -halfW;
        const startY = -halfH;

        // 1. Tubo de escape cromado trasero + Llamas de escape / Nitro
        ctx.fillStyle = '#37474f';
        ctx.fillRect(startX - 5, 1, 7, 6);
        ctx.fillStyle = '#cfd8dc';
        ctx.fillRect(startX - 4, 2, 5, 2);

        if (isAccelerating) {
            const baseFlame = spec.hasNitro ? 19 : 10;
            const flameLen = baseFlame + Math.sin(time * 1.2) * 6;
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const fGrad = ctx.createLinearGradient(startX - 4, 4, startX - 4 - flameLen * 1.4, 4);
            fGrad.addColorStop(0, spec.id === 'ufo' ? 'rgba(0, 230, 118, 0.85)' : 'rgba(255, 109, 0, 0.85)');
            fGrad.addColorStop(1, 'rgba(255, 23, 68, 0)');
            ctx.fillStyle = fGrad;
            ctx.fillRect(startX - 4 - flameLen * 1.3, -2, flameLen * 1.3, 12);
            ctx.restore();

            ctx.fillStyle = spec.id === 'ufo' ? '#00e676' : '#ff3d00';
            ctx.fillRect(startX - 4 - flameLen, 1, flameLen, 7);
            ctx.fillStyle = spec.id === 'ufo' ? '#b9f6ca' : '#ffea00';
            ctx.fillRect(startX - 4 - flameLen * 0.65, 2.5, flameLen * 0.65, 4);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(startX - 4 - flameLen * 0.3, 3.5, flameLen * 0.3, 2);
        }

        // 2. Halo antigravedad / Rayo tractor para el OVNI
        if (spec.id === 'ufo') {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const ufoGlow = ctx.createRadialGradient(0, halfH + 4, 4, 0, halfH + 6, 36);
            ufoGlow.addColorStop(0, 'rgba(0, 230, 118, 0.55)');
            ufoGlow.addColorStop(1, 'rgba(0, 230, 118, 0)');
            ctx.fillStyle = ufoGlow;
            ctx.fillRect(-38, halfH - 4, 76, 26);
            ctx.restore();
        }

        // 3. Cuerpo Pixel-Art con bisel 3D, reflejos en cristales y remaches
        for (let r = 0; r < numRows; r++) {
            const rowStr = rows[r];
            for (let c = 0; c < numCols; c++) {
                const ch = rowStr[c];
                if (ch === ' ') continue;
                if (ch === 'B') ctx.fillStyle = '#11131a';
                else if (ch === 'C') ctx.fillStyle = pal.primary;
                else if (ch === 'D') ctx.fillStyle = pal.dark;
                else if (ch === 'L') ctx.fillStyle = pal.light;
                else if (ch === 'Y') ctx.fillStyle = pal.accent;
                else if (ch === 'W') ctx.fillStyle = '#b3e5fc';
                else if (ch === 'G') ctx.fillStyle = '#90a4ae';
                else if (ch === 'F') ctx.fillStyle = '#ff6d00';
                else if (ch === 'R') ctx.fillStyle = '#ff1744';
                else if (ch === 'E') ctx.fillStyle = '#00e676';

                const px = Math.floor(startX + c * pw);
                const py = Math.floor(startY + r * ph);
                const bw = Math.ceil(pw);
                const bh = Math.ceil(ph);

                ctx.fillRect(px, py, bw, bh);

                if (ch !== 'B' && bw >= 3 && bh >= 3) {
                    // Brillo especular en parabrisas ('W')
                    if (ch === 'W' && (r + c) % 3 === 0) {
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
                        ctx.fillRect(px, py, bw - 1, bh - 1);
                    } else {
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
                        ctx.fillRect(px, py, bw, 1);
                        ctx.fillStyle = 'rgba(0, 0, 0, 0.26)';
                        ctx.fillRect(px, py + bh - 1, bw, 1);
                        if ((r + c) % 4 === 0 && (ch === 'C' || ch === 'G' || ch === 'D')) {
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
                            ctx.fillRect(px + 1, py + 1, 1.5, 1.5);
                        }
                    }
                }
            }
        }

        // 4. Sub-componentes mecánicos animados por vehículo
        if (spec.id === 'hotrod' || spec.id === 'monster' || spec.id === 'police') {
            // Supercargador V8 cromado vibrando sobre el cofre
            const blowerShake = isAccelerating ? Math.sin(time * 2.1) * 1.2 : 0;
            const bx = 10;
            const by = startY - 4 + blowerShake;
            ctx.fillStyle = '#11131a';
            ctx.fillRect(bx - 1, by - 1, 14, 7);
            ctx.fillStyle = '#eceff1';
            ctx.fillRect(bx, by, 12, 5);
            ctx.fillStyle = isAccelerating ? '#ff1744' : '#b71c1c';
            ctx.fillRect(bx + 9, by + 1, 3, 3);
        } else if (spec.id === 'trex') {
            // Mandíbula inferior mecánica mordiendo + Ojo láser brillante
            const jawDrop = isAccelerating ? Math.abs(Math.sin(time * 0.35)) * 5 : 1;
            ctx.fillStyle = '#11131a';
            ctx.fillRect(halfW - 18, -2 + jawDrop, 18, 6);
            ctx.fillStyle = pal.dark;
            ctx.fillRect(halfW - 16, -1 + jawDrop, 15, 4);
            ctx.fillStyle = '#ffffff';
            for (let tx = halfW - 14; tx < halfW - 2; tx += 4) {
                ctx.fillRect(tx, -3 + jawDrop, 2, 3);
            }
            // Ojo cibernético resplandeciente
            ctx.fillStyle = '#ff1744';
            ctx.fillRect(halfW - 12, startY + 3, 5, 4);
        } else if (spec.id === 'train') {
            // Biela lateral de locomotora en movimiento + Chimenea de vapor
            const rodX = Math.cos(time * 0.35) * 6;
            const rodY = Math.sin(time * 0.35) * 2;
            ctx.fillStyle = '#cfd8dc';
            ctx.fillRect(-16 + rodX, halfH - 5 + rodY, 32, 3);
            ctx.fillStyle = '#ff6d00';
            ctx.fillRect(0, 0, 8, 5);
        } else if (spec.hasForks && (spec.id === 'forklift' || spec.id === 'excavator')) {
            // Cuchilla hidráulica delantera con franjas de peligro
            ctx.fillStyle = '#11131a';
            ctx.fillRect(halfW - 2, halfH - 7, 13, 6);
            ctx.fillStyle = '#ffd600';
            ctx.fillRect(halfW - 1, halfH - 6, 11, 4);
        }

        // 5. Sirena policial animada con halo de luz aditivo
        if (spec.hasSiren) {
            const flash = Math.floor(time * 0.25) % 2 === 0;
            ctx.fillStyle = flash ? '#ff1744' : '#2979ff';
            ctx.fillRect(-7, startY - 4, 7, 5);
            ctx.fillStyle = flash ? '#2979ff' : '#ff1744';
            ctx.fillRect(0, startY - 4, 7, 5);

            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const sGlow = ctx.createRadialGradient(0, startY - 2, 2, 0, startY - 2, 28);
            sGlow.addColorStop(0, flash ? 'rgba(255, 23, 68, 0.55)' : 'rgba(41, 121, 255, 0.55)');
            sGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = sGlow;
            ctx.beginPath();
            ctx.arc(0, startY - 2, 28, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // 6. Faros delanteros con cono de luz volumétrico y luces de freno traseras
        ctx.fillStyle = '#FFF59D';
        ctx.fillRect(halfW - 4, -3, 4, 6);

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const beamGrad = ctx.createLinearGradient(halfW, 0, halfW + 52, 0);
        beamGrad.addColorStop(0, 'rgba(255, 245, 157, 0.32)');
        beamGrad.addColorStop(1, 'rgba(255, 245, 157, 0)');
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(halfW, -3);
        ctx.lineTo(halfW + 52, -16);
        ctx.lineTo(halfW + 52, 16);
        ctx.lineTo(halfW, 3);
        ctx.closePath();
        ctx.fill();

        if (isReversing) {
            ctx.fillStyle = '#ff1744';
            ctx.fillRect(startX, -3, 4, 6);
            const brakeGlow = ctx.createRadialGradient(startX, 0, 2, startX, 0, 18);
            brakeGlow.addColorStop(0, 'rgba(255, 23, 68, 0.65)');
            brakeGlow.addColorStop(1, 'rgba(255, 23, 68, 0)');
            ctx.fillStyle = brakeGlow;
            ctx.beginPath();
            ctx.arc(startX, 0, 18, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        ctx.restore();
    }

    static drawHelmet(ctx, x, y, radius, angle, playerNum, dir = 1, isDead = false, helmetId = 'classic') {
        const pal = PLAYER_PALETTES[playerNum] || PLAYER_PALETTES[2];
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        if (dir < 0) ctx.scale(-1, 1);

        const r = radius;
        const p = Math.max(2, Math.floor(r / 4));

        if (!isDead) {
            ctx.fillStyle = '#11131a';
            ctx.fillRect(-r * 0.85, r * 0.65, r * 1.7, r * 0.9);
            ctx.fillStyle = pal.primary;
            ctx.fillRect(-r * 0.65, r * 0.75, r * 1.3, r * 0.7);
        }

        ctx.fillStyle = '#11131a';
        ctx.fillRect(-r - 2, -r - 2, (r + 2) * 2, (r + 2) * 2);

        let baseColor = isDead ? '#616161' : pal.helmet;
        if (!isDead) {
            if (helmetId === 'astro') baseColor = '#eceff1';
            else if (helmetId === 'skull') baseColor = '#f5f5f5';
            else if (helmetId === 'knight') baseColor = '#b0bec5';
            else if (helmetId === 'cyborg') baseColor = '#37474f';
            else if (helmetId === 'shark') baseColor = '#0288d1';
        }
        ctx.fillStyle = baseColor;
        ctx.fillRect(-r, -r, r * 2, r * 2);

        ctx.fillStyle = 'rgba(0,0,0,0.22)';
        ctx.fillRect(-r, -r, r * 0.55, r * 2);

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(-r + p, -r, r * 2 - p * 2, p);

        let visorColor = isDead ? '#ff1744' : pal.visor;
        if (!isDead && helmetId === 'astro') visorColor = '#ffb300';
        ctx.fillStyle = visorColor;
        ctx.fillRect(-1, -r + p * 1.25, r + 1, p * 2.2);

        if (isDead) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(2, -2, 6, 2);
            ctx.fillRect(4, -4, 2, 6);
        } else {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(p * 0.8, -r + p * 1.45, p * 1.1, p * 0.75);

            if (helmetId === 'crown') {
                ctx.fillStyle = '#11131a';
                ctx.fillRect(-r - 1, -r - 9, r * 2 + 2, 8);
                ctx.fillStyle = '#ffd600';
                ctx.fillRect(-r + 1, -r - 7, r * 2 - 2, 6);
                ctx.fillStyle = '#ff1744';
                ctx.fillRect(-2, -r - 5, 4, 3);
            } else if (helmetId === 'viking') {
                ctx.fillStyle = '#fff8e1';
                ctx.fillRect(-r - 6, -r - 4, 6, 4);
                ctx.fillRect(-r - 8, -r - 8, 4, 5);
                ctx.fillRect(r, -r - 4, 6, 4);
                ctx.fillRect(r + 4, -r - 8, 4, 5);
            } else if (helmetId === 'cyborg') {
                ctx.fillStyle = '#ff1744';
                ctx.fillRect(2, -r + p * 1.6, r - 2, p * 1.2);
            } else if (helmetId === 'shark') {
                ctx.fillStyle = '#0288d1';
                ctx.fillRect(-4, -r - 8, 7, 7);
                ctx.fillRect(-6, -r - 11, 5, 4);
            } else if (helmetId === 'knight') {
                ctx.fillStyle = '#ff1744';
                ctx.fillRect(-r - 4, -r - 8, 8, 6);
            } else if (helmetId === 'skull') {
                ctx.fillStyle = '#11131a';
                ctx.fillRect(1, r - 4, 2, 4);
                ctx.fillRect(5, r - 4, 2, 4);
                ctx.fillRect(9, r - 4, 2, 4);
            }
        }

        ctx.restore();
    }

    static drawWheel(ctx, x, y, radius, angle, playerNum, style = 'offroad', spinSpeed = 0) {
        const pal = PLAYER_PALETTES[playerNum] || PLAYER_PALETTES[2];
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        const numTreads = style === 'monster' ? 10 : 8;
        const treadH = style === 'monster' ? 5 : (style === 'slick' ? 2 : 4);
        ctx.fillStyle = '#11131a';
        for (let i = 0; i < numTreads; i++) {
            const a = (i / numTreads) * Math.PI * 2;
            ctx.save();
            ctx.rotate(a);
            ctx.fillRect(-3.5, -radius - treadH * 0.5, 7, treadH);
            ctx.restore();
        }

        ctx.beginPath();
        ctx.arc(0, 0, radius - 1, 0, Math.PI * 2);
        ctx.fillStyle = style === 'wood' ? '#5d4037' : '#1e222f';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#11131a';
        ctx.stroke();

        // Relieve del neumático y desenfoque de velocidad al acelerar fuerte
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.78, 0, Math.PI * 2);
        ctx.strokeStyle = Math.abs(spinSpeed) > 0.2 ? 'rgba(255, 234, 0, 0.32)' : 'rgba(255,255,255,0.14)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Disco de freno interior ventilado
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.62, 0, Math.PI * 2);
        ctx.fillStyle = '#cfd8dc';
        ctx.fill();

        const rimR = radius * 0.44;
        ctx.fillStyle = pal.primary;
        ctx.fillRect(-rimR, -rimR, rimR * 2, rimR * 2);

        ctx.fillStyle = '#11131a';
        ctx.fillRect(-rimR, -2, rimR * 2, 4);
        ctx.fillRect(-2, -rimR, 4, rimR * 2);

        ctx.fillStyle = '#ffd600';
        ctx.fillRect(-2.5, -2.5, 5, 5);

        ctx.restore();
    }

    static drawSawblade(ctx, x, y, radius, angle) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        const teeth = 12;
        ctx.fillStyle = '#eceff1';
        ctx.strokeStyle = '#11131a';
        ctx.lineWidth = 2.5;

        ctx.beginPath();
        for (let i = 0; i < teeth * 2; i++) {
            const r = i % 2 === 0 ? radius + 5 : radius - 4;
            const a = (i / (teeth * 2)) * Math.PI * 2;
            const px = Math.cos(a) * r;
            const py = Math.sin(a) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.56, 0, Math.PI * 2);
        ctx.fillStyle = '#ff1744';
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#263238';
        ctx.fillRect(-5, -5, 10, 10);
        ctx.fillStyle = '#ffd600';
        ctx.fillRect(-2, -2, 4, 4);

        ctx.restore();
    }

    static drawWreckingBall(ctx, anchorX, anchorY, ballX, ballY, radius) {
        const links = 7;
        for (let i = 1; i < links; i++) {
            const t = i / links;
            const lx = anchorX + (ballX - anchorX) * t;
            const ly = anchorY + (ballY - anchorY) * t;
            ctx.fillStyle = '#11131a';
            ctx.fillRect(lx - 4, ly - 4, 8, 8);
            ctx.fillStyle = '#90a4ae';
            ctx.fillRect(lx - 2, ly - 2, 4, 4);
        }

        ctx.save();
        ctx.translate(ballX, ballY);

        ctx.fillStyle = '#11131a';
        for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2;
            const sx = Math.cos(a) * (radius + 3);
            const sy = Math.sin(a) * (radius + 3);
            ctx.fillRect(sx - 3, sy - 3, 6, 6);
        }

        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#37474f';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#11131a';
        ctx.stroke();

        ctx.fillStyle = '#90a4ae';
        ctx.fillRect(-radius * 0.45, -radius * 0.45, 6, 6);

        ctx.restore();
    }
}

window.VEHICLE_CATALOG = VEHICLE_CATALOG;
window.PLAYER_PALETTES = PLAYER_PALETTES;
window.PixelSpriteRenderer = PixelSpriteRenderer;
