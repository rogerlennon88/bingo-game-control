// js/components/bingo-controller.js

import { gameFlow } from './game-flow.js';

class BingoController {
  constructor() {
    this.bingoCards = new Map();
    this.markedBalls = new Set();
    this.selectedPattern = new Set();
    this.onCardsLoaded = null;
    this.onBallMarked = null;
    this.onWinnerDetected = null;
    this.winners = new Set();
    this.loadCards();
  }

  async loadCards() {
    try {
      const response = await fetch("data/bingo-cards.csv");
      const csvData = await response.text();
      this.processBingoCards(csvData);
    } catch (error) {
      console.error("Error loading bingo cards:", error);
    }
  }

  processBingoCards(csvData) {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length === headers.length) {
        const card = {};
        const cells = {};
        for (let j = 0; j < headers.length; j++) {
          if (headers[j] === 'id' || headers[j] === 'serial') {
            card[headers[j]] = values[j];
          } else {
            cells[headers[j]] = values[j];
          }
        }
        card.cells = cells;
        this.bingoCards.set(card.id, card);
      }
    }
    if (this.onCardsLoaded) {
      this.onCardsLoaded(this.bingoCards.size);
    }
  }

  markBall(ballNumber) {
    this.markedBalls.add(ballNumber);
    this.checkPatterns(ballNumber);
    console.log("Balota marcada:", ballNumber);
    this.updateBallCount(); // Actualizar el contador de balotas
  }

  checkPatterns(ballNumber) {
    this.bingoCards.forEach((card, cardId) => {
      for (const key in card.cells) {
        if (card.cells[key] === ballNumber.toString()) {
          this.updateCardState(cardId, key);
          this.verifyPattern(cardId);
        }
      }
    });
    this.updateCardRanking();
  }

  updateCardState(cardId, position) {
    const card = this.bingoCards.get(cardId);
    if (!card.markedPositions) {
      card.markedPositions = new Set();
    }
    if (!card.markedPositions.has(position) && this.selectedPattern.has(position)) {
      card.markedPositions.add(position);
      card.lastMarkedTime = Date.now();
      console.log(`Tabla ${cardId} posición marcada:`, position);
    }
  }

  verifyPattern(cardId) {
    console.log(`Verificando patrón para tabla ${cardId}`);
    const card = this.bingoCards.get(cardId);
    if (!card.markedPositions) {
      return;
    }
    const pattern = this.selectedPattern;
    if (pattern.size === 0) {
      return;
    }
    let patternComplete = true;
    for (const position of pattern) {
      if (!card.markedPositions.has(position)) {
        patternComplete = false;
        break;
      }
    }
    if (patternComplete) {
      this.winners.add(cardId);
      card.status = 'winner';
      if (this.onWinnerDetected) {
        this.onWinnerDetected(this.winners.size);
      }
      this.checkWinners();
    } else if (pattern.size - card.markedPositions.size === 1) {
      card.status = 'started';
    } else {
      card.status = '';
    }
  }

  checkWinners() {
    if (this.winners.size > 0 && !gameFlow.isGameOver) {
      const event = new CustomEvent('gameOver');
      document.dispatchEvent(event);
    }
  }

  updateCardRanking() {
    const cards = Array.from(this.bingoCards.values());
    const rankedCards = cards
      .filter(card => card.status === 'winner' || card.status === 'started')
      .sort((a, b) => {
        const aMissing = this.selectedPattern.size - (a.markedPositions ? a.markedPositions.size : 0);
        const bMissing = this.selectedPattern.size - (b.markedPositions ? b.markedPositions.size : 0);
        if (aMissing !== bMissing) {
          return aMissing - bMissing;
        }
        return (a.lastMarkedTime || 0) - (b.lastMarkedTime || 0);
      });
    if (this.onBallMarked) {
      this.onBallMarked(rankedCards);
    }
  }

  selectPattern(pattern) {
    this.selectedPattern = pattern;
    console.log("Patrón seleccionado:", this.selectedPattern);
  }

  reset() {
    this.bingoCards.clear();
    this.markedBalls.clear();
    this.selectedPattern.clear();
    this.winners.clear();
  }

  resetGamePhase() {
    this.markedBalls.clear();
    this.winners.clear();
    this.bingoCards.forEach(card => {
      card.markedPositions = new Set();
      card.status = '';
    });
  }

  updateBallCount() {
    const totalBallsElement = document.getElementById('total-balls');
    if (totalBallsElement) {
      totalBallsElement.textContent = this.markedBalls.size;
    }
  }
}

const bingoController = new BingoController();

export { bingoController };