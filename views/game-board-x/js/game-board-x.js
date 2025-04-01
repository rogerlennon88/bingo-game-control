// views/game-board-x/js/game-board-x.js

class GameBoardX {
  constructor(boardElementId = "grid-game-board-x") {
    this.boardElementId = boardElementId
    this.markedBalls = new Set()
  }

  init() {
    console.log("GameBoardX init() llamada")
    this.initializeBoard()
    this.setupSocketListeners()
  }

  initializeBoard() {
    console.log("GameBoardX initializeBoard() llamada")
    const board = document.getElementById(this.boardElementId)
    if (!board) {
      console.error(`Element with id ${this.boardElementId} not found.`)
      return
    }
    this.renderBoard(board)
  }

  renderBoard(board) {
    console.log("GameBoardX renderBoard() llamada")
    const letters = ["B", "I", "N", "G", "O"]
    let ballNumber = 1
    for (let i = 0; i < 5; i++) {
      const group = document.createElement("div")
      group.classList.add("group")

      const letterCell = document.createElement("div")
      letterCell.classList.add("cell", "letter")
      const letterSpan = document.createElement("span")
      letterSpan.id = `${letters[i].toLowerCase()}-ggb`
      letterSpan.classList.add("btn", "btn-ggb", "letter")
      letterSpan.textContent = letters[i]
      letterCell.appendChild(letterSpan)
      group.appendChild(letterCell)

      for (let j = 0; j < 15; j++) {
        const numberCell = document.createElement("div")
        numberCell.classList.add("cell", "num")
        const numberSpan = document.createElement("span")
        numberSpan.id = ballNumber.toString()
        numberSpan.classList.add("btn", "btn-ggb")
        numberSpan.textContent = ballNumber.toString()
        numberCell.appendChild(numberSpan)
        group.appendChild(numberCell)
        ballNumber++
      }
      board.appendChild(group)
    }
  }

  setupSocketListeners() {
    console.log("GameBoardX setupSocketListeners() llamada")
    const socket = io()
    socket.on("lastBall", (ballNumber) => {
      console.log("Evento lastBall recibido en game-board-x:", ballNumber)
      if (ballNumber) {
        this.markBall(ballNumber)
      } else {
        // Reiniciar el tablero cuando ballNumber es 0
        this.reset()
      }
    })

    // Escuchar el evento de reinicio del juego en el objeto window
    window.addEventListener("gameReset", () => {
      // Escuchar evento en el objeto window
      console.log("Evento gameReset recibido en game-board-x")
      this.reset()
    })

    // Escuchar el evento de recarga de página
    socket.on("pageReloaded", () => {
      console.log("Evento pageReloaded recibido en game-board-x")
      this.reset()
    })
  }

  reset() {
    console.log("Función reset() llamada en game-board-x")
    this.markedBalls.clear()
    const markedCells = document.querySelectorAll("#grid-game-board-x .btn-ggb.marked")
    markedCells.forEach((cell) => {
      cell.classList.remove("marked")
    })
    this.updateView()
  }

  updateView() {
    console.log("Función updateView() llamada en game-board-x")
    const cells = document.querySelectorAll("#grid-game-board-x .btn-ggb")
    cells.forEach((cell) => {
      cell.classList.remove("marked")
    })
  }

  markBall(ballNumber) {
    console.log("Función markBall() llamada en game-board-x:", ballNumber)
    if (!this.markedBalls.has(ballNumber)) {
      this.markedBalls.add(ballNumber)
      const cell = document.getElementById(ballNumber)
      if (cell) {
        cell.classList.add("marked")
      }
    }
  }
}

const gameBoardX = new GameBoardX()

export { gameBoardX }
