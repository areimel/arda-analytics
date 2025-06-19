/**
 * @fileoverview JSDoc Type Definitions for ARDA Analytics
 */

/**
 * @typedef {Object} ARDAConfig
 * @property {AutoTrackConfig} autoTrack - Auto-tracking configuration
 * @property {StorageConfig} storage - Storage configuration
 * @property {APIConfig} api - API configuration
 * @property {PrivacyConfig} privacy - Privacy configuration
 * @property {DebugConfig} debug - Debug configuration
 */

/**
 * @typedef {Object} AutoTrackConfig
 * @property {boolean} pageViews - Enable automatic page view tracking
 * @property {boolean} clicks - Enable automatic click tracking
 * @property {boolean} forms - Enable automatic form tracking
 * @property {boolean} scrollDepth - Enable automatic scroll depth tracking
 */

/**
 * @typedef {Object} StorageConfig
 * @property {boolean} enabled - Enable local storage
 * @property {'localStorage'|'sessionStorage'|'memory'} type - Storage type
 * @property {string} prefix - Storage key prefix
 * @property {number} maxEvents - Maximum events to store
 */

/**
 * @typedef {Object} APIConfig
 * @property {boolean} enabled - Enable API sending
 * @property {string} endpoint - API endpoint URL
 * @property {string} apiKey - API authentication key
 * @property {number} timeout - Request timeout in milliseconds
 * @property {number} retryAttempts - Number of retry attempts
 */

/**
 * @typedef {Object} PrivacyConfig
 * @property {boolean} respectDoNotTrack - Respect Do Not Track setting
 * @property {boolean} anonymizeIp - Anonymize IP addresses
 * @property {boolean} cookieConsent - Require cookie consent
 */

/**
 * @typedef {Object} DebugConfig
 * @property {boolean} enabled - Enable debug mode
 * @property {'error'|'warn'|'info'|'debug'} logLevel - Log level
 * @property {boolean} verbose - Enable verbose logging
 */

/**
 * @typedef {Object} EventData
 * @property {string} event - Event name
 * @property {Object} properties - Event properties
 * @property {number} timestamp - Event timestamp
 * @property {string} url - Page URL
 * @property {string} userAgent - User agent string
 */

/**
 * @typedef {Object} ElementData
 * @property {string} tagName - Element tag name
 * @property {string|null} id - Element ID
 * @property {string|null} classes - Element classes
 * @property {string} text - Element text content
 * @property {string|null} href - Element href attribute
 * @property {Object} dataset - Element data attributes
 * @property {ElementPosition} position - Element position
 */

/**
 * @typedef {Object} ElementPosition
 * @property {number} x - X coordinate
 * @property {number} y - Y coordinate
 * @property {number} width - Element width
 * @property {number} height - Element height
 */

/**
 * @typedef {Object} ViewportSize
 * @property {number} width - Viewport width
 * @property {number} height - Viewport height
 */

/**
 * @typedef {Object} ScrollPosition
 * @property {number} x - Horizontal scroll position
 * @property {number} y - Vertical scroll position
 */

/**
 * @typedef {Object} PageInfo
 * @property {string} url - Full URL
 * @property {string} pathname - URL pathname
 * @property {string} search - URL search parameters
 * @property {string} hash - URL hash
 * @property {string} title - Page title
 * @property {string} referrer - Referrer URL
 */

/**
 * @typedef {Object} UserAgent
 * @property {string} raw - Raw user agent string
 * @property {BrowserInfo} browser - Browser information
 * @property {OSInfo} os - Operating system information
 * @property {DeviceInfo} device - Device information
 */

/**
 * @typedef {Object} BrowserInfo
 * @property {string} name - Browser name
 * @property {string} version - Browser version
 */

/**
 * @typedef {Object} OSInfo
 * @property {string} name - Operating system name
 * @property {string} version - Operating system version
 */

/**
 * @typedef {Object} DeviceInfo
 * @property {'desktop'|'mobile'|'tablet'} type - Device type
 * @property {boolean} isMobile - Is mobile device
 * @property {boolean} isTablet - Is tablet device
 * @property {boolean} isDesktop - Is desktop device
 */

export {}; // Make this a module 