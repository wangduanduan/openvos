class TimeoutTracker {
  constructor() {
    this.packets = new Map()
    this.interval = null
    this.intervalMs = 100
    this.isChecking = false
    this.cbLimit = 500
  }

  add(packetId, timeoutMs, cb) {
    const expireAt = Date.now() + timeoutMs;
    this.packets.set(packetId, { expireAt, cb});
    
    if (!this.interval) {
      this.interval = setInterval(() => this.check(), this.intervalMs)
    }
  }

  remove(packetId) {
    this.packets.delete(packetId);
    if (this.packets.size === 0 && this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  check() {
    if (this.packets.size === 0 && this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      return
    }

      if (this.isChecking){
          return
      }

      this.isChecking = true

    const now = Date.now();

    let i = 0
    for (const [packetId, { expireAt, cb}] of this.packets.entries()) {
      if (now >= expireAt) {
        cb(packetId)
        this.remove(packetId)
        i++
        if (i > this.cbLimit)
            break
      }
    }

    this.isChecking = false
  }
}
