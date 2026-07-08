const kbInput = document.getElementById('kb-capture');
const PLAY_SCREENS = ['play', 'arcadePlay'];

const game = new Game(state => {
  render(state, game);
  if (!PLAY_SCREENS.includes(state.screen)) kbInput.blur();
});
render(game.state, game);

// Tapping the play area focuses this hidden input, which is what actually
// summons the on-screen keyboard on mobile (requires a real user gesture).
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
    }
    return;
  }
  if (game.state.screen !== 'play' && game.state.screen !== 'arcadePlay') return;
  if (e.key === 'Backspace') {
    e.preventDefault();
    game.backspace();
    return;
  }
  if (/^[a-zA-Z]$/.test(e.key)) {
    game.typeLetter(e.key.toUpperCase());
  }
});
