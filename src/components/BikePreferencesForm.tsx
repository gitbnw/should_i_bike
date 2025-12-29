import { useState, useEffect } from 'react';
import { type BikePreferencesRequest, DEFAULT_BIKE_PREFERENCES } from '../types/biking.types';
import { savePreferences, clearPreferences, hasSavedPreferences } from '../services/preferencesStorage';
import coldIcon from '../assets/cold.gif';
import hotIcon from '../assets/hot.gif';
import windIcon from '../assets/wind.gif';
import sunIcon from '../assets/sun.gif';
import airPollutionIcon from '../assets/air-pollution.gif';
import rainIcon from '../assets/rain.gif';
import './BikePreferencesForm.css';

type BikePreferencesFormProps = {
  preferences: BikePreferencesRequest;
  onChange: (preferences: BikePreferencesRequest) => void;
};

export function BikePreferencesForm({ preferences, onChange }: BikePreferencesFormProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setIsSaved(hasSavedPreferences());
  }, []);

  const handleChange = (field: keyof BikePreferencesRequest, value: number | boolean) => {
    onChange({ ...preferences, [field]: value });
    setIsSaved(false); // Mark as unsaved when preferences change
  };

  const resetToDefaults = () => {
    onChange(DEFAULT_BIKE_PREFERENCES);
    setIsSaved(false);
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
    setIsSaved(true);
  };

  const handleClearSaved = () => {
    clearPreferences();
    setIsSaved(false);
  };

  return (
    <div className="preferences-form">
      <h3>🎯 Your Biking Preferences</h3>
      
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="minTemp">
            <img src={coldIcon} alt="Cold" className="field-icon" />
            Min Temperature (°F)
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
            <img src={hotIcon} alt="Hot" className="field-icon" />
            Max Temperature (°F)
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
            <img src={windIcon} alt="Wind" className="field-icon" />
            Max Wind Speed (mph)
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
            <img src={sunIcon} alt="Sun" className="field-icon" />
            Max UV Index
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
            <img src={airPollutionIcon} alt="Air Quality" className="field-icon" />
            Max Air Quality Index
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
            <img src={rainIcon} alt="Rain" className="field-icon" />
            I'll bike in rain/snow
          </label>
        </div>
      </div>

      <div className="button-group">
        <button 
          type="button" 
          className="reset-button"
          onClick={resetToDefaults}
        >
          Reset to Defaults
        </button>

        <button 
          type="button" 
          className="save-button"
          onClick={handleSavePreferences}
          disabled={isSaved}
        >
          {isSaved ? '✓ Saved' : 'Save Preferences'}
        </button>

        {isSaved && (
          <button 
            type="button" 
            className="clear-button"
            onClick={handleClearSaved}
          >
            Clear Saved
          </button>
        )}
      </div>
    </div>
  );
}
