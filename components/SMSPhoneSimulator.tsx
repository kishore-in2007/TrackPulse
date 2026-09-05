'use client';

import React, { useState } from 'react';
import { SMSInboundResponse } from '@/lib/types/sms';
import { Send, Smartphone, MessageSquare, ShieldCheck, RefreshCw, Delete, PhoneCall, Radio, CheckCircle } from 'lucide-react';

export default function SMSPhoneSimulator() {
  const [inputMessage, setInputMessage] = useState('PNR 1234567890');
  const [phoneNumber, setPhoneNumber] = useState('+91 98765 43210');
  const [loading, setLoading] = useState(false);
  const [smsHistory, setSmsHistory] = useState<{
    id: number;
    sender: 'user' | 'system';
    text: string;
    timestamp: string;
  }[]>([
    {
      id: 1,
      sender: 'system',
      text: 'TRACKPULSE SMS SERVICE\nSend "PNR <10-digit-number>" for dynamic ETA & connection risk.\nSend "<5-digit-train-number>" for live train status.',
      timestamp: '12:00'
    }
  ]);

  const handleSend = async (customMsg?: string) => {
    const textToSend = customMsg || inputMessage;
    if (!textToSend.trim()) return;

    const userMsgObj = {
      id: Date.now(),
      sender: 'user' as const,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setSmsHistory(prev => [...prev, userMsgObj]);
    if (!customMsg) setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/sms/inbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, sender: phoneNumber })
      });
      const data: SMSInboundResponse = await res.json();

      const systemMsgObj = {
        id: Date.now() + 1,
        sender: 'system' as const,
        text: data.sms_text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setSmsHistory(prev => [...prev, systemMsgObj]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeypadPress = (val: string) => {
    setInputMessage(prev => prev + val);
  };

  const handleBackspace = () => {
    setInputMessage(prev => prev.slice(0, -1));
  };

  const keypadKeys = [
    { num: '1', letters: '. , !' },
    { num: '2', letters: 'A B C' },
    { num: '3', letters: 'D E F' },
    { num: '4', letters: 'G H I' },
    { num: '5', letters: 'J K L' },
    { num: '6', letters: 'M N O' },
    { num: '7', letters: 'P Q R S' },
    { num: '8', letters: 'T U V' },
    { num: '9', letters: 'W X Y Z' },
    { num: '*', letters: 'PNR' },
    { num: '0', letters: 'SPACE' },
    { num: '#', letters: 'TRAIN' },
  ];

  const sampleQueries = [
    { label: 'Demo PNR 1 (Kovai Exp)', query: 'PNR 1234567890' },
    { label: 'Demo PNR 2 (Shatabdi)', query: 'PNR 9876543210' },
    { label: 'Any Keypad Number', query: 'PNR 7845129630' },
    { label: 'Train 12675', query: '12675' },
    { label: 'Train 12622 (TN Exp)', query: '12622' },
    { label: 'Station MAS', query: 'STN MAS' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Explanatory & Telephony Integration Specs */}
      <div className="lg:col-span-6 space-y-6">
        <div className="glass-panel rounded-xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Smartphone className="h-5 w-5" />
            <h2 className="text-lg font-bold text-white">Live Physical & Virtual Keypad Gateway</h2>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            The TrackPulse SMS Gateway accepts queries from <strong>any phone number or keypad</strong>. It works via standard SMS short-codes (<span className="text-white font-mono">139</span>) and standard carrier HTTP webhooks (Twilio / Fast2SMS / Textlocal).
          </p>

          <div className="p-3.5 bg-slate-900/80 rounded-lg border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4" />
                UNIVERSAL KEYPAD SUPPORT
              </span>
              <span className="text-slate-400">TwiML / JSON Ready</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Accepts 10-digit PNRs, 4/5-digit Train Numbers, or station codes. Use the tactile phone keypad on the right or type directly from any physical keyboard.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <label className="text-slate-400 uppercase">Simulated Mobile Number / Sender ID:</label>
            </div>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-slate-900 text-emerald-400 font-mono text-xs px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 font-mono">
              Instant Keypad Shortcuts:
            </h4>
            <div className="flex flex-wrap gap-2">
              {sampleQueries.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputMessage(s.query);
                    handleSend(s.query);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all text-left"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Simulated Feature Phone Frame with Tactile Keypad */}
      <div className="lg:col-span-6 flex justify-center">
        <div className="w-full max-w-sm bg-slate-950 rounded-[2.5rem] p-4 shadow-2xl border-4 border-slate-800 relative">
          {/* Speaker / Earpiece */}
          <div className="h-3 w-20 bg-slate-800 rounded-full mx-auto mb-3 flex items-center justify-center">
            <div className="h-1 w-10 bg-slate-900 rounded-full" />
          </div>

          {/* LCD Screen Display */}
          <div className="bg-slate-900 rounded-2xl h-72 flex flex-col overflow-hidden border border-slate-800 shadow-inner">
            {/* Carrier Status Bar */}
            <div className="bg-slate-800/90 px-3 py-1.5 flex items-center justify-between border-b border-white/5 text-[10px] font-mono text-slate-300">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Radio className="h-2.5 w-2.5 animate-pulse" />
                IR-TELECOM
              </span>
              <span>139 SMS GATEWAY</span>
            </div>

            {/* Message Feed */}
            <div className="flex-1 p-3 space-y-2.5 overflow-y-auto font-sans text-xs">
              {smsHistory.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[90%] rounded-xl px-3 py-1.5 whitespace-pre-wrap leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-emerald-600 text-white font-mono text-[11px]'
                        : 'bg-slate-800 text-slate-200 border border-white/10 font-mono text-[10px]'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[8px] text-slate-500 mt-0.5 px-1 font-mono">{m.timestamp}</span>
                </div>
              ))}
              {loading && (
                <div className="flex items-center space-x-1 text-slate-500 text-[10px] italic px-2 font-mono">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  <span>Processing dynamic carrier response...</span>
                </div>
              )}
            </div>

            {/* Input Line Display */}
            <div className="p-2 bg-slate-950 border-t border-white/5 flex items-center space-x-1.5">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type or use keypad..."
                className="flex-1 bg-transparent text-emerald-400 text-xs px-2 py-1 focus:outline-none font-mono"
              />
              <button
                onClick={handleBackspace}
                className="p-1 text-slate-400 hover:text-white"
                title="Backspace"
              >
                <Delete className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Action Row: Send / Call Button */}
          <div className="grid grid-cols-2 gap-2 my-2.5">
            <button
              onClick={() => handleSend()}
              disabled={loading || !inputMessage.trim()}
              className="py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-1 shadow font-mono transition-all"
            >
              <Send className="h-3.5 w-3.5" />
              <span>SEND SMS</span>
            </button>
            <button
              onClick={() => {
                setInputMessage('');
              }}
              className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center space-x-1 border border-slate-700 font-mono transition-all"
            >
              <span>CLEAR</span>
            </button>
          </div>

          {/* Hardware Tactile Numeric Keypad (12 Keys) */}
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {keypadKeys.map((k) => (
              <button
                key={k.num}
                onClick={() => {
                  if (k.num === '*') handleKeypadPress('PNR ');
                  else if (k.num === '#') handleKeypadPress('');
                  else if (k.num === '0') handleKeypadPress('0');
                  else handleKeypadPress(k.num);
                }}
                className="bg-slate-900 hover:bg-slate-800 active:bg-emerald-950 border border-slate-800 rounded-xl py-2 flex flex-col items-center justify-center transition-all group"
              >
                <span className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 font-mono leading-tight">
                  {k.num}
                </span>
                <span className="text-[8px] text-slate-400 group-hover:text-slate-200 font-mono uppercase tracking-widest">
                  {k.letters}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
