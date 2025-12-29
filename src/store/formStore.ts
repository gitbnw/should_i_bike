import { create } from 'zustand';
import { type BikePreferencesRequest, DEFAULT_BIKE_PREFERENCES, type BikeDecisionResponse } from '../types/biking.types';
import { loadPreferences } from '../services/preferencesStorage';

type FormStep = 'location' | 'preferences' | 'results';

interface Location {
  zipCode: string;
  lat: number | null;
  lon: number | null;
  cityName?: string;
}

interface FormState {
  // Current step in the form flow
  currentStep: FormStep;
  
  // Location data
  location: Location;
  
  // User preferences
  preferences: BikePreferencesRequest;
  
  // Decision result
  decision: BikeDecisionResponse | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  setStep: (step: FormStep) => void;
  setLocation: (location: Partial<Location>) => void;
  setPreferences: (preferences: BikePreferencesRequest) => void;
  setDecision: (decision: BikeDecisionResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetForm: () => void;
  nextStep: () => void;
  previousStep: () => void;
}

const initialLocation: Location = {
  zipCode: '',
  lat: null,
  lon: null,
};

const stepOrder: FormStep[] = ['location', 'preferences', 'results'];

// Load saved preferences or use defaults
const initialPreferences = loadPreferences() || DEFAULT_BIKE_PREFERENCES;

export const useFormStore = create<FormState>((set, get) => ({
  currentStep: 'location',
  location: initialLocation,
  preferences: initialPreferences,
  decision: null,
  loading: false,
  error: null,

  setStep: (step) => {
    console.log('[FormStore] setStep:', step);
    set({ currentStep: step });
  },

  setLocation: (locationUpdate) => {
    console.log('[FormStore] setLocation:', locationUpdate);
    set((state) => ({
      location: { ...state.location, ...locationUpdate },
    }));
  },

  setPreferences: (preferences) => {
    console.log('[FormStore] setPreferences:', preferences);
    set({ preferences });
  },

  setDecision: (decision) => {
    console.log('[FormStore] setDecision:', decision);
    set({ decision });
  },

  setLoading: (loading) => {
    console.log('[FormStore] setLoading:', loading);
    set({ loading });
  },

  setError: (error) => {
    console.log('[FormStore] setError:', error);
    set({ error });
  },

  resetForm: () => {
    console.log('[FormStore] resetForm');
    set({
      currentStep: 'location',
      location: initialLocation,
      preferences: DEFAULT_BIKE_PREFERENCES,
      decision: null,
      error: null,
      loading: false,
    });
  },

  nextStep: () => {
    const currentIndex = stepOrder.indexOf(get().currentStep);
    console.log('[FormStore] nextStep - current:', get().currentStep, 'index:', currentIndex);
    if (currentIndex < stepOrder.length - 1) {
      set({ currentStep: stepOrder[currentIndex + 1] });
    }
  },

  previousStep: () => {
    const currentIndex = stepOrder.indexOf(get().currentStep);
    console.log('[FormStore] previousStep - current:', get().currentStep, 'index:', currentIndex);
    if (currentIndex > 0) {
      set({ 
        currentStep: stepOrder[currentIndex - 1],
        decision: null,
        error: null 
      });
    }
  },
}));
