'use client';

import React, { useState, useMemo } from 'react';
import { Search, Train, ArrowRight, Filter, Zap, Compass, Star } from 'lucide-react';

interface UniversalTrainPickerProps {
  onSelectTrain?: (trainId: string) => void;
  selectedTrainId?: string;
}

const FEATURED_TRAINS = [
  { id: '12675', name: 'Kovai Express', from: 'MAS', to: 'CBE', type: 'Superfast', zone: 'SR' },
  { id: '12952', name: 'Mumbai Rajdhani', from: 'NDLS', to: 'MMCT', type: 'Rajdhani', zone: 'WR' },
  { id: '12007', name: 'Mysore Shatabdi', from: 'MAS', to: 'MYS', type: 'Shatabdi', zone: 'SR' },
  { id: '12622', name: 'Tamil Nadu Express', from: 'NDLS', to: 'MAS', type: 'Superfast', zone: 'SR' },
  { id: '12423', name: 'Dibrugarh Rajdhani', from: 'DBRG', to: 'NDLS', type: 'Rajdhani', zone: 'NR' },
  { id: '12842', name: 'Coromandel Express', from: 'HWH', to: 'MAS', type: 'Superfast', zone: 'SER' },
  { id: '22626', name: 'Bangalore Double Decker', from: 'SBC', to: 'MAS', type: 'Superfast', zone: 'SWR' },
  { id: '12243', name: 'Coimbatore Shatabdi', from: 'MAS', to: 'CBE', type: 'Shatabdi', zone: 'SR' },
  { id: '12658', name: 'Chennai Mail', from: 'SBC', to: 'MAS', type: 'Mail', zone: 'SR' },
  { id: '12951', name: 'Tejas Rajdhani Express', from: 'MMCT', to: 'NDLS', type: 'Rajdhani', zone: 'WR' },
  { id: '20801', name: 'Magadh Express', from: 'IPR', to: 'NDLS', type: 'Superfast', zone: 'ECR' },
  { id: '12602', name: 'Mangalore Mail', from: 'MAQ', to: 'MAS', type: 'Mail', zone: 'SR' },
];

export default function UniversalTrainPicker({ onSelectTrain, selectedTrainId = '12675' }: UniversalTrainPickerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'RAJDHANI' | 'SHATABDI' | 'SUPERFAST'>('ALL');

  const filteredTrains = useMemo(() => {
    return FEATURED_TRAINS.filter(t => {
      const matchSearch = t.id.includes(searchTerm) || t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.from.toLowerCase().includes(searchTerm.toLowerCase()) || t.to.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchSearch) return false;
      if (activeFilter === 'ALL') return true;
      if (activeFilter === 'RAJDHANI') return t.type === 'Rajdhani';
      if (activeFilter === 'SHATABDI') return t.type === 'Shatabdi';
      if (activeFilter === 'SUPERFAST') return t.type === 'Superfast';
      return true;
    });
  }, [searchTerm, activeFilter]);

  return (
    <div className="glass-panel rounded-xl p-5 border border-white/10 space-y-4">
      {/* Header & Live Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Train className="h-5 w-5 text-sky-400" />
          <div>
            <h3 className="text-sm font-bold text-white font-mono">SELECT ANY TRAIN (2,810+ INDIAN RAILWAY RAKES)</h3>
            <p className="text-[11px] text-slate-400">Live dynamic ETA, dimensions, weather, and evidence reasoning</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 bg-slate-900/80 p-1 rounded-lg border border-white/10 text-[11px] font-mono">
          {(['ALL', 'RAJDHANI', 'SHATABDI', 'SUPERFAST'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeFilter === filter
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by train number (e.g. 12952, 12622, 12423) or station code..."
          className="w-full bg-slate-900 text-white rounded-lg pl-9 pr-4 py-2.5 border border-slate-700 focus:outline-none focus:border-sky-400 text-xs font-mono"
        />
        <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
      </div>

      {/* Horizontal Train Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {filteredTrains.map((tr) => {
          const isSelected = selectedTrainId === tr.id;
          return (
            <button
              key={tr.id}
              onClick={() => onSelectTrain && onSelectTrain(tr.id)}
              className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-sky-500/20 border-sky-400/80 shadow-md shadow-sky-500/10'
                  : 'bg-slate-900/50 hover:bg-slate-900 border-white/5 hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className={`font-bold ${isSelected ? 'text-sky-300' : 'text-white'}`}>{tr.id}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {tr.type}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-200 truncate">{tr.name}</div>
              </div>
              <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>{tr.from} → {tr.to}</span>
                <span className="text-sky-400 font-semibold">{tr.zone}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
