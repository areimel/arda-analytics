/**
 * Storage Manager for ARDA Analytics
 */

interface Config {
	get(key: string, defaultValue?: unknown): unknown;
}

interface StorageEvent {
	id: string;
	storedAt: number;
	[key: string]: unknown;
}

interface StorageInterface {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
	removeItem(key: string): void;
	clear(): void;
}

export class StorageManager {
	private prefix: string;
	private maxEvents: number;
	private storageType: string;
	private memoryStorage: Map<string, string>;

	constructor(config: Config) {
		this.prefix = config.get('storage.prefix', 'arda_analytics_') as string;
		this.maxEvents = config.get('storage.maxEvents', 100) as number;
		this.storageType = config.get('storage.type', 'localStorage') as string;
		this.memoryStorage = new Map();
	}

	getStorage(): StorageInterface {
		switch (this.storageType) {
			case 'localStorage':
				return window.localStorage;
			case 'sessionStorage':
				return window.sessionStorage;
			case 'memory':
				return {
					getItem: (key: string) => this.memoryStorage.get(key) || null,
					setItem: (key: string, value: string) => this.memoryStorage.set(key, value),
					removeItem: (key: string) => this.memoryStorage.delete(key),
					clear: () => this.memoryStorage.clear(),
				};
			default:
				throw new Error(`Unknown storage type: ${this.storageType}`);
		}
	}

	store(eventData: Record<string, unknown>): boolean {
		try {
			const storage = this.getStorage();
			const key = `${this.prefix}events`;
			const existingData = storage.getItem(key);
			const events: StorageEvent[] = existingData ? JSON.parse(existingData) : [];

			events.push({
				...eventData,
				id: this.generateEventId(),
				storedAt: Date.now(),
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

	retrieve(limit: number | null = null): StorageEvent[] {
		try {
			const storage = this.getStorage();
			const key = `${this.prefix}events`;
			const data = storage.getItem(key);

			if (!data) {
				return [];
			}

			const events: StorageEvent[] = JSON.parse(data);
			return limit ? events.slice(-limit) : events;
		} catch (error) {
			console.error('Failed to retrieve events:', error);
			return [];
		}
	}

	clear(): boolean {
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

	getSize(): number {
		const events = this.retrieve();
		return events.length;
	}

	generateEventId(): string {
		return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	isAvailable(): boolean {
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
