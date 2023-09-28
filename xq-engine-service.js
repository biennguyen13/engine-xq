import express from "express"
import { createServer } from "node:http"
import { Server } from "socket.io"

import UCIProcessPooling from "./uciProcessPooling.js"

const app = express()
const server = createServer(app)
const io = new Server(server)

// Xử lý khi có kết nối mới
io.on("connection", (socket) => {
  console.log("Server2 connected Server1", socket.id, socket.client.id)

  socket.on("message", (msg) => {
    console.log("Server2 message to Server1", msg)
  })

  socket.on("analyze", (msg, requestSocketId) => {
    const uciProcess = uciProcessPooling.popReady()

    if (!uciProcess) {
      io.to(socket.id).emit("analyze", {
        msg: "Out of pooling",
        requestSocketId,
      })
    } else {
      const { moves = "", depth = 25 } = msg
      uciProcess.startAnalyze(moves, depth, io, socket, requestSocketId)
    }
  })

  // Xử lý khi client ngắt kết nối
  socket.on("disconnect", () => {
    console.log("Server2 disconnected")
  })
})

const uciProcessPooling = new UCIProcessPooling(2, 4)

const port = 3011

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
