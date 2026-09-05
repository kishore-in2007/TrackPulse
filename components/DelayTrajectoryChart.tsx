'use client';

import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Line } from 'recharts';
import { SectionForecast } from '@/lib/types/eta';
import { TrendingUp, Clock } from 'lucide-react';

interface DelayTrajectoryChartProps {
  timeline: SectionForecast[];
  trainNumber: string;
}

export default function DelayTrajectoryChart({ timeline, trainNumber }: DelayTrajectoryChartProps) {
  if (!timeline || timeline.length === 0) return null;

  const chartData = timeline.map((sec, idx) => ({
    name: sec.to_station,
    distance: sec.distance_km,
    p10: sec.p10_runtime_min,
    p50: sec.predicted_runtime_min,
    p90: sec.p90_runtime_min,
    nominal: sec.nominal_runtime_min,
    delay: sec.delay_minutes
  }));

  return (
    <div className="glass-panel rounded-xl p-6 border border-white/10 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-sky-400" />
          <div>
            <h3 className="text-base font-bold text-white">Dynamic Quantile Trajectory & Section Runtime Bands</h3>
            <p className="text-xs text-slate-400">P10 (Optimistic) • P50 (Most Likely) • P90 (Conservative) vs Scheduled Baseline</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
            Train {trainNumber}
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="p90Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="p50Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} unit="m" />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            <Area type="monotone" dataKey="p90" stroke="#f59e0b" fill="url(#p90Gradient)" name="P90 Conservative (min)" />
            <Area type="monotone" dataKey="p50" stroke="#38bdf8" strokeWidth={2} fill="url(#p50Gradient)" name="P50 Most Likely (min)" />
            <Line type="monotone" dataKey="p10" stroke="#10b981" strokeDasharray="4 4" strokeWidth={2} dot={false} name="P10 Optimistic (min)" />
            <Line type="monotone" dataKey="nominal" stroke="#e2e8f0" strokeDasharray="2 2" dot={false} name="Timetable Nominal (min)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-center text-xs font-mono">
        <div className="bg-slate-900/40 p-2 rounded border border-white/5">
          <span className="text-emerald-400 font-bold block">P10 LOWER BOUND</span>
          <span className="text-slate-300">Fast clearance & green wave</span>
        </div>
        <div className="bg-slate-900/40 p-2 rounded border border-sky-500/20">
          <span className="text-sky-300 font-bold block">P50 MEDIAN FORECAST</span>
          <span className="text-slate-300">Historical section distribution</span>
        </div>
        <div className="bg-slate-900/40 p-2 rounded border border-white/5">
          <span className="text-amber-400 font-bold block">P90 UPPER BOUND</span>
          <span className="text-slate-300">Congestion & crossing penalties</span>
        </div>
      </div>
    </div>
  );
}
