import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { WeatherData, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { Clock, ShieldCheck, AlertTriangle } from 'lucide-react';

interface ForecastChartProps {
  weather: WeatherData;
  language: SupportedLanguage;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ weather, language }) => {
  const t = TRANSLATIONS[language];
  const data = weather.hourlyForecast || [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl shadow-xl text-xs space-y-1">
          <p className="font-semibold text-slate-200">{label}</p>
          <p className="text-cyan-400">
            Precipitation: <span className="font-mono font-bold tabular-nums">{payload[0]?.value} mm/h</span>
          </p>
          <p className="text-amber-400">
            Temperature: <span className="font-mono font-bold tabular-nums">{payload[1]?.value} °C</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-bold text-white tracking-tight">
              {t.hourlyPrecipitation}
            </h4>
            {weather.isRealData ? (
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-2 py-0.5 rounded flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Live NWP Model
              </span>
            ) : weather.isSimulated ? (
              <span className="text-[10px] font-bold text-amber-300 bg-amber-950/70 border border-amber-800/80 px-2 py-0.5 rounded flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Simulation Scenario
              </span>
            ) : (
              <span className="text-[10px] font-bold text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded">
                Cached Baseline
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Hourly rain intensity (mm/h bars) &amp; surface temperature (°C line) from {weather.source}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-cyan-500/80" />
            <span className="text-slate-300">Rainfall (mm)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-amber-400" />
            <span className="text-slate-300">Temp (°C)</span>
          </div>
        </div>
      </div>

      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              yAxisId="left"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}mm`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}°`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              yAxisId="left"
              dataKey="rainMm"
              fill="#06b6d4"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="tempC"
              stroke="#fbbf24"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#fbbf24' }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex flex-wrap items-center gap-4">
          <span>24h Accumulation: <strong className="text-white font-mono tabular-nums">{weather.precipitationMm24h} mm</strong></span>
          <span>48h Forecast Sum: <strong className="text-cyan-400 font-mono tabular-nums">{weather.precipitationMm48hForecast} mm</strong></span>
          <span>Wind Gusts: <strong className="text-white font-mono tabular-nums">{weather.windSpeedKmh} km/h</strong></span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <Clock className="w-3 h-3" />
          <span>Retrieved: {new Date(weather.retrievedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
};
