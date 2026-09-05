'use client';

import React from 'react';
import { TrainTechnicalDimensions } from '@/lib/data/railradar_client';
import { WeatherTelemetry, HistoricalRouteStats } from '@/lib/types/eta';
import { Train, Gauge, Zap, Wind, CloudRain, Thermometer, ShieldCheck, Activity, Info } from 'lucide-react';

interface TechnicalDimensionsCardProps {
  dimensions: TrainTechnicalDimensions;
  weather: WeatherTelemetry;
  historical: HistoricalRouteStats;
}

export default function TechnicalDimensionsCard({ dimensions, weather, historical }: TechnicalDimensionsCardProps) {
  if (!dimensions) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Card 1: Train Dimensions & Mechanical Specifications */}
      <div className="lg:col-span-7 glass-panel rounded-xl p-6 border border-white/10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Train className="h-5 w-5 text-sky-400" />
            <h3 className="text-base font-bold text-white">Rake Dimensions & Technical Specifications</h3>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
            {dimensions.rakeType.split(' ')[0]} SPEC
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="bg-slate-900/60 p-3 rounded-lg border border-white/5 space-y-1">
            <span className="text-slate-400 text-[10px] block">LOCOMOTIVE</span>
            <span className="text-white font-bold text-xs">{dimensions.locoType}</span>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-lg border border-white/5 space-y-1">
            <span className="text-slate-400 text-[10px] block">COACHES</span>
            <span className="text-sky-300 font-bold text-sm">{dimensions.coachCount} Coaches</span>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-lg border border-white/5 space-y-1">
            <span className="text-slate-400 text-[10px] block">TOTAL LENGTH</span>
            <span className="text-white font-bold text-sm">{dimensions.totalLengthMeters} meters</span>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-lg border border-white/5 space-y-1">
            <span className="text-slate-400 text-[10px] block">GROSS TONNAGE</span>
            <span className="text-amber-300 font-bold text-sm">{dimensions.grossWeightTonnes} tonnes</span>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-lg border border-white/5 space-y-1">
            <span className="text-slate-400 text-[10px] block">MAX SPEED (MPS)</span>
            <span className="text-emerald-400 font-bold text-sm">{dimensions.maxPermissibleSpeedKmh} km/h</span>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-lg border border-white/5 space-y-1">
            <span className="text-slate-400 text-[10px] block">TRACTION POWER</span>
            <span className="text-white font-bold text-xs">{dimensions.tractionType}</span>
          </div>
        </div>

        <div className="pt-2 text-xs text-slate-400 space-y-1 border-t border-white/5 font-sans">
          <div><strong>Track Infrastructure:</strong> {dimensions.trackInfrastructure}</div>
          <div><strong>Braking Telemetry:</strong> {dimensions.brakeSystem}</div>
        </div>
      </div>

      {/* Card 2: Live Weather & Historical Route Punctuality */}
      <div className="lg:col-span-5 glass-panel rounded-xl p-6 border border-white/10 space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <CloudRain className="h-5 w-5 text-sky-400" />
              <h3 className="text-base font-bold text-white">Real-Time Route Telemetry</h3>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              WEATHER & CORRIDOR
            </span>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-3 gap-2 mt-3 text-xs font-mono text-center">
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-white/5">
              <span className="text-slate-400 text-[10px] block">TEMP</span>
              <span className="text-white font-bold text-sm">{weather.temperature_c}°C</span>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-white/5">
              <span className="text-slate-400 text-[10px] block">HUMIDITY</span>
              <span className="text-sky-300 font-bold text-sm">{weather.humidity_pct}%</span>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-white/5">
              <span className="text-slate-400 text-[10px] block">FOG INDEX</span>
              <span className={`font-bold text-sm ${weather.fog_visibility_index > 0.3 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {weather.fog_visibility_index.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-3 p-2.5 bg-slate-900/40 rounded-lg text-xs text-slate-300 border border-white/5 flex items-center gap-2">
            <Wind className="h-4 w-4 text-sky-400 flex-shrink-0" />
            <span>Condition: <strong>{weather.description}</strong> (Wind: {weather.wind_speed_kmh} km/h)</span>
          </div>
        </div>

        {/* Historical Corridor Stats */}
        <div className="pt-3 border-t border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Route Historical On-Time Rate:</span>
            <span className="text-emerald-400 font-bold">{historical.route_ontime_pct}%</span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">P90 Tail Delay Benchmark:</span>
            <span className="text-amber-400 font-bold">+{historical.p90_delay_minutes} min</span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Scheduled Slack Recovery:</span>
            <span className="text-sky-300 font-bold">~{historical.recovery_capacity_minutes} min capacity</span>
          </div>
        </div>
      </div>
    </div>
  );
}
