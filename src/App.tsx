import { useState } from 'react';
import { bikeApi } from './services/biking';
import { type BikeDecisionResponse, type BikePreferencesRequest, DEFAULT_BIKE_PREFERENCES } from './types/biking.types';
import { BikePreferencesForm } from './components/BikePreferencesForm';
import { BikeDecisionDisplay } from './components/BikeDecisionDisplay';
import './App.css';

// NYC coordinates as default
const DEFAULT_LAT = 40.7128;
const DEFAULT_LON = -74.006;

function App() {
  const [preferences, setPreferences] = useState<BikePreferencesRequest>(DEFAULT_BIKE_PREFERENCES);
  const [decision, setDecision] = useState<BikeDecisionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkBikeConditions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await bikeApi.shouldBikeTomorrow(DEFAULT_LAT, DEFAULT_LON, preferences);
      setDecision(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bike conditions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>🚴 Should I Bike Tomorrow?</h1>
      <p>NYC Weather & Air Quality Check</p>

      <BikePreferencesForm 
        preferences={preferences}
        onChange={setPreferences}
      />

      <button onClick={checkBikeConditions} disabled={loading}>
        {loading ? 'Checking...' : 'Check Tomorrow\'s Conditions'}
      </button>

      {error && (
        <div className="error">
          <p>❌ {error}</p>
        </div>
      )}

      {decision && <BikeDecisionDisplay decision={decision} />}
    </div>
  );
}

export default App;
