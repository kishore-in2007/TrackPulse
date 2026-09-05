'use client';

import React from 'react';
import { DynamicETAResponse } from '@/lib/types/eta';
import { Clock, ShieldCheck, AlertTriangle, AlertOctagon, TrendingUp, Navigation } from 'lucide-react';

interface ETACardProps {
  eta: DynamicETAResponse;
}

export default function ETACard({ eta }: ETACardProps) {
  const getRegimeColor = (regime: string) => {
    switch (regime) {
      case 'DISRUPTED':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'DELAYED':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return 'text-red-400';
      case 'MEDIUM':
        return 'text-amber-400';
      default:
        return 'text-emerald-400';
    }
  };

  return (
    <div className="glass-panel rounded-xl p-6 relative overflow-hidden border border-white/10 shadow-lg">
      {/* Background ambient glow based on delay regime */}
      <div
        className={`absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl opacity-15 pointer-events-none ${
          eta.regime === 'DISRUPTED' ? 'bg-red-500' : (eta.regime === 'DELAYED' ? 'bg-amber-500' : 'bg-sky-500')
        }`}
      />

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
        <div>
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-black tracking-wide text-white font-mono">{eta.train_number}</span>
            <span className="text-xl font-semibold text-slate-200">{eta.train_name}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
              {eta.train_type}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-400 mt-1">
            <span>{eta.source_station_name} ({eta.source_station})</span>
            <span>→</span>
            <span className="text-slate-200 font-medium">{eta.destination_station_name} ({eta.destination_station})</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-md text-xs font-semibold border ${getRegimeColor(eta.regime)}`}>
            {eta.regime} REGIME
          </span>
          <span className="px-3 py-1 rounded-md text-xs font-semibold bg-slate-800/80 border border-slate-700 text-slate-300 font-mono">
            {eta.data_mode} MODE
          </span>
        </div>
      </div>

      {/* Dynamic Forecast Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Current Delay */}
        <div className="bg-slate-900/60 rounded-lg p-4 border border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>ACTIVE DELAY</span>
            <AlertTriangle className={`h-4 w-4 ${getRiskColor(eta.risk)}`} />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className={`text-3xl font-black font-mono ${eta.current_delay_minutes > 15 ? 'text-red-400' : (eta.current_delay_minutes > 5 ? 'text-amber-400' : 'text-emerald-400')}`}>
              +{eta.current_delay_minutes}m
            </span>
            <span className="text-xs text-slate-400">behind schedule</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center space-x-1">
            <Navigation className="h-3 w-3 text-sky-400" />
            <span>@ {eta.current_station_name} ({eta.current_station})</span>
          </div>
        </div>

        {/* Card 2: Dynamic Predicted ETA */}
        <div className="bg-slate-900/60 rounded-lg p-4 border border-sky-500/20 glow-accent">
          <div className="flex items-center justify-between text-xs text-sky-400 font-medium">
            <span>DYNAMIC FORECAST (P50)</span>
            <Clock className="h-4 w-4 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black font-mono text-sky-300">{eta.eta_p50}</span>
            <span className="text-xs text-slate-400">Sched: {eta.scheduled_arrival}</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            ~{eta.p50_remaining_minutes} min remaining travel time
          </div>
        </div>

        {/* Card 3: Uncertainty Bounds (P10 - P90) */}
        <div className="bg-slate-900/60 rounded-lg p-4 border border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>CALIBRATED RANGE</span>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-xl font-bold font-mono text-slate-200">{eta.eta_p10}</span>
            <span className="text-slate-400 text-xs">to</span>
            <span className="text-xl font-bold font-mono text-slate-200">{eta.eta_p90}</span>
          </div>
          <div className="mt-2 flex items-center space-x-2 text-[11px] text-slate-400">
            <span className="text-emerald-400 font-mono">P10: Opt</span>
            <span>•</span>
            <span className="text-amber-400 font-mono">P90: Cons</span>
          </div>
        </div>

        {/* Card 4: Calibrated Reliability */}
        <div className="bg-slate-900/60 rounded-lg p-4 border border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>PREDICTION RELIABILITY</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black font-mono text-emerald-400">
              {Math.round(eta.reliability * 100)}%
            </span>
            <span className="text-xs text-slate-400 font-medium">calibrated</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Delay Risk: <span className={`font-semibold ${getRiskColor(eta.risk)}`}>{eta.risk} ({Math.round(eta.delay_probability * 100)}% prob)</span>
          </div>
        </div>
      </div>

      {/* Real vs Naive Formula Banner */}
      <div className="mt-4 p-3 rounded-lg bg-sky-950/40 border border-sky-500/20 text-xs text-sky-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-sky-400">Dynamic Sectional ETA Logic:</span>
          <span>Forecast = Current Time + Sectional Historical Speeds + Dwell Buffers - Recovery Slack</span>
        </div>
        <div className="text-[11px] font-mono text-sky-300">
          Horizon: {eta.distance_remaining_km} km | {eta.stops_remaining} stops left
        </div>
      </div>
    </div>
  );
}
