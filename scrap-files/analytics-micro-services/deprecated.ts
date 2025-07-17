/**
 * ========================================
 * DEPRECATED ANALYTICS FUNCTIONS
 * ========================================
 * 
 * This file contains deprecated analytics functions that are no longer used
 * in the current implementation. These functions were used for manual form
 * handling before we switched to HubSpot embedded forms exclusively.
 * 
 * These functions are kept here for reference but should not be used in new code.
 * 
 * NOTE: These functions use the OLD GTM event format (with eventData objects)
 * which is incompatible with GA4. All new code should use the simplified
 * GA4 format: AnalyticsService.sendGTMEvent('event_name')
 * 
 */

import { AnalyticsService } from '../analytics.service';

// ========================================
// DEPRECATED MANUAL FORM HANDLERS
// ========================================

// --------------------------------------------
// Manual Lead Capture Handler (DEPRECATED)
// --------------------------------------------
/**
 * @deprecated This function is deprecated. Use HubSpot embedded forms instead.
 * Handle lead capture form submission event for manual forms
 * @param brandName - The brand name from the form
 * @param email - The email address from the form
 * @param onLeadSubmitted - Callback function to execute after event is sent
 * 
 * WARNING: This function uses the OLD GTM event format that is incompatible with GA4.
 * Do not use this function as a reference for new analytics implementations.
 */
export function handleLeadCaptureSubmit(brandName: string, email: string, onLeadSubmitted: () => void): void {
	console.warn('handleLeadCaptureSubmit is deprecated. Use HubSpot embedded forms instead.');
	console.warn('This function uses OLD GTM format incompatible with GA4. Do not copy this code.');
	console.log('Lead capture form submitted', { brandName, email });
	
	// Send GTM event using the analytics service (OLD FORMAT - DO NOT COPY)
	// @ts-ignore - Deprecated code using old GTM format - kept for reference only
	AnalyticsService.sendGTMEvent({
		action: 'form_submit',
		category: 'lead_capture',
		label: 'brand_analysis_form',
		value: 1,
		customParameters: {
			brand_name: brandName,
			email: email
		}
	}, 'GAEvent');

	// Fire journey event for form submission
	const utmData = AnalyticsService.captureUTMParameters();
	if (utmData.utm_source === 'linkedin') {
		// Also trigger the general form submission event for journey triggers
		if (utmData.utm_content === 'digital_pulse' || utmData.utm_content === 'report' || utmData.utm_content === 'leaders') {
			console.log('🔥 Firing form_submission event for journey triggers');
			// Note: We'll need to update the trigger system to handle this properly
		}
	}

	// Call the callback with a small delay to ensure form processing
	setTimeout(() => {
		onLeadSubmitted();
	}, 500);
}

// --------------------------------------------
// Manual Lead Capture with Journey (DEPRECATED)
// --------------------------------------------
/**
 * @deprecated This function is deprecated. Use HubSpot embedded forms instead.
 * Enhanced lead capture form submission handler with journey tracking
 * @param brandName - The brand name from the form
 * @param email - The email address from the form
 * @param onLeadSubmitted - Callback function to execute after event is sent
 */
export function handleLeadCaptureSubmitWithJourney(brandName: string, email: string, onLeadSubmitted: () => void): void {
	console.warn('handleLeadCaptureSubmitWithJourney is deprecated. Use HubSpot embedded forms instead.');
	console.log('Lead capture form submitted with journey tracking', { brandName, email });
	
	// Note: Journey tracking is now handled directly in components
	// markFormSubmitStep function has been removed
	
	// Handle the regular form submission
	handleLeadCaptureSubmit(brandName, email, onLeadSubmitted);
}

// --------------------------------------------
// Legacy HubSpot Form Listener (DEPRECATED)
// --------------------------------------------
/**
 * @deprecated Use setupLeadCaptureFormListener or setupMidSearchFormListener instead
 * Legacy HubSpot form submission listener - maintained for backward compatibility
 */
export function setupHubSpotFormListener(brandName: string, onLeadSubmitted: () => void): () => void {
	console.warn('setupHubSpotFormListener is deprecated. Use setupLeadCaptureFormListener or setupMidSearchFormListener instead.');
	// This would need to import the new function, but since it's deprecated, we'll just return an empty cleanup function
	return () => {};
} 