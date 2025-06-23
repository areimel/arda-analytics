/**
 * ARDA Analytics - Event Triggers Module
 * Handles detecting and processing click events on tagged elements
 */

export class EventTriggers {
	constructor(config = {}) {
		this.config = config;
		this.isInitialized = false;
		this.gaEventCallback = null;
		this.clickHandler = null;
	}

	/**
	 * Initialize the Event Triggers module
	 */
	init() {
		this.setupClickEventListener();
		this.isInitialized = true;
		
		if (this.config.debug) {
			console.log('Event Triggers module initialized');
		}
	}

	/**
	 * Set up click event listener for GAEvent elements
	 */
	setupClickEventListener() {
		// Create the click handler function
		this.clickHandler = (event) => {
			// Check if the clicked element or any parent has data-event='GAEvent'
			const targetElement = this.findGAEventElement(event.target);
			
			if (targetElement) {
				this.handleGAEventClick(targetElement);
			}
		};

		// Add the event listener to document
		if (typeof document !== 'undefined') {
			document.addEventListener('click', this.clickHandler, true);
		}
	}

	/**
	 * Find the element with data-event='GAEvent' (checks target and parents)
	 * @param {Element} element - Starting element
	 * @returns {Element|null} Element with GAEvent data attribute or null
	 */
	findGAEventElement(element) {
		// Check up to 5 levels up the DOM tree
		let currentElement = element;
		let levels = 0;
		
		while (currentElement && levels < 5) {
			if (currentElement.getAttribute && currentElement.getAttribute('data-event') === 'GAEvent') {
				return currentElement;
			}
			currentElement = currentElement.parentElement;
			levels++;
		}
		
		return null;
	}

	/**
	 * Handle click on GAEvent element
	 * @param {Element} element - Element that was clicked
	 */
	handleGAEventClick(element) {
		try {
			// Extract data attributes (matching the original jQuery version)
			const eventData = {
				category: element.getAttribute('data-category') || '',
				action: element.getAttribute('data-action') || '',
				label: element.getAttribute('data-label') || '',
				value: element.getAttribute('data-value') || '',
			};

			// Debug logging
			if (this.config.debug) {
				console.log('GAEvent click detected:', eventData);
			}

			// Trigger the callback if set
			if (this.gaEventCallback) {
				this.gaEventCallback(eventData);
			}

		} catch (error) {
			console.error('Error processing GAEvent click:', error);
		}
	}

	/**
	 * Set callback for when GAEvent is detected
	 * @param {Function} callback - Callback function to call with event data
	 */
	onGAEvent(callback) {
		this.gaEventCallback = callback;
	}

	/**
	 * Check if module is ready
	 * @returns {boolean} Initialization status
	 */
	isReady() {
		return this.isInitialized;
	}

	/**
	 * Destroy the event listeners
	 */
	destroy() {
		if (this.clickHandler && typeof document !== 'undefined') {
			document.removeEventListener('click', this.clickHandler, true);
		}
		this.isInitialized = false;
		
		if (this.config.debug) {
			console.log('Event Triggers module destroyed');
		}
	}
}