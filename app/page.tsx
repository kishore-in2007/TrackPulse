'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Train, Activity, AlertTriangle, ShieldCheck, Clock, GitBranch, ArrowRight, ArrowUpRight, Compass, Radio, MessageSquare } from 'lucide-react';
import ETACard from '@/components/ETACard';
import ReplayController from '@/components/ReplayController';
import NetworkMap from '@/components/NetworkMap';
import UniversalTrainPicker from '@/components/UniversalTrainPicker';
import ControlRoomKPIs from '@/components/ControlRoomKPIs';
import OperationalAlertsPanel from '@/components/OperationalAlertsPanel';
import { DynamicETAResponse } from '@/lib/types/eta';
import { NetworkAnalysisResponse } from '@/lib/types/network';

export default function DashboardPage() {
  const [featuredEta, setFeaturedEta] = useState<DynamicETAResponse | null>(null);
  const [stationNetwork, setStationNetwork] = useState<NetworkAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const handleSelectTrain = async (trainId: string) => {
    try {
      const res = await fetch(`/api/trains/${trainId}/eta`);
      if (res.ok) {
        const data = await res.json();
        setFeaturedEta(data);
      }
    } catch (err) {
      console.error('Failed to switch train:', err);
    }
  };

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [etaRes, netRes] = await Promise.all([
          fetch('/api/trains/12675/eta'),
          fetch('/api/network/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ station: 'MAS' })
          })
        ]);
        const etaData = await etaRes.json();
        const netData = await netRes.json();
        setFeaturedEta(etaData);
        setStationNetwork(netData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Banner & SIH Headline */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 relative overflow-hidden bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-sky-950/40">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-400 text-xs font-mono">
            <Radio className="h-3 w-3 animate-pulse" />
            <span>SIH PROBLEM STATEMENT: SIH26028 • MINISTRY OF RAILWAYS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Dynamic Forecast of Expected Time of Arrival (ETA)
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Replacing static schedule additions with an uncertainty-aware hybrid machine learning architecture. Computes calibrated quantile bounds (P10/P50/P90), multi-train rake/crew delay propagation, what-if simulations, and SMS telephony accessibility.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/simulate"
              className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md"
            >
              <GitBranch className="h-4 w-4" />
              <span>What-If Delay Simulator</span>
            </Link>
            <Link
              href="/passenger"
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center space-x-1.5 transition-all"
            >
              <Compass className="h-4 w-4 text-sky-400" />
              <span>Passenger Journey Engine</span>
            </Link>
            <Link
              href="/pnr"
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center space-x-1.5 transition-all"
            >
              <MessageSquare className="h-4 w-4 text-emerald-400" />
              <span>Feature-Phone SMS Engine</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Real-time Replay Controller Bar */}
      <ReplayController
        onStateChange={(state) => {
          if (state.active_trains && state.active_trains.length > 0) {
            setFeaturedEta(state.active_trains[0].dynamic_eta);
          }
        }}
      />

      {/* Executive Control Room KPIs */}
      <ControlRoomKPIs
        totalMonitored={2810}
        avgDelayMinutes={stationNetwork?.summary.avg_incoming_delay ?? 14.2}
        turnaroundConflicts={stationNetwork?.summary.turnaround_conflicts ?? 1}
        rocAucScore={0.9205}
        punctualityPct={84.6}
      />

      {/* Operational Incident & Precedence Dispatch Alerts */}
      <OperationalAlertsPanel />

      {/* Universal Train Picker - Select any of 2,810+ Trains */}
      <UniversalTrainPicker
        onSelectTrain={handleSelectTrain}
        selectedTrainId={featuredEta?.train_number}
      />

      {/* Featured Live Train Dynamic Forecast */}
      {featuredEta && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-sky-400" />
              Featured Dynamic ETA Inspection (Train {featuredEta.train_number})
            </h2>
            <Link
              href={`/train/${featuredEta.train_number}`}
              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold"
            >
              Full Deep Dive <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <ETACard eta={featuredEta} />
        </div>
      )}

      {/* Network Map & Corridor Visualizer */}
      <NetworkMap />

      {/* Multi-Train Station Monitoring Board */}
      {stationNetwork && (
        <div className="glass-panel rounded-xl p-6 border border-white/10">
          <div className="flex flex-wrap items-center justify-between pb-4 mb-6 border-b border-white/10 gap-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Compass className="h-4 w-4 text-sky-400" />
                Live Hub Operations Board — {stationNetwork.station_name} ({stationNetwork.station_code})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Simultaneous incoming feeder arrivals and coupled outgoing departures
              </p>
            </div>
            <Link
              href="/station/MAS"
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
            >
              Station Master Control <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Incoming Trains Column */}
            <div>
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center justify-between font-mono">
                <span>INCOMING TRAINS ({stationNetwork.incoming.length})</span>
                <span className="text-slate-400 text-[10px]">DYNAMIC ETA RANGE</span>
              </h4>
              <div className="space-y-2.5">
                {stationNetwork.incoming.map((inc) => (
                  <Link
                    key={inc.train_id}
                    href={`/train/${inc.train_id}`}
                    className="block p-3 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-white/5 hover:border-sky-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold font-mono text-white">{inc.train_number}</span>
                        <span className="text-xs text-slate-300 font-medium">{inc.train_name}</span>
                      </div>
                      <span className={`text-xs font-mono font-bold ${inc.current_delay_min > 15 ? 'text-red-400' : 'text-emerald-400'}`}>
                        +{inc.current_delay_min}m late
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="text-slate-400">From: {inc.source_station}</span>
                      <div className="text-right">
                        <span className="text-sky-400 font-mono font-bold">{inc.predicted_eta}</span>
                        <span className="text-[10px] text-slate-400 font-mono ml-1">({inc.eta_p10}–{inc.eta_p90})</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Outgoing Trains Column */}
            <div>
              <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-3 flex items-center justify-between font-mono">
                <span>OUTGOING TRAINS ({stationNetwork.outgoing.length})</span>
                <span className="text-slate-400 text-[10px]">PROPAGATED DEPARTURE</span>
              </h4>
              <div className="space-y-2.5">
                {stationNetwork.outgoing.map((out) => (
                  <div
                    key={out.train_id}
                    className={`p-3 rounded-lg border transition-all ${
                      out.departure_risk === 'HIGH'
                        ? 'bg-red-950/20 border-red-500/30'
                        : 'bg-slate-900/60 border-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold font-mono text-white">{out.train_number}</span>
                        <span className="text-xs text-slate-300 font-medium">{out.train_name}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                        out.departure_risk === 'HIGH' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {out.departure_risk} RISK
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="text-slate-400">To: {out.destination_station}</span>
                      <div className="text-right">
                        <span className={`font-mono font-bold ${out.turnaround_shortfall_min > 0 ? 'text-red-400' : 'text-slate-200'}`}>
                          Dep: {out.predicted_departure}
                        </span>
                        {out.turnaround_shortfall_min > 0 && (
                          <span className="text-[10px] text-red-400 font-mono block">
                            +{out.turnaround_shortfall_min}m shortfall
                          </span>
                        )}
                      </div>
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
