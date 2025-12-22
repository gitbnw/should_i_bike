import { type BikeDecisionResponse, BikeDecisionStatus, type BikeDecisionStatusType } from '../types/biking.types';
import './BikeDecisionDisplay.css';

type BikeDecisionDisplayProps = {
  decision: BikeDecisionResponse;
};

export function BikeDecisionDisplay({ decision }: BikeDecisionDisplayProps) {
  const getStatusEmoji = (status: BikeDecisionStatusType) => {
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

      <div className="preferences-used">
        <small>Your comfort range: {decision.preferences.minTemp}°F - {decision.preferences.maxTemp}°F</small>
      </div>
    </div>
  );
}
