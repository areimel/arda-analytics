/**
 * ARDA Analytics - Main Orchestrator
 * Handles initialization and coordination of all modules
 */

import { pushToDataLayer, isGTMAvailable } from './core/gtm-event-push.js';
import { EventTriggers } from './core/event-triggers.js';
import { initDebugMode, debugLog } from './core/debug-mode.js';

/**
 * ARDA Analytics Orchestrator Class
 * Central coordinator for all plugin functionality
 */
class ARDAAnalytics {
	constructor(options = {}) {
		// Plugin state
		this.isInitialized = false;
		this.version = '0.1.0';
		this.startTime = Date.now();

		// Default configuration
		this.config = {
			debug: false,
			autoInit: true,
			...options,
		};

		// Initialize debug mode
		initDebugMode(this.config.debug);

		// Initialize core modules
		this.eventTriggers = new EventTriggers();

		// Auto-initialize if configured
		if (this.config.autoInit) {
			this.init();
		}
	}

	/**
	 * Initialize the plugin
	 */
	init() {
		try {
			// Check if GTM is available
			if (!isGTMAvailable()) {
				debugLog('GTM dataLayer not available, initializing it');
			}

			// Initialize Event Triggers
			this.eventTriggers.init();

			// Set up communication between modules
			this.setupModuleCommunication();

			// Mark as initialized
			this.isInitialized = true;

			debugLog(`ARDA Analytics v${this.version} initialized successfully`);
		} catch (error) {
			console.error('ARDA Analytics initialization failed:', error);
		}
	}

	/**
	 * Set up communication between modules
	 */
	setupModuleCommunication() {
		// When event triggers detect a GAEvent, pass it to GTM Event Push
		this.eventTriggers.onGAEvent((eventData) => {
			// Create a meaningful event name from the event data
			const eventName = this.createEventName(eventData);
			
			// Push the event to GTM
			const result = pushToDataLayer(eventName);
			
			if (result.success) {
				debugLog(`Successfully pushed event: ${eventName}`, result.eventData);
			} else {
				debugLog(`Failed to push event: ${eventName}`, result.error);
			}
		});
	}

	/**
	 * Create a meaningful event name from event data
	 * @param {Object} eventData - The event data object
	 * @returns {string} A formatted event name
	 */
	createEventName(eventData) {
		const { type, metadata } = eventData;
		
		switch (type) {
			case 'user_click':
				if (metadata?.tagName === 'A') {
					return 'click_link';
				} else if (metadata?.tagName === 'BUTTON') {
					return 'click_button';
				}
				return 'click_element';
				
			case 'page_view':
				if (metadata?.utmParams && Object.keys(metadata.utmParams).length > 0) {
					return 'page_view_utm';
				}
				return 'page_view';
				
			case 'form_submit':
				return 'form_submit';
				
			case 'form_validation_error':
				return 'form_error';
				
			default:
				return `custom_${type}`;
		}
	}

	/**
	 * Manually push a custom event to GTM
	 * @param {string} eventName - The event name to push
	 * @returns {Object} Result of the push operation
	 */
	pushEvent(eventName) {
		if (!this.isInitialized) {
			console.warn('ARDA Analytics not initialized. Call init() first.');
			return { success: false, error: 'Not initialized' };
		}
		
		return pushToDataLayer(eventName);
	}

	/**
	 * Check if GTM is available
	 * @returns {boolean} GTM availability status
	 */
	isGTMReady() {
		return isGTMAvailable();
	}

	/**
	 * Get plugin version
	 * @returns {string} Version string
	 */
	getVersion() {
		return this.version;
	}

	/**
	 * Check if plugin is initialized
	 * @returns {boolean} Initialization status
	 */
	isReady() {
		return this.isInitialized;
	}

	/**
	 * Get plugin configuration
	 * @returns {Object} Current configuration
	 */
	getConfig() {
		return { ...this.config };
	}

	/**
	 * Update configuration (requires re-initialization)
	 * @param {Object} newConfig - New configuration options
	 */
	updateConfig(newConfig) {
		this.config = { ...this.config, ...newConfig };
		
		// Update debug mode
		initDebugMode(this.config.debug);
		
		debugLog('Configuration updated', this.config);
	}

	/**
	 * Destroy the plugin instance
	 */
	destroy() {
		if (this.eventTriggers) {
			this.eventTriggers.destroy();
		}
		this.isInitialized = false;
		debugLog('ARDA Analytics destroyed');
	}
}

// Export for different module systems
export default ARDAAnalytics;

// For UMD builds and global usage
if (typeof window !== 'undefined') {
	window.ARDAAnalytics = ARDAAnalytics;
}

// For CommonJS
if (typeof module !== 'undefined' && module.exports) {
	module.exports = ARDAAnalytics;
}
