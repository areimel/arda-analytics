import { GetUTMs, parameterLogger, type UTMValues, type ParameterData } from './analytics-micro-services/utm-tracking';
import { fieldDetection, fieldAdd, processAllForms, updateFormValues, type UTMFormConfig } from './analytics-micro-services/utm-form';
import { pushToDataLayer, isGTMAvailable, type GTMPushResult } from './analytics-micro-services/gtm-event-push';
import { 
	UserJourneyTrigger,
	getRecentEvents,
	hasEventOccurred,
	clearEventLog,
	getActiveTriggers,
	debugJourneyState,
	type JourneyLogEvent,
	type TriggerConfig
} from './analytics-micro-services/user-journey-tracking';

// Development mode flag - set to true for debugging
const devMode = true;

/**
 * Analytics Service - Centralized analytics functionality
 * This service orchestrates various analytics micro-services
 */
class AnalyticsService {
	
	/**
	 * Initialize analytics tracking
	 * Call this when the application starts or when you want to begin tracking
	 */
	public static initialize(): void {
		if (devMode) {
			console.log('🚀 Analytics Service initialized');
		}
		
		// Automatically capture UTM parameters on initialization
		this.captureUTMParameters();
		
		// Process forms on page load
		this.setupFormTracking();
		
		// Initialize journey tracking
		this.initializeJourneyTracking();
		
		// Check GTM availability
		if (devMode && !this.isGTMReady()) {
			console.warn('⚠️ Google Tag Manager not detected');
		}
	}
	
	/**
	 * Initialize journey tracking system
	 * This imports and calls the journey system initialization
	 */
	private static initializeJourneyTracking(): void {
		// Dynamic import to avoid circular dependencies
		import('./analytics-functions.service').then(({ initializeJourneyTracking }) => {
			initializeJourneyTracking();
		}).catch(error => {
			if (devMode) {
				console.error('Error initializing journey tracking:', error);
			}
		});
	}
	
	/**
	 * Capture and return current UTM parameters
	 * @returns UTMValues object with all UTM data and timestamp
	 */
	public static captureUTMParameters(): UTMValues {
		const utmData = GetUTMs();
		
		if (devMode) {
			console.log('📊 UTM Parameters captured:', utmData);
		}
		
		return utmData;
	}
	
	/**
	 * Get a specific UTM parameter with detailed information
	 * @param parameterName - The UTM parameter to retrieve (e.g., 'utm_source')
	 * @returns ParameterData with value, state, and timestamp
	 */
	public static getUTMParameter(parameterName: string): ParameterData {
		const parameterData = parameterLogger(parameterName);
		
		if (devMode) {
			console.log(`📝 Retrieved ${parameterName}:`, parameterData);
		}
		
		return parameterData;
	}
	
	/**
	 * Check if any UTM parameters are currently active
	 * @returns boolean indicating if UTM parameters are present
	 */
	public static hasActiveUTMParameters(): boolean {
		const utmData = GetUTMs();
		const hasUTMs = !!(utmData.utm_source || utmData.utm_medium || utmData.utm_campaign || 
		                   utmData.utm_term || utmData.utm_content);
		
		if (devMode) {
			console.log('🔍 UTM Parameters active:', hasUTMs);
		}
		
		return hasUTMs;
	}
	
	/**
	 * Get analytics summary for reporting
	 * @returns Formatted analytics data ready for reporting/sending to analytics platforms
	 */
	public static getAnalyticsSummary(): {
		utm: UTMValues;
		hasUTMs: boolean;
		capturedAt: string;
	} {
		const utmData = this.captureUTMParameters();
		const hasUTMs = this.hasActiveUTMParameters();
		
		const summary = {
			utm: utmData,
			hasUTMs: hasUTMs,
			capturedAt: new Date().toISOString()
		};
		
		if (devMode) {
			console.log('📋 Analytics Summary:', summary);
		}
		
		return summary;
	}
	
	/* ===== UTM FORM METHODS ===== */
	
	/**
	 * Setup form tracking - adds UTM fields to all forms on the page
	 * @param config - Configuration options for UTM form fields
	 * @returns number of forms processed
	 */
	public static setupFormTracking(config?: UTMFormConfig): number {
		const formsProcessed = processAllForms(config);
		
		if (devMode) {
			console.log(`📝 Form tracking setup complete - ${formsProcessed} forms processed`);
		}
		
		return formsProcessed;
	}
	
	/**
	 * Check if a specific form has UTM fields
	 * @param form - The form element to check
	 * @returns boolean indicating if UTM fields are present
	 */
	public static hasUTMFields(form: HTMLFormElement): boolean {
		const hasFields = fieldDetection(form);
		
		if (devMode) {
			console.log('🔍 Form UTM fields detected:', hasFields);
		}
		
		return hasFields;
	}
	
	/**
	 * Add UTM fields to a specific form
	 * @param form - The form element to add fields to
	 * @param config - Configuration options for the fields
	 * @returns boolean indicating if fields were added
	 */
	public static addUTMFieldsToForm(form: HTMLFormElement, config?: UTMFormConfig): boolean {
		const wasAdded = fieldAdd(form, config);
		
		if (devMode) {
			console.log('✅ UTM fields added to form:', wasAdded);
		}
		
		return wasAdded;
	}
	
	/**
	 * Update UTM field values in all forms with current UTM data
	 * @returns number of forms updated
	 */
	public static updateAllFormValues(): number {
		const formsUpdated = updateFormValues();
		
		if (devMode) {
			console.log(`🔄 Updated UTM values in ${formsUpdated} forms`);
		}
		
		return formsUpdated;
	}
	
	/**
	 * Setup automatic form tracking for dynamically added forms
	 * Call this if you're adding forms to the page after initial load
	 */
	public static watchForNewForms(): void {
		// Set up a MutationObserver to watch for new forms
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === Node.ELEMENT_NODE) {
						const element = node as Element;
						
						// Check if the added node is a form
						if (element.tagName === 'FORM') {
							this.addUTMFieldsToForm(element as HTMLFormElement);
						}
						
						// Check if the added node contains forms
						const forms = element.querySelectorAll('form');
						forms.forEach(form => {
							this.addUTMFieldsToForm(form as HTMLFormElement);
						});
					}
				});
			});
		});
		
		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
		
		if (devMode) {
			console.log('👀 Form watcher activated - will automatically add UTM fields to new forms');
		}
	}
	
	// ===== GTM EVENT METHODS =====
	
	/**
	 * Check if Google Tag Manager is ready
	 * @returns boolean indicating if GTM is available
	 */
	public static isGTMReady(): boolean {
		const isReady = isGTMAvailable();
		
		if (devMode) {
			console.log('🏷️ GTM availability:', isReady);
		}
		
		return isReady;
	}
	
	/**
	 * Send event to Google Tag Manager (GA4 Format)
	 * @param eventName - The event name to send to GTM
	 * @returns GTMPushResult indicating success/failure
	 */
	public static sendGTMEvent(eventName: string): GTMPushResult {
		const result = pushToDataLayer(eventName);
		
		if (devMode) {
			console.log('📊 GTM Event sent:', result.success ? 'Success' : 'Failed', result);
		}
		
		return result;
	}

	// ===== USER JOURNEY METHODS =====

	/**
	 * Get recent events from the current session
	 * @param limit - Maximum number of events to return (default: 50)
	 * @returns Array of recent JourneyLogEvent objects
	 */
	public static getRecentEvents(limit: number = 50): JourneyLogEvent[] {
		const events = getRecentEvents(limit);
		
		if (devMode) {
			console.log(`📋 Retrieved ${events.length} recent events`);
		}
		
		return events;
	}

	/**
	 * Check if a specific event has occurred in the current session
	 * @param eventName - Name of the event to check for
	 * @returns boolean indicating if the event occurred
	 */
	public static hasEventOccurred(eventName: string): boolean {
		const occurred = hasEventOccurred(eventName);
		
		if (devMode) {
			console.log(`🔍 Event '${eventName}' occurred:`, occurred);
		}
		
		return occurred;
	}

	/**
	 * Create a journey trigger that executes a callback when specific events occur
	 * @param eventNames - Array of event names to watch for
	 * @param callback - Function to execute when trigger conditions are met
	 * @param options - Optional configuration for trigger behavior
	 * @returns string - The trigger ID
	 */
	public static createJourneyTrigger(
		eventNames: string[], 
		callback: () => void,
		options?: {
			triggerId?: string;
			requireAllEvents?: boolean;
			onceOnly?: boolean;
		}
	): string {
		const triggerId = UserJourneyTrigger(eventNames, callback, options);
		
		if (devMode) {
			console.log(`📡 Journey trigger created: ${triggerId} for events [${eventNames.join(', ')}]`);
		}
		
		return triggerId;
	}

	/**
	 * Get all active triggers
	 * @returns Array of active TriggerConfig objects
	 */
	public static getActiveTriggers(): TriggerConfig[] {
		const triggers = getActiveTriggers();
		
		if (devMode) {
			console.log(`📋 Active triggers found: ${triggers.length}`);
		}
		
		return triggers;
	}

	/**
	 * Clear all logged events
	 */
	public static clearEventLog(): void {
		clearEventLog();
		
		if (devMode) {
			console.log('🗑️ Event log cleared');
		}
	}

	/**
	 * Log current journey state for debugging
	 */
	public static debugJourneyState(): void {
		debugJourneyState();
	}
}

// Export the service class and re-export types for convenience
export default AnalyticsService;
export { AnalyticsService };
export type { 
	UTMValues, 
	ParameterData, 
	UTMFormConfig, 
	GTMPushResult,
	JourneyLogEvent,
	TriggerConfig
};