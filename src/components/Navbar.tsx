import React from 'react';
import { Waves, PhoneCall, ShieldAlert, Sparkles, Languages } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface NavbarProps {
  activeTab: 'home' | 'map' | 'alerts' | 'emergency' | 'authority';
  setActiveTab: (tab: 'home' | 'map' | 'alerts' | 'emergency' | 'authority') => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  openAssistant: () => void;
  activeAlertsCount: number;
  isSimulated: boolean;
  toggleSimulation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  openAssistant,
  activeAlertsCount,
  isSimulated,
  toggleSimulation
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Single text element wordmark with clean vector emblem */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 text-left group shrink-0 focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-sky-400 flex items-center justify-center text-slate-950 shadow-sm shadow-cyan-500/20">
            <Waves className="w-4 h-4 text-slate-950" />
          </div>
          <div className="flex flex-col">
            <span className="text-base md:text-lg font-bold tracking-tight text-white whitespace-nowrap">
              AquaSense
            </span>
            <span className="text-[10px] text-cyan-400 font-medium tracking-wide -mt-1 hidden sm:block">
              J&amp;K Multi-Hazard Warning
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('home')}
            className={`whitespace-nowrap transition-colors hover:text-white py-1 relative ${
              activeTab === 'home' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
            }`}
          >
            {t.home}
            {activeTab === 'home' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`whitespace-nowrap transition-colors hover:text-white py-1 relative ${
              activeTab === 'map' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
            }`}
          >
            {t.liveMap}
            {activeTab === 'map' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`whitespace-nowrap transition-colors hover:text-white py-1 relative flex items-center gap-1.5 ${
              activeTab === 'alerts' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
            }`}
          >
            {t.alerts}
            {activeAlertsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-500/90 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                {activeAlertsCount}
              </span>
            )}
            {activeTab === 'alerts' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('emergency')}
            className={`whitespace-nowrap transition-colors hover:text-white py-1 relative ${
              activeTab === 'emergency' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
            }`}
          >
            {t.emergencySafety}
            {activeTab === 'emergency' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('authority')}
            className={`whitespace-nowrap transition-colors hover:text-white py-1 relative flex items-center gap-1 ${
              activeTab === 'authority' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-amber-300'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            {t.authority}
            {activeTab === 'authority' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action + Language & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Language selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              aria-label={t.selectLanguage}
              className="appearance-none bg-slate-900 border border-slate-700/80 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 pr-6 font-medium focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="ur">اردو</option>
              <option value="ks">كٲشُر</option>
              <option value="dg">डोगरी</option>
            </select>
            <Languages className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2 top-2.5" />
          </div>

          {/* AI Assistant Quick Trigger */}
          <button
            onClick={openAssistant}
            title={t.actions.askAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-200 bg-cyan-950/70 border border-cyan-800/70 rounded-lg hover:bg-cyan-900/60 transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{t.aiAssistant}</span>
          </button>

          {/* Primary Action: Direct Emergency 112 Call */}
          <a
            href="tel:112"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-sm shadow-red-700/30 transition-colors whitespace-nowrap active:scale-95"
            title="Direct Unified Emergency Dispatch"
          >
            <PhoneCall className="w-3.5 h-3.5 text-white" />
            <span className="tracking-wide">112 SOS</span>
          </a>
        </div>
      </div>
    </header>
  );
};
