import { Msg } from '../src/core/message'
import { expect, test } from 'bun:test'
import { getTestBuf, fakerSocket } from './help'
import { getBodyLen } from '../src/core/parser'

test('msg-01', async () => {
    const buf = await getTestBuf('bad_uri.sip')
    const len = getBodyLen(buf)
    expect(len).toEqual(452)

    const so = fakerSocket()

    const msg = new Msg(buf, len, so)

    expect(msg.parseError).toEqual(false)
    expect(msg.status).toEqual(0)
    expect(msg.reason).toEqual('')
    expect(msg.bodyLen).toEqual(len)
    expect(msg.uri).toEqual('sip:jiri@bat.iptel.org')
    expect(msg.version).toEqual('SIP/2.0')
    expect(msg.isRequest).toEqual(true)
    expect(msg.callID).toEqual(
        'd10815e0-bf17-4afa-8412-d9130a793d96@213.20.128.35'
    )
})
