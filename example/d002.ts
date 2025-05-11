import { setCoreParams, vosEvent, listenUDP, xlog, type msg } from '../src/main'

import { init_sipmsgops } from '../src/sipmsgops'
import { loose_route } from '../src/rr'

setCoreParams({
    logLevel: 'debug',
})

await init_sipmsgops({
    fr_timeout: 5,
    fr_inv_timeout: 30,
    restart_fr_on_each_reply: 0,
    onreply_avp_mode: 1,
})

vosEvent.on('request', (req: msg) => {
    if (req.is_method('OPTIONS')) {
        req.reply(200, 'OK') // 响应
        return
    }

    if (req.has_totag()) {
        if (req.is_method('ACK')) {
            req.relay() // 转发
            return
        }

        if (!loose_route(req)) {
            req.drop() // 丢弃
            return
        }

        req.on('response', (res: msg) => {})
        req.on('error', (res: msg) => {})
        return
    }
})

await listenUDP(5060)
await listenUDP(5070)
await listenUDP(5080)
