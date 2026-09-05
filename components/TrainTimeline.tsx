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
      <div className="bg-white rounded-xl p-6 border border-slate-200 text-center text-slate-500 text-sm shadow-sm">
        Destination reached or timeline not available.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
        <div>
          <h3 className="text-base font-bold text-[#082b4c] flex items-center gap-2">
            <Milestone className="h-4 w-4 text-[#0b3b60]" />
            Section-by-Section Dynamic Timeline
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Remaining route blocks with section-wise runtime forecasts & dwell buffers
          </p>
        </div>
        <span className="text-xs text-slate-600 font-mono font-bold bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
          {timeline.length} Sections Forecasted
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#0b3b60] text-white uppercase tracking-wider font-mono text-[11px]">
              <th className="py-3 px-3">Route Section</th>
              <th className="py-3 px-3">Distance</th>
              <th className="py-3 px-3">Nominal Runtime</th>
              <th className="py-3 px-3 text-[#ff9933] font-bold">Predicted Dynamic (P50)</th>
              <th className="py-3 px-3">Range (P10 - P90)</th>
              <th className="py-3 px-3">Dynamic Arrival</th>
              <th className="py-3 px-3">Projected Delay</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-mono">
            {timeline.map((sec, idx) => {
              const isNext = idx === 0;
              return (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    isNext ? 'bg-blue-50/80 font-medium' : (idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70')
                  } hover:bg-sky-50/60`}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-1.5 font-sans">
                      <span className="text-slate-700 font-semibold">{sec.from_station}</span>
                      <ArrowRight className="h-3 w-3 text-slate-400" />
                      <span className="text-slate-900 font-bold">{sec.to_station_name}</span>
                      <span className="text-slate-500 text-[11px]">({sec.to_station})</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-700">{sec.distance_km} km</td>
                  <td className="py-3 px-3 text-slate-500">{sec.nominal_runtime_min}m</td>
                  <td className="py-3 px-3 text-[#082b4c] font-black">{sec.predicted_runtime_min}m</td>
                  <td className="py-3 px-3 text-slate-600">{sec.p10_runtime_min}m – {sec.p90_runtime_min}m</td>
                  <td className="py-3 px-3 text-slate-900 font-bold">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-[#0b3b60] inline" />
                      <span>{sec.expected_arrival}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sec.delay_minutes > 15
                          ? 'bg-red-50 text-red-700 border border-red-300'
                          : sec.delay_minutes > 5
                          ? 'bg-amber-50 text-amber-800 border border-amber-300'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
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
