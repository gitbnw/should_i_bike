import { type BikePreferencesRequest } from '../types/biking.types';

const STORAGE_KEY = 'bikePreferences';

/**
 * saves preferences to localStorage
 */
export const savePreferences = (preferences: BikePreferencesRequest): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
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
    const stored = localStorage.getItem(STORAGE_KEY);
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
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear preferences:', error);
  }
};

/**
 * Check if preferences are currently saved
 */
export const hasSavedPreferences = (): boolean => {
  return localStorage.getItem(STORAGE_KEY) !== null;
};
