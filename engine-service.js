import express from "express"
import { createServer } from "node:http"
import { Server } from "socket.io"

import UCIProcessPooling from "./uciProcessPooling.js"

const app = express()
const server = createServer(app)
const io = new Server(server)

// Xử lý khi có kết nối mới
io.on("connection", (socket) => {
  console.log("Client connected")

  // Xử lý khi nhận tin nhắn từ client
  socket.on("message", (msg) => {
    console.log(`Received message: `, msg)
    // Gửi tin nhắn cho tất cả client
    io.emit("message", msg)
  })

  socket.on("analyze", (msg) => {
    const uciProcess = uciProcessPooling.popReady()

    if (!uciProcess) {
      io.emit("analyze", "Out of pooling")
    } else {
      const { moves = "", depth = 25 } = msg
      uciProcess.startAnalyze(moves, depth, io)
    }
  })

  // Xử lý khi client ngắt kết nối
  socket.on("disconnect", () => {
    console.log("Client disconnected")
  })
})

const uciProcessPooling = new UCIProcessPooling(2, 4)

const port = 3000

server
  .listen(port, () => {
    console.log(`Máy chủ đang lắng nghe tại http://localhost:${port}`)
  })
  .on("close", () => {
    console.log("Server đã được đóng.")
    uciProcessPooling.killAll()
  })

app.get("/engine", async (req, res) => {
  const moves = req.query.moves ?? ""
  const depth = req.query.depth ?? 25

  const uciProcess = uciProcessPooling.popReady()

  if (!uciProcess) {
    return res.send({ message: "Out of pooling" })
  }

  return res.send({
    message: `Depth: ${depth}, moves: ${moves}`,
    data: await uciProcess.startAnalyze(moves, depth),
  })
})
