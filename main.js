const game = new Game(state => render(state, game));
render(game.state, game);

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
