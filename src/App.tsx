import { useState } from 'react';
import { bikeApi } from './services/api';
import { type BikeDecisionResponse, BikeDecisionStatus } from './types/api';
import './App.css';

// NYC coordinates as default
const DEFAULT_LAT = 40.7128;
const DEFAULT_LON = -74.006;

function App() {
  const [decision, setDecision] = useState<BikeDecisionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkBikeConditions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await bikeApi.shouldBikeTomorrow(DEFAULT_LAT, DEFAULT_LON);
      setDecision(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bike conditions');
    } finally {
      setLoading(false);
    }
  };

  const getStatusEmoji = (status: BikeDecisionStatus) => {
    // Frontend switches on status code - no string parsing!
    switch (status) {
      case BikeDecisionStatus.PERFECT:
        return '🚴‍♂️';
      case BikeDecisionStatus.TOO_COLD:
        return '🥶';
      case BikeDecisionStatus.TOO_HOT:
        return '🥵';
      case BikeDecisionStatus.TOO_WINDY:
        return '💨';
      case BikeDecisionStatus.RAIN_EXPECTED:
        return '🌧️';
      case BikeDecisionStatus.SNOW_EXPECTED:
        return '❄️';
      case BikeDecisionStatus.HIGH_UV:
        return '☀️';
      case BikeDecisionStatus.POOR_AIR_QUALITY:
        return '😷';
      default:
        return '❓';
    }
  };

  const getStatusColor = (shouldBike: boolean) => {
    return shouldBike ? '#4CAF50' : '#f44336';
  };

  return (
    <div className="App">
      <h1>🚴 Should I Bike Tomorrow?</h1>
      <p>NYC Weather & Air Quality Check</p>

      <button onClick={checkBikeConditions} disabled={loading}>
        {loading ? 'Checking...' : 'Check Tomorrow\'s Conditions'}
      </button>

      {error && (
        <div className="error">
          <p>❌ {error}</p>
        </div>
      )}

      {decision && (
        <div 
          className="decision-card"
          style={{ borderColor: getStatusColor(decision.shouldBike) }}
        >
          <div className="status-icon">
            {getStatusEmoji(decision.status)}
          </div>
          
          <h2 style={{ color: getStatusColor(decision.shouldBike) }}>
            {decision.shouldBike ? 'Yes, Go Bike! 🎉' : 'Stay Home 🏠'}
          </h2>
          
          <p className="reason">{decision.reason}</p>

          <div className="forecast-details">
            <h3>Tomorrow's Forecast</h3>
            <p>📅 {decision.forecast.date}</p>
            <p>🌡️ {decision.forecast.tempMin}°F - {decision.forecast.tempMax}°F</p>
            <p>💨 Wind: {decision.forecast.windSpeed} mph</p>
            <p>☀️ UV Index: {decision.forecast.uvi.toFixed(1)}</p>
            <p>🌫️ Air Quality: {decision.forecast.aqi || 'N/A'}</p>
            <p>{decision.forecast.precipitation ? '🌧️ Precipitation expected' : '☁️ No precipitation'}</p>
          </div>

          <div className="preferences">
            <small>Your comfort range: {decision.preferences.minTemp}°F - {decision.preferences.maxTemp}°F</small>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
