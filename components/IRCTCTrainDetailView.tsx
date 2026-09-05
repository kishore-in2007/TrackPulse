'use client';

import React, { useState } from 'react';
import { DynamicETAResponse } from '@/lib/types/eta';
import { 
  Train, 
  Utensils, 
  Star, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck, 
  Navigation, 
  MapPin, 
  Layers, 
  Zap, 
  Flame, 
  Sparkles, 
  Activity, 
  AlertTriangle,
  Info
} from 'lucide-react';

interface IRCTCTrainDetailViewProps {
  eta: DynamicETAResponse;
}

export default function IRCTCTrainDetailView({ eta }: IRCTCTrainDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'HALTS' | 'COACHES' | 'SPECS' | 'SERVICES'>('HALTS');

  // Realistic Coach Composition Sequence based on train type
  const isRajdhani = eta.train_type.toLowerCase().includes('rajdhani');
  const isShatabdi = eta.train_type.toLowerCase().includes('shatabdi');

  const coachComposition = isRajdhani
    ? [
        { code: 'LOCO', type: 'WAP-7 (6000 HP)', class: 'Engine', color: 'bg-red-600 text-white' },
        { code: 'EOG', type: 'Generator Car', class: 'Power', color: 'bg-slate-700 text-white' },
        { code: 'H1', type: 'First AC (1A)', class: 'AC 1st', color: 'bg-amber-600 text-white' },
        { code: 'A1', type: 'AC 2-Tier (2A)', class: 'AC 2-Tier', color: 'bg-emerald-600 text-white' },
        { code: 'A2', type: 'AC 2-Tier (2A)', class: 'AC 2-Tier', color: 'bg-emerald-600 text-white' },
        { code: 'B1', type: 'AC 3-Tier (3A)', class: 'AC 3-Tier', color: 'bg-sky-600 text-white' },
        { code: 'B2', type: 'AC 3-Tier (3A)', class: 'AC 3-Tier', color: 'bg-sky-600 text-white' },
        { code: 'B3', type: 'AC 3-Tier (3A)', class: 'AC 3-Tier', color: 'bg-sky-600 text-white' },
        { code: 'PC', type: 'Pantry Car', class: 'Pantry', color: 'bg-irctc-saffron text-white' },
        { code: 'B4', type: 'AC 3-Tier (3A)', class: 'AC 3-Tier', color: 'bg-sky-600 text-white' },
        { code: 'B5', type: 'AC 3-Tier (3A)', class: 'AC 3-Tier', color: 'bg-sky-600 text-white' },
        { code: 'B6', type: 'AC 3-Tier (3A)', class: 'AC 3-Tier', color: 'bg-sky-600 text-white' },
        { code: 'EOG', type: 'Generator Car', class: 'Power', color: 'bg-slate-700 text-white' },
      ]
    : isShatabdi
    ? [
        { code: 'LOCO', type: 'WAP-5 (5450 HP)', class: 'Engine', color: 'bg-red-600 text-white' },
        { code: 'EOG', type: 'Generator Car', class: 'Power', color: 'bg-slate-700 text-white' },
        { code: 'E1', type: 'Exec Chair Car (EC)', class: 'Exec CC', color: 'bg-amber-600 text-white' },
        { code: 'C1', type: 'AC Chair Car (CC)', class: 'Chair Car', color: 'bg-sky-600 text-white' },
        { code: 'C2', type: 'AC Chair Car (CC)', class: 'Chair Car', color: 'bg-sky-600 text-white' },
        { code: 'C3', type: 'AC Chair Car (CC)', class: 'Chair Car', color: 'bg-sky-600 text-white' },
        { code: 'C4', type: 'AC Chair Car (CC)', class: 'Chair Car', color: 'bg-sky-600 text-white' },
        { code: 'PC', type: 'Mini Pantry Car', class: 'Pantry', color: 'bg-irctc-saffron text-white' },
        { code: 'C5', type: 'AC Chair Car (CC)', class: 'Chair Car', color: 'bg-sky-600 text-white' },
        { code: 'C6', type: 'AC Chair Car (CC)', class: 'Chair Car', color: 'bg-sky-600 text-white' },
        { code: 'EOG', type: 'Generator Car', class: 'Power', color: 'bg-slate-700 text-white' },
      ]
    : [
        { code: 'LOCO', type: 'WAP-7 (6000 HP)', class: 'Engine', color: 'bg-red-600 text-white' },
        { code: 'SLR', type: 'Seating & Luggage', class: 'SLR', color: 'bg-slate-700 text-white' },
        { code: 'GS', type: 'General Second (2S)', class: 'General', color: 'bg-slate-600 text-white' },
        { code: 'S1', type: 'Sleeper Class (SL)', class: 'Sleeper', color: 'bg-indigo-600 text-white' },
        { code: 'S2', type: 'Sleeper Class (SL)', class: 'Sleeper', color: 'bg-indigo-600 text-white' },
        { code: 'S3', type: 'Sleeper Class (SL)', class: 'Sleeper', color: 'bg-indigo-600 text-white' },
        { code: 'S4', type: 'Sleeper Class (SL)', class: 'Sleeper', color: 'bg-indigo-600 text-white' },
        { code: 'PC', type: 'Pantry Car', class: 'Pantry', color: 'bg-irctc-saffron text-white' },
        { code: 'B1', type: 'AC 3-Tier (3A)', class: 'AC 3-Tier', color: 'bg-sky-600 text-white' },
        { code: 'B2', type: 'AC 3-Tier (3A)', class: 'AC 3-Tier', color: 'bg-sky-600 text-white' },
        { code: 'A1', type: 'AC 2-Tier (2A)', class: 'AC 2-Tier', color: 'bg-emerald-600 text-white' },
        { code: 'GS', type: 'General Second (2S)', class: 'General', color: 'bg-slate-600 text-white' },
        { code: 'SLR', type: 'Seating & Luggage', class: 'SLR', color: 'bg-slate-700 text-white' },
      ];

  const runningDays = [
    { day: 'M', active: true, name: 'Mon' },
    { day: 'T', active: true, name: 'Tue' },
    { day: 'W', active: true, name: 'Wed' },
    { day: 'T', active: true, name: 'Thu' },
    { day: 'F', active: true, name: 'Fri' },
    { day: 'S', active: true, name: 'Sat' },
    { day: 'S', active: true, name: 'Sun' },
  ];

  const travelClasses = isRajdhani
    ? ['1A', '2A', '3A', '3E']
    : isShatabdi
    ? ['EC', 'CC']
    : ['1A', '2A', '3A', 'SL', '2S', 'GN'];
  return (
    <div className="bg-white rounded-2xl border border-slate-300 shadow-md overflow-hidden space-y-6">
      {/* Top Banner with IRCTC Header Styling */}
      <div className="bg-gradient-to-r from-[#082b4c] via-[#0b3b60] to-[#082b4c] p-5 sm:p-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 text-white">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">{eta.train_number}</span>
            <span className="text-xl sm:text-2xl font-bold text-white">{eta.train_name}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#ea580c] text-white text-xs font-bold font-mono shadow-xs">
              {eta.train_type.toUpperCase()}
            </span>
          </div>
          <div className="text-xs sm:text-sm text-slate-200 flex items-center space-x-2 font-medium">
            <span>{eta.source_station_name} ({eta.source_station})</span>
            <span className="text-[#ff9933]">━━━━▶</span>
            <span className="font-bold text-white">{eta.destination_station_name} ({eta.destination_station})</span>
          </div>
        </div>

        {/* Running Days & Travel Classes Badge */}
        <div className="flex flex-col sm:items-end space-y-2">
          {/* Running Days */}
          <div className="flex items-center space-x-1">
            <span className="text-[11px] text-slate-300 font-mono mr-1">RUNS ON:</span>
            {runningDays.map((rd, i) => (
              <span
                key={i}
                className={`h-5 w-5 rounded text-[10px] font-black flex items-center justify-center font-mono shadow-xs ${
                  rd.active ? 'bg-[#ea580c] text-white' : 'bg-white/15 text-slate-300'
                }`}
              >
                {rd.day}
              </span>
            ))}
          </div>

          {/* Classes */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[11px] text-slate-300 font-mono mr-1">CLASSES:</span>
            {travelClasses.map((cls) => (
              <span
                key={cls}
                className="px-2 py-0.5 rounded bg-white/15 text-white border border-white/20 text-[10px] font-black font-mono"
              >
                {cls}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Service Highlights Bar */}
      <div className="px-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-2.5 shadow-2xs">
          <Utensils className="h-5 w-5 text-[#ea580c] flex-shrink-0" />
          <div>
            <span className="text-slate-500 text-[10px] block font-bold">CATERING</span>
            <span className="text-slate-900 font-bold text-xs">Pantry Car & E-Catering</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-2.5 shadow-2xs">
          <Star className="h-5 w-5 text-amber-500 flex-shrink-0 fill-amber-500" />
          <div>
            <span className="text-slate-500 text-[10px] block font-bold">PUNCTUALITY RATING</span>
            <span className="text-slate-900 font-bold text-xs">4.6 / 5.0 (High)</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-2.5 shadow-2xs">
          <Zap className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="text-slate-500 text-[10px] block font-bold">AVG OPERATING SPEED</span>
            <span className="text-emerald-700 font-black text-xs">84 km/h (MPS: 140)</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-2.5 shadow-2xs">
          <ShieldCheck className="h-5 w-5 text-[#0b3b60] flex-shrink-0" />
          <div>
            <span className="text-slate-500 text-[10px] block font-bold">CLEANLINESS</span>
            <span className="text-[#082b4c] font-black text-xs">4.7 / 5.0 (OBHS Active)</span>
          </div>
        </div>
      </div>

      {/* Details Navigation Tabs */}
      <div className="px-6">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold font-mono">
          <button
            onClick={() => setActiveTab('HALTS')}
            className={`px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'HALTS'
                ? 'bg-[#ea580c] text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 bg-slate-100 border border-slate-200'
            }`}
          >
            INTERMEDIATE HALTS TIMETABLE ({eta.section_timeline.length + 1} STATIONS)
          </button>

          <button
            onClick={() => setActiveTab('COACHES')}
            className={`px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'COACHES'
                ? 'bg-[#ea580c] text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 bg-slate-100 border border-slate-200'
            }`}
          >
            COACH POSITION & RAKE COMPOSITION
          </button>

          <button
            onClick={() => setActiveTab('SPECS')}
            className={`px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'SPECS'
                ? 'bg-[#ea580c] text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 bg-slate-100 border border-slate-200'
            }`}
          >
            LOCOMOTIVE & TRACK SPECS
          </button>
        </div>
      </div>

      {/* Tab 1: Comprehensive Intermediate Halts Table */}
      {activeTab === 'HALTS' && (
        <div className="px-6 pb-6 space-y-3">
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0b3b60] text-white uppercase text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">Station Code & Name</th>
                  <th className="py-3 px-3">Platform</th>
                  <th className="py-3 px-3">Distance</th>
                  <th className="py-3 px-3">Sched. Arr / Dep</th>
                  <th className="py-3 px-3 text-[#ff9933]">Dynamic Pred. Arr / Dep</th>
                  <th className="py-3 px-3">Halt</th>
                  <th className="py-3 px-3">Live Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {/* Origin Stop */}
                <tr className="bg-white hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-bold text-slate-500">1</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">
                    {eta.source_station_name} ({eta.source_station})
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">PF 1</td>
                  <td className="py-2.5 px-3 text-slate-500">0 km</td>
                  <td className="py-2.5 px-3 text-slate-600">-- : -- / {eta.section_timeline[0]?.expected_departure || '06:10'}</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-black">Departed on time</td>
                  <td className="py-2.5 px-3 text-slate-500">Origin</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold">
                      DEPARTED
                    </span>
                  </td>
                </tr>

                {/* Intermediate Stops */}
                {eta.section_timeline.map((sec, idx) => {
                  const isCurrent = sec.to_station === eta.current_station;
                  const isNext = sec.to_station === eta.next_station;
                  return (
                    <tr
                      key={sec.to_station}
                      className={`transition-colors ${
                        isCurrent
                          ? 'bg-blue-50/90 font-semibold'
                          : isNext
                          ? 'bg-amber-50/70'
                          : idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'
                      } hover:bg-sky-50/50`}
                    >
                      <td className="py-2.5 px-3 font-bold text-slate-500">{idx + 2}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        <div className="flex items-center space-x-1.5">
                          <span>{sec.to_station_name} ({sec.to_station})</span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.5 rounded bg-[#0b3b60] text-white text-[9px] font-bold">
                              CURRENT
                            </span>
                          )}
                          {isNext && (
                            <span className="px-1.5 py-0.5 rounded bg-[#ea580c] text-white text-[9px] font-bold">
                              NEXT
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">PF {(idx % 4) + 1}</td>
                      <td className="py-2.5 px-3 text-slate-500">+{sec.distance_km} km</td>
                      <td className="py-2.5 px-3 text-slate-700 font-medium">
                        {sec.expected_arrival} / {sec.expected_departure}
                      </td>
                      <td className="py-2.5 px-3 text-[#082b4c] font-black">
                        {sec.expected_arrival} (P10: {sec.p10_runtime_min}m)
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">2 min</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            sec.delay_minutes > 15
                              ? 'bg-red-50 text-red-700 border border-red-300'
                              : sec.delay_minutes > 5
                              ? 'bg-amber-50 text-amber-800 border border-amber-300'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          }`}
                        >
                          +{sec.delay_minutes}m Late
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Visual Coach Position & Composition */}
      {activeTab === 'COACHES' && (
        <div className="px-6 pb-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600 font-mono font-bold">
            <span className="text-[#ea580c]">ENGINE DIRECTION ━━━━▶</span>
            <span className="text-slate-800">TOTAL RAKE: {coachComposition.length} COACHES</span>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="inline-flex items-center space-x-2 min-w-full">
              {coachComposition.map((c, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border border-slate-300 flex flex-col items-center justify-between text-center min-w-[72px] h-24 ${c.color} shadow-sm`}
                >
                  <span className="text-[10px] font-bold opacity-90 uppercase">{c.class}</span>
                  <span className="text-base font-black font-mono tracking-wider">{c.code}</span>
                  <span className="text-[9px] opacity-95 truncate max-w-[64px] font-medium">{c.type.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 font-mono flex items-center justify-between border border-slate-200">
            <div className="flex items-center space-x-2">
              <Info className="h-4 w-4 text-[#ea580c]" />
              <span>Standard LHB Center Buffer Coupler (CBC) with On-Board Housekeeping (OBHS)</span>
            </div>
            <span className="text-emerald-700 font-bold">Bio-Vacuum Toilets Equipped</span>
          </div>
        </div>
      )}

      {/* Tab 3: Locomotive & Technical Specs */}
      {activeTab === 'SPECS' && (
        <div className="px-6 pb-6 space-y-4 font-mono text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-slate-500 text-[10px] block font-bold">PRIMARY TRACTION</span>
              <span className="text-slate-900 font-bold">{eta.technical_dimensions?.tractionType || '25 kV AC 50 Hz Electric'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-slate-500 text-[10px] block font-bold">LOCO CLASS</span>
              <span className="text-[#082b4c] font-black">{eta.technical_dimensions?.locoType || 'WAP-7 (6000 HP)'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-slate-500 text-[10px] block font-bold">GROSS TONNAGE</span>
              <span className="text-amber-800 font-black">{eta.technical_dimensions?.grossWeightTonnes || 1220} Tonnes</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-slate-500 text-[10px] block font-bold">BRAKING SYSTEM</span>
              <span className="text-emerald-700 font-bold">Axle Disc + Anti-Skid WSP</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
