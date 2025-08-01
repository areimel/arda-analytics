import { logJourneyEvent } from './user-journey-tracking';

// Development mode flag
const devMode = true;

// Reserved GA4 event names that cannot be used directly
const RESERVED_EVENT_NAMES = [
	'app_remove',
	'app_store_refund',
	'app_store_subscription_cancel',
	'app_store_subscription_renew',
	'click',
	'error',
	'file_download',
	'first_open',
	'first_visit',
	'form_start',
	'form_submit',
	'in_app_purchase',
	'page_view',
	'scroll',
	'session_start',
	'user_engagement',
	'view_complete',
	'video_progress',
	'video_start',
	'view_search_results'
];

interface GTMEvent {
	event: string;
	[key: string]: unknown; // Allow additional custom properties if needed
}

interface GTMPushResult {
	success: boolean;
	error?: string;
	eventData?: GTMEvent;
}

/**
 * Formats event names to comply with GA4 naming conventions
 * Rules:
 * - Must start with a letter (prepend 'custom_' if starts with number)
 * - Only letters, numbers, and underscores allowed
 * - Convert to lowercase
 * - Replace spaces and special characters with underscores
 * - Prepend 'custom_' if matches reserved event names
 * @param eventName - The original event name
 * @returns string - The formatted event name
 */
function formatCorrection(eventName: string): string {
	// Convert to lowercase first
	let formattedName = eventName.toLowerCase();

	// Replace any character that's not a letter, number, or underscore with underscore
	formattedName = formattedName.replace(/[^a-z0-9_]/g, '_');

	// Trim any trailing underscores
	formattedName = formattedName.replace(/_+$/, '');

	// If starts with a number, prepend 'custom_'
	if (/^[0-9]/.test(formattedName)) {
		formattedName = `custom_${formattedName}`;
	}

	// If matches reserved event name, prepend 'custom_'
	if (RESERVED_EVENT_NAMES.includes(formattedName)) {
		formattedName = `custom_${formattedName}`;
	}

	return formattedName;
}

/**
 * Log recent event for plugin event viewer
 * @param eventName - The event name
 * @param success - Whether the event was successful
 * @param metadata - Additional event metadata
 */
function logRecentEvent(eventName: string, success: boolean, metadata?: Record<string, unknown>): void {
	try {
		// Dispatch a custom event that can be captured by event viewers
		const eventDetail = {
			eventName,
			success,
			timestamp: Date.now(),
			metadata: metadata || {}
		};

		const customEvent = new CustomEvent('arda-event-logged', {
			detail: eventDetail
		});

		if (typeof window !== 'undefined') {
			window.dispatchEvent(customEvent);
		}

		if (devMode) {
			console.log('Event logged for viewer', eventDetail);
		}
	} catch (error) {
		if (devMode) {
			console.error('Failed to log event for viewer', error);
		}
	}
}

/**
 * Pushes an event to Google Tag Manager dataLayer (GA4 Format)
 * @param eventName - The event name to send to GTM (GA4 uses event names only)
 * @returns GTMPushResult indicating success/failure
 */
function pushToDataLayer(eventName: string): GTMPushResult {
	try {
		// Initialize dataLayer if it doesn't exist
		(window as { dataLayer?: Record<string, unknown>[] }).dataLayer = 
			(window as { dataLayer?: Record<string, unknown>[] }).dataLayer || [];
		
		// Format the event name according to GA4 requirements
		const formattedEventName = formatCorrection(eventName);
		
		// Build the GTM event object (GA4 simplified format)
		const gtmEvent: GTMEvent = {
			event: "CustomEvent",
			eventLabel: formattedEventName
		};
		
		// Push to dataLayer
		((window as any).dataLayer as Record<string, unknown>[]).push(gtmEvent);
		
		// Log the event for user journey tracking
		logJourneyEvent(formattedEventName);
		
		// Log the event to event viewer
		logRecentEvent(formattedEventName, true, { gtmEvent });
		
		if (devMode) {
			console.log('📊 GTM Event pushed to dataLayer:', gtmEvent);
			if (formattedEventName !== eventName) {
				console.log('ℹ️ Event name was formatted:', { original: eventName, formatted: formattedEventName });
			}
		}
		
		return {
			success: true,
			eventData: gtmEvent
		};
		
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
		
		// Log the failed event to event viewer
		logRecentEvent(eventName, false, { error: errorMessage });
		
		if (devMode) {
			console.error('❌ GTM Event push failed:', errorMessage);
		}
		
		return {
			success: false,
			error: errorMessage
		};
	}
}

/**
 * Check if Google Tag Manager is available
 * @returns boolean indicating if GTM dataLayer is available
 */
function isGTMAvailable(): boolean {
	return typeof window !== 'undefined' && !!(window as { dataLayer?: Record<string, unknown>[] }).dataLayer;
}

// Export functions for use in other modules
export { pushToDataLayer, isGTMAvailable, formatCorrection };
export type { GTMEvent, GTMPushResult };