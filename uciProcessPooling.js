import UCIProcess from "./uciProcess.js"

export default class UCIProcessPooling {
  constructor(min = 2, max = 4) {
    this.poolNumber = min
    this.maxpoolNumber = max
    this.pooling = new Array(this.poolNumber).fill(null).map((_, index) => {
      return new UCIProcess(index, 1, 512)
    })
  }

  popReady() {
    return this.pooling.find(({ isEngineReady }) => isEngineReady) ?? null
  }

  killAll() {
    this.pooling.forEach((item) => item.kill())
  }
}
