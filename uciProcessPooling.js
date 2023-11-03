import UCIProcess from "./uciProcess.js"

export default class UCIProcessPooling {
  constructor(min = 2, max = 4) {
    this.poolNumber = min
    this.maxpoolNumber = max
    this.pooling = new Array(this.poolNumber).fill(null).map((_, index) => {
      return new UCIProcess(index, 1, 512)
    })
  }

  popReady(requestSocketId) {
    const isSocketIdInProcess = this.pooling.some(
      ({ requestSocketId: socketid }) => socketid === requestSocketId
    )
    if (isSocketIdInProcess) {
      return null
    }

    return this.pooling.find(({ isEngineReady }) => isEngineReady) ?? null
  }

  killAll() {
    this.pooling.forEach((item) => item.kill())
  }

  stop(requestSocketId) {
    this.pooling
      .find((item) => item.requestSocketId === requestSocketId)
      ?.stop()
  }
}
