'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GitBranch, AlertTriangle, ArrowRight, RefreshCw, Clock, ArrowLeft, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { SimulationResponse } from '@/lib/types/simulation';

export default function SimulatePage() {
  const [selectedTrain, setSelectedTrain] = useState('12675');
  const [injectedDelay, setInjectedDelay] = useState(30);
  const [simulationResult, setSimulationResult] = useState<SimulationResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const runSimulation = async (trainId: string = selectedTrain, delay: number = injectedDelay) => {
    setLoading(true);
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          train_id: trainId,
          delay_injection_minutes: delay
        })
      });
      const data: SimulationResponse = await res.json();
      setSimulationResult(data);
    } catch (err) {
      console.error('Failed to run simulation:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation('12675', 30);
  }, []);

  const sampleTrains = [
    { id: '12675', name: '12675 Kovai Express (MAS Arrival)', route: 'CBE → MAS' },
    { id: '12622', name: '12622 Tamil Nadu Express (Superfast Trunk)', route: 'NDLS → MAS' },
    { id: '12007', name: '12007 Mysore Shatabdi (Intercity Link)', route: 'MAS → MYS' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <Link
          href="/"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors font-medium mb-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Operations Hub</span>
        </Link>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <GitBranch className="h-6 w-6 text-sky-400" />
          What-If Network Delay Simulation & Propagation Engine
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Inject hypothetical operational disruptions to evaluate real-time multi-train cascading delays and passenger connection risk escalations.
        </p>
      </div>

      {/* Simulation Control Card */}
      <div className="glass-panel rounded-xl p-6 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Train Selector */}
          <div className="md:col-span-5 space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">
              Select Disrupted Train:
            </label>
            <select
              value={selectedTrain}
              onChange={(e) => {
                setSelectedTrain(e.target.value);
                runSimulation(e.target.value, injectedDelay);
              }}
              className="w-full bg-slate-900 text-white rounded-lg px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-sky-400 text-xs font-mono"
            >
              {sampleTrains.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Delay Injection Slider */}
          <div className="md:col-span-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <label className="font-bold text-slate-300 uppercase tracking-wider">
                Injected Delay:
              </label>
              <span className="text-sm font-bold text-amber-400 font-mono">
                +{injectedDelay} minutes
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="90"
              step="5"
              value={injectedDelay}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setInjectedDelay(val);
              }}
              className="w-full accent-amber-400"
            />
          </div>

          {/* Run Button */}
          <div className="md:col-span-2 flex items-end">
            <button
              onClick={() => runSimulation(selectedTrain, injectedDelay)}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md font-mono"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Simulating...' : 'Recalculate'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Simulation Results */}
      {simulationResult && (
        <div className="space-y-6">
          {/* Ripple Effect Summary Banner */}
          <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 ${
            simulationResult.network_ripple_effect === 'SEVERE'
              ? 'bg-red-950/30 border-red-500/40 text-red-200'
              : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                simulationResult.network_ripple_effect === 'SEVERE' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <span className="text-sm font-bold block">
                  NETWORK RIPPLE EFFECT: {simulationResult.network_ripple_effect}
                </span>
                <span className="text-xs opacity-80">
                  {simulationResult.affected_trains_count} total trains affected | {simulationResult.passenger_impact_summary.risk_escalations} passenger connection risk escalations
                </span>
              </div>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded bg-slate-900 border border-white/10">
              Scenario ID: {simulationResult.simulation_id}
            </span>
          </div>

          {/* Side-by-Side Comparison: Trigger Train Baseline vs Scenario */}
          <div className="glass-panel rounded-xl p-6 border border-white/10">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-sky-400" />
              Primary Injected Disruption: {simulationResult.primary_diff.train_name} ({simulationResult.primary_diff.train_number})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Baseline Box */}
              <div className="bg-slate-900/60 rounded-xl p-4 border border-white/5 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                  BASELINE (ORIGINAL ESTIMATE)
                </span>
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-black font-mono text-slate-300">
                    {simulationResult.primary_diff.baseline_arrival}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Delay: +{simulationResult.primary_diff.baseline_delay_min}m
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Risk Level: <span className="text-emerald-400 font-semibold">{simulationResult.primary_diff.baseline_risk}</span>
                </div>
              </div>

              {/* Scenario Box */}
              <div className="bg-slate-900/60 rounded-xl p-4 border border-amber-500/30 glow-warning space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                  SCENARIO (AFTER +{simulationResult.delay_injected_min}M DISRUPTION)
                </span>
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-black font-mono text-amber-300">
                    {simulationResult.primary_diff.scenario_arrival}
                  </span>
                  <span className="text-xs font-mono text-amber-400 font-bold">
                    Delay: +{simulationResult.primary_diff.scenario_delay_min}m
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Updated Range: <span className="text-white font-mono">{simulationResult.primary_diff.p10_scenario} – {simulationResult.primary_diff.p90_scenario}</span> | Risk: <span className="text-red-400 font-bold">{simulationResult.primary_diff.scenario_risk}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cascading Downstream Train Impacts */}
          {simulationResult.propagated_diffs.length > 0 && (
            <div className="glass-panel rounded-xl p-6 border border-white/10">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-red-400" />
                Cascading Downstream Propagations ({simulationResult.propagated_diffs.length} Trains Impacted)
              </h3>

              <div className="space-y-3">
                {simulationResult.propagated_diffs.map((diff, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-900/70 rounded-xl border border-red-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold font-mono text-white">{diff.train_number}</span>
                        <span className="text-sm text-slate-200 font-medium">{diff.train_name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold font-mono">
                          +{diff.delay_impact_min}m DEPARTURE PUSH
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{diff.reason}</p>
                    </div>

                    <div className="text-right font-mono text-xs">
                      <div className="text-slate-400">
                        Baseline Dep: <span className="text-slate-300">{diff.baseline_arrival}</span>
                      </div>
                      <div className="text-red-400 font-bold text-sm">
                        Scenario Dep: {diff.scenario_arrival}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Passenger Connection Risk Warnings */}
          {simulationResult.passenger_impact_summary.high_risk_connections.length > 0 && (
            <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-xs text-red-300 space-y-2">
              <span className="font-bold flex items-center gap-1.5 text-red-400">
                <AlertTriangle className="h-4 w-4" />
                Passenger Connection Escalation Notices:
              </span>
              <ul className="list-disc list-inside space-y-1 pl-1">
                {simulationResult.passenger_impact_summary.high_risk_connections.map((warn, idx) => (
                  <li key={idx}>{warn}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
