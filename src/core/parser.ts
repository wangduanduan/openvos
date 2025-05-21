const headerContentLength = Buffer.from('Content-Length')
const CRLF = '\r\n'
const CRLFBUF = Buffer.from('\r\n')
const bodyFlag = Buffer.from(CRLF + CRLF)

export function getHeaderRange(
    buf: Buffer | string,
    header: string,
    offset = 0
): [number, number] {
    let start = buf.indexOf(header, offset)
    if (start === -1) return [-1, -1]

    let end = buf.indexOf(CRLF, start + header.length + 1)
    if (end === -1) return [-1, -1]

    return [start, end + CRLF.length]
}

export function getHeaderValue(
    msg: string,
    header: string,
    offset = 0
): string {
    let start = msg.indexOf(header, offset)
    if (start === -1) return ''

    start += header.length + 1
    let end = msg.indexOf(CRLF, start)
    if (end === -1) return ''

    return msg.slice(start, end).trim()
}

export function getBodyLen(msg: Buffer): number {
    if (msg.subarray(-2).toString() !== CRLF) return -2

    let start = msg.indexOf(headerContentLength)

    if (start === -1) return -1

    let end = msg.indexOf(CRLF, start + headerContentLength.length + 1)

    if (end === -1) return -1

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

    if (bodyFlagIndex === -1) return -1

    const realBodyLen = msg.length - bodyFlagIndex - 4

    if (realBodyLen === len) {
        return len
    }

    return -1
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
            headers
        }
    }

    const headers = msg.subarray(start + 2, start + 2 + msg.length - bodyLen - firstLine.length - 2).toString()

    const body = msg.subarray(msg.length - bodyLen)

    return {
        firstLine,
        headers,
        body
    }
}