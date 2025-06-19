/**
 * Event Manager for ARDA Analytics
 * Handles event handling system and inter-module communication
 */
export class EventManager {
	constructor() {
		this.listeners = new Map();
		this.maxListeners = 100;
	}

	/**
	 * Add event listener
	 * @param {string} event - Event name
	 * @param {Function} callback - Event callback
	 * @param {Object} options - Listener options
	 */
	on(event, callback, options = {}) {
		if (typeof callback !== 'function') {
			throw new Error('Callback must be a function');
		}

		if (!this.listeners.has(event)) {
			this.listeners.set(event, []);
		}

		const listeners = this.listeners.get(event);

		// Check max listeners
		if (listeners.length >= this.maxListeners) {
			console.warn(
				`Maximum listeners (${this.maxListeners}) reached for event: ${event}`,
			);
			return;
		}

		const listener = {
			callback,
			once: options.once || false,
			priority: options.priority || 0,
			id: options.id || this.generateId(),
		};

		listeners.push(listener);

		// Sort by priority (higher priority first)
		listeners.sort((a, b) => b.priority - a.priority);

		return listener.id;
	}

	/**
	 * Add one-time event listener
	 * @param {string} event - Event name
	 * @param {Function} callback - Event callback
	 * @param {Object} options - Listener options
	 */
	once(event, callback, options = {}) {
		return this.on(event, callback, { ...options, once: true });
	}

	/**
	 * Remove event listener
	 * @param {string} event - Event name
	 * @param {Function|string} callbackOrId - Callback function or listener ID
	 */
	off(event, callbackOrId) {
		if (!this.listeners.has(event)) {
			return false;
		}

		const listeners = this.listeners.get(event);
		const isId = typeof callbackOrId === 'string';

		const index = listeners.findIndex(listener =>
			isId
				? listener.id === callbackOrId
				: listener.callback === callbackOrId,
		);

		if (index !== -1) {
			listeners.splice(index, 1);

			// Clean up empty arrays
			if (listeners.length === 0) {
				this.listeners.delete(event);
			}

			return true;
		}

		return false;
	}

	/**
	 * Remove all listeners for an event
	 * @param {string} event - Event name
	 */
	removeAllListeners(event) {
		if (event) {
			this.listeners.delete(event);
		} else {
			this.listeners.clear();
		}
	}

	/**
	 * Emit event
	 * @param {string} event - Event name
	 * @param {*} data - Event data
	 * @param {Object} options - Emit options
	 */
	emit(event, data, options = {}) {
		if (!this.listeners.has(event)) {
			return false;
		}

		const listeners = this.listeners.get(event);
		const listenersToRemove = [];

		// Create event object
		const eventObj = {
			type: event,
			data,
			timestamp: Date.now(),
			preventDefault: false,
			stopPropagation: false,
		};

		let executedCount = 0;

		for (let i = 0; i < listeners.length; i++) {
			const listener = listeners[i];

			try {
				// Call the listener
				listener.callback.call(this, eventObj);
				executedCount++;

				// Mark for removal if it's a one-time listener
				if (listener.once) {
					listenersToRemove.push(i);
				}

				// Stop propagation if requested
				if (eventObj.stopPropagation) {
					break;
				}
			} catch (error) {
				console.error(`Error in event listener for '${event}':`, error);

				// Remove problematic listeners in production
				if (!options.keepErroredListeners) {
					listenersToRemove.push(i);
				}
			}
		}

		// Remove one-time and errored listeners
		for (let i = listenersToRemove.length - 1; i >= 0; i--) {
			listeners.splice(listenersToRemove[i], 1);
		}

		// Clean up empty arrays
		if (listeners.length === 0) {
			this.listeners.delete(event);
		}

		return executedCount > 0;
	}

	/**
	 * Get listener count for an event
	 * @param {string} event - Event name
	 * @returns {number} Listener count
	 */
	listenerCount(event) {
		return this.listeners.has(event) ? this.listeners.get(event).length : 0;
	}

	/**
	 * Get all event names
	 * @returns {string[]} Array of event names
	 */
	eventNames() {
		return Array.from(this.listeners.keys());
	}

	/**
	 * Generate unique listener ID
	 * @returns {string} Unique ID
	 */
	generateId() {
		return `listener_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	/**
	 * Set maximum listeners per event
	 * @param {number} max - Maximum listeners
	 */
	setMaxListeners(max) {
		this.maxListeners = Math.max(1, max);
	}

	/**
	 * Get maximum listeners per event
	 * @returns {number} Maximum listeners
	 */
	getMaxListeners() {
		return this.maxListeners;
	}

	/**
	 * Check if event has listeners
	 * @param {string} event - Event name
	 * @returns {boolean} True if has listeners
	 */
	hasListeners(event) {
		return (
			this.listeners.has(event) && this.listeners.get(event).length > 0
		);
	}

	/**
	 * Get debug information
	 * @returns {Object} Debug information
	 */
	getDebugInfo() {
		const info = {
			totalEvents: this.listeners.size,
			totalListeners: 0,
			events: {},
		};

		for (const [event, listeners] of this.listeners) {
			info.totalListeners += listeners.length;
			info.events[event] = {
				listenerCount: listeners.length,
				listeners: listeners.map(l => ({
					id: l.id,
					once: l.once,
					priority: l.priority,
				})),
			};
		}

		return info;
	}
}
