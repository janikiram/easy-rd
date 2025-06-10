/**
 * Error monitoring service interface for tracking and reporting errors.
 * This abstraction allows you to use any error monitoring service.
 */
export interface ErrorMonitor {
	/**
	 * Initialize the error monitoring service
	 * @param config - Service-specific configuration
	 */
	init(config?: unknown): void;

	/**
	 * Capture and report an exception
	 * @param error - The error to capture
	 * @param context - Additional context about the error
	 */
	captureException(error: Error, context?: Record<string, unknown>): void;

	/**
	 * Capture a message/breadcrumb
	 * @param message - The message to capture
	 * @param level - Severity level
	 */
	captureMessage(message: string, level?: 'debug' | 'info' | 'warning' | 'error'): void;

	/**
	 * Set user context for error tracking
	 * @param user - User information
	 */
	setUser(user: { id?: string; email?: string; username?: string } | null): void;

	/**
	 * Add custom context to errors
	 * @param key - Context key
	 * @param context - Context data
	 */
	setContext(key: string, context: Record<string, unknown>): void;

	/**
	 * Create a error handling function for SvelteKit
	 * @param handler - Custom error handler
	 */
	handleError?(handler?: (error: Error, errorId: string) => void): (error: Error) => void;
}

/**
 * Logger interface for application logging
 */
export interface Logger {
	debug(message: string, ...args: unknown[]): void;
	info(message: string, ...args: unknown[]): void;
	warn(message: string, ...args: unknown[]): void;
	error(message: string, ...args: unknown[]): void;
}