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
import IRCTCBookingSearchHero from '@/components/IRCTCBookingSearchHero';
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
      <div className="rounded-2xl p-6 sm:p-8 border border-slate-200 relative overflow-hidden bg-gradient-to-r from-blue-50/90 via-sky-50/50 to-white shadow-xs">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100/70 border border-blue-300 text-[#082b4c] text-xs font-mono font-bold">
            <Radio className="h-3 w-3 text-blue-600 animate-pulse" />
            <span>SIH PROBLEM STATEMENT: SIH26028 • MINISTRY OF RAILWAYS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#082b4c]">
            Dynamic Forecast of Expected Time of Arrival (ETA)
          </h1>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
            Replacing static schedule additions with an uncertainty-aware hybrid machine learning architecture. Computes calibrated quantile bounds (P10/P50/P90), multi-train rake/crew delay propagation, what-if simulations, and SMS telephony accessibility.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/simulate"
              className="px-4 py-2 rounded-lg bg-[#ff9933] hover:bg-[#e08522] text-[#082b4c] font-black text-xs flex items-center space-x-1.5 transition-all shadow-xs"
            >
              <GitBranch className="h-4 w-4" />
              <span>What-If Delay Simulator</span>
            </Link>
            <Link
              href="/passenger"
              className="px-4 py-2 rounded-lg bg-[#082b4c] hover:bg-[#0b3b60] text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-xs"
            >
              <Compass className="h-4 w-4 text-[#ff9933]" />
              <span>Passenger Journey Engine</span>
            </Link>
            <Link
              href="/pnr"
              className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-xs"
            >
              <MessageSquare className="h-4 w-4 text-emerald-200" />
              <span>Feature-Phone SMS Engine</span>
            </Link>
          </div>
        </div>
      </div>

      {/* IRCTC Flagship Booking, PNR & Dynamic Live Status Search Hero */}
      <IRCTCBookingSearchHero
        onSelectTrain={handleSelectTrain}
        selectedTrainId={featuredEta?.train_number}
      />

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
            <h2 className="text-base font-black text-[#082b4c] flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              Featured Dynamic ETA Inspection (Train {featuredEta.train_number})
            </h2>
            <Link
              href={`/train/${featuredEta.train_number}`}
              className="text-xs text-blue-700 hover:text-blue-900 flex items-center gap-1 font-bold"
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
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
          <div className="flex flex-wrap items-center justify-between pb-4 mb-6 border-b border-slate-200 gap-2">
            <div>
              <h3 className="text-base font-black text-[#082b4c] flex items-center gap-2">
                <Compass className="h-4 w-4 text-blue-600" />
                Live Hub Operations Board — {stationNetwork.station_name} ({stationNetwork.station_code})
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Simultaneous incoming feeder arrivals and coupled outgoing departures
              </p>
            </div>
            <Link
              href="/station/MAS"
              className="text-xs text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1"
            >
              Station Master Control <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Incoming Trains Column */}
            <div>
              <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wider mb-3 flex items-center justify-between font-mono bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <span>INCOMING TRAINS ({stationNetwork.incoming.length})</span>
                <span className="text-slate-500 text-[10px] font-sans">DYNAMIC ETA RANGE</span>
              </h4>
              <div className="space-y-2.5">
                {stationNetwork.incoming.map((inc) => (
                  <Link
                    key={inc.train_id}
                    href={`/train/${inc.train_id}`}
                    className="block p-3 rounded-lg bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 transition-all shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-black font-mono text-[#082b4c]">{inc.train_number}</span>
                        <span className="text-xs text-slate-700 font-bold">{inc.train_name}</span>
                      </div>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                        inc.current_delay_min > 15 
                          ? 'bg-red-50 text-red-700 border-red-200' 
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        +{inc.current_delay_min}m late
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="text-slate-600 font-medium">From: <strong className="text-slate-800">{inc.source_station}</strong></span>
                      <div className="text-right">
                        <span className="text-[#082b4c] font-mono font-black">{inc.predicted_eta}</span>
                        <span className="text-[10px] text-slate-500 font-mono ml-1 font-semibold">({inc.eta_p10}–{inc.eta_p90})</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Outgoing Trains Column */}
            <div>
              <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider mb-3 flex items-center justify-between font-mono bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                <span>OUTGOING TRAINS ({stationNetwork.outgoing.length})</span>
                <span className="text-slate-500 text-[10px] font-sans">PROPAGATED DEPARTURE</span>
              </h4>
              <div className="space-y-2.5">
                {stationNetwork.outgoing.map((out) => (
                  <div
                    key={out.train_id}
                    className={`p-3 rounded-lg border transition-all shadow-2xs ${
                      out.departure_risk === 'HIGH'
                        ? 'bg-red-50/70 border-red-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-black font-mono text-[#082b4c]">{out.train_number}</span>
                        <span className="text-xs text-slate-700 font-bold">{out.train_name}</span>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded font-mono border ${
                        out.departure_risk === 'HIGH' 
                          ? 'bg-red-100 text-red-800 border-red-300' 
                          : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      }`}>
                        {out.departure_risk} RISK
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="text-slate-600 font-medium">To: <strong className="text-slate-800">{out.destination_station}</strong></span>
                      <div className="text-right">
                        <span className={`font-mono font-black ${out.turnaround_shortfall_min > 0 ? 'text-red-700' : 'text-slate-800'}`}>
                          Dep: {out.predicted_departure}
                        </span>
                        {out.turnaround_shortfall_min > 0 && (
                          <span className="text-[10px] text-red-600 font-mono font-bold block">
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
