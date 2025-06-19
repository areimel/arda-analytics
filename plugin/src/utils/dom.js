/**
 * DOM Utilities for ARDA Analytics
 */
export class DOMUtils {
	constructor() {
		this.observers = new Map();
	}

	/**
	 * Add click event listener
	 */
	onClick(callback) {
		document.addEventListener('click', callback);
		return () => document.removeEventListener('click', callback);
	}

	/**
	 * Get element data for analytics
	 */
	getElementData(element) {
		return {
			tagName: element.tagName.toLowerCase(),
			id: element.id || null,
			classes: element.className || null,
			text: this.getElementText(element),
			href: element.href || null,
			dataset: { ...element.dataset },
			position: this.getElementPosition(element)
		};
	}

	/**
	 * Get clean text content from element
	 */
	getElementText(element) {
		return element.textContent?.trim().substring(0, 100) || '';
	}

	/**
	 * Get element position
	 */
	getElementPosition(element) {
		const rect = element.getBoundingClientRect();
		return {
			x: Math.round(rect.left),
			y: Math.round(rect.top),
			width: Math.round(rect.width),
			height: Math.round(rect.height)
		};
	}

	/**
	 * Check if element is visible
	 */
	isElementVisible(element) {
		const rect = element.getBoundingClientRect();
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= window.innerHeight &&
			rect.right <= window.innerWidth
		);
	}

	/**
	 * Get viewport size
	 */
	getViewportSize() {
		return {
			width: window.innerWidth,
			height: window.innerHeight
		};
	}

	/**
	 * Get scroll position
	 */
	getScrollPosition() {
		return {
			x: window.pageXOffset || document.documentElement.scrollLeft,
			y: window.pageYOffset || document.documentElement.scrollTop
		};
	}

	/**
	 * Get page information
	 */
	getPageInfo() {
		return {
			url: window.location.href,
			pathname: window.location.pathname,
			search: window.location.search,
			hash: window.location.hash,
			title: document.title,
			referrer: document.referrer
		};
	}

	/**
	 * Wait for DOM ready
	 */
	ready(callback) {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', callback);
		} else {
			callback();
		}
	}

	/**
	 * Simple query selector with error handling
	 */
	$(selector) {
		try {
			return document.querySelector(selector);
		} catch (error) {
			console.error('Invalid selector:', selector);
			return null;
		}
	}

	/**
	 * Simple query selector all with error handling
	 */
	$$(selector) {
		try {
			return Array.from(document.querySelectorAll(selector));
		} catch (error) {
			console.error('Invalid selector:', selector);
			return [];
		}
	}
} 