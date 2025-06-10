import type { Member } from '$lib/types';

/**
 * Notification service interface for sending notifications when certain events occur.
 * 
 * This is an abstract interface that you can implement with your preferred notification method.
 * Examples: Email, Slack, Discord, SMS, Push notifications, etc.
 */
export interface NotificationService {
	/**
	 * Called when a new user signs up
	 * @param user - The newly created user
	 */
	sendOnCreatedUser(user: Member): Promise<void>;
}

/**
 * Example implementation: Console logger
 * 
 * This is the simplest implementation that just logs to console.
 * You can replace this with your own implementation.
 */
export class ConsoleNotificationService implements NotificationService {
	async sendOnCreatedUser(user: Member): Promise<void> {
		console.log(`🎉 New user signed up: ${user.name} (${user.email})`);
	}
}

/**
 * Example implementation: No-op service
 * 
 * Use this if you don't want any notifications.
 */
export class NoOpNotificationService implements NotificationService {
	async sendOnCreatedUser(_user: Member): Promise<void> {
		// Do nothing
	}
}

/**
 * Factory function to create the notification service.
 * You can modify this to return your preferred implementation.
 */
export function createNotificationService(): NotificationService {
	// Change this line to use your preferred implementation
	return new ConsoleNotificationService();
	
	// Other examples:
	// return new EmailNotificationService({ ... });
	// return new SlackNotificationService({ ... });
	// return new DiscordNotificationService({ ... });
}

/* ========================================================================
 * EXAMPLE: Discord Implementation (for reference only)
 * ======================================================================== 
 * 
 * Below is an example of how you might implement a Discord notification service.
 * To use this:
 * 1. Set up a Discord webhook URL
 * 2. Add DISCORD_WEBHOOK_URL to your environment variables
 * 3. Uncomment the code below and update the factory function above
 * 
 * ```typescript
 * import { DISCORD_WEBHOOK_URL } from '$env/static/private';
 * 
 * export class DiscordNotificationService implements NotificationService {
 *   private webhookUrl: string;
 * 
 *   constructor(webhookUrl: string) {
 *     this.webhookUrl = webhookUrl;
 *   }
 * 
 *   async sendOnCreatedUser(user: Member): Promise<void> {
 *     const embed = {
 *       color: 0x00ff00,
 *       title: '🎉 New user signed up!',
 *       description: `${user.name} has joined our community!`,
 *       fields: [
 *         { name: 'Name', value: user.name, inline: true },
 *         { name: 'Email', value: user.email, inline: true }
 *       ],
 *       thumbnail: { url: user.image },
 *       timestamp: new Date().toISOString()
 *     };
 * 
 *     try {
 *       await fetch(this.webhookUrl, {
 *         method: 'POST',
 *         headers: { 'Content-Type': 'application/json' },
 *         body: JSON.stringify({ embeds: [embed] })
 *       });
 *     } catch (error) {
 *       console.error('Failed to send Discord notification:', error);
 *     }
 *   }
 * }
 * 
 * // In the factory function:
 * export function createNotificationService(): NotificationService {
 *   return new DiscordNotificationService(DISCORD_WEBHOOK_URL);
 * }
 * ```
 */