const kbInput = document.getElementById('kb-capture');
const PLAY_SCREENS = ['play', 'arcadePlay', 'dailyPlay'];

const game = new Game(state => {
  render(state, game);
  // Entering a play screen always happens as the direct result of a tap
  // (choosing a level, hitting Play Again, etc.), so focusing here — still
  // inside that same synchronous click/keydown handler — lets the browser
  // treat it as user-initiated and pop the keyboard without a second tap.
  if (PLAY_SCREENS.includes(state.screen)) {
    kbInput.value = '';
    kbInput.focus();
  } else {
    kbInput.blur();
  }
});
render(game.state, game);

// Fallback: if the keyboard gets dismissed mid-puzzle (e.g. the user taps
// away), tapping the play area brings it back.
window.focusMobileKeyboard = () => {
  if (PLAY_SCREENS.includes(game.state.screen)) {
    kbInput.value = '';
    kbInput.focus();
  }
};

kbInput.addEventListener('input', e => {
  if (!PLAY_SCREENS.includes(game.state.screen)) { kbInput.value = ''; return; }
  if (e.inputType && e.inputType.startsWith('delete')) {
    game.backspace();
    kbInput.value = '';
    return;
  }
  const letters = kbInput.value.replace(/[^a-zA-Z]/g, '');
  kbInput.value = '';
  letters.split('').forEach(ch => game.typeLetter(ch.toUpperCase()));
});

document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    if (game.state.screen === 'play' && game.state.status === 'success') {
      e.preventDefault();
      game.next();
    } else if (game.state.screen === 'stageDone') {
      e.preventDefault();
      game.afterStageDone();
    } else if (game.state.screen === 'done') {
      e.preventDefault();
      game.playAgain();
    } else if (game.state.screen === 'arcadeOver') {
      e.preventDefault();
      game.startArcade();
    } else if (game.state.screen === 'dailyDone') {
      e.preventDefault();
      game.goHome();
    }
    return;
  }
  if (!PLAY_SCREENS.includes(game.state.screen)) return;
  if (e.key === 'Backspace') {
    e.preventDefault();
    game.backspace();
    return;
  }
  if (/^[a-zA-Z]$/.test(e.key)) {
    // Prevent the browser from also inserting this character into the
    // focused hidden input — otherwise its 'input' handler fires too and
    // the same letter gets typed twice (e.g. "B" registering as "BB").
    e.preventDefault();
    game.typeLetter(e.key.toUpperCase());
  }
});
