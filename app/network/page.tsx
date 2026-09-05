'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Network, Activity, ArrowLeft, ShieldCheck, Clock, Train, Compass, AlertTriangle, ArrowRight } from 'lucide-react';
import NetworkMap from '@/components/NetworkMap';
import { NetworkAnalysisResponse } from '@/lib/types/network';

export default function NetworkPage() {
  const [selectedJunction, setSelectedJunction] = useState('MAS');
  const [junctionData, setJunctionData] = useState<NetworkAnalysisResponse | null>(null);
  const [loadingJunction, setLoadingJunction] = useState(false);

  const fetchJunctionAnalysis = async (stnCode: string) => {
    setLoadingJunction(true);
    try {
      const res = await fetch('/api/network/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ station_id: stnCode, time_window_minutes: 180 })
      });
      const data: NetworkAnalysisResponse = await res.json();
      setJunctionData(data);
    } catch (err) {
      console.error('Failed to fetch junction data:', err);
    } finally {
      setLoadingJunction(false);
    }
  };

  useEffect(() => {
    fetchJunctionAnalysis(selectedJunction);
  }, [selectedJunction]);

  const majorJunctions = [
    { code: 'MAS', name: 'Chennai Central (SR)' },
    { code: 'NDLS', name: 'New Delhi (NR)' },
    { code: 'HWH', name: 'Howrah Jn (ER)' },
    { code: 'SBC', name: 'KSR Bengaluru (SWR)' },
    { code: 'BZA', name: 'Vijayawada Jn (SCR)' },
    { code: 'CNB', name: 'Kanpur Central (NCR)' },
    { code: 'NGP', name: 'Nagpur Jn (CR)' },
    { code: 'BRC', name: 'Vadodara Jn (WR)' }
  ];

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
          High-density corridor monitoring, active train distribution, and terminal junction coupling nodes across 2,810 Indian Railways trains.
        </p>
      </div>

      {/* Corridor Map */}
      <NetworkMap />

      {/* Live Terminal Junction Dynamic Analysis Engine */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-[#082b4c] flex items-center gap-2 font-mono">
              <Compass className="h-4 w-4 text-blue-600" />
              Live Terminal Junction Congestion & Feeder Traffic Analysis
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Select any major railway junction node to inspect live feeder delays, platform occupancy, and rake turnaround shortfalls.
            </p>
          </div>
          <Link
            href={`/station/${selectedJunction}`}
            className="px-3 py-1.5 rounded-lg bg-[#082b4c] hover:bg-[#0b3b60] text-white text-xs font-bold font-mono flex items-center gap-1.5 shadow-2xs transition-all"
          >
            <span>Open {selectedJunction} Terminal Board</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Junction Switcher */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {majorJunctions.map((j) => (
            <button
              key={j.code}
              onClick={() => setSelectedJunction(j.code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                selectedJunction === j.code
                  ? 'bg-[#082b4c] text-white border-[#082b4c] shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              {j.name}
            </button>
          ))}
        </div>

        {/* Dynamic Junction Status Metrics */}
        {junctionData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase font-mono">CONGESTION RISK</span>
              <div className={`text-2xl font-black font-mono ${
                junctionData.summary.congestion_risk === 'HIGH' ? 'text-red-700' : 'text-emerald-700'
              }`}>
                {junctionData.summary.congestion_risk}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Terminal block occupancy index</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase font-mono">INCOMING FEEDERS</span>
              <div className="text-2xl font-black font-mono text-[#082b4c]">
                {junctionData.incoming.length} Trains
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Within 3-hour observation window</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase font-mono">AVG INBOUND DELAY</span>
              <div className="text-2xl font-black font-mono text-amber-800">
                +{junctionData.summary.avg_incoming_delay} min
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Max single train delay: +{junctionData.summary.max_incoming_delay}m</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase font-mono">TURNAROUND CONFLICTS</span>
              <div className="text-2xl font-black font-mono text-red-700">
                {junctionData.summary.turnaround_conflicts} Cascades
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Coupled outgoing train shortfalls</p>
            </div>
          </div>
        )}
      </div>

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
