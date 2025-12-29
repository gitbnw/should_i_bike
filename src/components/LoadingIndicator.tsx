import cyclingIcon from '../assets/cycling.gif';
import './LoadingIndicator.css';

interface LoadingIndicatorProps {
  message?: string;
}

export function LoadingIndicator({ message = 'Loading...' }: LoadingIndicatorProps) {
  return (
    <div className="loading-indicator">
      <img src={cyclingIcon} alt="Loading" className="loading-icon" />
      <p>{message}</p>
    </div>
  );
}
