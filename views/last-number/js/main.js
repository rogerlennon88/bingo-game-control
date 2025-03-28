// views/last-number/js/main.js

const socket = io();
const lastBallNumber = document.getElementById("last-ball-number");

socket.on("lastBall", (ballNumber) => {
  lastBallNumber.textContent = ballNumber.toString().padStart(2, "0");
  console.log("Recibiendo lastBall:", ballNumber); // Agregar este console.log
});