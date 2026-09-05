'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Train, Activity, ArrowLeft, RefreshCw, GitBranch, Share2 } from 'lucide-react';
import ETACard from '@/components/ETACard';
import ReasoningPanel from '@/components/ReasoningPanel';
import TrainTimeline from '@/components/TrainTimeline';
import TechnicalDimensionsCard from '@/components/TechnicalDimensionsCard';
import DelayTrajectoryChart from '@/components/DelayTrajectoryChart';
import IRCTCTrainDetailView from '@/components/IRCTCTrainDetailView';
import { DynamicETAResponse } from '@/lib/types/eta';

export default function TrainDetailPage() {
  const params = useParams();
  const trainId = (params?.id as string) || '12675';

  const [etaData, setEtaData] = useState<DynamicETAResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [delaySlider, setDelaySlider] = useState<number | null>(null);

  const fetchETA = async (delayOverride?: number) => {
    setLoading(true);
    try {
      const url = delayOverride !== undefined
        ? `/api/trains/${trainId}/eta?delay=${delayOverride}`
        : `/api/trains/${trainId}/eta`;
      const res = await fetch(url);
      const data: DynamicETAResponse = await res.json();
      setEtaData(data);
      if (delayOverride === undefined) {
        setDelaySlider(data.current_delay_minutes);
      }
    } catch (err) {
      console.error('Failed to fetch train ETA:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchETA();
  }, [trainId]);

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Operations Hub</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Link
            href="/simulate"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <GitBranch className="h-3.5 w-3.5 text-sky-400" />
            <span>Simulate Delay</span>
          </Link>
          <button
            onClick={() => fetchETA()}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition-all"
            title="Refresh Telemetry"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Dynamic ETA Summary Card */}
      {etaData ? (
        <div className="space-y-6">
          <ETACard eta={etaData} />

          {/* Real-Time Interactive Delay Adjuster */}
          <div className="glass-panel rounded-xl p-4 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Interactive Point-In-Time Delay Tester
              </span>
              <p className="text-xs text-slate-400">
                Adjust active delay to observe instantaneous quantile dynamic ETA recalculation
              </p>
            </div>
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={delaySlider ?? etaData.current_delay_minutes}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setDelaySlider(val);
                  fetchETA(val);
                }}
                className="w-48 accent-sky-400"
              />
              <span className="text-sm font-bold font-mono text-sky-400 min-w-[3.5rem]">
                +{delaySlider ?? etaData.current_delay_minutes} min
              </span>
            </div>
          </div>

          {/* IRCTC Rich Train Details (Coach Layout, Intermediate Halts, Catering, Ratings) */}
          <IRCTCTrainDetailView eta={etaData} />

          {/* Train Dimensions, Live Weather & Corridor Stats */}
          {etaData.technical_dimensions && (
            <TechnicalDimensionsCard
              dimensions={etaData.technical_dimensions}
              weather={etaData.weather_telemetry}
              historical={etaData.historical_route_stats}
            />
          )}

          {/* Structured Evidence Reasoning Panel */}
          <ReasoningPanel reasons={etaData.reasons} />

          {/* Dynamic Quantile Trajectory & Runtime Uncertainty Bands */}
          <DelayTrajectoryChart
            timeline={etaData.section_timeline}
            trainNumber={etaData.train_number}
          />

          {/* Section-by-Section Dynamic Timeline */}
          <TrainTimeline
            timeline={etaData.section_timeline}
            currentStationCode={etaData.current_station}
          />
        </div>
      ) : (
        <div className="glass-panel rounded-xl p-12 text-center text-slate-400 flex items-center justify-center space-x-2">
          <RefreshCw className="h-5 w-5 animate-spin text-sky-400" />
          <span>Loading Train {trainId} dynamic telemetry...</span>
        </div>
      )}
    </div>
  );
}
