function el(tag, opts = {}, children = []) {
  const node = document.createElement(tag);
  if (opts.className) node.className = opts.className;
  if (opts.text !== undefined) node.textContent = opts.text;
  if (opts.html !== undefined) node.innerHTML = opts.html;
  if (opts.style) Object.assign(node.style, opts.style);
  if (opts.onClick) node.addEventListener('click', opts.onClick);
  children.forEach(c => c && node.appendChild(c));
  return node;
}

function tileMetrics(wordLen) {
  return {
    slotSize: wordLen <= 5 ? 48 : wordLen <= 7 ? 42 : 34,
    slotFont: wordLen <= 5 ? 22 : wordLen <= 7 ? 19 : 15,
    slotGap: wordLen <= 7 ? 8 : 6,
    tileRadius: CONFIG.tileShape === 'circle' ? '50%' : '4px',
  };
}

function renderHome(state, game) {
  const totalLevels = STAGES.reduce((sum, s) => sum + s.levels.length, 0);
  const totalSolved = state.stageProgress.reduce((sum, n) => sum + n, 0);

  const stagesCard = el('div', {
    className: 'mode-card',
    style: { cursor: 'pointer' },
    onClick: () => game.goToStages(),
  }, [
    el('div', { className: 'mode-card-title', text: 'Stages' }),
    el('div', { className: 'mode-card-desc', text: 'No timer. Clear all 50 stages at your own pace, from easy to expert.' }),
    el('div', { className: 'mode-card-meta', text: `${totalSolved} of ${totalLevels} words solved` }),
  ]);

  const arcadeCard = el('div', {
    className: 'mode-card',
    style: { cursor: 'pointer' },
    onClick: () => game.startArcade(),
  }, [
    el('div', { className: 'mode-card-title', text: 'Timed Challenge' }),
    el('div', { className: 'mode-card-desc', text: `30 seconds per word. New random words and order every run — see how many you can solve.` }),
    el('div', { className: 'mode-card-meta', text: state.arcadeBest > 0 ? `Best: ${state.arcadeBest}` : 'No runs yet' }),
  ]);

  return el('div', { className: 'screen' }, [
    el('div', { className: 'screen-header' }, [
      el('div', { className: 'app-title', text: 'ANAGRAM' }),
      el('div', { className: 'app-subtitle', text: 'Choose a mode' }),
    ]),
    el('div', { className: 'stage-list' }, [stagesCard, arcadeCard]),
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
        borderColor: completed ? CONFIG.accentColor : unlocked ? '#141414' : '#E2E2DA',
        background: unlocked ? '#FFFFFF' : '#F2F2ED',
        opacity: unlocked ? 1 : 0.65,
        cursor: unlocked ? 'pointer' : 'default',
      },
      onClick: unlocked ? () => game.openStage(i) : null,
    }, [
      el('div', { className: 'stage-card-top' }, [
        el('div', { className: 'stage-card-label', style: { color: unlocked ? '#8A8A85' : '#C7C7BE' }, text: 'STAGE ' + (i + 1) }),
        el('div', { className: 'stage-card-right', style: { color: completed ? CONFIG.accentColor : unlocked ? '#141414' : '#C7C7BE' }, text: completed ? 'DONE' : unlocked ? 'PLAY' : 'LOCKED' }),
      ]),
      el('div', { className: 'stage-card-name', style: { color: unlocked ? '#141414' : '#B8B8AF' }, text: s.name }),
      el('div', { className: 'progress-track' }, [
        el('div', { className: 'progress-fill', style: { width: pct + '%', background: completed ? CONFIG.accentColor : '#141414' } }),
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
          background: isCompleted ? CONFIG.accentColor : isFrontier ? '#141414' : '#FFFFFF',
          color: isCompleted || isFrontier ? '#FFFFFF' : '#C7C7BE',
          border: isUnlockedNow ? '2px solid transparent' : '2px solid #E2E2DA',
        },
        text: isCompleted ? '✓' : String(i + 1),
      }),
      el('div', { className: 'level-info' }, [
        el('div', { className: 'level-clue', style: { color: isUnlockedNow ? '#141414' : '#B8B8AF' }, text: isUnlockedNow ? l.clue : 'Locked' }),
        el('div', { className: 'level-meta', text: isUnlockedNow ? `${l.word.length} letters` : 'Complete the previous level' }),
      ]),
      el('div', {
        className: 'level-right',
        style: { color: isCompleted ? CONFIG.accentColor : isFrontier ? '#141414' : '#C7C7BE' },
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

  const body = el('div', { className: 'play-body' }, [
    el('div', { className: 'clue-label', text: 'CLUE' }),
    el('div', { className: 'clue-text', text: lvl.clue }),
    slotsRow,
    el('div', { className: 'hint-text', text: 'Tap or type letters to build the word' }),
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
  const timerColor = timerPct <= 25 ? '#DC2626' : '#141414';

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

  const body = el('div', { className: 'play-body' }, [
    el('div', { className: 'clue-label', text: 'CLUE' }),
    el('div', { className: 'clue-text', text: arcadeClue }),
    slotsRow,
    el('div', { className: 'hint-text', text: 'Tap or type letters to build the word' }),
    tilesRow,
  ]);

  return el('div', { className: 'screen', style: { position: 'relative' } }, [header, timerBar, body]);
}

function renderArcadeOver(state, game) {
  const isNewBest = state.arcadeScore >= state.arcadeBest && state.arcadeScore > 0;
  return el('div', { className: 'center-screen' }, [
    el('div', { className: 'center-eyebrow', text: "TIME'S UP" }),
    el('div', { className: 'center-title-mono', text: String(state.arcadeScore) }),
    el('div', { className: 'center-desc', text: isNewBest ? 'New best score!' : `Best: ${state.arcadeBest}` }),
    el('button', { className: 'btn-primary inline', text: 'Play Again', style: { marginBottom: '12px' }, onClick: () => game.startArcade() }),
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
    case 'arcadeOver': node = renderArcadeOver(state, game); break;
    case 'stageDone': node = renderStageDone(state, game); break;
    case 'done': node = renderDone(state, game); break;
  }
  app.appendChild(node);
}
