/**
 * ARDA Analytics - Basic Entry Point
 * A vanilla JavaScript analytics plugin with orchestrator architecture
 */

class ARDAAnalytics {
	constructor(options = {}) {
		this.config = {
			autoTrack: { pageViews: true, clicks: false },
			storage: { enabled: true },
			api: { enabled: false, endpoint: null },
			...options
		};
		
		this.version = '0.1.0';
		this.isInitialized = false;
		this.events = {};
		
		this.init();
	}

	init() {
		console.log(`ARDA Analytics v${this.version} initializing...`);
		this.isInitialized = true;
		
		if (this.config.autoTrack.pageViews) {
			this.trackPageView();
		}
	}

	track(eventName, properties = {}) {
		const eventData = {
			event: eventName,
			properties: { ...properties, timestamp: Date.now() }
		};
		
		console.log('ARDA Analytics tracked:', eventData);
		
		if (this.config.storage.enabled) {
			this.storeEvent(eventData);
		}
	}

	trackPageView() {
		this.track('page_view', {
			page: window.location.pathname,
			title: document.title
		});
	}

	storeEvent(eventData) {
		try {
			const events = JSON.parse(localStorage.getItem('arda_analytics') || '[]');
			events.push(eventData);
			localStorage.setItem('arda_analytics', JSON.stringify(events.slice(-100)));
		} catch (e) {
			console.error('Storage failed:', e);
		}
	}

	getVersion() { return this.version; }
	isReady() { return this.isInitialized; }
}

// Multiple export formats
export default ARDAAnalytics;

if (typeof window !== 'undefined') {
	window.ARDAAnalytics = ARDAAnalytics;
}

if (typeof module !== 'undefined' && module.exports) {
	module.exports = ARDAAnalytics;
} 