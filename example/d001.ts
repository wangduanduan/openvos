import { setCoreParams, router, logger, type msg, start } from '../src/main'

setCoreParams('logLevel', 'debug')
setCoreParams('socket', ['udp:127.0.0.1:5060', 'udp:127.0.0.1:5061'])

router.on('request', (req: msg) => {
    logger.info(
        '[request route] received msg from %s:%s',
        req.addr.remoteIP,
        req.addr.remotePort
    )
    req.reply(200, 'OK') // 响应
    return
})

router.on('listening', (proto, ip, port) => {
    logger.info('[%s] listening on %s:%d', proto, ip, port)
})

await start()
