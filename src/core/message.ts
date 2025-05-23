import { EventEmitter } from 'node:events'
import { type vSocket } from './state'
import { baseParser } from './parser'
import { router } from './event_list'

export function onRequest() {}

export class msg extends EventEmitter {
    is_request = true
    call_id = ''
    addr: vSocket
    readonly raw_buffer: Buffer

    firstLine = ''
    headers: { [key: string]: string[] } = {}
    body: Buffer = Buffer.alloc(0)
    bodyLen = 0
    parseError = false

    constructor(buf: Buffer, bodyLen: number, info: vSocket) {
        super()
        this.raw_buffer = buf
        this.addr = info
        this.bodyLen = bodyLen

        this.baseParse()
    }
    baseParse() {
        const info = baseParser(this.raw_buffer, this.bodyLen)

        if (!info) {
            this.parseError = true
            router.emit('badMsg', this)
            return
        }

        this.firstLine = info.firstLine
        // this.headers = info.headers

        if (this.bodyLen > 0) {
            this.body = info.body!
        }
    }
    has_totag(): boolean {
        return true
    }
    is_method(method: string): boolean {
        return true
    }
    reply(status: number, reason: string) {}
    relay() {}
    drop() {}
}
