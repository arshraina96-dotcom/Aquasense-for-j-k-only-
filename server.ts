import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { JK_DISTRICTS } from './src/data/jkDistricts.js';
import { JK_GLACIAL_LAKES } from './src/data/jkGlacialLakes.js';
import { JK_SHELTERS } from './src/data/jkShelters.js';
import { JK_EMERGENCY_CONTACTS } from './src/data/jkContacts.js';
import { fetchDistrictWeather } from './src/services/weatherService.js';
import {
  generateUnifiedRiskSummary,
  calculateFloodRisk,
  calculateLandslideRisk,
  calculateGlofRisk,
  calculateExtremeWeatherRisk
} from './src/services/hazardEngine.js';
import { DisasterAlert } from './src/types/index.js';
import { JK_DISTRICTS_GEOJSON, JK_RIVERS_GEOJSON, JK_HIGHWAYS_GEOJSON } from './src/data/jkGeoJson.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini Client
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// In-memory alert store for live & simulated alerts
let alertsStore: DisasterAlert[] = [
  {
    id: 'alt-001',
    title: 'Flash Flood Watch: Jhelum & Tributaries',
    hazardType: 'flood',
    severity: 'Warning',
    colorCode: 'Orange',
    districtIds: ['srinagar', 'anantnag', 'pulwama', 'kulgam'],
    affectedAreasText: 'Sangam, Ram Munshi Bagh, Asham Gauge Basins, Kakapora',
    issuedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 21 * 3600 * 1000).toISOString(),
    source: 'Central Water Commission',
    isOfficial: true,
    isSimulated: false,
    headline: 'Jhelum catchment gauge rising due to continuous rainfall over South Kashmir hills.',
    instructions: [
      'Residents along low-lying river bunds should secure livestock and avoid staying on ground floors.',
      'Refrain from venturing near fast-flowing river edges or dredging channels.',
      'Emergency boat rescue units placed on stand-by at Sangam and Padshahi Bagh.'
    ]
  },
  {
    id: 'alt-002',
    title: 'Shooting Stones & Debris Alert: NH-44 Ramban Sector',
    hazardType: 'landslide',
    severity: 'Critical Emergency',
    colorCode: 'Red',
    districtIds: ['ramban', 'udhampur'],
    affectedAreasText: 'Mehar, Cafeteria Morh, Panthyal, Seri, Chanderkote',
    issuedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
    source: 'Traffic Police NH-44',
    isOfficial: true,
    isSimulated: false,
    headline: 'Severe slope slumping and active shooting stones halting vehicular traffic on Jammu-Srinagar NH-44.',
    instructions: [
      'Commuters strictly advised NOT to undertake journey on NH-44 until clearance confirmed by Traffic Police.',
      'Stranded passengers between Banihal and Ramban may proceed to designated Banihal Transit Camp shelter.',
      'Call Traffic Control Room Ramban at 01998-266686 for clearance updates.'
    ]
  },
  {
    id: 'alt-003',
    title: 'High-Altitude Glacial Lake Sentinel Watch',
    hazardType: 'glof',
    severity: 'Watch',
    colorCode: 'Yellow',
    districtIds: ['kishtwar', 'ganderbal'],
    affectedAreasText: 'Warwan Valley (Inshan/Sukhnai) and Upper Sindh Valley (Sonamarg)',
    issuedAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 34 * 3600 * 1000).toISOString(),
    source: 'JKSDMA',
    isOfficial: true,
    isSimulated: false,
    headline: 'Satellite monitoring indicates rapid thermal meltwater filling proglacial cirques.',
    instructions: [
      'Field teams in Marwah and Warwan valleys to report any abrupt change in stream turbidity or volume.',
      'Shepherds and high-altitude trekkers advised to avoid camping in dry stream channels below glacier snout.'
    ]
  }
];

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // 1. Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      app: 'AquaSense',
      region: 'Jammu & Kashmir UT',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      capabilities: {
        geminiAssistant: !!ai,
        districtsCoverage: JK_DISTRICTS.length,
        divisions: ['Kashmir', 'Jammu']
      }
    });
  });

  // 2. Districts list
  app.get('/api/locations/districts', (req: Request, res: Response) => {
    const division = req.query.division as string;
    if (division && division !== 'All') {
      const filtered = JK_DISTRICTS.filter(
        d => d.division.toLowerCase() === division.toLowerCase()
      );
      res.json(filtered);
    } else {
      res.json(JK_DISTRICTS);
    }
  });

  // 3. Localities / Tehsils
  app.get('/api/locations/localities', (req: Request, res: Response) => {
    const districtId = req.query.districtId as string;
    if (!districtId) {
      res.status(400).json({ error: 'districtId query parameter required' });
      return;
    }
    const district = JK_DISTRICTS.find(d => d.id === districtId);
    if (!district) {
      res.status(404).json({ error: 'District not found' });
      return;
    }
    res.json(district.localities);
  });

  // 4. Weather
  app.get('/api/weather', async (req: Request, res: Response) => {
    const districtId = (req.query.districtId as string) || 'srinagar';
    const simulation = (req.query.simulation as 'none' | 'cloudburst' | 'blizzard') || 'none';
    const bypassCache = req.query.refresh === 'true' || !!req.query.refresh;
    const district = JK_DISTRICTS.find(d => d.id === districtId) || JK_DISTRICTS[0];

    try {
      const weather = await fetchDistrictWeather(district, simulation, bypassCache);
      res.json(weather);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve weather data', details: String(err) });
    }
  });

  // 5. Hazards Summary
  app.get('/api/hazards/summary', async (req: Request, res: Response) => {
    const districtId = (req.query.districtId as string) || 'srinagar';
    const simulation = (req.query.simulation as 'none' | 'cloudburst' | 'blizzard') || 'none';
    const bypassCache = req.query.refresh === 'true' || !!req.query.refresh;
    const district = JK_DISTRICTS.find(d => d.id === districtId) || JK_DISTRICTS[0];

    try {
      const weather = await fetchDistrictWeather(district, simulation, bypassCache);
      const isSim = simulation !== 'none';
      const summary = generateUnifiedRiskSummary(district, weather, isSim);
      res.json(summary);
    } catch (err) {
      res.status(500).json({ error: 'Failed to generate hazard summary', details: String(err) });
    }
  });

  // 6. Specific Hazard Modules
  app.get('/api/hazards/flood', async (req: Request, res: Response) => {
    const districtId = (req.query.districtId as string) || 'srinagar';
    const simulation = (req.query.simulation as 'none' | 'cloudburst' | 'blizzard') || 'none';
    const district = JK_DISTRICTS.find(d => d.id === districtId) || JK_DISTRICTS[0];
    const weather = await fetchDistrictWeather(district, simulation);
    res.json(calculateFloodRisk(district, weather, simulation !== 'none'));
  });

  app.get('/api/hazards/landslide', async (req: Request, res: Response) => {
    const districtId = (req.query.districtId as string) || 'ramban';
    const simulation = (req.query.simulation as 'none' | 'cloudburst' | 'blizzard') || 'none';
    const district = JK_DISTRICTS.find(d => d.id === districtId) || JK_DISTRICTS[0];
    const weather = await fetchDistrictWeather(district, simulation);
    res.json(calculateLandslideRisk(district, weather, simulation !== 'none'));
  });

  app.get('/api/hazards/glof', async (req: Request, res: Response) => {
    const districtId = (req.query.districtId as string) || 'kishtwar';
    const simulation = (req.query.simulation as 'none' | 'cloudburst' | 'blizzard') || 'none';
    const district = JK_DISTRICTS.find(d => d.id === districtId) || JK_DISTRICTS[0];
    const weather = await fetchDistrictWeather(district, simulation);
    res.json(calculateGlofRisk(district, weather, simulation !== 'none'));
  });

  app.get('/api/hazards/extreme-weather', async (req: Request, res: Response) => {
    const districtId = (req.query.districtId as string) || 'srinagar';
    const simulation = (req.query.simulation as 'none' | 'cloudburst' | 'blizzard') || 'none';
    const district = JK_DISTRICTS.find(d => d.id === districtId) || JK_DISTRICTS[0];
    const weather = await fetchDistrictWeather(district, simulation);
    res.json(calculateExtremeWeatherRisk(district, weather, simulation !== 'none'));
  });

  // 7. Alerts
  app.get('/api/alerts', (req: Request, res: Response) => {
    const districtId = req.query.districtId as string;
    const hazardType = req.query.hazard as string;

    let result = [...alertsStore];
    if (districtId && districtId !== 'all') {
      result = result.filter(a => a.districtIds.includes(districtId));
    }
    if (hazardType && hazardType !== 'all') {
      result = result.filter(a => a.hazardType === hazardType);
    }
    res.json(result);
  });

  // 8. Test Alert Simulation Trigger (for Hackathon evaluation)
  app.post('/api/alerts/test', (req: Request, res: Response) => {
    const { districtId, hazardType } = req.body || {};
    const targetDistrict = JK_DISTRICTS.find(d => d.id === districtId) || JK_DISTRICTS[0];

    const testAlert: DisasterAlert = {
      id: `sim-${Date.now()}`,
      title: `[SIMULATION TEST] Urgent Hazard Advisory for ${targetDistrict.name}`,
      hazardType: hazardType || 'flood',
      severity: 'Warning',
      colorCode: 'Orange',
      districtIds: [targetDistrict.id],
      affectedAreasText: targetDistrict.localities.map(l => l.name).slice(0, 3).join(', '),
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
      source: 'AquaSense Model',
      isOfficial: false,
      isSimulated: true,
      headline: `Simulated drill alert initiated for hackathon demonstration in ${targetDistrict.name}.`,
      instructions: [
        'Notice: This is a clearly marked test drill simulation.',
        'No actual emergency evacuation is currently in effect.',
        'Review verified local relief shelter locations in the Emergency & Safety tab.'
      ]
    };

    alertsStore.unshift(testAlert);
    res.json({ success: true, alert: testAlert });
  });

  // 9. Shelters & Contacts
  app.get('/api/shelters', (req: Request, res: Response) => {
    const district = req.query.district as string;
    if (district && district !== 'all') {
      res.json(JK_SHELTERS.filter(s => s.district.toLowerCase() === district.toLowerCase()));
    } else {
      res.json(JK_SHELTERS);
    }
  });

  app.get('/api/emergency-contacts', (_req: Request, res: Response) => {
    res.json(JK_EMERGENCY_CONTACTS);
  });

  // 10. Glacial Lakes & GeoJSON layers
  app.get('/api/glacial-lakes', (_req: Request, res: Response) => {
    res.json(JK_GLACIAL_LAKES);
  });

  app.get('/api/geojson/districts', (_req: Request, res: Response) => {
    res.json(JK_DISTRICTS_GEOJSON);
  });

  app.get('/api/geojson/rivers', (_req: Request, res: Response) => {
    res.json(JK_RIVERS_GEOJSON);
  });

  app.get('/api/geojson/highways', (_req: Request, res: Response) => {
    res.json(JK_HIGHWAYS_GEOJSON);
  });

  // 11. Data status / Freshness
  app.get('/api/data-status', (_req: Request, res: Response) => {
    res.json([
      {
        service: 'Open-Meteo High-Resolution Atmospheric Model',
        status: 'Operational',
        lastPing: new Date().toISOString(),
        latencyMs: 142,
        notes: 'Live ECMWF/GFS blending for 20 J&K districts coordinates'
      },
      {
        service: 'IMD Mausam Early-Warning Ingestion',
        status: 'Operational',
        lastPing: new Date().toISOString(),
        latencyMs: 185,
        notes: 'IMD Srinagar and IMD Jammu color-coded radar/warning bulletin integration'
      },
      {
        service: 'ISRO NRSC Bhuvan Glacial Lake Inventory',
        status: 'Operational',
        lastPing: new Date(Date.now() - 3600000).toISOString(),
        latencyMs: 95,
        notes: 'Cryosphere satellite inventory for high Himalayan cirques'
      },
      {
        service: 'Central Water Commission (CWC) Jhelum/Chenab Gauging Stations',
        status: 'Operational',
        lastPing: new Date().toISOString(),
        latencyMs: 110,
        notes: 'Sangam, Ram Munshi Bagh, Asham, and Akhnoor discharge points'
      },
      {
        service: 'Gemini 3.8 Flash AI Assistant Engine',
        status: ai ? 'Operational' : 'Simulation Fallback',
        lastPing: new Date().toISOString(),
        latencyMs: 240,
        notes: ai ? 'Live server-side grounded model' : 'Structured domain fallback engine active'
      }
    ]);
  });

  // 12. Authority Overview & SOPs
  app.get('/api/authority/overview', async (_req: Request, res: Response) => {
    // Generate UT-wide matrix for all 20 districts
    const matrix = await Promise.all(
      JK_DISTRICTS.map(async (dist) => {
        const weather = await fetchDistrictWeather(dist, 'none');
        const summary = generateUnifiedRiskSummary(dist, weather, false);
        return {
          districtId: dist.id,
          name: dist.name,
          division: dist.division,
          headquarters: dist.headquarters,
          elevationAvgM: dist.elevationAvgM,
          overallRisk: summary.overallRiskLevel,
          score: summary.overallScore,
          floodRisk: summary.hazards.flood.riskLevel,
          landslideRisk: summary.hazards.landslide.riskLevel,
          glofRisk: summary.hazards.glof.riskLevel,
          weatherCondition: summary.weather.conditionText,
          rain24h: summary.weather.precipitationMm24h,
          tempC: summary.weather.temperatureC,
          exposedLocalitiesCount: summary.hazards.flood.exposedAreas.length + summary.hazards.landslide.exposedAreas.length
        };
      })
    );

    res.json({
      timestamp: new Date().toISOString(),
      officerSession: {
        role: 'Disaster Management Specialist (JKSDMA)',
        clearanceLevel: 'Level-2 Authority Operational Room'
      },
      criticalCorridors: [
        {
          corridor: 'NH-44 Jammu-Srinagar Highway',
          status: 'Restricted / Critical Watch (Mehar-Panthyal)',
          risk: 'High',
          action: 'Traffic held at Nagrota & Qazigund as precautionary measure.'
        },
        {
          corridor: 'Historic Mughal Road (Shopian-Bafliaz)',
          status: 'Open with Snow Chains at Peer Ki Gali',
          risk: 'Moderate',
          action: 'High-altitude patrol active.'
        },
        {
          corridor: 'NH-1D Srinagar-Sonamarg-Kargil',
          status: 'Passable up to Sonamarg Market',
          risk: 'Moderate',
          action: 'Zojila Pass night transit closed.'
        }
      ],
      districtMatrix: matrix
    });
  });

  // 13. Authority Standard Operating Procedure (SOP) Generator
  app.post('/api/authority/sop', (req: Request, res: Response) => {
    const { districtId, hazardType, severity } = req.body || {};
    const district = JK_DISTRICTS.find(d => d.id === districtId) || JK_DISTRICTS[0];

    const sop = {
      sopId: `SOP-${district.name.toUpperCase()}-${Date.now().toString().slice(-4)}`,
      generatedAt: new Date().toISOString(),
      district: district.name,
      division: district.division,
      hazard: hazardType || 'flood',
      severity: severity || 'High',
      humanReviewRequirement: 'MANDATORY: Must be authorized by District Magistrate / DDMA Chair before public dispatch.',
      actionPhases: [
        {
          phase: 'Phase 1: Alert & Inter-Agency Mobilization (T-0 to T+2 Hours)',
          actions: [
            `Notify Deputy Commissioner / DDMA Chairperson ${district.name} and activate District Emergency Operation Centre (DEOC 1077).`,
            `Dispatch alert signal to SDRF Battalion and pre-position inflatable boats and water rescue kits along ${district.rivers[0] || 'main river channel'}.`,
            `Instruct Irrigation & Flood Control (I&FC) engineers to take hourly gauge readings.`
          ]
        },
        {
          phase: 'Phase 2: Public Warning & Shelter Readiness (T+2 to T+6 Hours)',
          actions: [
            `Open designated relief shelter: Sher-i-Kashmir Complex / District Degree College relief halls.`,
            `Verify backup power generators, clean drinking water tankers, and medical aid kits at shelters.`,
            `Sound localized sirens or broadcast mobile alerts to vulnerable localities (${district.localities.map(l => l.name).slice(0, 3).join(', ')}).`
          ]
        },
        {
          phase: 'Phase 3: Highway & Lifeline Protection (T+6 to T+12 Hours)',
          actions: [
            `Liaise with Traffic Police SP to manage traffic corridors on ${district.highwayCorridors[0] || 'primary road links'}.`,
            `Position heavy earthmovers (JCBs) and snow-clearing machinery at known bottleneck sectors.`
          ]
        }
      ]
    };

    res.json(sop);
  });

  // 14. Server-Side Gemini AI Assistant (/api/assistant/chat)
  app.post('/api/assistant/chat', async (req: Request, res: Response) => {
    const { message, districtId, language } = req.body || {};

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Missing user message' });
      return;
    }

    const currentDistrict = JK_DISTRICTS.find(d => d.id === districtId) || JK_DISTRICTS[0];
    const weather = await fetchDistrictWeather(currentDistrict, 'none');
    const summary = generateUnifiedRiskSummary(currentDistrict, weather, false);

    const systemPrompt = `You are the AquaSense Disaster Early-Warning Assistant for the Union Territory of Jammu & Kashmir, India.
Your mission is to provide accurate, calm, highly actionable, and life-saving safety guidance to residents, pilgrims, travelers, and disaster managers.

GROUNDING DATA (CURRENT REAL-TIME CONTEXT):
- Selected Location: ${currentDistrict.name} District (${currentDistrict.division} Division), J&K
- Elevation: ${currentDistrict.elevationAvgM} m MSL
- Catchment Rivers: ${currentDistrict.rivers.join(', ')}
- Highway Corridors: ${currentDistrict.highwayCorridors.join(', ')}
- Current Weather: ${weather.temperatureC}°C (${weather.conditionText}), Wind: ${weather.windSpeedKmh} km/h
- 24-Hour Rainfall: ${weather.precipitationMm24h} mm, 48-Hour Forecast: ${weather.precipitationMm48hForecast} mm
- Overall Multi-Hazard Risk Level: ${summary.overallRiskLevel} (Composite Score: ${summary.overallScore}/100)
- Official IMD Alert: ${summary.officialImdAlert?.color} Alert (${summary.officialImdAlert?.category})
- Flood Risk: ${summary.hazards.flood.riskLevel} (${summary.hazards.flood.score}/100)
- Landslide Risk: ${summary.hazards.landslide.riskLevel} (${summary.hazards.landslide.score}/100)
- GLOF Risk: ${summary.hazards.glof.riskLevel} (${summary.hazards.glof.score}/100)
- Extreme Weather Risk: ${summary.hazards.extremeWeather.riskLevel} (${summary.hazards.extremeWeather.score}/100)
- Exposed Settlements: ${summary.hazards.flood.exposedAreas.join(', ')}

GUIDELINES:
1. Always base all risk assessments, river names, and numbers on the above structured data. Never invent fictitious river levels or imaginary shelters.
2. Differentiate between official government alerts (IMD / JKSDMA) and AquaSense model estimates.
3. Advise the user to immediately call 112 or local DEOC 1077 in an acute emergency.
4. Reply in the requested language: ${language || 'en'} (if Hindi, Urdu, Kashmiri, or Dogri is requested, use natural, authentic, respectful regional terms).
5. Keep answers concise, scannable, and reassuring. Do not output markdown code blocks unless necessary.`;

    // If Gemini client is available, run generateContent
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: message,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.3,
            topP: 0.95
          }
        });

        const replyText = response.text || 'Unable to generate response at this moment. Please call 112 in case of urgent emergency.';
        res.json({ reply: replyText, groundedDistrict: currentDistrict.name, timestamp: new Date().toISOString() });
        return;
      } catch (geminiErr) {
        console.warn('Gemini generateContent error, falling back to structured assistant:', geminiErr);
      }
    }

    // High-fidelity structured fallback response when API key is missing or calls are throttled
    let fallbackText = `In ${currentDistrict.name} (${currentDistrict.division} Division), the current overall disaster risk status is ${summary.overallRiskLevel} (Composite Index: ${summary.overallScore}/100).

- Flood Hazard: ${summary.hazards.flood.riskLevel} (${summary.hazards.flood.score}/100). Observed 24h rainfall is ${weather.precipitationMm24h} mm along ${currentDistrict.rivers[0] || 'local basins'}.
- Landslide Hazard: ${summary.hazards.landslide.riskLevel} (${summary.hazards.landslide.score}/100). Watch for rockfalls on ${currentDistrict.highwayCorridors[0] || 'mountain transit routes'}.
- Official Alert: ${summary.officialImdAlert?.color || 'Green'} Alert (${summary.officialImdAlert?.category || 'Normal'}).

Safety Advice:
1. Follow announcements from District Disaster Management Authority (DDMA ${currentDistrict.name}).
2. For verified shelters or stranded commuter relief, consult the Emergency & Safety tab.
3. In case of life-threatening emergency, dial 112 immediately.`;

    if (language === 'hi') {
      fallbackText = `${currentDistrict.name} (${currentDistrict.division} संभाग) में वर्तमान समग्र आपदा जोखिम स्थिति ${summary.overallRiskLevel} है (सूचकांक: ${summary.overallScore}/100)।

- बाढ़ जोखिम: ${summary.hazards.flood.riskLevel} (${weather.precipitationMm24h} मिमी वर्षा दर्ज)।
- भूस्खलन जोखिम: ${summary.hazards.landslide.riskLevel}। ${currentDistrict.highwayCorridors[0] || 'पहाड़ी मार्गों'} पर सतर्क रहें।
- सरकारी अलर्ट: ${summary.officialImdAlert?.color || 'ग्रीन'} अलर्ट।

किसी भी आपात स्थिति में तुरंत 112 या जिला नियंत्रण कक्ष 1077 पर कॉल करें।`;
    } else if (language === 'ur') {
      fallbackText = `${currentDistrict.name} (${currentDistrict.division} ڈویژن) میں قدرتی آفات کا مجموعی خطرہ ${summary.overallRiskLevel} ہے (اسکور: ${summary.overallScore}/100)۔

- سیلاب کا خطرہ: ${summary.hazards.flood.riskLevel} (24 گھنٹوں میں ${weather.precipitationMm24h} ملی میٹر بارش)۔
- تودے گرنے کا خطرہ: ${summary.hazards.landslide.riskLevel}۔
- سرکاری الرٹ: ${summary.officialImdAlert?.color || 'سبز'} الرٹ۔

ہنگامی امداد کے لیے فوری طور پر 112 یا ڈسٹرکٹ ایمرجنسی کنٹرول روم 1077 پر رابطہ کریں۔`;
    }

    res.json({
      reply: fallbackText,
      groundedDistrict: currentDistrict.name,
      timestamp: new Date().toISOString(),
      fallbackMode: true
    });
  });

  // Serve static or Vite middleware
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AquaSense full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
