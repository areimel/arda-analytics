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
	});

	describe('Event Tracking', () => {
		beforeEach(() => {
			analytics.init();
		});

		test('should detect click on GAEvent element', (done) => {
			// Create test element
			const button = document.createElement('button');
			button.setAttribute('data-event', 'GAEvent');
			button.setAttribute('data-category', 'test-category');
			button.setAttribute('data-action', 'test-action');
			button.setAttribute('data-label', 'test-label');
			button.setAttribute('data-value', '123');
			document.body.appendChild(button);

			// Mock dataLayer push to capture the event
			const originalPush = window.dataLayer.push;
			window.dataLayer.push = function(data) {
				if (data.event === 'GAEvent') {
					expect(data.eventCategory).toBe('test-category');
					expect(data.eventAction).toBe('test-action');
					expect(data.eventLabel).toBe('test-label');
					expect(data.eventValue).toBe('123');
					
					// Restore original push
					window.dataLayer.push = originalPush;
					done();
				}
				return originalPush.call(this, data);
			};

			// Trigger click
			button.click();
		});

		test('should handle nested element clicks', (done) => {
			// Create nested elements
			const div = document.createElement('div');
			div.setAttribute('data-event', 'GAEvent');
			div.setAttribute('data-category', 'nested-category');
			div.setAttribute('data-action', 'nested-action');
			div.setAttribute('data-label', 'nested-label');
			div.setAttribute('data-value', '456');

			const span = document.createElement('span');
			span.textContent = 'Click me';
			div.appendChild(span);
			document.body.appendChild(div);

			// Mock dataLayer push
			const originalPush = window.dataLayer.push;
			window.dataLayer.push = function(data) {
				if (data.event === 'GAEvent') {
					expect(data.eventCategory).toBe('nested-category');
					expect(data.eventAction).toBe('nested-action');
					expect(data.eventLabel).toBe('nested-label');
					expect(data.eventValue).toBe('456');
					
					window.dataLayer.push = originalPush;
					done();
				}
				return originalPush.call(this, data);
			};

			// Click on nested element
			span.click();
		});
	});

	describe('Cleanup', () => {
		test('should destroy properly', () => {
			analytics.init();
			expect(analytics.isReady()).toBe(true);
			
			analytics.destroy();
			expect(analytics.isReady()).toBe(false);
		});
	});
});