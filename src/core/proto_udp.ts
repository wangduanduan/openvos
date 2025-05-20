import { type udp } from 'bun'

import { router } from './state'
import { logger } from './logger'
import { is_complete } from './parser'
import { msg } from './message'
import { getCoreParams } from './params'

// const logger = get_logger('proto_udp')
const sc = new Map<string, Buffer>()

function onData(
    socket: udp.Socket<'buffer'>,
    buf: Buffer,
    port: number,
    ip: string
) {
    const remote_id = `udp:${ip}:${port}`
    const content = buf.toString()

    logger.info(`%s receive >>> %s`, remote_id, content)

    if (buf.length < getCoreParams('minMsgLen')) {
        logger.warn('%s msg too small <<< %d', remote_id, buf.length)
        return
    }

    if (buf.length > getCoreParams('maxMsgLen')) {
        logger.warn('%s msg too big <<< %d', remote_id, buf.length)
        return
    }

    if (sc.has(remote_id)) {
        const newBuf = Buffer.concat([sc.get(remote_id)!, buf])

        if (is_complete(newBuf)) {
            sc.delete(remote_id)
            logger.debug('%s <<< %s', remote_id, newBuf.toString('utf8'))

            const m = new msg(newBuf, {
                proto: 'udp',
                remoteIP: ip,
                remotePort: port,
                localIP: socket.address.address,
                localPort: socket.address.port,
            })

            router.emit('request', m)
            return
        }

        sc.set(remote_id, newBuf)
        return
    }

    if (is_complete(buf)) {
        logger.debug('%s <<< %s', remote_id, buf.toString('utf8'))

        const m = new msg(buf, {
            proto: 'udp',
            remoteIP: ip,
            remotePort: port,
            localIP: socket.address.address,
            localPort: socket.address.port,
        })

        router.emit('request', m)
        return
    }

    sc.set(remote_id, buf)
    return
}

export async function listenUDP(port: number, ip: string = '127.0.0.1') {
    const server = await Bun.udpSocket({
        port,
        hostname: ip,
        socket: {
            data: onData,
        },
    })
    logger.debug('listening on %s:%s:%s success', 'udp', ip, port)
    router.emit('listening', 'udp', ip, port)
}
