import { type BikeDecisionResponse, BikeDecisionStatus, type BikeDecisionStatusType } from '../types/biking.types';
import bike1 from '../assets/bike1.png';
import bike2 from '../assets/bike2.png';
import bike3 from '../assets/bike3.png';
import bike4 from '../assets/bike4.png';
import bike5 from '../assets/bike.png';
import too_cold from '../assets/too_cold.jpg';
import too_hot from '../assets/too_hot.webp';
import too_windy from '../assets/too_windy.jpg';
import too_rainy from '../assets/too_rainy.jpg';
import too_snowy from '../assets/too_snowy.jpg';
import too_sunny from '../assets/too_sunny.webp';
import too_polluted from '../assets/too_polluted.jpg';
import too_what from '../assets/too_what.png';

import './BikeDecisionDisplay.css';

type BikeDecisionDisplayProps = {
  decision: BikeDecisionResponse;
  onEditPreferences?: () => void;
  onEditLocation?: () => void;
  location?: {
    zipCode: string;
    lat: number | null;
    lon: number | null;
    cityName?: string;
  };
};

// randomly select a bike image
const getRandomBikeImage = () => {
  const bikes = [bike1, bike2, bike3, bike4, bike5];
  return bikes[Math.floor(Math.random() * bikes.length)];
};

// format date as MM/DD/YYYY
// Use UTC methods to avoid timezone conversion issues
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${month}/${day}/${year}`;
}

export function BikeDecisionDisplay({ decision, onEditPreferences, onEditLocation, location }: BikeDecisionDisplayProps) {
  const randomBike = getRandomBikeImage();
  
  const getDecisionImage = (status: BikeDecisionStatusType) => {
    switch (status) {
      case BikeDecisionStatus.PERFECT:
        return randomBike;
      case BikeDecisionStatus.TOO_COLD:
        return too_cold;
      case BikeDecisionStatus.TOO_HOT:
        return too_hot;
      case BikeDecisionStatus.TOO_WINDY:
        return too_windy;
      case BikeDecisionStatus.RAIN_EXPECTED:
        return too_rainy;
      case BikeDecisionStatus.SNOW_EXPECTED:
        return too_snowy;
      case BikeDecisionStatus.HIGH_UV:
        return too_sunny;
      case BikeDecisionStatus.POOR_AIR_QUALITY:
        return too_polluted;
      default:
        return too_what;
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
    const negativeMessages = [
      "Negative, Ghost Rider, the pattern is full.",
      "No chance, Lance."
    ];
    return negativeMessages[Math.floor(Math.random() * negativeMessages.length)];
  };

  return (
    <div 
      className="decision-card"
      style={{ borderColor: getStatusColor(decision.shouldBike) }}
    >
      <div className="status-icon">
        <img src={getDecisionImage(decision.status)} alt="Status" />
      </div>
      
      <h2 style={{ color: getStatusColor(decision.shouldBike) }}>
        {getDecisionMessage(decision.shouldBike)}
      </h2>
      
      <p className="reason">{decision.reason}</p>

      <div className="edit-buttons">
        <button 
          onClick={onEditLocation}
          className="edit-location-btn"
        >
          Edit Location
        </button>
        <button 
          onClick={onEditPreferences}
          className="edit-preferences-btn"
        >
          Edit Preferences
        </button>
      </div>

      <div className="forecast-details">
        <h3>Tomorrow's Forecast</h3>
        <div className="forecast-date">{formatDate(decision.forecast.date)}</div>
        {location && (
          <div className="location-info">
            {location.cityName || location.zipCode}
            {location.lat && location.lon && (
              <span className="coordinates"> ({location.lat.toFixed(4)}, {location.lon.toFixed(4)})</span>
            )}
          </div>
        )}
        
        <div className="forecast-grid">
          <div className="forecast-metric temp">
            <span className="metric-label">Temperature</span>
            <span className="metric-value">{decision.forecast.tempMin}°F - {decision.forecast.tempMax}°F</span>
          </div>
          
          <div className="forecast-metric wind">
            <span className="metric-label">Wind</span>
            <span className="metric-value">{decision.forecast.windSpeed} mph</span>
          </div>
          
          <div className="forecast-metric uv">
            <span className="metric-label">UV Index</span>
            <span className="metric-value">{decision.forecast.uvi.toFixed(1)}</span>
          </div>
          
          <div className="forecast-metric air-quality">
            <span className="metric-label">Air Quality</span>
            <span className="metric-value">{decision.forecast.aqi || 'N/A'}</span>
          </div>
          
          <div className="forecast-metric precipitation">
            <span className="metric-label">Precipitation</span>
            <span className="metric-value">{decision.forecast.precipitation ? 'Expected' : 'None'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
