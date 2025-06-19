/**
 * ARDA Analytics - Main Orchestrator
 * Handles initialization and coordination of all modules
 */

import { ConfigManager } from './core/config.js';
import { EventManager } from './core/events.js';
import { StorageManager } from './core/storage.js';
import { APIManager } from './core/api.js';
import { DOMUtils } from './utils/dom.js';
import { ValidationUtils } from './utils/validation.js';
import { HelperUtils } from './utils/helpers.js';
import { BrowserSupport } from './utils/browser-support.js';

/**
 * ARDA Analytics Orchestrator Class
 * Central coordinator for all plugin functionality
 */
class ARDAAnalytics {
	constructor(options = {}) {
		try {
			// Check browser support first
			this.browserSupport = new BrowserSupport();

			// Apply fallbacks for unsupported browsers
			this.browserSupport.applyFallbacks();

			// Check if browser is minimally supported
			if (!this.browserSupport.isSupported) {
				console.warn(
					'ARDA Analytics: Browser not fully supported, some features may be disabled',
				);

				// Use degraded mode for unsupported browsers
				if (this.browserSupport.shouldDegrade()) {
					return this.initDegradedMode(options);
				}
			}

			// Initialize core managers
			this.config = new ConfigManager(options);
			this.events = new EventManager();
			this.storage = new StorageManager(this.config);
			this.api = new APIManager(this.config);

			// Initialize utilities
			this.dom = new DOMUtils();
			this.validation = new ValidationUtils();
			this.helpers = new HelperUtils();

			// Plugin state
			this.isInitialized = false;
			this.isDegraded = false;
			this.version = '0.1.0';
			this.startTime = Date.now();

			// Initialize the plugin
			this.init();
		} catch (error) {
			console.error('ARDA Analytics constructor failed:', error);

			// Fallback to degraded mode on initialization error
			return this.initDegradedMode(options);
		}
	}

	/**
	 * Initialize degraded mode for unsupported browsers
	 */
	initDegradedMode(options = {}) {
		console.log('ARDA Analytics: Running in degraded mode');

		this.isDegraded = true;
		this.isInitialized = true;
		this.version = '0.1.0';
		this.config = {
			autoTrack: { pageViews: false },
			storage: { enabled: false },
		};

		// Provide minimal functionality
		this.track = (eventName, properties) => {
			console.log('ARDA Analytics (degraded):', eventName, properties);
		};

		this.getVersion = () => this.version;
		this.isReady = () => this.isInitialized;
		this.destroy = () => {};

		return this;
	}

	/**
	 * Initialize the plugin
	 */
	init() {
		try {
			// Check if Do Not Track is enabled
			if (this.config.isDNTEnabled()) {
				console.log(
					'ARDA Analytics: Do Not Track detected, analytics disabled',
				);
				return;
			}

			// Apply browser-specific configurations
			this.applyBrowserSpecificConfig();

			// Set up event listeners for internal communication
			this.setupInternalEvents();

			// Set up automatic tracking
			this.setupAutoTracking();

			// Mark as initialized
			this.isInitialized = true;

			// Emit initialization event
			this.events.emit('init', {
				timestamp: Date.now(),
				version: this.version,
				config: this.config.getAll(),
				browserSupport: this.browserSupport.features,
			});

			// Log browser support info in debug mode
			if (this.config.get('debug.enabled', false)) {
				this.browserSupport.logSupportInfo();
			}

			console.log(
				`ARDA Analytics v${this.version} initialized successfully`,
			);
		} catch (error) {
			console.error('ARDA Analytics initialization failed:', error);

			// Try to continue with degraded functionality
			this.handleInitializationError(error);
		}
	}

	/**
	 * Apply browser-specific configuration adjustments
	 */
	applyBrowserSpecificConfig() {
		// Disable storage if not available
		if (
			!this.browserSupport.features.localStorage &&
			!this.browserSupport.features.sessionStorage
		) {
			this.config.set('storage.enabled', false);
			console.warn(
				'ARDA Analytics: Storage disabled due to browser limitations',
			);
		}

		// Use memory storage as fallback
		if (
			!this.browserSupport.features.localStorage &&
			this.browserSupport.features.sessionStorage
		) {
			this.config.set('storage.type', 'sessionStorage');
		} else if (
			!this.browserSupport.features.localStorage &&
			!this.browserSupport.features.sessionStorage
		) {
			this.config.set('storage.type', 'memory');
		}

		// Disable API if fetch is not available and no polyfill was applied
		if (!this.browserSupport.features.fetch && !window.fetch) {
			this.config.set('api.enabled', false);
			console.warn(
				'ARDA Analytics: API disabled due to lack of fetch support',
			);
		}
	}

	/**
	 * Handle initialization errors gracefully
	 */
	handleInitializationError(error) {
		try {
			// Emit error event if possible
			if (this.events) {
				this.events.emit('error', {
					type: 'initialization_error',
					error: error.message,
					timestamp: Date.now(),
				});
			}

			// Set to degraded mode
			this.isDegraded = true;
			this.isInitialized = true;

			console.log(
				'ARDA Analytics: Continuing in degraded mode after initialization error',
			);
		} catch (secondaryError) {
			console.error(
				'ARDA Analytics: Complete initialization failure:',
				secondaryError,
			);
		}
	}

	/**
	 * Set up internal event listeners
	 */
	setupInternalEvents() {
		// Listen for track events to handle storage and API
		this.events.on('track', eventData => {
			this.handleTrackEvent(eventData);
		});

		// Listen for errors
		this.events.on('error', errorData => {
			this.handleError(errorData);
		});
	}

	/**
	 * Set up automatic tracking
	 */
	setupAutoTracking() {
		// Auto-track page views
		if (this.config.get('autoTrack.pageViews', true)) {
			this.trackPageView();
		}

		// Auto-track clicks
		if (this.config.get('autoTrack.clicks', false)) {
			this.dom.onClick(event => {
				this.handleAutoClick(event);
			});
		}
	}

	/**
	 * Track an event
	 * @param {string} eventName - Name of the event
	 * @param {Object} properties - Event properties
	 * @param {Object} options - Tracking options
	 */
	track(eventName, properties = {}, options = {}) {
		// If in degraded mode, provide minimal tracking
		if (this.isDegraded) {
			console.log('ARDA Analytics (degraded):', eventName, properties);
			return 'degraded_' + Date.now();
		}

		if (!this.isInitialized) {
			console.warn('ARDA Analytics not initialized');
			return;
		}

		try {
			// Validate inputs
			if (!this.validation.validateEventName(eventName)) {
				throw new Error(`Invalid event name: ${eventName}`);
			}

			if (!this.validation.validateEventProperties(properties)) {
				throw new Error('Invalid event properties');
			}

			// Create event data
			const eventData = {
				event: eventName,
				properties: {
					...properties,
					timestamp: Date.now(),
					...this.dom.getPageInfo(),
					userAgent: navigator.userAgent,
					sessionId: this.getSessionId(),
				},
				options,
				id: this.helpers.generateId('event'),
			};

			// Emit track event for internal processing
			this.events.emit('track', eventData);

			return eventData.id;
		} catch (error) {
			this.events.emit('error', {
				type: 'track_error',
				error,
				eventName,
				properties,
			});
			console.error('Failed to track event:', error);
			return null;
		}
	}

	/**
	 * Handle track event processing
	 * @param {Object} eventData - Event data to process
	 */
	handleTrackEvent(eventData) {
		// Store locally if configured and supported
		if (this.config.get('storage.enabled', true) && this.storage) {
			try {
				this.storage.store(eventData);
			} catch (error) {
				console.warn('Failed to store event:', error);
			}
		}

		// Send to API if configured and supported
		if (this.config.get('api.enabled', false) && this.api) {
			try {
				this.api.send(eventData);
			} catch (error) {
				console.warn('Failed to send event to API:', error);
			}
		}

		// Log if debug mode is enabled
		if (this.config.get('debug.enabled', false)) {
			console.log('ARDA Analytics tracked:', eventData);
		}
	}

	/**
	 * Track page view
	 */
	trackPageView() {
		const pageInfo = this.dom.getPageInfo();
		this.track('page_view', {
			page: pageInfo.pathname,
			title: pageInfo.title,
			referrer: pageInfo.referrer,
			viewport: this.dom.getViewportSize(),
		});
	}

	/**
	 * Handle automatic click tracking
	 * @param {Event} event - Click event
	 */
	handleAutoClick(event) {
		const elementData = this.dom.getElementData(event.target);

		this.track('click', {
			element: elementData.tagName,
			text: elementData.text,
			id: elementData.id,
			classes: elementData.classes,
			href: elementData.href,
			position: elementData.position,
		});
	}

	/**
	 * Handle errors
	 * @param {Object} errorData - Error data
	 */
	handleError(errorData) {
		if (this.config.get('debug.enabled', false)) {
			console.error('ARDA Analytics Error:', errorData);
		}

		// Store error if configured
		if (this.config.get('storage.enabled', true) && this.storage) {
			try {
				this.storage.store({
					event: 'arda_error',
					properties: errorData,
					timestamp: Date.now(),
				});
			} catch (error) {
				// Silent fail for error storage
			}
		}
	}

	/**
	 * Get or create session ID
	 * @returns {string} Session ID
	 */
	getSessionId() {
		try {
			let sessionId = sessionStorage.getItem('arda_session_id');
			if (!sessionId) {
				sessionId = this.helpers.generateId('session');
				sessionStorage.setItem('arda_session_id', sessionId);
			}
			return sessionId;
		} catch (error) {
			// Fallback for browsers without sessionStorage
			return this.helpers.generateId('session');
		}
	}

	// Public API methods

	/**
	 * Get plugin configuration
	 * @param {string} key - Configuration key
	 * @param {*} defaultValue - Default value
	 * @returns {*} Configuration value
	 */
	getConfig(key, defaultValue) {
		if (this.isDegraded) {
			return defaultValue;
		}
		return this.config.get(key, defaultValue);
	}

	/**
	 * Update plugin configuration
	 * @param {string|Object} key - Configuration key or object
	 * @param {*} value - Configuration value
	 */
	setConfig(key, value) {
		if (this.isDegraded) {
			return;
		}
		this.config.set(key, value);
	}

	/**
	 * Add event listener
	 * @param {string} event - Event name
	 * @param {Function} callback - Event callback
	 */
	on(event, callback) {
		if (this.isDegraded) {
			return;
		}
		this.events.on(event, callback);
	}

	/**
	 * Remove event listener
	 * @param {string} event - Event name
	 * @param {Function} callback - Event callback
	 */
	off(event, callback) {
		if (this.isDegraded) {
			return;
		}
		this.events.off(event, callback);
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
	 * Check if plugin is running in degraded mode
	 * @returns {boolean} Degraded mode status
	 */
	isDegradedMode() {
		return this.isDegraded;
	}

	/**
	 * Get stored events
	 * @param {number} limit - Maximum number of events to return
	 * @returns {Array} Array of stored events
	 */
	getStoredEvents(limit) {
		if (this.isDegraded || !this.storage) {
			return [];
		}
		return this.storage.retrieve(limit);
	}

	/**
	 * Clear stored events
	 */
	clearStoredEvents() {
		if (this.isDegraded || !this.storage) {
			return false;
		}
		return this.storage.clear();
	}

	/**
	 * Get plugin debug information
	 * @returns {Object} Debug information
	 */
	getDebugInfo() {
		return {
			version: this.version,
			initialized: this.isInitialized,
			degraded: this.isDegraded,
			startTime: this.startTime,
			uptime: Date.now() - this.startTime,
			browserSupport: this.browserSupport
				? this.browserSupport.features
				: {},
			config: this.config ? this.config.getAll() : {},
			events: this.events ? this.events.getDebugInfo() : {},
			storage: this.storage
				? {
						size: this.storage.getSize(),
						available: this.storage.isAvailable(),
					}
				: {},
			api: this.api
				? {
						queueSize: this.api.getQueueSize(),
						online: this.api.isOnline(),
					}
				: {},
		};
	}

	/**
	 * Destroy the plugin instance
	 */
	destroy() {
		if (this.events) {
			this.events.removeAllListeners();
		}
		if (this.api) {
			this.api.clearQueue();
		}
		this.isInitialized = false;
		console.log('ARDA Analytics destroyed');
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

// ARDA Analytics main entry point
console.log('ARDA Analytics loaded');
