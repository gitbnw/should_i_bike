/**
 * Constants for API requests and timeout configuration
 */

/**
 * Default timeout for API requests in milliseconds (10 seconds)
 * Sent to backend via X-Timeout-MS header so backend can respect client timeout
 * and avoid wasting resources on abandoned requests
 */
export const DEFAULT_API_TIMEOUT_MS = 10000;

/**
 * Header name for client-specified timeout
 * Backend reads this to know when to stop processing
 */
export const TIMEOUT_HEADER = 'X-Timeout-MS';
