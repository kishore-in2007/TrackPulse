'use client';

import React from 'react';
import { PredictionReason, EvidenceClassification } from '@/lib/types/eta';
import { Info, Database, Brain, GitFork, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface ReasoningPanelProps {
  reasons: PredictionReason[];
}

export default function ReasoningPanel({ reasons }: ReasoningPanelProps) {
  const getBadgeStyle = (classification: EvidenceClassification) => {
    switch (classification) {
      case 'OBSERVED':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          icon: Info,
          label: 'OBSERVED TELEMETRY'
        };
      case 'HISTORICAL':
        return {
          bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
          icon: Database,
          label: 'HISTORICAL BENCHMARK'
        };
      case 'INFERRED':
        return {
          bg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
          icon: Brain,
          label: 'INFERRED UNCERTAINTY'
        };
      case 'NETWORK':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          icon: GitFork,
          label: 'NETWORK DEPENDENCY'
        };
      default:
        return {
          bg: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
          icon: Info,
          label: 'EVIDENCE'
        };
    }
  };

  return (
    <div className="glass-panel rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Brain className="h-4 w-4 text-sky-400" />
            Factors Contributing to Prediction
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent, multi-layer railway telemetry and machine learning evidence
          </p>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
          Zero-Hallucination Audit
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {reasons.map((r, idx) => {
          const badge = getBadgeStyle(r.classification);
          const Icon = badge.icon;
          const isPositive = r.impact_minutes > 0;
          const isNegative = r.impact_minutes < 0;

          return (
            <div
              key={idx}
              className="bg-slate-900/50 rounded-lg p-3.5 border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border font-mono flex items-center gap-1 ${badge.bg}`}>
                    <Icon className="h-3 w-3" />
                    {badge.label}
                  </span>
                  {r.impact_minutes !== 0 && (
                    <span className={`text-xs font-mono font-bold flex items-center ${isPositive ? 'text-red-400' : 'text-emerald-400'}`}>
                      {isPositive ? <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> : <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />}
                      {isPositive ? `+${r.impact_minutes}m` : `${r.impact_minutes}m`}
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-semibold text-slate-200">{r.factor}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{r.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
