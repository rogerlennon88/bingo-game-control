// js/main.js

import { gameFlow } from "./components/game-flow.js";
import { bingoController } from "./components/bingo-controller.js";
import { gameCardsLoader } from "./components/game-cards-loader.js";
import { gameScore } from "./components/game-score.js"; // Importar gameScore

document.addEventListener("DOMContentLoaded", () => {
  gameScore.init(); // Inicializar gameScore primero
  gameFlow.startGame();

  document.addEventListener("phaseChanged", (event) => {
    console.log("Fase del juego cambiada:", event.detail);
    if (event.detail === "dataLoading") {
      // No es necesario llamar a bingoController.loadCards() aquí
    }
  });

  document.addEventListener("gameOver", () => {
    gameFlow.goToPhase("gameOver");
  });
});
