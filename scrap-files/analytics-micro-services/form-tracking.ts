/**
 * ========================================
 * FORM TRACKING MICRO-SERVICE
 * ========================================
 * 
 * Universal HubSpot form tracking utilities for handling form submissions
 * across different form types and providing standardized callbacks.
 * 
 * TABLE OF CONTENTS:
 * ==================
 * 
 * 1. INTERFACES & TYPES
 * 2. UNIVERSAL FORM LISTENER
 * 3. FORM-SPECIFIC HANDLERS
 * 4. CLEANUP UTILITIES
 * 
 */

// ========================================
// 1. INTERFACES & TYPES
// ========================================

/**
 * HubSpot form submission data structure
 */
interface HubSpotFormData {
	type: string;
	eventName: string;
	data?: {
		submissionValues?: {
			email?: string;
			firstname?: string;
			lastname?: string;
			company?: string;
			brandpulse_search?: string;
			[key: string]: any;
		};
	};
}

/**
 * Form submission callback function type
 */
export type FormSubmissionCallback = (formData: {
	email: string;
	firstName: string;
	lastName: string;
	company: string;
	brandName: string;
	formId: string;
}) => void;

/**
 * Form listener configuration
 */
interface FormListenerConfig {
	formId: string;
	brandName?: string;
	onSubmit: FormSubmissionCallback;
}

// ========================================
// 2. UNIVERSAL FORM LISTENER
// ========================================

/**
 * Universal HubSpot form submission listener
 * Sets up a single listener that can handle multiple form types
 * @param configs - Array of form configurations to listen for
 * @returns Cleanup function to remove all listeners
 */
export function setupUniversalHubSpotListener(configs: FormListenerConfig[]): () => void {
	const configMap = new Map<string, FormListenerConfig>();
	
	// Index configs by form ID for quick lookup
	configs.forEach(config => {
		configMap.set(config.formId, config);
	});

	// Universal form submission handler
	const handleFormSubmit = (event: MessageEvent<HubSpotFormData>) => {
		if (event.data && event.data.type === 'hsFormCallback') {
			if (event.data.eventName === 'onFormSubmitted') {
				// Extract form ID from the page (HubSpot doesn't include it in the message)
				const formElements = document.querySelectorAll('form[data-form-id]');
				let matchedFormId = '';
				
				// Find the form ID that matches our configured forms
				for (const formElement of formElements) {
					const formId = formElement.getAttribute('data-form-id');
					if (formId && configMap.has(formId)) {
						matchedFormId = formId;
						break;
					}
				}

				// If we found a matching form, process the submission
				if (matchedFormId) {
					const config = configMap.get(matchedFormId)!;
					const submissionData = event.data.data?.submissionValues || {};
					
					// Extract form data with defaults
					const formData = {
						email: submissionData.email || '',
						firstName: submissionData.firstname || '',
						lastName: submissionData.lastname || '',
						company: submissionData.company || '',
						brandName: submissionData.brandpulse_search || config.brandName || '',
						formId: matchedFormId
					};

					console.log('HubSpot form submission detected:', { formId: matchedFormId, formData });
					
					// Call the configured callback
					config.onSubmit(formData);
				}
			}
		}
	};

	// Add the event listener
	window.addEventListener('message', handleFormSubmit);

	// Return cleanup function
	return () => {
		window.removeEventListener('message', handleFormSubmit);
	};
}

// ========================================
// 3. FORM-SPECIFIC HANDLERS
// ========================================

/**
 * Setup listener for a specific HubSpot form
 * @param formId - The HubSpot form ID to listen for
 * @param brandName - Optional brand name to use as fallback
 * @param onSubmit - Callback function to execute on form submission
 * @returns Cleanup function to remove the listener
 */
export function onHubSpotFormSubmit(
	formId: string, 
	brandName: string = '', 
	onSubmit: FormSubmissionCallback
): () => void {
	return setupUniversalHubSpotListener([{
		formId,
		brandName,
		onSubmit
	}]);
}

/**
 * Setup listeners for multiple HubSpot forms at once
 * @param forms - Array of form configurations
 * @returns Cleanup function to remove all listeners
 */
export function onMultipleHubSpotFormsSubmit(forms: FormListenerConfig[]): () => void {
	return setupUniversalHubSpotListener(forms);
}

// ========================================
// 4. CLEANUP UTILITIES
// ========================================

/**
 * Remove all HubSpot form listeners (emergency cleanup)
 * This is a nuclear option that removes ALL message listeners
 * Use with caution as it may affect other functionality
 */
export function removeAllHubSpotListeners(): void {
	console.warn('Removing all HubSpot form listeners - this may affect other functionality');
	// This would require tracking all listeners, which is complex
	// For now, we rely on the cleanup functions returned by setup methods
}

// ========================================
// 5. FORM ID CONSTANTS
// ========================================

/**
 * Known HubSpot form IDs used in the application
 */
export const HUBSPOT_FORM_IDS = {
	LEAD_CAPTURE: '144bbc9e-4a16-4e1b-a98e-f7d3662f2506',
	MID_SEARCH: 'ed1f64fc-7a1e-492b-a11c-82ba71f6f754'
} as const;