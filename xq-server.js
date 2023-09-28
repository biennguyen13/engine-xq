import express from "express"
import { createServer } from "node:http"
import { Server } from "socket.io"
import { io as ioClient } from "socket.io-client"

const app = express()
const server = createServer(app)
const io = new Server(server)

// Tạo socket client để kết nối với Server1
const socketClient = ioClient.connect("http://localhost:3001/", {
  reconnection: true,
})
socketClient.on("connect", function () {
  console.log("Server2 connected to Server1")

  socketClient.on("analyze", function ({ msg, requestSocketId }) {
    console.log("analyze message from the Server1:", msg)
    // socketClient.emit("analyze", "thanks server! for sending '" + data + "'")

    io.to(requestSocketId).emit("analyze", { msg })
  })
})

// Xử lý khi có kết nối mới
io.on("connection", (socket) => {
  console.log("Client connected Server2", socket.id, socket.client.id)

  // Xử lý khi nhận tin nhắn từ client
  socket.on("message", (msg) => {
    console.log("Client message to Server2", socket.id, socket.client.id)
    // Gửi tin nhắn đến Server1
    io.emit("message", msg)
  })

  socket.on("analyze", (msg) => {
    socketClient.emit("analyze", msg, socket.id)
  })

  // Xử lý khi client ngắt kết nối
  socket.on("disconnect", () => {
    console.log("Client disconnected")
  })
})

const port = 3000
server
  .listen(port, () => {
    console.log(`Máy chủ đang lắng nghe tại http://localhost:${port}`)
  })
  .on("close", () => {
    console.log("Server đã được đóng.")
  })
