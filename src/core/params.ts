import { set_logger_level } from './logger'

export interface Params {
    logLevel: string
    minMsgLen: number
    maxMsgLen: number
    alias: string[]
    serverHeader: string
    socket: string[]
    tcpMaxConnections: number
    userAgentHeader: string
}

const coreParams: Params = {
    logLevel: 'debug',
    minMsgLen: 16,
    maxMsgLen: 4096,
    alias: ['127.0.0.1', 'localhost'],
    serverHeader: 'Server: OpenVOS',
    socket: ['udp:127.0.0.1:5060', 'udp:localhost:5060'],
    tcpMaxConnections: 2048,
    userAgentHeader: 'User-Agent: OpenVOS',
}

export function getCoreParams<T extends keyof Params>(k: T): Params[T] {
    return coreParams[k]
}

export function setCoreParams<T extends keyof Params>(
    k: T,
    v: Params[T]
): void {
    // Object.assign(coreParams, cp)

    coreParams[k] = v

    switch (k) {
        case 'logLevel':
            set_logger_level(coreParams.logLevel)
            break
        default:
            break
    }
}
