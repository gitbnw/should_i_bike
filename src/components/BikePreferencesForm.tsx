import { type BikePreferencesRequest, DEFAULT_BIKE_PREFERENCES } from '../types/biking.types';
import './BikePreferencesForm.css';

type BikePreferencesFormProps = {
  preferences: BikePreferencesRequest;
  onChange: (preferences: BikePreferencesRequest) => void;
};

export function BikePreferencesForm({ preferences, onChange }: BikePreferencesFormProps) {
  const handleChange = (field: keyof BikePreferencesRequest, value: number | boolean) => {
    onChange({ ...preferences, [field]: value });
  };

  const resetToDefaults = () => {
    onChange(DEFAULT_BIKE_PREFERENCES);
  };

  return (
    <div className="preferences-form">
      <h3>🎯 Your Biking Preferences</h3>
      
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="minTemp">
            🥶 Min Temperature (°F)
            <span className="field-hint">Coldest you'll ride in</span>
          </label>
          <input
            id="minTemp"
            type="number"
            value={preferences.minTemp}
            onChange={(e) => handleChange('minTemp', Number(e.target.value))}
            min="-20"
            max="120"
          />
        </div>

        <div className="form-field">
          <label htmlFor="maxTemp">
            🥵 Max Temperature (°F)
            <span className="field-hint">Hottest you'll ride in</span>
          </label>
          <input
            id="maxTemp"
            type="number"
            value={preferences.maxTemp}
            onChange={(e) => handleChange('maxTemp', Number(e.target.value))}
            min="-20"
            max="120"
          />
        </div>

        <div className="form-field">
          <label htmlFor="maxWindSpeed">
            💨 Max Wind Speed (mph)
            <span className="field-hint">Windiest you'll ride in</span>
          </label>
          <input
            id="maxWindSpeed"
            type="number"
            value={preferences.maxWindSpeed}
            onChange={(e) => handleChange('maxWindSpeed', Number(e.target.value))}
            min="0"
            max="100"
          />
        </div>

        <div className="form-field">
          <label htmlFor="maxUvIndex">
            ☀️ Max UV Index
            <span className="field-hint">0-11+ (8 = very high)</span>
          </label>
          <input
            id="maxUvIndex"
            type="number"
            value={preferences.maxUvIndex}
            onChange={(e) => handleChange('maxUvIndex', Number(e.target.value))}
            min="0"
            max="15"
            step="1"
          />
        </div>

        <div className="form-field">
          <label htmlFor="maxAqi">
            🌫️ Max Air Quality Index
            <span className="field-hint">0-500 (100 = moderate)</span>
          </label>
          <input
            id="maxAqi"
            type="number"
            value={preferences.maxAqi}
            onChange={(e) => handleChange('maxAqi', Number(e.target.value))}
            min="0"
            max="500"
          />
        </div>

        <div className="form-field checkbox-field">
          <label htmlFor="okWithPrecipitation">
            <input
              id="okWithPrecipitation"
              type="checkbox"
              checked={preferences.okWithPrecipitation}
              onChange={(e) => handleChange('okWithPrecipitation', e.target.checked)}
            />
            🌧️ I'll bike in rain/snow
          </label>
        </div>
      </div>

      <button 
        type="button" 
        className="reset-button"
        onClick={resetToDefaults}
      >
        Reset to Defaults
      </button>
    </div>
  );
}
