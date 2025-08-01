/**
 * ========================================
 * ANALYTICS BACKGROUND FUNCTIONS SERVICE
 * ========================================
 * 
 * This service handles specific individual analytics events that run in the background,
 * as opposed to user-triggered click events. These functions are designed for specific
 * triggers and conditions rather than reusable, elegant code patterns.
 * 
 * For reusable analytics functionality, see: ./analytics.service.ts
 * For micro-services and utilities, see: ./analytics-micro-services/
 * 
 * TABLE OF CONTENTS:
 * ==================
 * 
 * 1. HELPER FUNCTIONS
 *    - logUTMDetection()         : Logs UTM parameter detection
 *    - handleGTMEventResult()    : Handles GTM event success/error logging
 *    - logConversionTrigger()    : Logs conversion trigger activation
 * 
 * 2. UTM-TRIGGERED EVENTS
 *    - checkLinkedInAd1()        : Detects LinkedIn ad with utm_content=digital_pulse
 *    - checkLinkedInAd2()        : Detects LinkedIn ad with utm_content=report  
 *    - checkLinkedInAd3()        : Detects LinkedIn ad with utm_content=leaders
 *    - runUTMEventChecks()       : Runs all UTM event checks at once
 * 
 * 3. USER JOURNEY TRACKING
 *    - initializeJourneyTracking(): Sets up journey tracking and conversion triggers
 * 
 * FUNCTION DESCRIPTIONS:
 * ======================
 * 
 * Helper Functions:
 * - Centralize logging patterns to reduce code duplication
 * - Provide consistent error handling and success messaging
 * - Maintain debugging and monitoring capabilities
 * 
 * UTM Event Functions:
 * - Each LinkedIn ad function checks for specific UTM parameter combinations
 * - Sends GTM events with descriptive event names (GA4 format) when conditions are met
 * - Includes console logging for debugging and monitoring
 * 
 * Journey Tracking Functions:
 * - Uses the new simplified UserJourneyTrigger system
 * - Monitors for specific event patterns and triggers conversions
 * - Automatically tracks conversion journeys based on event combinations
 * 
 * NOTE: Form-specific event tracking is now handled directly in component files:
 * - LeadCaptureFormAlt1.tsx handles lead capture form events
 * - MidSearchForm.tsx handles mid-search form events
 * 
 * GA4 EVENT NAMES USED:
 * =====================
 * UTM Landing Events:
 * - linkedin_ad_a_landing              : LinkedIn Ad A landing
 * - linkedin_ad_b_landing              : LinkedIn Ad B landing  
 * - linkedin_ad_c_landing              : LinkedIn Ad C landing
 * 
 * Form Submission Events:
 * - lead_capture_form_submit           : Lead capture form (appointment booking)
 * - midsearch_form_submit              : Mid-search form (contact info collection)
 * 
 * Conversion Events - HOT (Appointment Scheduling):
 * - linkedin_ad_a_conversion_hot       : LinkedIn Ad A hot conversion (appointment)
 * - linkedin_ad_b_conversion_hot       : LinkedIn Ad B hot conversion (appointment)
 * - linkedin_ad_c_conversion_hot       : LinkedIn Ad C hot conversion (appointment)
 * 
 * Conversion Events - WARM (Contact Collection):
 * - linkedin_ad_a_conversion_warm      : LinkedIn Ad A warm conversion (contact info)
 * - linkedin_ad_b_conversion_warm      : LinkedIn Ad B warm conversion (contact info)
 * - linkedin_ad_c_conversion_warm      : LinkedIn Ad C warm conversion (contact info)
 * 
 * Other Events:
 * - progressive_form_conversion        : Multi-step form conversion complete
 * 
 */

import { AnalyticsService } from './analytics.service';
import { 
	UserJourneyTrigger
} from './analytics-micro-services/user-journey-tracking';

// ========================================
// 1. HELPER FUNCTIONS
// ========================================

/**
 * Log UTM parameter detection with consistent formatting
 * @param adName - Human-readable name of the ad campaign (e.g., "LinkedIn Ad 1 (Digital Pulse)")
 * @param adKey - Internal key for the ad (e.g., "linkedin_ad_1") 
 * @param utmData - UTM parameter data object
 */
function logUTMDetection(adName: string, adKey: string, utmData: unknown): void {
	console.log(`🔥 ${adName} UTM detected - sending GTM event`);
	console.log(`utmData for ${adKey}`, utmData);
}

/**
 * Handle GTM event result with consistent success/error logging
 * @param eventDescription - Human-readable description of the event (e.g., "LinkedIn Ad 1")
 * @param result - Result object from AnalyticsService.sendGTMEvent()
 */
function handleGTMEventResult(eventDescription: string, result: { success: boolean; error?: string }): void {
	if (!result.success) {
		console.error(`${eventDescription} GTM event failed:`, result.error);
	} else {
		console.log(`✅ ${eventDescription} GTM event sent successfully`);
	}
}

/**
 * Log conversion trigger activation with consistent formatting
 * @param conversionName - Human-readable name of the conversion (e.g., "Digital Pulse conversion")
 */
function logConversionTrigger(conversionName: string): void {
	console.log(`🚀 ${conversionName} trigger activated`);
}

// ========================================
// 2. UTM-TRIGGERED EVENTS
// ========================================

// --------------------------------------------
// LinkedIn Ad 1: Digital Pulse Campaign
// --------------------------------------------
/**
 * Check for LinkedIn Ad 1 UTM parameters and trigger event
 * Triggers when utm_source=linkedin and utm_content=digital_pulse
 */
export function checkLinkedInAd1(): void {
	const utmData = AnalyticsService.captureUTMParameters();
	
	if (utmData.utm_source === 'linkedin' && utmData.utm_content === 'ad_a') {
		logUTMDetection('LinkedIn Ad 1 (Digital Pulse)', 'linkedin_ad_1', utmData);
		
		const result = AnalyticsService.sendGTMEvent('linkedin_ad_a_landing');
		handleGTMEventResult('LinkedIn Ad 1', result);
	}
}

// --------------------------------------------
// LinkedIn Ad 2: Report Campaign
// --------------------------------------------
/**
 * Check for LinkedIn Ad 2 UTM parameters and trigger event
 * Triggers when utm_source=linkedin and utm_content=report
 */
export function checkLinkedInAd2(): void {
	const utmData = AnalyticsService.captureUTMParameters();
	
	if (utmData.utm_source === 'linkedin' && utmData.utm_content === 'ad_b') {
		logUTMDetection('LinkedIn Ad 2 (Report)', 'linkedin_ad_2', utmData);
		
		const result = AnalyticsService.sendGTMEvent('linkedin_ad_b_landing');
		handleGTMEventResult('LinkedIn Ad 2', result);
	}
}

// --------------------------------------------
// LinkedIn Ad 3: Leaders Campaign
// --------------------------------------------
/**
 * Check for LinkedIn Ad 3 UTM parameters and trigger event
 * Triggers when utm_source=linkedin and utm_content=leaders
 */
export function checkLinkedInAd3(): void {
	const utmData = AnalyticsService.captureUTMParameters();
	
	if (utmData.utm_source === 'linkedin' && utmData.utm_content === 'ad_c') {
		logUTMDetection('LinkedIn Ad 3 (Leaders)', 'linkedin_ad_3', utmData);
		
		const result = AnalyticsService.sendGTMEvent('linkedin_ad_c_landing');
		handleGTMEventResult('LinkedIn Ad 3', result);
	}
}

// --------------------------------------------
// UTM Event Batch Runner
// --------------------------------------------
/**
 * Run all UTM-triggered event checks
 * Call this function to check for all LinkedIn ad UTM parameters
 */
export function runUTMEventChecks(): void {
    console.log('Running UTM event checks');
	checkLinkedInAd1();
	checkLinkedInAd2();
	checkLinkedInAd3();
}

// ========================================
// 3. USER JOURNEY TRACKING
// ========================================

// --------------------------------------------
// Journey Initialization
// --------------------------------------------
/**
 * Initialize journey tracking system and set up conversion triggers
 * This function should be called once during app initialization
 */
export function initializeJourneyTracking(): void {
	console.log('🚀 Initializing journey tracking system...');
	
	// Journey tracking is now automatic via pushToDataLayer integration
	// No need to manually initialize logging
	
	// Set up conversion triggers for different LinkedIn ad campaigns
	setupLinkedInAdTriggers();
	
	console.log('✅ Journey tracking system initialized - ready for events');
}

// --------------------------------------------
// LinkedIn Ad Conversion Triggers
// --------------------------------------------
/**
 * Set up conversion triggers for LinkedIn ad campaigns
 * These triggers will fire when users complete conversion journeys
 * 
 * HOT conversions: Lead capture form (appointment scheduling)
 * WARM conversions: Mid-search form (contact info collection)
 */
function setupLinkedInAdTriggers(): void {
	// ============================================
	// HOT CONVERSIONS - Lead Capture Form
	// ============================================
	
	// LinkedIn Ad A: Hot Conversion (Lead Capture Form)
	UserJourneyTrigger(
		['linkedin_ad_a_landing', 'lead_capture_form_submit'], // Wait for UTM landing + appointment form submission
		() => {
			logConversionTrigger('LinkedIn Ad A hot conversion');
			
			const result = AnalyticsService.sendGTMEvent('linkedin_ad_a_conversion_hot');
			handleGTMEventResult('LinkedIn Ad A hot conversion', result);
		},
		{
			triggerId: 'linkedin_ad_a_conversion_hot',
			requireAllEvents: true,
			onceOnly: true
		}
	);

	// LinkedIn Ad B: Hot Conversion (Lead Capture Form)
	UserJourneyTrigger(
		['linkedin_ad_b_landing', 'lead_capture_form_submit'], // Wait for UTM landing + appointment form submission
		() => {
			logConversionTrigger('LinkedIn Ad B hot conversion');
			
			const result = AnalyticsService.sendGTMEvent('linkedin_ad_b_conversion_hot');
			handleGTMEventResult('LinkedIn Ad B hot conversion', result);
		},
		{
			triggerId: 'linkedin_ad_b_conversion_hot',
			requireAllEvents: true,
			onceOnly: true
		}
	);

	// LinkedIn Ad C: Hot Conversion (Lead Capture Form)
	UserJourneyTrigger(
		['linkedin_ad_c_landing', 'lead_capture_form_submit'], // Wait for UTM landing + appointment form submission
		() => {
			logConversionTrigger('LinkedIn Ad C hot conversion');
			
			const result = AnalyticsService.sendGTMEvent('linkedin_ad_c_conversion_hot');
			handleGTMEventResult('LinkedIn Ad C hot conversion', result);
		},
		{
			triggerId: 'linkedin_ad_c_conversion_hot',
			requireAllEvents: true,
			onceOnly: true
		}
	);

	// ============================================
	// WARM CONVERSIONS - Mid-Search Form
	// ============================================
	
	// LinkedIn Ad A: Warm Conversion (Mid-Search Form)
	UserJourneyTrigger(
		['linkedin_ad_a_landing', 'midsearch_form_submit'], // Wait for UTM landing + mid-search form submission
		() => {
			logConversionTrigger('LinkedIn Ad A warm conversion');
			
			const result = AnalyticsService.sendGTMEvent('linkedin_ad_a_conversion_warm');
			handleGTMEventResult('LinkedIn Ad A warm conversion', result);
		},
		{
			triggerId: 'linkedin_ad_a_conversion_warm',
			requireAllEvents: true,
			onceOnly: true
		}
	);

	// LinkedIn Ad B: Warm Conversion (Mid-Search Form)
	UserJourneyTrigger(
		['linkedin_ad_b_landing', 'midsearch_form_submit'], // Wait for UTM landing + mid-search form submission
		() => {
			logConversionTrigger('LinkedIn Ad B warm conversion');
			
			const result = AnalyticsService.sendGTMEvent('linkedin_ad_b_conversion_warm');
			handleGTMEventResult('LinkedIn Ad B warm conversion', result);
		},
		{
			triggerId: 'linkedin_ad_b_conversion_warm',
			requireAllEvents: true,
			onceOnly: true
		}
	);

	// LinkedIn Ad C: Warm Conversion (Mid-Search Form)
	UserJourneyTrigger(
		['linkedin_ad_c_landing', 'midsearch_form_submit'], // Wait for UTM landing + mid-search form submission
		() => {
			logConversionTrigger('LinkedIn Ad C warm conversion');
			
			const result = AnalyticsService.sendGTMEvent('linkedin_ad_c_conversion_warm');
			handleGTMEventResult('LinkedIn Ad C warm conversion', result);
		},
		{
			triggerId: 'linkedin_ad_c_conversion_warm',
			requireAllEvents: true,
			onceOnly: true
		}
	);

	console.log('📡 LinkedIn ad conversion triggers configured (hot + warm)');
}

/**
 * Debug function to check current journey tracking state
 * Call this function to see what events have been logged and what triggers are active
 */
export function debugJourneyTrackingState(): void {
	console.group('🔍 JOURNEY TRACKING DEBUG STATE');
	
	// Import and call the debug function from user-journey-tracking
	import('./analytics-micro-services/user-journey-tracking').then(({ 
		debugJourneyState, 
		getRecentEvents,
		getActiveTriggers
	}) => {
		console.log('📊 Recent Events:');
		const recentEvents = getRecentEvents(20);
		recentEvents.forEach((event, index) => {
			console.log(`  ${index + 1}. ${event.eventName} (${event.timestamp})`);
		});
		
		console.log('📡 Active Triggers:');
		const activeTriggers = getActiveTriggers();
		activeTriggers.forEach((trigger, index) => {
			console.log(`  ${index + 1}. ${trigger.triggerId}`);
			console.log(`     Events: [${trigger.eventNames.join(', ')}]`);
			console.log(`     Triggered: ${trigger.triggered}`);
			console.log(`     Require all: ${trigger.requireAllEvents}`);
			console.log(`     Once only: ${trigger.onceOnly}`);
		});
		
		// Call the detailed debug function
		debugJourneyState();
		
		console.groupEnd();
	}).catch(error => {
		console.error('Error loading debug functions:', error);
		console.groupEnd();
	});
}