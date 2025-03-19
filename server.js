// server.js

const express = require("express");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Servir archivos estáticos desde el directorio raíz
app.use(express.static(path.join(__dirname, ".")));

// Usar bodyParser.raw() para parsear el cuerpo de la solicitud como datos binarios
// Aumentar el límite del tamaño del cuerpo de la solicitud a 50MB (o el tamaño que necesites)
app.use(bodyParser.raw({ type: "text/csv", limit: "64mb" }));

// Ruta principal para servir index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Endpoint para guardar el archivo CSV
app.post("/save-csv", (req, res) => {
    console.log("req.body:", req.body);
    const csvData = req.body.toString("utf8"); // Convertir el Buffer a string
    const filePath = path.join(__dirname, "data", "bingo-cards.csv");

    fs.writeFile(filePath, csvData, (err) => {
        if (err) {
            console.error("Error al guardar el archivo CSV:", err);
            res.status(500).send("Error al guardar el archivo CSV.");
        } else {
            console.log("Archivo CSV guardado correctamente.");
            res.send("Archivo CSV guardado correctamente.");
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});