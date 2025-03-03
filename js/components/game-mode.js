/**
 * game-mode.js
 */

class GameMode {
    constructor(modeElementId = 'grid-game-mode') {
      this.modeElementId = modeElementId;
      this.initializeMode();
    }
  
    initializeMode() {
      const mode = document.getElementById(this.modeElementId);
      if (!mode) {
        console.error(`Element with id ${this.modeElementId} not found.`);
        return;
      }
  
      this.renderMode(mode);
    }
  
    renderMode(mode) {
      const letters = ['B', 'I', 'N', 'G', 'O'];
  
      for (let i = 0; i < 5; i++) {
        const group = document.createElement('div');
        group.classList.add('group');
  
        // Letter cell
        const letterCell = document.createElement('div');
        letterCell.classList.add('cell', 'letter');
        const letterButton = document.createElement('button');
        letterButton.id = `${letters[i].toLowerCase()}-ggm`;
        letterButton.classList.add('btn', 'btn-ggm');
        letterButton.textContent = letters[i];
        letterCell.appendChild(letterButton);
        group.appendChild(letterCell);
  
        // Number cells
        for (let j = 1; j <= 5; j++) {
          const numberCell = document.createElement('div');
          numberCell.classList.add('cell', 'num');
          const numberButton = document.createElement('button');
          numberButton.id = `${letters[i].toLowerCase()}${j}`;
          numberButton.classList.add('btn', 'btn-ggm');
          numberButton.textContent = `${letters[i].toLowerCase()}${j}`;
          numberCell.appendChild(numberButton);
          group.appendChild(numberCell);
        }
        mode.appendChild(group);
      }
    }
  }
  
  // Inicializar el modo de juego
  const gameMode = new GameMode();
  
  export { gameMode };