import { CHARACTERS } from '../data/Characters.js';

/**
 * Preloads and manages game sprite textures, including every roster head.
 * Character heads are registered under the key `<characterId>:<expression>`.
 */
export class AssetLoader {
  constructor() {
    this.sprites = {};
    this.loaded = false;
  }

  buildManifest() {
    const manifest = [
      { key: 'stadium', src: 'assets/stadium.jpg' },
      { key: 'headIdle', src: 'assets/head_idle.png' },
      { key: 'headKick', src: 'assets/head_kick.png' },
      { key: 'headKo', src: 'assets/head_ko.png' },
      { key: 'torso', src: 'assets/torso.png' },
      { key: 'boot', src: 'assets/boot.png' },
      { key: 'ball', src: 'assets/ball.png' },
      { key: 'arm', src: 'assets/arm.png' }
    ];

    for (const char of CHARACTERS) {
      for (const [expr, src] of Object.entries(char.heads)) {
        manifest.push({ key: `${char.id}:${expr}`, src });
      }
    }
    return manifest;
  }

  load() {
    const manifest = this.buildManifest();
    return Promise.all(manifest.map(item => new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => {
        console.warn(`[AssetLoader] Failed to load ${item.src}`);
        resolve();
      };
      img.src = item.src;
      this.sprites[item.key] = img;
    }))).then(() => {
      this.loaded = true;
      return this.sprites;
    });
  }

  get(name) {
    return this.sprites[name];
  }

  /**
   * @param {string} characterId
   * @param {'idle'|'kick'|'ko'} expression
   */
  getHead(characterId, expression) {
    return this.sprites[`${characterId}:${expression}`] || this.sprites.headIdle;
  }
}
