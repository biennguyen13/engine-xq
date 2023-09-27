const express = require("express")
const app = express()
const port = 3000 // Chọn một cổng bạn muốn sử dụng
const { exec } = require("child_process")
const fs = require("fs")

let isEngineReady = false
let analyze = []
let isWriting = false

const EngineInit = () => {
  const uciProcess = exec("BugChessNN_20200919_release_AVX2.exe")

  uciProcess.stdin.write("uci\n")

  uciProcess.stdout.on("data", (data) => {
    console.log(data)

    if (data.includes("uciok")) {
      isEngineReady = true
      uciProcess.stdin.write("setoption name Hash value 1\n")
    }

    if (data.includes("bestmove")) {
      analyze.push(data)
      uciProcess.stdin.write("stop\n")
      isWriting = false
    }
    if (isWriting) {
      analyze.push(data)
    }
  })

  uciProcess.on("exit", () => {
    console.log("Engine exited.")
  })

  return uciProcess
}

const uciProcess = EngineInit()

app
  .listen(port, () => {
    console.log(`Máy chủ đang lắng nghe tại http://localhost:${port}`)
  })
  .on("close", () => {
    console.log("Server đã được đóng.")
    uciProcess.kill()
  })

app.get("/engine", async (req, res) => {
  const moves = req.query.moves ?? ""
  const depth = req.query.depth ?? 25

  if (!isEngineReady) {
    return res.send({ message: "No ready" })
  }

  analyze = []
  isWriting = true

  isEngineReady = false
  uciProcess.stdin.write(`position startpos moves ${moves}\n`)
  uciProcess.stdin.write(`go depth ${depth}\n`)
  const data = await new Promise((res) => {
    let count = 0
    const _ = setInterval(() => {
      count += 100
      console.log("%cengine-service.js line:64 count", "color: #007acc;", count)
      if (count > 30000) {
        uciProcess.stdin.write("stop\n")
      }
      if (!isWriting) {
        res(analyze)
        clearInterval(_)
      }
    }, 100)
  })
  isEngineReady = true

  return res.send({ message: `Depth: ${depth}, moves: ${moves}`, data })
})
