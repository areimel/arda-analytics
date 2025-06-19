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

// Mock fetch
global.fetch = jest.fn();

// Mock console methods to avoid noise in tests
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
}; 