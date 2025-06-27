import TinyQueue from 'tinyqueue'
import { randomUUIDv7 } from 'bun'

let timerID: NodeJS.Timeout | null = null

const state = {
    tick: 10, // ms
    maxRunTask: 1000,
}

interface task {
    expire: number
    cb: Function
    ticket: string
}

const ticketSet = new Set<string>()
const queue = new TinyQueue<task>([], function (a, b) {
    return a.expire - b.expire
})

export function addTimer(cb: Function, delayMs: number): string {
    if (timerID === null) {
        timerID = setInterval(checkTimer, state.tick)
    }

    const ticket = randomUUIDv7()
    ticketSet.add(ticket)
    queue.push({ expire: Date.now() + delayMs, cb, ticket })
    return ticket
}

export function removeTimer(ticket: string) {
    ticketSet.delete(ticket)
}

function checkTimer() {
    if (queue.length === 0 && timerID !== null) {
        clearInterval(timerID)
        timerID = null
        return
    }

    const now = Date.now()
    let i = 0
    while (queue.length > 0 && queue.peek()!.expire <= now) {
        const task = queue.pop()
        if (ticketSet.has(task!.ticket)) {
            task!.cb()
            i++
            if (i > state.maxRunTask) break
        }
    }
}

export function initTimer(tick: number | undefined, maxRunTask: number | undefined) {
    state.tick = tick ?? state.tick
    state.maxRunTask = maxRunTask ?? state.maxRunTask
}

// function main() {
//     initTimer(20, 500)

//     let t1 = addTimer(() => {
//         console.log('this is 1000 ms')
//     }, 1000)

//     let t2 = addTimer(() => {
//         console.log('this is 500 ms')
//         removeTimer(t1)
//     }, 500)

//     let t3 = addTimer(() => {
//         console.log('this is 5000 ms')
//     }, 5000)
// }

// main()
