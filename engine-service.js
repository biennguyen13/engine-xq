import express from "express"
const app = express()
const port = 3000
import UCIProcessPooling from "./uciProcessPooling.js"

const uciProcessPooling = new UCIProcessPooling(2, 4)

app
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
