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
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-800',
          icon: Info,
          label: 'OBSERVED TELEMETRY'
        };
      case 'HISTORICAL':
        return {
          bg: 'bg-blue-50 border-blue-300 text-blue-800',
          icon: Database,
          label: 'HISTORICAL BENCHMARK'
        };
      case 'INFERRED':
        return {
          bg: 'bg-purple-50 border-purple-300 text-purple-800',
          icon: Brain,
          label: 'INFERRED UNCERTAINTY'
        };
      case 'NETWORK':
        return {
          bg: 'bg-amber-50 border-amber-300 text-amber-800',
          icon: GitFork,
          label: 'NETWORK DEPENDENCY'
        };
      default:
        return {
          bg: 'bg-slate-100 border-slate-300 text-slate-700',
          icon: Info,
          label: 'EVIDENCE'
        };
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
        <div>
          <h3 className="text-base font-bold text-[#082b4c] flex items-center gap-2">
            <Brain className="h-4 w-4 text-[#0b3b60]" />
            Factors Contributing to Prediction
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Transparent, multi-layer railway telemetry and machine learning evidence
          </p>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-300 font-bold">
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
              className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border font-mono flex items-center gap-1 ${badge.bg}`}>
                    <Icon className="h-3 w-3" />
                    {badge.label}
                  </span>
                  {r.impact_minutes !== 0 && (
                    <span className={`text-xs font-mono font-black flex items-center ${isPositive ? 'text-red-600' : 'text-emerald-700'}`}>
                      {isPositive ? <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> : <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />}
                      {isPositive ? `+${r.impact_minutes}m` : `${r.impact_minutes}m`}
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-slate-900">{r.factor}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{r.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
