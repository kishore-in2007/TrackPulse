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
  const [useCustomWeights, setUseCustomWeights] = useState(false);
  const [customWeights, setCustomWeights] = useState({
    arrival_quality: 0.35,
    reliability: 0.25,
    punctuality: 0.25,
    connection_safety: 0.15
  });
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
          preference,
          weights: useCustomWeights ? customWeights : undefined
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
          className="text-xs text-[#082b4c] hover:text-blue-700 flex items-center gap-1.5 transition-colors font-bold mb-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Operations Hub</span>
        </Link>
        <h1 className="text-2xl font-black text-[#082b4c] flex items-center gap-2">
          <Compass className="h-6 w-6 text-blue-600" />
          Passenger Journey Intelligence & Multi-Criteria Recommendation
        </h1>
        <p className="text-xs text-slate-600 font-medium mt-1">
          Predictive train ranking combining dynamic arrival quality, prediction reliability, punctuality, and connection buffer safety.
        </p>
      </div>

      {/* Query Filter Card */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Source */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-[#082b4c] font-mono">SOURCE STATION:</label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value.toUpperCase())}
              placeholder="e.g. MAS"
              className="w-full bg-slate-50 text-slate-900 rounded-lg px-3 py-2 border border-slate-300 focus:outline-none focus:border-blue-600 focus:bg-white text-xs font-mono font-bold"
            />
          </div>

          {/* Destination */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-[#082b4c] font-mono">DESTINATION STATION:</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value.toUpperCase())}
              placeholder="e.g. CBE"
              className="w-full bg-slate-50 text-slate-900 rounded-lg px-3 py-2 border border-slate-300 focus:outline-none focus:border-blue-600 focus:bg-white text-xs font-mono font-bold"
            />
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-[#082b4c] font-mono">JOURNEY DATE:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 rounded-lg px-3 py-2 border border-slate-300 focus:outline-none focus:border-blue-600 focus:bg-white text-xs font-mono font-bold"
            />
          </div>

          {/* Preference Selector */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-[#082b4c] font-mono">PRIORITY PROFILE:</label>
              <button
                type="button"
                onClick={() => setUseCustomWeights(!useCustomWeights)}
                className="text-[10px] text-blue-700 hover:underline font-mono font-bold"
              >
                {useCustomWeights ? 'Use Standard' : 'Custom Sliders'}
              </button>
            </div>
            <select
              value={preference}
              onChange={(e: any) => setPreference(e.target.value)}
              disabled={useCustomWeights}
              className="w-full bg-slate-50 text-slate-900 disabled:opacity-50 rounded-lg px-3 py-2 border border-slate-300 focus:outline-none focus:border-blue-600 focus:bg-white text-xs font-mono font-bold"
            >
              <option value="balanced">Balanced Utility (Standard)</option>
              <option value="fastest">Fastest Travel Time</option>
              <option value="most_reliable">Highest Prediction Reliability</option>
              <option value="lowest_delay_risk">Lowest Delay Risk</option>
            </select>
          </div>
        </div>

        {/* Custom Multi-Criteria Optimization Weight Sliders */}
        {useCustomWeights && (
          <div className="p-4 bg-slate-50 rounded-xl border border-blue-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-[#082b4c]">
              <span className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-blue-600" />
                Fine-Grained Multi-Criteria Optimization Weights
              </span>
              <span className="text-[10px] text-slate-500 font-normal">Adjust relative importance of each metric</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600 font-bold">Arrival Quality:</span>
                  <span className="text-[#082b4c] font-black">{Math.round(customWeights.arrival_quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.80"
                  step="0.05"
                  value={customWeights.arrival_quality}
                  onChange={(e) => setCustomWeights(prev => ({ ...prev, arrival_quality: parseFloat(e.target.value) }))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600 font-bold">AI Reliability:</span>
                  <span className="text-emerald-700 font-black">{Math.round(customWeights.reliability * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.80"
                  step="0.05"
                  value={customWeights.reliability}
                  onChange={(e) => setCustomWeights(prev => ({ ...prev, reliability: parseFloat(e.target.value) }))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600 font-bold">Historical Punctuality:</span>
                  <span className="text-amber-800 font-black">{Math.round(customWeights.punctuality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.80"
                  step="0.05"
                  value={customWeights.punctuality}
                  onChange={(e) => setCustomWeights(prev => ({ ...prev, punctuality: parseFloat(e.target.value) }))}
                  className="w-full accent-amber-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600 font-bold">Connection Safety:</span>
                  <span className="text-purple-800 font-black">{Math.round(customWeights.connection_safety * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.80"
                  step="0.05"
                  value={customWeights.connection_safety}
                  onChange={(e) => setCustomWeights(prev => ({ ...prev, connection_safety: parseFloat(e.target.value) }))}
                  className="w-full accent-purple-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* Popular Route Shortcuts & Action Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
            <span className="text-slate-500 font-mono text-[11px] font-bold">Popular:</span>
            {popularRoutes.map((r, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSource(r.src);
                  setDestination(r.dst);
                  fetchRecommendations();
                }}
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 text-slate-700 border border-slate-200 text-[10px] sm:text-[11px] font-mono font-bold transition-all"
              >
                {r.label}
              </button>
            ))}
          </div>

          <button
            onClick={fetchRecommendations}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#ff9933] hover:bg-[#e08522] text-[#082b4c] font-black text-xs font-mono flex items-center justify-center gap-1.5 transition-all shadow-xs"
          >
            <span>{loading ? 'Evaluating AI Models...' : 'Search & Rank Trains'}</span>
          </button>
        </div>
      </div>

      {/* Results Container */}
      {results && (
        <div className="space-y-6">
          {/* Recommendation Summary */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-[#082b4c] flex items-center space-x-3 font-medium">
            <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <span>{results.summary}</span>
          </div>

          {/* Featured Recommended Train Card */}
          {results.recommended_train && (
            <div className="bg-white rounded-2xl p-4 sm:p-6 border-2 border-blue-600 relative overflow-hidden shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-200">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-md bg-[#ff9933] text-[#082b4c] font-black text-xs flex items-center gap-1 font-mono">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    TOP RECOMMENDED CHOICE
                  </span>
                  <span className="text-xs font-mono font-bold text-blue-900">
                    Composite Utility Score: {results.recommended_train.composite_score}/100
                  </span>
                </div>
                <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {Math.round(results.recommended_train.reliability * 100)}% Calibrated Reliability
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                <div>
                  <div className="text-2xl font-black font-mono text-[#082b4c]">
                    {results.recommended_train.train_number}
                  </div>
                  <div className="text-sm text-slate-800 font-bold">{results.recommended_train.train_name}</div>
                  <div className="text-xs text-slate-500 font-medium">{results.recommended_train.train_type}</div>
                </div>

                <div>
                  <div className="text-xs text-slate-500 font-bold">DEPARTURE:</div>
                  <div className="text-lg font-black font-mono text-slate-900">
                    {results.recommended_train.scheduled_departure}
                  </div>
                  <div className="text-xs text-slate-600 font-medium">{results.recommended_train.source}</div>
                </div>

                <div>
                  <div className="text-xs text-slate-500 font-bold">DYNAMIC ARRIVAL (P50):</div>
                  <div className="text-lg font-black font-mono text-blue-700 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {results.recommended_train.predicted_arrival}
                  </div>
                  <div className="text-xs text-slate-500 font-mono font-medium">
                    Range: {results.recommended_train.eta_p10}–{results.recommended_train.eta_p90}
                  </div>
                </div>

                <div className="flex flex-col items-end justify-center">
                  <Link
                    href={`/train/${results.recommended_train.train_number}`}
                    className="px-4 py-2 rounded-lg bg-[#082b4c] hover:bg-[#0b3b60] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs font-mono"
                  >
                    <span>Track Train</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Reasons */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
                {results.recommended_train.reasons.map((r, idx) => (
                  <div key={idx} className="text-xs text-slate-700 flex items-center space-x-1.5 font-medium">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alternative Trains Table */}
          {results.alternatives.length > 0 && (
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
              <h3 className="text-sm font-black text-[#082b4c] mb-4 uppercase tracking-wider font-mono">
                Alternative Candidate Trains
              </h3>

              <div className="space-y-3">
                {results.alternatives.map((alt) => (
                  <div
                    key={alt.train_id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-black font-mono text-[#082b4c] text-sm">{alt.train_number}</span>
                        <span className="text-sm text-slate-800 font-bold">{alt.train_name}</span>
                        <span className="text-xs text-slate-500 font-mono font-bold">Score: {alt.composite_score}/100</span>
                      </div>
                      <div className="text-xs text-slate-600 font-medium mt-1">
                        Dep: <strong>{alt.scheduled_departure}</strong> | Delay: <span className="text-amber-800 font-bold">+{alt.current_delay_minutes}m</span> | Risk: <span className="font-bold">{alt.delay_risk}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right font-mono">
                        <span className="text-[#082b4c] font-black text-sm block">ETA: {alt.predicted_arrival}</span>
                        <span className="text-[10px] text-slate-500 font-bold">({alt.eta_p10}–{alt.eta_p90})</span>
                      </div>
                      <Link
                        href={`/train/${alt.train_number}`}
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-[#082b4c] border border-slate-300 text-xs font-bold font-mono shadow-2xs"
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
