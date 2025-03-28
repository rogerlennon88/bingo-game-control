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

// Ruta principal para servir index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

// Ruta para servir la vista last-number
app.get("/last-number", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "last-number", "index.html"))
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

// Eventos de Socket.IO
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado")

  socket.on("lastBall", (ballNumber) => {
    io.emit("lastBall", ballNumber)
    console.log("Servidor retransmitiendo lastBall:", ballNumber)
  })

  socket.on("pageReloaded", () => {
    // Emitir un evento lastBall con valor nulo para limpiar la vista
    io.emit("lastBall", null)
    console.log("Página recargada, limpiando lastBall en las vistas.")
  })

  socket.on("disconnect", () => {
    console.log("Cliente desconectado")
  })
})

server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`)
})
