// game-score.js

import { bingoController } from './bingo-controller.js';
import { gameFlow } from './game-flow.js';

class GameScore {
  constructor(scoreElementId = 'game-score') {
    this.scoreElementId = scoreElementId;
    this.scoreElement = document.querySelector('#game-score');
    this.displayInfo = this.scoreElement.querySelector('.display');
    this.statusList = this.scoreElement.querySelector('.status-list');
    this.gameBoard = document.getElementById('grid-game-board');
  }

  init() {
    this.initializeScore();
  }

  initializeScore() {
    bingoController.onBallMarked = this.updateStatusList.bind(this);
    bingoController.onWinnerDetected = this.showWinnerMessage.bind(this);
  }

  showCardsLoadedMessage(cardCount) {
    this.displayInfo.textContent = `Total de tablas activas: ${cardCount}`;
    setTimeout(() => {
      this.displayInfo.textContent = '';
    }, 10000);
  }

  showWinnerMessage(winnerCount) {
    this.displayInfo.textContent = `Total de tablas ganadoras: ${winnerCount}`;
    this.disableGameBoard();
    gameFlow.goToPhase('gameOver'); // Cambiar a la fase 'gameOver'
  }

  updateStatusList(cards) {
    this.disableGameBoard();
    this.statusList.innerHTML = '';
    cards.forEach((card, index) => {
      const listItem = document.createElement('li');
      listItem.classList.add('item', 'ticket');
      listItem.innerHTML = `
        <span class="index-num">${index + 1}</span>
        <span class="status ${card.status}"></span>
        <span class="id-ticket">${card.id}</span>
      `;
      this.statusList.appendChild(listItem);
    });
    this.enableGameBoard();
  }

  disableGameBoard() {
    this.gameBoard.style.pointerEvents = 'none';
  }

  enableGameBoard() {
    this.gameBoard.style.pointerEvents = 'auto';
  }

  reset() {
    this.statusList.innerHTML = '';
    this.displayInfo.textContent = '';
  }
}

const gameScore = new GameScore();

export { gameScore };