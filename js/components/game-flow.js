// game-flow.js

import { bingoController } from './bingo-controller.js';
import { gameBoard } from './game-board.js';
import { gameMode } from './game-mode.js';
import { gameScore } from './game-score.js';
import { gameControl } from './game-control.js';

class GameFlow {
  constructor() {
    this.currentPhase = 'loading'; // Fase inicial
    this.phases = ['loading', 'patternSelection', 'game', 'gameOver'];
    this.phaseIndex = 0;
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    document.addEventListener('gameOver', () => {
      this.goToPhase('gameOver');
    });
  }

  nextPhase() {
    this.phaseIndex = (this.phaseIndex + 1) % this.phases.length;
    this.currentPhase = this.phases[this.phaseIndex];
    this.notifyPhaseChange();
  }

  goToPhase(phase) {
    const index = this.phases.indexOf(phase);
    if (index !== -1) {
      this.phaseIndex = index;
      this.currentPhase = phase;
      this.notifyPhaseChange();
    }
  }

  notifyPhaseChange() {
    const event = new CustomEvent('phaseChanged', { detail: this.currentPhase });
    document.dispatchEvent(event);
    this.handlePhaseLogic();
  }

  handlePhaseLogic() {
    switch (this.currentPhase) {
      case 'loading':
        // Lógica para la fase de carga de datos
        break;
      case 'patternSelection':
        gameMode.init();
        break;
      case 'game':
        gameBoard.init();
        gameScore.init();
        gameControl.init();
        break;
      case 'gameOver':
        // Lógica para la fase de fin del juego
        this.handleGameOver();
        break;
    }
  }

  handleGameOver() {
    // Lógica para la fase de fin del juego
    gameControl.enableControlButtons();
  }

  startGame() {
    this.goToPhase('patternSelection');
  }

  restartGame() {
    this.goToPhase('loading');
    bingoController.reset();
    gameBoard.reset();
    gameMode.reset();
    gameScore.reset();
    gameControl.reset();
  }
}

const gameFlow = new GameFlow();

export { gameFlow };