// game-board.js

import { bingoController } from './bingo-controller.js';
import { gameControl } from './game-control.js';

class GameBoard {
  constructor(boardElementId = 'grid-game-board') {
    this.boardElementId = boardElementId;
    this.markedBalls = new Set();
    this.ballHistory = [];
    this.firstBallMarked = false;
  }

  init() {
    console.log("Inicializando gameBoard...");
    this.initializeBoard();
  }

  initializeBoard() {
    const board = document.getElementById(this.boardElementId);
    if (!board) {
      console.error(`Element with id ${this.boardElementId} not found.`);
      return;
    }
    this.renderBoard(board);
    board.addEventListener('click', this.handleBallClick.bind(this));
  }

  renderBoard(board) {
    const letters = ['B', 'I', 'N', 'G', 'O'];
    let ballNumber = 1;
    for (let i = 0; i < 5; i++) {
      const group = document.createElement('div');
      group.classList.add('group');
      const letterCell = document.createElement('div');
      letterCell.classList.add('cell', 'letter');
      const letterButton = document.createElement('button');
      letterButton.id = `${letters[i].toLowerCase()}-ggb`;
      letterButton.classList.add('btn', 'btn-ggb', 'letter');
      letterButton.textContent = letters[i];
      letterCell.appendChild(letterButton);
      group.appendChild(letterCell);
      for (let j = 0; j < 15; j++) {
        const numberCell = document.createElement('div');
        numberCell.classList.add('cell', 'num');
        const numberButton = document.createElement('button');
        numberButton.id = ballNumber.toString();
        numberButton.classList.add('btn', 'btn-ggb');
        numberButton.textContent = ballNumber.toString();
        numberCell.appendChild(numberButton);
        group.appendChild(numberCell);
        ballNumber++;
      }
      board.appendChild(group);
    }
  }

  handleBallClick(event) {
    if (event.target.classList.contains('btn-ggb') && !event.target.classList.contains('letter')) {
      const ballNumber = parseInt(event.target.id);
      bingoController.markBall(ballNumber);
      this.markBall(ballNumber);
      this.updateBallHistory(ballNumber);
      this.updateLastBallDisplay(ballNumber);
      this.updateLastBallsList();
      if (!this.firstBallMarked) {
        this.firstBallMarked = true;
        gameControl.enableRestartButton(); // Habilitar el botón de reinicio
      }
    }
  }

  markBall(ballNumber) {
    if (!this.markedBalls.has(ballNumber)) {
      this.markedBalls.add(ballNumber);
      const button = document.getElementById(ballNumber);
      button.classList.add('marked');
      button.disabled = true;
    }
  }

  updateBallHistory(ballNumber) {
    this.ballHistory.push(ballNumber);
  }

  updateLastBallDisplay(ballNumber) {
    const lastBallDisplay = document.querySelector('#last-number .num-1');
    lastBallDisplay.textContent = ballNumber.toString().padStart(2, '0');
  }

  updateLastBallsList() {
    const lastBallsList = document.querySelectorAll('#last-number-list .num-2, #last-number-list .num-3, #last-number-list .num-4, #last-number-list .num-5');
    const history = this.ballHistory.slice(-5, -1).reverse();
    lastBallsList.forEach((item, index) => {
      item.textContent = history[index] ? history[index].toString().padStart(2, '0') : '00';
    });
  }

  reset() {
    this.markedBalls.clear();
    this.ballHistory = [];
    this.firstBallMarked = false; // Restablecer la variable
    const markedButtons = document.querySelectorAll('#grid-game-board .btn-ggb.marked');
    markedButtons.forEach(button => {
      button.classList.remove('marked');
      button.disabled = false;
    });
    this.updateLastBallDisplay(0);
    this.updateLastBallsList();
  }
}

const gameBoard = new GameBoard();

export { gameBoard };
