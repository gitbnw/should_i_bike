import { type BikeDecisionResponse, type BikePreferencesRequest } from '../types/biking.types';

const API_BASE_URL = 'http://localhost:3000';

export const bikeApi = {
  /**
   * Fetches bike decision for tomorrow based on location and user preferences
   */
  async shouldBikeTomorrow(
    lat: number,
    lon: number,
    preferences: BikePreferencesRequest,
  ): Promise<BikeDecisionResponse> {
    const response = await fetch(
      `${API_BASE_URL}/v1/weather/bike/should-i-ride-tomorrow?lat=${lat}&lon=${lon}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  },
};
