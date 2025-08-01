/**
 * ARDA Analytics TypeScript Declarations
 * Comprehensive type definitions for the ARDA Analytics plugin
 */

declare namespace ARDAAnalytics {
	// ========================================
	// CORE PLUGIN CONFIGURATION
	// ========================================
	interface PluginConfig {
		debug?: boolean;
		autoInit?: boolean;
		enableUTMTracking?: boolean;
		enableFormTracking?: boolean;
		enableJourneyTracking?: boolean;
	}

	// ========================================
	// UTM TRACKING TYPES
	// ========================================
	interface UTMValues {
		utm_campaign: string;
		utm_content: string;
		utm_medium: string;
		utm_source: string;
		utm_term: string;
		utm_state: string;
		timestamp: string;
	}

	interface ParameterData {
		paramValue: string;
		utm_state: string;
		timestamp: string;
	}

	interface ParameterState {
		paramValue: string;
		utm_state: string;
	}

	// ========================================
	// FORM TRACKING TYPES
	// ========================================
	interface UTMFormConfig {
		hideFields?: boolean;
		fieldClass?: string;
		containerClass?: string;
	}

	interface UTMFormField {
		name: string;
		value: string;
	}

	type FormSubmissionCallback = (formData: {
		email: string;
		firstName: string;
		lastName: string;
		company: string;
		brandName: string;
		formId: string;
	}) => void;

	// ========================================
	// GTM EVENT TYPES
	// ========================================
	interface GTMEvent {
		event: string;
		[key: string]: unknown;
	}

	interface GTMPushResult {
		success: boolean;
		error?: string;
		eventData?: GTMEvent;
	}

	// ========================================
	// USER JOURNEY TRACKING TYPES
	// ========================================
	interface JourneyLogEvent {
		eventName: string;
		timestamp: string;
		sessionId: string;
	}

	interface TriggerConfig {
		triggerId: string;
		eventNames: string[];
		callback: () => void;
		requireAllEvents: boolean;
		onceOnly: boolean;
		triggered: boolean;
		lastTriggered?: string;
	}

	// ========================================
	// USER DATA SERVICE TYPES
	// ========================================
	interface ProgressiveFormData {
		// Step 1: Brand Search
		originalBrandName?: string;
		
		// Step 2: Company Selection
		selectedCompany?: {
			name: string;
			domain: string;
			description: string;
		};
		
		// Step 3: Email address
		email?: string;
		
		// Step 4: Personal Information (from HubSpot forms)
		firstname?: string;
		lastname?: string;
		jobtitle?: string;
		
		// Additional metadata
		currentStep?: number;
		formStartTime?: Date;
		stepCompletionTimes?: Record<number, Date>;
	}

	interface UserDataService {
		setUserData(data: Partial<ProgressiveFormData>): void;
		getUserData(): ProgressiveFormData;
		getField<K extends keyof ProgressiveFormData>(field: K): ProgressiveFormData[K];
		updateStep(step: number): void;
		getBrandNameForForm(): string;
		autoFillHubSpotForm(containerSelector: string, delay?: number): void;
		resetAutoFillTracking(containerSelector?: string): void;
		clearData(): void;
		getAnalyticsData(): Record<string, unknown>;
		destroy(): void;
		manualTriggerAutoFill(containerSelector: string): void;
		debugAutoFill(containerSelector: string): void;
	}

	// ========================================
	// ANALYTICS SERVICE TYPES
	// ========================================
	interface AnalyticsService {
		// Initialization
		initialize(): void;

		// UTM Methods
		captureUTMParameters(): UTMValues;
		getUTMParameter(parameterName: string): ParameterData;
		hasActiveUTMParameters(): boolean;
		getAnalyticsSummary(): {
			utm: UTMValues;
			hasUTMs: boolean;
			capturedAt: string;
		};

		// Form Methods
		setupFormTracking(config?: UTMFormConfig): number;
		hasUTMFields(form: HTMLFormElement): boolean;
		addUTMFieldsToForm(form: HTMLFormElement, config?: UTMFormConfig): boolean;
		updateAllFormValues(): number;
		watchForNewForms(): void;

		// GTM Methods
		isGTMReady(): boolean;
		sendGTMEvent(eventName: string): GTMPushResult;

		// Journey Methods
		getRecentEvents(limit?: number): JourneyLogEvent[];
		hasEventOccurred(eventName: string): boolean;
		createJourneyTrigger(
			eventNames: string[], 
			callback: () => void,
			options?: {
				triggerId?: string;
				requireAllEvents?: boolean;
				onceOnly?: boolean;
			}
		): string;
		getActiveTriggers(): TriggerConfig[];
		clearEventLog(): void;
		debugJourneyState(): void;
	}

	// ========================================
	// LEGACY SUPPORT TYPES
	// ========================================
	interface Config extends PluginConfig {}
	
	interface EventData {
		type: string;
		element?: HTMLElement;
		url?: string;
		timestamp: number;
		metadata?: Record<string, unknown>;
	}

	type EventHandler = (eventData: EventData) => void;
}

// ========================================
// MAIN PLUGIN CLASS DECLARATION
// ========================================
declare class ARDAAnalytics {
	/**
	 * Create a new ARDA Analytics instance
	 * @param options Configuration options
	 */
	constructor(options?: ARDAAnalytics.PluginConfig);

	/**
	 * Initialize the plugin and analytics services
	 */
	init(): void;

	/**
	 * Push a custom event to GTM
	 * @param eventName The event name to push
	 * @returns Result of the push operation
	 */
	pushEvent(eventName: string): ARDAAnalytics.GTMPushResult;

	/**
	 * Direct access to pushToDataLayer function for compatibility
	 * @param eventName The event name to push
	 * @returns Result of the push operation
	 */
	pushToDataLayer(eventName: string): ARDAAnalytics.GTMPushResult;

	/**
	 * Check if GTM is available
	 * @returns GTM availability status
	 */
	isGTMReady(): boolean;

	/**
	 * Get current UTM parameters
	 * @returns UTM parameters object
	 */
	getUTMParameters(): ARDAAnalytics.UTMValues;

	/**
	 * Get analytics summary
	 * @returns Analytics summary object
	 */
	getAnalyticsSummary(): {
		utm: ARDAAnalytics.UTMValues;
		hasUTMs: boolean;
		capturedAt: string;
	};

	/**
	 * Get recent journey events
	 * @param limit Maximum number of events to return
	 * @returns Array of recent events
	 */
	getRecentEvents(limit?: number): ARDAAnalytics.JourneyLogEvent[];

	/**
	 * Check if a specific event has occurred
	 * @param eventName Name of the event to check
	 * @returns Whether the event occurred
	 */
	hasEventOccurred(eventName: string): boolean;

	/**
	 * Create a journey trigger
	 * @param eventNames Array of event names to watch for
	 * @param callback Function to execute when conditions are met
	 * @param options Optional configuration
	 * @returns Trigger ID
	 */
	createJourneyTrigger(
		eventNames: string[], 
		callback: () => void,
		options?: {
			triggerId?: string;
			requireAllEvents?: boolean;
			onceOnly?: boolean;
		}
	): string;

	/**
	 * Access to user data service
	 * @returns User data service instance
	 */
	getUserDataService(): ARDAAnalytics.UserDataService;

	/**
	 * Get plugin version
	 * @returns Version string
	 */
	getVersion(): string;

	/**
	 * Check if plugin is initialized
	 * @returns Initialization status
	 */
	isReady(): boolean;

	/**
	 * Get plugin configuration
	 * @returns Current configuration
	 */
	getConfig(): ARDAAnalytics.PluginConfig;

	/**
	 * Update configuration (requires re-initialization)
	 * @param newConfig New configuration options
	 */
	updateConfig(newConfig: Partial<ARDAAnalytics.PluginConfig>): void;

	/**
	 * Clear all analytics data
	 */
	clearData(): void;

	/**
	 * Debug current state
	 */
	debug(): void;

	/**
	 * Destroy the plugin instance
	 */
	destroy(): void;
}

// ========================================
// MODULE EXPORTS
// ========================================
export default ARDAAnalytics;
export { ARDAAnalytics };

// Export individual service types
export type { 
	ARDAAnalytics as ARDAAnalyticsNamespace,
	ARDAAnalytics.PluginConfig,
	ARDAAnalytics.UTMValues,
	ARDAAnalytics.ParameterData,
	ARDAAnalytics.UTMFormConfig,
	ARDAAnalytics.GTMPushResult,
	ARDAAnalytics.JourneyLogEvent,
	ARDAAnalytics.TriggerConfig,
	ARDAAnalytics.ProgressiveFormData,
	ARDAAnalytics.UserDataService,
	ARDAAnalytics.AnalyticsService,
	ARDAAnalytics.FormSubmissionCallback
};

// ========================================
// GLOBAL DECLARATIONS
// ========================================
declare global {
	interface Window {
		ARDAAnalytics?: typeof ARDAAnalytics;
		dataLayer?: Record<string, unknown>[];
		userDataService?: ARDAAnalytics.UserDataService;
	}
}