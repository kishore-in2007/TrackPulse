'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Compass, Train, Clock, ShieldCheck, AlertTriangle, ArrowRight, ArrowLeft, Star, Filter, Sparkles } from 'lucide-react';
import { RecommendationResponse, RecommendedTrain } from '@/lib/types/recommendation';

export default function PassengerPage() {
  const [source, setSource] = useState('MAS');
  const [destination, setDestination] = useState('CBE');
  const [date, setDate] = useState('2026-09-10');
  const [preference, setPreference] = useState<'balanced' | 'fastest' | 'most_reliable' | 'lowest_delay_risk'>('balanced');
  const [results, setResults] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source,
          destination,
          date,
          preference
        })
      });
      const data: RecommendationResponse = await res.json();
      setResults(data);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [preference]);

  const popularRoutes = [
    { src: 'MAS', dst: 'CBE', label: 'Chennai (MAS) → Coimbatore (CBE)' },
    { src: 'MAS', dst: 'SBC', label: 'Chennai (MAS) → Bengaluru (SBC)' },
    { src: 'NDLS', dst: 'MAS', label: 'New Delhi (NDLS) → Chennai (MAS)' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors font-medium mb-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Operations Hub</span>
        </Link>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Compass className="h-6 w-6 text-sky-400" />
          Passenger Journey Intelligence & Multi-Criteria Recommendation
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Predictive train ranking combining dynamic arrival quality, prediction reliability, punctuality, and connection buffer safety.
        </p>
      </div>

      {/* Query Filter Card */}
      <div className="glass-panel rounded-xl p-6 border border-white/10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Source */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 font-mono">SOURCE STATION:</label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value.toUpperCase())}
              placeholder="e.g. MAS"
              className="w-full bg-slate-900 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-sky-400 text-xs font-mono"
            />
          </div>

          {/* Destination */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 font-mono">DESTINATION STATION:</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value.toUpperCase())}
              placeholder="e.g. CBE"
              className="w-full bg-slate-900 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-sky-400 text-xs font-mono"
            />
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 font-mono">JOURNEY DATE:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-900 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-sky-400 text-xs font-mono"
            />
          </div>

          {/* Preference Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 font-mono">PASSENGER PRIORITY:</label>
            <select
              value={preference}
              onChange={(e: any) => setPreference(e.target.value)}
              className="w-full bg-slate-900 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-sky-400 text-xs font-mono"
            >
              <option value="balanced">Balanced Utility (Standard)</option>
              <option value="fastest">Fastest Travel Time</option>
              <option value="most_reliable">Highest Prediction Reliability</option>
              <option value="lowest_delay_risk">Lowest Delay Risk</option>
            </select>
          </div>
        </div>

        {/* Popular Quick Selects */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-mono text-[11px]">Popular Corridors:</span>
            {popularRoutes.map((r, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSource(r.src);
                  setDestination(r.dst);
                  fetchRecommendations();
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono transition-all"
              >
                {r.label}
              </button>
            ))}
          </div>

          <button
            onClick={fetchRecommendations}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 transition-all shadow-md"
          >
            <span>{loading ? 'Evaluating AI Models...' : 'Search & Rank Trains'}</span>
          </button>
        </div>
      </div>

      {/* Results Container */}
      {results && (
        <div className="space-y-6">
          {/* Recommendation Summary */}
          <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-500/30 text-xs text-sky-200 flex items-center space-x-3">
            <Sparkles className="h-5 w-5 text-sky-400 flex-shrink-0" />
            <span>{results.summary}</span>
          </div>

          {/* Featured Recommended Train Card */}
          {results.recommended_train && (
            <div className="glass-panel rounded-2xl p-6 border-2 border-sky-400/50 glow-accent relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/40">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-md bg-sky-500 text-slate-950 font-bold text-xs flex items-center gap-1 font-mono">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    TOP RECOMMENDED CHOICE
                  </span>
                  <span className="text-xs font-mono text-sky-300">
                    Composite Utility Score: {results.recommended_train.composite_score}/100
                  </span>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-semibold">
                  {Math.round(results.recommended_train.reliability * 100)}% Calibrated Reliability
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div>
                  <div className="text-2xl font-bold font-mono text-white">
                    {results.recommended_train.train_number}
                  </div>
                  <div className="text-sm text-slate-200 font-semibold">{results.recommended_train.train_name}</div>
                  <div className="text-xs text-slate-400">{results.recommended_train.train_type}</div>
                </div>

                <div>
                  <div className="text-xs text-slate-400">DEPARTURE:</div>
                  <div className="text-lg font-bold font-mono text-white">
                    {results.recommended_train.scheduled_departure}
                  </div>
                  <div className="text-xs text-slate-400">{results.recommended_train.source}</div>
                </div>

                <div>
                  <div className="text-xs text-slate-400">DYNAMIC ARRIVAL (P50):</div>
                  <div className="text-lg font-bold font-mono text-sky-400 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {results.recommended_train.predicted_arrival}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    Range: {results.recommended_train.eta_p10}–{results.recommended_train.eta_p90}
                  </div>
                </div>

                <div className="flex flex-col items-end justify-center">
                  <Link
                    href={`/train/${results.recommended_train.train_number}`}
                    className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow font-mono"
                  >
                    <span>Track Train</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Reasons */}
              <div className="mt-4 pt-3 border-t border-white/5 space-y-1">
                {results.recommended_train.reasons.map((r, idx) => (
                  <div key={idx} className="text-xs text-slate-300 flex items-center space-x-1.5">
                    <span className="text-sky-400">•</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alternative Trains Table */}
          {results.alternatives.length > 0 && (
            <div className="glass-panel rounded-xl p-6 border border-white/10">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider font-mono">
                Alternative Candidate Trains
              </h3>

              <div className="space-y-3">
                {results.alternatives.map((alt) => (
                  <div
                    key={alt.train_id}
                    className="p-4 bg-slate-900/60 rounded-xl border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold font-mono text-white text-sm">{alt.train_number}</span>
                        <span className="text-sm text-slate-200 font-semibold">{alt.train_name}</span>
                        <span className="text-xs text-slate-400 font-mono">Score: {alt.composite_score}/100</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Dep: {alt.scheduled_departure} | Delay: +{alt.current_delay_minutes}m | Risk: {alt.delay_risk}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right font-mono">
                        <span className="text-sky-300 font-bold text-sm block">ETA: {alt.predicted_arrival}</span>
                        <span className="text-[10px] text-slate-400">({alt.eta_p10}–{alt.eta_p90})</span>
                      </div>
                      <Link
                        href={`/train/${alt.train_number}`}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold font-mono"
                      >
                        Inspect
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
