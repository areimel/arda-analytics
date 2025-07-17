# Analytics Micro Services

This directory contains small, focused analytics services for the BrandPulse application.

## Services Overview

### 1. GTM Event Push (`gtm-event-push.ts`)
Handles pushing events to Google Tag Manager's dataLayer.

**Key Functions:**
- `pushToDataLayer()` - Sends events to GTM
- `isGTMAvailable()` - Checks if GTM is loaded

### 2. User Journey Tracking (`user-journey-tracking.ts`) ⭐ **UPDATED**
**Simplified system for tracking user journeys and triggering conversions.**

The new system is much simpler than the previous version:
- **No complex journey configurations needed**
- **Automatic monitoring of all dataLayer events**
- **Simple trigger system based on event patterns**
- **Persistent storage across browser sessions**

#### Key Functions:

**`UserJourneyLog()`**
- Sets up automatic monitoring of all GTM dataLayer events
- Stores every event with timestamp in localStorage
- Should be called once during app initialization
- Creates a comprehensive log of all user activity

**`UserJourneyTrigger(eventNames, callback, options)`**
- Creates triggers that fire when specific event patterns occur
- Monitors the event log for the specified events
- Executes callback when conditions are met

**Example Usage:**
```typescript
import { UserJourneyLog, UserJourneyTrigger } from './user-journey-tracking';

// Initialize logging (call once during app startup)
UserJourneyLog();

// Set up a conversion trigger
UserJourneyTrigger(
	['utm_landing', 'form_submission'], // Events to watch for
	() => {
		// This fires when BOTH events have occurred
		console.log('Conversion completed!');
		AnalyticsService.sendGTMEvent({
			action: 'conversion_complete',
			category: 'conversions',
			label: 'lead_generation',
    value: 1
		}, 'conversion');
	},
	{
		triggerId: 'lead_conversion',
		requireAllEvents: true, // Must have ALL events (default)
		onceOnly: true // Trigger only once per session (default)
	}
);
```

#### Utility Functions:
- `getRecentEvents(limit)` - Get recent events from current session
- `hasEventOccurred(eventName)` - Check if specific event occurred
- `clearEventLog()` - Clear all logged events
- `debugJourneyState()` - Log debug information to console

#### Trigger Options:
- `triggerId` - Unique identifier for the trigger
- `requireAllEvents` - true = all events must occur, false = any event triggers (default: true)
- `onceOnly` - true = trigger only once per session, false = can trigger multiple times (default: true)

### 3. Form Tracking (`form-tracking.ts`)
Utilities for tracking form interactions and submissions.

### 4. UTM Tracking (`utm-tracking.ts`)
Handles UTM parameter capture and storage.

### 5. Deprecated (`deprecated.ts`)
Contains legacy functions that have been replaced but kept for reference.

## Migration from Old System

The old user journey tracking system required:
1. Pre-defining journey configurations
2. Managing journey IDs and steps
3. Manually marking steps as complete
4. Complex trigger registration

The new system only requires:
1. Call `UserJourneyLog()` once during app init
2. Set up triggers with `UserJourneyTrigger()`
3. Events are automatically logged when they occur

**Old Way:**
```typescript
// Complex setup required
const journeyConfig = {
	id: 'linkedin_conversion',
	steps: [
		{ id: 'utm_landing', name: 'UTM Landing' },
		{ id: 'form_submit', name: 'Form Submission' }
	],
	// ... more config
};

initializeJourney(journeyConfig);
markStepComplete('linkedin_conversion', 'utm_landing');
markStepComplete('linkedin_conversion', 'form_submit');
```

**New Way:**
```typescript
// Simple setup
UserJourneyLog(); // Call once
UserJourneyTrigger(['utm_landing', 'form_submit'], () => {
	// Conversion completed!
});
```

## Testing

Use the Journey Tracking Demo at `/demos/journey-tracking` to test the system:
- Send test events
- Monitor real-time event logging
- See triggers activate when conditions are met
- Debug with console utilities

## Benefits of New System

1. **Simplicity** - No complex configurations needed
2. **Reliability** - Direct monitoring of dataLayer events
3. **Flexibility** - Easy to set up new triggers
4. **Debugging** - Better visibility into what's happening
5. **Performance** - More efficient event processing
6. **Maintenance** - Much less code to maintain

## Integration

The new system is already integrated into:
- `analytics-functions.service.ts` - Uses new triggers for LinkedIn ad conversions
- `analytics.service.ts` - Initializes logging on startup
- Component forms - Continue to push events directly to GTM as before

The key advantage is that form components don't need to change - they just push events to GTM as usual, and the new system automatically captures and processes them.

## Files in this Directory

- `utm-tracking.ts` - UTM parameter capture and management
- `utm-form.ts` - Automatic form integration with UTM data
- `gtm-event-push.ts` - Google Tag Manager event handling
- `user-journey-tracking.ts` - Multi-step journey conversion tracking
- `README.md` - This documentation file

## Testing

Each micro-service can be tested independently. See the `__tests__` directory in the parent services folder for examples.

The journey tracking system includes comprehensive TypeScript types and error handling to make debugging easier.

## Support

For questions about these micro-services or suggestions for new features, check the main services documentation or the project's issue tracker. 