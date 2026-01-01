import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import './ChaosStatusIndicator.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export function ChaosStatusIndicator() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/v1/chaos/status`);
        const data = await response.json();
        setIsEnabled(data.enabled);
      } catch (error) {
        console.error('Failed to fetch chaos status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
    
    // Poll every 5 seconds to keep status updated
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    // Navigate to about page
    navigate({ to: '/about' });
    
    // Scroll to chaos section after navigation
    setTimeout(() => {
      const chaosSection = document.querySelector('.chaos-toggle-container');
      if (chaosSection) {
        chaosSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  if (isLoading) {
    return null; // Don't show until we have status
  }

  return (
    <button 
      className="chaos-indicator"
      onClick={handleClick}
      title={`Chaos Mode: ${isEnabled ? 'ON' : 'OFF'}`}
      aria-label={`Chaos Mode is ${isEnabled ? 'enabled' : 'disabled'}. Click to view chaos control.`}
    >
      <span className={`chaos-dot ${isEnabled ? 'enabled' : 'disabled'}`} />
      <span className="chaos-label">Chaos: {isEnabled ? 'ON' : 'OFF'}</span>
    </button>
  );
}
