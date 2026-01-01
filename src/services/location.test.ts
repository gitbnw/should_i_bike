import { describe, it, expect, vi, beforeEach } from 'vitest';
import { locationApi, type LocationResponse } from './location';

// Mock fetch globally
globalThis.fetch = vi.fn();

describe('locationApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getLocationByZipCode', () => {
    const mockZipCode = '10001';

    it('should successfully fetch location data for valid zip code', async () => {
      const mockResponse: LocationResponse = {
        zipCode: '10001',
        name: 'New York',
        lat: 40.7506,
        lon: -73.9971,
        country: 'US',
      };

      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await locationApi.getLocationByZipCode(mockZipCode);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/v1/location/zip?zipCode=10001',
        expect.objectContaining({
          headers: expect.any(Headers),
          signal: expect.any(AbortSignal),
        })
      );

      expect(result).toEqual(mockResponse);
      expect(result.zipCode).toBe('10001');
      expect(result.name).toBe('New York');
    });

    it('should throw user-friendly error for 404 not found', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Zip code not found. Please verify it\'s a valid US zip code.' }),
      });

      await expect(
        locationApi.getLocationByZipCode('99999')
      ).rejects.toThrow('Zip code not found. Please verify it\'s a valid US zip code.');
    });

    it('should throw user-friendly error for 400 bad request', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ message: 'Invalid zip code format. Please enter a 5-digit US zip code.' }),
      });

      await expect(
        locationApi.getLocationByZipCode('invalid')
      ).rejects.toThrow('Invalid zip code format. Please enter a 5-digit US zip code.');
    });

    it('should throw user-friendly error for 503 service unavailable', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
        json: async () => ({ message: 'Location service is temporarily unavailable. Please try again later.' }),
      });

      await expect(
        locationApi.getLocationByZipCode(mockZipCode)
      ).rejects.toThrow('Location service is temporarily unavailable. Please try again later.');
    });

    it('should throw generic error for other HTTP errors', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ message: 'Failed to lookup location' }),
      });

      await expect(
        locationApi.getLocationByZipCode(mockZipCode)
      ).rejects.toThrow('Failed to lookup location');
    });

    it('should handle network errors', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network connection failed')
      );

      await expect(
        locationApi.getLocationByZipCode(mockZipCode)
      ).rejects.toThrow('Network connection failed');
    });

    it('should construct correct URL with zip code query parameter', async () => {
      const zipCode = '90210';

      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          zipCode,
          name: 'Beverly Hills',
          lat: 34.0901,
          lon: -118.4065,
          country: 'US',
        }),
      });

      await locationApi.getLocationByZipCode(zipCode);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/v1/location/zip?zipCode=90210',
        expect.objectContaining({
          headers: expect.any(Headers),
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('should parse JSON response correctly', async () => {
      const mockResponse: LocationResponse = {
        zipCode: '94102',
        name: 'San Francisco',
        lat: 37.7799,
        lon: -122.4194,
        country: 'US',
      };

      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await locationApi.getLocationByZipCode('94102');

      expect(result.lat).toBe(37.7799);
      expect(result.lon).toBe(-122.4194);
      expect(typeof result.lat).toBe('number');
      expect(typeof result.lon).toBe('number');
    });
  });
});
