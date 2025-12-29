import { type BikeDecisionResponse, BikeDecisionStatus, type BikeDecisionStatusType } from '../types/biking.types';
import { useFormStore } from '../store/formStore';
import bike1 from '../assets/bike1.png';
import bike2 from '../assets/bike2.png';
import bike3 from '../assets/bike3.png';
import bike4 from '../assets/bike4.png';
import bike5 from '../assets/bike.png';
import too_cold from '../assets/too_cold.jpg';
import too_hot from '../assets/too_hot.webp';

import './BikeDecisionDisplay.css';

type BikeDecisionDisplayProps = {
  decision: BikeDecisionResponse;
};

// Randomly select a bike image
const getRandomBikeImage = () => {
  const bikes = [bike1, bike2, bike3, bike4, bike5];
  return bikes[Math.floor(Math.random() * bikes.length)];
};

export function BikeDecisionDisplay({ decision }: BikeDecisionDisplayProps) {
  const { setStep } = useFormStore();
  const randomBike = getRandomBikeImage();
  
  const getStatusEmoji = (status: BikeDecisionStatusType) => {
    // Frontend switches on status code - no string parsing!
    switch (status) {
      case BikeDecisionStatus.PERFECT:
        return randomBike;
      case BikeDecisionStatus.TOO_COLD:
        return too_cold;
      case BikeDecisionStatus.TOO_HOT:
        return too_hot;
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

  const getDecisionMessage = (shouldBike: boolean) => {
    if (shouldBike) {
      const positiveMessages = [
        "Go for it - it's gonna be nice!",
        "You are green to go - engage!"
      ];
      return positiveMessages[Math.floor(Math.random() * positiveMessages.length)];
    }
    return "Negative, Ghost Rider, the pattern is full.";
  };

  return (
    <div 
      className="decision-card"
      style={{ borderColor: getStatusColor(decision.shouldBike) }}
    >
      <div className="status-icon">
        {decision.status === BikeDecisionStatus.PERFECT || decision.status === BikeDecisionStatus.TOO_HOT ? (
          <img src={getStatusEmoji(decision.status)} alt="Status" style={{ width: '100px', height: '100px' }} />
        ) : decision.status === BikeDecisionStatus.TOO_COLD ? (
          <img src={getStatusEmoji(decision.status)} alt="Status" style={{ maxHeight: '100px', width: 'auto' }} />
        ) : (
          getStatusEmoji(decision.status)
        )}
      </div>
      
      <h2 style={{ color: getStatusColor(decision.shouldBike) }}>
        {getDecisionMessage(decision.shouldBike)}
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

      <div className="preferences-used">
        <small>Your comfort range: {decision.preferences.minTemp}°F - {decision.preferences.maxTemp}°F</small>

      <button 
        onClick={() => setStep('preferences')}
        className="edit-preferences-btn"
      >
        Edit Preferences
      </button>
      </div>
    </div>
  );
}
