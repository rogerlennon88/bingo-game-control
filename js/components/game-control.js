// game-control.js

class GameControl {
  constructor(controlElementId = 'game-control') {
    this.controlElementId = controlElementId;
    this.controlElement = document.getElementById(this.controlElementId);
    this.initializeControl();
  }

  initializeControl() {
    this.buttons = this.controlElement.querySelectorAll('.btn-gc');
    this.buttons.forEach(button => {
      button.classList.add('lock');
    });
  }

  enableControlButtons() {
    const restartButton = document.getElementById('btn-restart-game');
    const newGameButton = document.getElementById('btn-new-game');
    restartButton.classList.remove('lock');
    newGameButton.classList.remove('lock');
  }

  disableControlButtons() {
    this.buttons.forEach(button => {
      button.classList.add('lock');
    });
  }
}

const gameControl = new GameControl();

export { gameControl };
