import { exec } from "child_process"

export default class UCIProcess {
  constructor(id, thread = 1, hash = 1) {
    this.thread = thread
    this.hash = hash
    this.stepCount = 1000
    this.timeout = 180000
    this.id = "--== Engine_" + id + " ==--"
    this.isEngineReady = false
    // this.analyze = []
    this.isWriting = false
    this.uciProcess = null
    this.io = null
    this.socket = null
    this.requestSocketId = null
    this.FEN = null

    this.start(this.thread, this.hash)
  }

  start(thread = 1, hash = 1) {
    this.uciProcess = exec("BugChessNN_20200919_release_AVX2.exe")

    this.uciProcess.stdin.write("uci\n")
    this.uciProcess.stdout.on("data", (data) => {
      console.log(`"${this.id}" -> ${data}`)

      if (data.includes("uciok")) {
        console.log(`"${this.id}" Engine ready`)
        this.isEngineReady = true
        this.uciProcess.stdin.write(`setoption name Threads value ${thread}\n`)
        this.uciProcess.stdin.write(`setoption name Hash value ${hash}\n`)
      }

      if (data.includes("bestmove")) {
        this.io?.to?.(this.socket?.id)?.emit("analyze", {
          // msg: `"${this.id}" ${data}`,
          msg: `${data}`,
          requestSocketId: this.requestSocketId,
          FEN: this.FEN,
        })
        // this.analyze.push(data)
        // this.uciProcess.stdin.write("stop\n")
        this.isWriting = false
      }
      if (this.isWriting) {
        this.io?.to?.(this.socket?.id)?.emit("analyze", {
          // msg: `"${this.id}" ${data}`,
          msg: `${data}`,
          requestSocketId: this.requestSocketId,
          FEN: this.FEN,
        })
        // this.analyze.push(data)
      }
    })

    this.uciProcess.on("exit", () => {
      console.log("Engine exited.")
    })
  }

  async startAnalyze(FEN = "", depth = 25, io, socket, requestSocketId) {
    if (!this.isEngineReady) return null

    this.io = io
    this.socket = socket
    this.requestSocketId = requestSocketId
    this.FEN = FEN

    // this.analyze = []
    this.isWriting = true
    this.isEngineReady = false

    // this.uciProcess.stdin.write(`position startpos moves ${moves}\n`)
    this.uciProcess.stdin.write(`position fen ${FEN}\n`)
    this.uciProcess.stdin.write(`go depth ${depth}\n`)

    const data = await new Promise((res) => {
      let count = 0
      const _ = setInterval(() => {
        count += this.stepCount
        console.log(`"${this.id}" Engine count: ${count}`)
        if (count >= this.timeout) {
          this.uciProcess.stdin.write("stop\n")
        }
        if (!this.isWriting) {
          // res(this.analyze)
          res([])
          clearInterval(_)
        }
      }, this.stepCount)
    })

    this.io = null
    this.socket = null
    this.requestSocketId = null
    this.FEN = null

    this.isEngineReady = true
    // this.analyze = []

    return data
  }

  kill() {
    this.uciProcess.kill()
    this.isEngineReady = false
  }

  stop() {
    this.uciProcess.stdin.write("stop\n")
    // this.isEngineReady = true
    console.log(
      "uci Process ========> cancelAnalyze ",
      this.id,
      this.requestSocketId
    )
  }
}
