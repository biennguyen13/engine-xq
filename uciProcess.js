import { exec } from "child_process"

export default class UCIProcess {
  constructor(id, thread = 1, hash = 1) {
    this.stepCount = 100
    this.id = id
    this.isEngineReady = false
    this.analyze = []
    this.isWriting = false
    this.uciProcess = exec("BugChessNN_20200919_release_AVX2.exe")

    this.start(thread, hash)
  }

  start(thread = 1, hash = 1) {
    this.uciProcess.stdin.write("uci\n")
    this.uciProcess.stdout.on("data", (data) => {
      console.log(`Engine "${this.id}" output: ${data}`)

      if (data.includes("uciok")) {
        console.log("Engine ready: " + this.id)
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
        console.log(`Engine "${this.id}" count: ${count}`)
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

  kill() {
    this.uciProcess.kill()
  }
}
