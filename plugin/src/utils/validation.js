/**
 * Validation Utilities for ARDA Analytics
 */
export class ValidationUtils {
	/**
	 * Validate configuration object
	 */
	validateConfig(config) {
		if (!config || typeof config !== 'object') {
			return false;
		}
		return true;
	}

	/**
	 * Validate event name
	 */
	validateEventName(eventName) {
		if (typeof eventName !== 'string') {
			return false;
		}

		if (eventName.length === 0 || eventName.length > 100) {
			return false;
		}

		const validPattern = /^[a-zA-Z0-9_.-]+$/;
		return validPattern.test(eventName);
	}

	/**
	 * Validate event properties
	 */
	validateEventProperties(properties) {
		if (!properties || typeof properties !== 'object') {
			return false;
		}

		try {
			JSON.stringify(properties);
		} catch (error) {
			return false;
		}

		return true;
	}

	/**
	 * Validate URL
	 */
	validateUrl(url) {
		if (!url || typeof url !== 'string') {
			return false;
		}

		try {
			new URL(url);
			return true;
		} catch (error) {
			return false;
		}
	}

	/**
	 * Sanitize string
	 */
	sanitizeString(str, maxLength = 100) {
		if (typeof str !== 'string') {
			return '';
		}

		return str
			.trim()
			.substring(0, maxLength)
			.replace(/[<>]/g, '');
	}

	/**
	 * Check if value is empty
	 */
	isEmpty(value) {
		if (value === null || value === undefined) {
			return true;
		}

		if (typeof value === 'string') {
			return value.trim().length === 0;
		}

		return false;
	}

	/**
	 * Type checking utilities
	 */
	isString(value) {
		return typeof value === 'string';
	}

	isNumber(value) {
		return typeof value === 'number' && isFinite(value);
	}

	isBoolean(value) {
		return typeof value === 'boolean';
	}

	isObject(value) {
		return value !== null && typeof value === 'object' && !Array.isArray(value);
	}

	isArray(value) {
		return Array.isArray(value);
	}

	isFunction(value) {
		return typeof value === 'function';
	}
} 