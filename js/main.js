// main.js

import { gameFlow } from './components/game-flow.js';
import { bingoController } from './components/bingo-controller.js';

document.addEventListener('DOMContentLoaded', () => {
  gameFlow.startGame();

  document.addEventListener('phaseChanged', (event) => {
    console.log('Fase del juego cambiada:', event.detail);
    if (event.detail === 'loading') {
      document.querySelector('#btn-new-game').addEventListener('click', handleLoadCards);
      document.querySelector('#file-input').addEventListener('change', handleFileChange);
    }
  });

  document.addEventListener('gameOver', () => {
    gameFlow.goToPhase('gameOver');
  });

  function handleLoadCards() {
    document.querySelector('#file-input').click();
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        bingoController.loadCards(e.target.result);
        gameFlow.nextPhase();
      };
      reader.readAsText(file);
    }
  }

  bingoController.onCardsLoaded = (cardCount) => {
    document.querySelector('#game-score .display').textContent = `Total de tablas activas: ${cardCount}`;
    setTimeout(() => {
      document.querySelector('#game-score .display').textContent = '';
    }, 10000);
  };
});