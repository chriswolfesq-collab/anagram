const CONFIG = {
  accentColor: '#10B981',
  tileShape: 'square', // 'square' | 'circle'
};

// Pure helper shared by both modes: places a tapped tile into the next open
// slot and reports whether the word is complete (and what it spells).
function applyTap(scrambled, slots, tileId) {
  const tile = scrambled.find(t => t.id === tileId);
  if (!tile || tile.used) return null;
  const slotIdx = slots.findIndex(s => s === null);
  if (slotIdx === -1) return null;
  const newSlots = slots.slice();
  newSlots[slotIdx] = tileId;
  const newScrambled = scrambled.map(t => (t.id === tileId ? { ...t, used: true } : t));
  const filled = newSlots.every(s => s !== null);
  const word = filled ? newSlots.map(id => newScrambled.find(t => t.id === id).ch).join('') : null;
  return { scrambled: newScrambled, slots: newSlots, filled, word };
}

const STORAGE_KEY = 'anagram_wordgame_progress_v2';
const ARCADE_BEST_KEY = 'anagram_wordgame_arcade_best_v1';
const SURVIVAL_BEST_KEY = 'anagram_wordgame_survival_best_v1';
const DAILY_RESULT_KEY = 'anagram_wordgame_daily_result_v1';
const DAILY_COUNT = 5;

function todayKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function msUntilNextMidnight() {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
  return Math.max(1000, next.getTime() - now.getTime());
}

function secondsUntilNextMidnight() {
  return Math.ceil(msUntilNextMidnight() / 1000);
}

function formatCountdown(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds || 0));
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) return `${hours}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function formatDuration(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds || 0));
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

class Game {
  constructor(onChange) {
    this.onChange = onChange;
    this.arcadeTimerId = null;
    this.survivalTimerId = null;
    this.dailyTimerId = null;
    this.dailyResetTimerId = null;
    this.dailyCountdownTimerId = null;
    this.state = {
      screen: 'home',
      stageProgress: STAGES.map(() => 0),
      activeStage: 0,
      levelIndex: 0,
      stageShareStatus: '',
      scrambled: [],
      slots: [],
      status: 'playing',
      arcadeQueue: [],
      arcadeWord: '',
      arcadeClue: '',
      arcadeScore: 0,
      arcadeTimeLeft: ARCADE_TIME,
      arcadeBest: 0,
      arcadeShareStatus: '',
      survivalQueue: [],
      survivalWord: '',
      survivalClue: '',
      survivalScore: 0,
      survivalSolved: 0,
      survivalStreak: 0,
      survivalSkips: 0,
      survivalWordStartedAt: 0,
      survivalLastPoints: 0,
      survivalLastBonus: '',
      survivalNoSkipBonus: 0,
      survivalTimeLeft: SURVIVAL_START_TIME,
      survivalBest: 0,
      survivalShareStatus: '',
      dailyDate: todayKey(),
      dailyQueue: [],
      dailyIndex: 0,
      dailyWord: '',
      dailyClue: '',
      dailyStartedAt: 0,
      dailyElapsed: 0,
      dailyResetIn: secondsUntilNextMidnight(),
      dailyResult: null,
      dailyShareStatus: '',
    };
    this.loadProgress();
    this.loadArcadeBest();
    this.loadSurvivalBest();
    this.loadDailyResult();
    this.scheduleDailyReset();
    this.startDailyCountdown();
  }

  setState(patch) {
    const next = typeof patch === 'function' ? patch(this.state) : patch;
    this.state = { ...this.state, ...next };
    this.onChange(this.state);
  }

  scheduleDailyReset() {
    if (this.dailyResetTimerId) clearTimeout(this.dailyResetTimerId);
    this.dailyResetTimerId = setTimeout(() => {
      this.handleDailyReset();
      this.scheduleDailyReset();
    }, msUntilNextMidnight());
  }

  startDailyCountdown() {
    if (this.dailyCountdownTimerId) clearInterval(this.dailyCountdownTimerId);
    this.dailyCountdownTimerId = setInterval(() => {
      // Only the home screen shows this countdown. Re-rendering every second
      // regardless of screen would tear down and rebuild the whole DOM tree
      // underneath whatever the player is doing (e.g. resetting scroll
      // position mid-puzzle), so skip the update everywhere else.
      if (this.state.screen !== 'home') return;
      this.setState({ dailyResetIn: secondsUntilNextMidnight() });
    }, 1000);
  }

  handleDailyReset() {
    const date = todayKey();
    const patch = {
      dailyDate: date,
      dailyElapsed: 0,
      dailyResetIn: secondsUntilNextMidnight(),
      dailyShareStatus: '',
    };
    if (this.state.screen === 'dailyDone') {
      patch.screen = 'home';
    }
    this.setState(patch);
  }

  loadProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved && Array.isArray(saved.stageProgress)) {
        const sp = STAGES.map((s, i) => Math.min(Math.max(saved.stageProgress[i] || 0, 0), s.levels.length));
        this.state.stageProgress = sp;
      }
    } catch (e) {
      console.warn('Failed to load stage progress from localStorage', e);
    }
  }

  saveProgress(stageProgress) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ stageProgress }));
    } catch (e) {
      console.warn('Failed to save stage progress to localStorage', e);
    }
  }

  loadArcadeBest() {
    try {
      const best = parseInt(localStorage.getItem(ARCADE_BEST_KEY), 10);
      if (!isNaN(best) && best > 0) this.state.arcadeBest = best;
    } catch (e) {
      console.warn('Failed to load Timed best score from localStorage', e);
    }
  }

  saveArcadeBest(best) {
    try {
      localStorage.setItem(ARCADE_BEST_KEY, String(best));
    } catch (e) {
      console.warn('Failed to save Timed best score to localStorage', e);
    }
  }

  loadSurvivalBest() {
    try {
      const best = parseInt(localStorage.getItem(SURVIVAL_BEST_KEY), 10);
      if (!isNaN(best) && best > 0) this.state.survivalBest = best;
    } catch (e) {
      console.warn('Failed to load Survival best score from localStorage', e);
    }
  }

  saveSurvivalBest(best) {
    try {
      localStorage.setItem(SURVIVAL_BEST_KEY, String(best));
    } catch (e) {
      console.warn('Failed to save Survival best score to localStorage', e);
    }
  }

  loadDailyResult() {
    try {
      const saved = JSON.parse(localStorage.getItem(DAILY_RESULT_KEY) || 'null');
      if (saved && saved.date && typeof saved.elapsed === 'number') {
        this.state.dailyResult = saved;
      }
    } catch (e) {
      console.warn('Failed to load Daily 5 result from localStorage', e);
    }
  }

  saveDailyResult(result) {
    try {
      localStorage.setItem(DAILY_RESULT_KEY, JSON.stringify(result));
    } catch (e) {
      console.warn('Failed to save Daily 5 result to localStorage', e);
    }
  }

  isStageUnlocked(stageIdx, stageProgress) {
    if (stageIdx === 0) return true;
    return stageProgress[stageIdx - 1] >= STAGES[stageIdx - 1].levels.length;
  }

  shuffle(word) {
    let arr = word.split('').map((ch, i) => ({
      id: i + '-' + ch + '-' + Math.random().toString(36).slice(2, 7),
      ch,
      used: false,
    }));
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    if (arr.map(a => a.ch).join('') === word && word.length > 1) {
      const tmp = arr[0]; arr[0] = arr[1]; arr[1] = tmp;
    }
    return arr;
  }

  shuffleTiles() {
    const { status, scrambled } = this.state;
    if (status !== 'playing') return;
    const unusedTiles = shuffleArray(scrambled.filter(t => !t.used));
    let nextUnusedIndex = 0;
    const nextScrambled = scrambled.map(tile => {
      if (tile.used) return tile;
      return unusedTiles[nextUnusedIndex++];
    });
    this.setState({ scrambled: nextScrambled });
  }

  goHome() {
    if (this.arcadeTimerId) clearInterval(this.arcadeTimerId);
    if (this.survivalTimerId) clearInterval(this.survivalTimerId);
    if (this.dailyTimerId) clearInterval(this.dailyTimerId);
    this.setState({ screen: 'home', dailyResetIn: secondsUntilNextMidnight() });
  }

  openStage(stageIdx) {
    this.setState({ screen: 'levels', activeStage: stageIdx });
  }

  goToStages() {
    this.setState({ screen: 'stages' });
  }

  goToLevels() {
    this.setState({ screen: 'levels' });
  }

  startLevel(stageIdx, idx) {
    const lvl = STAGES[stageIdx].levels[idx];
    this.setState({
      screen: 'play',
      activeStage: stageIdx,
      levelIndex: idx,
      scrambled: this.shuffle(lvl.word),
      slots: new Array(lvl.word.length).fill(null),
      status: 'playing',
    });
  }

  // --- Timed Challenge mode ---

  startArcade() {
    if (this.arcadeTimerId) clearInterval(this.arcadeTimerId);
    this.setState({ screen: 'arcadePlay', arcadeQueue: buildArcadeQueue(), arcadeScore: 0, arcadeShareStatus: '' });
    this.loadNextArcadeWord();
  }

  loadNextArcadeWord() {
    if (this.arcadeTimerId) clearInterval(this.arcadeTimerId);
    let queue = this.state.arcadeQueue;
    if (queue.length === 0) queue = buildArcadeQueue();
    const [word, clue] = queue[0];
    this.setState({
      arcadeQueue: queue.slice(1),
      arcadeWord: word,
      arcadeClue: clue,
      scrambled: this.shuffle(word),
      slots: new Array(word.length).fill(null),
      arcadeTimeLeft: ARCADE_TIME,
      status: 'playing',
    });
    this.arcadeTimerId = setInterval(() => {
      if (this.state.status !== 'playing') return;
      const t = this.state.arcadeTimeLeft - 1;
      if (t <= 0) {
        clearInterval(this.arcadeTimerId);
        this.endArcade();
      } else {
        this.setState({ arcadeTimeLeft: t });
      }
    }, 1000);
  }

  endArcade() {
    if (this.arcadeTimerId) clearInterval(this.arcadeTimerId);
    const best = Math.max(this.state.arcadeBest, this.state.arcadeScore);
    this.saveArcadeBest(best);
    this.setState({ screen: 'arcadeOver', arcadeBest: best, status: 'over' });
  }

  exitArcade() {
    if (this.arcadeTimerId) clearInterval(this.arcadeTimerId);
    this.setState({ screen: 'home' });
  }

  async shareImage({ text, file, statusKey }) {
    const downloadAndCopy = async () => {
      downloadShareImage(file);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(text);
        } catch (e) {}
      }
      this.setState({ [statusKey]: 'Screenshot downloaded' });
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: 'Anagram Score', text, files: [file] });
        this.setState({ [statusKey]: 'Shared!' });
      } else {
        await downloadAndCopy();
      }
    } catch (e) {
      if (e && e.name === 'AbortError') {
        this.setState({ [statusKey]: 'Share canceled' });
      } else {
        await downloadAndCopy();
      }
    }
  }

  async shareArcade() {
    const text = withGameShareLink(`Timed Challenge: I solved ${this.state.arcadeScore} ${this.state.arcadeScore === 1 ? 'word' : 'words'} in Anagram`);
    const file = makeScoreShareImage({
      mode: 'Timed Challenge',
      score: this.state.arcadeScore,
      scoreLabel: this.state.arcadeScore === 1 ? 'word solved' : 'words solved',
      detail: this.state.arcadeWord ? `Answer: ${this.state.arcadeWord}` : '',
      bestLine: `Best: ${this.state.arcadeBest}`,
      isNewBest: this.state.arcadeScore >= this.state.arcadeBest && this.state.arcadeScore > 0,
    });
    await this.shareImage({ text, file, statusKey: 'arcadeShareStatus' });
  }

  // --- Survival mode ---

  startSurvival() {
    if (this.survivalTimerId) clearInterval(this.survivalTimerId);
    this.setState({
      screen: 'survivalPlay',
      survivalQueue: buildSurvivalQueue(),
      survivalScore: 0,
      survivalSolved: 0,
      survivalStreak: 0,
      survivalSkips: 0,
      survivalTimeLeft: SURVIVAL_START_TIME,
      survivalShareStatus: '',
      survivalLastPoints: 0,
      survivalLastBonus: '',
      survivalNoSkipBonus: 0,
    });
    this.loadNextSurvivalWord();
    this.startSurvivalTimer();
  }

  loadNextSurvivalWord() {
    let queue = this.state.survivalQueue;
    if (queue.length === 0) queue = buildSurvivalQueue();
    const [word, clue] = queue[0];
    this.setState({
      survivalQueue: queue.slice(1),
      survivalWord: word,
      survivalClue: clue,
      scrambled: this.shuffle(word),
      slots: new Array(word.length).fill(null),
      survivalWordStartedAt: Date.now(),
      status: 'playing',
    });
  }

  startSurvivalTimer() {
    if (this.survivalTimerId) clearInterval(this.survivalTimerId);
    this.survivalTimerId = setInterval(() => {
      if (this.state.screen !== 'survivalPlay') return;
      const t = this.state.survivalTimeLeft - 1;
      if (t <= 0) {
        clearInterval(this.survivalTimerId);
        this.endSurvival();
      } else {
        this.setState({ survivalTimeLeft: t });
      }
    }, 1000);
  }

  endSurvival() {
    if (this.survivalTimerId) clearInterval(this.survivalTimerId);
    const survivalNoSkipBonus = this.state.survivalSolved > 0 && this.state.survivalSkips === 0 ? SURVIVAL_NO_SKIP_BONUS : 0;
    const finalScore = this.state.survivalScore + survivalNoSkipBonus;
    const best = Math.max(this.state.survivalBest, finalScore);
    this.saveSurvivalBest(best);
    this.setState({ screen: 'survivalOver', survivalScore: finalScore, survivalBest: best, survivalNoSkipBonus, status: 'over' });
  }

  exitSurvival() {
    if (this.survivalTimerId) clearInterval(this.survivalTimerId);
    this.setState({ screen: 'home' });
  }

  async shareSurvival() {
    const text = withGameShareLink(`Survival: I scored ${this.state.survivalScore} points in Anagram`);
    const file = makeScoreShareImage({
      mode: 'Survival',
      score: this.state.survivalScore,
      scoreLabel: 'points',
      detail: this.state.survivalNoSkipBonus ? `No-skip bonus: +${this.state.survivalNoSkipBonus}` : `${this.state.survivalSkips} ${this.state.survivalSkips === 1 ? 'skip' : 'skips'} used`,
      bestLine: `Best: ${this.state.survivalBest} pts`,
      isNewBest: this.state.survivalScore >= this.state.survivalBest && this.state.survivalScore > 0,
    });
    await this.shareImage({ text, file, statusKey: 'survivalShareStatus' });
  }

  async shareStage() {
    const stage = STAGES[this.state.activeStage];
    const levelCount = stage.levels.length;
    const text = withGameShareLink(`I cleared ${stage.name} in Anagram`);
    const file = makeScoreShareImage({
      mode: 'Stage Complete',
      score: stage.name,
      scoreLabel: 'stage cleared',
      detail: `Stage ${this.state.activeStage + 1} / ${STAGES.length}`,
      bestLine: `${levelCount} ${levelCount === 1 ? 'word' : 'words'} solved`,
      isNewBest: false,
    });
    await this.shareImage({ text, file, statusKey: 'stageShareStatus' });
  }

  // --- Daily 5 mode ---

  startDaily() {
    if (this.dailyTimerId) clearInterval(this.dailyTimerId);
    const date = todayKey();
    if (this.state.dailyResult && this.state.dailyResult.date === date) {
      this.setState({
        screen: 'dailyDone',
        dailyDate: date,
        dailyElapsed: this.state.dailyResult.elapsed,
        dailyShareStatus: '',
      });
      return;
    }
    const queue = dailyWordsForDate(date);
    const [word, clue] = queue[0];
    const startedAt = Date.now();
    this.setState({
      screen: 'dailyPlay',
      dailyDate: date,
      dailyQueue: queue,
      dailyIndex: 0,
      dailyWord: word,
      dailyClue: clue,
      scrambled: this.shuffle(word),
      slots: new Array(word.length).fill(null),
      dailyStartedAt: startedAt,
      dailyElapsed: 0,
      dailyShareStatus: '',
      status: 'playing',
    });
    this.dailyTimerId = setInterval(() => {
      if (this.state.screen !== 'dailyPlay' || this.state.status !== 'playing') return;
      this.setState({ dailyElapsed: Math.floor((Date.now() - this.state.dailyStartedAt) / 1000) });
    }, 1000);
  }

  loadDailyWord(index) {
    const [word, clue] = this.state.dailyQueue[index];
    this.setState({
      dailyIndex: index,
      dailyWord: word,
      dailyClue: clue,
      scrambled: this.shuffle(word),
      slots: new Array(word.length).fill(null),
      status: 'playing',
    });
  }

  resolveDailyTap(result) {
    const { dailyWord, dailyIndex, dailyStartedAt } = this.state;
    if (result.filled && result.word === dailyWord) {
      this.setState({ scrambled: result.scrambled, slots: result.slots, status: 'success' });
      if (dailyIndex + 1 >= DAILY_COUNT) {
        const elapsed = Math.floor((Date.now() - dailyStartedAt) / 1000);
        const dailyResult = { date: this.state.dailyDate, elapsed };
        this.saveDailyResult(dailyResult);
        if (this.dailyTimerId) clearInterval(this.dailyTimerId);
        setTimeout(() => this.setState({ screen: 'dailyDone', dailyElapsed: elapsed, dailyResult }), 450);
      } else {
        setTimeout(() => this.loadDailyWord(dailyIndex + 1), 450);
      }
      return;
    }
    this.setState({ scrambled: result.scrambled, slots: result.slots });
  }

  exitDaily() {
    if (this.dailyTimerId) clearInterval(this.dailyTimerId);
    this.setState({ screen: 'home' });
  }

  async shareDaily() {
    const result = this.state.dailyResult;
    const elapsed = result ? result.elapsed : this.state.dailyElapsed;
    const date = result ? result.date : this.state.dailyDate;
    const text = withGameShareLink(`Daily 5 ${date}: ${formatDuration(elapsed)} in Anagram`);
    const file = makeScoreShareImage({
      mode: 'Daily 5',
      score: formatDuration(elapsed),
      scoreLabel: 'completion time',
      detail: date,
      bestLine: `${DAILY_COUNT} / ${DAILY_COUNT} words solved`,
      isNewBest: false,
    });
    await this.shareImage({ text, file, statusKey: 'dailyShareStatus' });
  }

  tapScrambled(tileId) {
    const { status, scrambled, slots } = this.state;
    if (status !== 'playing') return;
    const result = applyTap(scrambled, slots, tileId);
    if (!result) return;
    if (this.state.screen === 'arcadePlay') {
      this.resolveArcadeTap(result);
    } else if (this.state.screen === 'survivalPlay') {
      this.resolveSurvivalTap(result);
    } else if (this.state.screen === 'dailyPlay') {
      this.resolveDailyTap(result);
    } else {
      this.resolveStagesTap(result);
    }
  }

  resolveStagesTap(result) {
    const { activeStage, levelIndex, stageProgress } = this.state;
    let newStatus = 'playing';
    if (result.filled) {
      const lvl = STAGES[activeStage].levels[levelIndex];
      if (result.word === lvl.word) {
        newStatus = 'success';
        const newProgress = stageProgress.slice();
        newProgress[activeStage] = Math.max(newProgress[activeStage], levelIndex + 1);
        this.saveProgress(newProgress);
        this.setState({ stageProgress: newProgress });
      }
    }
    this.setState({ scrambled: result.scrambled, slots: result.slots, status: newStatus });
  }

  resolveArcadeTap(result) {
    const { arcadeWord, arcadeScore } = this.state;
    if (result.filled && result.word === arcadeWord) {
      if (this.arcadeTimerId) clearInterval(this.arcadeTimerId);
      this.setState({ scrambled: result.scrambled, slots: result.slots, status: 'success', arcadeScore: arcadeScore + 1 });
      setTimeout(() => this.loadNextArcadeWord(), 500);
      return;
    }
    this.setState({ scrambled: result.scrambled, slots: result.slots });
  }

  resolveSurvivalTap(result) {
    const { survivalWord, survivalScore, survivalSolved, survivalStreak, survivalWordStartedAt, survivalTimeLeft } = this.state;
    if (result.filled && result.word === survivalWord) {
      const elapsed = (Date.now() - survivalWordStartedAt) / 1000;
      const nextStreak = survivalStreak + 1;
      const streakBonus = nextStreak % 5 === 0 ? (nextStreak / 5) * SURVIVAL_STREAK_BONUS_STEP : 0;
      const fastBonus = elapsed < SURVIVAL_FAST_SOLVE_SECONDS ? SURVIVAL_FAST_SOLVE_BONUS : 0;
      const points = SURVIVAL_BASE_POINTS + streakBonus + fastBonus;
      const bonusParts = [];
      if (streakBonus) bonusParts.push(`+${streakBonus} streak`);
      if (fastBonus) bonusParts.push(`+${fastBonus} fast`);
      this.setState({
        scrambled: result.scrambled,
        slots: result.slots,
        status: 'success',
        survivalScore: survivalScore + points,
        survivalSolved: survivalSolved + 1,
        survivalStreak: nextStreak,
        survivalTimeLeft: Math.min(SURVIVAL_MAX_TIME, survivalTimeLeft + SURVIVAL_TIME_BONUS),
        survivalLastPoints: points,
        survivalLastBonus: bonusParts.join(' · '),
      });
      setTimeout(() => this.loadNextSurvivalWord(), 500);
      return;
    }
    this.setState({ scrambled: result.scrambled, slots: result.slots });
  }

  skipSurvivalWord() {
    if (this.state.screen !== 'survivalPlay' || this.state.status !== 'playing') return;
    const survivalTimeLeft = Math.max(0, this.state.survivalTimeLeft - SURVIVAL_SKIP_PENALTY);
    this.setState({ survivalSkips: this.state.survivalSkips + 1, survivalStreak: 0, survivalLastPoints: 0, survivalLastBonus: 'Skipped', survivalTimeLeft });
    if (survivalTimeLeft <= 0) {
      if (this.survivalTimerId) clearInterval(this.survivalTimerId);
      this.endSurvival();
      return;
    }
    this.loadNextSurvivalWord();
  }

  tapSlot(slotIdx) {
    const { status, slots, scrambled } = this.state;
    if (status !== 'playing') return;
    const tileId = slots[slotIdx];
    if (!tileId) return;
    const newSlots = slots.slice();
    newSlots[slotIdx] = null;
    const newScrambled = scrambled.map(t => (t.id === tileId ? { ...t, used: false } : t));
    this.setState({ slots: newSlots, scrambled: newScrambled });
  }

  typeLetter(ch) {
    const { status, scrambled } = this.state;
    if (status !== 'playing') return;
    const tile = scrambled.find(t => t.ch === ch && !t.used);
    if (!tile) return;
    this.tapScrambled(tile.id);
  }

  backspace() {
    const { status, slots } = this.state;
    if (status !== 'playing') return;
    for (let i = slots.length - 1; i >= 0; i--) {
      if (slots[i] !== null) {
        this.tapSlot(i);
        return;
      }
    }
  }

  next() {
    const { activeStage, levelIndex } = this.state;
    const stage = STAGES[activeStage];
    const nextIdx = levelIndex + 1;
    if (nextIdx < stage.levels.length) {
      this.startLevel(activeStage, nextIdx);
    } else if (activeStage + 1 < STAGES.length) {
      this.setState({ screen: 'stageDone', stageShareStatus: '' });
    } else {
      this.setState({ screen: 'done' });
    }
  }

  afterStageDone() {
    const nextStage = this.state.activeStage + 1;
    if (nextStage < STAGES.length) {
      this.setState({ screen: 'levels', activeStage: nextStage });
    } else {
      this.setState({ screen: 'stages' });
    }
  }

  playAgain() {
    const reset = STAGES.map(() => 0);
    this.saveProgress(reset);
    this.setState({ stageProgress: reset, screen: 'stages' });
  }
}
