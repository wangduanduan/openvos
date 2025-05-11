const headerContentLength = Buffer.from('Content-Length')
const CRLF = '\r\n'
const CRLFBUF = Buffer.from('\r\n')
const bodyFlag = Buffer.from(CRLF + CRLF)

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

export function is_complete(msg: Buffer): boolean {
    if (msg.subarray(-2).toString() !== CRLF) return false

    let start = msg.indexOf(headerContentLength)

    if (start === -1) return false

    let end = msg.indexOf(CRLF, start + headerContentLength.length + 1)

    if (end === -1) return false

    const len = parseInt(
        msg
            .subarray(start + headerContentLength.length + 1, end)
            .toString()
            .trim()
    )

    if (len === 0) return true

    let bodyFlagIndex = msg.indexOf(bodyFlag, end)

    if (bodyFlagIndex === -1) return false

    const realBodyLen = msg.length - bodyFlagIndex - 4

    if (realBodyLen === len) {
        return true
    }

    return false
}
