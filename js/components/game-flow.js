// js/components/game-flow.js

import { bingoController } from "./bingo-controller.js";
import { gameBoard } from "./game-board.js";
import { gameMode } from "./game-mode.js";
import { gameScore } from "./game-score.js";
import { gameControl } from "./game-control.js";

class GameFlow {
  constructor() {
    this.currentPhase = "startup"; // Fase inicial: arranque
    this.phases = [
      "startup",
      "dataLoading",
      "patternSelection",
      "game",
      "gameOver",
    ]; // Fases actualizadas
    this.phaseIndex = 0;
    this.isGameOver = false;
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    document.addEventListener("gameOver", () => {
      this.goToPhase("gameOver");
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
    console.log(`Fase del juego cambiada: ${this.currentPhase}`);
    const event = new CustomEvent("phaseChanged", {
      detail: this.currentPhase,
    });
    document.dispatchEvent(event);
    this.handlePhaseLogic();
  }

  handlePhaseLogic() {
    switch (this.currentPhase) {
      case "startup":
        console.log("Fase: Arranque");
        this.nextPhase();
        break;
      case "dataLoading":
        console.log("Fase: Carga de datos");
        break;
      case "patternSelection":
        gameMode.init();
        break;
      case "game":
        gameBoard.init();
        gameScore.init();
        gameControl.init();
        break;
      case "gameOver":
        this.handleGameOver();
        break;
    }
  }

  handleGameOver() {
    // Lógica para la fase de fin del juego
    gameControl.enableControlButtons();
    this.isGameOver = true;
    this.lockGameBoardButtons();
    this.lockRestartButton(); // Bloquear botón de reinicio
  }

  lockGameBoardButtons() {
    const gameBoardButtons = document.querySelectorAll(
      "#grid-game-board .btn-ggb"
    );
    gameBoardButtons.forEach((button) => {
      button.classList.add("lock");
    });
  }

  lockRestartButton() {
    const restartButton = document.getElementById("btn-restart-game");
    restartButton.classList.add("lock");
  }

  startGame() {
    this.goToPhase("startup"); // Iniciar en la fase de arranque
  }

  restartGame() {
    if (this.currentPhase === "game") {
      bingoController.resetGamePhase();
      gameBoard.reset();
      gameScore.reset();
    } else {
      this.goToPhase("startup"); // Reiniciar en la fase de arranque
      bingoController.reset();
      gameBoard.reset();
      gameMode.reset();
      gameScore.reset();
      gameControl.reset();
    }
    this.isGameOver = false;
    this.unlockGameBoardButtons();
    this.unlockRestartButton();
  }

  unlockGameBoardButtons() {
    const gameBoardButtons = document.querySelectorAll(
      "#grid-game-board .btn-ggb"
    );
    gameBoardButtons.forEach((button) => {
      button.classList.remove("lock");
    });
  }

  unlockRestartButton() {
    const restartButton = document.getElementById("btn-restart-game");
    restartButton.classList.remove("lock");
  }
}

const gameFlow = new GameFlow();

export { gameFlow };
