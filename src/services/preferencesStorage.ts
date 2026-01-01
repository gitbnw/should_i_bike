import { type BikePreferencesRequest } from '../types/biking.types';

const PREFERENCES_STORAGE_KEY = 'bikePreferences';
const LOCATION_STORAGE_KEY = 'savedLocation';

interface SavedLocation {
  zipCode: string;
  lat: number;
  lon: number;
  cityName?: string;
}

// ============ PREFERENCES STORAGE ============

/**
 * saves preferences to localStorage
 */
export const savePreferences = (preferences: BikePreferencesRequest): void => {
  try {
    console.log('[PreferencesStorage] savePreferences called with:', preferences);
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
    console.log('[PreferencesStorage] Preferences saved successfully');
  } catch (error) {
    console.error('Failed to save preferences:', error);
  }
};

/**
 * loads user preferences from localStorage
 * Returns null if no preferences are saved
 */
export const loadPreferences = (): BikePreferencesRequest | null => {
  try {
    const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load preferences:', error);
    return null;
  }
};

/**
 * Clear saved preferences from localStorage
 */
export const clearPreferences = (): void => {
  try {
    localStorage.removeItem(PREFERENCES_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear preferences:', error);
  }
};

/**
 * Check if preferences are currently saved
 */
export const hasSavedPreferences = (): boolean => {
  const result = localStorage.getItem(PREFERENCES_STORAGE_KEY) !== null;
  console.log('[PreferencesStorage] hasSavedPreferences called:', result, 'key:', PREFERENCES_STORAGE_KEY);
  return result;
};

// ============ LOCATION STORAGE ============

/**
 * Saves location to localStorage
 */
export const saveLocation = (location: SavedLocation): void => {
  try {
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
  } catch (error) {
    console.error('Failed to save location:', error);
  }
};

/**
 * Loads saved location from localStorage
 * Returns null if no location is saved
 */
export const loadLocation = (): SavedLocation | null => {
  try {
    const stored = localStorage.getItem(LOCATION_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load location:', error);
    return null;
  }
};

/**
 * Clear saved location from localStorage
 */
export const clearLocation = (): void => {
  try {
    localStorage.removeItem(LOCATION_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear location:', error);
  }
};

/**
 * Check if location is currently saved
 */
export const hasSavedLocation = (): boolean => {
  return localStorage.getItem(LOCATION_STORAGE_KEY) !== null;
};

// ============ QUICK CHECK HELPERS ============

/**
 * Check if user has both saved location and preferences (eligible for one-click check)
 */
export const canQuickCheck = (): boolean => {
  return hasSavedLocation() && hasSavedPreferences();
};
