import type { ErrorMonitor, Logger } from '../types';

/**
 * Simple console-based error monitor for development
 */
export class ConsoleErrorMonitor implements ErrorMonitor {
	init(): void {
		console.log('[ConsoleErrorMonitor] Initialized');
	}

	captureException(error: Error, context?: Record<string, unknown>): void {
		console.error('[ERROR]', error.message, error.stack);
		if (context) {
			console.error('[ERROR CONTEXT]', context);
		}
	}

	captureMessage(message: string, level: 'debug' | 'info' | 'warning' | 'error' = 'info'): void {
		const method = level === 'error' ? 'error' : level === 'warning' ? 'warn' : 'log';
		console[method](`[${level.toUpperCase()}]`, message);
	}

	setUser(user: { id?: string; email?: string; username?: string } | null): void {
		if (user) {
			console.log('[USER]', user);
		}
	}

	setContext(key: string, context: Record<string, unknown>): void {
		console.log(`[CONTEXT:${key}]`, context);
	}
}

/**
 * Console logger implementation
 */
export class ConsoleLogger implements Logger {
	debug(message: string, ...args: unknown[]): void {
		console.debug(`[DEBUG] ${message}`, ...args);
	}

	info(message: string, ...args: unknown[]): void {
		console.info(`[INFO] ${message}`, ...args);
	}

	warn(message: string, ...args: unknown[]): void {
		console.warn(`[WARN] ${message}`, ...args);
	}

	error(message: string, ...args: unknown[]): void {
		console.error(`[ERROR] ${message}`, ...args);
	}
}