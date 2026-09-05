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
      <div className="lg:col-span-7 bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <Train className="h-5 w-5 text-[#0b3b60]" />
            <h3 className="text-base font-bold text-[#082b4c]">Rake Dimensions & Technical Specifications</h3>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-blue-50 text-[#082b4c] border border-blue-200 font-bold">
            {dimensions.rakeType.split(' ')[0]} SPEC
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] block font-bold">LOCOMOTIVE</span>
            <span className="text-slate-900 font-black text-xs">{dimensions.locoType}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] block font-bold">COACHES</span>
            <span className="text-[#082b4c] font-black text-sm">{dimensions.coachCount} Coaches</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] block font-bold">TOTAL LENGTH</span>
            <span className="text-slate-900 font-black text-sm">{dimensions.totalLengthMeters} meters</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] block font-bold">GROSS TONNAGE</span>
            <span className="text-amber-800 font-black text-sm">{dimensions.grossWeightTonnes} tonnes</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] block font-bold">MAX SPEED (MPS)</span>
            <span className="text-emerald-700 font-black text-sm">{dimensions.maxPermissibleSpeedKmh} km/h</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] block font-bold">TRACTION POWER</span>
            <span className="text-slate-900 font-bold text-xs">{dimensions.tractionType}</span>
          </div>
        </div>

        <div className="pt-2 text-xs text-slate-600 space-y-1 border-t border-slate-200 font-sans font-medium">
          <div><strong className="text-slate-800">Track Infrastructure:</strong> {dimensions.trackInfrastructure}</div>
          <div><strong className="text-slate-800">Braking Telemetry:</strong> {dimensions.brakeSystem}</div>
        </div>
      </div>

      {/* Card 2: Live Weather & Historical Route Punctuality */}
      <div className="lg:col-span-5 bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <CloudRain className="h-5 w-5 text-[#0b3b60]" />
              <h3 className="text-base font-bold text-[#082b4c]">Real-Time Route Telemetry</h3>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
              WEATHER & CORRIDOR
            </span>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-3 gap-2 mt-3 text-xs font-mono text-center">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-slate-500 text-[10px] block font-bold">TEMP</span>
              <span className="text-slate-900 font-black text-sm">{weather.temperature_c}°C</span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-slate-500 text-[10px] block font-bold">HUMIDITY</span>
              <span className="text-[#082b4c] font-black text-sm">{weather.humidity_pct}%</span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-slate-500 text-[10px] block font-bold">FOG INDEX</span>
              <span className={`font-black text-sm ${weather.fog_visibility_index > 0.3 ? 'text-amber-700' : 'text-emerald-700'}`}>
                {weather.fog_visibility_index.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-3 p-2.5 bg-slate-50 rounded-lg text-xs text-slate-700 border border-slate-200 flex items-center gap-2 font-medium">
            <Wind className="h-4 w-4 text-[#0b3b60] flex-shrink-0" />
            <span>Condition: <strong className="text-slate-900">{weather.description}</strong> (Wind: {weather.wind_speed_kmh} km/h)</span>
          </div>
        </div>

        {/* Historical Corridor Stats */}
        <div className="pt-3 border-t border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-600 font-medium">Route Historical On-Time Rate:</span>
            <span className="text-emerald-700 font-black">{historical.route_ontime_pct}%</span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-600 font-medium">P90 Tail Delay Benchmark:</span>
            <span className="text-amber-800 font-black">+{historical.p90_delay_minutes} min</span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-600 font-medium">Scheduled Slack Recovery:</span>
            <span className="text-[#082b4c] font-black">~{historical.recovery_capacity_minutes} min capacity</span>
          </div>
        </div>
      </div>
    </div>
  );
}
