import { EventEmitter } from 'node:events'
import { type udp } from 'bun'

export interface vSocket {
    remoteIP: string
    remotePort: number
    localIP: string
    localPort: number
    proto: string
}

export const router = new EventEmitter()
export const udpServer: udp.Socket<'buffer'>[] = []
export const socketBufferCacheMap = new Map<string, Buffer>()
