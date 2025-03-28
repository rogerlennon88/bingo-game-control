// js/main.js

import { gameFlow } from "./components/game-flow.js";
import { bingoController } from "./components/bingo-controller.js";
import { gameCardsLoader } from "./components/game-cards-loader.js";
import { gameScore } from "./components/game-score.js";
import { systemMessage } from "./components/system-message.js";

const socket = io();

document.addEventListener("DOMContentLoaded", () => {
  
  gameScore.init();
  gameFlow.startGame();

  document.addEventListener("gameOver", () => {
    gameFlow.goToPhase("gameOver");
  });
});

// Ejemplo de uso de SystemMessage
// systemMessage.show("Bienvenido al juego de bingo", "success");