'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, AlertOctagon, ShieldAlert, ArrowRight, Clock, Wind, GitBranch } from 'lucide-react';

interface OperationalAlert {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  description: string;
  train_id?: string;
  station_code?: string;
  timestamp: string;
  action_href?: string;
  action_label?: string;
}

const SAMPLE_ALERTS: OperationalAlert[] = [
  {
    id: 'alt-1',
    severity: 'CRITICAL',
    title: 'Downstream Rake Turnaround Shortfall (Train 12676)',
    description: 'Incoming Kovai Express 12675 (+18 min) arriving 14:23. Outgoing 12676 scheduled 14:35 leaves only 12m turnaround vs required 30m.',
    train_id: '12675',
    station_code: 'CBE',
    timestamp: '14:22 IST',
    action_href: '/simulate',
    action_label: 'Simulate Delay'
  },
  {
    id: 'alt-2',
    severity: 'WARNING',
    title: 'Weather Precaution Speed Restriction (Fog Visibility Index 0.35)',
    description: 'Active monsoon fog on Renigunta - Guntakal block. Max permissible speed reduced to 75 km/h for coaching rakes.',
    train_id: '12952',
    station_code: 'RU',
    timestamp: '14:15 IST',
    action_href: '/train/12952',
    action_label: 'Inspect 12952'
  },
  {
    id: 'alt-3',
    severity: 'INFO',
    title: 'Dynamic Slack Recovery Detected on Mysore Corridor',
    description: 'Shatabdi Express 12007 recovered +4m of scheduled delay across Katpadi - Jolarpettai section.',
    train_id: '12007',
    station_code: 'JTJ',
    timestamp: '14:10 IST',
    action_href: '/train/12007',
    action_label: 'View Telemetry'
  }
];

export default function OperationalAlertsPanel() {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="h-5 w-5 text-amber-600" />
          <h3 className="text-sm font-bold text-[#082b4c] uppercase tracking-wider font-mono">
            LIVE OPERATIONAL DISPATCH & CONFLICT ALERTS
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-bold">
          {SAMPLE_ALERTS.length} ACTIVE INCIDENTS
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {SAMPLE_ALERTS.map((alt) => {
          const isCrit = alt.severity === 'CRITICAL';
          const isWarn = alt.severity === 'WARNING';
          return (
            <div
              key={alt.id}
              className={`p-3.5 rounded-lg border flex flex-col justify-between transition-all ${
                isCrit
                  ? 'bg-red-50/70 border-red-200 hover:border-red-300'
                  : isWarn
                  ? 'bg-amber-50/70 border-amber-200 hover:border-amber-300'
                  : 'bg-blue-50/60 border-blue-200 hover:border-blue-300'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={`font-bold font-mono text-[10px] px-2 py-0.5 rounded ${
                      isCrit
                        ? 'bg-red-100 text-red-800'
                        : isWarn
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {alt.severity}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 font-medium">{alt.timestamp}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{alt.title}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-3">{alt.description}</p>
              </div>

              {alt.action_href && (
                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500 font-medium">Loc: {alt.station_code}</span>
                  <Link
                    href={alt.action_href}
                    className="text-[11px] font-bold text-[#0b3b60] hover:text-[#ea580c] flex items-center gap-1 transition-colors"
                  >
                    <span>{alt.action_label}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
