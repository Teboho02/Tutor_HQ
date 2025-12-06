/**
 * Production-safe logger utility
 * Logs only run in development mode to avoid console clutter in production
 */

const isDevelopment = import.meta.env.DEV;

export const logger = {
    log: (...args: any[]) => {
        if (isDevelopment) {
            console.log(...args);
        }
    },

    error: (...args: any[]) => {
        if (isDevelopment) {
            console.error(...args);
        }
    },

    warn: (...args: any[]) => {
        if (isDevelopment) {
            console.warn(...args);
        }
    },

    debug: (...args: any[]) => {
        if (isDevelopment) {
            console.debug(...args);
        }
    },
};

export default logger;
