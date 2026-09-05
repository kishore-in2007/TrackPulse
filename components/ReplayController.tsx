'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward, Radio, Activity } from 'lucide-react';
import { ReplayState } from '@/lib/replay/replay_engine';

interface ReplayControllerProps {
  onStateChange?: (state: ReplayState) => void;
}

export default function ReplayController({ onStateChange }: ReplayControllerProps) {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [replayState, setReplayState] = useState<ReplayState | null>(null);

  const fetchState = async (stepToFetch: number, playingState: boolean = isPlaying, currentSpeed: number = speed) => {
    try {
      const res = await fetch(`/api/replay?step=${stepToFetch}&playing=${playingState}&speed=${currentSpeed}`);
      const data: ReplayState = await res.json();
      setReplayState(data);
      if (onStateChange) onStateChange(data);
    } catch (err) {
      console.error('Error fetching replay state:', err);
    }
  };

  useEffect(() => {
    fetchState(step, isPlaying, speed);
  }, [step, speed]);

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setStep((prev) => {
          const next = (prev + 1) % 4;
          return next;
        });
      }, 4000 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  return (
    <div className="glass-panel rounded-xl p-4 border border-white/10 flex flex-wrap items-center justify-between gap-4">
      {/* Telemetry Clock */}
      <div className="flex items-center space-x-3">
        <div className="h-8 w-8 rounded-lg bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400">
          <Activity className="h-4 w-4 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-mono">SIMULATED TIME:</span>
            <span className="text-sm font-bold text-sky-300 font-mono">
              {replayState?.simulated_time || '18:00'} IST
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Telemetry Step {step + 1} of {replayState?.total_steps || 4}
          </span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => {
            setIsPlaying(!isPlaying);
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
            isPlaying
              ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
              : 'bg-sky-500 text-slate-950 hover:bg-sky-400'
          }`}
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          <span>{isPlaying ? 'Pause Replay' : 'Play Replay'}</span>
        </button>

        <button
          onClick={() => {
            setIsPlaying(false);
            setStep(0);
          }}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition-all"
          title="Reset to initial state"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>

        {/* Speed Selector */}
        <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-white/10 text-[11px] font-mono">
          {[1, 2, 5, 10].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 rounded ${
                speed === s ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
