// views/game-board-x/js/game-board.js

class GameBoard {
  constructor(boardElementId = "grid-game-board-x") {
    this.boardElementId = boardElementId;
    this.markedBalls = new Set();
  }

  init() {
    this.initializeBoard();
    this.setupSocketListeners();
  }

  initializeBoard() {
    const board = document.getElementById(this.boardElementId);
    if (!board) {
      console.error(`Element with id ${this.boardElementId} not found.`);
      return;
    }
    this.renderBoard(board);
  }

  renderBoard(board) {
    const letters = ["B", "I", "N", "G", "O"];
    let ballNumber = 1;
    for (let i = 0; i < 5; i++) {
      const group = document.createElement("div");
      group.classList.add("group");

      const letterCell = document.createElement("div");
      letterCell.classList.add("cell", "letter");
      const letterSpan = document.createElement("span");
      letterSpan.id = `${letters[i].toLowerCase()}-ggb`;
      letterSpan.classList.add("btn", "btn-ggb", "letter");
      letterSpan.textContent = letters[i];
      letterCell.appendChild(letterSpan);
      group.appendChild(letterCell);

      for (let j = 0; j < 15; j++) {
        const numberCell = document.createElement("div");
        numberCell.classList.add("cell", "num");
        const numberSpan = document.createElement("span");
        numberSpan.id = ballNumber.toString();
        numberSpan.classList.add("btn", "btn-ggb");
        numberSpan.textContent = ballNumber.toString();
        numberCell.appendChild(numberSpan);
        group.appendChild(numberCell);
        ballNumber++;
      }
      board.appendChild(group);
    }
  }

  setupSocketListeners() {
    const socket = io();
    socket.on("lastBall", (ballNumber) => {
      if (ballNumber) {
        this.markBall(ballNumber);
      }
    });
  }

  markBall(ballNumber) {
    if (!this.markedBalls.has(ballNumber)) {
      this.markedBalls.add(ballNumber);
      const cell = document.getElementById(ballNumber);
      if (cell) {
        cell.classList.add("marked");
      }
    }
  }
}

const gameBoard = new GameBoard();

export { gameBoard };