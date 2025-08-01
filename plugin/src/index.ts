/**
 * ARDA Analytics - Main Plugin Entry Point
 * Integrates the comprehensive analytics service with plugin orchestrator pattern
 */

import { AnalyticsService } from './analytics.service';
import { runUTMEventChecks } from './analytics-functions.service';
import { pushToDataLayer, isGTMAvailable } from './analytics-micro-services/gtm-event-push';
import { userDataService } from './user-data.service';
import type { 
	UTMValues, 
	ParameterData, 
	UTMFormConfig, 
	GTMPushResult,
	JourneyLogEvent,
	TriggerConfig
} from './analytics.service';

// Import debug mode functionality
let debugMode = false;
function debugLog(...args: unknown[]): void {
	if (debugMode) {
		console.log('[ARDA Analytics]', ...args);
	}
}

// Plugin configuration interface
interface PluginConfig {
	debug?: boolean;
	autoInit?: boolean;
	enableUTMTracking?: boolean;
	enableFormTracking?: boolean;
	enableJourneyTracking?: boolean;
}

/**
 * ARDA Analytics Plugin Class
 * Orchestrates the comprehensive analytics service with plugin-style initialization
 */
class ARDAAnalytics {
	private isInitialized: boolean = false;
	private readonly version: string = '0.2.0';
	private readonly startTime: number = Date.now();
	private config: PluginConfig;

	constructor(options: PluginConfig = {}) {
		// Default configuration
		this.config = {
			debug: false,
			autoInit: true,
			enableUTMTracking: true,
			enableFormTracking: true,
			enableJourneyTracking: true,
			...options,
		};

		// Initialize debug mode
		debugMode = this.config.debug || false;

		// Auto-initialize if configured
		if (this.config.autoInit) {
			this.init();
		}
	}

	/**
	 * Initialize the plugin and analytics services
	 */
	public init(): void {
		try {
			debugLog(`Initializing ARDA Analytics v${this.version}`);

			// Check if GTM is available
			if (!this.isGTMReady()) {
				debugLog('GTM dataLayer not available, initializing it');
			}

			// Initialize the core analytics service
			AnalyticsService.initialize();

			// Run UTM event checks if enabled
			if (this.config.enableUTMTracking) {
				runUTMEventChecks();
			}

			// Setup form watcher if enabled
			if (this.config.enableFormTracking) {
				AnalyticsService.watchForNewForms();
			}

			// Mark as initialized
			this.isInitialized = true;

			debugLog(`ARDA Analytics v${this.version} initialized successfully`);
		} catch (error) {
			console.error('ARDA Analytics initialization failed:', error);
		}
	}

	/**
	 * Push a custom event to GTM
	 * @param eventName - The event name to push
	 * @returns Result of the push operation
	 */
	public pushEvent(eventName: string): { success: boolean; error?: string } {
		if (!this.isInitialized) {
			console.warn('ARDA Analytics not initialized. Call init() first.');
			return { success: false, error: 'Not initialized' };
		}
		
		return AnalyticsService.sendGTMEvent(eventName);
	}

	/**
	 * Direct access to pushToDataLayer function for compatibility
	 * @param eventName - The event name to push
	 * @returns Result of the push operation
	 */
	public pushToDataLayer(eventName: string): { success: boolean; error?: string } {
		return this.pushEvent(eventName);
	}

	/**
	 * Check if GTM is available
	 * @returns GTM availability status
	 */
	public isGTMReady(): boolean {
		return AnalyticsService.isGTMReady();
	}

	/**
	 * Get current UTM parameters
	 * @returns UTM parameters object
	 */
	public getUTMParameters() {
		return AnalyticsService.captureUTMParameters();
	}

	/**
	 * Get analytics summary
	 * @returns Analytics summary object
	 */
	public getAnalyticsSummary() {
		return AnalyticsService.getAnalyticsSummary();
	}

	/**
	 * Get recent journey events
	 * @param limit - Maximum number of events to return
	 * @returns Array of recent events
	 */
	public getRecentEvents(limit: number = 50) {
		return AnalyticsService.getRecentEvents(limit);
	}

	/**
	 * Check if a specific event has occurred
	 * @param eventName - Name of the event to check
	 * @returns Whether the event occurred
	 */
	public hasEventOccurred(eventName: string): boolean {
		return AnalyticsService.hasEventOccurred(eventName);
	}

	/**
	 * Create a journey trigger
	 * @param eventNames - Array of event names to watch for
	 * @param callback - Function to execute when conditions are met
	 * @param options - Optional configuration
	 * @returns Trigger ID
	 */
	public createJourneyTrigger(
		eventNames: string[], 
		callback: () => void,
		options?: {
			triggerId?: string;
			requireAllEvents?: boolean;
			onceOnly?: boolean;
		}
	): string {
		return AnalyticsService.createJourneyTrigger(eventNames, callback, options);
	}

	/**
	 * Access to user data service
	 * @returns User data service instance
	 */
	public getUserDataService(): typeof userDataService {
		return userDataService;
	}

	/**
	 * Get plugin version
	 * @returns Version string
	 */
	public getVersion(): string {
		return this.version;
	}

	/**
	 * Check if plugin is initialized
	 * @returns Initialization status
	 */
	public isReady(): boolean {
		return this.isInitialized;
	}

	/**
	 * Get plugin configuration
	 * @returns Current configuration
	 */
	public getConfig(): PluginConfig {
		return { ...this.config };
	}

	/**
	 * Update configuration (requires re-initialization)
	 * @param newConfig - New configuration options
	 */
	public updateConfig(newConfig: Partial<PluginConfig>): void {
		this.config = { ...this.config, ...newConfig };
		
		// Update debug mode
		debugMode = this.config.debug || false;
		
		debugLog('Configuration updated', this.config);
	}

	/**
	 * Clear all analytics data
	 */
	public clearData(): void {
		AnalyticsService.clearEventLog();
		userDataService.clearData();
		debugLog('All analytics data cleared');
	}

	/**
	 * Debug current state
	 */
	public debug(): void {
		console.group('🔍 ARDA Analytics Debug Information');
		console.log('Version:', this.version);
		console.log('Initialized:', this.isInitialized);
		console.log('Running for:', Date.now() - this.startTime, 'ms');
		console.log('Configuration:', this.config);
		console.log('GTM Ready:', this.isGTMReady());
		console.log('UTM Parameters:', this.getUTMParameters());
		console.log('Recent Events:', this.getRecentEvents(10));
		console.log('Active Triggers:', AnalyticsService.getActiveTriggers());
		AnalyticsService.debugJourneyState();
		console.groupEnd();
	}

	/**
	 * Destroy the plugin instance
	 */
	public destroy(): void {
		userDataService.destroy();
		this.isInitialized = false;
		debugLog('ARDA Analytics destroyed');
	}
}

// Export for different module systems
export default ARDAAnalytics;
export { AnalyticsService, userDataService };

// Export types for TypeScript users
export type { 
	PluginConfig,
	UTMValues, 
	ParameterData, 
	UTMFormConfig, 
	GTMPushResult,
	JourneyLogEvent,
	TriggerConfig
};

// For UMD builds and global usage
declare global {
	interface Window {
		ARDAAnalytics?: typeof ARDAAnalytics;
	}
}

if (typeof window !== 'undefined') {
	window.ARDAAnalytics = ARDAAnalytics;
	
	// Also expose static methods for easy access
	(window as any).ARDAAnalytics.pushToDataLayer = pushToDataLayer;
	(window as any).ARDAAnalytics.isGTMAvailable = isGTMAvailable;
}

// For CommonJS
if (typeof module !== 'undefined' && module.exports) {
	module.exports = ARDAAnalytics;
}