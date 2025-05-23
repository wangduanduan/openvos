type TimerCb = (packetId: string) => void

export class Timer {
    packets: Map<string, { expireAt: number; cb: TimerCb }>
    interval: NodeJS.Timeout
    intervalMs: number
    isChecking: boolean
    cbLimit: number

    constructor() {
        this.packets = new Map()
        this.interval = null!
        this.intervalMs = 100
        this.isChecking = false
        this.cbLimit = 500
    }

    add(packetId: string, timeoutMs: number, cb: TimerCb) {
        const expireAt = Date.now() + timeoutMs
        this.packets.set(packetId, { expireAt, cb })

        if (!this.interval) {
            this.interval = setInterval(() => this.check(), this.intervalMs)
        }
    }

    remove(packetId: string) {
        this.packets.delete(packetId)
        this.checkPacketSizeAndRemoveTimeout()
    }

    checkPacketSizeAndRemoveTimeout(): boolean {
        if (this.packets.size === 0 && this.interval) {
            clearInterval(this.interval)
            this.interval = null!
            return true
        }
        return false
    }

    check() {
        if (this.checkPacketSizeAndRemoveTimeout()) {
            return
        }

        if (this.isChecking) {
            return
        }

        this.isChecking = true

        const now = Date.now()

        let i = 0
        for (const [packetId, { expireAt, cb }] of this.packets.entries()) {
            if (now >= expireAt) {
                cb(packetId)
                this.remove(packetId)
                i++
                if (i > this.cbLimit) break
            }
        }

        this.isChecking = false
    }
}
