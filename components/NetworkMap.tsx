'use client';

import React, { useState } from 'react';
import { Navigation, Train, AlertTriangle, ShieldCheck, MapPin, Radio } from 'lucide-react';

interface NetworkMapProps {
  activeTrains?: {
    id: string;
    name: string;
    lat: number;
    lon: number;
    delay: number;
    status: string;
    from: string;
    to: string;
    speed: number;
  }[];
}

const DEFAULT_STATIONS = [
  { code: 'NDLS', name: 'New Delhi', lat: 28.6139, lon: 77.2090, zone: 'NR' },
  { code: 'BPL', name: 'Bhopal Jn', lat: 23.2599, lon: 77.4126, zone: 'WCR' },
  { code: 'NGP', name: 'Nagpur Jn', lat: 21.1458, lon: 79.0882, zone: 'CR' },
  { code: 'BZA', name: 'Vijayawada Jn', lat: 16.5062, lon: 80.6480, zone: 'SCR' },
  { code: 'MAS', name: 'Chennai Central', lat: 13.0827, lon: 80.2707, zone: 'SR' },
  { code: 'AJJ', name: 'Arakkonam Jn', lat: 13.0800, lon: 79.6700, zone: 'SR' },
  { code: 'KPD', name: 'Katpadi Jn', lat: 12.9700, lon: 79.1400, zone: 'SR' },
  { code: 'SBC', name: 'KSR Bengaluru', lat: 12.9716, lon: 77.5946, zone: 'SWR' },
  { code: 'CBE', name: 'Coimbatore Jn', lat: 11.0168, lon: 76.9558, zone: 'SR' },
  { code: 'HWH', name: 'Howrah Jn', lat: 22.5850, lon: 88.3426, zone: 'ER' },
  { code: 'MYS', name: 'Mysuru Jn', lat: 12.3168, lon: 76.6433, zone: 'SWR' },
];

const DEFAULT_ACTIVE_TRAINS = [
  { id: '12675', name: 'Kovai Express', lat: 12.98, lon: 79.25, delay: 18, status: 'DELAYED', from: 'MAS', to: 'CBE', speed: 78 },
  { id: '12007', name: 'Mysore Shatabdi', lat: 12.97, lon: 78.50, delay: 6, status: 'NORMAL', from: 'MAS', to: 'MYS', speed: 85 },
  { id: '12622', name: 'Tamil Nadu Express', lat: 15.50, lon: 80.10, delay: 32, status: 'DISRUPTED', from: 'NDLS', to: 'MAS', speed: 65 },
  { id: '12842', name: 'Coromandel Express', lat: 18.00, lon: 83.00, delay: 14, status: 'DELAYED', from: 'HWH', to: 'MAS', speed: 80 },
  { id: '22626', name: 'Bangalore Double Decker', lat: 12.97, lon: 77.90, delay: 8, status: 'NORMAL', from: 'SBC', to: 'MAS', speed: 75 }
];

export default function NetworkMap({ activeTrains = DEFAULT_ACTIVE_TRAINS }: NetworkMapProps) {
  const [selectedTrain, setSelectedTrain] = useState<any>(activeTrains[0]);

  // Coordinate projection to SVG viewbox (Bounds: Lat 10 to 30, Lon 74 to 90)
  const minLat = 9.5;
  const maxLat = 30.5;
  const minLon = 74.0;
  const maxLon = 90.0;

  const project = (lat: number, lon: number) => {
    const x = ((lon - minLon) / (maxLon - minLon)) * 600 + 50;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 500 + 40;
    return { x, y };
  };

  return (
    <div className="glass-panel rounded-xl p-6 border border-white/10">
      <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-white/10 gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Navigation className="h-4 w-4 text-sky-400" />
            Indian Railway High-Density Corridor Map
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Active coaching rake movement telemetry and terminal congestion nodes
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> Normal (&lt;10m)
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-400" /> Delayed (10-25m)
          </span>
          <span className="flex items-center gap-1 text-red-400">
            <span className="h-2 w-2 rounded-full bg-red-400" /> Disrupted (&gt;25m)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* SVG Railway Map Visualizer */}
        <div className="lg:col-span-8 bg-slate-950/80 rounded-xl p-4 border border-white/5 relative overflow-hidden flex items-center justify-center">
          <svg viewBox="0 0 700 580" className="w-full h-auto max-h-[500px]">
            {/* Background Map Grid */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="700" height="580" fill="url(#grid)" />

            {/* Railway Trunk Lines */}
            {/* Trunk Line 1: NDLS -> BPL -> NGP -> BZA -> MAS */}
            <path
              d={`M ${project(28.6139, 77.2090).x} ${project(28.6139, 77.2090).y} 
                  L ${project(23.2599, 77.4126).x} ${project(23.2599, 77.4126).y} 
                  L ${project(21.1458, 79.0882).x} ${project(21.1458, 79.0882).y} 
                  L ${project(16.5062, 80.6480).x} ${project(16.5062, 80.6480).y} 
                  L ${project(13.0827, 80.2707).x} ${project(13.0827, 80.2707).y}`}
              fill="none"
              stroke="#1e293b"
              strokeWidth="4"
              strokeDasharray="4 4"
            />

            {/* Trunk Line 2: MAS -> AJJ -> KPD -> SBC -> MYS */}
            <path
              d={`M ${project(13.0827, 80.2707).x} ${project(13.0827, 80.2707).y} 
                  L ${project(13.0800, 79.6700).x} ${project(13.0800, 79.6700).y} 
                  L ${project(12.9700, 79.1400).x} ${project(12.9700, 79.1400).y} 
                  L ${project(12.9716, 77.5946).x} ${project(12.9716, 77.5946).y} 
                  L ${project(12.3168, 76.6433).x} ${project(12.3168, 76.6433).y}`}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3"
              strokeOpacity="0.4"
            />

            {/* Trunk Line 3: KPD -> CBE */}
            <path
              d={`M ${project(12.9700, 79.1400).x} ${project(12.9700, 79.1400).y} 
                  L ${project(11.0168, 76.9558).x} ${project(11.0168, 76.9558).y}`}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3"
              strokeOpacity="0.4"
            />

            {/* Trunk Line 4: HWH -> BZA -> MAS */}
            <path
              d={`M ${project(22.5850, 88.3426).x} ${project(22.5850, 88.3426).y} 
                  L ${project(16.5062, 80.6480).x} ${project(16.5062, 80.6480).y} 
                  L ${project(13.0827, 80.2707).x} ${project(13.0827, 80.2707).y}`}
              fill="none"
              stroke="#1e293b"
              strokeWidth="3"
            />

            {/* Station Nodes */}
            {DEFAULT_STATIONS.map((stn, idx) => {
              const pt = project(stn.lat, stn.lon);
              const isHub = ['MAS', 'NDLS', 'HWH', 'SBC'].includes(stn.code);
              return (
                <g key={idx} className="cursor-pointer">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHub ? 6 : 4}
                    fill={isHub ? '#38bdf8' : '#64748b'}
                    stroke="#090d16"
                    strokeWidth="2"
                  />
                  <text
                    x={pt.x + 8}
                    y={pt.y + 3}
                    fill="#94a3b8"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight={isHub ? 'bold' : 'normal'}
                  >
                    {stn.code}
                  </text>
                </g>
              );
            })}

            {/* Active Moving Trains */}
            {activeTrains.map((tr, idx) => {
              const pt = project(tr.lat, tr.lon);
              const isSelected = selectedTrain?.id === tr.id;
              const color = tr.delay > 25 ? '#ef4444' : (tr.delay > 10 ? '#f59e0b' : '#10b981');

              return (
                <g
                  key={idx}
                  onClick={() => setSelectedTrain(tr)}
                  className="cursor-pointer group"
                >
                  {/* Ping Ring */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? 16 : 10}
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    opacity="0.6"
                    className="animate-pulse"
                  />
                  {/* Core Train Marker */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? 7 : 5}
                    fill={color}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 2 : 1}
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 12}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {tr.id}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Train Telemetry Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/80 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
              <span className="text-sky-400 font-semibold">SELECTED TRAIN TELEMETRY</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                {selectedTrain?.status}
              </span>
            </div>
            <div className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <Train className="h-4 w-4 text-sky-400" />
              {selectedTrain?.id} - {selectedTrain?.name}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Corridor: <span className="text-slate-200">{selectedTrain?.from} → {selectedTrain?.to}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded border border-white/5">
                <span className="text-slate-400 block text-[10px]">CURRENT DELAY</span>
                <span className={`text-base font-bold ${selectedTrain?.delay > 15 ? 'text-red-400' : 'text-emerald-400'}`}>
                  +{selectedTrain?.delay} min
                </span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-white/5">
                <span className="text-slate-400 block text-[10px]">TELEMETRY SPEED</span>
                <span className="text-base font-bold text-sky-300">
                  {selectedTrain?.speed} km/h
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 text-xs text-slate-400">
              Coordinates: <span className="text-slate-300 font-mono">{selectedTrain?.lat.toFixed(2)}°N, {selectedTrain?.lon.toFixed(2)}°E</span>
            </div>
          </div>

          <div className="p-3 bg-slate-900/40 rounded-lg border border-white/5 text-xs text-slate-400">
            Click any train marker on the corridor map to inspect point-in-time sectional delay metrics and downstream dependencies.
          </div>
        </div>
      </div>
    </div>
  );
}
