'use client';

import React from 'react';
import { DynamicETAResponse } from '@/lib/types/eta';
import { Clock, ShieldCheck, AlertTriangle, AlertOctagon, TrendingUp, Navigation } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';

interface ETACardProps {
  eta: DynamicETAResponse;
}

export default function ETACard({ eta }: ETACardProps) {
  const { t } = useLanguage();
  const getRegimeColor = (regime: string) => {
    switch (regime) {
      case 'DISRUPTED':
        return 'bg-red-50 text-red-700 border-red-300';
      case 'DELAYED':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return 'text-red-600 font-bold';
      case 'MEDIUM':
        return 'text-amber-600 font-bold';
      default:
        return 'text-emerald-700 font-bold';
    }
  };

  return (
    <div className="glass-panel rounded-xl p-6 relative overflow-hidden border border-slate-200 shadow-sm bg-white">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-6">
        <div>
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-black tracking-wide text-[#082b4c] font-mono">{eta.train_number}</span>
            <span className="text-xl font-bold text-slate-900">{eta.train_name}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-slate-700 font-medium">
              {eta.train_type}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-600 mt-1 font-medium">
            <span>{eta.source_station_name} ({eta.source_station})</span>
            <span className="text-slate-400">→</span>
            <span className="text-slate-900 font-bold">{eta.destination_station_name} ({eta.destination_station})</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-md text-xs font-bold border ${getRegimeColor(eta.regime)}`}>
            {eta.regime} REGIME
          </span>
          <span className="px-3 py-1 rounded-md text-xs font-semibold bg-slate-100 border border-slate-300 text-slate-700 font-mono">
            {eta.data_mode} MODE
          </span>
        </div>
      </div>

      {/* Dynamic Forecast Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Current Delay */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
            <span>{t.active_delay}</span>
            <AlertTriangle className={`h-4 w-4 ${eta.current_delay_minutes > 15 ? 'text-red-600' : (eta.current_delay_minutes > 5 ? 'text-amber-600' : 'text-emerald-600')}`} />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className={`text-3xl font-black font-mono ${eta.current_delay_minutes > 15 ? 'text-red-600' : (eta.current_delay_minutes > 5 ? 'text-amber-600' : 'text-emerald-700')}`}>
              +{eta.current_delay_minutes}m
            </span>
            <span className="text-xs text-slate-500 font-medium">behind schedule</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-600 flex items-center space-x-1 font-medium">
            <Navigation className="h-3 w-3 text-[#0b3b60]" />
            <span>@ {eta.current_station_name} ({eta.current_station})</span>
          </div>
        </div>

        {/* Card 2: Dynamic Predicted ETA */}
        <div className="bg-blue-50/70 rounded-lg p-4 border border-blue-200 glow-accent">
          <div className="flex items-center justify-between text-xs text-[#082b4c] font-bold">
            <span>{t.predicted_eta}</span>
            <Clock className="h-4 w-4 text-[#0b3b60]" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black font-mono text-[#082b4c]">{eta.eta_p50}</span>
            <span className="text-xs text-slate-600 font-medium">Sched: {eta.scheduled_arrival}</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-600 font-medium">
            ~{eta.p50_remaining_minutes} min remaining travel time
          </div>
        </div>

        {/* Card 3: Uncertainty Bounds (P10 - P90) */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
            <span>{t.uncertainty_range}</span>
            <TrendingUp className="h-4 w-4 text-slate-500" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-xl font-bold font-mono text-slate-900">{eta.eta_p10}</span>
            <span className="text-slate-400 text-xs font-semibold">to</span>
            <span className="text-xl font-bold font-mono text-slate-900">{eta.eta_p90}</span>
          </div>
          <div className="mt-2 flex items-center space-x-2 text-[11px] text-slate-600 font-medium">
            <span className="text-emerald-700 font-mono font-bold">P10: Opt</span>
            <span>•</span>
            <span className="text-amber-700 font-mono font-bold">P90: Cons</span>
          </div>
        </div>

        {/* Card 4: Calibrated Reliability */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
            <span>{t.reliability}</span>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black font-mono text-emerald-700">
              {Math.round(eta.reliability * 100)}%
            </span>
            <span className="text-xs text-slate-500 font-medium">calibrated</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-600 font-medium">
            {t.delay_risk}: <span className={getRiskColor(eta.risk)}>{eta.risk} ({Math.round(eta.delay_probability * 100)}% prob)</span>
          </div>
        </div>
      </div>

      {/* Real vs Naive Formula Banner */}
      <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-[#082b4c]">Dynamic Sectional ETA Logic:</span>
          <span className="text-slate-600 font-mono text-[11px]">Forecast = Current Time + Remaining Section Runtimes + Dwell Buffers - Recovery Slack</span>
        </div>
        <div className="text-[11px] font-mono text-slate-700 font-bold">
          Horizon: {eta.distance_remaining_km} km | {eta.stops_remaining} stops left
        </div>
      </div>
    </div>
  );
}
