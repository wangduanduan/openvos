import { setCoreParams, router, logger, type Msg, start } from '../src/main'

setCoreParams('logLevel', 'debug')
setCoreParams('socket', ['udp:127.0.0.1:5060', 'udp:127.0.0.1:5061'])

router.on('initRequest', (req: Msg) => {
    logger.info(
        '[request route] received msg from %s:%s',
        req.addr.remoteIP,
        req.addr.remotePort
    )
    req.reply(200, 'OK') // 响应
    return
})

router.on('seqRequest', (req: Msg) => {
    logger.info(
        '[request route] received msg from %s:%s',
        req.addr.remoteIP,
        req.addr.remotePort
    )
    req.reply(200, 'OK') // 响应
    return
})

router.on('badMsg', (req: Msg) => {
    logger.info(
        '[badMsg route] received msg from %s:%s',
        req.addr.remoteIP,
        req.addr.remotePort
    )
    req.reply(400, 'Bad Request')
    return
})

router.on('error', (err: Error) => {
    logger.error('[error route] %s', err.message)
})

router.on('listening', (proto, ip, port) => {
    logger.info('[%s] listening on %s:%d', proto, ip, port)
})

await start()
