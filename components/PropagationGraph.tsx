'use client';

import React from 'react';
import { IncomingTrainStatus, OutgoingTrainStatus, NetworkAnalysisResponse } from '@/lib/types/network';
import { GitBranch, ArrowRight, AlertTriangle, CheckCircle2, Clock, Train } from 'lucide-react';

interface PropagationGraphProps {
  incoming: IncomingTrainStatus[];
  outgoing: OutgoingTrainStatus[];
  conflicts: NetworkAnalysisResponse['turnaround_conflicts'];
  stationName: string;
}

export default function PropagationGraph({ incoming, outgoing, conflicts, stationName }: PropagationGraphProps) {
  return (
    <div className="glass-panel rounded-xl p-6 border border-white/10">
      <div className="flex flex-wrap items-center justify-between pb-4 mb-6 border-b border-white/10 gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-sky-400" />
            Delay Propagation & Turnaround Network ({stationName})
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Modelled rake turnaround, crew links, and platform clearance dependencies
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="px-2.5 py-1 rounded bg-red-500/10 border border-red-500/30 text-red-400 font-medium">
            {conflicts.length} Turnaround Shortfalls Detected
          </span>
        </div>
      </div>

      {/* Dependency Coupling Grid */}
      <div className="space-y-4">
        {outgoing.map((out, idx) => {
          const matchingConflict = conflicts.find(c => c.outgoing_train_id === out.train_id);
          const linkedInc = incoming.find(i => i.train_id === matchingConflict?.incoming_train_id || out.incoming_dependency?.incoming_train_id === i.train_id);
          const hasShortfall = matchingConflict !== undefined;

          return (
            <div
              key={idx}
              className={`rounded-xl p-4 border transition-all ${
                hasShortfall
                  ? 'bg-red-950/20 border-red-500/30 shadow-md shadow-red-950/20'
                  : 'bg-slate-900/40 border-white/5'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                {/* Incoming Train (Left Node) */}
                <div className="lg:col-span-4 bg-slate-900/80 rounded-lg p-3 border border-white/5">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span className="text-emerald-400 font-semibold">INCOMING FEEDER</span>
                    <span>Delay: +{linkedInc?.current_delay_min ?? 0}m</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-sm font-bold text-white font-mono">{linkedInc?.train_number || '12675'}</span>
                    <span className="text-xs text-slate-300 ml-2 font-medium">{linkedInc?.train_name || 'Inbound Express'}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Sched: {linkedInc?.scheduled_arrival || '--:--'}</span>
                    <span className="text-sky-400 font-mono font-bold">Dynamic ETA: {linkedInc?.predicted_eta || '--:--'}</span>
                  </div>
                </div>

                {/* Turnaround Coupling Link (Center Connector) */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center text-center px-2">
                  <div className="flex items-center space-x-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    <span>{out.incoming_dependency?.dependency_type || 'RAKE TURNAROUND'}</span>
                  </div>
                  <div className="flex items-center w-full my-1 text-slate-500">
                    <div className="flex-1 h-[1px] bg-slate-700" />
                    <ArrowRight className={`h-4 w-4 mx-2 ${hasShortfall ? 'text-red-400 animate-pulse' : 'text-slate-500'}`} />
                    <div className="flex-1 h-[1px] bg-slate-700" />
                  </div>
                  <div className="text-[11px]">
                    {hasShortfall ? (
                      <span className="text-red-400 font-semibold flex items-center justify-center gap-1 font-mono">
                        <AlertTriangle className="h-3 w-3" />
                        Available: {matchingConflict.available_turnaround_min}m (Needed: {matchingConflict.required_turnaround_min}m)
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-medium flex items-center justify-center gap-1 font-mono">
                        <CheckCircle2 className="h-3 w-3" />
                        Buffer: {out.available_turnaround_min}m (Needed: {out.required_turnaround_min}m)
                      </span>
                    )}
                  </div>
                </div>

                {/* Outgoing Train (Right Node) */}
                <div className="lg:col-span-4 bg-slate-900/80 rounded-lg p-3 border border-white/5">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span className="text-sky-400 font-semibold">OUTGOING TRAIN</span>
                    <span className={out.departure_risk === 'HIGH' ? 'text-red-400 font-bold' : (out.departure_risk === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400')}>
                      {out.departure_risk} RISK
                    </span>
                  </div>
                  <div className="mt-1">
                    <span className="text-sm font-bold text-white font-mono">{out.train_number}</span>
                    <span className="text-xs text-slate-300 ml-2 font-medium">{out.train_name}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Sched Dep: {out.scheduled_departure}</span>
                    <span className={`font-mono font-bold ${hasShortfall ? 'text-red-400' : 'text-slate-200'}`}>
                      Expected: {out.predicted_departure} ({out.departure_p10}–{out.departure_p90})
                    </span>
                  </div>
                </div>
              </div>

              {hasShortfall && (
                <div className="mt-3 text-xs bg-red-950/40 rounded p-2 text-red-300 border border-red-500/20 font-sans">
                  <strong>Cascading Impact:</strong> Incoming delay shortfall creates +{matchingConflict.shortfall_min}m departure delay on Outgoing Train {out.train_number}. Downstream passenger connections at risk.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
