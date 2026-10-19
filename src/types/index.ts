export type Division = 'Kashmir' | 'Jammu';

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Very High';

export type HazardType = 'flood' | 'landslide' | 'glof' | 'extreme_weather';

export interface TehsilLocality {
  name: string;
  elevationMeters: number;
  terrainType: 'Plains' | 'Foothills' | 'High Mountains' | 'River Basin' | 'Valley Bottom';
  vulnerableFeatures: string[];
}

export interface JKDistrict {
  id: string;
  name: string;
  nameHi: string;
  nameUr: string;
  nameKs: string;
  nameDg: string;
  division: Division;
  headquarters: string;
  lat: number;
  lng: number;
  areaSqKm: number;
  elevationAvgM: number;
  rivers: string[];
  highwayCorridors: string[];
  localities: TehsilLocality[];
  baseTerrainSusceptibility: {
    flood: RiskLevel;
    landslide: RiskLevel;
    glof: RiskLevel;
    extremeWeather: RiskLevel;
  };
}

export interface WeatherData {
  temperatureC: number;
  feelsLikeC: number;
  humidityPct: number;
  windSpeedKmh: number;
  windDirectionDeg: number;
  precipitationMm1h: number;
  precipitationMm24h: number;
  precipitationMm48hForecast: number;
  snowfallCm24h: number;
  surfacePressureHpa?: number;
  cloudCoverPct?: number;
  weatherCode: number;
  conditionText: string;
  timestamp: string; // Forecast generation timestamp from numerical model
  retrievedAt: string; // Exact ISO timestamp when request was executed
  source: string; // Human-readable provider name
  providerAttribution: string; // Official license & attribution text
  forecastModel: string; // NWP model name (e.g. ECMWF IFS, GFS Seamless)
  status: 'live' | 'cached' | 'rate_limited' | 'network_error' | 'simulated';
  isRealData: boolean; // True ONLY if real live API call succeeded
  isCached: boolean; // True if served from TTL cache
  isStale?: boolean; // True if cache is expired but used as fallback
  isSimulated?: boolean; // True if synthetic demo scenario
  isRateLimited?: boolean; // True if HTTP 429 encountered
  errorDetails?: string; // Explicit error if live call failed (NO fabrication)
  latitude?: number;
  longitude?: number;
  dailySummary?: {
    maxTempC: number;
    minTempC: number;
    totalRainMm: number;
    maxRainProbPct: number;
  };
  hourlyForecast: {
    time: string;
    tempC: number;
    rainMm: number;
    windKmh: number;
  }[];
}

export interface HazardAssessment {
  hazardType: HazardType;
  title: string;
  districtId: string;
  districtName: string;
  riskLevel: RiskLevel;
  score: number; // 0 to 100
  predictionTime: string;
  validUntil: string;
  dataSource: string;
  isSimulated: boolean;
  isStale: boolean;
  factors: {
    label: string;
    value: string;
    impact: 'low' | 'moderate' | 'high' | 'critical';
  }[];
  exposedAreas: string[];
  recommendedActions: string[];
  officialWarningActive: boolean;
  officialWarningDetails?: string;
  modelDetails: {
    name: string;
    version: string;
    confidence: 'Moderate' | 'High' | 'Very High';
  };
}

export interface UnifiedRiskSummary {
  district: JKDistrict;
  overallRiskLevel: RiskLevel;
  overallScore: number;
  assessmentTime: string;
  officialImdAlert: {
    color: 'Green' | 'Yellow' | 'Orange' | 'Red';
    category: string;
    issueTime: string;
    validity: string;
    description: string;
  } | null;
  weather: WeatherData;
  hazards: {
    flood: HazardAssessment;
    landslide: HazardAssessment;
    glof: HazardAssessment;
    extremeWeather: HazardAssessment;
  };
}

export interface GlacialLake {
  id: string;
  name: string;
  district: string;
  division: Division;
  lat: number;
  lng: number;
  altitudeMeters: number;
  areaHectares: number;
  estimatedVolumeMcm: number;
  moraineDamStability: 'Stable' | 'Moderately Stable' | 'Unstable';
  downstreamSettlements: string[];
  lastObservedDate: string;
  riskLevel: RiskLevel;
}

export interface DisasterAlert {
  id: string;
  title: string;
  hazardType: HazardType;
  severity: 'Advisory' | 'Watch' | 'Warning' | 'Critical Emergency';
  colorCode: 'Yellow' | 'Orange' | 'Red';
  districtIds: string[];
  affectedAreasText: string;
  issuedAt: string;
  expiresAt: string;
  source: 'IMD Srinagar' | 'JKSDMA' | 'AquaSense Model' | 'Central Water Commission' | 'Traffic Police NH-44';
  isOfficial: boolean;
  isSimulated: boolean;
  headline: string;
  instructions: string[];
  acknowledged?: boolean;
}

export interface ShelterFacility {
  id: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  address: string;
  capacityPersons: number;
  currentOccupancy: number;
  facilities: string[];
  contactNumber: string;
  wheelchairAccessible: boolean;
  verifiedDate: string;
}

export interface EmergencyContact {
  id: string;
  agency: string;
  role: string;
  number: string;
  tollFree: boolean;
  coverage: string;
  district?: string;
  verifiedAt: string;
}

export interface SystemDataStatus {
  service: string;
  status: 'Operational' | 'Degraded' | 'Offline' | 'Simulation';
  lastPing: string;
  latencyMs: number;
  notes: string;
}

export type SupportedLanguage = 'en' | 'hi' | 'ur' | 'ks' | 'dg';
