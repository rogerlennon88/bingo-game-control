// js/components/game-mode.js

import { bingoController } from "./bingo-controller.js";
import { gameControl } from "./game-control.js";
import { gameFlow } from "./game-flow.js";

class GameMode {
  constructor(modeElementId = "grid-game-mode") {
    this.modeElementId = modeElementId;
    this.selectedPattern = new Set();
    this.handleSelectClickBound = this.handleSelectButtonClick.bind(this);
    this.handleRestartGameBound = this.handleRestartGame.bind(this);
  }

  init() {
    this.initializeMode();
  }

  initializeMode() {
    const mode = document.getElementById(this.modeElementId);
    if (!mode) {
      console.error(`Element with id ${this.modeElementId} not found.`);
      return;
    }
    this.renderMode(mode);
    mode.addEventListener("click", this.handlePatternClick.bind(this));
    this.selectButton = document.getElementById("btn-select-mode");
    this.selectButton.classList.add("lock");
    this.selectButton.addEventListener("click", this.handleSelectClickBound);
    this.gameBoard = document.getElementById("grid-game-board");
    this.disableGameBoard();
  }

  renderMode(mode) {
    const letters = ["B", "I", "N", "G", "O"];
    for (let i = 0; i < 5; i++) {
      const group = document.createElement("div");
      group.classList.add("group");
      const letterCell = document.createElement("div");
      letterCell.classList.add("cell", "letter");
      const letterButton = document.createElement("button");
      letterButton.id = `${letters[i].toLowerCase()}-ggm`;
      letterButton.classList.add("btn", "btn-ggm", "lock");
      letterButton.textContent = letters[i];
      letterCell.appendChild(letterButton);
      group.appendChild(letterCell);
      for (let j = 1; j <= 5; j++) {
        const numberCell = document.createElement("div");
        numberCell.classList.add("cell", "num");
        const numberButton = document.createElement("button");
        numberButton.id = `${letters[i].toLowerCase()}${j}`;
        numberButton.classList.add("btn", "btn-ggm");
        numberButton.textContent = `${letters[i].toLowerCase()}${j}`;
        if (letters[i].toLowerCase() === "n" && j === 3) {
          numberButton.classList.add("lock");
        }
        numberCell.appendChild(numberButton);
        group.appendChild(numberCell);
      }
      mode.appendChild(group);
    }
  }

  handlePatternClick(event) {
    if (event.target.classList.contains("btn-ggm")) {
      const buttonId = event.target.id;
      this.togglePatternSelection(buttonId, event.target);
      this.updateSelectButtonState();
    }
  }

  togglePatternSelection(buttonId, buttonElement) {
    if (this.selectedPattern.has(buttonId)) {
      this.selectedPattern.delete(buttonId);
      buttonElement.classList.remove("active");
    } else {
      this.selectedPattern.add(buttonId);
      buttonElement.classList.add("active");
    }
    console.log("Patrón seleccionado:", Array.from(this.selectedPattern));
  }

  updateSelectButtonState() {
    if (this.selectedPattern.size >= 4) {
      this.selectButton.classList.remove("lock");
    } else {
      this.selectButton.classList.add("lock");
    }
  }

  disableModeButtons() {
    const buttons = document.querySelectorAll(".btn-ggm");
    buttons.forEach((button) => {
      button.classList.add("lock");
    });
  }

  disableNumberButtons() {
    const buttons = document.querySelectorAll(".btn-ggm:not(.lock)");
    buttons.forEach((button) => {
      button.classList.add("lock");
    });
  }

  handleSelectButtonClick() {
    const cardCount = bingoController.bingoCards.size;
    if (confirm(`Total de tablas activas: ${cardCount} ¿Confirmar Modo de Juego?`)) {
      this.enableGameBoard();
      bingoController.selectPattern(this.selectedPattern);
      bingoController.loadCards();
      this.disableModeButtons();
      this.disableNumberButtons();
      this.selectButton.classList.add("lock");
      this.selectButton.removeEventListener("click", this.handleSelectClickBound);
      gameControl.enableControlButtons();
      gameFlow.nextPhase(); // Llamar a gameFlow.nextPhase()
    }
  }

  handleRestartGame() {
    if (confirm("¿Reiniciar Juego?")) {
      this.resetGame();
      gameControl.disableControlButtons();
      this.enableModeButtons();
      this.disableGameBoard();
    }
  }

  enableModeButtons() {
    const buttons = document.querySelectorAll(".btn-ggm");
    buttons.forEach((button) => {
      button.classList.remove("lock");
    });
  }

  disableGameBoard() {
    const buttons = this.gameBoard.querySelectorAll(".btn-ggb");
    buttons.forEach((button) => {
      button.classList.add("lock");
    });
  }

  enableGameBoard() {
    const buttons = this.gameBoard.querySelectorAll(".btn-ggb");
    buttons.forEach((button) => {
      button.classList.remove("lock");
    });
  }

  reset() {
    this.selectedPattern.clear();
    const buttons = document.querySelectorAll(".btn-ggm");
    buttons.forEach((button) => {
      button.classList.remove("active");
      if (button.id !== "n3") {
        button.classList.remove("lock");
      }
    });
    this.selectButton.classList.add("lock");
    this.selectButton.addEventListener("click", this.handleSelectClickBound);
    this.enableModeButtons();
    this.disableGameBoard();
  }
}

const gameMode = new GameMode();

export { gameMode };
