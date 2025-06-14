import { getHeaderName } from './headers'
const headerContentLength = Buffer.from('Content-Length')
const CRLF = '\r\n'
const CRLFBUF = Buffer.from('\r\n')
const bodyFlag = Buffer.from(CRLF + CRLF)

export function getBodyLen(msg: Buffer): number {
    if (msg.subarray(-2).toString() !== CRLF) return -1

    let start = msg.indexOf(headerContentLength)

    if (start === -1) return -2

    let end = msg.indexOf(CRLF, start + headerContentLength.length + 1)

    if (end === -1) return -3

    const len = parseInt(
        msg
            .subarray(start + headerContentLength.length + 1, end)
            .toString()
            .trim()
    )

    if (len === 0) {
        if (msg.indexOf(bodyFlag, end) === -1) return -1
        return 0
    }

    let bodyFlagIndex = msg.indexOf(bodyFlag, end)

    if (bodyFlagIndex === -1) return -4

    const realBodyLen = msg.length - bodyFlagIndex - 4

    // console.log(msg.length, len, bodyFlagIndex, realBodyLen)

    if (realBodyLen === len) {
        return len
    }

    return -100
}

interface baseMsg {
    firstLine: string
    headers: string
    body?: Buffer
}

export function baseParser(msg: Buffer, bodyLen: number): baseMsg | undefined {
    let start = msg.indexOf(CRLFBUF)
    if (start === -1) return

    let firstLine = msg.subarray(0, start + 2).toString()

    if (bodyLen === 0) {
        const headers = msg.subarray(start + 2, msg.length - 2).toString()
        return {
            firstLine,
            headers,
        }
    }

    const headers = msg
        .subarray(start + 2, start + msg.length - bodyLen - firstLine.length)
        .toString()

    const body = msg.subarray(msg.length - bodyLen)

    return {
        firstLine,
        headers,
        body,
    }
}

interface RawHeader {
    [key: string]: string[]
}

export function parseHeader(header: string): RawHeader | undefined {
    const hs = header.split(CRLF)

    if (hs.length === 0) return

    const headers: RawHeader = {}

    for (const h of hs) {
        let [key, value] = h.split(':')

        if (!key || !value) {
            continue
        }

        const newH = getHeaderName(key.trim())
        if (!headers[newH]) {
            headers[newH] = []
        }

        value = value.trim()
        let newValue = []

        if (value.includes(',')) {
            newValue = value.split(',').map((v) => v.trim())
            headers[newH]?.push(...newValue)
        } else {
            headers[newH]?.push(value)
        }
    }

    return headers
}

interface reqStartLine {
    method: string
    uri: string
    version: string
}

interface resStartLine {
    version: string
    status: number
    reason: string
}

export function parseStartLine(
    line: string
): reqStartLine | resStartLine | undefined {
    const end = line.indexOf(CRLF)

    if (end >= 0) {
        line = line.substring(0, end)
    }

    const [e1, e2, ...d3] = line.split(' ')

    if (e1 === undefined || e2 === undefined) {
        return
    }

    if (e1 === 'SIP/2.0') {
        if (e2.length !== 3) {
            return
        }

        const status = parseInt(e2)

        if (isNaN(status)) {
            return
        }

        if (status < 100 || status > 699) {
            return
        }

        return {
            version: e1,
            status: status,
            reason: d3.join(' '),
        }
    }

    return {
        method: e1,
        uri: e2,
        version: d3.join(' '),
    }
}
