// Types matching the NestJS backend API responses
// Keep these in sync with backend DTOs

/**
 * Bike decision status codes - using const object instead of enum
 * for compatibility with erasableSyntaxOnly TypeScript config
 */
export const BikeDecisionStatus = {
  PERFECT: 'PERFECT',
  TOO_COLD: 'TOO_COLD',
  TOO_HOT: 'TOO_HOT',
  TOO_WINDY: 'TOO_WINDY',
  RAIN_EXPECTED: 'RAIN_EXPECTED',
  SNOW_EXPECTED: 'SNOW_EXPECTED',
  HIGH_UV: 'HIGH_UV',
  POOR_AIR_QUALITY: 'POOR_AIR_QUALITY',
} as const;

export type BikeDecisionStatusType = typeof BikeDecisionStatus[keyof typeof BikeDecisionStatus];

export type BikeDecisionResponse = {
  shouldBike: boolean;
  status: BikeDecisionStatusType;
  reason: string;
  forecast: {
    date: string;
    tempMin: number;
    tempMax: number;
    windSpeed: number;
    precipitation: boolean;
    uvi: number;
    aqi: number | null;
  };
  preferences: {
    minTemp: number;
    maxTemp: number;
    maxWindSpeed: number;
    okWithPrecipitation: boolean;
    maxUvIndex: number;
    maxAqi: number;
  };
};

/**
 * User preferences for biking conditions
 * Sent to backend when creating/updating preferences
 */
export type BikePreferencesRequest = {
  /** Minimum comfortable temperature in Fahrenheit */
  minTemp: number;

  /** Maximum comfortable temperature in Fahrenheit */
  maxTemp: number;

  /** Maximum wind speed willing to ride in (mph), must be positive */
  maxWindSpeed: number;

  /** Willing to bike in rain/snow */
  okWithPrecipitation: boolean;

  /** Maximum UV index willing to ride in (0-15) */
  maxUvIndex: number;

  /** Maximum Air Quality Index willing to ride in (0-500) */
  maxAqi: number;
};

/**
 * Default preferences for a casual cyclist
 * These match the backend defaults
 */
export const DEFAULT_BIKE_PREFERENCES: BikePreferencesRequest = {
  minTemp: 45,
  maxTemp: 85,
  maxWindSpeed: 20,
  okWithPrecipitation: false,
  maxUvIndex: 8,
  maxAqi: 100,
};

