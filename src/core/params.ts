import { set_logger_level } from './logger'

export interface Params {
    logLevel: string
    minMsgLen: number
    maxMsgLen: number
}

export const coreParams: Params = {
    logLevel: 'debug',
    minMsgLen: 16,
    maxMsgLen: 5060,
}

export function setCoreParams<T extends keyof Params>(k: T, v: Params[T]): void {
    // Object.assign(coreParams, cp)

    coreParams[k] = v


    switch (k) {
        case 'logLevel':
            set_logger_level(coreParams.logLevel)
            break
    }
}
