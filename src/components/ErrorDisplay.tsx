import { useState } from 'react';
import './ErrorDisplay.css';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Check if it's an API error
  const isApiError = error.includes('API error:');
  
  return (
    <div className="error-display">
      
      <div className="error-content">
        <h3 className="error-title">Well that didn't work...</h3>
        
        <p className="error-message">
          We couldn't get tomorrow's weather forecast right now. Please try again in a moment.
        </p>
        
        {isApiError && (
          <p className="error-hint">
            <em>Pro Tip: If you have Chaos Mode enabled, this might be an intentional error. 
            Check the chaos indicator in the header.</em>
          </p>
        )}

        {onRetry && (
          <button onClick={onRetry} className="retry-button">
            Second verse - same as the first.
          </button>
        )}

        <div className="error-details">
          <button 
            className="details-toggle"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? '▼' : '▶'} Technical Details
          </button>
          
          {showDetails && (
            <pre className="details-content">
              {error}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
