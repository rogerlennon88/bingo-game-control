// server.js

const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

// Servir archivos estáticos desde el directorio raíz
app.use(express.static(path.join(__dirname, ".")));

// Ruta principal para servir index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});