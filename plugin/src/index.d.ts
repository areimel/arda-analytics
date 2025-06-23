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
		category: string;
		action: string;
		label: string;
		value: string;
	}
}

declare class ARDAAnalytics {
	/**
	 * Create a new ARDA Analytics instance
	 * @param options Configuration options
	 */
	constructor(options?: ARDAAnalytics.Config);

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
	}
}
