function el(tag, opts = {}, children = []) {
  const node = document.createElement(tag);
  if (opts.className) node.className = opts.className;
  if (opts.text !== undefined) node.textContent = opts.text;
  if (opts.html !== undefined) node.innerHTML = opts.html;
  if (opts['aria-label']) node.setAttribute('aria-label', opts['aria-label']);
  if (opts.style) Object.assign(node.style, opts.style);
  if (opts.onClick) node.addEventListener('click', opts.onClick);
  children.forEach(c => c && node.appendChild(c));
  return node;
}

// Sizes tiles so the whole word always fits on a single line, however long
// it is or however narrow the viewport is.
function tileMetrics(wordLen) {
  const containerWidth = Math.min(window.innerWidth, 430) - 48; // #app width minus play-body padding
  const gap = wordLen <= 6 ? 8 : wordLen <= 9 ? 6 : wordLen <= 12 ? 4 : 3;
  const rawSize = Math.floor((containerWidth - gap * (wordLen - 1)) / wordLen);
  const slotSize = Math.max(20, Math.min(48, rawSize));
  const slotFont = Math.max(11, Math.round(slotSize * 0.46));
  const tileRadius = CONFIG.tileShape === 'circle' ? '50%' : '8px';
  return { slotSize, slotFont, slotGap: gap, tileRadius };
}

function renderHome(state, game) {
  const completedStages = state.stageProgress.filter((n, i) => n >= STAGES[i].levels.length).length;
  const titleTiles = 'ANAGRAM'.split('').map(ch => el('div', {
    className: 'home-title-tile',
    text: ch,
  }));

  const stagesChoice = el('button', {
    className: 'home-choice primary',
    onClick: () => game.goToStages(),
  }, [
    el('span', { className: 'home-choice-title', text: 'Stages' }),
    el('span', { className: 'home-choice-meta', text: `${completedStages} / ${STAGES.length} stages passed` }),
  ]);

  const timedChoice = el('button', {
    className: 'home-choice',
    onClick: () => game.startArcade(),
  }, [
    el('span', { className: 'home-choice-title', text: 'Timed' }),
    el('span', { className: 'home-choice-meta', text: `Longest streak ${state.arcadeBest}` }),
  ]);

  const dailyResult = state.dailyResult && state.dailyResult.date === todayKey() ? state.dailyResult : null;
  const dailyResetText = `resets in ${formatCountdown(state.dailyResetIn)}`;
  const dailyChoice = el('button', {
    className: 'home-choice' + (dailyResult ? ' completed' : ''),
    style: dailyResult ? { cursor: 'default' } : null,
    onClick: dailyResult ? null : () => game.startDaily(),
  }, [
    el('span', { className: 'home-choice-title', text: 'Daily 5' }),
    el('span', { className: 'home-choice-meta', text: dailyResult ? `Completed ${formatDuration(dailyResult.elapsed)} · ${dailyResetText}` : dailyResetText }),
  ]);

  return el('div', { className: 'screen home-screen' }, [
    el('div', { className: 'home-inner' }, [
      el('div', { className: 'home-title', 'aria-label': 'ANAGRAM' }, titleTiles),
      el('div', { className: 'home-actions' }, [stagesChoice, timedChoice, dailyChoice]),
    ]),
  ]);
}

function renderStages(state, game) {
  const { stageProgress } = state;
  const totalLevels = STAGES.reduce((sum, s) => sum + s.levels.length, 0);
  const totalSolved = stageProgress.reduce((sum, n) => sum + n, 0);

  const cards = STAGES.map((s, i) => {
    const unlocked = game.isStageUnlocked(i, stageProgress);
    const completed = stageProgress[i] >= s.levels.length;
    const pct = unlocked ? Math.round((stageProgress[i] / s.levels.length) * 100) : 0;

    const card = el('div', {
      className: 'stage-card',
      style: {
        borderColor: completed ? 'rgba(16, 185, 129, 0.35)' : unlocked ? 'rgba(255,255,255,0.72)' : 'rgba(148, 163, 184, 0.24)',
        background: unlocked ? 'rgba(255,255,255,0.9)' : 'rgba(241,245,249,0.68)',
        opacity: unlocked ? 1 : 0.65,
        cursor: unlocked ? 'pointer' : 'default',
      },
      onClick: unlocked ? () => game.openStage(i) : null,
    }, [
      el('div', { className: 'stage-card-top' }, [
        el('div', { className: 'stage-card-label', style: { color: unlocked ? '#697586' : '#94A3B8' }, text: 'STAGE ' + (i + 1) }),
        el('div', { className: 'stage-card-right', style: { color: completed ? '#047857' : unlocked ? '#4F46E5' : '#94A3B8' }, text: completed ? 'DONE' : unlocked ? 'PLAY' : 'LOCKED' }),
      ]),
      el('div', { className: 'stage-card-name', style: { color: unlocked ? '#16202A' : '#94A3B8' }, text: s.name }),
      el('div', { className: 'progress-track' }, [
        el('div', { className: 'progress-fill', style: { width: pct + '%', background: completed ? CONFIG.accentColor : 'linear-gradient(90deg, #4F46E5, #10B981)' } }),
      ]),
      el('div', { className: 'stage-card-progress', text: unlocked ? `${stageProgress[i]} / ${s.levels.length} levels solved` : 'Complete the previous stage' }),
    ]);
    return card;
  });

  return el('div', { className: 'screen' }, [
    el('div', { className: 'screen-header' }, [
      el('div', { className: 'back-link', text: '‹ Modes', onClick: () => game.goHome() }),
      el('div', { className: 'app-title', text: 'ANAGRAM' }),
      el('div', { className: 'app-subtitle', text: `${totalSolved} of ${totalLevels} words solved` }),
    ]),
    el('div', { className: 'stage-list' }, cards),
  ]);
}

function renderLevels(state, game) {
  const { activeStage, stageProgress } = state;
  const stage = STAGES[activeStage];

  const rows = stage.levels.map((l, i) => {
    const isCompleted = i < stageProgress[activeStage];
    const isUnlockedNow = i <= stageProgress[activeStage];
    const isFrontier = i === stageProgress[activeStage];

    return el('div', {
      className: 'level-row',
      style: {
        opacity: isUnlockedNow ? 1 : 0.7,
        cursor: isUnlockedNow ? 'pointer' : 'default',
      },
      onClick: isUnlockedNow ? () => game.startLevel(activeStage, i) : null,
    }, [
      el('div', {
        className: 'level-badge',
        style: {
          background: isCompleted ? CONFIG.accentColor : isFrontier ? 'linear-gradient(145deg, #4F46E5, #111827)' : '#FFFFFF',
          color: isCompleted || isFrontier ? '#FFFFFF' : '#94A3B8',
          border: isUnlockedNow ? '1px solid rgba(255,255,255,0.5)' : '1px solid rgba(148, 163, 184, 0.24)',
        },
        text: isCompleted ? '✓' : String(i + 1),
      }),
      el('div', { className: 'level-info' }, [
        el('div', { className: 'level-clue', style: { color: isUnlockedNow ? '#16202A' : '#94A3B8' }, text: isUnlockedNow ? l.clue : 'Locked' }),
        el('div', { className: 'level-meta', text: isUnlockedNow ? `${l.word.length} letters` : 'Complete the previous level' }),
      ]),
      el('div', {
        className: 'level-right',
        style: { color: isCompleted ? '#047857' : isFrontier ? '#4F46E5' : '#94A3B8' },
        text: isCompleted ? 'DONE' : isFrontier ? 'PLAY' : 'LOCKED',
      }),
    ]);
  });

  return el('div', { className: 'screen' }, [
    el('div', { className: 'screen-header' }, [
      el('div', { className: 'back-link', text: '‹ Stages', onClick: () => game.goToStages() }),
      el('div', { className: 'screen-title', text: stage.name }),
      el('div', { className: 'app-subtitle', text: `${stageProgress[activeStage]} of ${stage.levels.length} solved` }),
    ]),
    el('div', { className: 'level-list' }, rows),
  ]);
}

function renderPlay(state, game) {
  const { activeStage, levelIndex, scrambled, slots, status } = state;
  const stage = STAGES[activeStage];
  const lvl = stage.levels[levelIndex];

  const { slotSize, slotFont, slotGap, tileRadius } = tileMetrics(lvl.word.length);

  const isLastStage = activeStage + 1 >= STAGES.length;

  const header = el('div', { className: 'play-header' }, [
    el('div', { className: 'back-link', text: '‹ ' + stage.name, onClick: () => game.goToLevels() }),
    el('div', { className: 'play-level-label', text: `LEVEL ${levelIndex + 1} / ${stage.levels.length}` }),
  ]);

  const slotsRow = el('div', { className: 'slots-row', style: { gap: slotGap + 'px' } },
    slots.map((tileId, i) => {
      const tile = tileId ? scrambled.find(t => t.id === tileId) : null;
      return el('div', {
        className: 'tile slot-tile' + (tile ? ' filled' : ''),
        style: { width: slotSize + 'px', height: slotSize + 'px', fontSize: slotFont + 'px', borderRadius: tileRadius },
        text: tile ? tile.ch : '',
        onClick: () => game.tapSlot(i),
      });
    })
  );

  const tilesRow = el('div', { className: 'tiles-row', style: { gap: slotGap + 'px' } },
    scrambled.map(t => el('div', {
      className: 'tile bank-tile' + (t.used ? ' used' : ''),
      style: { width: slotSize + 'px', height: slotSize + 'px', fontSize: slotFont + 'px', borderRadius: tileRadius },
      text: t.ch,
      onClick: () => game.tapScrambled(t.id),
    }))
  );

  const body = el('div', { className: 'play-body', onClick: () => window.focusMobileKeyboard && window.focusMobileKeyboard() }, [
    el('div', { className: 'clue-label', text: 'CLUE' }),
    el('div', { className: 'clue-text', text: lvl.clue }),
    slotsRow,
    el('div', { className: 'hint-text', text: 'Tap or type letters to build the word' }),
    el('button', { className: 'shuffle-button', text: 'Shuffle', onClick: () => game.shuffleTiles() }),
    tilesRow,
  ]);

  const nextLabel = levelIndex + 1 >= stage.levels.length ? (isLastStage ? 'Finish' : 'Finish Stage') : 'Next Level';

  const successModal = status === 'success' ? el('div', { className: 'modal-overlay' }, [
    el('div', { className: 'modal-card' }, [
      el('div', { className: 'modal-icon', style: { background: CONFIG.accentColor }, text: '✓' }),
      el('div', { className: 'modal-title', text: 'Solved!' }),
      el('div', { className: 'modal-word', text: lvl.word }),
      el('button', { className: 'btn-primary', text: nextLabel, onClick: () => game.next() }),
    ]),
  ]) : null;

  const screen = el('div', { className: 'screen', style: { position: 'relative' } }, [
    header,
    body,
    successModal,
  ]);

  return screen;
}

function renderArcadePlay(state, game) {
  const { scrambled, slots, status, arcadeWord, arcadeClue, arcadeScore, arcadeTimeLeft } = state;
  const { slotSize, slotFont, slotGap, tileRadius } = tileMetrics(arcadeWord.length);
  const solved = status === 'success';

  const timerPct = Math.max(0, Math.round((arcadeTimeLeft / ARCADE_TIME) * 100));
  const timerColor = timerPct <= 25 ? '#F43F5E' : timerPct <= 55 ? '#F59E0B' : '#10B981';

  const header = el('div', { className: 'play-header' }, [
    el('div', { className: 'back-link', text: '‹ Exit', onClick: () => game.exitArcade() }),
    el('div', { className: 'play-level-label', text: `SCORE ${arcadeScore}` }),
    el('div', { className: 'play-timer', style: { color: timerColor }, text: arcadeTimeLeft + 's' }),
  ]);

  const timerBar = el('div', { className: 'timer-track' }, [
    el('div', { className: 'timer-fill', style: { width: timerPct + '%', background: timerColor } }),
  ]);

  const slotsRow = el('div', { className: 'slots-row', style: { gap: slotGap + 'px' } },
    slots.map((tileId, i) => {
      const tile = tileId ? scrambled.find(t => t.id === tileId) : null;
      return el('div', {
        className: 'tile slot-tile' + (tile ? ' filled' : '') + (solved ? ' correct' : ''),
        style: {
          width: slotSize + 'px', height: slotSize + 'px', fontSize: slotFont + 'px', borderRadius: tileRadius,
          ...(solved ? { background: CONFIG.accentColor, borderColor: CONFIG.accentColor } : {}),
        },
        text: tile ? tile.ch : '',
        onClick: () => game.tapSlot(i),
      });
    })
  );

  const tilesRow = el('div', { className: 'tiles-row', style: { gap: slotGap + 'px' } },
    scrambled.map(t => el('div', {
      className: 'tile bank-tile' + (t.used ? ' used' : ''),
      style: { width: slotSize + 'px', height: slotSize + 'px', fontSize: slotFont + 'px', borderRadius: tileRadius },
      text: t.ch,
      onClick: () => game.tapScrambled(t.id),
    }))
  );

  const body = el('div', { className: 'play-body', onClick: () => window.focusMobileKeyboard && window.focusMobileKeyboard() }, [
    el('div', { className: 'clue-label', text: 'CLUE' }),
    el('div', { className: 'clue-text', text: arcadeClue }),
    slotsRow,
    el('div', { className: 'hint-text', text: 'Tap or type letters to build the word' }),
    el('button', { className: 'shuffle-button', text: 'Shuffle', onClick: () => game.shuffleTiles() }),
    tilesRow,
  ]);

  return el('div', { className: 'screen', style: { position: 'relative' } }, [header, timerBar, body]);
}

function renderDailyPlay(state, game) {
  const { scrambled, slots, status, dailyWord, dailyClue, dailyIndex, dailyElapsed } = state;
  const { slotSize, slotFont, slotGap, tileRadius } = tileMetrics(dailyWord.length);
  const solved = status === 'success';

  const header = el('div', { className: 'play-header' }, [
    el('div', { className: 'back-link', text: '‹ Exit', onClick: () => game.exitDaily() }),
    el('div', { className: 'play-level-label', text: `DAILY ${dailyIndex + 1} / ${DAILY_COUNT}` }),
    el('div', { className: 'play-timer', text: formatDuration(dailyElapsed) }),
  ]);

  const progressPct = Math.round(((dailyIndex + (solved ? 1 : 0)) / DAILY_COUNT) * 100);
  const progressBar = el('div', { className: 'timer-track' }, [
    el('div', { className: 'timer-fill', style: { width: progressPct + '%', background: CONFIG.accentColor } }),
  ]);

  const slotsRow = el('div', { className: 'slots-row', style: { gap: slotGap + 'px' } },
    slots.map((tileId, i) => {
      const tile = tileId ? scrambled.find(t => t.id === tileId) : null;
      return el('div', {
        className: 'tile slot-tile' + (tile ? ' filled' : '') + (solved ? ' correct' : ''),
        style: {
          width: slotSize + 'px', height: slotSize + 'px', fontSize: slotFont + 'px', borderRadius: tileRadius,
          ...(solved ? { background: CONFIG.accentColor, borderColor: CONFIG.accentColor } : {}),
        },
        text: tile ? tile.ch : '',
        onClick: () => game.tapSlot(i),
      });
    })
  );

  const tilesRow = el('div', { className: 'tiles-row', style: { gap: slotGap + 'px' } },
    scrambled.map(t => el('div', {
      className: 'tile bank-tile' + (t.used ? ' used' : ''),
      style: { width: slotSize + 'px', height: slotSize + 'px', fontSize: slotFont + 'px', borderRadius: tileRadius },
      text: t.ch,
      onClick: () => game.tapScrambled(t.id),
    }))
  );

  const body = el('div', { className: 'play-body', onClick: () => window.focusMobileKeyboard && window.focusMobileKeyboard() }, [
    el('div', { className: 'clue-label', text: 'CLUE' }),
    el('div', { className: 'clue-text', text: dailyClue }),
    slotsRow,
    el('div', { className: 'hint-text', text: 'Solve all 5 as fast as you can' }),
    el('button', { className: 'shuffle-button', text: 'Shuffle', onClick: () => game.shuffleTiles() }),
    tilesRow,
  ]);

  return el('div', { className: 'screen', style: { position: 'relative' } }, [header, progressBar, body]);
}

function renderArcadeOver(state, game) {
  const isNewBest = state.arcadeScore >= state.arcadeBest && state.arcadeScore > 0;
  return el('div', { className: 'center-screen' }, [
    el('div', { className: 'center-eyebrow', text: "TIME'S UP" }),
    el('div', { className: 'center-title-mono', text: String(state.arcadeScore) }),
    state.arcadeWord ? el('div', { className: 'center-answer', text: `Answer: ${state.arcadeWord}` }) : null,
    el('div', { className: 'center-desc', text: isNewBest ? 'New best score!' : `Best: ${state.arcadeBest}` }),
    el('button', { className: 'btn-primary inline', text: 'Share Score', style: { marginBottom: '12px' }, onClick: () => game.shareArcade() }),
    state.arcadeShareStatus ? el('div', { className: 'share-status', text: state.arcadeShareStatus }) : null,
    el('button', { className: 'btn-primary inline', text: 'Play Again', style: { marginBottom: '12px' }, onClick: () => game.startArcade() }),
    el('div', { className: 'back-link', text: '‹ Modes', onClick: () => game.goHome() }),
  ]);
}

function renderDailyDone(state, game) {
  const elapsed = state.dailyResult ? state.dailyResult.elapsed : state.dailyElapsed;
  return el('div', { className: 'center-screen' }, [
    el('div', { className: 'center-icon', style: { background: CONFIG.accentColor }, text: '✓' }),
    el('div', { className: 'center-eyebrow', text: 'DAILY 5 COMPLETE' }),
    el('div', { className: 'center-title-mono', text: formatDuration(elapsed) }),
    el('div', { className: 'center-desc', text: 'Share your time and come back tomorrow for a new set.' }),
    el('button', { className: 'btn-primary inline', text: 'Share Time', style: { marginBottom: '12px' }, onClick: () => game.shareDaily() }),
    state.dailyShareStatus ? el('div', { className: 'share-status', text: state.dailyShareStatus }) : null,
    el('div', { className: 'back-link', text: '‹ Modes', onClick: () => game.goHome() }),
  ]);
}

function renderStageDone(state, game) {
  const stage = STAGES[state.activeStage];
  const isLastStage = state.activeStage + 1 >= STAGES.length;
  return el('div', { className: 'center-screen' }, [
    el('div', { className: 'center-icon', style: { background: CONFIG.accentColor }, text: '✓' }),
    el('div', { className: 'center-eyebrow', text: 'STAGE COMPLETE' }),
    el('div', { className: 'center-title', text: stage.name }),
    el('button', { className: 'btn-primary inline', text: 'Share Stage', style: { marginBottom: '12px' }, onClick: () => game.shareStage() }),
    state.stageShareStatus ? el('div', { className: 'share-status', text: state.stageShareStatus }) : null,
    el('button', { className: 'btn-primary inline', text: isLastStage ? 'Back to Stages' : 'Next Stage', onClick: () => game.afterStageDone() }),
  ]);
}

function renderDone(state, game) {
  return el('div', { className: 'center-screen' }, [
    el('div', { className: 'center-icon', style: { background: CONFIG.accentColor }, text: '✓' }),
    el('div', { className: 'center-title-mono', text: 'ALL CLEARED' }),
    el('div', { className: 'center-desc', text: 'You cleared every stage. Play again to sharpen your time.' }),
    el('button', { className: 'btn-primary inline', text: 'Play Again', onClick: () => game.playAgain() }),
  ]);
}

function render(state, game) {
  const app = document.getElementById('app');
  app.innerHTML = '';
  let node;
  switch (state.screen) {
    case 'home': node = renderHome(state, game); break;
    case 'stages': node = renderStages(state, game); break;
    case 'levels': node = renderLevels(state, game); break;
    case 'play': node = renderPlay(state, game); break;
    case 'arcadePlay': node = renderArcadePlay(state, game); break;
    case 'dailyPlay': node = renderDailyPlay(state, game); break;
    case 'arcadeOver': node = renderArcadeOver(state, game); break;
    case 'dailyDone': node = renderDailyDone(state, game); break;
    case 'stageDone': node = renderStageDone(state, game); break;
    case 'done': node = renderDone(state, game); break;
  }
  app.appendChild(node);
}
