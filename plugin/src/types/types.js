/**
 * @fileoverview JSDoc Type Definitions for ARDA Analytics
 */

/**
 * @typedef {Object} ARDAConfig
 * @property {Object} autoTrack - Auto-tracking configuration
 * @property {Object} storage - Storage configuration
 * @property {Object} api - API configuration
 * @property {Object} privacy - Privacy configuration
 * @property {Object} debug - Debug configuration
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
 */

/**
 * @typedef {Object} PageInfo
 * @property {string} url - Full URL
 * @property {string} pathname - URL pathname
 * @property {string} title - Page title
 * @property {string} referrer - Referrer URL
 */

export {}; // Make this a module
