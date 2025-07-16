/**
 * Debug Mode Manager for ARDA Analytics
 * Handles debugging functionality across the plugin
 */

let debugEnabled = false;

/**
 * Initialize debug mode based on configuration
 * @param enabled - Whether debug mode should be enabled
 */
export function initDebugMode(enabled: boolean): void {
	debugEnabled = enabled;
}

/**
 * Check if debug mode is currently enabled
 * @returns boolean indicating if debug mode is active
 */
export function isDebugMode(): boolean {
	return debugEnabled;
}

/**
 * Toggle debug mode on/off
 */
export function toggleDebugMode(): boolean {
	debugEnabled = !debugEnabled;
	return debugEnabled;
}

/**
 * Debug logger that only logs when debug mode is enabled
 * @param message - Message to log
 * @param data - Optional data to log
 */
export function debugLog(message: string, data?: unknown): void {
	if (debugEnabled) {
		console.log(`🔧 ARDA Debug: ${message}`, data || '');
	}
}

/**
 * Debug error logger that only logs when debug mode is enabled
 * @param message - Error message to log
 * @param error - Optional error object to log
 */
export function debugError(message: string, error?: unknown): void {
	if (debugEnabled) {
		console.error(`❌ ARDA Debug Error: ${message}`, error || '');
	}
}

// Export debug mode status as a getter
export function getDebugMode(): boolean {
	return debugEnabled;
}
