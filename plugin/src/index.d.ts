/**
 * ARDA Analytics TypeScript Declarations
 * Provides type safety and IDE support for the ARDA Analytics plugin
 */

declare namespace ARDAAnalytics {
	// Configuration Types
	interface AutoTrackConfig {
		pageViews?: boolean;
		clicks?: boolean;
		forms?: boolean;
		scrollDepth?: boolean;
	}

	interface StorageConfig {
		enabled?: boolean;
		type?: 'localStorage' | 'sessionStorage' | 'memory';
		prefix?: string;
		maxEvents?: number;
	}

	interface APIConfig {
		enabled?: boolean;
		endpoint?: string | null;
		apiKey?: string | null;
		timeout?: number;
		retryAttempts?: number;
		batchSize?: number;
	}

	interface PrivacyConfig {
		respectDoNotTrack?: boolean;
		anonymizeIp?: boolean;
		cookieConsent?: boolean;
	}

	interface DebugConfig {
		enabled?: boolean;
		logLevel?: 'error' | 'warn' | 'info' | 'debug';
		verbose?: boolean;
	}

	interface Config {
		autoTrack?: AutoTrackConfig;
		storage?: StorageConfig;
		api?: APIConfig;
		privacy?: PrivacyConfig;
		debug?: DebugConfig;
	}

	// Event Types
	interface EventProperties {
		[key: string]: string | number | boolean | null | undefined;
	}

	interface EventData {
		event: string;
		properties: EventProperties & {
			timestamp: number;
			url?: string;
			userAgent?: string;
			sessionId?: string;
		};
		options?: TrackingOptions;
		id?: string;
	}

	interface TrackingOptions {
		[key: string]: any;
	}

	// Browser Support Types
	interface BrowserFeatures {
		localStorage: boolean;
		sessionStorage: boolean;
		fetch: boolean;
		addEventListener: boolean;
		querySelector: boolean;
		console: boolean;
		promise: boolean;
	}

	interface BrowserInfo {
		userAgent: string;
		isIE: boolean;
		isChrome: boolean;
		isFirefox: boolean;
		isSafari: boolean;
		isMobile: boolean;
	}

	// Debug Types
	interface DebugInfo {
		version: string;
		initialized: boolean;
		degraded: boolean;
		startTime: number;
		uptime: number;
		browserSupport: BrowserFeatures;
		config: Config;
		events: any;
		storage: {
			size: number;
			available: boolean;
		};
		api: {
			queueSize: number;
			online: boolean;
		};
	}

	// Element Data Types
	interface ElementPosition {
		x: number;
		y: number;
		width: number;
		height: number;
	}

	interface ElementData {
		tagName: string;
		id: string | null;
		classes: string | null;
		text: string;
		href: string | null;
		dataset: { [key: string]: string };
		position: ElementPosition;
	}

	interface ViewportSize {
		width: number;
		height: number;
	}

	interface PageInfo {
		url: string;
		pathname: string;
		search: string;
		hash: string;
		title: string;
		referrer: string;
	}

	// Event Listener Types
	type EventCallback = (data: any) => void;
}

declare class ARDAAnalytics {
	/**
	 * Create a new ARDA Analytics instance
	 * @param options Configuration options
	 */
	constructor(options?: ARDAAnalytics.Config);

	/**
	 * Track an analytics event
	 * @param eventName Name of the event
	 * @param properties Event properties
	 * @param options Tracking options
	 * @returns Event ID or null if failed
	 */
	track(
		eventName: string,
		properties?: ARDAAnalytics.EventProperties,
		options?: ARDAAnalytics.TrackingOptions
	): string | null;

	/**
	 * Track a page view event
	 */
	trackPageView(): void;

	/**
	 * Get configuration value
	 * @param key Configuration key (supports dot notation)
	 * @param defaultValue Default value if key not found
	 * @returns Configuration value
	 */
	getConfig<T = any>(key: string, defaultValue?: T): T;

	/**
	 * Set configuration value
	 * @param key Configuration key or object
	 * @param value Configuration value
	 */
	setConfig(key: string | ARDAAnalytics.Config, value?: any): void;

	/**
	 * Add event listener
	 * @param event Event name
	 * @param callback Event callback
	 */
	on(event: string, callback: ARDAAnalytics.EventCallback): void;

	/**
	 * Remove event listener
	 * @param event Event name
	 * @param callback Event callback
	 */
	off(event: string, callback: ARDAAnalytics.EventCallback): void;

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
	 * Check if plugin is running in degraded mode
	 * @returns True if in degraded mode
	 */
	isDegradedMode(): boolean;

	/**
	 * Get stored events
	 * @param limit Maximum number of events to return
	 * @returns Array of stored events
	 */
	getStoredEvents(limit?: number): ARDAAnalytics.EventData[];

	/**
	 * Clear all stored events
	 * @returns True if successful
	 */
	clearStoredEvents(): boolean;

	/**
	 * Get debug information
	 * @returns Debug information object
	 */
	getDebugInfo(): ARDAAnalytics.DebugInfo;

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