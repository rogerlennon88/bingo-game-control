// game-score.js

import { bingoController } from "./bingo-controller.js";
import { gameFlow } from "./game-flow.js";

class GameScore {
  constructor(scoreElementId = "game-score") {
    this.scoreElementId = scoreElementId;
    this.scoreElement = document.querySelector("#game-score");
    this.statusList = this.scoreElement.querySelector(".status-list");
    this.gameBoard = document.getElementById("grid-game-board");
    this.totalCardsDisplay = document.getElementById("total-cards");
    this.totalBallsDisplay = document.getElementById("total-balls");
    this.totalWinnersDisplay = document.getElementById("total-winners");
    // this.displayInfo = this.scoreElement.querySelector('.display'); // Eliminar esta línea
  }

  init() {
    this.initializeScore();
  }

  initializeScore() {
    bingoController.onBallMarked = this.updateStatusList.bind(this);
    bingoController.onWinnerDetected = this.updateWinnersCount.bind(this);
    bingoController.onCardsLoaded = this.updateCardsCount.bind(this);
    this.updateBallsCount();
  }

  updateCardsCount(cardCount) {
    this.totalCardsDisplay.textContent = cardCount;
  }

  updateBallsCount() {
    this.totalBallsDisplay.textContent = bingoController.markedBalls.size;
    requestAnimationFrame(this.updateBallsCount.bind(this));
  }

  updateWinnersCount(winnerCount) {
    this.totalWinnersDisplay.textContent = winnerCount;
    this.disableGameBoard();
    gameFlow.goToPhase("gameOver");
  }

  updateStatusList(cards) {
    this.disableGameBoard();
    this.statusList.innerHTML = "";
    cards.forEach((card, index) => {
      const listItem = document.createElement("li");
      listItem.classList.add("item", "ticket");
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
    this.gameBoard.style.pointerEvents = "none";
  }

  enableGameBoard() {
    this.gameBoard.style.pointerEvents = "auto";
  }

  reset() {
    this.statusList.innerHTML = "";
    this.totalCardsDisplay.textContent = "0";
    this.totalBallsDisplay.textContent = "0";
    this.totalWinnersDisplay.textContent = "0";
  }
}

const gameScore = new GameScore();

export { gameScore };
