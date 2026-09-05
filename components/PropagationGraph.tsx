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
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
      <div className="flex flex-wrap items-center justify-between pb-4 mb-6 border-b border-slate-200 gap-2">
        <div>
          <h3 className="text-base font-bold text-[#082b4c] flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-[#0b3b60]" />
            Delay Propagation & Turnaround Network ({stationName})
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Modelled rake turnaround, crew links, and platform clearance dependencies
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="px-2.5 py-1 rounded bg-red-50 border border-red-200 text-red-700 font-bold">
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
                  ? 'bg-red-50/50 border-red-300 shadow-xs'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                {/* Incoming Train (Left Node) */}
                <div className="lg:col-span-4 bg-white rounded-lg p-3.5 border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-700 font-bold">INCOMING FEEDER</span>
                    <span className="text-slate-600 font-semibold">Delay: +{linkedInc?.current_delay_min ?? 0}m</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-sm font-black text-[#082b4c] font-mono">{linkedInc?.train_number || '12675'}</span>
                    <span className="text-xs text-slate-800 ml-2 font-bold">{linkedInc?.train_name || 'Inbound Express'}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Sched: {linkedInc?.scheduled_arrival || '--:--'}</span>
                    <span className="text-[#082b4c] font-mono font-bold">Dynamic ETA: {linkedInc?.predicted_eta || '--:--'}</span>
                  </div>
                </div>

                {/* Turnaround Coupling Link (Center Connector) */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center text-center px-2">
                  <div className="flex items-center space-x-1 text-[11px] font-mono px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-semibold shadow-2xs">
                    <span>{out.incoming_dependency?.dependency_type || 'RAKE TURNAROUND'}</span>
                  </div>
                  <div className="flex items-center w-full my-1 text-slate-400">
                    <div className="flex-1 h-[1px] bg-slate-300" />
                    <ArrowRight className={`h-4 w-4 mx-2 rotate-90 lg:rotate-0 transition-transform ${hasShortfall ? 'text-red-600 animate-pulse' : 'text-slate-400'}`} />
                    <div className="flex-1 h-[1px] bg-slate-300" />
                  </div>
                  <div className="text-[11px]">
                    {hasShortfall ? (
                      <span className="text-red-700 font-bold flex items-center justify-center gap-1 font-mono">
                        <AlertTriangle className="h-3 w-3 text-red-600" />
                        Available: {matchingConflict.available_turnaround_min}m (Needed: {matchingConflict.required_turnaround_min}m)
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-bold flex items-center justify-center gap-1 font-mono">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        Buffer: {out.available_turnaround_min}m (Needed: {out.required_turnaround_min}m)
                      </span>
                    )}
                  </div>
                </div>

                {/* Outgoing Train (Right Node) */}
                <div className="lg:col-span-4 bg-white rounded-lg p-3.5 border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#0b3b60] font-bold">OUTGOING TRAIN</span>
                    <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                      out.departure_risk === 'HIGH' ? 'bg-red-100 text-red-800' : (out.departure_risk === 'MEDIUM' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800')
                    }`}>
                      {out.departure_risk} RISK
                    </span>
                  </div>
                  <div className="mt-1">
                    <span className="text-sm font-black text-[#082b4c] font-mono">{out.train_number}</span>
                    <span className="text-xs text-slate-800 ml-2 font-bold">{out.train_name}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Sched Dep: {out.scheduled_departure}</span>
                    <span className={`font-mono font-bold ${hasShortfall ? 'text-red-600' : 'text-slate-800'}`}>
                      Expected: {out.predicted_departure} ({out.departure_p10}–{out.departure_p90})
                    </span>
                  </div>
                </div>
              </div>

              {hasShortfall && (
                <div className="mt-3 text-xs bg-red-100/80 rounded-lg p-2.5 text-red-900 border border-red-200 font-sans">
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
