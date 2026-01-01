/**
 * Utility for handling Bike API error responses
 * Extracts detailed error messages from backend responses to provide better UX
 */

/**
 * Parse an HTTP error response and extract the error message
 * Handles various backend error response formats (NestJS, custom, etc.)
 * 
 * @param response - The failed fetch Response object
 * @returns Promise resolving to a user-friendly error message
 */
export async function parseBikeApiError(response: Response): Promise<string> {
  let errorMessage = `Bike API error: ${response.statusText}`;
  
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
 * Fetch wrapper with enhanced error handling
 * Use this instead of raw fetch() to get better error messages
 * 
 * @param url - The URL to fetch
 * @param options - Fetch options (method, headers, body, etc.)
 * @returns Promise resolving to the parsed JSON response
 * @throws Error with detailed message from backend
 */
export async function bikeApiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorMessage = await parseBikeApiError(response);
    throw new Error(errorMessage);
  }
  
  return response.json();
}
