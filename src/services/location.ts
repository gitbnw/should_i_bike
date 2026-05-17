import { bikeApiFetch } from './bikeApi';
import { buildApiUrl } from './apiBaseUrl';

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
      buildApiUrl(`/v1/location/zip?zipCode=${zipCode}`)
    );
  },
};
