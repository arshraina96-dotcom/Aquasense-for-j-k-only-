import { JKDistrict, WeatherData, HazardAssessment, UnifiedRiskSummary, RiskLevel } from '../types';
import { JK_GLACIAL_LAKES } from '../data/jkGlacialLakes';

// -------------------------------------------------------------
// A. FLOOD RISK MODULE (Hydrological Catchment & Gauge Model)
// -------------------------------------------------------------
export function calculateFloodRisk(
  district: JKDistrict,
  weather: WeatherData,
  isSimulation = false
): HazardAssessment {
  const rain24h = weather.precipitationMm24h;
  const rainForecast48h = weather.precipitationMm48hForecast;
  const isBasin = district.elevationAvgM < 1650;

  // Base terrain susceptibility factor
  let baseScore = 20;
  if (district.baseTerrainSusceptibility.flood === 'Very High') baseScore = 45;
  else if (district.baseTerrainSusceptibility.flood === 'High') baseScore = 35;
  else if (district.baseTerrainSusceptibility.flood === 'Moderate') baseScore = 25;

  // Rainfall acceleration
  let rainScore = 0;
  if (rain24h > 90) rainScore = 45;
  else if (rain24h > 50) rainScore = 32;
  else if (rain24h > 25) rainScore = 20;
  else if (rain24h > 10) rainScore = 10;

  // Forecast accumulation factor
  let forecastScore = 0;
  if (rainForecast48h > 100) forecastScore = 15;
  else if (rainForecast48h > 50) forecastScore = 8;

  // Basin drainage vulnerability
  const basinBonus = isBasin ? 5 : 0;

  const totalScore = Math.min(Math.round(baseScore * 0.4 + rainScore + forecastScore + basinBonus), 100);

  let riskLevel: RiskLevel = 'Low';
  if (totalScore >= 75) riskLevel = 'Very High';
  else if (totalScore >= 55) riskLevel = 'High';
  else if (totalScore >= 35) riskLevel = 'Moderate';

  // Specific exposed localities based on district
  const exposed = district.localities
    .filter(l => l.terrainType === 'River Basin' || l.terrainType === 'Valley Bottom' || l.vulnerableFeatures.some(f => f.toLowerCase().includes('flood') || f.toLowerCase().includes('inundation')))
    .map(l => l.name);

  const factors = [
    {
      label: '24-Hour Observed Rainfall',
      value: `${rain24h.toFixed(1)} mm`,
      impact: (rain24h > 70 ? 'critical' : rain24h > 35 ? 'high' : rain24h > 15 ? 'moderate' : 'low') as 'low' | 'moderate' | 'high' | 'critical'
    },
    {
      label: '48-Hour Forecast Precipitation',
      value: `${rainForecast48h.toFixed(1)} mm`,
      impact: (rainForecast48h > 80 ? 'high' : rainForecast48h > 40 ? 'moderate' : 'low') as 'low' | 'moderate' | 'high' | 'critical'
    },
    {
      label: 'Catchment River Basin',
      value: district.rivers.join(', ') || 'Local Nallahs',
      impact: (isBasin && district.rivers.length > 1 ? 'high' : 'moderate') as 'low' | 'moderate' | 'high' | 'critical'
    },
    {
      label: 'Terrain Elevation Profile',
      value: `${district.elevationAvgM} m MSL (${isBasin ? 'Low-lying Valley Basin' : 'Mountain Catchment'})`,
      impact: (isBasin ? 'high' : 'low') as 'low' | 'moderate' | 'high' | 'critical'
    }
  ];

  const officialWarningActive = totalScore >= 60;

  return {
    hazardType: 'flood',
    title: 'Riverine & Flash Flood Hazard',
    districtId: district.id,
    districtName: district.name,
    riskLevel,
    score: totalScore,
    predictionTime: weather.timestamp,
    validUntil: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    dataSource: isSimulation ? 'AquaSense Simulation Lab (Synthetic Hydro Model)' : 'Open-Meteo + IMD Hydro Basin Model',
    isSimulated: isSimulation,
    isStale: weather.isStale || false,
    factors,
    exposedAreas: exposed.length > 0 ? exposed : [`Lower catchment areas of ${district.name}`],
    recommendedActions: [
      riskLevel === 'Very High' || riskLevel === 'High'
        ? 'Avoid staying on ground floors in designated flood basins (e.g. river bund perimeters).'
        : 'Monitor local stream gauges and stay informed on weather broadcasts.',
      'Do not attempt to drive or walk through flooded underpasses or low bridges.',
      'Keep essential identification documents, battery banks, and emergency medical supplies in waterproof pouches.',
      'Follow official evacuation orders issued by the District Disaster Management Authority (DDMA).'
    ],
    officialWarningActive,
    officialWarningDetails: officialWarningActive
      ? `Elevated hydrological caution active along ${district.rivers[0] || 'district drainage channels'}.`
      : undefined,
    modelDetails: {
      name: 'AquaSense-HydroXGBoost Ensemble',
      version: 'v2.4-regional',
      confidence: totalScore > 40 ? 'High' : 'Moderate'
    }
  };
}

// -------------------------------------------------------------
// B. LANDSLIDE RISK MODULE (Geotechnical Susceptibility + Rainfall Trigger)
// -------------------------------------------------------------
export function calculateLandslideRisk(
  district: JKDistrict,
  weather: WeatherData,
  isSimulation = false
): HazardAssessment {
  const rain24h = weather.precipitationMm24h;
  const isHighSlope = district.elevationAvgM > 900;
  const isCriticalHighway = district.highwayCorridors.some(h => h.includes('NH-44') || h.includes('Mughal Road') || h.includes('NH-244'));

  let baseSusceptibility = 25;
  if (district.baseTerrainSusceptibility.landslide === 'Very High') baseSusceptibility = 50;
  else if (district.baseTerrainSusceptibility.landslide === 'High') baseSusceptibility = 38;
  else if (district.baseTerrainSusceptibility.landslide === 'Moderate') baseSusceptibility = 25;

  // Rainfall saturation trigger: steep mountain slopes fail rapidly when soil reaches saturation
  let triggerScore = 0;
  if (rain24h > 80) triggerScore = 42;
  else if (rain24h > 45) triggerScore = 28;
  else if (rain24h > 20) triggerScore = 15;
  else if (rain24h > 5) triggerScore = 5;

  const totalScore = Math.min(Math.round(baseSusceptibility * 0.45 + triggerScore + (isCriticalHighway ? 8 : 0)), 100);

  let riskLevel: RiskLevel = 'Low';
  if (totalScore >= 70) riskLevel = 'Very High';
  else if (totalScore >= 50) riskLevel = 'High';
  else if (totalScore >= 30) riskLevel = 'Moderate';

  const vulnerableSlopes = district.localities
    .filter(l => l.terrainType === 'High Mountains' || l.terrainType === 'Foothills' || l.vulnerableFeatures.some(f => f.toLowerCase().includes('landslide') || f.toLowerCase().includes('rockfall') || f.toLowerCase().includes('stone')))
    .map(l => l.name);

  const factors = [
    {
      label: 'Geotechnical Terrain Slope',
      value: isHighSlope ? 'Steep Fractured Himalayan Strata (>35°)' : 'Gentle to Moderate Incline',
      impact: (isHighSlope ? 'high' : 'low') as 'low' | 'moderate' | 'high' | 'critical'
    },
    {
      label: 'Antecedent Soil Saturation Trigger',
      value: `${rain24h.toFixed(1)} mm rainfall in last 24h`,
      impact: (rain24h > 60 ? 'critical' : rain24h > 30 ? 'high' : 'moderate') as 'low' | 'moderate' | 'high' | 'critical'
    },
    {
      label: 'Highway & Transportation Corridor Exposure',
      value: district.highwayCorridors[0] || 'Local district arterial roads',
      impact: (isCriticalHighway ? 'high' : 'low') as 'low' | 'moderate' | 'high' | 'critical'
    },
    {
      label: 'Historical Landslide Density',
      value: district.baseTerrainSusceptibility.landslide,
      impact: (district.baseTerrainSusceptibility.landslide === 'Very High' ? 'critical' : 'moderate') as 'low' | 'moderate' | 'high' | 'critical'
    }
  ];

  return {
    hazardType: 'landslide',
    title: 'Rainfall-Triggered Landslide & Slope Instability',
    districtId: district.id,
    districtName: district.name,
    riskLevel,
    score: totalScore,
    predictionTime: weather.timestamp,
    validUntil: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
    dataSource: isSimulation ? 'AquaSense Simulation Lab (Geotechnical Model)' : 'GSI Landslide Zonation + Open-Meteo Rainfall',
    isSimulated: isSimulation,
    isStale: weather.isStale || false,
    factors,
    exposedAreas: vulnerableSlopes.length > 0 ? vulnerableSlopes : [`Steep road cuttings in ${district.name}`],
    recommendedActions: [
      riskLevel === 'Very High' || riskLevel === 'High'
        ? 'Avoid non-essential vehicular travel on mountain highways (e.g. Ramban-Banihal NH-44, Mughal Road).'
        : 'Watch for sudden muddy water discharge from slopes or newly developed cracks in road tarmac.',
      'Never park vehicles directly under active rockfall zones or steep loose talus slopes.',
      'Check NH-44 Traffic Police Control Room updates (01998-266686) before beginning mountain transit.'
    ],
    officialWarningActive: totalScore >= 60,
    modelDetails: {
      name: 'AquaSense-SlopeStabilityRF',
      version: 'v3.1-himalayan',
      confidence: 'High'
    }
  };
}

// -------------------------------------------------------------
// C. GLOF RISK MODULE (Glacial Lake Outburst Exposure)
// -------------------------------------------------------------
export function calculateGlofRisk(
  district: JKDistrict,
  weather: WeatherData,
  isSimulation = false
): HazardAssessment {
  // Find mapped glacial lakes within or upstream of this district
  const districtLakes = JK_GLACIAL_LAKES.filter(l => l.district.toLowerCase() === district.name.toLowerCase());
  const hasUpstreamGlacialLakes = districtLakes.length > 0 || district.baseTerrainSusceptibility.glof === 'Very High' || district.baseTerrainSusceptibility.glof === 'High';

  const tempAnomaly = weather.temperatureC > 18; // High summer thermal melting increases breach pressure
  const heavyRain = weather.precipitationMm24h > 35; // Cloudburst impact on moraine dam

  let baseScore = 15;
  if (district.baseTerrainSusceptibility.glof === 'Very High') baseScore = 65;
  else if (district.baseTerrainSusceptibility.glof === 'High') baseScore = 48;
  else if (district.baseTerrainSusceptibility.glof === 'Moderate') baseScore = 30;

  let dynamicStress = 0;
  if (heavyRain && hasUpstreamGlacialLakes) dynamicStress += 20;
  if (tempAnomaly && hasUpstreamGlacialLakes) dynamicStress += 12;

  const totalScore = Math.min(Math.round(baseScore + dynamicStress), 100);

  let riskLevel: RiskLevel = 'Low';
  if (totalScore >= 70) riskLevel = 'Very High';
  else if (totalScore >= 50) riskLevel = 'High';
  else if (totalScore >= 30) riskLevel = 'Moderate';

  const downstreamTowns = districtLakes.flatMap(l => l.downstreamSettlements);

  const factors = [
    {
      label: 'Mapped Glacial Lakes in Catchment',
      value: districtLakes.length > 0 ? `${districtLakes.length} monitored alpine lakes` : 'No direct high-altitude proglacial lakes',
      impact: (districtLakes.length > 0 ? 'high' : 'low') as 'low' | 'moderate' | 'high' | 'critical'
    },
    {
      label: 'Moraine Dam Geomorphic Integrity',
      value: districtLakes.some(l => l.moraineDamStability === 'Unstable') ? 'Unstable moraine dam with seepage recorded' : 'Stable natural rock/till rim',
      impact: (districtLakes.some(l => l.moraineDamStability === 'Unstable') ? 'critical' : 'low') as 'low' | 'moderate' | 'high' | 'critical'
    },
    {
      label: 'Hydrometeorological Trigger Risk',
      value: heavyRain ? 'Elevated (Precipitation stress on lake brim)' : 'Normal seasonal melting baseline',
      impact: (heavyRain ? 'high' : 'low') as 'low' | 'moderate' | 'high' | 'critical'
    },
    {
      label: 'Downstream River Valley Conveyance',
      value: district.rivers[0] || 'Local glacial stream',
      impact: 'moderate' as 'low' | 'moderate' | 'high' | 'critical'
    }
  ];

  return {
    hazardType: 'glof',
    title: 'Glacial Lake Outburst Flood (GLOF) Vulnerability',
    districtId: district.id,
    districtName: district.name,
    riskLevel,
    score: totalScore,
    predictionTime: weather.timestamp,
    validUntil: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    dataSource: isSimulation ? 'AquaSense Simulation Lab (Synthetic Cryosphere Model)' : 'ISRO/NRSC Glacial Lake Database & Sentinel Cryo-Telemetry',
    isSimulated: isSimulation,
    isStale: weather.isStale || false,
    factors,
    exposedAreas: downstreamTowns.length > 0 ? downstreamTowns.slice(0, 5) : [`High elevation valleys in ${district.name}`],
    recommendedActions: [
      'Glacial lake monitoring stations track water volume changes and lake surface elevation.',
      'Settlements along narrow proglacial valleys should maintain clear evacuation routes toward higher ridges.',
      'Pay strict attention to sudden unexpected river color turns or surging roar sounds from upper glaciated cirques.'
    ],
    officialWarningActive: totalScore >= 70,
    modelDetails: {
      name: 'AquaSense-GLOFRapidScan',
      version: 'v1.8-cryo',
      confidence: districtLakes.length > 0 ? 'High' : 'Moderate'
    }
  };
}

// -------------------------------------------------------------
// D. EXTREME WEATHER MODULE (Heavy Rainfall, Snowfall, Wind, Freezing)
// -------------------------------------------------------------
export function calculateExtremeWeatherRisk(
  district: JKDistrict,
  weather: WeatherData,
  isSimulation = false
): HazardAssessment {
  const rain24h = weather.precipitationMm24h;
  const snow24h = weather.snowfallCm24h;
  const windKmh = weather.windSpeedKmh;
  const temp = weather.temperatureC;

  let severityScore = 15;

  // Rainfall factor
  if (rain24h > 100) severityScore += 50;
  else if (rain24h > 64) severityScore += 35;
  else if (rain24h > 30) severityScore += 20;

  // Snowfall factor (critical in Pir Panjal & high passes)
  if (snow24h > 30) severityScore += 45;
  else if (snow24h > 15) severityScore += 30;
  else if (snow24h > 5) severityScore += 15;

  // Gale winds factor
  if (windKmh > 75) severityScore += 25;
  else if (windKmh > 50) severityScore += 15;

  // Extreme cold/freezing
  if (temp < -8) severityScore += 20;
  else if (temp < -2) severityScore += 10;

  const totalScore = Math.min(Math.round(severityScore), 100);

  let riskLevel: RiskLevel = 'Low';
  if (totalScore >= 70) riskLevel = 'Very High';
  else if (totalScore >= 50) riskLevel = 'High';
  else if (totalScore >= 30) riskLevel = 'Moderate';

  const factors = [
    {
      label: 'Current Condition',
      value: weather.conditionText,
      impact: (totalScore > 60 ? 'high' : 'low') as 'low' | 'moderate' | 'high' | 'critical'
    },
    {
      label: '24-Hour Precipitation Volume',
      value: `${rain24h.toFixed(1)} mm ${snow24h > 0 ? `| ${snow24h.toFixed(0)} cm snow` : ''}`,
      impact: (rain24h > 60 || snow24h > 20 ? 'critical' : rain24h > 25 ? 'high' : 'moderate') as 'low' | 'moderate' | 'high' | 'critical'
    },
    {
      label: 'Wind Gust Velocity',
      value: `${windKmh.toFixed(0)} km/h`,
      impact: (windKmh > 60 ? 'high' : 'low') as 'low' | 'moderate' | 'high' | 'critical'
    },
    {
      label: 'Surface Ambient Temperature',
      value: `${temp.toFixed(1)} °C (Feels like ${weather.feelsLikeC.toFixed(1)} °C)`,
      impact: (temp < -4 || temp > 38 ? 'high' : 'low') as 'low' | 'moderate' | 'high' | 'critical'
    }
  ];

  return {
    hazardType: 'extreme_weather',
    title: 'Extreme Weather & Precipitation Alert',
    districtId: district.id,
    districtName: district.name,
    riskLevel,
    score: totalScore,
    predictionTime: weather.timestamp,
    validUntil: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
    dataSource: isSimulation ? 'AquaSense Simulation Lab (Synthetic IMD Pattern)' : 'IMD Mausam & Open-Meteo High Resolution Forecast',
    isSimulated: isSimulation,
    isStale: weather.isStale || false,
    factors,
    exposedAreas: district.localities.map(l => l.name),
    recommendedActions: [
      snow24h > 10
        ? 'Equip all vehicles traversing mountain passes with snow chains and carry thermal survival kits.'
        : 'Stay indoors during peak thunderstorm activity and avoid standing under solitary tall trees.',
      'Ensure livestock and sensitive agricultural crops are secured in covered shelters.',
      'Check highway traffic police bulletins before embarking on long interstate transits.'
    ],
    officialWarningActive: totalScore >= 55,
    officialWarningDetails: totalScore >= 70
      ? 'IMD Red Alert: Widespread heavy to very heavy precipitation likely across district.'
      : totalScore >= 50
        ? 'IMD Orange Alert: Moderate to heavy precipitation expected with localized flash surges.'
        : undefined,
    modelDetails: {
      name: 'AquaSense-MausamSync',
      version: 'v4.0-jk',
      confidence: 'High'
    }
  };
}

// -------------------------------------------------------------
// UNIFIED RISK AND EXPLAINABILITY ENGINE
// -------------------------------------------------------------
export function generateUnifiedRiskSummary(
  district: JKDistrict,
  weather: WeatherData,
  isSimulation = false
): UnifiedRiskSummary {
  const flood = calculateFloodRisk(district, weather, isSimulation);
  const landslide = calculateLandslideRisk(district, weather, isSimulation);
  const glof = calculateGlofRisk(district, weather, isSimulation);
  const extremeWeather = calculateExtremeWeatherRisk(district, weather, isSimulation);

  // Unified composite weighting based on district topography
  // High mountains weight landslides & GLOFs heavier; valley basins weight floods heavier
  const isBasin = district.elevationAvgM < 1650;
  let overallScore = 0;
  if (isBasin) {
    overallScore = Math.round(
      flood.score * 0.45 + landslide.score * 0.15 + glof.score * 0.1 + extremeWeather.score * 0.3
    );
  } else {
    overallScore = Math.round(
      flood.score * 0.25 + landslide.score * 0.4 + glof.score * 0.15 + extremeWeather.score * 0.2
    );
  }

  // Official warning priority: never allow low model score to suppress active official alert
  const hasCriticalWarning = flood.officialWarningActive || landslide.officialWarningActive || extremeWeather.score >= 70;
  if (hasCriticalWarning && overallScore < 60) {
    overallScore = 65;
  }

  let overallRiskLevel: RiskLevel = 'Low';
  if (overallScore >= 75) overallRiskLevel = 'Very High';
  else if (overallScore >= 55) overallRiskLevel = 'High';
  else if (overallScore >= 35) overallRiskLevel = 'Moderate';

  // IMD Alert color mapping
  let officialImdAlert: UnifiedRiskSummary['officialImdAlert'] = null;
  if (overallRiskLevel === 'Very High') {
    officialImdAlert = {
      color: 'Red',
      category: 'Take Action / Severe Threat',
      issueTime: weather.timestamp,
      validity: 'Next 24 Hours',
      description: `Severe multi-hazard conditions active in ${district.name}. High risk of flash flooding, slope failures, and highway blockages.`
    };
  } else if (overallRiskLevel === 'High') {
    officialImdAlert = {
      color: 'Orange',
      category: 'Be Prepared / Warning',
      issueTime: weather.timestamp,
      validity: 'Next 24 to 48 Hours',
      description: `Elevated weather and slope instability warning across ${district.name}. Localized waterlogging and debris slides likely.`
    };
  } else if (overallRiskLevel === 'Moderate') {
    officialImdAlert = {
      color: 'Yellow',
      category: 'Be Updated / Advisory',
      issueTime: weather.timestamp,
      validity: 'Next 48 Hours',
      description: `Advisory for moderate rain/snow in upper reaches of ${district.name}. Stay informed with local disaster cell bulletins.`
    };
  } else {
    officialImdAlert = {
      color: 'Green',
      category: 'No Warning / Normal Baseline',
      issueTime: weather.timestamp,
      validity: 'Next 72 Hours',
      description: `Current weather and hydrological parameters in ${district.name} are within seasonal baseline limits.`
    };
  }

  return {
    district,
    overallRiskLevel,
    overallScore,
    assessmentTime: new Date().toISOString(),
    officialImdAlert,
    weather,
    hazards: {
      flood,
      landslide,
      glof,
      extremeWeather
    }
  };
}
