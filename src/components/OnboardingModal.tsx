import React, { useState } from 'react';
import { Waves, MapPin, Globe, CheckCircle2, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { JKDistrict, SupportedLanguage } from '../types';
import { JK_DISTRICTS } from '../data/jkDistricts';
import { TRANSLATIONS } from '../i18n/translations';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  selectedDistrict: JKDistrict;
  setSelectedDistrict: (district: JKDistrict) => void;
  selectedLocality: string;
  setSelectedLocality: (locality: string) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  language,
  setLanguage,
  selectedDistrict,
  setSelectedDistrict,
  selectedLocality,
  setSelectedLocality
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [requestLocationStatus, setRequestLocationStatus] = useState<string>('');
  const t = TRANSLATIONS[language];

  if (!isOpen) return null;

  const handleRequestGeolocation = () => {
    if (!navigator.geolocation) {
      setRequestLocationStatus('Geolocation not supported by your browser.');
      return;
    }
    setRequestLocationStatus('Locating nearby J&K district...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // Find nearest J&K district by Euclidean distance
        let nearest = JK_DISTRICTS[0];
        let minDist = Infinity;
        for (const dist of JK_DISTRICTS) {
          const d = Math.hypot(dist.lat - latitude, dist.lng - longitude);
          if (d < minDist) {
            minDist = d;
            nearest = dist;
          }
        }
        setSelectedDistrict(nearest);
        if (nearest.localities.length > 0) {
          setSelectedLocality(nearest.localities[0].name);
        }
        setRequestLocationStatus(`Location verified: ${nearest.name} (${nearest.division} Division)`);
      },
      () => {
        setRequestLocationStatus('Permission denied or unavailable. Manual selection retained.');
      },
      { timeout: 7000 }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-6">
          <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-cyan-500' : 'bg-slate-800'}`} />
          <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-cyan-500' : 'bg-slate-800'}`} />
          <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? 'bg-cyan-500' : 'bg-slate-800'}`} />
        </div>

        {/* STEP 1: WELCOME & LANGUAGE */}
        {step === 1 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-sky-400 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20">
                <Waves className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">AquaSense</h2>
                <p className="text-xs text-cyan-400 font-medium">Predict Early. Stay Safe.</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-5">
              Welcome to AquaSense, the AI-assisted geospatial multi-hazard early warning platform for Jammu &amp; Kashmir.
              Real-time intelligence for floods, landslides, GLOFs, and extreme weather across all 20 districts.
            </p>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>{t.selectLanguage}</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { code: 'en' as const, label: 'English', sub: 'Default' },
                  { code: 'hi' as const, label: 'हिन्दी', sub: 'Hindi' },
                  { code: 'ur' as const, label: 'اردو', sub: 'Urdu (RTL)' },
                  { code: 'ks' as const, label: 'كٲشُر', sub: 'Kashmiri' },
                  { code: 'dg' as const, label: 'डोगरी', sub: 'Dogri' }
                ].map((item) => (
                  <button
                    key={item.code}
                    onClick={() => setLanguage(item.code)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      language === item.code
                        ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200'
                        : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-sm">{item.label}</div>
                    <div className="text-[11px] text-slate-400">{item.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-600/20"
            >
              <span>Next: Select Location</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: LOCATION SELECTION */}
        {step === 2 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">Select Your J&amp;K Location</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              AquaSense provides district and tehsil-specific hazard calculations. Choose manually or allow GPS lookup.
            </p>

            {/* GPS lookup button */}
            <div className="mb-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700/60">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-slate-300 font-medium">Use device location</span>
                <button
                  type="button"
                  onClick={handleRequestGeolocation}
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-white rounded-lg transition-colors"
                >
                  Locate Me
                </button>
              </div>
              {requestLocationStatus && (
                <div className="mt-2 text-[11px] text-cyan-300">{requestLocationStatus}</div>
              )}
            </div>

            {/* District select */}
            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  District (20 J&amp;K Districts)
                </label>
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
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <optgroup label="Kashmir Division">
                    {JK_DISTRICTS.filter(d => d.division === 'Kashmir').map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.headquarters})</option>
                    ))}
                  </optgroup>
                  <optgroup label="Jammu Division">
                    {JK_DISTRICTS.filter(d => d.division === 'Jammu').map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.headquarters})</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Tehsil / Locality Focus
                </label>
                <select
                  value={selectedLocality}
                  onChange={(e) => setSelectedLocality(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  {selectedDistrict.localities.map(l => (
                    <option key={l.name} value={l.name}>{l.name} — {l.terrainType} ({l.elevationMeters}m)</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>Next: Data Transparency</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DATA PROVENANCE & TRANSPARENCY */}
        {step === 3 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">How AquaSense Works</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              To ensure public trust and safety, AquaSense strictly categorizes all displayed information:
            </p>

            <div className="space-y-2.5 mb-6 text-xs">
              <div className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200">Official Government Bulletins:</span>
                  <p className="text-slate-400 mt-0.5">Originates directly from IMD (Mausam) and JKSDMA. Official warnings always take highest priority.</p>
                </div>
              </div>

              <div className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200">Model-Generated Risk Estimates:</span>
                  <p className="text-slate-400 mt-0.5">Calculated using Open-Meteo precipitation models, terrain slopes, GSI maps, and ISRO glacial lake data.</p>
                </div>
              </div>

              <div className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200">Demonstration Data Flag:</span>
                  <p className="text-slate-400 mt-0.5">Clearly marked when synthetic scenarios (e.g. 120mm cloudburst) are simulated for hackathon evaluation.</p>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-600/20"
            >
              <span>Enter AquaSense Dashboard</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
