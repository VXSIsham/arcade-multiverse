import { CHARACTERS } from '../data/Characters.js';

/**
 * Coordinates all Arcade HUD elements, touch controls, match scoreboard,
 * character select modal, and optional floating debug panel.
 */
export class UIManager {
  /**
   * @param {import('../core/Skeleton.js').Skeleton} skeleton
   * @param {import('../animation/AnimationController.js').AnimationController} animController
   * @param {import('../audio/SoundManager.js').SoundManager} soundManager
   */
  constructor(skeleton, animController, soundManager) {
    this.skeleton = skeleton;
    this.animController = animController;
    this.soundManager = soundManager;

    this.onPlayActionCallbacks = [];
    this.onSelectPlayerCharCallbacks = [];
    this.onSelectRivalCharCallbacks = [];
    this.onRestartMatchCallbacks = [];
    this.onStartTournMatchCallbacks = [];
    this.onStartSurvivalCallbacks = [];
    this.onStartGoldenGoalCallbacks = [];
    this.onStartQuickMatchCallbacks = [];
    this.onStartLocal2PCallbacks = [];
    this.onToggle2PCallbacks = [];

    this.isMobileMode = ('ontouchstart' in window) || (window.innerWidth <= 900);
    this.isTwoPlayerMode = false;
    this.currentP1Char = CHARACTERS[0]; // Kenta 🇯🇵
    this.currentRivalChar = CHARACTERS[1]; // El Toro 🇲🇽

    this.toggles = {
      showBones: false,
      showJoints: false,
      showMesh: false,
      showHitboxes: false,
      showSkin: true,
      rival: true
    };

    this.initDOM();
  }

  onStartTournMatch(fn) {
    this.onStartTournMatchCallbacks.push(fn);
  }

  onStartSurvival(fn) {
    this.onStartSurvivalCallbacks.push(fn);
  }

  onStartGoldenGoal(fn) {
    this.onStartGoldenGoalCallbacks.push(fn);
  }

  onStartQuickMatch(fn) {
    this.onStartQuickMatchCallbacks.push(fn);
  }

  onStartLocal2P(fn) {
    this.onStartLocal2PCallbacks.push(fn);
  }

  onToggle2P(fn) {
    this.onToggle2PCallbacks.push(fn);
  }

  setTwoPlayerMode(enabled) {
    this.isTwoPlayerMode = !!enabled;
    const btn2P = document.getElementById('btnToggle2P');
    if (btn2P) {
      if (this.isTwoPlayerMode) {
        btn2P.textContent = '👥 2P Local: ON';
        btn2P.style.background = 'linear-gradient(135deg, rgba(0, 240, 255, 0.25), rgba(255, 55, 0, 0.25))';
        btn2P.style.borderColor = '#00f0ff';
        btn2P.style.boxShadow = '0 0 14px rgba(0, 240, 255, 0.55)';
      } else {
        btn2P.textContent = '👥 2P Local: OFF';
        btn2P.style.background = '';
        btn2P.style.borderColor = 'rgba(0, 240, 255, 0.6)';
        btn2P.style.boxShadow = '';
      }
    }
    this.setRivalInfo(this.currentRivalChar);
  }

  onPlayAction(fn) {
    this.onPlayActionCallbacks.push(fn);
  }

  onSelectPlayerCharacter(fn) {
    this.onSelectPlayerCharCallbacks.push(fn);
  }

  onSelectRivalCharacter(fn) {
    this.onSelectRivalCharCallbacks.push(fn);
  }

  onSelectBone(fn) {
    this.onSelectBoneCallbacks = this.onSelectBoneCallbacks || [];
    this.onSelectBoneCallbacks.push(fn);
  }

  onRestartMatch(fn) {
    this.onRestartMatchCallbacks.push(fn);
  }

  setActiveAnim(animName) {
    // Optionally log or highlight active animation state
  }

  updateTelemetry(speedKmH) {
    // Optionally update telemetry badges if visible
  }

  updateTimeline(animTime, duration) {
    // Optionally update timeline if visible
  }

  updateBoneInspector() {
    // Debugger inspector update
  }

  initDOM() {
    // 1. Audio toggle in header
    const audioBtn = document.getElementById('audioToggleBtn');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const isEnabled = this.soundManager.toggle();
        audioBtn.textContent = isEnabled ? '🔊 Audio: ON' : '🔇 Audio: OFF';
      });
    }

    // 2. Character Select Modal Open / Close
    const modal = document.getElementById('charSelectModal');
    const btnOpenRoster = document.getElementById('btnOpenRoster');
    const btnCloseRoster = document.getElementById('btnCloseRosterModal');

    if (btnOpenRoster && modal) {
      btnOpenRoster.addEventListener('click', () => {
        modal.classList.add('open');
        this.renderModalRoster();
      });
    }

    if (btnCloseRoster && modal) {
      btnCloseRoster.addEventListener('click', () => {
        modal.classList.remove('open');
      });
    }

    // Close modal on clicking outside or ESC
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
      });
    }

    // 2b. Tournament Modal Open / Close & Tab Switching
    const tournModal = document.getElementById('tournamentModal');
    const btnOpenTourn = document.getElementById('btnOpenTournaments');
    const btnCloseTourn = document.getElementById('btnCloseTournModal');

    if (btnOpenTourn && tournModal) {
      btnOpenTourn.addEventListener('click', () => {
        tournModal.classList.add('open');
      });
    }

    if (btnCloseTourn && tournModal) {
      btnCloseTourn.addEventListener('click', () => {
        tournModal.classList.remove('open');
      });
    }

    if (tournModal) {
      tournModal.addEventListener('click', (e) => {
        if (e.target === tournModal) tournModal.classList.remove('open');
      });
    }

    // Tournament Tabs Switching
    const tabBtns = document.querySelectorAll('.tourn-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.dataset.tab;
        document.querySelectorAll('.tourn-tab-content').forEach(c => c.classList.remove('active'));
        const activeContent = document.getElementById(`tabContent${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
        if (activeContent) activeContent.classList.add('active');
      });
    });

    // 2c. Mobile Mode & Fullscreen Toggles
    const btnMobile = document.getElementById('btnToggleMobile');
    if (this.isMobileMode) {
      document.body.classList.add('mobile-mode');
      if (btnMobile) btnMobile.textContent = '📱 Móvil: ON';
    }

    if (btnMobile) {
      btnMobile.addEventListener('click', () => {
        const isMob = document.body.classList.toggle('mobile-mode');
        this.isMobileMode = isMob;
        btnMobile.textContent = isMob ? '📱 Móvil: ON' : '📱 Móvil: OFF';
      });
    }

    const btnFs = document.getElementById('btnFullscreen');
    if (btnFs) {
      btnFs.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen?.().catch(() => {});
        } else {
          document.exitFullscreen?.().catch(() => {});
        }
      });
    }

    // 2d. Tournament Action Buttons
    const btnStartTournMatch = document.getElementById('btnStartTournMatch');
    if (btnStartTournMatch) {
      btnStartTournMatch.addEventListener('click', () => {
        if (tournModal) tournModal.classList.remove('open');
        this.onStartTournMatchCallbacks.forEach(fn => fn());
      });
    }

    const btnStartSurvival = document.getElementById('btnStartSurvival');
    if (btnStartSurvival) {
      btnStartSurvival.addEventListener('click', () => {
        if (tournModal) tournModal.classList.remove('open');
        this.onStartSurvivalCallbacks.forEach(fn => fn());
      });
    }

    const btnStartGolden = document.getElementById('btnStartGoldenGoal');
    if (btnStartGolden) {
      btnStartGolden.addEventListener('click', () => {
        if (tournModal) tournModal.classList.remove('open');
        this.onStartGoldenGoalCallbacks.forEach(fn => fn());
      });
    }

    const btnStartQuick = document.getElementById('btnStartQuickMatch');
    if (btnStartQuick) {
      btnStartQuick.addEventListener('click', () => {
        if (tournModal) tournModal.classList.remove('open');
        this.onStartQuickMatchCallbacks.forEach(fn => fn());
      });
    }

    const btnStartLocal2P = document.getElementById('btnStartLocal2P');
    if (btnStartLocal2P) {
      btnStartLocal2P.addEventListener('click', () => {
        if (tournModal) tournModal.classList.remove('open');
        this.onStartLocal2PCallbacks.forEach(fn => fn());
      });
    }

    const btnToggle2P = document.getElementById('btnToggle2P');
    if (btnToggle2P) {
      btnToggle2P.addEventListener('click', () => {
        this.onToggle2PCallbacks.forEach(fn => fn());
      });
    }

    // Trophy Claim Button
    const btnClaim = document.getElementById('btnClaimTrophy');
    if (btnClaim) {
      btnClaim.addEventListener('click', () => {
        this.hideTrophyModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (modal?.classList.contains('open')) modal.classList.remove('open');
        if (tournModal?.classList.contains('open')) tournModal.classList.remove('open');
        this.hideTrophyModal();
      }
      if ((e.key === 'c' || e.key === 'C') && !modal?.classList.contains('open') && !tournModal?.classList.contains('open')) {
        modal?.classList.add('open');
        this.renderModalRoster();
      }
      if ((e.key === 't' || e.key === 'T') && !modal?.classList.contains('open') && !tournModal?.classList.contains('open')) {
        tournModal?.classList.add('open');
      }
    });

    // 3. Floating Debug Panel Toggle
    const debugPanel = document.getElementById('floatingDebugPanel');
    const btnToggleDebug = document.getElementById('btnToggleDebug');
    const btnCloseDebug = document.getElementById('btnCloseDebug');

    if (btnToggleDebug && debugPanel) {
      btnToggleDebug.addEventListener('click', () => {
        debugPanel.classList.toggle('open');
      });
    }

    if (btnCloseDebug && debugPanel) {
      btnCloseDebug.addEventListener('click', () => {
        debugPanel.classList.remove('open');
      });
    }

    // Debug Toggles
    const bindToggle = (id, key) => {
      const el = document.getElementById(id);
      if (el) {
        el.checked = !!this.toggles[key];
        const update = () => { this.toggles[key] = el.checked; };
        el.addEventListener('change', update);
        el.addEventListener('input', update);
        el.addEventListener('click', update);
      }
    };
    bindToggle('dbgHitboxes', 'showHitboxes');
    bindToggle('dbgBones', 'showBones');
    bindToggle('dbgMesh', 'showMesh');
    bindToggle('dbgRival', 'rival');

    // Debug Sliders
    const sliderHead = document.getElementById('dbgSliderHead');
    if (sliderHead) {
      sliderHead.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.animController.headScaleMultiplier = val;
        document.getElementById('dbgValHead').textContent = val.toFixed(1) + 'x';
      });
    }

    const sliderSpeed = document.getElementById('dbgSliderSpeed');
    if (sliderSpeed) {
      sliderSpeed.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.animController.speed = val;
        document.getElementById('dbgValSpeed').textContent = val.toFixed(1) + 'x';
      });
    }

    // Goal Properties Dynamic Configuration
    const selNetStyle = document.getElementById('dbgNetStyle');
    if (selNetStyle) {
      selNetStyle.addEventListener('change', (e) => {
        window.stadiumRenderer?.setGoalProps({ netStyle: e.target.value });
      });
    }

    const selNetColor = document.getElementById('dbgNetColor');
    if (selNetColor) {
      selNetColor.addEventListener('change', (e) => {
        window.stadiumRenderer?.setGoalProps({ netColor: e.target.value });
      });
    }

    const chkGoalLed = document.getElementById('dbgGoalLed');
    if (chkGoalLed) {
      chkGoalLed.addEventListener('change', (e) => {
        window.stadiumRenderer?.setGoalProps({ ledSensors: e.target.checked });
      });
    }

    const chkGoalLaser = document.getElementById('dbgGoalLaser');
    if (chkGoalLaser) {
      chkGoalLaser.addEventListener('change', (e) => {
        window.stadiumRenderer?.setGoalProps({ laserLine: e.target.checked });
      });
    }

    const chkGoalVibe = document.getElementById('dbgGoalVibe');
    if (chkGoalVibe) {
      chkGoalVibe.addEventListener('change', (e) => {
        window.stadiumRenderer?.setGoalProps({ vibration: e.target.checked });
      });
    }

    // 4. Restart Match Button
    const btnRestart = document.getElementById('btnRestartMatch');
    if (btnRestart) {
      btnRestart.addEventListener('click', () => {
        this.onRestartMatchCallbacks.forEach(fn => fn());
      });
    }

    // 5. Arcade Action Buttons (Touch / Click)
    const bindActionBtn = (id, actionName) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('mousedown', (e) => {
          e.preventDefault();
          btn.blur();
          this.onPlayActionCallbacks.forEach(fn => fn(actionName));
        });
        btn.addEventListener('touchstart', (e) => {
          e.preventDefault();
          this.onPlayActionCallbacks.forEach(fn => fn(actionName));
        }, { passive: false });
      }
    };

    bindActionBtn('btnJump', 'jump');
    bindActionBtn('btnSuper', 'super_shot');
    bindActionBtn('btnDash', 'dash');

    // Prevent focus outline on buttons so Space key doesn't trigger button clicks
    document.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('focus', () => btn.blur());
    });

    // 6. Initial Render of Modal Roster
    this.renderModalRoster();
  }

  setPlayerInfo(char) {
    this.currentP1Char = char;
    const nameEl = document.getElementById('p1Name');
    const flagEl = document.getElementById('p1Flag');
    const superBtnName = document.getElementById('superBtnName');

    if (nameEl) nameEl.textContent = `${char.name.toUpperCase()} #10`;
    if (flagEl) flagEl.textContent = char.country;
    if (superBtnName) superBtnName.textContent = `🔥 ${char.super.name.toUpperCase()}`;

    this.renderModalRoster();
  }

  setRivalInfo(char) {
    this.currentRivalChar = char;
    const nameEl = document.getElementById('rivalName');
    const flagEl = document.getElementById('rivalFlag');

    const prefix = this.isTwoPlayerMode ? '🎮 P2: ' : '';
    if (nameEl) nameEl.textContent = `${prefix}${char.name.toUpperCase()} #7`;
    if (flagEl) flagEl.textContent = char.country;

    this.renderModalRoster();
  }

  setPlayerHp(hp, maxHp = 100) {
    const ratio = Math.max(0, Math.min(1, hp / maxHp));
    const lifeBar = document.getElementById('p1LifeBar');
    const ghostBar = document.getElementById('p1DamageGhost');
    const hpText = document.getElementById('p1HpText');

    if (lifeBar) {
      lifeBar.style.width = `${ratio * 100}%`;
      if (ratio < 0.35) {
        lifeBar.style.background = 'linear-gradient(90deg, #ff0044, #ff5500)';
      } else {
        lifeBar.style.background = 'linear-gradient(90deg, #00ff88, #ffd700)';
      }
    }

    if (ghostBar) {
      setTimeout(() => {
        ghostBar.style.width = `${ratio * 100}%`;
      }, 200);
    }

    if (hpText) {
      hpText.textContent = `${hp}/${maxHp}`;
    }
  }

  setRivalHp(hp, maxHp = 100) {
    const ratio = Math.max(0, Math.min(1, hp / maxHp));
    const lifeBar = document.getElementById('rivalLifeBar');
    const ghostBar = document.getElementById('rivalDamageGhost');
    const hpText = document.getElementById('rivalHpText');

    if (lifeBar) {
      lifeBar.style.width = `${ratio * 100}%`;
      if (ratio < 0.35) {
        lifeBar.style.background = 'linear-gradient(-90deg, #ff0044, #ff5500)';
      } else {
        lifeBar.style.background = 'linear-gradient(-90deg, #00ff88, #ffd700)';
      }
    }

    if (ghostBar) {
      setTimeout(() => {
        ghostBar.style.width = `${ratio * 100}%`;
      }, 200);
    }

    if (hpText) {
      hpText.textContent = `${hp}/${maxHp}`;
    }
  }

  setPowerMeter(ratio, isReady) {
    const p1Bar = document.getElementById('p1PowerBar');
    const p1Text = document.getElementById('p1PowerPct');
    const btnSuper = document.getElementById('btnSuper');

    if (p1Bar) {
      p1Bar.style.width = `${Math.min(1, ratio) * 100}%`;
      p1Bar.classList.toggle('ready', isReady);
    }

    if (p1Text) {
      p1Text.textContent = isReady ? '¡LISTO!' : `${Math.floor(ratio * 100)}%`;
      p1Text.style.color = isReady ? '#ffd700' : '#fff';
    }

    if (btnSuper) {
      btnSuper.classList.toggle('ready', isReady);
    }
  }

  setRivalPowerMeter(ratio, isReady) {
    const rivalBar = document.getElementById('rivalPowerBar');
    const rivalText = document.getElementById('rivalPowerPct');

    if (rivalBar) {
      rivalBar.style.width = `${Math.min(1, ratio) * 100}%`;
      rivalBar.classList.toggle('ready', isReady);
    }

    if (rivalText) {
      rivalText.textContent = isReady ? '¡LISTO!' : `${Math.floor(ratio * 100)}%`;
    }
  }

  setScore(p1Goals, rivalGoals) {
    const p1El = document.getElementById('p1Score');
    const rivalEl = document.getElementById('rivalScore');
    if (p1El) p1El.textContent = p1Goals;
    if (rivalEl) rivalEl.textContent = rivalGoals;
  }

  setMatchTimer(seconds) {
    const clock = document.getElementById('matchClock');
    if (clock) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      clock.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
      clock.style.color = seconds <= 10 ? '#ff3700' : '#fff';
    }
  }

  showGoalBanner(scorerName = '', scorerFlag = '⚽') {
    const banner = document.getElementById('goalBanner');
    if (banner) {
      if (scorerName) {
        banner.innerHTML = `<span style="font-size: 0.58em; display: block; color: #ffd700; text-shadow: 0 0 20px rgba(255,215,0,0.9); letter-spacing: 2px;">¡¡¡GOOOOOOLAZO!!!</span>${scorerFlag} ${scorerName.toUpperCase()}`;
      } else {
        banner.textContent = '¡¡¡GOOOOOOOLAZO!!! 🔥';
      }
      banner.classList.add('show');
      setTimeout(() => banner.classList.remove('show'), 2200);
    }
  }

  showMatchOver(title, subtitle) {
    const overlay = document.getElementById('matchOverBanner');
    const titleEl = document.getElementById('matchOverTitle');
    const subEl = document.getElementById('matchOverSub');
    if (overlay) {
      if (titleEl) titleEl.textContent = title;
      if (subEl) subEl.textContent = subtitle;
      overlay.classList.add('show');
    }
  }

  hideMatchOver() {
    const overlay = document.getElementById('matchOverBanner');
    if (overlay) overlay.classList.remove('show');
  }

  setDizzyActive(isActive) {
    const pill = document.getElementById('pillDizzy');
    if (pill) pill.style.display = isActive ? 'block' : 'none';
  }

  setStunActive(isActive) {
    this.setDizzyActive(isActive);
  }

  setKnockdownActive(isActive) {
    const pill = document.getElementById('pillKnockdown');
    if (pill) pill.style.display = isActive ? 'block' : 'none';
  }

  setRagdollActive(isActive) {
    this.setKnockdownActive(isActive);
  }

  renderModalRoster() {
    const grid = document.getElementById('modalRosterGrid');
    if (!grid) return;
    grid.innerHTML = '';

    CHARACTERS.forEach(char => {
      const isP1 = char.id === this.currentP1Char.id;
      const isRival = char.id === this.currentRivalChar.id;

      const card = document.createElement('div');
      card.className = 'modal-char-card' + (isP1 ? ' active-p1' : '') + (isRival ? ' active-rival' : '');

      const speedPct = Math.round((char.stats.speed / 1.3) * 100);
      const jumpPct = Math.round((char.stats.jump / 1.3) * 100);
      const powerPct = Math.round((char.stats.power / 1.3) * 100);

      card.innerHTML = `
        <div class="modal-char-avatar-box">
          <img src="${char.heads.idle}" alt="${char.name}">
        </div>

        <div class="modal-char-info">
          <div class="modal-char-name">${char.country} ${char.name}</div>
          <div class="modal-char-title">${char.title}</div>
          <div class="modal-super-badge">⚡ ${char.super.name}</div>
        </div>

        <div class="modal-stat-bars">
          <div class="stat-line">
            <span>Velocidad</span>
            <div class="stat-track"><div class="stat-fill" style="width: ${speedPct}%; background: #00f0ff;"></div></div>
          </div>
          <div class="stat-line">
            <span>Salto</span>
            <div class="stat-track"><div class="stat-fill" style="width: ${jumpPct}%; background: #ffd700;"></div></div>
          </div>
          <div class="stat-line">
            <span>Poder</span>
            <div class="stat-track"><div class="stat-fill" style="width: ${powerPct}%; background: #ff3700;"></div></div>
          </div>
        </div>

        <div class="modal-card-buttons">
          <button class="btn-card-choose p1${isP1 ? ' active' : ''}">
            ${isP1 ? '⭐ P1' : 'Elegir P1'}
          </button>
          <button class="btn-card-choose rival${isRival ? ' active' : ''}">
            ${this.isTwoPlayerMode ? (isRival ? '🎮 P2' : 'Elegir P2') : (isRival ? '🤖 CPU' : 'Elegir CPU')}
          </button>
        </div>
      `;

      card.querySelector('.btn-card-choose.p1').addEventListener('click', (e) => {
        e.stopPropagation();
        this.onSelectPlayerCharCallbacks.forEach(fn => fn(char.id));
        const m = document.getElementById('charSelectModal');
        if (m) m.classList.remove('open');
      });

      card.querySelector('.btn-card-choose.rival').addEventListener('click', (e) => {
        e.stopPropagation();
        this.onSelectRivalCharCallbacks.forEach(fn => fn(char.id));
        const m = document.getElementById('charSelectModal');
        if (m) m.classList.remove('open');
      });

      grid.appendChild(card);
    });
  }

  updateTournamentPill(title, icon = '🏆') {
    const pill = document.getElementById('hudTournamentPill');
    const textEl = document.getElementById('tournStatusText');
    const iconEl = pill?.querySelector('.tourn-icon');
    if (textEl) textEl.textContent = title;
    if (iconEl) iconEl.textContent = icon;
  }

  updateSurvivalStats(currentStreak, bestStreak) {
    const curEl = document.getElementById('survivalCurrentStreak');
    const bestEl = document.getElementById('survivalBestStreak');
    if (curEl) curEl.textContent = currentStreak.toString();
    if (bestEl) bestEl.textContent = bestStreak.toString();
  }

  renderTournamentBracket(bracket, currentRound = 0) {
    const container = document.getElementById('bracketTreeRoot');
    const titleEl = document.getElementById('bracketRoundTitle');
    const actionBtn = document.getElementById('btnStartTournMatch');
    if (!container || !bracket) return;

    const roundNames = ['CUARTOS DE FINAL', 'SEMIFINAL', 'GRAN FINAL', '¡CAMPEÓN MUNDIAL!'];
    if (titleEl) {
      titleEl.textContent = `ESTADO: ${roundNames[Math.min(3, currentRound)]}`;
    }

    if (actionBtn) {
      if (currentRound === 0) actionBtn.textContent = '⚔️ ¡JUGAR CUARTOS DE FINAL!';
      else if (currentRound === 1) actionBtn.textContent = '🔥 ¡JUGAR SEMIFINAL!';
      else if (currentRound === 2) actionBtn.textContent = '👑 ¡JUGAR GRAN FINAL!';
      else actionBtn.textContent = '🏆 ¡COPA CONQUISTADA!';
      actionBtn.style.display = currentRound >= 3 ? 'none' : 'block';
    }

    const renderTeamSlot = (team, score, isWinner, isUser) => {
      if (!team) {
        return `<div class="bracket-team-slot placeholder"><span>Por Definir...</span></div>`;
      }
      return `
        <div class="bracket-team-slot${isWinner ? ' winner' : ''}${isUser ? ' is-user' : ''}">
          <span class="slot-flag">${team.country}</span>
          <span class="slot-name">${team.name}</span>
          <span class="slot-score">${score !== null ? score : '-'}</span>
        </div>
      `;
    };

    container.innerHTML = `
      <!-- Column 1: Cuartos de Final -->
      <div class="bracket-column">
        <div class="bracket-col-header">CUARTOS</div>
        <div class="bracket-col-matches">
          ${bracket.qf.map(m => `
            <div class="bracket-match-card${m.isPlayer ? ' player-match' : ''}">
              ${renderTeamSlot(m.teamA, m.scoreA, m.winner === m.teamA, m.teamA?.id === this.currentP1Char.id)}
              <div class="bracket-vs-divider">VS</div>
              ${renderTeamSlot(m.teamB, m.scoreB, m.winner === m.teamB, m.teamB?.id === this.currentP1Char.id)}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Column 2: Semifinales -->
      <div class="bracket-column">
        <div class="bracket-col-header">SEMIFINAL</div>
        <div class="bracket-col-matches spread">
          ${bracket.sf.map(m => `
            <div class="bracket-match-card${m.isPlayer ? ' player-match' : ''}">
              ${renderTeamSlot(m.teamA, m.scoreA, m.winner === m.teamA, m.teamA?.id === this.currentP1Char.id)}
              <div class="bracket-vs-divider">VS</div>
              ${renderTeamSlot(m.teamB, m.scoreB, m.winner === m.teamB, m.teamB?.id === this.currentP1Char.id)}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Column 3: Gran Final -->
      <div class="bracket-column final-col">
        <div class="bracket-col-header" style="color: #ffd700;">GRAN FINAL</div>
        <div class="bracket-col-matches centered">
          ${bracket.fn.map(m => `
            <div class="bracket-match-card gold-border${m.isPlayer ? ' player-match' : ''}">
              ${renderTeamSlot(m.teamA, m.scoreA, m.winner === m.teamA, m.teamA?.id === this.currentP1Char.id)}
              <div class="bracket-vs-divider gold">👑 FINAL</div>
              ${renderTeamSlot(m.teamB, m.scoreB, m.winner === m.teamB, m.teamB?.id === this.currentP1Char.id)}
            </div>
          `).join('')}
          <div class="bracket-cup-symbol">🏆</div>
        </div>
      </div>
    `;
  }

  showTrophyModal(championChar) {
    const modal = document.getElementById('trophyModal');
    const flagEl = document.getElementById('trophyFlag');
    const nameEl = document.getElementById('trophyName');
    if (flagEl) flagEl.textContent = championChar.country;
    if (nameEl) nameEl.textContent = `${championChar.name.toUpperCase()} #10`;
    if (modal) modal.classList.add('open');
  }

  hideTrophyModal() {
    const modal = document.getElementById('trophyModal');
    if (modal) modal.classList.remove('open');
  }
}
