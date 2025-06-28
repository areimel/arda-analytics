import { getDebugMode, debugLog, debugError } from './debug-mode.js';

// Extend the Window interface to include dataLayer
declare global {
	interface Window {
		dataLayer?: Record<string, unknown>[];
	}
}

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
 * Log recent event for the live event viewer
 * @param eventName - The event name
 * @param success - Whether the event was successful
 * @param metadata - Additional event metadata
 */
function logRecentEvent(eventName: string, success: boolean, metadata?: Record<string, unknown>): void {
	try {
		// Dispatch a custom event that the website can listen to
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

		if (getDebugMode()) {
			debugLog('Event logged for viewer', eventDetail);
		}
	} catch (error) {
		if (getDebugMode()) {
			debugError('Failed to log event for viewer', error);
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
		window.dataLayer = window.dataLayer || [];
		
		// Build the GTM event object (GA4 simplified format)
		const gtmEvent: GTMEvent = {
			event: "CustomEvent",
			eventLabel: eventName
		};
		
		// Push to dataLayer
		window.dataLayer.push(gtmEvent);
		
		// Log the event to the Event Viewer component
		logRecentEvent(eventName, true, { gtmEvent });
		
		if (getDebugMode()) {
			debugLog('GTM Event pushed to dataLayer', gtmEvent);
		}
		
		return {
			success: true,
			eventData: gtmEvent
		};
		
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
		
		// Log the failed event to the Event Viewer component
		logRecentEvent(eventName, false, { error: errorMessage });
		
		if (getDebugMode()) {
			debugError('GTM Event push failed', errorMessage);
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
	return typeof window !== 'undefined' && !!window.dataLayer;
}

// Export functions for use in other modules
export { pushToDataLayer, isGTMAvailable, logRecentEvent };
export type { GTMEvent, GTMPushResult };