import { expect, test } from 'bun:test'
import { is_complete, getHeaderValue } from './parser'

test('getHeaderValue', () => {
    const mocks = [
        {
            input: 'GET / HTTP/1.1\r\nHost: example.com\r\n',
            header: 'Host',
            expected: 'example.com',
        },
        {
            input: 'GET / HTTP/1.1\r\nHost: example.com\r\n',
            header: 'Host',
            expected: 'example.com',
        },
    ]

    for (const { input, header, expected } of mocks) {
        expect(getHeaderValue(input, header)).toBe(expected)
    }
})

test('is_complete', () => {
    const mocks = [
        {
            input: 'GET / HTTP/1.1\r\nHost: example.com\r\n',
            expected: false,
        },
        {
            input: 'a: 1\r\nContent-Length: 6\r\n\r\n1234\r\n',
            expected: true,
        },
        {
            input: 'a: 1\r\nContent-Length: 4\r\n\r\n12345',
            expected: false,
        },
        {
            input: 'a: 1\r\nContent-Length: 4\r\n\r\n1234',
            expected: false,
        },
        {
            input: 'a: 1\r\nContent-Length: 5\r\n\r\n1234\r',
            expected: false,
        },
        {
            input: 'a: 1\r\nContent-Length: 0\r\n\r\n',
            expected: true,
        },
        {
            input: 'a: 1\r\nContent-Length: 0\r\nb:1\r\n\r\n',
            expected: true,
        },
        {
            input: 'a: 1\r\nContent-Length: 1\r\nb:1\r\n\r\n',
            expected: false,
        },
        {
            input: 'a: 1\r\nContent-Length: 3\r\nb:1\r\n\r\n1\r\n',
            expected: true,
        },
    ]

    // expect(is_complete(Buffer.from(mocks[0]!.input))).toBe(mocks[0]!.expected)
    // expect(is_complete(Buffer.from(mocks[1]!.input))).toBe(mocks[1]!.expected)
    // expect(is_complete(Buffer.from(mocks[2]!.input))).toBe(mocks[2]!.expected)
    // expect(is_complete(Buffer.from(mocks[3]!.input))).toBe(mocks[3]!.expected)
    // expect(is_complete(Buffer.from(mocks[4]!.input))).toBe(mocks[4]!.expected)

    for (const { input, expected } of mocks) {
        console.log(input)
        expect(is_complete(Buffer.from(input))).toBe(expected)
    }
})
