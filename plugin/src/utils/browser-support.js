/**
 * Browser Support and Graceful Degradation Utilities
 * Handles compatibility checks and fallbacks for unsupported browsers
 */

export class BrowserSupport {
	constructor() {
		this.features = this.checkFeatures();
		this.isSupported = this.checkMinimumSupport();
	}

	/**
	 * Check for required browser features
	 * @returns {Object} Feature support status
	 */
	checkFeatures() {
		return {
			// Core JavaScript features
			es6Classes: this.hasFeature(() => class {}),
			es6Modules: typeof Symbol !== 'undefined',
			es6Promise: typeof Promise !== 'undefined',
			es6Map: typeof Map !== 'undefined',
			arrowFunctions: this.hasFeature(() => () => {}),

			// DOM APIs
			addEventListener:
				typeof document !== 'undefined' && document.addEventListener,
			querySelector:
				typeof document !== 'undefined' && document.querySelector,
			localStorage: this.checkLocalStorage(),
			sessionStorage: this.checkSessionStorage(),
			fetch: typeof fetch !== 'undefined',

			// Browser APIs
			location: typeof window !== 'undefined' && window.location,
			navigator: typeof navigator !== 'undefined',
			console: typeof console !== 'undefined',
			setTimeout: typeof setTimeout !== 'undefined',

			// Modern features (nice to have)
			intersectionObserver: typeof IntersectionObserver !== 'undefined',
			mutationObserver: typeof MutationObserver !== 'undefined',
			webWorker: typeof Worker !== 'undefined',

			// Additional features
			promise: typeof Promise !== 'undefined',
		};
	}

	/**
	 * Check if browser meets minimum requirements
	 * @returns {boolean} True if browser is supported
	 */
	checkMinimumSupport() {
		return (
			this.features.addEventListener &&
			this.features.querySelector &&
			this.features.console
		);
	}

	/**
	 * Check if a feature exists safely
	 * @param {Function} testFunction - Function to test feature
	 * @returns {boolean} Feature availability
	 */
	hasFeature(testFunction) {
		try {
			testFunction();
			return true;
		} catch (error) {
			return false;
		}
	}

	/**
	 * Check localStorage availability
	 * @returns {boolean} localStorage support
	 */
	checkLocalStorage() {
		try {
			const test = '__arda_test__';
			localStorage.setItem(test, test);
			localStorage.removeItem(test);
			return true;
		} catch (error) {
			return false;
		}
	}

	/**
	 * Check sessionStorage availability
	 * @returns {boolean} sessionStorage support
	 */
	checkSessionStorage() {
		try {
			const test = '__arda_test__';
			sessionStorage.setItem(test, test);
			sessionStorage.removeItem(test);
			return true;
		} catch (error) {
			return false;
		}
	}

	/**
	 * Get browser information for debugging
	 * @returns {Object} Browser info
	 */
	getBrowserInfo() {
		const ua = navigator.userAgent;
		return {
			userAgent: ua,
			isIE: /MSIE|Trident/.test(ua),
			isEdge: /Edge/.test(ua),
			isChrome: /Chrome/.test(ua) && !/Edge/.test(ua),
			isFirefox: /Firefox/.test(ua),
			isSafari: /Safari/.test(ua) && !/Chrome/.test(ua),
			isMobile: /Mobile|Android|iPhone|iPad/.test(ua),
			version: this.extractVersion(ua),
		};
	}

	/**
	 * Extract browser version from user agent
	 * @param {string} ua - User agent string
	 * @returns {string} Browser version
	 */
	extractVersion(ua) {
		const patterns = [
			/Chrome\/(\d+)/,
			/Firefox\/(\d+)/,
			/Safari\/(\d+)/,
			/Edge\/(\d+)/,
			/MSIE (\d+)/,
			/rv:(\d+)/, // IE 11
		];

		for (const pattern of patterns) {
			const match = ua.match(pattern);
			if (match) {
				return match[1];
			}
		}

		return 'Unknown';
	}

	/**
	 * Create fallback storage when localStorage is not available
	 * @returns {Object} Fallback storage implementation
	 */
	createFallbackStorage() {
		const memoryStorage = new Map();

		return {
			getItem: key => memoryStorage.get(key) || null,
			setItem: (key, value) => memoryStorage.set(key, value),
			removeItem: key => memoryStorage.delete(key),
			clear: () => memoryStorage.clear(),
			get length() {
				return memoryStorage.size;
			},
			key: index => {
				const keys = Array.from(memoryStorage.keys());
				return keys[index] || null;
			},
		};
	}

	/**
	 * Create fetch polyfill for older browsers
	 * @returns {Function} Fetch implementation
	 */
	createFallbackFetch() {
		return (url, options = {}) => {
			return new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				const method = options.method || 'GET';

				xhr.open(method, url);

				// Set headers
				if (options.headers) {
					Object.keys(options.headers).forEach(key => {
						xhr.setRequestHeader(key, options.headers[key]);
					});
				}

				// Handle timeout
				if (options.timeout) {
					xhr.timeout = options.timeout;
				}

				xhr.onload = () => {
					resolve({
						ok: xhr.status >= 200 && xhr.status < 300,
						status: xhr.status,
						statusText: xhr.statusText,
						text: () => Promise.resolve(xhr.responseText),
						json: () =>
							Promise.resolve(JSON.parse(xhr.responseText)),
					});
				};

				xhr.onerror = () => reject(new Error('Network Error'));
				xhr.ontimeout = () => reject(new Error('Request Timeout'));

				// Send request
				xhr.send(options.body || null);
			});
		};
	}

	/**
	 * Apply polyfills and fallbacks
	 */
	applyFallbacks() {
		// Polyfill fetch if not available
		if (!this.features.fetch && typeof XMLHttpRequest !== 'undefined') {
			window.fetch = this.createFallbackFetch();
		}

		// Provide console fallback for IE
		if (!this.features.console) {
			window.console = {
				log: () => {},
				warn: () => {},
				error: () => {},
				info: () => {},
				debug: () => {},
			};
		}

		// Polyfill Promise for older browsers
		if (!this.features.es6Promise) {
			// Simple Promise polyfill (very basic)
			window.Promise =
				window.Promise ||
				class SimplePromise {
					constructor(executor) {
						this.state = 'pending';
						this.value = undefined;
						this.handlers = [];

						const resolve = value => {
							if (this.state === 'pending') {
								this.state = 'fulfilled';
								this.value = value;
								this.handlers.forEach(handler =>
									handler.onFulfilled(value),
								);
							}
						};

						const reject = reason => {
							if (this.state === 'pending') {
								this.state = 'rejected';
								this.value = reason;
								this.handlers.forEach(handler =>
									handler.onRejected(reason),
								);
							}
						};

						try {
							executor(resolve, reject);
						} catch (error) {
							reject(error);
						}
					}

					then(onFulfilled, onRejected) {
						return new SimplePromise((resolve, reject) => {
							const handler = {
								onFulfilled: value => {
									try {
										const result = onFulfilled
											? onFulfilled(value)
											: value;
										resolve(result);
									} catch (error) {
										reject(error);
									}
								},
								onRejected: reason => {
									try {
										const result = onRejected
											? onRejected(reason)
											: reason;
										reject(result);
									} catch (error) {
										reject(error);
									}
								},
							};

							if (this.state === 'fulfilled') {
								handler.onFulfilled(this.value);
							} else if (this.state === 'rejected') {
								handler.onRejected(this.value);
							} else {
								this.handlers.push(handler);
							}
						});
					}

					catch(onRejected) {
						return this.then(null, onRejected);
					}

					static resolve(value) {
						return new SimplePromise(resolve => resolve(value));
					}

					static reject(reason) {
						return new SimplePromise((resolve, reject) =>
							reject(reason),
						);
					}
				};
		}
	}

	/**
	 * Get degradation strategy based on browser capabilities
	 * @returns {Object} Degradation strategy
	 */
	getDegradationStrategy() {
		const browser = this.getBrowserInfo();

		// Severe degradation for very old browsers
		if (browser.isIE && parseInt(browser.version) < 10) {
			return {
				level: 'severe',
				features: ['basic_tracking_only'],
				disabled: ['storage', 'api', 'auto_tracking', 'events'],
			};
		}

		// Moderate degradation for older browsers
		if (
			(browser.isIE && parseInt(browser.version) < 12) ||
			(browser.isChrome && parseInt(browser.version) < 40) ||
			(browser.isFirefox && parseInt(browser.version) < 35)
		) {
			return {
				level: 'moderate',
				features: ['basic_tracking', 'simple_storage'],
				disabled: ['advanced_events', 'modern_apis'],
			};
		}

		// Full features for modern browsers
		return {
			level: 'none',
			features: ['all'],
			disabled: [],
		};
	}

	/**
	 * Log browser support information
	 */
	logSupportInfo() {
		const browser = this.getBrowserInfo();
		const strategy = this.getDegradationStrategy();

		console.log('ARDA Analytics Browser Support:', {
			supported: this.isSupported,
			browser: browser,
			features: this.features,
			degradation: strategy,
		});
	}

	/**
	 * Check if browser should degrade
	 * @returns {boolean} True if browser should degrade
	 */
	shouldDegrade() {
		const browser = this.getBrowserInfo();
		return browser.isIE || !this.isSupported;
	}
}
