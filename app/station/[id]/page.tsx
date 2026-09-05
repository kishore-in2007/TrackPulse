'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Compass, Train, Clock, AlertTriangle, ArrowLeft, RefreshCw, GitBranch } from 'lucide-react';
import PropagationGraph from '@/components/PropagationGraph';
import { NetworkAnalysisResponse } from '@/lib/types/network';

export default function StationDetailPage() {
  const params = useParams();
  const stationId = (params?.id as string)?.toUpperCase() || 'MAS';

  const [networkData, setNetworkData] = useState<NetworkAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStationData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/network/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ station: stationId })
      });
      const data: NetworkAnalysisResponse = await res.json();
      setNetworkData(data);
    } catch (err) {
      console.error('Failed to fetch station data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStationData();
  }, [stationId]);

  const stationsList = [
    { code: 'MAS', name: 'Chennai Central' },
    { code: 'NDLS', name: 'New Delhi' },
    { code: 'HWH', name: 'Howrah Jn' },
    { code: 'SBC', name: 'KSR Bengaluru' },
    { code: 'BZA', name: 'Vijayawada Jn' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Junction Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors font-medium mb-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Compass className="h-6 w-6 text-sky-400" />
            Station Operations Control — {networkData?.station_name || stationId} ({stationId})
          </h1>
        </div>

        {/* Junction Switcher */}
        <div className="flex items-center space-x-2 bg-slate-900/80 p-1 rounded-xl border border-white/10 text-xs font-mono">
          {stationsList.map((stn) => (
            <Link
              key={stn.code}
              href={`/station/${stn.code}`}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                stationId === stn.code
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {stn.code}
            </Link>
          ))}
        </div>
      </div>

      {networkData && (
        <div className="space-y-6">
          {/* Station Key Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel rounded-xl p-4 border border-white/5">
              <span className="text-xs text-slate-400 font-medium">INCOMING FEEDERS</span>
              <div className="text-2xl font-bold font-mono text-white mt-1">
                {networkData.incoming.length}
              </div>
              <span className="text-[11px] text-slate-400">Scheduled in observation window</span>
            </div>

            <div className="glass-panel rounded-xl p-4 border border-white/5">
              <span className="text-xs text-slate-400 font-medium">AVG INBOUND DELAY</span>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                +{networkData.summary.avg_incoming_delay} min
              </div>
              <span className="text-[11px] text-slate-400">Max delay: +{networkData.summary.max_incoming_delay}m</span>
            </div>

            <div className="glass-panel rounded-xl p-4 border border-white/5">
              <span className="text-xs text-slate-400 font-medium">TURNAROUND CONFLICTS</span>
              <div className="text-2xl font-bold font-mono text-red-400 mt-1">
                {networkData.turnaround_conflicts.length}
              </div>
              <span className="text-[11px] text-slate-400">Shortfall propagation active</span>
            </div>

            <div className="glass-panel rounded-xl p-4 border border-white/5">
              <span className="text-xs text-slate-400 font-medium">CONGESTION RISK</span>
              <div className={`text-2xl font-bold font-mono mt-1 ${
                networkData.summary.congestion_risk === 'HIGH' ? 'text-red-400' : 'text-emerald-400'
              }`}>
                {networkData.summary.congestion_risk}
              </div>
              <span className="text-[11px] text-slate-400">Terminal track occupancy index</span>
            </div>
          </div>

          {/* Turnaround Coupling & Delay Propagation Graph */}
          <PropagationGraph
            incoming={networkData.incoming}
            outgoing={networkData.outgoing}
            conflicts={networkData.turnaround_conflicts}
            stationName={networkData.station_name}
          />

          {/* Detailed Inbound & Outbound Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inbound Schedule Table */}
            <div className="glass-panel rounded-xl p-6 border border-white/10">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between font-mono">
                <span className="text-emerald-400">INBOUND ARRIVALS</span>
                <span className="text-slate-400 text-xs">DYNAMIC PREDICTION</span>
              </h3>
              <div className="space-y-3">
                {networkData.incoming.map((inc) => (
                  <div
                    key={inc.train_id}
                    className="p-3 bg-slate-900/60 rounded-lg border border-white/5 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold font-mono text-white text-sm">{inc.train_number}</span>
                        <span className="text-xs text-slate-300">{inc.train_name}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Origin: {inc.source_station} | Current: {inc.current_location}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sky-400 font-mono font-bold block">{inc.predicted_eta}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        +{inc.current_delay_min}m ({inc.eta_p10}-{inc.eta_p90})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outbound Schedule Table */}
            <div className="glass-panel rounded-xl p-6 border border-white/10">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between font-mono">
                <span className="text-sky-400">OUTBOUND DEPARTURES</span>
                <span className="text-slate-400 text-xs">PROPAGATED STATUS</span>
              </h3>
              <div className="space-y-3">
                {networkData.outgoing.map((out) => (
                  <div
                    key={out.train_id}
                    className="p-3 bg-slate-900/60 rounded-lg border border-white/5 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold font-mono text-white text-sm">{out.train_number}</span>
                        <span className="text-xs text-slate-300">{out.train_name}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        To: {out.destination_station} | Sched Dep: {out.scheduled_departure}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-mono font-bold block ${out.turnaround_shortfall_min > 0 ? 'text-red-400' : 'text-slate-200'}`}>
                        {out.predicted_departure}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {out.turnaround_shortfall_min > 0 ? `+${out.turnaround_shortfall_min}m push` : 'On-Time Turnaround'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
