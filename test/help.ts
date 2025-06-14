import { getBodyLen } from '../src/core/parser'

export async function getTestBuf(name: string) {
    const foo = Bun.file('test/data/' + name)

    const t = await foo.text()
    return Buffer.from(t)
}

export function fakerSocket() {
    return {
        remoteIP: 'string',
        remotePort: 8000,
        localIP: 'string',
        localPort: 8000,
        proto: 'tcp',
    }
}
