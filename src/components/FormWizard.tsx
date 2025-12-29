import { useEffect, useRef } from 'react';
import { useFormStore } from '../store/formStore';
import { useBikeDecision } from '../hooks/useBikeDecision';
import { LocationForm } from './LocationForm';
import { BikePreferencesForm } from './BikePreferencesForm';
import { BikeDecisionDisplay } from './BikeDecisionDisplay';
import { LoadingIndicator } from './LoadingIndicator';

export function FormWizard() {
  const { 
    currentStep, 
    location, 
    preferences, 
    decision,
    loading,
    error,
    setPreferences, 
    previousStep 
  } = useFormStore();
  const { fetchDecision } = useBikeDecision();
  const resultRef = useRef<HTMLDivElement>(null);

  // Scroll to result when decision changes
  useEffect(() => {
    if (decision && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [decision]);

  // Show loading indicator during API call
  if (loading) {
    return <LoadingIndicator message="Checking tomorrow's conditions..." />;
  }

  return (
    <>
      {/* Step 1: Location */}
      {currentStep === 'location' && <LocationForm />}

      {/* Step 2: Preferences */}
      {currentStep === 'preferences' && (
        <>
          {location.cityName && (
            <p className="location-display">📍 {location.cityName} ({location.zipCode})</p>
          )}
          
          <BikePreferencesForm 
            preferences={preferences}
            onChange={setPreferences}
          />

          <div className="button-group">
            <button onClick={previousStep} className="secondary">
              ← Back
            </button>
            <button onClick={() => fetchDecision(location.lat, location.lon)}>
              Check Tomorrow's Conditions
            </button>
          </div>
        </>
      )}

      {/* Error Display */}
      {error && (
        <div className="error">
          <p>❌ {error}</p>
        </div>
      )}

      {/* Results Display */}
      {decision && (
        <div ref={resultRef}>
          <BikeDecisionDisplay decision={decision} />
        </div>
      )}
    </>
  );
}
