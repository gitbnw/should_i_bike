import { useState } from 'react';
import { useFormStore } from '../store/formStore';
import { locationApi } from '../services/location';
import { hasSavedPreferences } from '../services/preferencesStorage';
import { useBikeDecision } from '../hooks/useBikeDecision';
import { LoadingIndicator } from './LoadingIndicator';
import './LocationForm.css';

export function LocationForm() {
  const { location, setLocation, nextStep } = useFormStore();
  const { fetchDecision } = useBikeDecision();
  const [zipCode, setZipCode] = useState(location.zipCode);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      // Call backend geocoding API to convert zip code to lat/lon
      const location = await locationApi.getLocationByZipCode(zipCode);

      // Ensure minimum delay of 2 seconds so animation is visible
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

      // If saved preferences exist, fetch decision and skip to results
      if (hasSavedPreferences()) {
        await fetchDecision(location.lat, location.lon);
      } else {
        nextStep();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate location. Please try again.');
    } finally {
      setLoading(false);
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
            ❌ {error}
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Validating...' : 'Continue to Preferences'}
        </button>
      </form>
    </div>
  );
}
