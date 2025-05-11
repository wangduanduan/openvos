import { EventEmitter } from 'node:events'
import { type vSocket } from './state'

export function onRequest() {}

export class msg extends EventEmitter {
    is_request = true
    call_id = ''
    addr: vSocket
    readonly raw_buffer: Buffer
    constructor(buf: Buffer, info: vSocket) {
        super()
        this.raw_buffer = buf
        this.addr = info
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
