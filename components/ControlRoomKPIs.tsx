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
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between text-[11px] text-slate-600 font-bold">
          <span>ACTIVE TRAINS</span>
          <Train className="h-3.5 w-3.5 text-[#0b3b60]" />
        </div>
        <div className="mt-1.5 text-xl font-black font-mono text-[#082b4c]">{totalMonitored.toLocaleString()}</div>
        <div className="text-[10px] text-emerald-700 font-bold font-mono mt-0.5">● 100% Tracking</div>
      </div>

      {/* KPI 2: Avg Network Inbound Delay */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between text-[11px] text-slate-600 font-bold">
          <span>AVG NETWORK DELAY</span>
          <Clock className="h-3.5 w-3.5 text-amber-600" />
        </div>
        <div className="mt-1.5 text-xl font-black font-mono text-amber-700">+{avgDelayMinutes} min</div>
        <div className="text-[10px] text-slate-500 font-mono mt-0.5">Median: +8.0m</div>
      </div>

      {/* KPI 3: Turnaround Shortfalls */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between text-[11px] text-slate-600 font-bold">
          <span>RAKE SHORTFALLS</span>
          <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
        </div>
        <div className="mt-1.5 text-xl font-black font-mono text-red-600">{turnaroundConflicts}</div>
        <div className="text-[10px] text-red-600 font-mono font-semibold mt-0.5">Propagating Delay</div>
      </div>

      {/* KPI 4: On-Time Punctuality */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between text-[11px] text-slate-600 font-bold">
          <span>PUNCTUALITY RATE</span>
          <TrendingDown className="h-3.5 w-3.5 text-emerald-600" />
        </div>
        <div className="mt-1.5 text-xl font-black font-mono text-emerald-700">{punctualityPct}%</div>
        <div className="text-[10px] text-slate-500 font-mono mt-0.5">&lt; 15 min threshold</div>
      </div>

      {/* KPI 5: ML Delay Risk ROC-AUC */}
      <a
        href="/ml"
        className="bg-white rounded-xl p-3.5 border border-slate-200 hover:border-blue-500 shadow-sm transition-all group block cursor-pointer"
        title="View ML Model Explainability & Feature Weights"
      >
        <div className="flex items-center justify-between text-[11px] text-slate-600 font-bold group-hover:text-blue-700">
          <span>ML ROC-AUC</span>
          <ShieldCheck className="h-3.5 w-3.5 text-[#0b3b60] group-hover:text-blue-600" />
        </div>
        <div className="mt-1.5 text-xl font-black font-mono text-[#0b3b60] group-hover:text-blue-700">{rocAucScore.toFixed(4)}</div>
        <div className="text-[10px] text-blue-600 font-mono font-bold mt-0.5 group-hover:underline">View AI Weights &rarr;</div>
      </a>

      {/* KPI 6: Active Corridor */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between text-[11px] text-slate-600 font-bold">
          <span>FOCUS CORRIDOR</span>
          <Zap className="h-3.5 w-3.5 text-[#ea580c]" />
        </div>
        <div className="mt-1.5 text-sm font-bold font-mono text-[#082b4c] truncate">MAS ⇄ CBE / SBC</div>
        <div className="text-[10px] text-slate-500 font-mono mt-0.5">High Density HDN</div>
      </div>
    </div>
  );
}
