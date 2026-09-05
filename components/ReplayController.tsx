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
    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
      {/* Telemetry Clock */}
      <div className="flex items-center space-x-3">
        <div className="h-9 w-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0b3b60] shadow-xs">
          <Activity className="h-4 w-4 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-mono font-bold">SIMULATED TIME:</span>
            <span className="text-sm font-black text-[#082b4c] font-mono">
              {replayState?.simulated_time || '18:00'} IST
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono font-medium">
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
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm ${
            isPlaying
              ? 'bg-amber-600 text-white hover:bg-amber-500'
              : 'bg-[#0b3b60] text-white hover:bg-[#082b4c]'
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
          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs transition-all shadow-xs"
          title="Reset to initial state"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>

        {/* Speed Selector */}
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-[11px] font-mono">
          {[1, 2, 5, 10].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 rounded transition-all font-semibold ${
                speed === s ? 'bg-[#ea580c] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
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
