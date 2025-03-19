// js/main.js

import { gameFlow } from "./components/game-flow.js";
import { bingoController } from "./components/bingo-controller.js";
import { gameCardsLoader } from "./components/game-cards-loader.js";
import { gameScore } from "./components/game-score.js";

document.addEventListener("DOMContentLoaded", () => {
  gameScore.init();
  gameFlow.startGame();

  document.addEventListener("gameOver", () => {
    gameFlow.goToPhase("gameOver");
  });
});
