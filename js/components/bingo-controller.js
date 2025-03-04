// bingo-controller.js
class BingoController {
  constructor() {
    this.bingoCards = new Map(); // Almacenar las tablas por ID
    this.markedBalls = new Set(); // Almacenar las balotas marcadas
    this.selectedPattern = new Set(); // Almacenar el patrón seleccionado
    this.loadBingoCards();
  }

  async loadBingoCards() {
    try {
      const response = await fetch("data/bingo-cards.csv");
      const csvData = await response.text();
      this.processBingoCards(csvData);
    } catch (error) {
      console.error("Error loading bingo cards:", error);
    }
  }

  processBingoCards(csvData) {
    const lines = csvData.split("\n");
    const headers = lines[0].split(",");

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
      if (values.length === headers.length) {
        const card = {};
        const cells = {}; // Objeto para almacenar las celdas
        for (let j = 0; j < headers.length; j++) {
          if (headers[j] === "id") {
            card.id = values[j]; // Mantener el id separado
          } else {
            cells[headers[j]] = values[j]; // Almacenar las celdas en el objeto cells
          }
        }
        card.cells = cells; // Agregar el objeto cells al objeto card
        this.bingoCards.set(card.id, card);
      }
    }

    console.log("Tablas de Bingo cargadas:", this.bingoCards);
  }

  markBall(ballNumber) {
    this.markedBalls.add(ballNumber);
    this.checkPatterns(ballNumber); // Llamar a checkPatterns con la balota marcada
    console.log("Balota marcada:", ballNumber);
    console.log("Balotas marcadas:", this.markedBalls);
  }

  checkPatterns(ballNumber) {
    console.log("checkPatterns called with ballNumber:", ballNumber); // Agregar console.log
    this.bingoCards.forEach((card, cardId) => {
      console.log("Iterating card:", cardId); // Agregar console.log
      for (const key in card.cells) {
        if (card.cells[key] === ballNumber.toString()) {
          console.log(
            `Tabla ${cardId} contiene la balota ${ballNumber} en la posición ${key}`
          );
          this.updateCardState(cardId, key);
          this.verifyPattern(cardId);
        }
      }
    });
  }

  updateCardState(cardId, position) {
    const card = this.bingoCards.get(cardId);
    if (!card.markedPositions) {
      card.markedPositions = new Set();
    }
    card.markedPositions.add(position);
    console.log(
      `Posiciones marcadas en la tabla ${cardId}:`,
      card.markedPositions
    );
  }

  verifyPattern(cardId) {
    console.log("verifyPattern called with cardId:", cardId); // Agregar console.log
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
      console.log(`¡La tabla ${cardId} ha completado el patrón!`);
    }
  }

  selectPattern(pattern) {
    this.selectedPattern = pattern;
    console.log("Patrón seleccionado:", this.selectedPattern);
  }
}

const bingoController = new BingoController();

export { bingoController };
