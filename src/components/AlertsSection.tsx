import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  Clock,
  Filter,
  CheckCircle2,
  Sparkles,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { DisasterAlert, JKDistrict, SupportedLanguage, HazardType } from '../types';
import { JK_DISTRICTS } from '../data/jkDistricts';
import { TRANSLATIONS } from '../i18n/translations';

interface AlertsSectionProps {
  alerts: DisasterAlert[];
  selectedDistrict: JKDistrict;
  language: SupportedLanguage;
  onTriggerTestAlert: (hazard: HazardType) => void;
}

export const AlertsSection: React.FC<AlertsSectionProps> = ({
  alerts,
  selectedDistrict,
  language,
  onTriggerTestAlert
}) => {
  const [filterHazard, setFilterHazard] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [pushEnabled, setPushEnabled] = useState<boolean>(false);
  const [testHazardType, setTestHazardType] = useState<HazardType>('flood');
  const t = TRANSLATIONS[language];

  const filteredAlerts = alerts.filter(a => {
    if (filterHazard !== 'all' && a.hazardType !== filterHazard) return false;
    if (filterSeverity !== 'all' && a.severity.toLowerCase() !== filterSeverity.toLowerCase()) return false;
    return true;
  });

  const getSeverityStyle = (color: string) => {
    switch (color) {
      case 'Red':
        return 'bg-rose-950/50 border-rose-800 text-rose-300';
      case 'Orange':
        return 'bg-orange-950/50 border-orange-800 text-orange-300';
      case 'Yellow':
        return 'bg-amber-950/50 border-amber-800 text-amber-300';
      default:
        return 'bg-emerald-950/50 border-emerald-800 text-emerald-300';
    }
  };

  const handleTogglePush = () => {
    if (!('Notification' in window)) {
      alert('Browser notifications not supported.');
      return;
    }
    if (Notification.permission === 'granted') {
      setPushEnabled(!pushEnabled);
    } else {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          setPushEnabled(true);
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Early Warning &amp; Disaster Alerts Center
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Real-time verified bulletins issued by IMD Srinagar, JKSDMA, CWC, and AquaSense models
          </p>
        </div>

        {/* Action Buttons: Push notification opt-in & Test Alert simulator */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePush}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              pushEnabled
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{pushEnabled ? 'Push Alerts Enabled' : 'Enable Browser Push'}</span>
          </button>

          {/* Test Alert Simulator for Hackathon */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <select
              value={testHazardType}
              onChange={(e) => setTestHazardType(e.target.value as HazardType)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none px-2 py-0.5"
            >
              <option value="flood">Flood Drill</option>
              <option value="landslide">Landslide Drill</option>
              <option value="glof">GLOF Drill</option>
              <option value="extreme_weather">Severe Storm</option>
            </select>
            <button
              onClick={() => onTriggerTestAlert(testHazardType)}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
              title="Trigger a clearly marked test alert for hackathon judges"
            >
              <Sparkles className="w-3 h-3" />
              <span>Simulate Alert</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto">
          {[
            { id: 'all', label: 'All Hazards' },
            { id: 'flood', label: 'Floods' },
            { id: 'landslide', label: 'Landslides' },
            { id: 'glof', label: 'GLOFs' },
            { id: 'extreme_weather', label: 'Severe Weather' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterHazard(f.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterHazard === f.id
                  ? 'bg-cyan-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <Filter className="w-3.5 h-3.5" />
          <span>Severity:</span>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-2 py-1 text-xs focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="Critical Emergency">Critical Emergency</option>
            <option value="Warning">Warning</option>
            <option value="Watch">Watch</option>
            <option value="Advisory">Advisory</option>
          </select>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-white">No Active Emergency Alerts</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              There are currently no active warnings matching your filter criteria. Environmental sensors continue regular telemetry monitoring.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl border transition-all ${getSeverityStyle(alert.colorCode)}`}
            >
              {/* Alert Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${
                    alert.colorCode === 'Red' ? 'bg-rose-500 text-white' :
                    alert.colorCode === 'Orange' ? 'bg-orange-500 text-white' : 'bg-amber-400 text-slate-950'
                  }`}>
                    {alert.severity}
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    Source: {alert.source}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Valid until {new Date(alert.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {/* Title & Headline */}
              <h4 className="text-base font-bold text-white mb-1">
                {alert.title}
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed mb-3">
                {alert.headline}
              </p>

              {/* Affected Areas */}
              <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-3 bg-slate-950/40 p-2 rounded-lg border border-slate-800/80">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="font-semibold text-slate-400">Affected Zones:</span>
                <span className="truncate">{alert.affectedAreasText}</span>
              </div>

              {/* Official Instructions */}
              <div className="space-y-1.5 text-xs text-slate-300">
                <span className="font-semibold text-white block">Official Safety Directives:</span>
                {alert.instructions.map((inst, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                    <span>{inst}</span>
                  </div>
                ))}
              </div>

              {/* Simulated Flag notice */}
              {alert.isSimulated && (
                <div className="mt-3 pt-2 border-t border-amber-800/60 text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>THIS IS A TEST SIMULATION FOR DRILL / EVALUATION PURPOSES</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};
