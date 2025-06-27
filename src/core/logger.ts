import pino from 'pino'
import { configure, getConsoleSink, getLogger } from '@logtape/logtape'

// export const logger = pino({
//     timestamp: pino.stdTimeFunctions.isoTime,
//     base: undefined,
//     formatters: {
//         level(label) {
//             return { level: label }
//         },
//     },
// })

// export function set_logger_level(level: string) {
//     console.log(`set logger level to ${level}`)
//     logger.level = level
// }

// export function get_logger(lable: string = 'defalut') {
//     return logger.child({ lable })
// }

await configure({
    sinks: { console: getConsoleSink() },
    loggers: [
        { category: 'my-app', lowestLevel: 'debug', sinks: ['console'] },
        { category: ['logtape', 'meta'], sinks: ['console'] },
    ],
})

// const logger = getLogger(["my-app", "my-module"]);

export function Logger(category: string) {
    return getLogger(category)
}

const app = Logger('my-app')

app.info('asldfsdf')
