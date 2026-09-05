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
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-[#0b3b60]" />
          <div>
            <h3 className="text-base font-bold text-[#082b4c]">Dynamic Quantile Trajectory & Section Runtime Bands</h3>
            <p className="text-xs text-slate-500 font-medium">P10 (Optimistic) • P50 (Most Likely) • P90 (Conservative) vs Scheduled Baseline</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-2.5 py-0.5 rounded bg-blue-50 text-[#082b4c] border border-blue-200 font-bold">
            Train {trainNumber}
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="p90Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ea580c" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#ea580c" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="p50Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.8} />
            <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11, fill: '#475569' }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#475569' }} unit="m" />
            <Tooltip
              contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', fontSize: '12px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              labelStyle={{ color: '#082b4c', fontWeight: 'bold' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            <Area type="monotone" dataKey="p90" stroke="#ea580c" strokeWidth={2} fill="url(#p90Gradient)" name="P90 Conservative (min)" />
            <Area type="monotone" dataKey="p50" stroke="#0284c7" strokeWidth={2.5} fill="url(#p50Gradient)" name="P50 Most Likely (min)" />
            <Line type="monotone" dataKey="p10" stroke="#16a34a" strokeDasharray="4 4" strokeWidth={2} dot={false} name="P10 Optimistic (min)" />
            <Line type="monotone" dataKey="nominal" stroke="#64748b" strokeDasharray="2 2" strokeWidth={1.5} dot={false} name="Timetable Nominal (min)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-center text-xs font-mono">
        <div className="bg-slate-50 p-2 rounded border border-slate-200">
          <span className="text-emerald-700 font-bold block">P10 LOWER BOUND</span>
          <span className="text-slate-600 font-medium">Fast clearance & green wave</span>
        </div>
        <div className="bg-blue-50/70 p-2 rounded border border-blue-200">
          <span className="text-[#082b4c] font-black block">P50 MEDIAN FORECAST</span>
          <span className="text-slate-700 font-medium">Historical section distribution</span>
        </div>
        <div className="bg-slate-50 p-2 rounded border border-slate-200">
          <span className="text-amber-800 font-bold block">P90 UPPER BOUND</span>
          <span className="text-slate-600 font-medium">Congestion & crossing penalties</span>
        </div>
      </div>
    </div>
  );
}
