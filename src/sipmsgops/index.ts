import { logger } from '../core/logger'

// const logger = get_logger('sipmsgops')

export async function init_sipmsgops(config: object): Promise<boolean> {
    logger.info('init')
    return true
}

export function is_method(msg: any, method: string): boolean {
    return true
}

export function has_totag(msg: any): boolean {
    return true
}
