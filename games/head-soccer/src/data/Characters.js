/**
 * Full 10-Character Roster definitions with authentic Head Soccer stats and unique abilities.
 */
export const CHARACTERS = [
  {
    id: 'kenta',
    name: 'Kenta',
    country: '🇯🇵',
    title: 'El Protagonista',
    heads: {
      idle: 'assets/head_idle.png',
      kick: 'assets/head_kick.png',
      ko: 'assets/head_ko.png'
    },
    head: { width: 106, pivotX: 0.48, pivotY: 0.86 },
    jerseyFilter: 'none',
    stats: { speed: 1.05, jump: 1.0, power: 1.05 },
    super: { type: 'fire', name: 'Tiro Dragón 🔥', colors: ['#ff3700', '#ffd000'] }
  },
  {
    id: 'luchador',
    name: 'El Toro',
    country: '🇲🇽',
    title: 'Luchador Enmascarado',
    heads: {
      idle: 'assets/characters/luchador_idle.png',
      kick: 'assets/characters/luchador_kick.png',
      ko: 'assets/characters/luchador_ko.png'
    },
    head: { width: 102, pivotX: 0.5, pivotY: 0.9 },
    jerseyFilter: 'hue-rotate(110deg) saturate(1.3)',
    stats: { speed: 0.95, jump: 1.0, power: 1.25 },
    super: { type: 'lucha', name: 'Plancha Volcánica 🌋', colors: ['#00c853', '#ffffff', '#ff1744'] }
  },
  {
    id: 'viking',
    name: 'Björn',
    country: '🇳🇴',
    title: 'Martillo del Norte',
    heads: {
      idle: 'assets/characters/viking_idle.png',
      kick: 'assets/characters/viking_kick.png',
      ko: 'assets/characters/viking_ko.png'
    },
    head: { width: 104, pivotX: 0.52, pivotY: 0.74 },
    jerseyFilter: 'hue-rotate(185deg) saturate(0.8) brightness(0.95)',
    stats: { speed: 0.92, jump: 1.1, power: 1.18 },
    super: { type: 'thunder', name: 'Rayo de Thor ⚡', colors: ['#7df9ff', '#ffffff', '#ffe600'] }
  },
  {
    id: 'samba',
    name: 'Joãozinho',
    country: '🇧🇷',
    title: 'Rey del Jogo Bonito',
    heads: {
      idle: 'assets/characters/samba_idle.png',
      kick: 'assets/characters/samba_kick.png',
      ko: 'assets/characters/samba_ko.png'
    },
    head: { width: 112, pivotX: 0.5, pivotY: 0.92 },
    jerseyFilter: 'hue-rotate(60deg) saturate(1.6) brightness(1.15)',
    stats: { speed: 1.2, jump: 1.05, power: 0.95 },
    super: { type: 'banana', name: 'Chanfle Tornado 🌪️', colors: ['#ffeb3b', '#00e676'] }
  },
  {
    id: 'ninja',
    name: 'Kage',
    country: '🥷',
    title: 'Sombra Ninja',
    heads: {
      idle: 'assets/characters/ninja_idle.png',
      kick: 'assets/characters/ninja_kick.png',
      ko: 'assets/characters/ninja_ko.png'
    },
    head: { width: 100, pivotX: 0.5, pivotY: 0.92 },
    jerseyFilter: 'hue-rotate(220deg) saturate(0.6) brightness(0.7)',
    stats: { speed: 1.15, jump: 1.2, power: 0.92 },
    super: { type: 'shadow', name: 'Warp Shuriken 🌀', colors: ['#7c4dff', '#1a1a2e', '#ff007f'] }
  },
  {
    id: 'cyborg',
    name: 'Cyborg-01',
    country: '🇩🇪',
    title: 'Mecha Striker',
    heads: {
      idle: 'assets/characters/cyborg_idle.png',
      kick: 'assets/characters/cyborg_kick.png',
      ko: 'assets/characters/cyborg_ko.png'
    },
    head: { width: 106, pivotX: 0.5, pivotY: 0.88 },
    jerseyFilter: 'grayscale(0.6) contrast(1.2)',
    stats: { speed: 1.08, jump: 0.95, power: 1.22 },
    super: { type: 'laser', name: 'Cañón Láser Hiperión 🤖', colors: ['#00f0ff', '#ffffff', '#ff0055'] }
  },
  {
    id: 'frost',
    name: 'Dr. Frost',
    country: '❄️',
    title: 'Rey del Hielo',
    heads: {
      idle: 'assets/characters/frost_idle.png',
      kick: 'assets/characters/frost_kick.png',
      ko: 'assets/characters/frost_ko.png'
    },
    head: { width: 108, pivotX: 0.5, pivotY: 0.88 },
    jerseyFilter: 'hue-rotate(160deg) saturate(1.4) brightness(1.1)',
    stats: { speed: 1.02, jump: 1.08, power: 1.05 },
    super: { type: 'frost', name: 'Ventisca Glacial (Freeze) 🧊', colors: ['#00ffff', '#e0ffff', '#0088ff'] }
  },
  {
    id: 'knight',
    name: 'Sir Arthur',
    country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    title: 'Paladín Dorado',
    heads: {
      idle: 'assets/characters/knight_idle.png',
      kick: 'assets/characters/knight_kick.png',
      ko: 'assets/characters/knight_ko.png'
    },
    head: { width: 108, pivotX: 0.5, pivotY: 0.86 },
    jerseyFilter: 'hue-rotate(200deg) brightness(1.1)',
    stats: { speed: 0.98, jump: 1.15, power: 1.14 },
    super: { type: 'paladin', name: 'Espada Excalibur ⚔️', colors: ['#ffd700', '#ffffff', '#ffaa00'] }
  },
  {
    id: 'anubis',
    name: 'Anubis',
    country: '🇪🇬',
    title: 'Guardián del Nilo',
    heads: {
      idle: 'assets/characters/anubis_idle.png',
      kick: 'assets/characters/anubis_kick.png',
      ko: 'assets/characters/anubis_ko.png'
    },
    head: { width: 112, pivotX: 0.5, pivotY: 0.86 },
    jerseyFilter: 'sepia(0.8) hue-rotate(35deg) brightness(0.9)',
    stats: { speed: 1.05, jump: 1.12, power: 1.1 },
    super: { type: 'anubis', name: 'Vórtice de las Pirámides 🏜️', colors: ['#ffd700', '#c8963e', '#1a1508'] }
  },
  {
    id: 'alien',
    name: 'Zog',
    country: '👽',
    title: 'Invasor Galáctico',
    heads: {
      idle: 'assets/characters/alien_idle.png',
      kick: 'assets/characters/alien_kick.png',
      ko: 'assets/characters/alien_ko.png'
    },
    head: { width: 110, pivotX: 0.5, pivotY: 0.86 },
    jerseyFilter: 'hue-rotate(85deg) saturate(1.5)',
    stats: { speed: 1.12, jump: 1.25, power: 0.95 },
    super: { type: 'alien', name: 'Agujero Negro Gravitacional 🛸', colors: ['#a855f7', '#06b6d4', '#ec4899'] }
  },
  {
    id: 'phoenix',
    name: 'Fénix Dorado',
    country: '🇪🇸',
    title: 'Señor del Fuego Eterno',
    heads: {
      idle: 'assets/characters/phoenix_idle.png',
      kick: 'assets/characters/phoenix_kick.png',
      ko: 'assets/characters/phoenix_ko.png'
    },
    head: { width: 115, pivotX: 0.5, pivotY: 0.88 },
    jerseyFilter: 'hue-rotate(340deg) saturate(1.8) brightness(1.2)',
    stats: { speed: 1.15, jump: 1.2, power: 1.2 },
    super: { type: 'phoenix', name: 'Alas del Fénix 🪽🔥', colors: ['#ff9100', '#ffd700', '#ff1744'] }
  },
  {
    id: 'poseidon',
    name: 'Poseidón',
    country: '🇬🇷',
    title: 'Rey de las Mareas',
    heads: {
      idle: 'assets/characters/poseidon_idle.png',
      kick: 'assets/characters/poseidon_kick.png',
      ko: 'assets/characters/poseidon_ko.png'
    },
    head: { width: 116, pivotX: 0.5, pivotY: 0.84 },
    jerseyFilter: 'hue-rotate(170deg) saturate(1.6) brightness(1.1)',
    stats: { speed: 1.05, jump: 1.1, power: 1.25 },
    super: { type: 'poseidon', name: 'Tsunami Hidro-Cañón 🌊🔱', colors: ['#00d4ff', '#0044ff', '#e0ffff'] }
  },
  {
    id: 'titan',
    name: 'Titán Sísmico',
    country: '🇮🇹',
    title: 'Muralla de Roca',
    heads: {
      idle: 'assets/characters/titan_idle.png',
      kick: 'assets/characters/titan_kick.png',
      ko: 'assets/characters/titan_ko.png'
    },
    head: { width: 114, pivotX: 0.5, pivotY: 0.88 },
    jerseyFilter: 'sepia(0.6) hue-rotate(330deg) brightness(0.85)',
    stats: { speed: 0.9, jump: 1.05, power: 1.35 },
    super: { type: 'titan', name: 'Fisura Terrestre 🪨💥', colors: ['#a8896c', '#ff5722', '#21130d'] }
  },
  {
    id: 'chrono',
    name: 'Chrono Warp',
    country: '🇨🇭',
    title: 'Amo del Tiempo',
    heads: {
      idle: 'assets/characters/chrono_idle.png',
      kick: 'assets/characters/chrono_kick.png',
      ko: 'assets/characters/chrono_ko.png'
    },
    head: { width: 112, pivotX: 0.5, pivotY: 0.86 },
    jerseyFilter: 'hue-rotate(280deg) saturate(1.7) brightness(1.15)',
    stats: { speed: 1.22, jump: 1.15, power: 1.05 },
    super: { type: 'chrono', name: 'Grieta Temporal ⏳⚡', colors: ['#00ffcc', '#7c4dff', '#ffffff'] }
  }
];

export function getCharacter(id) {
  return CHARACTERS.find(c => c.id === id) || CHARACTERS[0];
}
