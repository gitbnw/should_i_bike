// Types matching the NestJS backend API responses
// Keep these in sync with backend DTOs

export enum BikeDecisionStatus {
  PERFECT = 'PERFECT',
  TOO_COLD = 'TOO_COLD',
  TOO_HOT = 'TOO_HOT',
  TOO_WINDY = 'TOO_WINDY',
  RAIN_EXPECTED = 'RAIN_EXPECTED',
  SNOW_EXPECTED = 'SNOW_EXPECTED',
  HIGH_UV = 'HIGH_UV',
  POOR_AIR_QUALITY = 'POOR_AIR_QUALITY',
}

export interface BikeDecisionResponse {
  shouldBike: boolean;
  status: BikeDecisionStatus;
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
}
