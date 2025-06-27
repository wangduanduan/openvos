import { EventEmitter } from 'node:events'

type EventsList = 'initRequest' | 'seqRequest' | 'badMsg' | 'error' | 'listening' | 'tcpClosed'

class EventList extends EventEmitter {
    constructor() {
        super()
    }
    on(event: EventsList, listener: (...args: any[]) => void): this {
        return this
    }
}

export const router = new EventList()
