import { useFormStore } from '../store/formStore';
import { bikeApi } from '../services/biking';

/**
 * Custom hook for fetching bike decision
 * Support calling from different components
 * Separates async logic from state management
 */
export function useBikeDecision() {
  const { location, preferences, setDecision, setLoading, setError, setStep } = useFormStore();

  const fetchDecision = async (overrideLat?: number | null, overrideLon?: number | null, onSuccess?: () => void) => {
    const lat = overrideLat ?? location.lat;
    const lon = overrideLon ?? location.lon;

    if (!lat || !lon) {
      setError('Location is required');
      return;
    }

    setLoading(true);
    setError(null);
    
    const startTime = Date.now();
    
    try {
      const result = await bikeApi.shouldBikeTomorrow(
        lat,
        lon,
        preferences
      );
      
      // Ensure minimum delay of 2 seconds so animation is visible
      const elapsed = Date.now() - startTime;
      const remainingDelay = Math.max(0, 2000 - elapsed);
      
      if (remainingDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingDelay));
      }
      
      setDecision(result);
      setLoading(false);
      setStep('results');
      
      // Call onSuccess callback if provided (for scrolling)
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bike conditions');
      setLoading(false);
    }
  };

  return { fetchDecision };
}
