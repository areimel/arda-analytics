/**
 * UserDataService - Centralized service for managing progressive form data
 * 
 * This service handles storing user input data as they progress through the multi-step
 * brand analysis form and provides methods to auto-fill HubSpot form fields.
 */

// Extend Window interface for debugging
declare global {
	interface Window {
		userDataService?: UserDataService;
	}
}

export interface ProgressiveFormData {
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

class UserDataService {
	private static instance: UserDataService;
	private userData: ProgressiveFormData = {};
	private readonly STORAGE_KEY = 'brandpulse_progressive_form_data';
	private autoFilledContainers: Set<string> = new Set(); // Track which containers have been auto-filled
	private mutationObserver: MutationObserver | null = null;

	private constructor() {
		this.loadFromStorage();
		this.setupFormDetection();
	}

	public static getInstance(): UserDataService {
		if (!UserDataService.instance) {
			UserDataService.instance = new UserDataService();
		}
		return UserDataService.instance;
	}

	/**
	 * Store progressive form data
	 */
	public setUserData(data: Partial<ProgressiveFormData>): void {
		this.userData = { ...this.userData, ...data };
		this.saveToStorage();
		console.log('UserDataService: Data updated', this.userData);
	}

	/**
	 * Get current user data
	 */
	public getUserData(): ProgressiveFormData {
		return { ...this.userData };
	}

	/**
	 * Get specific data field
	 */
	public getField<K extends keyof ProgressiveFormData>(field: K): ProgressiveFormData[K] {
		return this.userData[field];
	}

	/**
	 * Update current step and track timing
	 */
	public updateStep(step: number): void {
		const now = new Date();
		
		if (!this.userData.formStartTime) {
			this.userData.formStartTime = now;
		}

		if (!this.userData.stepCompletionTimes) {
			this.userData.stepCompletionTimes = {};
		}

		this.userData.stepCompletionTimes[step] = now;
		this.userData.currentStep = step;
		
		this.saveToStorage();
	}

	/**
	 * Get the brand name to use for HubSpot form population
	 */
	public getBrandNameForForm(): string {
		return this.userData.selectedCompany?.name || this.userData.originalBrandName || '';
	}

	/**
	 * Setup mutation observer to detect new forms
	 */
	private setupFormDetection(): void {
		if (typeof window === 'undefined') return;

		this.mutationObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === 'childList') {
					mutation.addedNodes.forEach((node) => {
						if (node.nodeType === Node.ELEMENT_NODE) {
							const element = node as Element;
							
							// Check if a HubSpot form was added
							const hubspotForm = element.querySelector?.('form[data-form-id]') || 
											(element.matches?.('form[data-form-id]') ? element : null);
							
							if (hubspotForm) {
								// Find the container
								const container = hubspotForm.closest('[id*="hubspot-form-container"]');
								if (container && container.id) {
									console.log('UserDataService: New HubSpot form detected', container.id);
									this.autoFillHubSpotForm(`#${container.id}`, 500);
									this.setupFormDataCapture(`#${container.id}`);
								}
							}
						}
					});
				}
			});
		});

		// Start observing
		this.mutationObserver.observe(document.body, {
			childList: true,
			subtree: true
		});

		console.log('UserDataService: Form detection observer setup complete');
	}

	/**
	 * Setup data capture for HubSpot form fields
	 */
	private setupFormDataCapture(containerSelector: string): void {
		setTimeout(() => {
			try {
				const container = document.querySelector(containerSelector);
				if (!container) {
					console.warn(`UserDataService: Container ${containerSelector} not found for data capture`);
					return;
				}

				// Setup listeners for form fields
				const firstnameField = container.querySelector('input[name="firstname"]') as HTMLInputElement;
				const lastnameField = container.querySelector('input[name="lastname"]') as HTMLInputElement;
				const jobtitleField = container.querySelector('input[name="jobtitle"]') as HTMLInputElement;
				const emailField = container.querySelector('input[name="email"]') as HTMLInputElement;

				if (firstnameField) {
					firstnameField.addEventListener('input', (e) => {
						const value = (e.target as HTMLInputElement).value.trim();
						if (value) {
							this.setUserData({ firstname: value });
							console.log(`UserDataService: Captured firstname: ${value}`);
						}
					});
				}

				if (lastnameField) {
					lastnameField.addEventListener('input', (e) => {
						const value = (e.target as HTMLInputElement).value.trim();
						if (value) {
							this.setUserData({ lastname: value });
							console.log(`UserDataService: Captured lastname: ${value}`);
						}
					});
				}

				if (jobtitleField) {
					jobtitleField.addEventListener('input', (e) => {
						const value = (e.target as HTMLInputElement).value.trim();
						if (value) {
							this.setUserData({ jobtitle: value });
							console.log(`UserDataService: Captured jobtitle: ${value}`);
						}
					});
				}

				if (emailField) {
					emailField.addEventListener('input', (e) => {
						const value = (e.target as HTMLInputElement).value.trim();
						if (value) {
							this.setUserData({ email: value });
							console.log(`UserDataService: Captured email: ${value}`);
						}
					});
				}

				console.log(`UserDataService: Data capture setup complete for ${containerSelector}`);

			} catch (error) {
				console.error('UserDataService: Error during data capture setup', error);
			}
		}, 1000); // Wait for form to be fully rendered
	}

	/**
	 * Simulate proper user input for HubSpot form fields
	 */
	private simulateUserInput(field: HTMLInputElement, value: string): void {
		try {
			// Clear the field first
			field.value = '';
			
			// Simulate focus (user clicks on field)
			field.focus();
			field.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
			
			// Small delay to simulate human typing
			setTimeout(() => {
				// Set the value
				field.value = value;
				
				// Simulate multiple events that HubSpot might be listening for
				field.dispatchEvent(new Event('input', { bubbles: true }));
				field.dispatchEvent(new Event('change', { bubbles: true }));
				field.dispatchEvent(new Event('keyup', { bubbles: true }));
				
				// Additional timing for HubSpot validation
				setTimeout(() => {
					// Simulate blur (user clicks away from field)
					field.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
					
					// Force HubSpot to recognize the field as valid
					if (field.classList.contains('error') || field.classList.contains('invalid')) {
						field.classList.remove('error', 'invalid');
					}
					
					// Add valid class if it exists in HubSpot's styling
					if (!field.classList.contains('valid') && field.value.trim()) {
						field.classList.add('valid');
					}
				}, 100);
			}, 50);
			
		} catch (error) {
			console.error('UserDataService: Error simulating user input', error);
		}
	}

	/**
	 * Auto-fill HubSpot form fields (only once per container)
	 */
	public autoFillHubSpotForm(containerSelector: string, delay: number = 1000): void {
		// Prevent multiple auto-fills for the same container
		if (this.autoFilledContainers.has(containerSelector)) {
			console.log(`UserDataService: Auto-fill already performed for ${containerSelector}`);
			return;
		}

		setTimeout(() => {
			try {
				const container = document.querySelector(containerSelector);
				if (!container) {
					console.warn(`UserDataService: Container ${containerSelector} not found`);
					return;
				}

				let fieldsUpdated = 0;

				// Auto-fill brandpulse_search field
				const brandPulseSearchField = container.querySelector('input[name="brandpulse_search"]') as HTMLInputElement;
				if (brandPulseSearchField && !brandPulseSearchField.value) {
					const brandName = this.getBrandNameForForm();
					if (brandName) {
						brandPulseSearchField.value = brandName;
						console.log(`UserDataService: Auto-filled brandpulse_search with: ${brandName}`);
						
						// Trigger change event to ensure HubSpot recognizes the value
						const changeEvent = new Event('change', { bubbles: true });
						brandPulseSearchField.dispatchEvent(changeEvent);
						fieldsUpdated++;
					}
				}

				// Auto-fill email field if available
				const emailField = container.querySelector('input[name="email"]') as HTMLInputElement;
				if (emailField && !emailField.value) {
					const storedEmail = this.userData.email;
					if (storedEmail) {
						// Use simulateUserInput for visible fields or simple assignment for hidden fields
						if (emailField.type === 'hidden') {
							emailField.value = storedEmail;
							const changeEvent = new Event('change', { bubbles: true });
							emailField.dispatchEvent(changeEvent);
						} else {
							this.simulateUserInput(emailField, storedEmail);
						}
						console.log(`UserDataService: Auto-filled email with: ${storedEmail}`);
						fieldsUpdated++;
					}
				}

				// Auto-fill firstname field if available
				const firstnameField = container.querySelector('input[name="firstname"]') as HTMLInputElement;
				if (firstnameField && !firstnameField.value) {
					const storedFirstname = this.userData.firstname;
					if (storedFirstname) {
						this.simulateUserInput(firstnameField, storedFirstname);
						console.log(`UserDataService: Auto-filled firstname with: ${storedFirstname}`);
						fieldsUpdated++;
					}
				}

				// Auto-fill lastname field if available
				const lastnameField = container.querySelector('input[name="lastname"]') as HTMLInputElement;
				if (lastnameField && !lastnameField.value) {
					const storedLastname = this.userData.lastname;
					if (storedLastname) {
						this.simulateUserInput(lastnameField, storedLastname);
						console.log(`UserDataService: Auto-filled lastname with: ${storedLastname}`);
						fieldsUpdated++;
					}
				}

				// Auto-fill jobtitle field if available
				const jobtitleField = container.querySelector('input[name="jobtitle"]') as HTMLInputElement;
				if (jobtitleField && !jobtitleField.value) {
					const storedJobtitle = this.userData.jobtitle;
					if (storedJobtitle) {
						this.simulateUserInput(jobtitleField, storedJobtitle);
						console.log(`UserDataService: Auto-filled jobtitle with: ${storedJobtitle}`);
						fieldsUpdated++;
					}
				}

				// Mark this container as auto-filled
				this.autoFilledContainers.add(containerSelector);

				console.log(`UserDataService: Auto-fill completed for ${containerSelector}`, {
					brandName: this.getBrandNameForForm(),
					email: this.userData.email,
					firstname: this.userData.firstname,
					lastname: this.userData.lastname,
					jobtitle: this.userData.jobtitle,
					fieldsUpdated
				});

			} catch (error) {
				console.error('UserDataService: Error during auto-fill', error);
			}
		}, delay);
	}

	/**
	 * Reset auto-fill tracking for a specific container (useful for testing)
	 */
	public resetAutoFillTracking(containerSelector?: string): void {
		if (containerSelector) {
			this.autoFilledContainers.delete(containerSelector);
			console.log(`UserDataService: Reset auto-fill tracking for ${containerSelector}`);
		} else {
			this.autoFilledContainers.clear();
			console.log('UserDataService: Reset all auto-fill tracking');
		}
	}

	/**
	 * Clear all stored data
	 */
	public clearData(): void {
		this.userData = {};
		this.autoFilledContainers.clear(); // Also clear auto-fill tracking
		this.removeFromStorage();
		console.log('UserDataService: Data cleared');
	}

	/**
	 * Get form analytics data
	 */
	public getAnalyticsData(): Record<string, unknown> {
		const data = this.getUserData();
		return {
			brand_name: this.getBrandNameForForm(),
			original_brand_name: data.originalBrandName,
			selected_company_domain: data.selectedCompany?.domain,
			email_domain: data.email?.split('@')[1],
			firstname: data.firstname,
			lastname: data.lastname,
			jobtitle: data.jobtitle,
			current_step: data.currentStep,
			form_start_time: data.formStartTime?.toISOString(),
			step_completion_times: data.stepCompletionTimes ? 
				Object.entries(data.stepCompletionTimes).reduce((acc, [step, time]) => {
					acc[`step_${step}_completed_at`] = time.toISOString();
					return acc;
				}, {} as Record<string, string>) : {}
		};
	}

	/**
	 * Cleanup method
	 */
	public destroy(): void {
		if (this.mutationObserver) {
			this.mutationObserver.disconnect();
			this.mutationObserver = null;
		}
		this.autoFilledContainers.clear();
		console.log('UserDataService: Cleanup completed');
	}

	/**
	 * Save data to localStorage for persistence across page reloads
	 */
	private saveToStorage(): void {
		try {
			localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.userData));
		} catch (error) {
			console.warn('UserDataService: Failed to save to localStorage', error);
		}
	}

	/**
	 * Load data from localStorage
	 */
	private loadFromStorage(): void {
		try {
			const stored = localStorage.getItem(this.STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored);
				
				// Convert date strings back to Date objects
				if (parsed.formStartTime) {
					parsed.formStartTime = new Date(parsed.formStartTime);
				}
				if (parsed.stepCompletionTimes) {
					Object.keys(parsed.stepCompletionTimes).forEach(key => {
						parsed.stepCompletionTimes[key] = new Date(parsed.stepCompletionTimes[key]);
					});
				}
				
				this.userData = parsed;
				console.log('UserDataService: Data loaded from storage', this.userData);
			}
		} catch (error) {
			console.warn('UserDataService: Failed to load from localStorage', error);
		}
	}

	/**
	 * Remove data from localStorage
	 */
	private removeFromStorage(): void {
		try {
			localStorage.removeItem(this.STORAGE_KEY);
		} catch (error) {
			console.warn('UserDataService: Failed to remove from localStorage', error);
		}
	}

	/**
	 * Manual trigger for auto-fill (useful for testing)
	 */
	public manualTriggerAutoFill(containerSelector: string): void {
		console.log('🔧 Manual auto-fill trigger for:', containerSelector);
		
		// Reset auto-fill tracking for this container to allow re-triggering
		this.resetAutoFillTracking(containerSelector);
		
		// Trigger auto-fill with shorter delay
		this.autoFillHubSpotForm(containerSelector, 500);
		
		// Debug after a moment
		setTimeout(() => {
			this.debugAutoFill(containerSelector);
		}, 1000);
	}

	/**
	 * Debug method to check current data and auto-fill status
	 */
	public debugAutoFill(containerSelector: string): void {
		console.log('🔍 UserDataService Debug Info:', {
			currentData: this.userData,
			autoFilledContainers: Array.from(this.autoFilledContainers),
			containerSelector
		});

		const container = document.querySelector(containerSelector);
		if (container) {
			const fields = {
				firstname: container.querySelector('input[name="firstname"]') as HTMLInputElement,
				lastname: container.querySelector('input[name="lastname"]') as HTMLInputElement,
				email: container.querySelector('input[name="email"]') as HTMLInputElement,
				jobtitle: container.querySelector('input[name="jobtitle"]') as HTMLInputElement,
				brandpulse_search: container.querySelector('input[name="brandpulse_search"]') as HTMLInputElement
			};

			console.log('🔍 Form Fields Status:', Object.entries(fields).map(([name, field]) => ({
				name,
				exists: !!field,
				value: field?.value || '',
				type: field?.type || 'N/A',
				visible: field ? !field.hidden && field.type !== 'hidden' : false
			})));
		} else {
			console.log('❌ Container not found:', containerSelector);
		}
	}
}

// Export singleton instance
export const userDataService = UserDataService.getInstance();
export default userDataService;

// Expose to window for debugging in development
if (typeof window !== 'undefined') {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(window as any).userDataService = userDataService;
	console.log('🔧 UserDataService exposed to window.userDataService for debugging');
} 