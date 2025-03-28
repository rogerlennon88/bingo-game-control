// views/last-number-list/js/main.js

const socket = io()
const ballNumbers = document.querySelectorAll(".num-2, .num-3, .num-4, .num-5")

socket.on("lastBalls", (balls) => {
  if (Array.isArray(balls)) {
    // Limpiar la vista antes de actualizarla
    ballNumbers.forEach((ball) => (ball.textContent = ""))

    balls.forEach((ball, index) => {
      if (ballNumbers[index]) {
        ballNumbers[index].textContent = ball.toString().padStart(2, "0")
      }
    })
  } else {
    console.error("Error: balls no es un array válido.", balls)
    // Limpiar la vista en caso de error o array vacío
    ballNumbers.forEach((ball) => (ball.textContent = ""))
  }
})

// Inicializar la lista con valores vacíos
ballNumbers.forEach((ball) => (ball.textContent = ""))
