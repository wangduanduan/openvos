import { type udp } from 'bun'

import { router } from './state'
import { logger } from './logger'
import { getBodyLen } from './parser'
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
        logger.warn('%s msg too big <<< %d, drop it', remote_id, buf.length)
        return
    }

    if (sc.has(remote_id)) {
        const newBuf = Buffer.concat([sc.get(remote_id)!, buf])
        const bodyLen = getBodyLen(newBuf)

        if (newBuf.length > getCoreParams('maxMsgLen')) {
            logger.warn(
                '%s cache buf too big <<< %d, drop it',
                remote_id,
                newBuf.length
            )
            sc.delete(remote_id)
            return
        }

        if (bodyLen >= 0) {
            sc.delete(remote_id)
            logger.debug('%s <<< %s', remote_id, newBuf.toString('utf8'))

            const m = new msg(newBuf, bodyLen, {
                proto: 'udp',
                remoteIP: ip,
                remotePort: port,
                localIP: socket.address.address,
                localPort: socket.address.port,
            })

            // TODO: 基础解包

            router.emit('request', m)
            return
        }

        sc.set(remote_id, newBuf)
        return
    }

    // no cache buf, check if complete
    const bodyLen = getBodyLen(buf)
    if (bodyLen >= 0) {
        logger.debug('%s <<< %s', remote_id, buf.toString('utf8'))

        const m = new msg(buf, bodyLen, {
            proto: 'udp',
            remoteIP: ip,
            remotePort: port,
            localIP: socket.address.address,
            localPort: socket.address.port,
        })

        // TODO: 基础解包

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
