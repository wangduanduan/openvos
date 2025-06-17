import { Msg } from '../src/core/message'
import { expect, test } from 'bun:test'
import { getTestBuf, fakerSocket } from './help'
import { getBodyLen } from '../src/core/parser'

test('bad_uri.sip', async () => {
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

test('bad_via1.sip', async () => {
    const buf = await getTestBuf('bad_via1.sip')
    const len = getBodyLen(buf)
    expect(len < 0).toEqual(true)

    const so = fakerSocket()

    const msg = new Msg(buf, len, so)

    expect(msg.parseError).toEqual(true)
})

test('bad_via2.sip', async () => {
    const buf = await getTestBuf('bad_via2.sip')
    const len = getBodyLen(buf)
    expect(len < 0).toEqual(true)

    const so = fakerSocket()

    const msg = new Msg(buf, len, so)

    expect(msg.parseError).toEqual(true)
})

test('bad_via3.sip', async () => {
    const buf = await getTestBuf('bad_via3.sip')
    const len = getBodyLen(buf)
    expect(len < 0).toEqual(true)

    const so = fakerSocket()

    const msg = new Msg(buf, len, so)

    expect(msg.parseError).toEqual(true)
})

test('bc2.sip', async () => {
    const buf = await getTestBuf('bc2.sip')
    const len = getBodyLen(buf)
    expect(len).toEqual(0)

    const so = fakerSocket()

    const msg = new Msg(buf, len, so)

    expect(msg.parseError).toEqual(false)
    expect(msg.callID).toEqual(
        'axxxxxef5cec10dd5f4dca871b764cb83ee73c@192.168.1.100'
    )
})

test('bye_chris.sip', async () => {
    const buf = await getTestBuf('bye_chris.sip')
    const len = getBodyLen(buf)
    expect(len).toEqual(0)

    const so = fakerSocket()

    const msg = new Msg(buf, len, so)

    expect(msg.parseError).toEqual(false)
})

test('bye00.sip', async () => {
    const buf = await getTestBuf('bye00.sip')
    const len = getBodyLen(buf)
    expect(len).toEqual(0)

    const so = fakerSocket()

    const msg = new Msg(buf, len, so)

    expect(msg.parseError).toEqual(false)
})

test('inv_srv.sip', async () => {
    const buf = await getTestBuf('inv_srv.sip')
    const len = getBodyLen(buf)
    // 0x0D0A0D0A0D0A
    expect(len).toEqual(-100)

    const so = fakerSocket()

    const msg = new Msg(buf, len, so)

    expect(msg.parseError).toEqual(true)
})
