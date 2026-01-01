import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseBikeApiError, bikeApiFetch } from './bikeApi';

// Mock fetch globally
globalThis.fetch = vi.fn();

describe('bikeApi utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('parseBikeApiError', () => {
    it('should extract message from NestJS error response', async () => {
      const mockResponse = {
        json: async () => ({ message: 'Weather API rate limit exceeded' }),
      } as unknown as Response;

      const result = await parseBikeApiError(mockResponse);
      expect(result).toBe('Weather API rate limit exceeded');
    });

    it('should handle array of validation errors', async () => {
      const mockResponse = {
        json: async () => ({ 
          message: ['minTemp must be a number', 'maxTemp must be a number'] 
        }),
      } as unknown as Response;

      const result = await parseBikeApiError(mockResponse);
      expect(result).toBe('minTemp must be a number, maxTemp must be a number');
    });

    it('should extract error field if message is not present', async () => {
      const mockResponse = {
        json: async () => ({ error: 'Service unavailable' }),
      } as unknown as Response;

      const result = await parseBikeApiError(mockResponse);
      expect(result).toBe('Service unavailable');
    });

    it('should extract detail field as fallback', async () => {
      const mockResponse = {
        json: async () => ({ detail: 'Invalid coordinates provided' }),
      } as unknown as Response;

      const result = await parseBikeApiError(mockResponse);
      expect(result).toBe('Invalid coordinates provided');
    });

    it('should fallback to statusText when response is not JSON', async () => {
      const mockResponse = {
        statusText: 'Internal Server Error',
        json: async () => { throw new Error('Not JSON'); },
      } as unknown as Response;

      const result = await parseBikeApiError(mockResponse);
      expect(result).toBe('Bike API error: Internal Server Error');
    });

    it('should fallback to statusText when no known error fields exist', async () => {
      const mockResponse = {
        statusText: 'Bad Gateway',
        json: async () => ({ unknownField: 'some value' }),
      } as unknown as Response;

      const result = await parseBikeApiError(mockResponse);
      expect(result).toBe('Bike API error: Bad Gateway');
    });
  });

  describe('bikeApiFetch', () => {
    const mockUrl = 'http://localhost:3000/api/test';

    it('should successfully fetch and parse JSON response', async () => {
      const mockData = { result: 'success', data: { temperature: 72 } };

      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await bikeApiFetch(mockUrl);

      expect(globalThis.fetch).toHaveBeenCalledWith(mockUrl, undefined);
      expect(result).toEqual(mockData);
    });

    it('should pass fetch options correctly', async () => {
      const mockData = { success: true };
      const fetchOptions: RequestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: 'data' }),
      };

      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await bikeApiFetch(mockUrl, fetchOptions);

      expect(globalThis.fetch).toHaveBeenCalledWith(mockUrl, fetchOptions);
    });

    it('should throw error with parsed message when response is not ok', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
        json: async () => ({ message: 'Invalid parameters provided' }),
      });

      await expect(bikeApiFetch(mockUrl)).rejects.toThrow('Invalid parameters provided');
    });

    it('should throw error with statusText when error parsing fails', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        statusText: 'Service Unavailable',
        json: async () => { throw new Error('Parse error'); },
      });

      await expect(bikeApiFetch(mockUrl)).rejects.toThrow('Bike API error: Service Unavailable');
    });

    it('should handle typed responses correctly', async () => {
      interface TestResponse {
        id: number;
        name: string;
      }

      const mockData: TestResponse = { id: 1, name: 'Test' };

      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await bikeApiFetch<TestResponse>(mockUrl);

      expect(result.id).toBe(1);
      expect(result.name).toBe('Test');
    });

    it('should handle network errors by throwing', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(bikeApiFetch(mockUrl)).rejects.toThrow('Network error');
    });

    it('should handle 401 unauthorized with backend error message', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ message: 'Weather API authentication failed: Check if your API key is activated.' }),
      });

      await expect(bikeApiFetch(mockUrl)).rejects.toThrow(
        'Weather API authentication failed: Check if your API key is activated.'
      );
    });

    it('should handle 429 rate limit errors', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        json: async () => ({ message: 'Weather API rate limit exceeded' }),
      });

      await expect(bikeApiFetch(mockUrl)).rejects.toThrow('Weather API rate limit exceeded');
    });

    it('should handle 503 service unavailable', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
        json: async () => ({ error: 'Weather API is currently unavailable' }),
      });

      await expect(bikeApiFetch(mockUrl)).rejects.toThrow('Weather API is currently unavailable');
    });
  });
});
