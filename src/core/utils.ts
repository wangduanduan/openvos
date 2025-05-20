const supportedProtocols = ['udp']

export function parseSocket(socket: string) {
    let meta = socket.split(':')

    if (meta.length !== 3) {
        throw new Error(
            'Invalid socket format ' +
                socket +
                '. Expected format: <proto>:<host>:<port>'
        )
    }

    let port = parseInt(meta[2]!)

    if (isNaN(port)) {
        throw new Error('Invalid port ' + meta[2])
    }

    if (port < 0 || port > 65535) {
        throw new Error('Invalid port ' + meta[2])
    }

    if (supportedProtocols.indexOf(meta[0]!) === -1) {
        throw new Error('unsupported protocol ' + meta[0])
    }

    return {
        protocol: meta[0]!,
        host: meta[1]!,
        port,
    }
}
