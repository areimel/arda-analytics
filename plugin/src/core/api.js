/**
 * API Manager for ARDA Analytics
 */
export class APIManager {
	constructor(config) {
		this.config = config;
		this.endpoint = config.get('api.endpoint');
		this.timeout = config.get('api.timeout', 5000);
		this.retryAttempts = config.get('api.retryAttempts', 3);
		this.queue = [];
		this.sending = false;
	}

	async send(eventData) {
		if (!this.config.get('api.enabled') || !this.endpoint) {
			return false;
		}

		try {
			const response = await this.makeRequest(eventData);
			return response.ok;
		} catch (error) {
			console.error('Failed to send event to API:', error);

			// Add to queue for retry
			this.queue.push(eventData);
			this.processQueue();

			return false;
		}
	}

	async makeRequest(data, attempt = 1) {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), this.timeout);

		try {
			const response = await fetch(this.endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...this.getAuthHeaders(),
				},
				body: JSON.stringify(data),
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			if (!response.ok && attempt < this.retryAttempts) {
				await this.delay(Math.pow(2, attempt) * 1000); // Exponential backoff
				return this.makeRequest(data, attempt + 1);
			}

			return response;
		} catch (error) {
			clearTimeout(timeoutId);

			if (attempt < this.retryAttempts) {
				await this.delay(Math.pow(2, attempt) * 1000);
				return this.makeRequest(data, attempt + 1);
			}

			throw error;
		}
	}

	getAuthHeaders() {
		const apiKey = this.config.get('api.apiKey');
		return apiKey ? { Authorization: `Bearer ${apiKey}` } : {};
	}

	async processQueue() {
		if (this.sending || this.queue.length === 0) {
			return;
		}

		this.sending = true;

		while (this.queue.length > 0) {
			const eventData = this.queue.shift();

			try {
				await this.send(eventData);
			} catch (error) {
				// Re-add failed events to front of queue
				this.queue.unshift(eventData);
				break;
			}
		}

		this.sending = false;
	}

	delay(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	getQueueSize() {
		return this.queue.length;
	}

	clearQueue() {
		this.queue = [];
	}

	isOnline() {
		return navigator.onLine !== false;
	}
}
