/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { savePreferences, loadPreferences, clearPreferences, hasSavedPreferences } from './preferencesStorage';
import { DEFAULT_BIKE_PREFERENCES } from '../types/biking.types';

describe('preferencesStorage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('savePreferences', () => {
    it('saves preferences to localStorage', () => {
      const preferences = DEFAULT_BIKE_PREFERENCES;
      
      savePreferences(preferences);
      
      const stored = localStorage.getItem('bikePreferences');
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored!)).toEqual(preferences);
    });

    it('overwrites existing preferences', () => {
      const firstPreferences = DEFAULT_BIKE_PREFERENCES;
      const secondPreferences = {
        ...DEFAULT_BIKE_PREFERENCES,
        minTemp: 50,
        maxTemp: 90,
      };
      
      savePreferences(firstPreferences);
      savePreferences(secondPreferences);
      
      const stored = localStorage.getItem('bikePreferences');
      expect(JSON.parse(stored!)).toEqual(secondPreferences);
    });

    it('handles localStorage errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const setItemSpy = vi.spyOn(globalThis.localStorage, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      
      expect(() => savePreferences(DEFAULT_BIKE_PREFERENCES)).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
      setItemSpy.mockRestore();
    });
  });

  describe('loadPreferences', () => {
    it('returns null when no preferences are saved', () => {
      const loaded = loadPreferences();
      
      expect(loaded).toBeNull();
    });

    it('loads saved preferences from localStorage', () => {
      const preferences = DEFAULT_BIKE_PREFERENCES;
      localStorage.setItem('bikePreferences', JSON.stringify(preferences));
      
      const loaded = loadPreferences();
      
      expect(loaded).toEqual(preferences);
    });

    it('loads custom preferences correctly', () => {
      const customPreferences = {
        minTemp: 35,
        maxTemp: 95,
        maxWindSpeed: 25,
        okWithPrecipitation: true,
        maxUvIndex: 12,
        maxAqi: 200,
      };
      localStorage.setItem('bikePreferences', JSON.stringify(customPreferences));
      
      const loaded = loadPreferences();
      
      expect(loaded).toEqual(customPreferences);
    });

    it('handles invalid JSON gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem('bikePreferences', 'invalid json{');
      
      const loaded = loadPreferences();
      
      expect(loaded).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('handles localStorage errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const getItemSpy = vi.spyOn(globalThis.localStorage, 'getItem').mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });
      
      const loaded = loadPreferences();
      
      expect(loaded).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
      getItemSpy.mockRestore();
    });
  });

  describe('clearPreferences', () => {
    it('removes preferences from localStorage', () => {
      localStorage.setItem('bikePreferences', JSON.stringify(DEFAULT_BIKE_PREFERENCES));
      
      clearPreferences();
      
      expect(localStorage.getItem('bikePreferences')).toBeNull();
    });

    it('does not throw error when nothing is stored', () => {
      expect(() => clearPreferences()).not.toThrow();
    });

    it('handles localStorage errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const removeItemSpy = vi.spyOn(globalThis.localStorage, 'removeItem').mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });
      
      expect(() => clearPreferences()).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
      removeItemSpy.mockRestore();
    });
  });

  describe('hasSavedPreferences', () => {
    it('returns false when no preferences are saved', () => {
      expect(hasSavedPreferences()).toBe(false);
    });

    it('returns true when preferences are saved', () => {
      localStorage.setItem('bikePreferences', JSON.stringify(DEFAULT_BIKE_PREFERENCES));
      
      expect(hasSavedPreferences()).toBe(true);
    });

    it('returns false after preferences are cleared', () => {
      localStorage.setItem('bikePreferences', JSON.stringify(DEFAULT_BIKE_PREFERENCES));
      clearPreferences();
      
      expect(hasSavedPreferences()).toBe(false);
    });
  });

  describe('Integration', () => {
    it('completes full save-load-clear cycle', () => {
      const preferences = {
        minTemp: 40,
        maxTemp: 85,
        maxWindSpeed: 20,
        okWithPrecipitation: false,
        maxUvIndex: 8,
        maxAqi: 100,
      };
      
      // Save
      savePreferences(preferences);
      expect(hasSavedPreferences()).toBe(true);
      
      // Load
      const loaded = loadPreferences();
      expect(loaded).toEqual(preferences);
      
      // Clear
      clearPreferences();
      expect(hasSavedPreferences()).toBe(false);
      expect(loadPreferences()).toBeNull();
    });
  });
});
