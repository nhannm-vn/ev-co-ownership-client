/**
 * Logger utility for development and production
 * Automatically disables logging in production builds
 */

const isDevelopment = import.meta.env.DEV

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log('[LOG]', ...args)
    }
  },
  error: (...args: unknown[]) => {
    // Always log errors, even in production
    console.error('[ERROR]', ...args)
  },
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn('[WARN]', ...args)
    }
  },
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info('[INFO]', ...args)
    }
  },
  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      console.debug('[DEBUG]', ...args)
    }
  }
}

export default logger












