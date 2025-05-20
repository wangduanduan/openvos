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

export function is_complete(msg: Buffer): number {
    if (msg.subarray(-2).toString() !== CRLF) return -1

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
    headers: { [key: string]: string[] }
    body?: Buffer
}

export function base_parse(msg: Buffer): baseMsg | undefined {
    let start = msg.indexOf(CRLFBUF)
    if (start === -1) return

    let firstLine = msg.subarray(0, start).toString()
    let headers: { [key: string]: string[] } = {}

    start = start + 2

    while (true) {
        let end = msg.indexOf(CRLFBUF, start)
        if (end === -1) return

        if (end === start + 2) {
            // found body
            let body = msg.subarray(end + 2)
            return {
                firstLine,
                headers,
                body,
            }
        }

        if (end === msg.length - 2) {
            // no body
            return {
                firstLine,
                headers,
            }
        }

        // parse header
        let header = msg.subarray(start, end).toString()
        let headNameIndex = header.indexOf(':')
        if (headNameIndex === -1) return

        let name = header.substring(0, headNameIndex).trim()
        let value = header.slice(headNameIndex + 1).trim()

        if (!headers[name]) {
            headers[name] = []
        }
        headers[name].push(value)

        start = end + 2
        if (start >= msg.length) return
    }
}
