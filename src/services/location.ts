import { bikeApiFetch } from './bikeApi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

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
    return bikeApiFetch<LocationResponse>(
      `${API_BASE_URL}/v1/location/zip?zipCode=${zipCode}`
    );
  },
};
