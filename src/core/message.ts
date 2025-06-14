import { EventEmitter } from 'node:events'
import { type vSocket } from './state'
import { baseParser, parseStartLine, parseHeader } from './parser'
import { router } from './event_list'

export function onRequest() {}

export class Msg extends EventEmitter {
    isRequest = true
    callID = ''
    addr: vSocket
    readonly raw_buffer: Buffer

    firstLine = ''
    version = ''
    method = ''
    uri = ''
    status = 0
    reason = ''

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
        const fl = parseStartLine(this.firstLine)

        if (!fl) {
            this.parseError = true
            router.emit('badMsg', this)
            return
        }

        if ('status' in fl) {
            this.isRequest = false
            this.version = fl.version
            this.status = fl.status
            this.reason = fl.reason
        } else {
            this.isRequest = true
            this.version = fl.version
            this.uri = fl.uri
            this.method = fl.method
        }

        if (this.bodyLen > 0) {
            this.body = info.body!
        }

        const hf = parseHeader(info.headers)
        if (!hf) {
            console.log('headers parse error')
            this.parseError = true
            router.emit('badMsg', this)
            return
        }

        if ('Call-ID' in hf && hf['Call-ID'].length === 1) {
            this.callID = hf['Call-ID'][0]!
        } else {
            this.parseError = true
            router.emit('badMsg', this)
            return
        }

        this.headers = hf
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
