import { CHARACTERS, getCharacter } from '../data/Characters.js';

export const GAME_MODES = {
  QUICK: 'quick',
  TOURNAMENT: 'tournament',
  SURVIVAL: 'survival',
  GOLDEN_GOAL: 'golden_goal'
};

/**
 * Tournament & Game Modes Coordinator
 * Manages Copa Mundial knockout bracket, Survival gauntlet streaks, and Sudden Death Golden Goal.
 */
export class TournamentManager {
  constructor() {
    this.currentMode = GAME_MODES.QUICK;
    this.active = false;

    // Tournament Bracket (Copa Mundial)
    this.tournamentRound = 0; // 0: Cuartos, 1: Semifinal, 2: Final, 3: Champion!
    this.bracket = null;
    this.playerChar = null;

    // Survival Mode State
    this.survivalStreak = 0;
    this.bestSurvivalStreak = parseInt(localStorage.getItem('head_soccer_best_streak') || '0', 10);
    this.survivalHealth = 100;

    // Callbacks
    this.onStateChangeCallbacks = [];
  }

  onStateChange(fn) {
    this.onStateChangeCallbacks.push(fn);
  }

  notify() {
    this.onStateChangeCallbacks.forEach(fn => fn(this.getState()));
  }

  getState() {
    return {
      mode: this.currentMode,
      active: this.active,
      tournamentRound: this.tournamentRound,
      bracket: this.bracket,
      survivalStreak: this.survivalStreak,
      bestSurvivalStreak: this.bestSurvivalStreak,
      survivalHealth: this.survivalHealth
    };
  }

  /**
   * Starts a new Copa Mundial tournament bracket
   */
  startCopaMundial(playerCharId) {
    this.currentMode = GAME_MODES.TOURNAMENT;
    this.active = true;
    this.tournamentRound = 0;
    this.playerChar = getCharacter(playerCharId);

    // Pick 7 distinct opponents from roster
    const allOthers = CHARACTERS.filter(c => c.id !== playerCharId);
    const shuffled = [...allOthers].sort(() => 0.5 - Math.random());
    const rivals = shuffled.slice(0, 7);

    // Build 8-team tree
    // Quarterfinals (4 matches)
    const qf = [
      { id: 'qf1', teamA: this.playerChar, teamB: rivals[0], scoreA: null, scoreB: null, winner: null, isPlayer: true },
      { id: 'qf2', teamA: rivals[1], teamB: rivals[2], scoreA: null, scoreB: null, winner: null, isPlayer: false },
      { id: 'qf3', teamA: rivals[3], teamB: rivals[4], scoreA: null, scoreB: null, winner: null, isPlayer: false },
      { id: 'qf4', teamA: rivals[5], teamB: rivals[6], scoreA: null, scoreB: null, winner: null, isPlayer: false }
    ];

    // Semifinals (2 matches)
    const sf = [
      { id: 'sf1', teamA: null, teamB: null, scoreA: null, scoreB: null, winner: null, isPlayer: true },
      { id: 'sf2', teamA: null, teamB: null, scoreA: null, scoreB: null, winner: null, isPlayer: false }
    ];

    // Gran Final (1 match)
    const fn = [
      { id: 'fn1', teamA: null, teamB: null, scoreA: null, scoreB: null, winner: null, isPlayer: true }
    ];

    this.bracket = { qf, sf, fn };
    this.notify();
    return this.getCurrentRival();
  }

  /**
   * Starts Survival Mode gauntlet
   */
  startSurvival(playerCharId) {
    this.currentMode = GAME_MODES.SURVIVAL;
    this.active = true;
    this.playerChar = getCharacter(playerCharId);
    this.survivalStreak = 0;
    this.survivalHealth = 100;
    this.notify();
    return this.getRandomRival();
  }

  /**
   * Starts Sudden Death (Golden Goal)
   */
  startGoldenGoal(playerCharId, rivalCharId) {
    this.currentMode = GAME_MODES.GOLDEN_GOAL;
    this.active = true;
    this.playerChar = getCharacter(playerCharId);
    this.notify();
    return getCharacter(rivalCharId);
  }

  /**
   * Sets quick match mode
   */
  setQuickMatch() {
    this.currentMode = GAME_MODES.QUICK;
    this.active = false;
    this.notify();
  }

  getCurrentRival() {
    if (this.currentMode === GAME_MODES.TOURNAMENT && this.bracket) {
      if (this.tournamentRound === 0) {
        return this.bracket.qf[0].teamB;
      } else if (this.tournamentRound === 1) {
        return this.bracket.sf[0].teamB;
      } else if (this.tournamentRound === 2) {
        return this.bracket.fn[0].teamB;
      }
    }
    return this.getRandomRival();
  }

  getRandomRival() {
    const list = CHARACTERS.filter(c => !this.playerChar || c.id !== this.playerChar.id);
    return list[Math.floor(Math.random() * list.length)] || CHARACTERS[1];
  }

  getCurrentDifficulty() {
    if (this.currentMode === GAME_MODES.TOURNAMENT) {
      if (this.tournamentRound === 0) return 'medium'; // Cuartos
      if (this.tournamentRound === 1) return 'hard';   // Semifinal
      if (this.tournamentRound === 2) return 'champion'; // Final!
    }
    if (this.currentMode === GAME_MODES.SURVIVAL) {
      if (this.survivalStreak < 2) return 'easy';
      if (this.survivalStreak < 5) return 'medium';
      if (this.survivalStreak < 8) return 'hard';
      return 'champion';
    }
    return 'medium';
  }

  /**
   * Records match outcome and advances stage
   * @returns {{ status: 'advanced'|'won_championship'|'eliminated'|'streak_continued'|'game_over', nextRival: object|null }}
   */
  recordMatchResult(playerScore, rivalScore) {
    const playerWon = playerScore > rivalScore;

    if (this.currentMode === GAME_MODES.TOURNAMENT && this.bracket) {
      if (this.tournamentRound === 0) {
        // Quarterfinals
        this.bracket.qf[0].scoreA = playerScore;
        this.bracket.qf[0].scoreB = rivalScore;
        this.bracket.qf[0].winner = playerWon ? this.playerChar : this.bracket.qf[0].teamB;

        if (!playerWon) {
          return { status: 'eliminated', nextRival: null };
        }

        // Simulate other QF matches
        this.simulateMatch(this.bracket.qf[1]);
        this.simulateMatch(this.bracket.qf[2]);
        this.simulateMatch(this.bracket.qf[3]);

        // Setup Semifinals
        this.bracket.sf[0].teamA = this.playerChar;
        this.bracket.sf[0].teamB = this.bracket.qf[1].winner;
        this.bracket.sf[1].teamA = this.bracket.qf[2].winner;
        this.bracket.sf[1].teamB = this.bracket.qf[3].winner;

        this.tournamentRound = 1;
        this.notify();
        return { status: 'advanced', nextRival: this.bracket.sf[0].teamB, roundName: 'Semifinal' };
      } else if (this.tournamentRound === 1) {
        // Semifinals
        this.bracket.sf[0].scoreA = playerScore;
        this.bracket.sf[0].scoreB = rivalScore;
        this.bracket.sf[0].winner = playerWon ? this.playerChar : this.bracket.sf[0].teamB;

        if (!playerWon) {
          return { status: 'eliminated', nextRival: null };
        }

        // Simulate SF 2
        this.simulateMatch(this.bracket.sf[1]);

        // Setup Gran Final
        this.bracket.fn[0].teamA = this.playerChar;
        this.bracket.fn[0].teamB = this.bracket.sf[1].winner;

        this.tournamentRound = 2;
        this.notify();
        return { status: 'advanced', nextRival: this.bracket.fn[0].teamB, roundName: 'Gran Final' };
      } else if (this.tournamentRound === 2) {
        // Gran Final!
        this.bracket.fn[0].scoreA = playerScore;
        this.bracket.fn[0].scoreB = rivalScore;
        this.bracket.fn[0].winner = playerWon ? this.playerChar : this.bracket.fn[0].teamB;

        if (playerWon) {
          this.tournamentRound = 3; // Champion!
          this.notify();
          return { status: 'won_championship', nextRival: null };
        } else {
          return { status: 'eliminated', nextRival: null };
        }
      }
    }

    if (this.currentMode === GAME_MODES.SURVIVAL) {
      if (playerWon) {
        this.survivalStreak += 1;
        if (this.survivalStreak > this.bestSurvivalStreak) {
          this.bestSurvivalStreak = this.survivalStreak;
          localStorage.setItem('head_soccer_best_streak', this.bestSurvivalStreak.toString());
        }
        // Health bonus: +30 HP up to 100 max
        this.survivalHealth = Math.min(100, this.survivalHealth + 30);
        this.notify();
        const nextRival = this.getRandomRival();
        return { status: 'streak_continued', nextRival, streak: this.survivalStreak, bonusHp: 30 };
      } else {
        const finalStreak = this.survivalStreak;
        this.survivalStreak = 0;
        this.notify();
        return { status: 'game_over', finalStreak, bestStreak: this.bestSurvivalStreak };
      }
    }

    return { status: playerWon ? 'victory' : 'defeat', nextRival: null };
  }

  simulateMatch(match) {
    const scoreA = Math.floor(Math.random() * 5);
    let scoreB = Math.floor(Math.random() * 5);
    if (scoreA === scoreB) scoreB += 1; // no ties in knockout bracket
    match.scoreA = scoreA;
    match.scoreB = scoreB;
    match.winner = scoreA > scoreB ? match.teamA : match.teamB;
  }
}
