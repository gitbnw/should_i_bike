import { BikeDecisionResponse } from '../types/api';

const API_BASE_URL = 'http://localhost:3000';

export const bikeApi = {
  /**
   * Fetches bike decision for tomorrow based on location
   */
  async shouldBikeTomorrow(lat: number, lon: number): Promise<BikeDecisionResponse> {
    const response = await fetch(
      `${API_BASE_URL}/v1/weather/bike/should-i-ride-tomorrow?lat=${lat}&lon=${lon}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  },
};
