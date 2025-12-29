const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface LocationResponse {
  zipCode: string;
  name: string;
  lat: number;
  lon: number;
  country: string;
}

export const locationApi = {
  /**
   * Get location data from a US zip code
   */
  async getLocationByZipCode(zipCode: string): Promise<LocationResponse> {
    const response = await fetch(`${API_BASE_URL}/v1/location/zip?zipCode=${zipCode}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Zip code not found. Please verify it\'s a valid US zip code.');
      } else if (response.status === 400) {
        throw new Error('Invalid zip code format. Please enter a 5-digit US zip code.');
      } else if (response.status === 503) {
        throw new Error('Location service is temporarily unavailable. Please try again later.');
      }
      throw new Error('Failed to lookup location');
    }
    
    return response.json();
  },
};
