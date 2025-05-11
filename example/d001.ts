import {
    setCoreParams,
    vosEvent,
    listenUDP,
    logger,
    type msg,
} from '../src/main'

setCoreParams({
    logLevel: 'info',
})

vosEvent.on('request', (req: msg) => {
    logger.info(
        '[request route] received msg from %s:%s',
        req.addr.remoteIP,
        req.addr.remotePort
    )
    req.reply(200, 'OK') // 响应
    return
})

await listenUDP(5060)
