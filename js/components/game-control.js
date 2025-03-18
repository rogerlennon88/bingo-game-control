// js/components/game-control.js

import { bingoController } from './bingo-controller.js';
import { gameBoard } from './game-board.js';
import { gameMode } from './game-mode.js';
import { gameScore } from './game-score.js';
import { gameFlow } from './game-flow.js';

class GameControl {
  constructor(controlElementId = 'game-control') {
    this.controlElementId = controlElementId;
    this.controlElement = document.getElementById(this.controlElementId);
  }

  init() {
    this.initializeControl();
  }

  initializeControl() {
    this.buttons = this.controlElement.querySelectorAll('.btn-gc');
    this.buttons.forEach(button => {
      button.classList.add('lock');
    });
    this.addEventListeners();
  }

  addEventListeners() {
    const restartButton = document.getElementById('btn-restart-game');
    restartButton.addEventListener('click', this.handleRestartGame.bind(this));
  }

  handleRestartGame() {
    if (confirm("¿Reiniciar Juego?")) {
      gameFlow.restartGame(); // Llamar a gameFlow.restartGame()
      this.disableRestartButton(); // Deshabilitar el botón de reinicio
    }
  }

  enableControlButtons() {
    const newGameButton = document.getElementById('btn-new-game');
    newGameButton.classList.remove('lock');
  }

  disableControlButtons() {
    this.buttons.forEach(button => {
      button.classList.add('lock');
    });
  }

  enableRestartButton() {
    const restartButton = document.getElementById('btn-restart-game');
    restartButton.classList.remove('lock');
  }

  disableRestartButton() {
    const restartButton = document.getElementById('btn-restart-game');
    restartButton.classList.add('lock');
  }

  reset() {
    this.disableControlButtons();
  }
}

const gameControl = new GameControl();

export { gameControl };