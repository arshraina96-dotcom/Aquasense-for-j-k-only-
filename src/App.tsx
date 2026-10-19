import React, { useState, useEffect } from 'react';
import {
  Waves,
  MapPin,
  Calendar,
  CloudRain,
  Wind,
  Droplets,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  RefreshCw,
  Sparkles,
  HelpCircle,
  Building2,
  Users,
  Compass
} from 'lucide-react';
import { JKDistrict, WeatherData, UnifiedRiskSummary, DisasterAlert, SupportedLanguage, HazardType, HazardAssessment } from './types';
import { JK_DISTRICTS, JK_DIVISIONS } from './data/jkDistricts';
import { TRANSLATIONS } from './i18n/translations';
import { fetchDistrictWeather } from './services/weatherService';
import { generateUnifiedRiskSummary } from './services/hazardEngine';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { DemoBanner } from './components/DemoBanner';
import { OnboardingModal } from './components/OnboardingModal';
import { HazardCard } from './components/HazardCard';
import { HazardDetailModal } from './components/HazardDetailModal';
import { RiskMap } from './components/RiskMap';
import { ForecastChart } from './components/ForecastChart';
import { AlertsSection } from './components/AlertsSection';
import { EmergencyCentre } from './components/EmergencyCentre';
import { AuthorityDashboard } from './components/AuthorityDashboard';
import { AssistantDrawer } from './components/AssistantDrawer';
import { WeatherSourceBadge } from './components/WeatherSourceBadge';

// Image assets generated for AquaSense
const HERO_BG = '/src/assets/images/aquasense_hero_jk_1792333963703.jpg';
const FLOOD_IMG = '/src/assets/images/flood_jhelum_monitoring_1792333963946.jpg';
const LANDSLIDE_IMG = '/src/assets/images/landslide_pirpanjal_slope_1792333965132.jpg';
const GLOF_IMG = '/src/assets/images/glof_glacial_lake_himalayas_1792333964816.jpg';

export function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'map' | 'alerts' | 'emergency' | 'authority'>('home');
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [selectedDistrict, setSelectedDistrict] = useState<JKDistrict>(JK_DISTRICTS[0]); // Default to Srinagar
  const [selectedDivision, setSelectedDivision] = useState<string>('All');
  const [selectedLocality, setSelectedLocality] = useState<string>(JK_DISTRICTS[0].localities[0]?.name || 'Central');
  const [simulationScenario, setSimulationScenario] = useState<'none' | 'cloudburst' | 'blizzard'>('none');
  
  const [riskSummary, setRiskSummary] = useState<UnifiedRiskSummary | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(true);
  const [alerts, setAlerts] = useState<DisasterAlert[]>([]);
  
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [activeModalHazard, setActiveModalHazard] = useState<HazardAssessment | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isRefreshingWeather, setIsRefreshingWeather] = useState<boolean>(false);

  const t = TRANSLATIONS[language];
  const isRTL = language === 'ur' || language === 'ks';

  // Monitor online / offline network state
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // First-time visit onboarding check
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('aquasense_onboarded_v1');
    if (!hasSeenOnboarding) {
      setIsOnboardingOpen(true);
      localStorage.setItem('aquasense_onboarded_v1', 'true');
    }
  }, []);

  // Fetch or calculate risk summary when district or simulation scenario changes
  useEffect(() => {
    let isCancelled = false;
    async function loadData() {
      setIsLoadingSummary(true);
      try {
        // Fetch from backend API
        const res = await fetch(
          `/api/hazards/summary?districtId=${selectedDistrict.id}&simulation=${simulationScenario}`
        );
        if (!res.ok) throw new Error('API fetch failed');
        const data = await res.json();
        if (!isCancelled) {
          setRiskSummary(data);
        }
      } catch (e) {
        console.warn('API fetch fallback to client engine:', e);
        // Fallback to client-side engine if server request takes too long
        const weather = await fetchDistrictWeather(selectedDistrict, simulationScenario);
        const summary = generateUnifiedRiskSummary(
          selectedDistrict,
          weather,
          simulationScenario !== 'none'
        );
        if (!isCancelled) {
          setRiskSummary(summary);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingSummary(false);
        }
      }
    }

    loadData();
    return () => { isCancelled = true; };
  }, [selectedDistrict, simulationScenario]);

  // Load active alerts from backend
  useEffect(() => {
    async function loadAlerts() {
      try {
        const res = await fetch('/api/alerts');
        if (res.ok) {
          const data = await res.json();
          setAlerts(data);
        }
      } catch (e) {
        console.warn('Alerts fetch error:', e);
      }
    }
    loadAlerts();
  }, []);

  const handleTriggerTestAlert = async (hazardType: HazardType) => {
    try {
      const res = await fetch('/api/alerts/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          districtId: selectedDistrict.id,
          hazardType
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAlerts((prev) => [data.alert, ...prev]);
        setActiveTab('alerts');
      }
    } catch (e) {
      console.warn('Test alert creation error:', e);
    }
  };

  const handleRefreshWeather = async () => {
    setIsRefreshingWeather(true);
    try {
      const res = await fetch(
        `/api/hazards/summary?districtId=${selectedDistrict.id}&simulation=${simulationScenario}&refresh=true`
      );
      if (res.ok) {
        const data = await res.json();
        setRiskSummary(data);
      }
    } catch (e) {
      console.warn('Weather refresh error:', e);
    } finally {
      setIsRefreshingWeather(false);
    }
  };

  const filteredDistrictList = selectedDivision === 'All'
    ? JK_DISTRICTS
    : JK_DISTRICTS.filter(d => d.division === selectedDivision);

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 pb-20 md:pb-6"
    >
      
      {/* 1. TOP NAVBAR (Complies with Top Bar Contract) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        openAssistant={() => setIsAssistantOpen(true)}
        activeAlertsCount={alerts.length}
        isSimulated={simulationScenario !== 'none'}
        toggleSimulation={() => setSimulationScenario(simulationScenario === 'none' ? 'cloudburst' : 'none')}
      />

      {/* 2. DEMO DATA & SIMULATION BANNER */}
      <DemoBanner
        simulationScenario={simulationScenario}
        setSimulationScenario={setSimulationScenario}
        language={language}
      />

      {/* Offline Alert Bar if disconnected */}
      {!isOnline && (
        <div className="bg-amber-950 border-b border-amber-800 py-1.5 px-4 text-xs text-amber-300 text-center flex items-center justify-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Offline Mode: Displaying cached local safety guidelines and last known telemetry.</span>
        </div>
      )}

      {/* 3. MAIN CONTENT CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* TAB 1: CITIZEN HOME DASHBOARD */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            
            {/* LOCATION SELECTOR & STATUS STRIP */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
              
              {/* Left: District & Locality Selection */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-800/80 text-cyan-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase block">
                      Active Telemetry Sector
                    </span>
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedDistrict.id}
                        onChange={(e) => {
                          const found = JK_DISTRICTS.find(d => d.id === e.target.value);
                          if (found) {
                            setSelectedDistrict(found);
                            if (found.localities.length > 0) {
                              setSelectedLocality(found.localities[0].name);
                            }
                          }
                        }}
                        className="bg-transparent text-base sm:text-lg font-bold text-white focus:outline-none cursor-pointer pr-4"
                      >
                        <optgroup label="Kashmir Division (10 Districts)">
                          {JK_DISTRICTS.filter(d => d.division === 'Kashmir').map(d => (
                            <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                              {d.name} ({d.division})
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Jammu Division (10 Districts)">
                          {JK_DISTRICTS.filter(d => d.division === 'Jammu').map(d => (
                            <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                              {d.name} ({d.division})
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:block h-8 w-px bg-slate-800" />

                {/* Tehsil Focus Picker */}
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Tehsil / Locality</span>
                  <select
                    value={selectedLocality}
                    onChange={(e) => setSelectedLocality(e.target.value)}
                    className="bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
                  >
                    {selectedDistrict.localities.map(loc => (
                      <option key={loc.name} value={loc.name} className="bg-slate-900 text-white">
                        {loc.name} ({loc.elevationMeters}m)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Right: Telemetry Freshness & Quick Weather Snapshot */}
              <div className="flex items-center gap-4 text-xs">
                {riskSummary && (
                  <div className="flex items-center gap-3 bg-slate-800/40 px-3 py-1.5 rounded-xl border border-slate-700/60">
                    <div className="flex items-center gap-1.5">
                      <CloudRain className="w-4 h-4 text-cyan-400" />
                      <span className="font-mono font-bold text-white tabular-nums">
                        {riskSummary.weather.temperatureC}°C
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Wind className="w-3.5 h-3.5" />
                      <span className="font-mono tabular-nums">{riskSummary.weather.windSpeedKmh} km/h</span>
                    </div>
                    <div className="hidden md:flex items-center gap-1 text-slate-400">
                      <Droplets className="w-3.5 h-3.5 text-sky-400" />
                      <span className="font-mono tabular-nums">{riskSummary.weather.precipitationMm24h} mm (24h)</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setIsOnboardingOpen(true)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Onboarding & Region Guide"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* REAL WEATHER FORECAST PROVIDER ATTRIBUTION & TELEMETRY BADGE */}
            {riskSummary && (
              <WeatherSourceBadge
                weather={riskSummary.weather}
                district={selectedDistrict}
                language={language}
                onRefresh={handleRefreshWeather}
                isRefreshing={isRefreshingWeather}
              />
            )}

            {/* UNIFIED MULTI-HAZARD STATUS BANNER */}
            {riskSummary && (
              <div className={`p-5 rounded-2xl border transition-all ${
                riskSummary.overallRiskLevel === 'Very High' ? 'bg-rose-950/40 border-rose-800/80 text-rose-200' :
                riskSummary.overallRiskLevel === 'High' ? 'bg-orange-950/40 border-orange-800/80 text-orange-200' :
                riskSummary.overallRiskLevel === 'Moderate' ? 'bg-amber-950/40 border-amber-800/80 text-amber-200' :
                'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className={`p-3 rounded-xl shrink-0 ${
                      riskSummary.overallRiskLevel === 'Very High' ? 'bg-rose-600 text-white' :
                      riskSummary.overallRiskLevel === 'High' ? 'bg-orange-500 text-white' :
                      riskSummary.overallRiskLevel === 'Moderate' ? 'bg-amber-500 text-slate-950' :
                      'bg-emerald-600 text-white'
                    }`}>
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase tracking-wider font-bold">
                          {selectedDistrict.name} · {t.overallStatus}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900/60 font-mono tabular-nums font-semibold">
                          Score: {riskSummary.overallScore}/100
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                        {riskSummary.overallRiskLevel} Risk State
                      </h3>
                    </div>
                  </div>

                  {/* IMD Alert Tag */}
                  {riskSummary.officialImdAlert && (
                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs max-w-md">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          riskSummary.officialImdAlert.color === 'Red' ? 'bg-rose-500' :
                          riskSummary.officialImdAlert.color === 'Orange' ? 'bg-orange-500' :
                          riskSummary.officialImdAlert.color === 'Yellow' ? 'bg-amber-400' : 'bg-emerald-500'
                        }`} />
                        <span className="font-bold text-white">
                          IMD {riskSummary.officialImdAlert.color} Alert ({riskSummary.officialImdAlert.category})
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-2">
                        {riskSummary.officialImdAlert.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 4 CORE HAZARD CARDS */}
            {riskSummary && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-white tracking-tight uppercase tracking-wider">
                    Core Hazard Prediction Modules
                  </h4>
                  <span className="text-xs text-slate-400">
                    Click any module for scientific factor breakdown
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <HazardCard
                    assessment={riskSummary.hazards.flood}
                    imageSrc={FLOOD_IMG}
                    onOpenDetails={() => setActiveModalHazard(riskSummary.hazards.flood)}
                    language={language}
                  />

                  <HazardCard
                    assessment={riskSummary.hazards.landslide}
                    imageSrc={LANDSLIDE_IMG}
                    onOpenDetails={() => setActiveModalHazard(riskSummary.hazards.landslide)}
                    language={language}
                  />

                  <HazardCard
                    assessment={riskSummary.hazards.glof}
                    imageSrc={GLOF_IMG}
                    onOpenDetails={() => setActiveModalHazard(riskSummary.hazards.glof)}
                    language={language}
                  />

                  <HazardCard
                    assessment={riskSummary.hazards.extremeWeather}
                    onOpenDetails={() => setActiveModalHazard(riskSummary.hazards.extremeWeather)}
                    language={language}
                  />
                </div>
              </div>
            )}

            {/* PRECIPITATION FORECAST TIMELINE CHART */}
            {riskSummary && (
              <ForecastChart
                weather={riskSummary.weather}
                language={language}
              />
            )}

            {/* QUICK RELIEF & ACTIONS BANNER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Verified Shelters Shortcut */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-cyan-400 font-semibold block mb-1">
                    Emergency Refuge Network
                  </span>
                  <h4 className="text-base font-bold text-white mb-1">
                    Nearest Verified Shelters
                  </h4>
                  <p className="text-xs text-slate-400">
                    Explore flood-safe public halls and transit camps in {selectedDistrict.name}.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('emergency')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  <span>View Shelters</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Live Interactive Map Shortcut */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-sky-400 font-semibold block mb-1">
                    Geospatial GIS Engine
                  </span>
                  <h4 className="text-base font-bold text-white mb-1">
                    Live Multi-Hazard Map
                  </h4>
                  <p className="text-xs text-slate-400">
                    Interactive MapLibre view of Jhelum basins, NH-44 slopes &amp; glacial lakes.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('map')}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-md shadow-cyan-600/20"
                >
                  <span>Open Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: INTERACTIVE LIVE RISK MAP */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Jammu &amp; Kashmir Live Multi-Hazard Geospatial Map
                </h3>
                <p className="text-xs text-slate-400">
                  Full 20-district vector boundary visualization with river corridors and high-altitude lakes
                </p>
              </div>
            </div>

            <RiskMap
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={setSelectedDistrict}
              language={language}
            />
          </div>
        )}

        {/* TAB 3: ALERTS & NOTIFICATIONS */}
        {activeTab === 'alerts' && (
          <AlertsSection
            alerts={alerts}
            selectedDistrict={selectedDistrict}
            language={language}
            onTriggerTestAlert={handleTriggerTestAlert}
          />
        )}

        {/* TAB 4: EMERGENCY & SAFETY CENTRE */}
        {activeTab === 'emergency' && (
          <EmergencyCentre
            selectedDistrict={selectedDistrict}
            language={language}
          />
        )}

        {/* TAB 5: AUTHORITY DASHBOARD */}
        {activeTab === 'authority' && (
          <AuthorityDashboard
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            language={language}
          />
        )}

      </main>

      {/* 4. MODALS & DRAWERS */}
      
      {/* Onboarding & Territory Picker Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        language={language}
        setLanguage={setLanguage}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        selectedLocality={selectedLocality}
        setSelectedLocality={setSelectedLocality}
      />

      {/* Hazard Deep Dive Modal */}
      <HazardDetailModal
        assessment={activeModalHazard}
        onClose={() => setActiveModalHazard(null)}
        language={language}
      />

      {/* Conversational AquaSense Assistant Drawer (Server-Side Gemini 3.8 Flash) */}
      <AssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        selectedDistrict={selectedDistrict}
        riskSummary={riskSummary}
        language={language}
      />

      {/* 5. MOBILE BOTTOM NAVIGATION */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        activeAlertsCount={alerts.length}
      />

      {/* 6. CLEAN FOOTER */}
      <footer className="mt-auto border-t border-slate-800/80 py-4 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">AquaSense</span>
            <span>·</span>
            <span>Jammu &amp; Kashmir Multi-Hazard Warning Platform</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Data: IMD, Open-Meteo, ISRO NRSC</span>
            <span>·</span>
            <span>Emergency: 112 / 1070 / 1077</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
export default App;
