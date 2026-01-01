/**
 * Utility for handling Bike API error responses
 * Extracts detailed error messages from backend responses to provide better UX
 */

import { DEFAULT_API_TIMEOUT_MS, TIMEOUT_HEADER } from './constants';

/**
 * Parse an HTTP error response and extract the error message
 * Handles various backend error response formats (NestJS, custom, etc.)
 * 
 * @param response - The failed fetch Response object
 * @returns Promise resolving to a user-friendly error message
 */
export async function parseBikeApiError(response: Response): Promise<string> {
  let errorMessage = `Bike API error: ${response.statusText}`;
  
  // Handle timeout errors specifically
  if (response.status === 504) {
    return 'Request timed out. The server took too long to respond. Please try again.';
  }
  
  try {
    const errorData = await response.json();
    
    // Handle NestJS/Express error responses with 'message' field
    if (errorData.message) {
      // NestJS validation errors can be an array
      errorMessage = Array.isArray(errorData.message) 
        ? errorData.message.join(', ') 
        : errorData.message;
    } 
    // Some APIs use 'error' field instead
    else if (errorData.error) {
      errorMessage = errorData.error;
    }
    // Custom error detail field
    else if (errorData.detail) {
      errorMessage = errorData.detail;
    }
  } catch {
    // If response body isn't JSON or parsing fails, fall back to statusText
    // This handles cases where backend returns plain text or is completely down
  }
  
  return errorMessage;
}

/**
 * Fetch wrapper with enhanced error handling and timeout support
 * Use this instead of raw fetch() to get better error messages
 * 
 * @param url - The URL to fetch
 * @param options - Fetch options (method, headers, body, etc.)
 * @param timeoutMs - Request timeout in milliseconds (defaults to DEFAULT_API_TIMEOUT_MS)
 * @returns Promise resolving to the parsed JSON response
 * @throws Error with detailed message from backend or timeout error
 */
export async function bikeApiFetch<T>(
  url: string, 
  options?: RequestInit,
  timeoutMs: number = DEFAULT_API_TIMEOUT_MS,
): Promise<T> {
  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  // Add X-Timeout-MS header so backend knows when to stop processing
  const headers = new Headers(options?.headers);
  headers.set(TIMEOUT_HEADER, String(timeoutMs));
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorMessage = await parseBikeApiError(response);
      throw new Error(errorMessage);
    }
    
    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Handle timeout errors
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(
        `Request timed out after ${timeoutMs}ms. The server is taking too long to respond. Please try again.`
      );
    }
    
    throw error;
  }
}
