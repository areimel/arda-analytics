/**
 * Event Triggers for ARDA Analytics
 * Handles detection and triggering of various user interaction events
 */

import { debugLog } from './debug-mode.js';

// Event handler types
type EventHandler = (eventData: EventData) => void;

// Event data interface
interface EventData {
	type: string;
	element?: HTMLElement;
	url?: string;
	timestamp: number;
	metadata?: Record<string, unknown>;
}

// UTM parameter interface
interface UTMParams {
	utm_source?: string;
	utm_medium?: string;
	utm_campaign?: string;
	utm_term?: string;
	utm_content?: string;
}

/**
 * Event Triggers Manager Class
 * Manages all event detection and triggering functionality
 */
export class EventTriggers {
	private eventHandlers: Map<string, EventHandler[]> = new Map();
	private isInitialized = false;
	
	constructor() {}

	/**
	 * Initialize all event listeners
	 */
	init(): void {
		if (this.isInitialized) {
			return;
		}

		this.setupClickEventListeners();
		this.setupNavigationEventListeners();
		this.setupFormEventListeners();
		
		this.isInitialized = true;
		debugLog('Event Triggers initialized');
	}

	/**
	 * Register an event handler for a specific event type
	 * @param eventType - The type of event to listen for
	 * @param handler - The handler function to call
	 */
	on(eventType: string, handler: EventHandler): void {
		if (!this.eventHandlers.has(eventType)) {
			this.eventHandlers.set(eventType, []);
		}
		this.eventHandlers.get(eventType)!.push(handler);
	}

	/**
	 * Convenience method for GA event handlers
	 * @param handler - Handler for GA events
	 */
	onGAEvent(handler: EventHandler): void {
		this.on('ga_event', handler);
	}

	/**
	 * Trigger an event to all registered handlers
	 * @param eventType - The type of event to trigger
	 * @param eventData - The event data to pass to handlers
	 */
	private trigger(eventType: string, eventData: EventData): void {
		const handlers = this.eventHandlers.get(eventType) || [];
		handlers.forEach(handler => {
			try {
				handler(eventData);
			} catch (error) {
				debugLog(`Error in event handler for ${eventType}`, error);
			}
		});
	}

	/**
	 * Set up click event listeners
	 * Handles both regular click events and inline onClick events
	 */
	private setupClickEventListeners(): void {
		// Global click listener
		document.addEventListener('click', (event) => {
			const target = event.target as HTMLElement;
			if (!target) return;

			const eventData: EventData = {
				type: 'click',
				element: target,
				timestamp: Date.now(),
				metadata: {
					tagName: target.tagName,
					className: target.className,
					id: target.id,
					text: target.textContent?.trim() || '',
				}
			};

			// Special handling for different element types
			if (target.tagName === 'A') {
				eventData.metadata!.href = (target as HTMLAnchorElement).href;
			} else if (target.tagName === 'BUTTON') {
				eventData.metadata!.buttonType = (target as HTMLButtonElement).type;
			}

			this.trigger('click', eventData);
			this.trigger('ga_event', { ...eventData, type: 'user_click' });
			
			debugLog('Click event detected', eventData);
		});
	}

	/**
	 * Set up navigation event listeners
	 * Handles page views, URL parameters, and UTM parameters
	 */
	private setupNavigationEventListeners(): void {
		// Page load event
		const handlePageLoad = () => {
			const url = window.location.href;
			const urlParams = new URLSearchParams(window.location.search);
			const utmParams = this.getUTMParams(urlParams);
			
			const eventData: EventData = {
				type: 'page_view',
				url: url,
				timestamp: Date.now(),
				metadata: {
					path: window.location.pathname,
					search: window.location.search,
					hashtag: window.location.hash,
					title: document.title,
					referrer: document.referrer,
					utmParams: utmParams,
					urlParams: Object.fromEntries(urlParams.entries())
				}
			};

			this.trigger('page_view', eventData);
			this.trigger('ga_event', { ...eventData, type: 'page_view' });
			
			debugLog('Page view event detected', eventData);
		};

		// Initial page load
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', handlePageLoad);
		} else {
			handlePageLoad();
		}

		// Handle browser navigation (back/forward buttons)
		window.addEventListener('popstate', () => {
			handlePageLoad();
		});
	}

	/**
	 * Set up form event listeners
	 * Handles form submission, validation errors, and submit errors
	 */
	private setupFormEventListeners(): void {
		// Form submission events
		document.addEventListener('submit', (event) => {
			const form = event.target as HTMLFormElement;
			if (!form) return;

			const eventData: EventData = {
				type: 'form_submit',
				element: form,
				timestamp: Date.now(),
				metadata: {
					formId: form.id,
					formName: form.name,
					action: form.action,
					method: form.method,
					formData: this.getFormData(form)
				}
			};

			this.trigger('form_submit', eventData);
			this.trigger('ga_event', { ...eventData, type: 'form_submit' });
			
			debugLog('Form submit event detected', eventData);
		});

		// Form validation errors (using HTML5 validation)
		document.addEventListener('invalid', (event) => {
			const element = event.target as HTMLInputElement;
			if (!element) return;

			const eventData: EventData = {
				type: 'form_validation_error',
				element: element,
				timestamp: Date.now(),
				metadata: {
					fieldName: element.name,
					fieldType: element.type,
					validationMessage: element.validationMessage,
					formId: element.form?.id || '',
				}
			};

			this.trigger('form_validation_error', eventData);
			this.trigger('ga_event', { ...eventData, type: 'form_validation_error' });
			
			debugLog('Form validation error detected', eventData);
		}, true); // Use capture phase to catch validation events
	}

	/**
	 * Extract UTM parameters from URL search params
	 * @param urlParams - URLSearchParams object
	 * @returns UTM parameters object
	 */
	private getUTMParams(urlParams: URLSearchParams): UTMParams {
		return {
			utm_source: urlParams.get('utm_source') || undefined,
			utm_medium: urlParams.get('utm_medium') || undefined,
			utm_campaign: urlParams.get('utm_campaign') || undefined,
			utm_term: urlParams.get('utm_term') || undefined,
			utm_content: urlParams.get('utm_content') || undefined,
		};
	}

	/**
	 * Get form data as key-value pairs (excluding sensitive fields)
	 * @param form - The form element
	 * @returns Form data object
	 */
	private getFormData(form: HTMLFormElement): Record<string, string> {
		const data: Record<string, string> = {};
		
		// Sensitive field patterns to exclude
		const sensitivePatterns = [
			/password/i,
			/ssn/i,
			/credit/i,
			/card/i,
			/cvv/i,
			/security/i
		];

		// Use form.elements to iterate through form fields
		const elements = form.elements;
		for (let i = 0; i < elements.length; i++) {
			const element = elements[i] as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
			
			if (element.name && element.value) {
				// Skip sensitive fields
				const isSensitive = sensitivePatterns.some(pattern => pattern.test(element.name));
				if (!isSensitive) {
					data[element.name] = element.value;
				}
			}
		}

		return data;
	}

	/**
	 * Destroy all event listeners
	 */
	destroy(): void {
		// Note: In a real implementation, you'd want to store references to
		// the actual listener functions to properly remove them
		this.eventHandlers.clear();
		this.isInitialized = false;
		debugLog('Event Triggers destroyed');
	}
}

// Export types for use in other modules
export type { EventData, EventHandler, UTMParams };
