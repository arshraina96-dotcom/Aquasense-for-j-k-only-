import React from 'react';
import { AlertTriangle, RefreshCw, CloudRain, CloudSnow, CheckCircle2 } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface DemoBannerProps {
  simulationScenario: 'none' | 'cloudburst' | 'blizzard';
  setSimulationScenario: (scenario: 'none' | 'cloudburst' | 'blizzard') => void;
  language: SupportedLanguage;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({
  simulationScenario,
  setSimulationScenario,
  language
}) => {
  const t = TRANSLATIONS[language];
  const isSimulated = simulationScenario !== 'none';

  return (
    <div className={`w-full py-2 px-4 transition-colors border-b text-xs ${
      isSimulated
        ? 'bg-amber-950/70 border-amber-800/80 text-amber-200'
        : 'bg-slate-900/60 border-slate-800 text-slate-300'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Status Indicator */}
        <div className="flex items-center gap-2">
          {isSimulated ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              <AlertTriangle className="w-3.5 h-3.5" />
              DEMO DATA ACTIVE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              LIVE TELEMETRY
            </span>
          )}

          <span className="text-slate-300 hidden sm:inline">
            {isSimulated
              ? 'Simulated disaster scenario for hackathon judging. Not an official government warning.'
              : 'Real-time Open-Meteo & IMD Early Warning feeds for Jammu & Kashmir.'}
          </span>
        </div>

        {/* Right: Scenario Switchers & Reset */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px] hidden md:inline">
            Simulation Scenarios:
          </span>

          <button
            onClick={() => setSimulationScenario('cloudburst')}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
              simulationScenario === 'cloudburst'
                ? 'bg-amber-600 text-white font-semibold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Simulate 120mm+ heavy cloudburst over Jhelum basin"
          >
            <CloudRain className="w-3 h-3 text-cyan-300" />
            <span>Monsoon Cloudburst</span>
          </button>

          <button
            onClick={() => setSimulationScenario('blizzard')}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
              simulationScenario === 'blizzard'
                ? 'bg-amber-600 text-white font-semibold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Simulate severe Western Disturbance mountain snowfall"
          >
            <CloudSnow className="w-3 h-3 text-sky-200" />
            <span>Pir Panjal Blizzard</span>
          </button>

          {isSimulated && (
            <button
              onClick={() => setSimulationScenario('none')}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors border border-slate-700"
              title="Reset to live weather & sensor observations"
            >
              <RefreshCw className="w-3 h-3 text-slate-400" />
              <span>{t.resetDemo}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
