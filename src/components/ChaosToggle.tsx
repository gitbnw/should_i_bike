import { useState, useEffect } from 'react';
import { buildApiUrl } from '../services/apiBaseUrl';
import './ChaosToggle.css';

/**
 * ChaosToggle - Demonstrates production error handling patterns
 * 
 * Portfolio Feature: Allows toggling chaos mode to simulate:
 * - Random API delays (100-3000ms)
 * - Random errors (20% probability)
 * - Various error types (rate limits, timeouts, server errors)
 * 
 * Shows resilience: loading states, error boundaries, graceful degradation
 */
export default function ChaosToggle() {
  const [chaosEnabled, setChaosEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial chaos mode status on mount
  useEffect(() => {
    fetchChaosStatus();
  }, []);

  const fetchChaosStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(buildApiUrl('/v1/chaos/status'));
      
      if (!response.ok) {
        throw new Error(`Failed to fetch chaos status: ${response.statusText}`);
      }
      
      const data = await response.json();
      setChaosEnabled(data.enabled);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch chaos status');
      console.error('Error fetching chaos status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(buildApiUrl('/v1/chaos/toggle'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to toggle chaos mode: ${response.statusText}`);
      }

      const data = await response.json();
      setChaosEnabled(data.enabled);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle chaos mode');
      console.error('Error toggling chaos:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chaos-toggle-container">
      <div className="chaos-toggle-header">
        <h3>Chaos Engineering Mode</h3>
        <p className="chaos-description">
          Toggle random delays and errors to demonstrate resilience patterns
        </p>
      </div>

      <div className="chaos-toggle-controls">
        <label className="chaos-switch">
          <input
            type="checkbox"
            checked={chaosEnabled}
            onChange={handleToggle}
            disabled={loading}
          />
          <span className="chaos-slider"></span>
        </label>
        
        <div className="chaos-status">
          <span className={`status-indicator ${chaosEnabled ? 'active' : 'inactive'}`}>
            {loading ? '...' : chaosEnabled ? 'ACTIVE' : 'INACTIVE'}
          </span>
        </div>
      </div>

      {error && (
        <div className="chaos-error">
          Error: {error}
        </div>
      )}

      {chaosEnabled && !loading && (
        <div className="chaos-warning">
          <strong>Warning:</strong> API calls will experience random delays (100-3000ms) 
          and may randomly fail (20% probability). Use this to test error handling and loading states.
        </div>
      )}
    </div>
  );
}
