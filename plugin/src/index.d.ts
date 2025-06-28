/**
 * ARDA Analytics TypeScript Declarations
 * Provides type safety and IDE support for the ARDA Analytics plugin
 */

declare namespace ARDAAnalytics {
	// Configuration Types
	interface Config {
		debug?: boolean;
		autoInit?: boolean;
	}

	// Event Data Types
	interface EventData {
		type: string;
		element?: HTMLElement;
		url?: string;
		timestamp: number;
		metadata?: Record<string, unknown>;
	}

	// UTM Parameter Types
	interface UTMParams {
		utm_source?: string;
		utm_medium?: string;
		utm_campaign?: string;
		utm_term?: string;
		utm_content?: string;
	}

	// GTM Event Types
	interface GTMEvent {
		event: string;
		[key: string]: unknown;
	}

	// GTM Push Result Types
	interface GTMPushResult {
		success: boolean;
		error?: string;
		eventData?: GTMEvent;
	}

	// Event Handler Type
	type EventHandler = (eventData: EventData) => void;
}

declare class ARDAAnalytics {
	/**
	 * Create a new ARDA Analytics instance
	 * @param options Configuration options
	 */
	constructor(options?: ARDAAnalytics.Config);

	/**
	 * Initialize the plugin
	 */
	init(): void;

	/**
	 * Get plugin version
	 * @returns Version string
	 */
	getVersion(): string;

	/**
	 * Check if plugin is ready/initialized
	 * @returns True if ready
	 */
	isReady(): boolean;

	/**
	 * Check if GTM is available and ready
	 * @returns True if GTM is available
	 */
	isGTMReady(): boolean;

	/**
	 * Get current plugin configuration
	 * @returns Current configuration object
	 */
	getConfig(): ARDAAnalytics.Config;

	/**
	 * Update plugin configuration
	 * @param newConfig New configuration options
	 */
	updateConfig(newConfig: Partial<ARDAAnalytics.Config>): void;

	/**
	 * Manually push a custom event to GTM
	 * @param eventName The event name to push
	 * @returns Result of the push operation
	 */
	pushEvent(eventName: string): ARDAAnalytics.GTMPushResult;

	/**
	 * Destroy the plugin instance
	 */
	destroy(): void;
}

// Module exports
export default ARDAAnalytics;
export { ARDAAnalytics };

// Global declaration for UMD builds
declare global {
	interface Window {
		ARDAAnalytics: typeof ARDAAnalytics;
		dataLayer?: Record<string, unknown>[];
	}
}
