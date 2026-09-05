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
    <div className="w-full z-40">
      {/* Indian National Tricolor Top Accent Line */}
      <div className="h-1 w-full flex">
        <div className="w-1/3 bg-[#ff9933]" />
        <div className="w-1/3 bg-white" />
        <div className="w-1/3 bg-[#138808]" />
      </div>

      {/* Official Government of India & Telemetry Utility Bar */}
      <div className="w-full bg-slate-50 border-b border-slate-200 px-4 py-1 text-[11px] font-sans text-slate-700 flex flex-wrap items-center justify-between gap-2 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[#082b4c] text-xs">भारत सरकार</span>
            <span className="text-slate-400">|</span>
            <span className="font-semibold text-slate-700">Government of India</span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="font-bold text-[#ea580c] hidden sm:inline">रेल मंत्रालय</span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-slate-600 font-medium hidden sm:inline">Ministry of Railways</span>
          </div>

          <div className="hidden lg:flex items-center space-x-1.5 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-mono">
            <ShieldCheck className="h-3 w-3 text-emerald-600" />
            <span className="font-semibold">ML ROC-AUC: 0.9205 (ZERO-LEAKAGE)</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <div className="hidden md:flex items-center space-x-1 text-slate-600 font-mono">
            <Database className="h-3 w-3 text-[#0b3b60]" />
            <span>2,810 TRAINS • 8,990 STATIONS</span>
          </div>

          <div className="flex items-center space-x-1 text-emerald-700 font-mono">
            <Wifi className="h-3 w-3 text-emerald-600" />
            <span>PING: {telemetryPing}ms</span>
          </div>

          <div className="flex items-center space-x-1.5 text-slate-800 font-mono font-bold bg-white px-2.5 py-0.5 rounded border border-slate-300 shadow-xs">
            <Radio className="h-2.5 w-2.5 text-red-600 animate-ping" />
            <span>IST {timeStr || '14:24:00'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
