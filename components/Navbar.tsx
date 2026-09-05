'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Train, Network, GitBranch, MessageSquare, Compass, Activity, Radio, Search, Eye, Globe } from 'lucide-react';
import AccessibilityModal from '@/components/AccessibilityModal';
import { SupportedLanguage } from '@/lib/utils/translations';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('en');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchQuery.trim();
    if (clean) {
      router.push(`/train/${clean}`);
      setSearchQuery('');
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/', icon: Activity },
    { name: 'Train ETA', href: '/train/12675', icon: Train },
    { name: 'Station Board', href: '/station/MAS', icon: Compass },
    { name: 'Network Map', href: '/network', icon: Network },
    { name: 'What-If Simulation', href: '/simulate', icon: GitBranch },
    { name: 'Passenger Planner', href: '/passenger', icon: Compass },
    { name: 'PNR & SMS', href: '/pnr', icon: MessageSquare },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 glass-panel border-b border-white/10 bg-rail-dark/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Brand Logo */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="h-9 w-9 rounded-lg bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 group-hover:bg-sky-500/20 group-hover:border-sky-400/60 transition-all">
                  <Train className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-lg font-bold tracking-wider text-white flex items-center gap-1.5">
                    TRACK<span className="text-sky-400">PULSE</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 block -mt-1 font-mono">
                    SIH26028 • Ministry of Railways
                  </span>
                </div>
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 flex-shrink-0">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href.split('?')[0]));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-2 py-1.5 rounded-md text-xs font-medium flex items-center space-x-1.5 transition-all ${
                      isActive
                        ? 'bg-sky-500/15 text-sky-400 border border-sky-400/30 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Interactive Search Bar for ANY of the 2,810 Indian Railway Trains */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xs relative hidden xl:block">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search train (e.g. 12952)..."
                className="w-full bg-slate-900/90 text-white text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-sky-400 font-mono"
              />
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            </form>

            {/* Language Selector & Accessibility Controls */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {/* Language Dropdown */}
              <div className="relative flex items-center bg-slate-900 rounded-lg border border-slate-700 px-2 py-1 text-xs">
                <Globe className="h-3.5 w-3.5 text-sky-400 mr-1.5" />
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value as SupportedLanguage)}
                  className="bg-transparent text-white font-mono text-[11px] focus:outline-none cursor-pointer"
                >
                  <option value="en" className="bg-slate-900 text-white">EN (English)</option>
                  <option value="hi" className="bg-slate-900 text-white">HI (हिन्दी)</option>
                  <option value="ta" className="bg-slate-900 text-white">TA (தமிழ்)</option>
                  <option value="te" className="bg-slate-900 text-white">TE (తెలుగు)</option>
                  <option value="mr" className="bg-slate-900 text-white">MR (मराठी)</option>
                  <option value="bn" className="bg-slate-900 text-white">BN (বাংলা)</option>
                </select>
              </div>

              {/* Accessibility Button */}
              <button
                onClick={() => setShowAccessibility(true)}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs transition-all"
                title="Accessibility & Audio Announcements"
              >
                <Eye className="h-4 w-4 text-sky-400" />
              </button>

              <Link
                href="/pnr"
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-sm flex items-center space-x-1"
              >
                <Radio className="h-3.5 w-3.5" />
                <span>SMS Keypad</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Accessibility & Voice Settings Modal */}
      <AccessibilityModal
        isOpen={showAccessibility}
        onClose={() => setShowAccessibility(false)}
      />
    </>
  );
}
