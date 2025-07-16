// Jest setup file for ARDA Analytics plugin tests

// Mock DOM methods that might not be available in jsdom
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: jest.fn().mockImplementation(query => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(), // deprecated
		removeListener: jest.fn(), // deprecated
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	})),
});

// Mock localStorage
const localStorageMock = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
	clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
	clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock fetch if needed
global.fetch = jest.fn();

// Setup dataLayer for GTM testing with proper property descriptor
Object.defineProperty(window, 'dataLayer', {
	writable: true,
	configurable: true,
	value: []
});

// Mock console methods for cleaner test output
const originalConsole = { ...console };
global.console = {
	...console,
	log: jest.fn(),
	debug: jest.fn(),
	info: jest.fn(),
	warn: jest.fn(),
	error: jest.fn(),
};

// Reset all mocks before each test
beforeEach(() => {
	jest.clearAllMocks();
	localStorage.clear();
	sessionStorage.clear();
	
	// Reset dataLayer with proper property management
	Object.defineProperty(window, 'dataLayer', {
		writable: true,
		configurable: true,
		value: []
	});
	
	// Reset console mocks but keep original functionality for actual errors
	console.log.mockClear();
	console.debug.mockClear();
	console.info.mockClear();
	console.warn.mockClear();
	console.error.mockClear();
});

// Restore console after tests
afterAll(() => {
	global.console = originalConsole;
});

// Global test utilities
global.testUtils = {
	createMockElement: (tagName = 'div', attributes = {}) => {
		const element = document.createElement(tagName);
		Object.keys(attributes).forEach(key => {
			element.setAttribute(key, attributes[key]);
		});
		return element;
	},
	
	createMockEvent: (type, detail = {}) => {
		return new CustomEvent(type, { detail });
	},
	
	waitFor: (condition, timeout = 1000) => {
		return new Promise((resolve, reject) => {
			const startTime = Date.now();
			const checkCondition = () => {
				if (condition()) {
					resolve();
				} else if (Date.now() - startTime > timeout) {
					reject(new Error('Timeout waiting for condition'));
				} else {
					setTimeout(checkCondition, 10);
				}
			};
			checkCondition();
		});
	},
	
	// Helper to find events in dataLayer
	findDataLayerEvent: (eventLabel) => {
		return window.dataLayer.find(
			event => event.event === 'CustomEvent' && event.eventLabel === eventLabel
		);
	},
	
	// Helper to wait for dataLayer events
	waitForDataLayerEvent: (eventLabel, timeout = 1000) => {
		return new Promise((resolve, reject) => {
			const startTime = Date.now();
			const checkEvent = () => {
				const event = global.testUtils.findDataLayerEvent(eventLabel);
				if (event) {
					resolve(event);
				} else if (Date.now() - startTime > timeout) {
					reject(new Error(`Timeout waiting for dataLayer event: ${eventLabel}`));
				} else {
					setTimeout(checkEvent, 10);
				}
			};
			checkEvent();
		});
	},
}; 