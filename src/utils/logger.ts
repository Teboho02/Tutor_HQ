/**
 * Logger Utility
 * Provides structured logging with different levels
 * Can be extended to send logs to external services (Sentry, LogRocket, etc.)
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: Record<string, any>;
    stack?: string;
}

class Logger {
    private isDevelopment: boolean;
    private logs: LogEntry[] = [];
    private maxLogs: number = 100;

    constructor() {
        this.isDevelopment = import.meta.env.DEV;
    }

    private formatTimestamp(): string {
        return new Date().toISOString();
    }

    private createLogEntry(
        level: LogLevel,
        message: string,
        context?: Record<string, any>,
        error?: Error
    ): LogEntry {
        return {
            timestamp: this.formatTimestamp(),
            level,
            message,
            context,
            stack: error?.stack,
        };
    }

    private storeLog(entry: LogEntry): void {
        this.logs.push(entry);

        // Keep only the last maxLogs entries
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        // Store in localStorage for persistence (development only)
        if (this.isDevelopment) {
            try {
                localStorage.setItem('app_logs', JSON.stringify(this.logs.slice(-50)));
            } catch (e) {
                console.warn('Failed to store logs in localStorage:', e);
            }
        }
    }

    private shouldLog(level: LogLevel): boolean {
        // In production, only log warnings and errors
        if (!this.isDevelopment) {
            return level === 'warn' || level === 'error';
        }
        return true;
    }

    log(...args: any[]): void {
        if (this.isDevelopment) {
            console.log(...args);
        }
    }

    debug(message: string, context?: Record<string, any>): void {
        if (!this.shouldLog('debug')) return;

        const entry = this.createLogEntry('debug', message, context);
        this.storeLog(entry);

        if (this.isDevelopment) {
            console.debug(`[DEBUG] ${message}`, context || '');
        }
    }

    info(message: string, context?: Record<string, any>): void {
        if (!this.shouldLog('info')) return;

        const entry = this.createLogEntry('info', message, context);
        this.storeLog(entry);

        if (this.isDevelopment) {
            console.info(`[INFO] ${message}`, context || '');
        }
    }

    warn(message: string, context?: Record<string, any>): void {
        if (!this.shouldLog('warn')) return;

        const entry = this.createLogEntry('warn', message, context);
        this.storeLog(entry);

        console.warn(`[WARN] ${message}`, context || '');

        // TODO: Send to monitoring service (e.g., Sentry)
    }

    error(message: string, error?: Error, context?: Record<string, any>): void {
        const entry = this.createLogEntry('error', message, context, error);
        this.storeLog(entry);

        console.error(`[ERROR] ${message}`, {
            error,
            context,
            stack: error?.stack,
        });

        // TODO: Send to error tracking service (e.g., Sentry)
        // this.sendToSentry(entry);
    }

    // Performance monitoring
    startTimer(label: string): () => void {
        const start = performance.now();

        return () => {
            const duration = performance.now() - start;
            this.debug(`Timer: ${label}`, { duration: `${duration.toFixed(2)}ms` });
        };
    }

    // Get recent logs (for debugging)
    getRecentLogs(count: number = 10): LogEntry[] {
        return this.logs.slice(-count);
    }

    // Export logs for support
    exportLogs(): string {
        return JSON.stringify(this.logs, null, 2);
    }

    // Clear logs
    clearLogs(): void {
        this.logs = [];
        if (this.isDevelopment) {
            localStorage.removeItem('app_logs');
        }
    }

    // Track user action
    trackAction(action: string, details?: Record<string, any>): void {
        this.info(`User action: ${action}`, details);

        // TODO: Send to analytics service (e.g., Google Analytics, Mixpanel)
        // this.sendToAnalytics(action, details);
    }

    // Track page view
    trackPageView(page: string, details?: Record<string, any>): void {
        this.info(`Page view: ${page}`, details);

        // TODO: Send to analytics service
        // this.sendToAnalytics('page_view', { page, ...details });
    }

    // Track API call
    trackApiCall(
        endpoint: string,
        method: string,
        status: number,
        duration: number
    ): void {
        const level = status >= 400 ? 'error' : 'info';
        const message = `API ${method} ${endpoint} - ${status}`;

        if (level === 'error') {
            this.error(message, undefined, { endpoint, method, status, duration });
        } else {
            this.info(message, { endpoint, method, status, duration });
        }
    }
}

// Singleton instance
export const logger = new Logger();

// Error boundary helper
export function logErrorBoundary(
    error: Error,
    errorInfo: { componentStack?: string }
): void {
    logger.error('React Error Boundary caught an error', error, {
        componentStack: errorInfo.componentStack,
    });
}

// Global error handler
if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
        logger.error('Uncaught error', event.error, {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
        });
    });

    window.addEventListener('unhandledrejection', (event) => {
        logger.error('Unhandled promise rejection', undefined, {
            reason: event.reason,
        });
    });
}

export default logger;
