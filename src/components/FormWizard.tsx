import { useRef, useState, useEffect } from 'react';
import { useFormStore } from '../store/formStore';
import { useBikeDecision } from '../hooks/useBikeDecision';
import { LocationForm } from './LocationForm';
import { BikePreferencesForm } from './BikePreferencesForm';
import { BikeDecisionDisplay } from './BikeDecisionDisplay';
import { LoadingIndicator } from './LoadingIndicator';
import { ErrorDisplay } from './ErrorDisplay';
import { DEFAULT_BIKE_PREFERENCES } from '../types/biking.types';
import { 
  canQuickCheck, 
  loadLocation, 
  loadPreferences,
  clearLocation,
  clearPreferences 
} from '../services/preferencesStorage';

export function FormWizard() {
  const { 
    currentStep, 
    location, 
    preferences, 
    decision,
    loading,
    error,
    setLocation,
    setPreferences,
    setDecision,
    setStep, 
    previousStep 
  } = useFormStore();
  const { fetchDecision } = useBikeDecision();
  const resultRef = useRef<HTMLDivElement>(null);
  const preferencesRef = useRef<HTMLDivElement>(null);
  const [showQuickCheck, setShowQuickCheck] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Check for saved data on mount
  useEffect(() => {
    if (canQuickCheck()) {
      setShowQuickCheck(true);
      // Pre-load saved data into store
      const savedLocation = loadLocation();
      const savedPreferences = loadPreferences();
      if (savedLocation) {
        setLocation({
          zipCode: savedLocation.zipCode,
          lat: savedLocation.lat,
          lon: savedLocation.lon,
          cityName: savedLocation.cityName,
        });
      }
      if (savedPreferences) {
        setPreferences(savedPreferences);
      }
    } else {
      // If Quick Check not available, clear any stale location data from store
      // This prevents old session data from polluting the form
      const savedLocation = loadLocation();
      if (!savedLocation) {
        setLocation({
          zipCode: '',
          lat: 0,
          lon: 0,
          cityName: '',
        });
      }
    }
  }, [setLocation, setPreferences]);

  const handleQuickCheck = async () => {
    const savedLocation = loadLocation();
    if (savedLocation) {
      setShowQuickCheck(false);
      await fetchDecision(savedLocation.lat, savedLocation.lon, () => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    }
  };

  const handleStartFresh = () => {
    // Clear all saved data from localStorage
    clearLocation();
    clearPreferences();
    
    // Clear all store state
    setLocation({
      zipCode: '',
      lat: 0,
      lon: 0,
      cityName: '',
    });
    setPreferences(DEFAULT_BIKE_PREFERENCES);
    setDecision(null);
    
    // Reset to location step
    setStep('location');
    setShowQuickCheck(false);
    setIsEditMode(false); // Exit edit mode
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFetchDecision = async () => {
    await fetchDecision(location.lat, location.lon, () => {
      // Scroll to result after successful fetch
      if (resultRef.current) {
        resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  };

  const handleEditPreferences = () => {
    setDecision(null); // Clear decision when editing preferences
    setIsEditMode(true); // Mark as edit mode to bypass Quick Check
    setShowQuickCheck(false); // Don't show Quick Check
    setStep('preferences');
    // Scroll to preferences form after a brief delay for render
    setTimeout(() => {
      if (preferencesRef.current) {
        preferencesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleEditLocation = () => {
    setDecision(null); // Clear decision when editing location
    setIsEditMode(true); // Mark as edit mode to bypass Quick Check
    setShowQuickCheck(false); // Don't show Quick Check
    setStep('location');
    // Scroll to top when going back to location
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show loading indicator during API call
  if (loading) {
    return <LoadingIndicator message="Checking tomorrow's conditions..." />;
  }

  // Show Quick Check option if user has saved location and preferences (but not in edit mode)
  if (showQuickCheck && currentStep === 'location' && !decision && !isEditMode) {
    const savedLocation = loadLocation();
    return (
      <div className="quick-check-container">
        <div className="quick-check-card">
          <h2>So... you’re back?</h2>
          <p className="saved-info">
            Saved location: <strong>{savedLocation?.cityName || savedLocation?.zipCode}</strong>
          </p>
          <p className="quick-check-description">
            Your location and preferences are saved. Lucky you!  You can do a quick check of tomorrow's conditions, or start fresh to change your location or preferences.
          </p>
          <button onClick={handleQuickCheck} className="quick-check-button">
            Kick the tires, light the fires - check tomorrow's conditions
          </button>
          <button onClick={handleStartFresh} className="secondary start-fresh-button">
            Pump the brakes, start fresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Step 1: Location */}
      {currentStep === 'location' && <LocationForm />}

      {/* Step 2: Preferences */}
      {currentStep === 'preferences' && (
        <div ref={preferencesRef}>
          {location.cityName && (
            <p className="location-display">{location.cityName} ({location.zipCode})</p>
          )}
          
          <BikePreferencesForm 
            preferences={preferences}
            onChange={setPreferences}
          />

          <div className="button-group">
            <button onClick={previousStep} className="secondary">
              ← Back
            </button>
            <button onClick={handleFetchDecision}>
              Check Tomorrow's Conditions
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <ErrorDisplay 
          error={error}
          onRetry={handleFetchDecision}
        />
      )}

      {/* Results Display */}
      {decision && (
        <div ref={resultRef}>
          <BikeDecisionDisplay 
            decision={decision} 
            onEditPreferences={handleEditPreferences}
            onEditLocation={handleEditLocation}
            location={location}
          />
        </div>
      )}
    </>
  );
}
