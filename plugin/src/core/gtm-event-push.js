/**
 * ARDA Analytics - GTM Event Push Module
 * Handles pushing events to Google Tag Manager dataLayer
 */

export class GTMEventPush {
	constructor(config = {}) {
		this.config = config;
		this.isInitialized = false;
	}

	/**
	 * Initialize the GTM Event Push module
	 */
	init() {
		// Ensure dataLayer exists
		if (typeof window !== 'undefined') {
			window.dataLayer = window.dataLayer || [];
		}
		
		this.isInitialized = true;
		
		if (this.config.debug) {
			console.log('GTM Event Push module initialized');
		}
	}

	/**
	 * Push event to GTM dataLayer
	 * @param {Object} eventData - Event data containing category, action, label, value
	 */
	pushEvent(eventData) {
		if (!this.isInitialized) {
			console.warn('GTM Event Push module not initialized');
			return;
		}

		try {
			// Extract event data
			const evCat = eventData.category || '';
			const evAct = eventData.action || '';
			const evLab = eventData.label || '';
			const evVal = eventData.value || '';

			// Push to dataLayer in the format expected by GTM
			window.dataLayer.push({
				'event': 'GAEvent',
				'eventCategory': evCat,
				'eventAction': evAct,
				'eventLabel': evLab,
				'eventValue': evVal,
			});

			// Debug logging
			if (this.config.debug) {
				console.log(`GA Event fired - Event Category: [${evCat}], Event Label: [${evLab}], Event Action: [${evAct}]`);
			}

		} catch (error) {
			console.error('GA Event Error:', error);
		}
	}

	/**
	 * Check if module is ready
	 * @returns {boolean} Initialization status
	 */
	isReady() {
		return this.isInitialized;
	}
} 