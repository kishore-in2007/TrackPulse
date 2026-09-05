'use client';

import React from 'react';
import Link from 'next/link';
import { Network, Activity, ArrowLeft, ShieldCheck, Clock, Train } from 'lucide-react';
import NetworkMap from '@/components/NetworkMap';

export default function NetworkPage() {
  const zoneStats = [
    { zone: 'SR', name: 'Southern Railway', activeTrains: 420, avgDelay: 14, congestionIndex: 'MODERATE' },
    { zone: 'NR', name: 'Northern Railway', activeTrains: 580, avgDelay: 28, congestionIndex: 'HIGH' },
    { zone: 'SCR', name: 'South Central Railway', activeTrains: 390, avgDelay: 12, congestionIndex: 'LOW' },
    { zone: 'ER', name: 'Eastern Railway', activeTrains: 460, avgDelay: 22, congestionIndex: 'MODERATE' },
    { zone: 'WCR', name: 'West Central Railway', activeTrains: 310, avgDelay: 18, congestionIndex: 'MODERATE' },
    { zone: 'SWR', name: 'South Western Railway', activeTrains: 290, avgDelay: 9, congestionIndex: 'LOW' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/"
          className="text-xs text-[#082b4c] hover:text-blue-700 flex items-center gap-1.5 transition-colors font-bold mb-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Operations Hub</span>
        </Link>
        <h1 className="text-2xl font-black text-[#082b4c] flex items-center gap-2">
          <Network className="h-6 w-6 text-blue-600" />
          Network-Wide Train Telemetry & Zone Congestion Dashboard
        </h1>
        <p className="text-xs text-slate-600 font-medium mt-1">
          High-density corridor monitoring, active train distribution, and terminal junction coupling nodes.
        </p>
      </div>

      {/* Corridor Map */}
      <NetworkMap />

      {/* Zonal Railway Breakdown */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
        <h3 className="text-base font-black text-[#082b4c] mb-4 flex items-center gap-2 font-mono">
          <Activity className="h-4 w-4 text-blue-600" />
          Zonal Operations Telemetry Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {zoneStats.map((z, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-black font-mono text-[#082b4c]">{z.zone}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded font-mono border ${
                  z.congestionIndex === 'HIGH'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : z.congestionIndex === 'MODERATE'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  {z.congestionIndex} CONGESTION
                </span>
              </div>
              <div className="text-xs text-slate-800 font-bold">{z.name}</div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 font-mono">
                <span className="text-slate-500 font-medium">{z.activeTrains} Active Rakes</span>
                <span className="text-amber-800 font-black">Avg Delay: +{z.avgDelay}m</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
