/**
 * ARDA Analytics - Main Orchestrator
 * Handles initialization and coordination of all modules
 */

import { GTMEventPush } from './core/gtm-event-push.js';
import { EventTriggers } from './core/event-triggers.js';

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

		// Initialize core modules
		this.gtmEventPush = new GTMEventPush(this.config);
		this.eventTriggers = new EventTriggers(this.config);

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
			// Initialize GTM Event Push system
			this.gtmEventPush.init();

			// Initialize Event Triggers
			this.eventTriggers.init();

			// Set up communication between modules
			this.setupModuleCommunication();

			// Mark as initialized
			this.isInitialized = true;

			if (this.config.debug) {
				console.log(`ARDA Analytics v${this.version} initialized successfully`);
			}
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
			this.gtmEventPush.pushEvent(eventData);
		});
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
	 * Destroy the plugin instance
	 */
	destroy() {
		if (this.eventTriggers) {
			this.eventTriggers.destroy();
		}
		this.isInitialized = false;
		if (this.config.debug) {
			console.log('ARDA Analytics destroyed');
		}
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
