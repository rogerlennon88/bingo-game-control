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
    const file = this.fileInput.files[0];
    if (!file) {
      console.error("No se ha seleccionado ningún archivo.");
      return;
    }
    this.confirmAndLoad(file);
  }

  confirmAndLoad(file) {
    this.countRecords(file)
      .then((recordCount) => {
        if (
          confirm(`Se van a importar ${recordCount} registros. ¿Continuar?`)
        ) {
          this.validateAndLoad(file);
        }
      })
      .catch((error) => {
        console.error("Error al contar registros:", error);
        alert("Error al contar registros. Intente de nuevo.");
      });
  }

  countRecords(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvData = event.target.result;
        const recordCount = csvData.split("\n").length - 1; // Excluir encabezado
        resolve(recordCount);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsText(file);
    });
  }

  validateAndLoad(file) {
    this.showLoading();
    this.readCSV(file)
      .then((csvData) => {
        if (!this.isValidCSV(csvData)) {
          throw new Error("Formato CSV inválido.");
        }
        this.saveCSVData(csvData);
      })
      .catch((error) => {
        console.error("Error al validar y cargar:", error);
        alert(error.message);
        this.hideLoading();
      });
  }

  readCSV(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsText(file);
    });
  }

  isValidCSV(csvData) {
    // Normalizar saltos de línea
    csvData = csvData.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    const lines = csvData.split("\n");
    // Eliminar líneas vacías
    const filteredLines = lines.filter((line) => line.trim() !== "");
    if (filteredLines.length <= 1) {
      return false;
    }
    const headers = filteredLines[0].split(",");
    if (headers.length !== 27) {
      return false;
    }
    const expectedHeaders = [
      "serial",
      "id",
      "b1",
      "b2",
      "b3",
      "b4",
      "b5",
      "i1",
      "i2",
      "i3",
      "i4",
      "i5",
      "n1",
      "n2",
      "n3",
      "n4",
      "n5",
      "g1",
      "g2",
      "g3",
      "g4",
      "g5",
      "o1",
      "o2",
      "o3",
      "o4",
      "o5",
    ];
    if (
      !headers.every(
        (header, index) => header.trim() === expectedHeaders[index]
      )
    ) {
      return false;
    }
    for (let i = 1; i < filteredLines.length; i++) {
      const values = filteredLines[i].split(",");
      if (values.length !== 27) {
        return false;
      }
      for (let j = 2; j < values.length; j++) {
        if (isNaN(values[j].trim())) {
          return false;
        }
      }
    }
    return true;
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
            gameFlow.nextPhase();
          });
        } else {
          console.error("Error al guardar el archivo CSV.");
        }
        // Mover la llamada a showSuccess() dentro de DOMContentLoaded
        document.addEventListener("DOMContentLoaded", () => {
          this.showSuccess();
        });
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud:", error);
        // Mover la llamada a showError() dentro de DOMContentLoaded
        document.addEventListener("DOMContentLoaded", () => {
          this.showError();
        });
      });
  }

  showLoading() {
    document.getElementById("loading-overlay").style.display = "flex";
  }

  hideLoading() {
    document.getElementById("loading-overlay").style.display = "none";
  }

  showSuccess() {
    const successMessage = document.getElementById("success-message");
    if (successMessage) {
      successMessage.textContent = "Archivo CSV cargado correctamente.";
      successMessage.style.display = "block";
      document.getElementById("drop-area").style.display = "none";
      this.hideLoading();
    } else {
      console.error("Elemento 'success-message' no encontrado.");
    }
  }

  showError() {
    const errorMessage = document.getElementById("error-message");
    if (errorMessage) {
      errorMessage.textContent =
        "Error al cargar el archivo CSV. Intente de nuevo.";
      errorMessage.style.display = "block";
      document.getElementById("drop-area").style.display = "block";
      this.hideLoading();
    } else {
      console.error("Elemento 'error-message' no encontrado.");
    }
  }

  processCSVData(csvData) {
    // Aquí irá la lógica para procesar los datos del archivo CSV
    console.log("Datos CSV cargados:", csvData);
  }
}

const gameCardsLoader = new GameCardsLoader();

export { gameCardsLoader };
