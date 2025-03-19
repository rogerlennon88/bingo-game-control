// js/components/game-cards-loader.js

import { gameFlow } from "./game-flow.js";
import { bingoController } from "./bingo-controller.js";
import { gameScore } from "./game-score.js";

class GameCardsLoader {
  constructor(loaderElementId = "game-cards-loader") {
    this.loaderElementId = loaderElementId;
    this.loaderElement = document.getElementById(this.loaderElementId);
    this.fileInput = document.getElementById("file-input");
    this.loadButton = document.getElementById("btn-cards-load");
    this.initializeLoader();
  }

  initializeLoader() {
    if (this.loadButton) {
      this.loadButton.addEventListener(
        "click",
        this.handleLoadCards.bind(this)
      );
    }
    if (this.fileInput) {
      this.fileInput.addEventListener(
        "change",
        this.handleFileChange.bind(this)
      );
    }
  }

  handleLoadCards() {
    console.log('GameCardsLoader: Botón "Cargar datos" clickeado.');
    gameScore.init();
    bingoController.loadCards().then(() => {
        gameFlow.nextPhase();
    });
}

  handleFileChange(event) {
    console.log(
      "GameCardsLoader: Archivo seleccionado (ignorado temporalmente)."
    );
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      this.loadButton.classList.remove("lock");
    } else {
      this.loadButton.classList.add("lock");
    }
  }
}

const gameCardsLoader = new GameCardsLoader();

document.addEventListener("DOMContentLoaded", () => {
  // No es necesario instanciar GameCardsLoader aquí
});

export { gameCardsLoader };
