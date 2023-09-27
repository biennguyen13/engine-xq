const { exec } = require("child_process")

class EngineProcess {
  id: string
  isEngineReady: boolean
  analyze: never[]
  isWriting: boolean
  uciProcess: null
  stepCount: number
  constructor(thread = 1, hash = 1) {
    this.stepCount = 100
    this.id = Math.random().toString(36)
    this.isEngineReady = false
    this.analyze = []
    this.isWriting = false
    this.uciProcess = exec("BugChessNN_20200919_release_AVX2.exe")

    this.start(thread, hash)
  }

  start(thread = 1, hash = 1) {
    this.uciProcess.stdin.write("uci\n")
    this.uciProcess.stdout.on("data", (data) => {
      console.log(data)

      if (data.includes("uciok")) {
        this.isEngineReady = true
        this.uciProcess.stdin.write(`setoption name Threads value ${thread}\n`)
        this.uciProcess.stdin.write(`setoption name Hash value ${hash}\n`)
      }

      if (data.includes("bestmove")) {
        this.analyze.push(data)
        this.uciProcess.stdin.write("stop\n")
        this.isWriting = false
      }
      if (this.isWriting) {
        this.analyze.push(data)
      }
    })

    this.uciProcess.on("exit", () => {
      console.log("Engine exited.")
    })
  }

  async startAnalyze(moves = "", depth = 25) {
    this.analyze = []
    this.isWriting = true

    this.isEngineReady = false
    this.uciProcess.stdin.write(`position startpos moves ${moves}\n`)
    this.uciProcess.stdin.write(`go depth ${depth}\n`)

    const data = await new Promise((res) => {
      let count = 0
      const _ = setInterval(() => {
        count += this.stepCount
        console.log("engine.js line:57 count", count)
        if (count > 30000) {
          this.uciProcess.stdin.write("stop\n")
        }
        if (!this.isWriting) {
          res(this.analyze)
          clearInterval(_)
        }
      }, this.stepCount)
    })
    this.isEngineReady = true

    return data
  }
}
