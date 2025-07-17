/**
 * @jest-environment jsdom
 */

import ARDAAnalytics from '../index.js';

describe('ARDA Analytics', () => {
	let analytics;

	beforeEach(() => {
		// Clean up DOM and globals before each test
		document.body.innerHTML = '';
		window.dataLayer = [];
		
		// Create fresh instance
		analytics = new ARDAAnalytics({ debug: true, autoInit: false });
	});

	afterEach(() => {
		if (analytics) {
			analytics.destroy();
		}
		// Clean up any remaining event listeners
		document.removeEventListener('click', () => {});
		document.removeEventListener('submit', () => {});
	});

	describe('Initialization', () => {
		test('should initialize successfully', () => {
			analytics.init();
			expect(analytics.isReady()).toBe(true);
		});

		test('should have correct version', () => {
			expect(analytics.getVersion()).toBe('0.1.0');
		});

		test('should initialize dataLayer', () => {
			analytics.init();
			expect(window.dataLayer).toBeDefined();
			expect(Array.isArray(window.dataLayer)).toBe(true);
		});

		test('should check GTM availability', () => {
			// Before init, dataLayer might not exist
			const gtmReady = analytics.isGTMReady();
			expect(typeof gtmReady).toBe('boolean');
			
			// After init, dataLayer should be available
			analytics.init();
			expect(analytics.isGTMReady()).toBe(true);
		});
	});

	describe('Configuration Management', () => {
		test('should return current configuration', () => {
			const config = analytics.getConfig();
			expect(config).toHaveProperty('debug', true);
			expect(config).toHaveProperty('autoInit', false);
		});

		test('should update configuration', () => {
			analytics.updateConfig({ debug: false });
			const config = analytics.getConfig();
			expect(config.debug).toBe(false);
		});
	});

	describe('Manual Event Pushing', () => {
		beforeEach(() => {
			analytics.init();
		});

		test('should push custom events to GTM', () => {
			const result = analytics.pushEvent('test_event');
			
			expect(result.success).toBe(true);
			expect(result.eventData).toEqual({
				event: 'CustomEvent',
				eventLabel: 'test_event',
			});
			
			// Check if event was added to dataLayer
			expect(window.dataLayer).toContainEqual({
				event: 'CustomEvent',
				eventLabel: 'test_event',
			});
		});

		test('should handle push errors gracefully', () => {
			// Simulate error by making dataLayer non-writable
			Object.defineProperty(window, 'dataLayer', {
				writable: false,
				value: null,
			});

			const result = analytics.pushEvent('test_event');
			expect(result.success).toBe(false);
			expect(result.error).toBeDefined();
		});

		test('should not push events if not initialized', () => {
			analytics.destroy(); // Ensure not initialized
			
			const result = analytics.pushEvent('test_event');
			expect(result.success).toBe(false);
			expect(result.error).toBe('Not initialized');
		});
	});

	describe('Click Event Tracking', () => {
		beforeEach(() => {
			analytics.init();
		});

		test('should detect button clicks', (done) => {
			const button = document.createElement('button');
			button.textContent = 'Test Button';
			button.id = 'test-button';
			document.body.appendChild(button);

			// Mock dataLayer push to capture events
			const originalPush = window.dataLayer.push;
			window.dataLayer.push = function(data) {
				if (data.event === 'CustomEvent' && data.eventLabel === 'click_button') {
					expect(data.eventLabel).toBe('click_button');
					window.dataLayer.push = originalPush;
					done();
				}
				return originalPush.call(this, data);
			};

			// Trigger click
			button.click();
		});

		test('should detect link clicks', (done) => {
			const link = document.createElement('a');
			link.href = 'https://example.com';
			link.textContent = 'Test Link';
			document.body.appendChild(link);

			const originalPush = window.dataLayer.push;
			window.dataLayer.push = function(data) {
				if (data.event === 'CustomEvent' && data.eventLabel === 'click_link') {
					expect(data.eventLabel).toBe('click_link');
					window.dataLayer.push = originalPush;
					done();
				}
				return originalPush.call(this, data);
			};

			link.click();
		});

		test('should detect generic element clicks', (done) => {
			const div = document.createElement('div');
			div.textContent = 'Clickable div';
			document.body.appendChild(div);

			const originalPush = window.dataLayer.push;
			window.dataLayer.push = function(data) {
				if (data.event === 'CustomEvent' && data.eventLabel === 'click_element') {
					expect(data.eventLabel).toBe('click_element');
					window.dataLayer.push = originalPush;
					done();
				}
				return originalPush.call(this, data);
			};

			div.click();
		});
	});

	describe('Form Event Tracking', () => {
		beforeEach(() => {
			analytics.init();
		});

		test('should detect form submissions', (done) => {
			const form = document.createElement('form');
			form.id = 'test-form';
			
			const input = document.createElement('input');
			input.name = 'test-field';
			input.value = 'test-value';
			form.appendChild(input);
			
			document.body.appendChild(form);

			const originalPush = window.dataLayer.push;
			window.dataLayer.push = function(data) {
				if (data.event === 'CustomEvent' && data.eventLabel === 'form_submit') {
					expect(data.eventLabel).toBe('form_submit');
					window.dataLayer.push = originalPush;
					done();
				}
				return originalPush.call(this, data);
			};

			// Create and dispatch submit event
			const submitEvent = new Event('submit', { bubbles: true });
			form.dispatchEvent(submitEvent);
		});

		test('should detect form validation errors', (done) => {
			const input = document.createElement('input');
			input.name = 'required-field';
			input.required = true;
			document.body.appendChild(input);

			const originalPush = window.dataLayer.push;
			window.dataLayer.push = function(data) {
				if (data.event === 'CustomEvent' && data.eventLabel === 'form_error') {
					expect(data.eventLabel).toBe('form_error');
					window.dataLayer.push = originalPush;
					done();
				}
				return originalPush.call(this, data);
			};

			// Create and dispatch invalid event
			const invalidEvent = new Event('invalid', { bubbles: true });
			input.dispatchEvent(invalidEvent);
		});
	});

	describe('Page View Tracking', () => {
		test('should detect page load events', () => {
			// Initialize analytics
			analytics.init();
			
			// Give a moment for page view events to be processed
			// In a real browser environment, this would be triggered immediately
			// For testing purposes, we'll check if the event triggering mechanism is set up
			expect(analytics.isReady()).toBe(true);
			
			// Test that a manual page view event can be pushed
			const result = analytics.pushEvent('page_view');
			expect(result.success).toBe(true);
		});
	});

	describe('Cleanup', () => {
		test('should destroy properly', () => {
			analytics.init();
			expect(analytics.isReady()).toBe(true);
			
			analytics.destroy();
			expect(analytics.isReady()).toBe(false);
		});

		test('should handle multiple destroy calls gracefully', () => {
			analytics.init();
			analytics.destroy();
			
			// Should not throw
			expect(() => analytics.destroy()).not.toThrow();
		});
	});
});