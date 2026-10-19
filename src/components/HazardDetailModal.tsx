import React from 'react';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, Info, MapPin, Activity } from 'lucide-react';
import { HazardAssessment, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface HazardDetailModalProps {
  assessment: HazardAssessment | null;
  onClose: () => void;
  language: SupportedLanguage;
}

export const HazardDetailModal: React.FC<HazardDetailModalProps> = ({
  assessment,
  onClose,
  language
}) => {
  if (!assessment) return null;
  const t = TRANSLATIONS[language];

  const getImpactBadge = (impact: 'low' | 'moderate' | 'high' | 'critical') => {
    switch (impact) {
      case 'critical':
        return <span className="text-[11px] font-bold text-rose-400 bg-rose-950/60 border border-rose-800/80 px-2 py-0.5 rounded">Critical Driver</span>;
      case 'high':
        return <span className="text-[11px] font-medium text-orange-400 bg-orange-950/60 border border-orange-800/80 px-2 py-0.5 rounded">High Influence</span>;
      case 'moderate':
        return <span className="text-[11px] font-medium text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded">Moderate</span>;
      default:
        return <span className="text-[11px] font-normal text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">Nominal</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 mb-5 pr-8">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-cyan-400 font-semibold tracking-wide">
                {assessment.districtName} District · Multi-Hazard Analysis
              </span>
              {assessment.isSimulated && (
                <span className="text-[10px] font-bold text-amber-300 bg-amber-900/50 border border-amber-700/50 px-1.5 py-0.5 rounded">
                  DEMO SCENARIO
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {assessment.title}
            </h3>
          </div>
        </div>

        {/* Severity Banner */}
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-400 mb-0.5">Calculated Risk Level</div>
            <div className="text-lg font-bold text-white flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${
                assessment.riskLevel === 'Very High' ? 'bg-rose-500' :
                assessment.riskLevel === 'High' ? 'bg-orange-500' :
                assessment.riskLevel === 'Moderate' ? 'bg-amber-400' : 'bg-emerald-500'
              }`} />
              <span>{assessment.riskLevel}</span>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400 mb-0.5">Index Severity Score</div>
            <div className="text-lg font-mono font-bold text-cyan-300 tabular-nums">
              {assessment.score} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400 mb-0.5">Assessment Validity</div>
            <div className="text-xs text-slate-300 font-medium">
              Next 24 Hours
            </div>
          </div>
        </div>

        {/* Official Warning Note */}
        {assessment.officialWarningActive && (
          <div className="mb-6 p-3.5 bg-rose-950/50 border border-rose-800/80 rounded-xl flex items-start gap-3 text-xs text-rose-200">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-0.5">Active Government Advisory</span>
              <p className="leading-relaxed">
                {assessment.officialWarningDetails || 'Elevated natural hazard caution currently in force for this district.'}
              </p>
            </div>
          </div>
        )}

        {/* Factors Behind Risk */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400" />
            <span>{t.factorsBehindRisk}</span>
          </h4>
          <div className="space-y-2">
            {assessment.factors.map((f, i) => (
              <div key={i} className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-medium text-slate-200">{f.label}</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5 tabular-nums">{f.value}</div>
                </div>
                {getImpactBadge(f.impact)}
              </div>
            ))}
          </div>
        </div>

        {/* Potentially Exposed Localities */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>{t.exposedLocalities}</span>
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {assessment.exposedAreas.map((loc, i) => (
              <span key={i} className="px-2.5 py-1 bg-slate-800 text-slate-300 text-xs rounded-lg border border-slate-700">
                {loc}
              </span>
            ))}
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{t.recommendedPrecautions}</span>
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {assessment.recommendedActions.map((act, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                <span className="leading-relaxed">{act}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Model Transparency & Provenance */}
        <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap justify-between items-center gap-2">
          <span>Source: {assessment.dataSource}</span>
          <span className="font-mono">Model: {assessment.modelDetails.name} ({assessment.modelDetails.version})</span>
        </div>

      </div>
    </div>
  );
};
