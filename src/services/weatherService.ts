import { JKDistrict, WeatherData } from '../types';

// In-memory cache for weather results with metadata
interface CachedEntry {
  data: WeatherData;
  fetchedAt: number;
}

const weatherCache = new Map<string, CachedEntry>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

export async function fetchDistrictWeather(
  district: JKDistrict,
  useSimulationScenario: 'none' | 'cloudburst' | 'blizzard' = 'none',
  bypassCache = false
): Promise<WeatherData> {
  const cacheKey = `${district.id}_${useSimulationScenario}`;
  const now = Date.now();

  // 1. If explicit simulation scenario requested, generate tagged demonstration dataset
  if (useSimulationScenario !== 'none') {
    return generateSimulatedWeather(district, useSimulationScenario);
  }

  // 2. Check in-memory cache for active fresh entry unless bypass requested
  const cached = weatherCache.get(cacheKey);
  if (!bypassCache && cached && now - cached.fetchedAt < CACHE_TTL_MS) {
    return {
      ...cached.data,
      isCached: true,
      status: 'cached'
    };
  }

  // 3. Server-side API key handling (kept strictly server-side if set in environment)
  const apiKey = process.env.OPEN_METEO_API_KEY || process.env.WEATHER_API_KEY;
  const baseUrl = apiKey ? 'https://customer-api.open-meteo.com/v1/forecast' : 'https://api.open-meteo.com/v1/forecast';

  const params = new URLSearchParams({
    latitude: district.lat.toString(),
    longitude: district.lng.toString(),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,cloud_cover',
    hourly: 'temperature_2m,precipitation,rain,snowfall,wind_speed_10m,relative_humidity_2m,surface_pressure',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max',
    timezone: 'Asia/Kolkata',
    forecast_days: '3'
  });

  if (apiKey) {
    params.append('apikey', apiKey);
  }

  const requestUrl = `${baseUrl}?${params.toString()}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const res = await fetch(requestUrl, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AquaSense-DisasterPlatform/1.0 (JK-India; contact: emergency@aquasense.jk.gov.in)'
      }
    });
    clearTimeout(timeoutId);

    // Rate Limit Check (HTTP 429)
    if (res.status === 429) {
      console.warn(`[WeatherProvider] Rate limit (HTTP 429) encountered for ${district.name}`);
      if (cached) {
        return {
          ...cached.data,
          status: 'rate_limited',
          isRealData: false,
          isRateLimited: true,
          isStale: true,
          errorDetails: 'Open-Meteo API rate limit reached (HTTP 429). Serving last verified cache.'
        };
      }
      return generateFallbackWeather(district, 'rate_limited', 'Open-Meteo API rate limit reached (HTTP 429).');
    }

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.warn(`[WeatherProvider] Non-OK response ${res.status}: ${errText}`);
      if (cached) {
        return {
          ...cached.data,
          status: 'network_error',
          isRealData: false,
          isStale: true,
          errorDetails: `Provider responded with status HTTP ${res.status} (${res.statusText}). Serving cached telemetry.`
        };
      }
      return generateFallbackWeather(district, 'network_error', `Weather provider returned HTTP ${res.status}.`);
    }

    const data = await res.json();
    const current = data.current || {};
    const hourly = data.hourly || {};
    const daily = data.daily || {};

    // Calculate 24h & 48h precipitation sums from hourly series
    const rainHours: number[] = hourly.rain || hourly.precipitation || [];
    const rain24h = rainHours.slice(0, 24).reduce((a, b) => a + (b || 0), 0);
    const rain48h = rainHours.slice(0, 48).reduce((a, b) => a + (b || 0), 0);
    const snowHours: number[] = hourly.snowfall || [];
    const snow24h = snowHours.slice(0, 24).reduce((a, b) => a + (b || 0), 0);

    // Build 12-hour structured display forecast
    const hourlyForecast = (hourly.time || []).slice(0, 12).map((timeStr: string, idx: number) => {
      const d = new Date(timeStr);
      const hours = d.getHours().toString().padStart(2, '0') + ':00';
      return {
        time: hours,
        tempC: Number((hourly.temperature_2m?.[idx] ?? current.temperature_2m ?? 16).toFixed(1)),
        rainMm: Number((rainHours[idx] ?? 0).toFixed(1)),
        windKmh: Number((hourly.wind_speed_10m?.[idx] ?? current.wind_speed_10m ?? 8).toFixed(1))
      };
    });

    const weatherCode = current.weather_code ?? 0;
    const conditionText = mapWmoWeatherCode(weatherCode);

    const liveWeatherData: WeatherData = {
      temperatureC: Number((current.temperature_2m ?? 15.0).toFixed(1)),
      feelsLikeC: Number((current.apparent_temperature ?? current.temperature_2m ?? 14.5).toFixed(1)),
      humidityPct: Math.round(current.relative_humidity_2m ?? 65),
      windSpeedKmh: Number((current.wind_speed_10m ?? 8.5).toFixed(1)),
      windDirectionDeg: Math.round(current.wind_direction_10m ?? 180),
      precipitationMm1h: Number((current.precipitation ?? 0).toFixed(1)),
      precipitationMm24h: Number(rain24h.toFixed(1)),
      precipitationMm48hForecast: Number(rain48h.toFixed(1)),
      snowfallCm24h: Number(snow24h.toFixed(1)),
      surfacePressureHpa: Number((current.surface_pressure ?? 1013).toFixed(1)),
      cloudCoverPct: Math.round(current.cloud_cover ?? 40),
      weatherCode,
      conditionText,
      timestamp: current.time || new Date().toISOString(),
      retrievedAt: new Date().toISOString(),
      source: 'Open-Meteo High-Resolution Weather API',
      providerAttribution: 'Weather data provided by Open-Meteo under CC BY 4.0 (ECMWF IFS / NOAA GFS models)',
      forecastModel: 'ECMWF IFS (0.25°) & DWD ICON Seamless Blend',
      status: 'live',
      isRealData: true,
      isCached: false,
      isStale: false,
      isSimulated: false,
      isRateLimited: false,
      latitude: district.lat,
      longitude: district.lng,
      dailySummary: {
        maxTempC: Number((daily.temperature_2m_max?.[0] ?? current.temperature_2m ?? 20).toFixed(1)),
        minTempC: Number((daily.temperature_2m_min?.[0] ?? current.temperature_2m ?? 10).toFixed(1)),
        totalRainMm: Number((daily.precipitation_sum?.[0] ?? rain24h).toFixed(1)),
        maxRainProbPct: Math.round(daily.precipitation_probability_max?.[0] ?? 20)
      },
      hourlyForecast
    };

    // Store in memory cache
    weatherCache.set(cacheKey, { data: liveWeatherData, fetchedAt: now });
    return liveWeatherData;

  } catch (err: any) {
    const isTimeout = err?.name === 'AbortError';
    console.warn(`[WeatherProvider] Fetch exception for ${district.name}:`, err?.message || err);

    if (cached) {
      return {
        ...cached.data,
        status: isTimeout ? 'network_error' : 'network_error',
        isRealData: false,
        isStale: true,
        errorDetails: isTimeout ? 'Weather API request timed out (7s limit). Using cached telemetry.' : `Network fetch error: ${err?.message || 'Connection failed'}. Using cached telemetry.`
      };
    }

    return generateFallbackWeather(
      district,
      'network_error',
      isTimeout ? 'Weather API request timed out.' : `Network error: ${err?.message || 'Unable to reach weather API'}`
    );
  }
}

function mapWmoWeatherCode(code: number): string {
  switch (code) {
    case 0: return 'Clear Sky';
    case 1: return 'Mainly Clear';
    case 2: return 'Partly Cloudy';
    case 3: return 'Overcast';
    case 45: case 48: return 'Fog / Depressed Visibility';
    case 51: case 53: case 55: return 'Drizzle / Light Mist';
    case 61: case 63: case 65: return 'Rain / Showers';
    case 66: case 67: return 'Freezing Rain';
    case 71: case 73: case 75: return 'Snowfall';
    case 77: return 'Snow Grains';
    case 80: case 81: case 82: return 'Heavy Rain Showers';
    case 85: case 86: return 'Heavy Snow Showers';
    case 95: return 'Thunderstorm';
    case 96: case 99: return 'Severe Thunderstorm with Hail';
    default: return 'Fair / Mountain Weather';
  }
}

function generateFallbackWeather(
  district: JKDistrict,
  status: 'network_error' | 'rate_limited',
  errorReason: string
): WeatherData {
  const isHighAltitude = district.elevationAvgM > 1800;
  const isJammuPlains = district.elevationAvgM < 500;
  const baseTemp = isJammuPlains ? 27.0 : isHighAltitude ? 8.0 : 16.5;

  const hourlyForecast = Array.from({ length: 12 }, (_, i) => {
    const hour = (new Date().getHours() + i) % 24;
    return {
      time: `${hour.toString().padStart(2, '0')}:00`,
      tempC: Number((baseTemp + Math.sin(i / 2) * 2.5).toFixed(1)),
      rainMm: Number((Math.random() * 2).toFixed(1)),
      windKmh: Number((10 + Math.random() * 6).toFixed(1))
    };
  });

  return {
    temperatureC: baseTemp,
    feelsLikeC: baseTemp - 1,
    humidityPct: 60,
    windSpeedKmh: 10.5,
    windDirectionDeg: 190,
    precipitationMm1h: 0,
    precipitationMm24h: 8.5,
    precipitationMm48hForecast: 18.0,
    snowfallCm24h: isHighAltitude ? 2.0 : 0,
    surfacePressureHpa: 1014,
    cloudCoverPct: 35,
    weatherCode: 2,
    conditionText: 'Partly Cloudy (Baseline Fallback)',
    timestamp: new Date().toISOString(),
    retrievedAt: new Date().toISOString(),
    source: 'Regional Climatological Fallback (Real API Failed)',
    providerAttribution: 'Weather fallback generated due to provider network unavailability',
    forecastModel: 'AquaSense Climatological Reference Baseline',
    status,
    isRealData: false, // NOT fabricated as live
    isCached: false,
    isStale: true,
    isSimulated: false,
    isRateLimited: status === 'rate_limited',
    errorDetails: errorReason,
    latitude: district.lat,
    longitude: district.lng,
    dailySummary: {
      maxTempC: baseTemp + 5,
      minTempC: baseTemp - 4,
      totalRainMm: 8.5,
      maxRainProbPct: 25
    },
    hourlyForecast
  };
}

export function generateSimulatedWeather(
  district: JKDistrict,
  scenario: 'cloudburst' | 'blizzard'
): WeatherData {
  const isBasin = district.elevationAvgM < 1650;

  if (scenario === 'cloudburst') {
    const rain24h = isBasin ? 128.5 : 94.0;
    const hourlyForecast = Array.from({ length: 12 }, (_, i) => {
      const hour = (new Date().getHours() + i) % 24;
      const surge = i >= 3 && i <= 8 ? 22.0 + Math.random() * 15 : 6.0;
      return {
        time: `${hour.toString().padStart(2, '0')}:00`,
        tempC: 16.5 - i * 0.4,
        rainMm: Number(surge.toFixed(1)),
        windKmh: Number((35 + Math.random() * 25).toFixed(1))
      };
    });

    return {
      temperatureC: 15.2,
      feelsLikeC: 13.0,
      humidityPct: 96,
      windSpeedKmh: 48.0,
      windDirectionDeg: 160,
      precipitationMm1h: 24.5,
      precipitationMm24h: rain24h,
      precipitationMm48hForecast: 185.0,
      snowfallCm24h: 0,
      surfacePressureHpa: 994.2,
      cloudCoverPct: 100,
      weatherCode: 96,
      conditionText: 'Severe Cloudburst & Torrents (SIMULATION)',
      timestamp: new Date().toISOString(),
      retrievedAt: new Date().toISOString(),
      source: 'AquaSense Extreme Weather Simulator [CLOUDBURST SCENARIO]',
      providerAttribution: 'Synthetic disaster simulation generated for hackathon evaluation',
      forecastModel: 'AquaSense Extreme Precipitation Simulator v2.0',
      status: 'simulated',
      isRealData: false,
      isCached: false,
      isStale: false,
      isSimulated: true,
      isRateLimited: false,
      latitude: district.lat,
      longitude: district.lng,
      dailySummary: {
        maxTempC: 18.0,
        minTempC: 13.0,
        totalRainMm: rain24h,
        maxRainProbPct: 95
      },
      hourlyForecast
    };
  } else {
    const hourlyForecast = Array.from({ length: 12 }, (_, i) => {
      const hour = (new Date().getHours() + i) % 24;
      return {
        time: `${hour.toString().padStart(2, '0')}:00`,
        tempC: Number((-4.5 - i * 0.3).toFixed(1)),
        rainMm: 0,
        windKmh: Number((55 + Math.random() * 20).toFixed(1))
      };
    });

    return {
      temperatureC: -3.8,
      feelsLikeC: -11.2,
      humidityPct: 92,
      windSpeedKmh: 64.0,
      windDirectionDeg: 310,
      precipitationMm1h: 0,
      precipitationMm24h: 12.0,
      precipitationMm48hForecast: 45.0,
      snowfallCm24h: 42.0,
      surfacePressureHpa: 988.5,
      cloudCoverPct: 100,
      weatherCode: 86,
      conditionText: 'Severe Blizzard & Mountain Gale (SIMULATION)',
      timestamp: new Date().toISOString(),
      retrievedAt: new Date().toISOString(),
      source: 'AquaSense Extreme Weather Simulator [BLIZZARD SCENARIO]',
      providerAttribution: 'Synthetic disaster simulation generated for hackathon evaluation',
      forecastModel: 'AquaSense Cryosphere Blizzard Simulator v2.0',
      status: 'simulated',
      isRealData: false,
      isCached: false,
      isStale: false,
      isSimulated: true,
      isRateLimited: false,
      latitude: district.lat,
      longitude: district.lng,
      dailySummary: {
        maxTempC: -1.0,
        minTempC: -9.5,
        totalRainMm: 12.0,
        maxRainProbPct: 90
      },
      hourlyForecast
    };
  }
}
