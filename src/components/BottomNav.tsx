import React from 'react';
import { Home, MapPin, Bell, Shield, ShieldCheck } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface BottomNavProps {
  activeTab: 'home' | 'map' | 'alerts' | 'emergency' | 'authority';
  setActiveTab: (tab: 'home' | 'map' | 'alerts' | 'emergency' | 'authority') => void;
  language: SupportedLanguage;
  activeAlertsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  language,
  activeAlertsCount
}) => {
  const t = TRANSLATIONS[language];

  const items = [
    { id: 'home' as const, label: t.home, icon: Home },
    { id: 'map' as const, label: t.liveMap, icon: MapPin },
    { id: 'alerts' as const, label: t.alerts, icon: Bell, badge: activeAlertsCount },
    { id: 'emergency' as const, label: t.emergencySafety, icon: Shield },
    { id: 'authority' as const, label: t.authority, icon: ShieldCheck }
  ];

  return (
    <nav aria-label="Mobile Bottom Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 flex items-center justify-around safe-area-bottom">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors relative min-w-[56px] min-h-[44px] ${
              isActive ? 'text-cyan-400 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5 mb-0.5" />
              {item.badge && item.badge > 0 ? (
                <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center tabular-nums">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] tracking-tight truncate max-w-[64px] text-center">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
