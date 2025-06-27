export { logger } from './core/logger'
export { Msg } from './core/message'
export { router } from './core/event_list'
export { setCoreParams } from './core/params'

import { listenUDP } from './core/proto_udp'
import { getCoreParams } from './core/params'
import { parseSocket } from './core/utils'
import { logger } from './core/logger'

// export const xlog = get_logger('xlog')

export async function start() {
    logger.debug('Starting...')

    const sockets = getCoreParams('socket')

    for (const socket of sockets) {
        let so = parseSocket(socket)

        switch (so.protocol) {
            case 'udp':
                await listenUDP(so.port, so.host)
                break
        }
    }
}
