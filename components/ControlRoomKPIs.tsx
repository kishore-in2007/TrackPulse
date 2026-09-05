'use client';

import React from 'react';
import { Train, Clock, AlertTriangle, ShieldCheck, Activity, TrendingDown, Layers, Zap } from 'lucide-react';

interface ControlRoomKPIsProps {
  totalMonitored?: number;
  avgDelayMinutes?: number;
  turnaroundConflicts?: number;
  rocAucScore?: number;
  activeZone?: string;
  punctualityPct?: number;
}

export default function ControlRoomKPIs({
  totalMonitored = 2810,
  avgDelayMinutes = 14.2,
  turnaroundConflicts = 1,
  rocAucScore = 0.9205,
  activeZone = "Southern Railway (SR)",
  punctualityPct = 84.6
}: ControlRoomKPIsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* KPI 1: Monitored Trains */}
      <div className="glass-panel rounded-xl p-3.5 border border-white/5 bg-slate-900/60">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>ACTIVE TRAINS</span>
          <Train className="h-3.5 w-3.5 text-sky-400" />
        </div>
        <div className="mt-1.5 text-xl font-bold font-mono text-white">{totalMonitored.toLocaleString()}</div>
        <div className="text-[10px] text-emerald-400 font-mono mt-0.5">● 100% Tracking</div>
      </div>

      {/* KPI 2: Avg Network Inbound Delay */}
      <div className="glass-panel rounded-xl p-3.5 border border-white/5 bg-slate-900/60">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>AVG NETWORK DELAY</span>
          <Clock className="h-3.5 w-3.5 text-amber-400" />
        </div>
        <div className="mt-1.5 text-xl font-bold font-mono text-amber-400">+{avgDelayMinutes} min</div>
        <div className="text-[10px] text-slate-400 font-mono mt-0.5">Median: +8.0m</div>
      </div>

      {/* KPI 3: Turnaround Shortfalls */}
      <div className="glass-panel rounded-xl p-3.5 border border-white/5 bg-slate-900/60">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>RAKE SHORTFALLS</span>
          <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
        </div>
        <div className="mt-1.5 text-xl font-bold font-mono text-red-400">{turnaroundConflicts}</div>
        <div className="text-[10px] text-red-400/90 font-mono mt-0.5">Propagating Delay</div>
      </div>

      {/* KPI 4: On-Time Punctuality */}
      <div className="glass-panel rounded-xl p-3.5 border border-white/5 bg-slate-900/60">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>PUNCTUALITY RATE</span>
          <TrendingDown className="h-3.5 w-3.5 text-emerald-400" />
        </div>
        <div className="mt-1.5 text-xl font-bold font-mono text-emerald-400">{punctualityPct}%</div>
        <div className="text-[10px] text-slate-400 font-mono mt-0.5">&lt; 15 min threshold</div>
      </div>

      {/* KPI 5: ML Delay Risk ROC-AUC */}
      <div className="glass-panel rounded-xl p-3.5 border border-white/5 bg-slate-900/60">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>ML ROC-AUC</span>
          <ShieldCheck className="h-3.5 w-3.5 text-sky-400" />
        </div>
        <div className="mt-1.5 text-xl font-bold font-mono text-sky-300">{rocAucScore.toFixed(4)}</div>
        <div className="text-[10px] text-sky-400/90 font-mono mt-0.5">Zero-Leakage GBDT</div>
      </div>

      {/* KPI 6: Active Corridor */}
      <div className="glass-panel rounded-xl p-3.5 border border-white/5 bg-slate-900/60">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>FOCUS CORRIDOR</span>
          <Zap className="h-3.5 w-3.5 text-amber-300" />
        </div>
        <div className="mt-1.5 text-sm font-bold font-mono text-white truncate">MAS ⇄ CBE / SBC</div>
        <div className="text-[10px] text-slate-400 font-mono mt-0.5">High Density HDN</div>
      </div>
    </div>
  );
}
