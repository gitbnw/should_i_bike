import { type BikeDecisionResponse, type BikePreferencesRequest } from '../types/biking.types';
import { bikeApiFetch } from './bikeApi';
import { buildApiUrl } from './apiBaseUrl';

export const bikeApi = {
  /**
   * Fetches bike decision for tomorrow based on location and user preferences
   */
  async shouldBikeTomorrow(
    lat: number,
    lon: number,
    preferences: BikePreferencesRequest,
  ): Promise<BikeDecisionResponse> {
    return bikeApiFetch<BikeDecisionResponse>(
      buildApiUrl(`/v1/weather/bike/should-i-ride-tomorrow?lat=${lat}&lon=${lon}`),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      }
    );
  },
};
