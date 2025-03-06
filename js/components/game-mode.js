/**
 * game-mode.js
 */

import { bingoController } from "./bingo-controller.js";

class GameMode {
  constructor(modeElementId = "grid-game-mode") {
    this.modeElementId = modeElementId;
    this.selectedPattern = new Set();
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
    this.selectButton.disabled = true;
    this.selectButton.addEventListener(
      "click",
      this.handleSelectButtonClick.bind(this)
    );
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
      letterButton.classList.add("btn", "btn-ggm");
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
    this.selectButton.disabled = this.selectedPattern.size < 4;
  }

  handleSelectButtonClick() {
    if (confirm('¿Confirmar Modo de Juego?')) {
      this.enableGameBoard();
      bingoController.selectPattern(this.selectedPattern);
      bingoController.loadBingoCards(); // Cargar las tablas después de confirmar el modo de juego
    }
  }

  disableGameBoard() {
    this.gameBoard.style.pointerEvents = "none";
    const buttons = this.gameBoard.querySelectorAll(".btn-ggb");
    buttons.forEach((button) => {
      button.style.cursor = "default";
      button.style.pointerEvents = "none";
    });
  }

  enableGameBoard() {
    this.gameBoard.style.pointerEvents = "auto";
    const buttons = this.gameBoard.querySelectorAll(".btn-ggb");
    buttons.forEach((button) => {
      button.style.cursor = "pointer";
      button.style.pointerEvents = "auto";
    });
  }
}

const gameMode = new GameMode();

export { gameMode };
