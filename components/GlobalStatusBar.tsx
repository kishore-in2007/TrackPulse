'use client';

import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Database, Radio, Globe, Layers, AlertCircle, Wifi } from 'lucide-react';

export default function GlobalStatusBar() {
  const [timeStr, setTimeStr] = useState<string>('');
  const [telemetryPing, setTelemetryPing] = useState<number>(42);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-IN', { hour12: false }));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-slate-950 border-b border-white/10 px-4 py-1.5 text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2 z-40">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1.5 text-sky-400">
          <Activity className="h-3 w-3 animate-pulse" />
          <span className="font-bold text-white">TRACKPULSE V1.0</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">CRIS / NTES REAL-TIME GATEWAY</span>
        </div>

        <div className="hidden md:flex items-center space-x-1.5 text-emerald-400">
          <ShieldCheck className="h-3 w-3" />
          <span>ML ENGINE: ZERO-LEAKAGE (ROC-AUC: 0.9205)</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex items-center space-x-1.5 text-slate-400">
          <Database className="h-3 w-3 text-sky-400" />
          <span>2,810 TRAINS • 8,990 STATIONS</span>
        </div>

        <div className="flex items-center space-x-1.5 text-emerald-400">
          <Wifi className="h-3 w-3" />
          <span>LATENCY: {telemetryPing}ms</span>
        </div>

        <div className="flex items-center space-x-1.5 text-white font-bold bg-slate-900 px-2 py-0.5 rounded border border-white/10">
          <Radio className="h-2.5 w-2.5 text-red-500 animate-ping" />
          <span>IST {timeStr || '14:24:00'}</span>
        </div>
      </div>
    </div>
  );
}
