'use client';

import React from 'react';
import { SectionForecast } from '@/lib/types/eta';
import { Milestone, ArrowRight, Clock, AlertCircle } from 'lucide-react';

interface TrainTimelineProps {
  timeline: SectionForecast[];
  currentStationCode: string;
}

export default function TrainTimeline({ timeline, currentStationCode }: TrainTimelineProps) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-6 border border-white/10 text-center text-slate-400 text-sm">
        Destination reached or timeline not available.
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Milestone className="h-4 w-4 text-sky-400" />
            Section-by-Section Dynamic Timeline
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Remaining route blocks with section-wise runtime forecasts & dwell buffers
          </p>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {timeline.length} Sections Forecasted
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider font-mono">
              <th className="py-2.5 px-3">Route Section</th>
              <th className="py-2.5 px-3">Distance</th>
              <th className="py-2.5 px-3">Nominal Runtime</th>
              <th className="py-2.5 px-3 text-sky-400 font-bold">Predicted Dynamic (P50)</th>
              <th className="py-2.5 px-3">Range (P10 - P90)</th>
              <th className="py-2.5 px-3">Dynamic Arrival</th>
              <th className="py-2.5 px-3">Projected Delay</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono">
            {timeline.map((sec, idx) => {
              const isNext = idx === 0;
              return (
                <tr
                  key={idx}
                  className={`hover:bg-white/5 transition-colors ${
                    isNext ? 'bg-sky-500/10 font-medium' : ''
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-1.5 font-sans">
                      <span className="text-slate-300 font-semibold">{sec.from_station}</span>
                      <ArrowRight className="h-3 w-3 text-slate-500" />
                      <span className="text-white font-bold">{sec.to_station_name}</span>
                      <span className="text-slate-400 text-[11px]">({sec.to_station})</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{sec.distance_km} km</td>
                  <td className="py-3 px-3 text-slate-400">{sec.nominal_runtime_min}m</td>
                  <td className="py-3 px-3 text-sky-300 font-bold">{sec.predicted_runtime_min}m</td>
                  <td className="py-3 px-3 text-slate-400">{sec.p10_runtime_min}m – {sec.p90_runtime_min}m</td>
                  <td className="py-3 px-3 text-white font-semibold flex items-center gap-1">
                    <Clock className="h-3 w-3 text-sky-400 inline" />
                    {sec.expected_arrival}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sec.delay_minutes > 15
                          ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                          : sec.delay_minutes > 5
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      +{sec.delay_minutes}m
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
