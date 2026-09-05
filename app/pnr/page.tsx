'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, ShieldCheck, ArrowLeft, Search, Train, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import SMSPhoneSimulator from '@/components/SMSPhoneSimulator';
import { PNRStatusResponse } from '@/lib/pnr/pnr_provider';

export default function PNRPage() {
  const [pnrInput, setPnrInput] = useState('1234567890');
  const [pnrResult, setPnrResult] = useState<PNRStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const searchPNR = async (numToSearch: string = pnrInput) => {
    if (!numToSearch.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/pnr/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pnr: numToSearch })
      });
      if (res.ok) {
        const data: PNRStatusResponse = await res.json();
        setPnrResult(data);
      } else {
        const err = await res.json();
        setErrorMsg(err.message || 'PNR not found in prototype database.');
        setPnrResult(null);
      }
    } catch (err: any) {
      setErrorMsg('Error connecting to PNR service');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/"
          className="text-xs text-[#082b4c] hover:text-blue-700 flex items-center gap-1.5 transition-colors font-bold mb-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Operations Hub</span>
        </Link>
        <h1 className="text-2xl font-black text-[#082b4c] flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-emerald-700" />
          PNR Journey Telemetry & Button-Phone SMS Experience
        </h1>
        <p className="text-xs text-slate-600 font-medium mt-1">
          Accessible passenger journey status with masked PNR lookup and simulated short-code telephony adapter.
        </p>
      </div>

      {/* PNR Search Card */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-black text-[#082b4c] uppercase tracking-wider font-mono">
          Enter 10-Digit Railway PNR Number:
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={pnrInput}
            onChange={(e) => setPnrInput(e.target.value)}
            placeholder="e.g. 1234567890"
            className="w-full sm:w-80 bg-slate-50 text-slate-900 rounded-lg px-4 py-2.5 border border-slate-300 focus:outline-none focus:border-emerald-600 focus:bg-white text-sm font-mono tracking-wider font-bold"
          />
          <button
            onClick={() => searchPNR(pnrInput)}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs font-mono flex items-center justify-center space-x-1.5 transition-all shadow-xs"
          >
            <Search className="h-3.5 w-3.5" />
            <span>{loading ? 'Querying...' : 'Get Dynamic Status'}</span>
          </button>
        </div>

        {/* Demo PNR Quick Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200 text-xs">
          <span className="text-slate-500 font-mono text-[11px] font-bold">Demo PNRs:</span>
          {['1234567890', '9876543210', '4567890123'].map((p) => (
            <button
              key={p}
              onClick={() => {
                setPnrInput(p);
                searchPNR(p);
              }}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-emerald-50 text-slate-700 border border-slate-200 font-mono text-[11px] font-bold transition-all"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {/* PNR Journey Result Card */}
      {pnrResult && (
        <div className="bg-white rounded-2xl p-6 border border-emerald-500 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono">
                  {pnrResult.booking_status}
                </span>
                <span className="text-xs text-slate-500 font-mono font-medium">
                  PNR: <strong className="text-slate-900 font-black">{pnrResult.masked_pnr}</strong> (Masked in logs)
                </span>
              </div>
              <h3 className="text-xl font-black text-[#082b4c] mt-1">
                {pnrResult.train_number} — {pnrResult.train_name}
              </h3>
            </div>

            <div className="text-right font-mono text-xs">
              <span className="text-slate-500 block font-medium">Coach / Berth</span>
              <span className="text-base font-black text-slate-900">{pnrResult.coach} - {pnrResult.berth}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs font-mono">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-slate-500 block text-[10px] font-bold">ROUTE</span>
              <span className="text-sm font-black text-slate-800">{pnrResult.source} → {pnrResult.destination}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-slate-500 block text-[10px] font-bold">ACTIVE DELAY</span>
              <span className="text-sm font-black text-amber-800">+{pnrResult.dynamic_eta.current_delay_minutes} min</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-slate-500 block text-[10px] font-bold">DYNAMIC ARRIVAL (P50)</span>
              <span className="text-sm font-black text-[#082b4c]">{pnrResult.dynamic_eta.eta}</span>
              <span className="text-[10px] text-slate-500 block font-bold">Range: {pnrResult.dynamic_eta.eta_p10}-{pnrResult.dynamic_eta.eta_p90}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-slate-500 block text-[10px] font-bold">RELIABILITY / RISK</span>
              <span className="text-sm font-black text-emerald-800">{Math.round(pnrResult.dynamic_eta.reliability * 100)}% ({pnrResult.connection_risk} Risk)</span>
            </div>
          </div>
        </div>
      )}

      {/* Button-Phone SMS Simulator Frame */}
      <SMSPhoneSimulator />
    </div>
  );
}
