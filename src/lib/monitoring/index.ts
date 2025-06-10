import { ConsoleErrorMonitor, ConsoleLogger } from './implementations/console';
import type { ErrorMonitor, Logger } from './types';

export type { ErrorMonitor, Logger } from './types';

let errorMonitor: ErrorMonitor | null = null;
let logger: Logger | null = null;

/**
 * Get the error monitor instance
 */
export function getErrorMonitor(): ErrorMonitor {
	if (!errorMonitor) {
		// Default to console implementation
		// Replace this with your preferred implementation
		errorMonitor = new ConsoleErrorMonitor();
		
		// Example: Use Sentry in production
		// if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
		//   errorMonitor = new SentryErrorMonitor();
		//   errorMonitor.init({ dsn: import.meta.env.VITE_SENTRY_DSN });
		// }
	}
	return errorMonitor;
}

/**
 * Get the logger instance
 */
export function getLogger(): Logger {
	if (!logger) {
		logger = new ConsoleLogger();
		
		// You can replace this with other implementations:
		// - Winston
		// - Pino
		// - Custom logger
	}
	return logger;
}

/**
 * Initialize monitoring services
 * Call this in your app initialization
 */
export function initializeMonitoring(config?: {
	errorMonitor?: ErrorMonitor;
	logger?: Logger;
}): void {
	if (config?.errorMonitor) {
		errorMonitor = config.errorMonitor;
	}
	if (config?.logger) {
		logger = config.logger;
	}
}