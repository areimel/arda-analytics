import { GetUTMs } from './utm-tracking';

// Development mode flag
const devMode = false;

interface UTMFormField {
	name: string;
	value: string;
}

interface UTMFormConfig {
	hideFields?: boolean;
	fieldClass?: string;
	containerClass?: string;
}

/**
 * Default configuration for UTM form fields
 */
const defaultConfig: UTMFormConfig = {
	hideFields: true,
	fieldClass: 'utm-field',
	containerClass: 'utm-field-container'
};

/**
 * Detects if a form already has UTM fields present
 * @param form - The form element to check
 * @returns boolean indicating if UTM fields are already present
 */
function fieldDetection(form: HTMLFormElement): boolean {
	const utmFieldNames = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
	
	// Check if any UTM fields already exist in the form
	for (const fieldName of utmFieldNames) {
		const existingField = form.querySelector(`input[name="${fieldName}"]`);
		if (existingField) {
			if (devMode) {
				console.log(`🔍 UTM field "${fieldName}" already exists in form`);
			}
			return true;
		}
	}
	
	if (devMode) {
		console.log('🔍 No existing UTM fields detected in form');
	}
	
	return false;
}

/**
 * Adds UTM fields to a form if they don't already exist
 * @param form - The form element to add fields to
 * @param config - Configuration options for the fields
 * @returns boolean indicating if fields were added
 */
function fieldAdd(form: HTMLFormElement, config: UTMFormConfig = defaultConfig): boolean {
	// Check if fields already exist
	if (fieldDetection(form)) {
		if (devMode) {
			console.log('⚠️ UTM fields already exist, skipping addition');
		}
		return false;
	}
	
	// Get current UTM data
	const utmData = GetUTMs();
	
	// Create container for UTM fields
	const container = document.createElement('div');
	container.className = config.containerClass || 'utm-field-container';
	
	// Apply styling to hide fields if requested
	if (config.hideFields) {
		container.style.cssText = `
			visibility: hidden;
			position: absolute;
			width: 0px;
			height: 0px;
			overflow: hidden;
			pointer-events: none;
		`;
	}
	
	// Define UTM fields to create
	const utmFields: UTMFormField[] = [
		{ name: 'utm_source', value: utmData.utm_source },
		{ name: 'utm_medium', value: utmData.utm_medium },
		{ name: 'utm_campaign', value: utmData.utm_campaign },
		{ name: 'utm_term', value: utmData.utm_term },
		{ name: 'utm_content', value: utmData.utm_content }
	];
	
	// Create and append input fields
	utmFields.forEach(field => {
		const input = document.createElement('input');
		input.type = 'hidden';
		input.name = field.name;
		input.value = field.value || '';
		input.className = config.fieldClass || 'utm-field';
		
		container.appendChild(input);
		
		if (devMode) {
			console.log(`✅ Added UTM field: ${field.name} = "${field.value}"`);
		}
	});
	
	// Add container to form
	form.insertBefore(container, form.firstChild);
	
	if (devMode) {
		console.log('✅ UTM field container added to form');
	}
	
	return true;
}

/**
 * Processes all forms on the page and adds UTM fields where needed
 * @param config - Configuration options for the fields
 * @returns number of forms that had UTM fields added
 */
function processAllForms(config: UTMFormConfig = defaultConfig): number {
	const forms = document.querySelectorAll('form');
	let formsProcessed = 0;
	
	forms.forEach((form, index) => {
		if (form instanceof HTMLFormElement) {
			const wasAdded = fieldAdd(form, config);
			if (wasAdded) {
				formsProcessed++;
			}
			
			if (devMode) {
				console.log(`📝 Processed form ${index + 1}/${forms.length}`);
			}
		}
	});
	
	if (devMode) {
		console.log(`🎯 Processed ${forms.length} forms, added UTM fields to ${formsProcessed} forms`);
	}
	
	return formsProcessed;
}

/**
 * Updates UTM field values in existing forms with current UTM data
 * @returns number of forms updated
 */
function updateFormValues(): number {
	const utmData = GetUTMs();
	const forms = document.querySelectorAll('form');
	let formsUpdated = 0;
	
	forms.forEach(form => {
		if (form instanceof HTMLFormElement && fieldDetection(form)) {
			// Update existing UTM fields with current values
			const utmFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
			
			utmFields.forEach(fieldName => {
				const input = form.querySelector(`input[name="${fieldName}"]`) as HTMLInputElement;
				if (input) {
					const newValue = utmData[fieldName as keyof typeof utmData] || '';
					input.value = String(newValue);
					
					if (devMode) {
						console.log(`🔄 Updated ${fieldName} = "${newValue}" in form`);
					}
				}
			});
			
			formsUpdated++;
		}
	});
	
	if (devMode) {
		console.log(`🔄 Updated UTM values in ${formsUpdated} forms`);
	}
	
	return formsUpdated;
}

// Export functions for use in other modules
export { fieldDetection, fieldAdd, processAllForms, updateFormValues };
export type { UTMFormField, UTMFormConfig };