import { set_logger_level } from './logger'

export interface params {
    logLevel?: string
    minMsgLen?: number
    maxMsgLen?: number
}

export const coreParams: params = {
    logLevel: 'debug',
    minMsgLen: 16,
    maxMsgLen: 5060,
}

export function setCoreParams(cp: params) {
    Object.assign(coreParams, cp)

    for (const name in coreParams) {
        switch (name) {
            case 'logLevel':
                set_logger_level(coreParams[name]!)
                break
            default:
                continue
        }
    }
}
