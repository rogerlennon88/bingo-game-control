// views/last-number/js/main.js

const socket = io();
const lastBallNumber = document.getElementById("last-ball-number");

socket.on("lastBall", (ballNumber) => {
  if (ballNumber) {
    lastBallNumber.textContent = ballNumber.toString().padStart(2, "0");
  } else {
    lastBallNumber.textContent = "";
  }
  console.log("Recibiendo lastBall:", ballNumber);
});

// Mostrar la vista vacía al inicio
lastBallNumber.textContent = "";