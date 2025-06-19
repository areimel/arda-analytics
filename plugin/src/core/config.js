/**
 * Configuration Manager for ARDA Analytics
 * Handles configuration merging, validation, and access
 */

export class ConfigManager {
	constructor(options = {}) {
		this.defaults = {
			autoTrack: { pageViews: true, clicks: false },
			storage: { enabled: true, type: 'localStorage', maxEvents: 100 },
			api: { enabled: false, endpoint: null, timeout: 5000 },
			privacy: { respectDoNotTrack: true },
			debug: { enabled: false, logLevel: 'warn' }
		};
		
		this.config = this.merge(this.defaults, options);
		this.validate();
	}

	get(key, defaultValue) {
		const keys = key.split('.');
		let value = this.config;
		
		for (const k of keys) {
			value = value?.[k];
			if (value === undefined) return defaultValue;
		}
		
		return value;
	}

	set(key, value) {
		const keys = key.split('.');
		let target = this.config;
		
		for (let i = 0; i < keys.length - 1; i++) {
			if (!target[keys[i]]) target[keys[i]] = {};
			target = target[keys[i]];
		}
		
		target[keys[keys.length - 1]] = value;
		this.validate();
	}

	getAll() {
		return { ...this.config };
	}

	merge(target, source) {
		const result = { ...target };
		
		for (const key in source) {
			if (source.hasOwnProperty(key)) {
				if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
					result[key] = this.merge(target[key] || {}, source[key]);
				} else {
					result[key] = source[key];
				}
			}
		}
		
		return result;
	}

	validate() {
		const validStorageTypes = ['localStorage', 'sessionStorage', 'memory'];
		if (!validStorageTypes.includes(this.config.storage.type)) {
			throw new Error(`Invalid storage type: ${this.config.storage.type}`);
		}
		
		if (this.config.api.enabled && !this.config.api.endpoint) {
			throw new Error('API endpoint required when API is enabled');
		}
	}

	isDNTEnabled() {
		return this.config.privacy.respectDoNotTrack && 
			   (navigator.doNotTrack === '1' || navigator.msDoNotTrack === '1');
	}

	/**
	 * Check if debug mode is enabled
	 * @returns {boolean} True if debug is enabled
	 */
	isDebugEnabled() {
		return this.config.debug.enabled;
	}

	/**
	 * Get debug log level
	 * @returns {string} Log level
	 */
	getLogLevel() {
		return this.config.debug.logLevel;
	}

	/**
	 * Export configuration for debugging
	 * @returns {string} JSON string of configuration
	 */
	export() {
		return JSON.stringify(this.config, null, 2);
	}
} 