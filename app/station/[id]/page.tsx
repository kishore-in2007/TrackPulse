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
            className="text-xs text-[#082b4c] hover:text-blue-700 flex items-center gap-1.5 transition-colors font-bold mb-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-black text-[#082b4c] flex items-center gap-2">
            <Compass className="h-6 w-6 text-blue-600" />
            Station Operations Control — {networkData?.station_name || stationId} ({stationId})
          </h1>
        </div>

        {/* Junction Switcher */}
        <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-300 text-xs font-mono shadow-2xs">
          {stationsList.map((stn) => (
            <Link
              key={stn.code}
              href={`/station/${stn.code}`}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                stationId === stn.code
                  ? 'bg-[#082b4c] text-white font-black shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 font-bold hover:bg-slate-100'
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
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-bold">INCOMING FEEDERS</span>
              <div className="text-2xl font-black font-mono text-[#082b4c] mt-1">
                {networkData.incoming.length}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Scheduled in observation window</span>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-bold">AVG INBOUND DELAY</span>
              <div className="text-2xl font-black font-mono text-amber-800 mt-1">
                +{networkData.summary.avg_incoming_delay} min
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Max delay: +{networkData.summary.max_incoming_delay}m</span>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-bold">TURNAROUND CONFLICTS</span>
              <div className="text-2xl font-black font-mono text-red-700 mt-1">
                {networkData.turnaround_conflicts.length}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Shortfall propagation active</span>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-bold">CONGESTION RISK</span>
              <div className={`text-2xl font-black font-mono mt-1 ${
                networkData.summary.congestion_risk === 'HIGH' ? 'text-red-700' : 'text-emerald-700'
              }`}>
                {networkData.summary.congestion_risk}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Terminal track occupancy index</span>
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
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
              <h3 className="text-sm font-black text-[#082b4c] mb-4 flex items-center justify-between font-mono bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
                <span className="text-emerald-800">INBOUND ARRIVALS</span>
                <span className="text-slate-600 text-xs font-sans font-semibold">DYNAMIC PREDICTION</span>
              </h3>
              <div className="space-y-3">
                {networkData.incoming.map((inc) => (
                  <div
                    key={inc.train_id}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-black font-mono text-[#082b4c] text-sm">{inc.train_number}</span>
                        <span className="text-xs text-slate-800 font-bold">{inc.train_name}</span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium mt-1">
                        Origin: <strong className="text-slate-700">{inc.source_station}</strong> | Current: <strong className="text-slate-700">{inc.current_location}</strong>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[#082b4c] font-mono font-black block">{inc.predicted_eta}</span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border inline-block mt-0.5 ${
                        inc.current_delay_min > 15 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        +{inc.current_delay_min}m ({inc.eta_p10}-{inc.eta_p90})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outbound Schedule Table */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
              <h3 className="text-sm font-black text-[#082b4c] mb-4 flex items-center justify-between font-mono bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                <span className="text-blue-900">OUTBOUND DEPARTURES</span>
                <span className="text-slate-600 text-xs font-sans font-semibold">PROPAGATED STATUS</span>
              </h3>
              <div className="space-y-3">
                {networkData.outgoing.map((out) => (
                  <div
                    key={out.train_id}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-black font-mono text-[#082b4c] text-sm">{out.train_number}</span>
                        <span className="text-xs text-slate-800 font-bold">{out.train_name}</span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium mt-1">
                        To: <strong className="text-slate-700">{out.destination_station}</strong> | Sched Dep: <strong className="text-slate-700">{out.scheduled_departure}</strong>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-mono font-black block ${out.turnaround_shortfall_min > 0 ? 'text-red-700' : 'text-slate-900'}`}>
                        {out.predicted_departure}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border inline-block mt-0.5 ${
                        out.turnaround_shortfall_min > 0 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
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
