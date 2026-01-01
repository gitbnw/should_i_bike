import { useState, useEffect } from 'react';
import { useFormStore } from '../store/formStore';
import { locationApi } from '../services/location';
import { hasSavedPreferences, saveLocation, loadLocation, clearLocation, hasSavedLocation } from '../services/preferencesStorage';
import { useBikeDecision } from '../hooks/useBikeDecision';
import { LoadingIndicator } from './LoadingIndicator';
import './LocationForm.css';

export function LocationForm() {
  const { location, setLocation, nextStep } = useFormStore();
  const { fetchDecision } = useBikeDecision();
  // Only pre-fill zipCode from store if we have a validated location (lat/lon exist)
  const [zipCode, setZipCode] = useState(location.lat && location.lon ? location.zipCode : '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [shouldSaveLocation, setShouldSaveLocation] = useState(false);
  const [locationIsSaved, setLocationIsSaved] = useState(false);
  const [validatedLocation, setValidatedLocation] = useState<{
    lat: number;
    lon: number;
    zipCode: string;
    cityName: string;
  } | null>(null);
  // Initialize with actual value from localStorage to avoid first-render issues
  const [hasSavedPrefs, setHasSavedPrefs] = useState(() => {
    const initialValue = hasSavedPreferences();
    return initialValue;
  });

  // Check if we have a saved location on mount and reset validated state
  useEffect(() => {
    
    // Re-check for saved preferences (in case they changed)
    const currentPrefs = hasSavedPreferences();
    setHasSavedPrefs(currentPrefs);
    
    // Load saved location from localStorage (highest priority)
    const savedLocation = loadLocation();
    if (savedLocation) {
      setZipCode(savedLocation.zipCode);
      setLocationIsSaved(true);
      setShouldSaveLocation(true);
      
      // Populate store with saved location
      setLocation({
        zipCode: savedLocation.zipCode,
        lat: savedLocation.lat,
        lon: savedLocation.lon,
        cityName: savedLocation.cityName,
      });
      
      // Set as validated so buttons show
      setValidatedLocation({
        zipCode: savedLocation.zipCode,
        lat: savedLocation.lat,
        lon: savedLocation.lon,
        cityName: savedLocation.cityName || '',
      });
    }
    // If we already have valid location data in the store but no saved location
    // This handles the "Edit Location" flow where location was already validated
    else if (location.lat && location.lon && location.zipCode) {
      console.log('[LocationForm] useEffect - location in store from Edit flow, setting as validated:', location);
      setZipCode(location.zipCode); // Pre-fill from store in Edit Location scenario
      
      // Check if this location matches saved location (user might have it saved)
      const isSaved = hasSavedLocation();
      setLocationIsSaved(isSaved);
      setShouldSaveLocation(isSaved);
      
      setValidatedLocation({
        zipCode: location.zipCode,
        lat: location.lat,
        lon: location.lon,
        cityName: location.cityName || '',
      });
    } else {
      // No location anywhere - clean slate
      setValidatedLocation(null);
      setZipCode(''); // Ensure zip is empty
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!zipCode || zipCode.length !== 5 || !/^\d{5}$/.test(zipCode)) {
      setError('Please enter a valid 5-digit US zip code');
      return;
    }

    setLoading(true);

    const startTime = Date.now();

    try {
      // call geocoding API to convert zip code to lat/lon
      const location = await locationApi.getLocationByZipCode(zipCode);

      // ensure minimum delay of 2 seconds so animation is visible
      const elapsed = Date.now() - startTime;
      const remainingDelay = Math.max(0, 2000 - elapsed);
      
      if (remainingDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingDelay));
      }

      setLocation({
        zipCode,
        lat: location.lat,
        lon: location.lon,
        cityName: location.name,
      });

      // Save location if user opted in
      if (shouldSaveLocation) {
        saveLocation({
          zipCode,
          lat: location.lat,
          lon: location.lon,
          cityName: location.name,
        });
        setLocationIsSaved(true);
      }

      // If no saved preferences, automatically continue to preferences step
      // If saved preferences exist, show choice buttons instead
      if (!hasSavedPrefs) {
        nextStep();
      } else {
        // Store validated location so user can choose their action
        setValidatedLocation({
          zipCode,
          lat: location.lat,
          lon: location.lon,
          cityName: location.name,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueToPreferences = async () => {
    // If location not validated yet, validate it first
    if (!validatedLocation) {
      if (!zipCode || zipCode.length !== 5 || !/^\d{5}$/.test(zipCode)) {
        setError('Please enter a valid 5-digit US zip code');
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const location = await locationApi.getLocationByZipCode(zipCode);
        
        setLocation({
          zipCode,
          lat: location.lat,
          lon: location.lon,
          cityName: location.name,
        });
        
        if (shouldSaveLocation) {
          saveLocation({
            zipCode,
            lat: location.lat,
            lon: location.lon,
            cityName: location.name,
          });
          setLocationIsSaved(true);
        }
        
        // Now proceed to preferences
        nextStep();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to validate location. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      // Already validated, just go to next step
      nextStep();
    }
  };

  const handleUseSavedPreferences = async () => {
    // If location not validated yet, validate it first
    if (!validatedLocation) {
      if (!zipCode || zipCode.length !== 5 || !/^\d{5}$/.test(zipCode)) {
        setError('Please enter a valid 5-digit US zip code');
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const location = await locationApi.getLocationByZipCode(zipCode);
        
        setLocation({
          zipCode,
          lat: location.lat,
          lon: location.lon,
          cityName: location.name,
        });
        
        if (shouldSaveLocation) {
          saveLocation({
            zipCode,
            lat: location.lat,
            lon: location.lon,
            cityName: location.name,
          });
          setLocationIsSaved(true);
        }
        
        // Now fetch decision with validated location
        await fetchDecision(location.lat, location.lon);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to validate location. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      // Already validated, use it
      await fetchDecision(validatedLocation.lat, validatedLocation.lon);
    }
  };

  // Show loading indicator during API call
  if (loading) {
    return <LoadingIndicator message="Validating your location..." />;
  }

  return (
    <div className="location-form">
      <h2>Where do you ride?</h2>
      <p className="form-description">
        Enter your zip code to get accurate weather conditions for your area.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="zipCode">
            US Zip Code
            <span className="field-hint">5 digits</span>
          </label>
          <input
            id="zipCode"
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            placeholder="10001"
            maxLength={5}
            pattern="\d{5}"
            required
            autoFocus
          />
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="save-location-option">
          <label htmlFor="saveLocation" className="checkbox-label">
            <input
              id="saveLocation"
              type="checkbox"
              checked={shouldSaveLocation}
              onChange={(e) => {
                setShouldSaveLocation(e.target.checked);
                if (!e.target.checked && locationIsSaved) {
                  clearLocation();
                  setLocationIsSaved(false);
                }
              }}
            />
            Save this location for quick access
          </label>
          {locationIsSaved && <span className="saved-badge">✓ Saved</span>}
        </div>

        {!hasSavedPrefs ? (
          // No saved preferences: just validate and go to preferences
          <button type="submit" disabled={loading}>
            {loading ? 'Validating...' : 'Validate Location'}
          </button>
        ) : (
          // Has saved preferences: show choice buttons (they handle validation internally)
          <div className="location-actions">
            <button 
              type="button" 
              onClick={handleContinueToPreferences}
              className="secondary"
              disabled={loading}
            >
              {loading ? 'Validating...' : 'Edit Preferences'}
            </button>
            <button 
              type="button" 
              onClick={handleUseSavedPreferences}
              className="primary"
              disabled={loading}
            >
              {loading ? 'Validating...' : 'Use Saved Preferences'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
