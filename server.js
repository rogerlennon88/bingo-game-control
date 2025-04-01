// server.js

const express = require("express")
const path = require("path")
const fs = require("fs")
const bodyParser = require("body-parser")
const http = require("http")
const socketIo = require("socket.io")

const app = express()
const port = 3000

// Crear servidor HTTP y adjuntar Socket.IO
const server = http.createServer(app)
const io = socketIo(server)

// Servir archivos estáticos desde el directorio raíz
app.use(express.static(path.join(__dirname, ".")))

// Usar bodyParser.raw() para parsear el cuerpo de la solicitud como datos binarios
app.use(bodyParser.raw({ type: "text/csv", limit: "64mb" }))

// Rutas principales
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

app.get("/views/last-number", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "last-number", "index.html"))
})

app.get("/views/last-number-list", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "last-number-list", "index.html"))
})

app.get("/views/game-board-x", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "game-board-x", "index.html"))
})

// Endpoint para guardar el archivo CSV
app.post("/save-csv", (req, res) => {
  const csvData = req.body.toString("utf8")
  const filePath = path.join(__dirname, "data", "bingo-cards.csv")

  fs.writeFile(filePath, csvData, (err) => {
    if (err) {
      console.error("Error al guardar el archivo CSV:", err)
      res.status(500).send("Error al guardar el archivo CSV.")
    } else {
      console.log("Archivo CSV guardado correctamente.")
      res.send("Archivo CSV guardado correctamente.")
    }
  })
})

// Middleware para manejar rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).send("<h1>Página no encontrada</h1>")
})

// Eventos de Socket.IO
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado")

  socket.on("lastBall", (ballNumber) => {
    io.emit("lastBall", ballNumber)
    console.log("Servidor retransmitiendo lastBall:", ballNumber)
  })

  socket.on("lastBalls", (balls) => {
    io.emit("lastBalls", balls)
    console.log("Servidor retransmitiendo lastBalls:", balls)
  })

  socket.on("pageReloaded", () => {
    io.emit("lastBall", null)
    io.emit("lastBalls", [])
    io.emit("pageReloaded") // Emitir evento para game-board-x
    console.log("Página recargada, limpiando lastBall y lastBalls en las vistas.")
  })

  socket.on("disconnect", () => {
    console.log("Cliente desconectado")
  })
})

server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`)
})
