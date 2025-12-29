import { describe, it, expect, vi, beforeEach } from 'vitest';
import { bikeApi } from './biking';
import { BikeDecisionStatus } from '../types/biking.types';

// Mock fetch globally
globalThis.fetch = vi.fn();

describe('bikeApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('shouldBikeTomorrow', () => {
    const mockLat = 40.7128;
    const mockLon = -74.0060;
    const mockPreferences = {
      minTemp: 40,
      maxTemp: 85,
      maxWindSpeed: 15,
      okWithPrecipitation: false,
      maxUvIndex: 8,
      maxAqi: 100,
    };

    it('should successfully fetch bike decision for perfect conditions', async () => {
      const mockResponse = {
        shouldBike: true,
        status: BikeDecisionStatus.PERFECT,
        reason: 'Perfect conditions! 45-75°F, 10mph winds',
        forecast: {
          date: '2025-12-27',
          tempMin: 45,
          tempMax: 75,
          windSpeed: 10,
          precipitation: false,
          uvi: 5,
          aqi: 50,
        },
        preferences: mockPreferences,
      };

      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await bikeApi.shouldBikeTomorrow(mockLat, mockLon, mockPreferences);

      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:3000/v1/weather/bike/should-i-ride-tomorrow?lat=${mockLat}&lon=${mockLon}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockPreferences),
        }
      );

      expect(result).toEqual(mockResponse);
      expect(result.shouldBike).toBe(true);
      expect(result.status).toBe(BikeDecisionStatus.PERFECT);
    });

    it('should return negative decision when too cold', async () => {
      const mockResponse = {
        shouldBike: false,
        status: BikeDecisionStatus.TOO_COLD,
        reason: 'Too cold - low of 32°F (min: 40°F)',
        forecast: {
          date: '2025-12-27',
          tempMin: 32,
          tempMax: 50,
          windSpeed: 8,
          precipitation: false,
          uvi: 3,
          aqi: 45,
        },
        preferences: mockPreferences,
      };

      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await bikeApi.shouldBikeTomorrow(mockLat, mockLon, mockPreferences);

      expect(result.shouldBike).toBe(false);
      expect(result.status).toBe(BikeDecisionStatus.TOO_COLD);
    });

    it('should throw error when API returns non-ok response', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
      });

      await expect(
        bikeApi.shouldBikeTomorrow(mockLat, mockLon, mockPreferences)
      ).rejects.toThrow('API error: Internal Server Error');
    });

    it('should throw error when fetch fails', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(
        bikeApi.shouldBikeTomorrow(mockLat, mockLon, mockPreferences)
      ).rejects.toThrow('Network error');
    });

    it('should handle 503 service unavailable', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        statusText: 'Service Unavailable',
      });

      await expect(
        bikeApi.shouldBikeTomorrow(mockLat, mockLon, mockPreferences)
      ).rejects.toThrow('API error: Service Unavailable');
    });

    it('should correctly serialize preferences in request body', async () => {
      const customPreferences = {
        minTemp: 50,
        maxTemp: 90,
        maxWindSpeed: 20,
        okWithPrecipitation: true,
        maxUvIndex: 10,
        maxAqi: 150,
      };

      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ shouldBike: true, status: BikeDecisionStatus.PERFECT }),
      });

      await bikeApi.shouldBikeTomorrow(mockLat, mockLon, customPreferences);

      const fetchCall = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);

      expect(requestBody).toEqual(customPreferences);
      expect(requestBody.okWithPrecipitation).toBe(true);
    });
  });
});
