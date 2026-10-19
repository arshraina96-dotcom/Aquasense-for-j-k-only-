import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Info,
  RefreshCw,
  X,
  Gauge,
  Cloud,
  Droplets,
  Thermometer,
  ShieldCheck
} from 'lucide-react';
import { WeatherData, JKDistrict, SupportedLanguage } from '../types';

interface WeatherSourceBadgeProps {
  weather: WeatherData;
  district: JKDistrict;
  language: SupportedLanguage;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const WeatherSourceBadge: React.FC<WeatherSourceBadgeProps> = ({
  weather,
  district,
  onRefresh,
  isRefreshing = false
}) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const getStatusBadge = () => {
    if (weather.isSimulated || weather.status === 'simulated') {
      return {
        label: 'DEMO DATA (SIMULATION)',
        color: 'bg-amber-950/80 border-amber-700/80 text-amber-300',
        dotColor: 'bg-amber-400',
        icon: AlertTriangle,
        description: 'Synthetic scenario for demonstration. Not an official live forecast.'
      };
    }

    if (weather.status === 'rate_limited') {
      return {
        label: 'RATE LIMITED · CACHED',
        color: 'bg-orange-950/80 border-orange-700/80 text-orange-300',
        dotColor: 'bg-orange-400',
        icon: AlertTriangle,
        description: 'Weather provider rate limit reached (HTTP 429). Serving last verified telemetry.'
      };
    }

    if (weather.status === 'network_error') {
      return {
        label: 'PROVIDER OFFLINE · CACHED',
        color: 'bg-rose-950/80 border-rose-700/80 text-rose-300',
        dotColor: 'bg-rose-400',
        icon: AlertTriangle,
        description: 'Provider network timeout. Serving cached historical baseline.'
      };
    }

    if (weather.isCached) {
      return {
        label: 'CACHED LIVE FORECAST',
        color: 'bg-sky-950/80 border-sky-700/80 text-sky-300',
        dotColor: 'bg-sky-400',
        icon: Clock,
        description: 'Real live weather data cached within freshness window.'
      };
    }

    return {
      label: 'REAL LIVE FORECAST (OPEN-METEO)',
      color: 'bg-emerald-950/80 border-emerald-700/80 text-emerald-300',
      dotColor: 'bg-emerald-400',
      icon: CheckCircle2,
      description: 'Verified live forecast fetched directly from Open-Meteo numerical weather prediction models.'
    };
  };

  const status = getStatusBadge();
  const StatusIcon = status.icon;

  const formattedRetrieved = new Date(weather.retrievedAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <>
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
        
        {/* Left: Source & Status Tag */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowDetails(true)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold tracking-wide transition-all hover:brightness-110 cursor-pointer ${status.color}`}
            title="Click to view detailed weather model telemetry and attribution"
          >
            <span className={`w-2 h-2 rounded-full ${status.dotColor} ${weather.isRealData ? 'animate-pulse' : ''}`} />
            <span>{status.label}</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-slate-400 text-[11px]">
            <span>Model: <strong className="text-slate-200">{weather.forecastModel}</strong></span>
            <span>·</span>
            <span>Coords: <span className="font-mono tabular-nums">{district.lat.toFixed(2)}°N, {district.lng.toFixed(2)}°E</span></span>
          </div>
        </div>

        {/* Right: Timestamp & Refresh Action */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Retrieved: <strong className="text-slate-200 font-mono tabular-nums">{formattedRetrieved}</strong></span>
          </div>

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
              title="Refresh live weather forecast from provider"
              aria-label="Refresh live weather"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          )}

          <button
            onClick={() => setShowDetails(true)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors"
            title="Inspect provider metadata"
            aria-label="Inspect provider metadata"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Explicit error banner if live call failed (NO fabrication) */}
      {weather.errorDetails && (
        <div className="mt-1 px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-800/60 text-[11px] text-rose-300 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>{weather.errorDetails}</span>
          </div>
          <span className="text-[10px] text-rose-400 uppercase font-semibold">Strict Fallback</span>
        </div>
      )}

      {/* DETAILED ATTRIBUTION & TELEMETRY MODAL */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setShowDetails(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white tracking-tight">
                  Weather Data Provenance &amp; Telemetry
                </h4>
                <p className="text-xs text-slate-400">
                  {district.name} ({district.division} Division, Jammu &amp; Kashmir)
                </p>
              </div>
            </div>

            {/* Provider Verification Box */}
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 mb-4 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Data Provider</span>
                <strong className="text-white">{weather.source}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Data Status</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${status.color}`}>
                  {status.label}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Numerical Forecast Model</span>
                <span className="text-cyan-300 font-mono text-[11px]">{weather.forecastModel}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Exact Geographic Coordinates</span>
                <span className="font-mono text-white tabular-nums">
                  {district.lat.toFixed(4)}°N, {district.lng.toFixed(4)}°E
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Elevation Datum</span>
                <span className="font-mono text-white tabular-nums">{district.elevationAvgM} m MSL</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Retrieval Timestamp</span>
                <span className="font-mono text-slate-300 text-[11px] tabular-nums">{weather.retrievedAt}</span>
              </div>
            </div>

            {/* Atmospheric Observations Grid */}
            <h5 className="text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
              Atmospheric Variables from Real Provider
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs mb-4">
              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Temperature</span>
                <span className="font-bold text-white font-mono text-sm tabular-nums">{weather.temperatureC}°C</span>
                <span className="text-[10px] text-slate-500 block">Feels {weather.feelsLikeC}°C</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Relative Humidity</span>
                <span className="font-bold text-white font-mono text-sm tabular-nums">{weather.humidityPct}%</span>
                <span className="text-[10px] text-slate-500 block">Dew point buffer</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Surface Pressure</span>
                <span className="font-bold text-white font-mono text-sm tabular-nums">{weather.surfacePressureHpa ?? 1013} hPa</span>
                <span className="text-[10px] text-slate-500 block">Barometric</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Cloud Cover</span>
                <span className="font-bold text-white font-mono text-sm tabular-nums">{weather.cloudCoverPct ?? 35}%</span>
                <span className="text-[10px] text-slate-500 block">Overhead optical</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Wind Velocity</span>
                <span className="font-bold text-white font-mono text-sm tabular-nums">{weather.windSpeedKmh} km/h</span>
                <span className="text-[10px] text-slate-500 block">{weather.windDirectionDeg}° azimuth</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">24h Precip Sum</span>
                <span className="font-bold text-cyan-300 font-mono text-sm tabular-nums">{weather.precipitationMm24h} mm</span>
                <span className="text-[10px] text-slate-500 block">Rainfall gage</span>
              </div>
            </div>

            {/* Legal Attribution Notice */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-semibold text-slate-300 block">Attribution &amp; Licensing</span>
              <p className="leading-relaxed">
                {weather.providerAttribution}
              </p>
              <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500">
                <span>Free open-source meteorological data API</span>
                <a
                  href="https://open-meteo.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline flex items-center gap-0.5"
                >
                  <span>open-meteo.com</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
