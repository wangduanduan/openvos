import pino from 'pino'

export const logger = pino({
    timestamp: pino.stdTimeFunctions.isoTime,
    base: undefined,
    formatters: {
        level(label) {
            return { level: label }
        },
    },
})

export function set_logger_level(level: string) {
    console.log(`set logger level to ${level}`)
    logger.level = level
}

// export function get_logger(lable: string = 'defalut') {
//     return logger.child({ lable })
// }
