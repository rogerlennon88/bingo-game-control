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
    this.fileNameDisplay = document.getElementById("file-name");
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
    this.loaderElement.addEventListener(
      "dragover",
      this.handleDragOver.bind(this)
    );
    this.loaderElement.addEventListener("drop", this.handleDrop.bind(this));
  }

  handleLoadCards() {
    console.log("GameCardsLoader: handleLoadCards llamado.");
    console.log("GameCardsLoader: Botón 'Cargar datos' clickeado.");
    gameScore.init();
    this.loadCSVData(this.fileInput.files[0]); // Llamar a loadCSVData aquí
  }

  handleFileChange(event) {
    const file = event.target.files[0];
    this.displayFileName(file);
    this.toggleLoadButton(file);
  }

  handleDragOver(event) {
    event.preventDefault();
    this.loaderElement.classList.add("drag-over");
  }

  handleDrop(event) {
    event.preventDefault();
    this.loaderElement.classList.remove("drag-over");
    const file = event.dataTransfer.files[0];
    this.fileInput.files = event.dataTransfer.files;
    this.displayFileName(file);
    this.toggleLoadButton(file);
  }

  displayFileName(file) {
    if (file) {
      this.fileNameDisplay.textContent = `Archivo seleccionado: ${file.name}`;
    } else {
      this.fileNameDisplay.textContent = "";
    }
  }

  toggleLoadButton(file) {
    if (file && file.type === "text/csv") {
      this.loadButton.classList.remove("lock");
    } else {
      this.loadButton.classList.add("lock");
    }
  }

  loadCSVData(file) {
    if (!file) {
      console.error("No se ha seleccionado ningún archivo.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const csvData = event.target.result;
      this.saveCSVData(csvData);
    };

    reader.onerror = (error) => {
      console.error("Error al leer el archivo:", error);
    };

    reader.readAsText(file);
  }

  saveCSVData(csvData) {
    console.log("Datos CSV a enviar:", csvData);
    fetch("/save-csv", {
      method: "POST",
      headers: {
        "Content-Type": "text/csv",
      },
      body: csvData,
    })
      .then((response) => {
        if (response.ok) {
          console.log("Archivo CSV guardado correctamente.");
          bingoController.loadCards().then(() => {
            // Llamar a bingoController.loadCards() aquí
            gameFlow.nextPhase();
          });
        } else {
          console.error("Error al guardar el archivo CSV.");
        }
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud:", error);
      });
  }

  processCSVData(csvData) {
    // Aquí irá la lógica para procesar los datos del archivo CSV
    console.log("Datos CSV cargados:", csvData);
  }
}

const gameCardsLoader = new GameCardsLoader();

export { gameCardsLoader };
