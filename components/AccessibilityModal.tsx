'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, Eye, Sun, Moon, Type, X, Check, Keyboard } from 'lucide-react';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccessibilityModal({ isOpen, onClose }: AccessibilityModalProps) {
  const [highContrast, setHighContrast] = useState(false);
  const [textScale, setTextScale] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [ttsSpeed, setTtsSpeed] = useState<'0.8' | '1.0' | '1.2'>('1.0');

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  const speakAnnouncement = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = parseFloat(ttsSpeed);
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in your browser.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="rounded-2xl max-w-lg w-full p-6 border border-slate-300 bg-white shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-black text-[#082b4c]">Accessibility & Voice Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Setting 1: High Contrast Display Mode */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
          <div className="space-y-0.5">
            <span className="text-sm font-bold text-[#082b4c]">High Contrast Mode</span>
            <p className="text-xs text-slate-500 font-medium">Enhance edge borders and color differentiation</p>
          </div>
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              highContrast ? 'bg-[#082b4c] text-white shadow-xs' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {highContrast ? 'ENABLED' : 'DISABLED'}
          </button>
        </div>

        {/* Setting 2: Font Scale */}
        <div className="space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#082b4c]">Display Text Scale</span>
            <Type className="h-4 w-4 text-blue-600" />
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            {(['normal', 'large', 'xlarge'] as const).map((scale) => (
              <button
                key={scale}
                onClick={() => setTextScale(scale)}
                className={`py-1.5 rounded-md border text-center transition-all font-bold ${
                  textScale === scale
                    ? 'bg-[#082b4c] border-[#082b4c] text-white shadow-xs'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {scale.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Setting 3: Audio Announcements */}
        <div className="space-y-3 p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#082b4c]">Voice Announcement Engine (TTS)</span>
            <Volume2 className="h-4 w-4 text-emerald-700" />
          </div>
          <p className="text-xs text-slate-500 font-medium">Listen to real-time train ETA and platform arrival speech</p>
          <button
            onClick={() => speakAnnouncement('Attention passengers: Train number 1 2 6 7 5 Kovai Express is running with an active delay of 18 minutes. Expected dynamic arrival time is 14:48 at Coimbatore.')}
            className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg flex items-center justify-center space-x-2 transition-all shadow-xs font-mono"
          >
            <Volume2 className="h-4 w-4" />
            <span>Test Audio Voice Announcement</span>
          </button>
        </div>

        {/* Keyboard Shortcuts Guide */}
        <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-200 font-mono">
          <div className="flex items-center space-x-1.5 text-[#082b4c] font-black">
            <Keyboard className="h-3.5 w-3.5 text-blue-600" />
            <span>Keyboard Shortcuts</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div><kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-slate-800 font-bold shadow-2xs">1</kbd> Operations Hub</div>
            <div><kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-slate-800 font-bold shadow-2xs">2</kbd> Train Deep Dive</div>
            <div><kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-slate-800 font-bold shadow-2xs">3</kbd> Station Board</div>
            <div><kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-slate-800 font-bold shadow-2xs">4</kbd> Delay Simulation</div>
          </div>
        </div>

        {/* Done Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#082b4c] hover:bg-[#0b3b60] text-white font-bold text-xs rounded-lg transition-all shadow-xs"
        >
          Close Accessibility Settings
        </button>
      </div>
    </div>
  );
}
