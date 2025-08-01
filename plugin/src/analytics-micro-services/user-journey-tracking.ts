/**
 * ========================================
 * SIMPLIFIED USER JOURNEY TRACKING SERVICE
 * ========================================
 * 
 * This service provides a simple way to track user journeys by logging
 * event names and providing trigger functionality to execute callbacks 
 * when specific event patterns occur.
 * 
 * FEATURES:
 * - Simple logging of event names to localStorage
 * - Simple trigger system based on event names
 * - No complex journey configurations or step management needed
 * - Persistent storage across browser sessions
 * 
 * MAIN FUNCTIONS:
 * - logJourneyEvent: Logs an event name (called from pushToDataLayer)
 * - UserJourneyTrigger: Executes callbacks when specified events occur
 */

// ========================================
// INTERFACES & TYPES
// ========================================

export interface JourneyLogEvent {
	eventName: string;
	timestamp: string;
	sessionId: string;
}

export interface TriggerConfig {
	triggerId: string;
	eventNames: string[];
	callback: () => void;
	requireAllEvents: boolean; // true = all events must occur, false = any event triggers
	onceOnly: boolean; // true = trigger only once per session
	triggered: boolean; // track if already triggered this session
	lastTriggered?: string; // timestamp when last triggered
}

// ========================================
// STORAGE CONSTANTS
// ========================================

const EVENTS_STORAGE_KEY = 'brandpulse_journey_events';
const SESSION_ID_KEY = 'brandpulse_session_id';
const TRIGGERED_STORAGE_KEY = 'brandpulse_triggered_events';
const MAX_EVENTS_STORED = 1000; // Limit to prevent localStorage overflow

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

// Cache events in memory to reduce localStorage reads
let eventsCache: JourneyLogEvent[] | null = null;
let lastCacheUpdate = 0;
const CACHE_DURATION = 1000; // 1 second cache

// Throttle trigger checking to prevent excessive processing
let triggerCheckTimeout: number | null = null;
const TRIGGER_CHECK_DELAY = 100; // 100ms delay

// ========================================
// SESSION MANAGEMENT
// ========================================

/**
 * Get or create a session ID for this browser session
 */
function getSessionId(): string {
	let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
	if (!sessionId) {
		sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
		sessionStorage.setItem(SESSION_ID_KEY, sessionId);
	}
	return sessionId;
}

/**
 * Get triggered triggers for the current session
 */
function getTriggeredTriggers(): Set<string> {
	try {
		const stored = sessionStorage.getItem(TRIGGERED_STORAGE_KEY);
		return stored ? new Set(JSON.parse(stored)) : new Set();
	} catch (error) {
		console.error('Error reading triggered triggers:', error);
		return new Set();
	}
}

/**
 * Mark a trigger as triggered for the current session
 */
function markTriggerAsTriggered(triggerId: string): void {
	try {
		const triggeredSet = getTriggeredTriggers();
		triggeredSet.add(triggerId);
		sessionStorage.setItem(TRIGGERED_STORAGE_KEY, JSON.stringify([...triggeredSet]));
	} catch (error) {
		console.error('Error saving triggered trigger:', error);
	}
}

// ========================================
// EVENT LOGGING SYSTEM
// ========================================

/**
 * Get all logged events from localStorage with caching
 */
function getLoggedEvents(): JourneyLogEvent[] {
	const now = Date.now();
	
	// Return cached events if cache is still valid
	if (eventsCache && (now - lastCacheUpdate) < CACHE_DURATION) {
		return eventsCache;
	}
	
	try {
		const stored = localStorage.getItem(EVENTS_STORAGE_KEY);
		eventsCache = stored ? JSON.parse(stored) : [];
		lastCacheUpdate = now;
		return eventsCache || [];
	} catch (error) {
		console.error('Error reading logged events:', error);
		eventsCache = [];
		return eventsCache;
	}
}

/**
 * Save events to localStorage with size management and cache update
 */
function saveLoggedEvents(events: JourneyLogEvent[]): void {
	try {
		// Keep only the most recent events if we exceed the limit
		const eventsToStore = events.slice(-MAX_EVENTS_STORED);
		localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(eventsToStore));
		
		// Update cache
		eventsCache = eventsToStore;
		lastCacheUpdate = Date.now();
	} catch (error) {
		console.error('Error saving logged events:', error);
	}
}

/**
 * Add a new event to the log with performance optimizations
 */
function addEventToLog(event: JourneyLogEvent): void {
	const events = getLoggedEvents();
	events.push(event);
	saveLoggedEvents(events);
	
	console.log('📝 Event logged:', event.eventName, event);
	
	// Throttle trigger checking to prevent excessive processing
	if (triggerCheckTimeout) {
		clearTimeout(triggerCheckTimeout);
	}
	
	triggerCheckTimeout = window.setTimeout(() => {
		checkAllTriggers();
		triggerCheckTimeout = null;
	}, TRIGGER_CHECK_DELAY);
}

// ========================================
// MAIN LOGGING FUNCTION
// ========================================

/**
 * logJourneyEvent: Simple function to log an event name
 * This function is called directly from pushToDataLayer in gtm-event-push.ts
 * @param eventName - The event name to log
 */
export function logJourneyEvent(eventName: string): void {
	console.log(`📝 Logging journey event: "${eventName}"`);
	
	const logEvent: JourneyLogEvent = {
		eventName,
		timestamp: new Date().toISOString(),
		sessionId: getSessionId()
	};
	
	console.log('📝 Event details:', logEvent);
	
	addEventToLog(logEvent);
}

// ========================================
// TRIGGER SYSTEM
// ========================================

const activeTriggers = new Map<string, TriggerConfig>();

/**
 * UserJourneyTrigger: Creates a trigger that executes a callback when specific events occur
 * @param eventNames - Array of event names to watch for (e.g., ['utm_landing', 'form_submission'])
 * @param callback - Function to execute when trigger conditions are met
 * @param options - Optional configuration for trigger behavior
 */
export function UserJourneyTrigger(
	eventNames: string[], 
	callback: () => void,
	options: {
		triggerId?: string;
		requireAllEvents?: boolean;
		onceOnly?: boolean;
	} = {}
): string {
	const triggerId = options.triggerId || `trigger_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
	
	const trigger: TriggerConfig = {
		triggerId,
		eventNames,
		callback,
		requireAllEvents: options.requireAllEvents ?? true, // Default: require all events
		onceOnly: options.onceOnly ?? true, // Default: trigger only once
		triggered: false
	};
	
	activeTriggers.set(triggerId, trigger);
	
	console.log(`📡 Trigger registered: ${triggerId} listening for [${eventNames.join(', ')}]`);
	
	// Check if trigger conditions are already met (with delay to prevent immediate loops)
	setTimeout(() => checkTrigger(triggerId), 50);
	
	return triggerId;
}

/**
 * Check if a specific trigger's conditions are met
 */
function checkTrigger(triggerId: string): void {
	const trigger = activeTriggers.get(triggerId);
	if (!trigger) {
		console.warn(`🚨 Trigger not found: ${triggerId}`);
		return;
	}
	
	// Check if trigger has already been triggered in this session
	const triggeredTriggers = getTriggeredTriggers();
	if (trigger.onceOnly && (trigger.triggered || triggeredTriggers.has(triggerId))) {
		console.log(`⏭️ Trigger ${triggerId} already triggered, skipping`);
		return;
	}
	
	const events = getLoggedEvents();
	const currentSessionId = getSessionId();
	
	// Filter to current session events only
	const sessionEvents = events.filter(event => event.sessionId === currentSessionId);
	const sessionEventNames = sessionEvents.map(e => e.eventName);
	
	console.log(`🔍 Checking trigger: ${triggerId}`);
	console.log(`   Required events: [${trigger.eventNames.join(', ')}]`);
	console.log(`   Session events: [${sessionEventNames.join(', ')}]`);
	console.log(`   Require all: ${trigger.requireAllEvents}`);
	
	let conditionMet = false;
	
	if (trigger.requireAllEvents) {
		// All events must be present
		conditionMet = trigger.eventNames.every(eventName => {
			const hasEvent = sessionEvents.some(event => event.eventName === eventName);
			console.log(`     Event '${eventName}': ${hasEvent ? '✅' : '❌'}`);
			return hasEvent;
		});
	} else {
		// Any event triggers
		conditionMet = trigger.eventNames.some(eventName => {
			const hasEvent = sessionEvents.some(event => event.eventName === eventName);
			console.log(`     Event '${eventName}': ${hasEvent ? '✅' : '❌'}`);
			return hasEvent;
		});
	}
	
	console.log(`   Condition met: ${conditionMet ? '✅' : '❌'}`);
	
	if (conditionMet && !trigger.triggered && !triggeredTriggers.has(triggerId)) {
		console.log(`🎯 Trigger activated: ${triggerId}`);
		
		// Mark as triggered in both memory and session storage
		trigger.triggered = true;
		trigger.lastTriggered = new Date().toISOString();
		markTriggerAsTriggered(triggerId);
		
		try {
			// Execute callback with a small delay to prevent immediate recursive calls
			setTimeout(() => {
				trigger.callback();
			}, 10);
		} catch (error) {
			console.error(`Error in trigger callback ${triggerId}:`, error);
		}
	}
}

/**
 * Check all active triggers with performance optimization
 */
function checkAllTriggers(): void {
	// Only check triggers that haven't been triggered yet (if onceOnly is true)
	activeTriggers.forEach((trigger, triggerId) => {
		if (!trigger.onceOnly || !trigger.triggered) {
			checkTrigger(triggerId);
		}
	});
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Get recent events from the current session
 * @param limit - Maximum number of events to return
 */
export function getRecentEvents(limit: number = 50): JourneyLogEvent[] {
	const events = getLoggedEvents();
	const currentSessionId = getSessionId();
	
	return events
		.filter(event => event.sessionId === currentSessionId)
		.slice(-limit)
		.reverse(); // Most recent first
}

/**
 * Get all events for a specific event name
 * @param eventName - Name of the event to filter by
 */
export function getEventsByName(eventName: string): JourneyLogEvent[] {
	const events = getLoggedEvents();
	return events.filter(event => event.eventName === eventName);
}

/**
 * Check if a specific event has occurred in the current session
 * @param eventName - Name of the event to check for
 */
export function hasEventOccurred(eventName: string): boolean {
	const events = getLoggedEvents();
	const currentSessionId = getSessionId();
	
	return events.some(event => 
		event.eventName === eventName && event.sessionId === currentSessionId
	);
}

/**
 * Remove a trigger
 * @param triggerId - ID of the trigger to remove
 */
export function removeTrigger(triggerId: string): boolean {
	const removed = activeTriggers.delete(triggerId);
	if (removed) {
		console.log(`🗑️ Trigger removed: ${triggerId}`);
	}
	return removed;
}

/**
 * Clear all logged events and invalidate cache
 */
export function clearEventLog(): void {
	try {
		localStorage.removeItem(EVENTS_STORAGE_KEY);
		sessionStorage.removeItem(TRIGGERED_STORAGE_KEY); // Also clear triggered triggers
		eventsCache = null; // Invalidate cache
		lastCacheUpdate = 0;
		
		// Reset all active triggers
		activeTriggers.forEach(trigger => {
			trigger.triggered = false;
			trigger.lastTriggered = undefined;
		});
		
		console.log('🗑️ Event log and triggered triggers cleared');
	} catch (error) {
		console.error('Error clearing event log:', error);
	}
}

/**
 * Get all active triggers (for debugging)
 */
export function getActiveTriggers(): TriggerConfig[] {
	return Array.from(activeTriggers.values());
}

/**
 * Clear all triggers
 */
export function clearAllTriggers(): void {
	activeTriggers.clear();
	console.log('🗑️ All triggers cleared');
}

// ========================================
// DEBUGGING UTILITIES
// ========================================

/**
 * Log current journey state for debugging
 */
export function debugJourneyState(): void {
	console.group('🔍 Journey Debug Information');
	console.log('Session ID:', getSessionId());
	console.log('Recent Events:', getRecentEvents(10));
	console.log('Active Triggers:', getActiveTriggers());
	console.log('Events Cache Status:', eventsCache ? `${eventsCache.length} events cached` : 'No cache');
	console.groupEnd();
}