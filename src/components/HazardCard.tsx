import React from 'react';
import { Waves, Mountain, Snowflake, CloudLightning, ArrowUpRight, AlertCircle, ShieldAlert } from 'lucide-react';
import { HazardAssessment, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface HazardCardProps {
  assessment: HazardAssessment;
  imageSrc?: string;
  onOpenDetails: () => void;
  language: SupportedLanguage;
}

export const HazardCard: React.FC<HazardCardProps> = ({
  assessment,
  imageSrc,
  onOpenDetails,
  language
}) => {
  const t = TRANSLATIONS[language];

  const getHazardIcon = () => {
    switch (assessment.hazardType) {
      case 'flood':
        return <Waves className="w-5 h-5 text-sky-400" />;
      case 'landslide':
        return <Mountain className="w-5 h-5 text-amber-400" />;
      case 'glof':
        return <Snowflake className="w-5 h-5 text-teal-400" />;
      case 'extreme_weather':
        return <CloudLightning className="w-5 h-5 text-indigo-400" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Very High':
        return 'text-rose-400 border-rose-500/30 bg-rose-950/40';
      case 'High':
        return 'text-orange-400 border-orange-500/30 bg-orange-950/40';
      case 'Moderate':
        return 'text-amber-400 border-amber-500/30 bg-amber-950/40';
      default:
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40';
    }
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 70) return 'bg-rose-500';
    if (score >= 50) return 'bg-orange-500';
    if (score >= 30) return 'bg-amber-400';
    return 'bg-emerald-500';
  };

  return (
    <div
      onClick={onOpenDetails}
      className="group relative bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700 hover:shadow-xl hover:shadow-cyan-950/20 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      {/* Top Banner Image (if provided) */}
      {imageSrc && (
        <div className="relative h-32 w-full overflow-hidden bg-slate-950">
          <img
            src={imageSrc}
            alt={assessment.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700/60 shadow-sm">
              {getHazardIcon()}
            </div>
            <span className="text-xs font-semibold text-white drop-shadow-md">
              {assessment.title}
            </span>
          </div>

          <div className="absolute top-3 right-3">
            <span className={`px-2.5 py-0.5 text-xs font-bold rounded-md border backdrop-blur-md ${getRiskColor(assessment.riskLevel)}`}>
              {assessment.riskLevel}
            </span>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        {!imageSrc && (
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700">
                {getHazardIcon()}
              </div>
              <h4 className="text-sm font-semibold text-white">
                {assessment.title}
              </h4>
            </div>
            <span className={`px-2.5 py-0.5 text-xs font-bold rounded-md border ${getRiskColor(assessment.riskLevel)}`}>
              {assessment.riskLevel}
            </span>
          </div>
        )}

        {/* Score & Progress Bar */}
        <div className="my-2">
          <div className="flex justify-between items-baseline text-xs mb-1">
            <span className="text-slate-400">Risk Severity Score</span>
            <span className="font-mono font-bold text-white tabular-nums">
              {assessment.score} <span className="text-slate-400 font-normal">/ 100</span>
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${getScoreBarColor(assessment.score)}`}
              style={{ width: `${Math.max(assessment.score, 6)}%` }}
            />
          </div>
        </div>

        {/* Key Factor Highlights */}
        <div className="space-y-1.5 my-2 text-xs">
          {assessment.factors.slice(0, 2).map((factor, idx) => (
            <div key={idx} className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400 truncate max-w-[170px]">{factor.label}</span>
              <span className="font-medium text-slate-200 text-right truncate max-w-[130px] tabular-nums">
                {factor.value}
              </span>
            </div>
          ))}
        </div>

        {/* Official Warning Tag if Active */}
        {assessment.officialWarningActive && (
          <div className="mt-2 py-1 px-2 rounded-lg bg-rose-950/40 border border-rose-800/50 flex items-center gap-1.5 text-[11px] text-rose-300">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
            <span className="truncate font-medium">Official Warning Active</span>
          </div>
        )}

        {/* Footer info & CTA */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="truncate max-w-[180px]">
            {assessment.exposedAreas.length > 0 ? `${assessment.exposedAreas[0]} exposed` : 'Regional coverage'}
          </span>
          <button
            type="button"
            className="flex items-center gap-0.5 text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform"
          >
            <span>{t.actions.viewDetails}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
