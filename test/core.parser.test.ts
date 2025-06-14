import { expect, test } from 'bun:test'
import {
    getBodyLen,
    baseParser,
    parseHeader,
    parseStartLine,
} from '../src/core/parser'

test('getBodyLen', () => {
    const mocks = [
        {
            input: 'GET / HTTP/1.1\r\nHost: example.com\r\n',
            expected: -2,
        },
        {
            input: 'a: 1\r\nContent-Length: 6\r\n\r\n1234\r\n',
            expected: 6,
        },
        {
            input: 'a: 1\r\nContent-Length: 4\r\n\r\n12345',
            expected: -1,
        },
        {
            input: 'a: 1\r\nContent-Length: 4\r\n\r\n1234',
            expected: -1,
        },
        {
            input: 'a: 1\r\nContent-Length: 5\r\n\r\n1234\r',
            expected: -1,
        },
        {
            input: 'a: 1\r\nContent-Length: 0\r\n\r\n',
            expected: 0,
        },
        {
            input: 'a: 1\r\nContent-Length: 0\r\nb:1\r\n\r\n',
            expected: 0,
        },
        {
            input: 'a: 1\r\nContent-Length: 1\r\nb:1\r\n\r\n',
            expected: -100,
        },
        {
            input: 'a: 1\r\nContent-Length: 3\r\nb:1\r\n\r\n1\r\n',
            expected: 3,
        },
    ]

    // expect(is_complete(Buffer.from(mocks[0]!.input))).toBe(mocks[0]!.expected)
    // expect(is_complete(Buffer.from(mocks[1]!.input))).toBe(mocks[1]!.expected)
    // expect(is_complete(Buffer.from(mocks[2]!.input))).toBe(mocks[2]!.expected)
    // expect(is_complete(Buffer.from(mocks[3]!.input))).toBe(mocks[3]!.expected)
    // expect(is_complete(Buffer.from(mocks[4]!.input))).toBe(mocks[4]!.expected)

    for (const { input, expected } of mocks) {
        // console.log(input)
        expect(getBodyLen(Buffer.from(input))).toBe(expected)
    }
})

test('baseParser', () => {
    const mocks = [
        {
            input: 'GET / HTTP/1.1\r\nHost: example.com\r\nContent-Length: 0\r\n\r\n',
            bodyLen: 0,
            expected: {
                firstLine: 'GET / HTTP/1.1\r\n',
                headers: 'Host: example.com\r\nContent-Length: 0\r\n',
            },
        },
        {
            input: 'GET / HTTP/1.1\r\nHost: example.com\r\nContent-Length: 5\r\n\r\nabc\r\n',
            bodyLen: 5,
            expected: {
                firstLine: 'GET / HTTP/1.1\r\n',
                headers: 'Host: example.com\r\nContent-Length: 5\r\n',
                body: Buffer.from('abc\r\n'),
            },
        },
    ]

    for (const { input, expected, bodyLen } of mocks) {
        expect(baseParser(Buffer.from(input), bodyLen)).toEqual(expected)
    }
})

test('parseHeader', () => {
    const mocks = [
        {
            input: 'a: 1\r\nb: 2\r\nContent-Length: 6\r\n',
            expected: {
                'Accept-Contact': ['1'],
                'Referred-By': ['2'],
                'Content-Length': ['6'],
            },
        },
        {
            input: 'a1: 1\r\na2: 2\r\na3: 6\r\na2: 21\r\na2: 22,23,24\r\n',
            expected: {
                a1: ['1'],
                a2: ['2', '21', '22', '23', '24'],
                a3: ['6'],
            },
        },
    ]

    for (const { input, expected } of mocks) {
        expect(parseHeader(input)).toEqual(expected as any)
    }
})

test('parseStartLine', () => {
    const mocks = [
        {
            input: 'INVITE sip:abc@a.com SIP/2.0\r\n',
            expected: {
                method: 'INVITE',
                uri: 'sip:abc@a.com',
                version: 'SIP/2.0',
            },
        },
    ]

    for (const { input, expected } of mocks) {
        expect(parseStartLine(input)).toEqual(expected as any)
    }
})
