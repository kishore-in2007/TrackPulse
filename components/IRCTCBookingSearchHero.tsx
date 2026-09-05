'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Train, 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  ArrowRightLeft, 
  ShieldCheck, 
  Radio, 
  Navigation, 
  Sparkles, 
  CheckCircle2, 
  MessageSquare, 
  ArrowRight,
  Filter,
  Layers,
  Flame,
  Tag
} from 'lucide-react';

interface IRCTCBookingSearchHeroProps {
  onSelectTrain?: (trainId: string) => void;
  selectedTrainId?: string;
}

export default function IRCTCBookingSearchHero({ onSelectTrain, selectedTrainId = '12675' }: IRCTCBookingSearchHeroProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'LIVE_ETA' | 'BETWEEN_STATIONS' | 'PNR_STATUS' | 'STATION_LIVE'>('LIVE_ETA');

  // Tab 1: Live Train ETA State
  const [trainQuery, setTrainQuery] = useState('');

  // Tab 2: Trains Between Stations State
  const [sourceStation, setSourceStation] = useState('MAS');
  const [destStation, setDestStation] = useState('CBE');
  const [journeyDate, setJourneyDate] = useState('2026-09-06');
  const [travelClass, setTravelClass] = useState('ALL');
  const [travelQuota, setTravelQuota] = useState('GENERAL');

  // Tab 3: PNR Status State
  const [pnrNumber, setPnrNumber] = useState('1234567890');

  // Tab 4: Station Live State
  const [liveStationCode, setLiveStationCode] = useState('MAS');

  const popularStations = [
    { code: 'MAS', name: 'Chennai Central' },
    { code: 'NDLS', name: 'New Delhi' },
    { code: 'CBE', name: 'Coimbatore Jn' },
    { code: 'SBC', name: 'KSR Bengaluru' },
    { code: 'HWH', name: 'Howrah Jn' },
    { code: 'MMCT', name: 'Mumbai Central' },
    { code: 'BZA', name: 'Vijayawada Jn' },
  ];

  const popularTrains = [
    { id: '12675', name: 'Kovai Superfast', from: 'MAS', to: 'CBE', type: 'Superfast', tag: 'High Frequency' },
    { id: '12952', name: 'Mumbai Rajdhani', from: 'NDLS', to: 'MMCT', type: 'Rajdhani', tag: 'Speed 140 km/h' },
    { id: '12007', name: 'Mysore Shatabdi', from: 'MAS', to: 'MYS', type: 'Shatabdi', tag: 'Intercity AC' },
    { id: '12622', name: 'Tamil Nadu Express', from: 'NDLS', to: 'MAS', type: 'Superfast', tag: 'Trunk Route' },
    { id: '12423', name: 'Dibrugarh Rajdhani', from: 'DBRG', to: 'NDLS', type: 'Rajdhani', tag: 'Long Distance' },
    { id: '22626', name: 'Double Decker Exp', from: 'SBC', to: 'MAS', type: 'Superfast', tag: 'Air Conditioned' },
  ];

  const handleTrainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = trainQuery.trim();
    if (clean) {
      if (onSelectTrain) {
        onSelectTrain(clean);
      } else {
        router.push(`/train/${clean}`);
      }
    }
  };

  const handleBetweenStationsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/passenger?src=${sourceStation}&dst=${destStation}&date=${journeyDate}&class=${travelClass}`);
  };

  const handlePnrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pnrNumber.trim()) {
      router.push(`/pnr?pnr=${pnrNumber.trim()}`);
    }
  };

  const handleStationLiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (liveStationCode.trim()) {
      router.push(`/station/${liveStationCode.trim().toUpperCase()}`);
    }
  };

  const swapStations = () => {
    const temp = sourceStation;
    setSourceStation(destStation);
    setDestStation(temp);
  };

  return (
    <div className="rounded-2xl border border-slate-300 bg-white shadow-md overflow-hidden">
      {/* Top IRCTC Official Saffron Header Strip */}
      <div className="bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] px-6 py-2.5 flex flex-wrap items-center justify-between text-white text-xs font-semibold shadow-xs">
        <div className="flex items-center space-x-2">
          <span className="bg-white text-[#082b4c] px-2 py-0.5 rounded font-black text-[11px] tracking-wide shadow-xs">
            IRCTC • CRIS
          </span>
          <span className="tracking-wide font-bold">INDIAN RAILWAYS LIVE COACHING INTELLIGENCE SYSTEM</span>
        </div>
        <div className="flex items-center space-x-3 text-[11px] font-mono">
          <span className="hidden sm:inline">SIH PROBLEM STATEMENT: SIH26028</span>
          <span className="px-2 py-0.5 rounded bg-black/20 text-white font-bold">2,810 TRAINS MONITORED</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-5 sm:p-7 space-y-6 bg-white">
        {/* Tab Selection Bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
          <button
            onClick={() => setActiveTab('LIVE_ETA')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'LIVE_ETA'
                ? 'bg-[#ea580c] text-white shadow-md border border-[#ea580c]'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            <Radio className="h-4 w-4" />
            <span>LIVE TRAIN RUNNING ETA</span>
          </button>

          <button
            onClick={() => setActiveTab('BETWEEN_STATIONS')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'BETWEEN_STATIONS'
                ? 'bg-[#ea580c] text-white shadow-md border border-[#ea580c]'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            <Train className="h-4 w-4" />
            <span>FIND TRAINS BETWEEN STATIONS</span>
          </button>

          <button
            onClick={() => setActiveTab('PNR_STATUS')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'PNR_STATUS'
                ? 'bg-[#ea580c] text-white shadow-md border border-[#ea580c]'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>PNR JOURNEY FORECAST</span>
          </button>

          <button
            onClick={() => setActiveTab('STATION_LIVE')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'STATION_LIVE'
                ? 'bg-[#ea580c] text-white shadow-md border border-[#ea580c]'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            <Navigation className="h-4 w-4" />
            <span>LIVE STATION BOARD</span>
          </button>
        </div>

        {/* Tab 1: Live Train Running Status Form */}
        {activeTab === 'LIVE_ETA' && (
          <form onSubmit={handleTrainSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div className="md:col-span-8 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Search className="h-3.5 w-3.5 text-[#ea580c]" />
                  <span>Enter Train Number or Name:</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={trainQuery}
                    onChange={(e) => setTrainQuery(e.target.value)}
                    placeholder="e.g. 12952, 12622, 12007, Kovai Express, Rajdhani..."
                    className="w-full bg-slate-50 text-slate-900 rounded-xl pl-10 pr-4 py-3.5 border-2 border-slate-300 focus:border-[#ea580c] focus:bg-white focus:outline-none text-sm font-semibold shadow-inner placeholder:text-slate-400 font-mono transition-colors"
                  />
                  <Train className="h-5 w-5 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                </div>
              </div>

              <div className="md:col-span-4">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 bg-[#ea580c] hover:bg-[#c2410c] text-white font-black text-sm rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 tracking-wide font-mono"
                >
                  <Search className="h-4 w-4" />
                  <span>GET DYNAMIC ETA</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: Trains Between Stations Form */}
        {activeTab === 'BETWEEN_STATIONS' && (
          <form onSubmit={handleBetweenStationsSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 items-end">
              {/* Origin Station */}
              <div className="sm:col-span-1 md:col-span-3 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block font-mono">
                  From Station:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={sourceStation}
                    onChange={(e) => setSourceStation(e.target.value.toUpperCase())}
                    placeholder="e.g. MAS, NDLS"
                    className="w-full bg-slate-50 text-slate-900 rounded-xl pl-9 pr-3 py-3 border-2 border-slate-300 focus:border-[#ea580c] focus:bg-white focus:outline-none text-sm font-bold font-mono"
                  />
                  <MapPin className="h-4 w-4 text-emerald-600 absolute left-3 top-3.5 pointer-events-none" />
                </div>
              </div>

              {/* Swap Button */}
              <div className="hidden md:flex md:col-span-1 justify-center pb-2">
                <button
                  type="button"
                  onClick={swapStations}
                  className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#ea580c] border border-slate-300 transition-all shadow-xs"
                  title="Swap Stations"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </button>
              </div>

              {/* Destination Station */}
              <div className="sm:col-span-1 md:col-span-3 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block font-mono">
                  To Station:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={destStation}
                    onChange={(e) => setDestStation(e.target.value.toUpperCase())}
                    placeholder="e.g. CBE, SBC"
                    className="w-full bg-slate-50 text-slate-900 rounded-xl pl-9 pr-3 py-3 border-2 border-slate-300 focus:border-[#ea580c] focus:bg-white focus:outline-none text-sm font-bold font-mono"
                  />
                  <MapPin className="h-4 w-4 text-red-600 absolute left-3 top-3.5 pointer-events-none" />
                </div>
              </div>

              {/* Date */}
              <div className="sm:col-span-1 md:col-span-3 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block font-mono">
                  Date of Journey:
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={journeyDate}
                    onChange={(e) => setJourneyDate(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 rounded-xl pl-9 pr-3 py-3 border-2 border-slate-300 focus:border-[#ea580c] focus:bg-white focus:outline-none text-xs font-bold font-mono"
                  />
                  <Calendar className="h-4 w-4 text-[#0b3b60] absolute left-3 top-3.5 pointer-events-none" />
                </div>
              </div>

              {/* Submit Button */}
              <div className="sm:col-span-1 md:col-span-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#ea580c] hover:bg-[#c2410c] text-white font-black text-xs rounded-xl transition-all shadow-md flex items-center justify-center space-x-1.5 tracking-wide font-mono"
                >
                  <Search className="h-4 w-4" />
                  <span>SEARCH TRAINS</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Tab 3: PNR Status Form */}
        {activeTab === 'PNR_STATUS' && (
          <form onSubmit={handlePnrSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div className="md:col-span-8 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Enter 10-Digit Passenger PNR Number:</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={10}
                    value={pnrNumber}
                    onChange={(e) => setPnrNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit PNR (e.g. 1234567890)"
                    className="w-full bg-slate-50 text-slate-900 rounded-xl pl-10 pr-4 py-3.5 border-2 border-slate-300 focus:border-[#ea580c] focus:bg-white focus:outline-none text-base font-black tracking-widest shadow-inner font-mono"
                  />
                  <MessageSquare className="h-5 w-5 text-emerald-600 absolute left-3 top-3.5 pointer-events-none" />
                </div>
              </div>

              <div className="md:col-span-4">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 bg-emerald-700 hover:bg-emerald-600 text-white font-black text-sm rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 tracking-wide font-mono"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>GET PNR STATUS</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Tab 4: Live Station Board Form */}
        {activeTab === 'STATION_LIVE' && (
          <form onSubmit={handleStationLiveSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div className="md:col-span-8 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Navigation className="h-3.5 w-3.5 text-[#0b3b60]" />
                  <span>Enter Station Code for Live Arrivals / Departures:</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={liveStationCode}
                    onChange={(e) => setLiveStationCode(e.target.value.toUpperCase())}
                    placeholder="e.g. MAS, NDLS, HWH, SBC, BZA..."
                    className="w-full bg-slate-50 text-slate-900 rounded-xl pl-10 pr-4 py-3.5 border-2 border-slate-300 focus:border-[#0b3b60] focus:bg-white focus:outline-none text-base font-black tracking-wider shadow-inner font-mono"
                  />
                  <MapPin className="h-5 w-5 text-[#0b3b60] absolute left-3 top-3.5 pointer-events-none" />
                </div>
              </div>

              <div className="md:col-span-4">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 bg-[#0b3b60] hover:bg-[#082b4c] text-white font-black text-sm rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 tracking-wide font-mono"
                >
                  <Navigation className="h-4 w-4" />
                  <span>OPEN STATION BOARD</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Quick Station Navigation Pills */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-slate-500 text-[11px] font-bold">POPULAR HUBS:</span>
          {popularStations.map((stn) => (
            <button
              key={stn.code}
              type="button"
              onClick={() => {
                setSourceStation(stn.code);
                setLiveStationCode(stn.code);
                router.push(`/station/${stn.code}`);
              }}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all flex items-center space-x-1"
            >
              <span className="font-black text-[#082b4c]">{stn.code}</span>
              <span className="text-[10px] text-slate-500 font-sans">{stn.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Popular Featured Trains Grid */}
        <div className="pt-3 border-t border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#082b4c] uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-[#ea580c]" />
              <span>FREQUENT HIGH-DENSITY CORRIDOR TRAINS</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">Click to inspect live ETA</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {popularTrains.map((tr) => {
              const isSelected = selectedTrainId === tr.id;
              return (
                <button
                  key={tr.id}
                  onClick={() => {
                    if (onSelectTrain) {
                      onSelectTrain(tr.id);
                    } else {
                      router.push(`/train/${tr.id}`);
                    }
                  }}
                  className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-orange-50 border-[#ea580c] shadow-sm'
                      : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className={`font-black ${isSelected ? 'text-[#ea580c]' : 'text-[#082b4c]'}`}>{tr.id}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-sans border border-slate-200">{tr.type.slice(0, 3)}</span>
                    </div>
                    <div className="text-[11px] font-bold text-slate-800 truncate mt-0.5">{tr.name}</div>
                  </div>
                  <div className="mt-2 pt-1 border-t border-slate-100 text-[9px] text-slate-500 font-mono flex items-center justify-between">
                    <span>{tr.from} → {tr.to}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
