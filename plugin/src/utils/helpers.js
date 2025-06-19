/**
 * Helper Utilities for ARDA Analytics
 */
export class HelperUtils {
	/**
	 * Generate unique ID
	 */
	generateId(prefix = 'arda') {
		return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	/**
	 * Deep clone object
	 */
	deepClone(obj) {
		if (obj === null || typeof obj !== 'object') {
			return obj;
		}

		if (obj instanceof Date) {
			return new Date(obj.getTime());
		}

		if (Array.isArray(obj)) {
			return obj.map(item => this.deepClone(item));
		}

		const cloned = {};
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				cloned[key] = this.deepClone(obj[key]);
			}
		}

		return cloned;
	}

	/**
	 * Debounce function
	 */
	debounce(func, wait) {
		let timeout;
		return function executedFunction(...args) {
			const later = () => {
				clearTimeout(timeout);
				func(...args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	}

	/**
	 * Throttle function
	 */
	throttle(func, limit) {
		let inThrottle;
		return function (...args) {
			if (!inThrottle) {
				func.apply(this, args);
				inThrottle = true;
				setTimeout(() => (inThrottle = false), limit);
			}
		};
	}

	/**
	 * Get user agent information
	 */
	getUserAgent() {
		const ua = navigator.userAgent;
		return {
			raw: ua,
			browser: this.getBrowserInfo(ua),
			os: this.getOSInfo(ua),
			device: this.getDeviceInfo(ua),
		};
	}

	/**
	 * Get browser information
	 */
	getBrowserInfo(ua) {
		const browsers = [
			{ name: 'Chrome', pattern: /Chrome\/(\d+)/ },
			{ name: 'Firefox', pattern: /Firefox\/(\d+)/ },
			{ name: 'Safari', pattern: /Version\/(\d+).*Safari/ },
			{ name: 'Edge', pattern: /Edg\/(\d+)/ },
			{ name: 'Opera', pattern: /OPR\/(\d+)/ },
		];

		for (const browser of browsers) {
			const match = ua.match(browser.pattern);
			if (match) {
				return {
					name: browser.name,
					version: match[1],
				};
			}
		}

		return { name: 'Unknown', version: 'Unknown' };
	}

	/**
	 * Get OS information
	 */
	getOSInfo(ua) {
		const systems = [
			{ name: 'Windows', pattern: /Windows NT (\d+\.\d+)/ },
			{ name: 'macOS', pattern: /Mac OS X (\d+[._]\d+)/ },
			{ name: 'Linux', pattern: /Linux/ },
			{ name: 'Android', pattern: /Android (\d+)/ },
			{ name: 'iOS', pattern: /OS (\d+)_(\d+)/ },
		];

		for (const system of systems) {
			const match = ua.match(system.pattern);
			if (match) {
				return {
					name: system.name,
					version: match[1] || 'Unknown',
				};
			}
		}

		return { name: 'Unknown', version: 'Unknown' };
	}

	/**
	 * Get device information
	 */
	getDeviceInfo(ua) {
		const isMobile = /Mobile|Android|iPhone|iPad/.test(ua);
		const isTablet = /iPad|Tablet/.test(ua);

		return {
			type: isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop',
			isMobile,
			isTablet,
			isDesktop: !isMobile && !isTablet,
		};
	}

	/**
	 * Get timestamp in various formats
	 */
	getTimestamp(format = 'unix') {
		const now = new Date();

		switch (format) {
			case 'unix':
				return Math.floor(now.getTime() / 1000);
			case 'milliseconds':
				return now.getTime();
			case 'iso':
				return now.toISOString();
			case 'local':
				return now.toLocaleString();
			default:
				return now.getTime();
		}
	}

	/**
	 * Simple hash function
	 */
	simpleHash(str) {
		let hash = 0;
		if (str.length === 0) {
			return hash;
		}

		for (let i = 0; i < str.length; i++) {
			const char = str.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash = hash & hash; // Convert to 32-bit integer
		}

		return Math.abs(hash);
	}

	/**
	 * Format bytes
	 */
	formatBytes(bytes, decimals = 2) {
		if (bytes === 0) {
			return '0 Bytes';
		}

		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return (
			parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
		);
	}

	/**
	 * Check if object is empty
	 */
	isEmptyObject(obj) {
		return (
			obj && Object.keys(obj).length === 0 && obj.constructor === Object
		);
	}

	/**
	 * Capitalize first letter
	 */
	capitalize(str) {
		if (!str || typeof str !== 'string') {
			return '';
		}
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	/**
	 * Random number between min and max
	 */
	random(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}
