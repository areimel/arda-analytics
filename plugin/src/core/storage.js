/**
 * Storage Manager for ARDA Analytics
 */
export class StorageManager {
	constructor(config) {
		this.config = config;
		this.prefix = config.get('storage.prefix', 'arda_analytics_');
		this.maxEvents = config.get('storage.maxEvents', 100);
		this.storageType = config.get('storage.type', 'localStorage');
		this.memoryStorage = new Map();
	}

	getStorage() {
		switch (this.storageType) {
			case 'localStorage':
				return window.localStorage;
			case 'sessionStorage':
				return window.sessionStorage;
			case 'memory':
				return {
					getItem: (key) => this.memoryStorage.get(key) || null,
					setItem: (key, value) => this.memoryStorage.set(key, value),
					removeItem: (key) => this.memoryStorage.delete(key),
					clear: () => this.memoryStorage.clear()
				};
			default:
				throw new Error(`Unknown storage type: ${this.storageType}`);
		}
	}

	store(eventData) {
		try {
			const storage = this.getStorage();
			const key = `${this.prefix}events`;
			const existingData = storage.getItem(key);
			const events = existingData ? JSON.parse(existingData) : [];
			
			events.push({
				...eventData,
				id: this.generateEventId(),
				storedAt: Date.now()
			});

			// Keep only the last maxEvents
			if (events.length > this.maxEvents) {
				events.splice(0, events.length - this.maxEvents);
			}

			storage.setItem(key, JSON.stringify(events));
			return true;
		} catch (error) {
			console.error('Failed to store event:', error);
			return false;
		}
	}

	retrieve(limit = null) {
		try {
			const storage = this.getStorage();
			const key = `${this.prefix}events`;
			const data = storage.getItem(key);
			
			if (!data) return [];
			
			const events = JSON.parse(data);
			return limit ? events.slice(-limit) : events;
		} catch (error) {
			console.error('Failed to retrieve events:', error);
			return [];
		}
	}

	clear() {
		try {
			const storage = this.getStorage();
			const key = `${this.prefix}events`;
			storage.removeItem(key);
			return true;
		} catch (error) {
			console.error('Failed to clear storage:', error);
			return false;
		}
	}

	getSize() {
		const events = this.retrieve();
		return events.length;
	}

	generateEventId() {
		return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	isAvailable() {
		try {
			const storage = this.getStorage();
			const testKey = `${this.prefix}test`;
			storage.setItem(testKey, 'test');
			storage.removeItem(testKey);
			return true;
		} catch (error) {
			return false;
		}
	}
} 