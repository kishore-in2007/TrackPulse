'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Train, Network, GitBranch, MessageSquare, Compass, Activity, Radio, Search, Eye, Globe, Brain, Menu, X } from 'lucide-react';
import AccessibilityModal from '@/components/AccessibilityModal';
import { SupportedLanguage } from '@/lib/utils/translations';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchQuery.trim();
    if (clean) {
      router.push(`/train/${clean}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
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
    { name: 'AI Model', href: '/ml', icon: Brain },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#082b4c] border-b-2 border-[#ea580c] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
            {/* Brand Logo */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-[#ff9933] group-hover:bg-[#ea580c] group-hover:text-white transition-all shadow-inner">
                  <Train className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <span className="text-base sm:text-lg font-black tracking-wider text-white flex items-center gap-1">
                    TRACK<span className="text-[#ff9933]">PULSE</span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-300 block -mt-1 font-mono">
                    SIH26028 • Ministry of Railways
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 flex-shrink-0">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href.split('?')[0]));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-2 xl:px-2.5 py-1.5 rounded-md text-[11px] xl:text-xs font-semibold flex items-center space-x-1 transition-all ${
                      isActive
                        ? 'bg-[#ea580c] text-white shadow-sm'
                        : 'text-slate-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                    <span className="whitespace-nowrap">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Interactive Search Bar for ANY of the 2,810 Indian Railway Trains */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xs relative hidden 2xl:block">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search train (e.g. 12952)..."
                className="w-full bg-white/15 text-white placeholder:text-slate-300 text-xs pl-8 pr-3 py-1.5 rounded-lg border border-white/20 focus:outline-none focus:bg-white focus:text-slate-900 focus:placeholder:text-slate-400 font-mono transition-colors"
              />
              <Search className="h-3.5 w-3.5 text-slate-300 absolute left-2.5 top-2.5 pointer-events-none" />
            </form>

            {/* Language Selector & Accessibility Controls */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
              {/* Language Dropdown */}
              <div className="relative hidden sm:flex items-center bg-[#0b3b60] rounded-lg border border-white/20 px-2 py-1 text-xs">
                <Globe className="h-3.5 w-3.5 text-[#ff9933] mr-1.5" />
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value as SupportedLanguage)}
                  className="bg-transparent text-white font-mono text-[11px] focus:outline-none cursor-pointer"
                >
                  <option value="en" className="bg-[#082b4c] text-white">EN (English)</option>
                  <option value="hi" className="bg-[#082b4c] text-white">HI (हिन्दी)</option>
                  <option value="ta" className="bg-[#082b4c] text-white">TA (தமிழ்)</option>
                  <option value="te" className="bg-[#082b4c] text-white">TE (తెలుగు)</option>
                  <option value="mr" className="bg-[#082b4c] text-white">MR (मराठी)</option>
                  <option value="bn" className="bg-[#082b4c] text-white">BN (বাংলা)</option>
                </select>
              </div>

              {/* Accessibility Button */}
              <button
                onClick={() => setShowAccessibility(true)}
                className="p-1.5 rounded-lg bg-[#0b3b60] hover:bg-[#0f4b7a] text-white border border-white/20 text-xs transition-all"
                title="Accessibility & Audio Announcements"
              >
                <Eye className="h-4 w-4 text-[#ff9933]" />
              </button>

              <Link
                href="/pnr"
                className="px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm flex items-center space-x-1"
              >
                <Radio className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">SMS Keypad</span>
                <span className="sm:hidden">SMS</span>
              </Link>

              {/* Mobile Menu Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-lg bg-[#0b3b60] hover:bg-[#0f4b7a] text-white border border-white/20 lg:hidden transition-all"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5 text-[#ff9933]" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#082b4c] border-t border-white/10 px-4 py-3 space-y-3">
            {/* Mobile Train Search Form */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search train (e.g. 12952, Kovai)..."
                className="w-full bg-white/15 text-white placeholder:text-slate-300 text-xs pl-8 pr-3 py-2 rounded-lg border border-white/20 focus:outline-none focus:bg-white focus:text-slate-900 font-mono"
              />
              <Search className="h-3.5 w-3.5 text-slate-300 absolute left-2.5 top-2.5 pointer-events-none" />
            </form>

            {/* Mobile Nav Links Grid */}
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href.split('?')[0]));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all ${
                      isActive
                        ? 'bg-[#ea580c] text-white shadow-sm'
                        : 'bg-white/5 text-slate-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Language Selector */}
            <div className="sm:hidden pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-300 text-xs font-mono">Language:</span>
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value as SupportedLanguage)}
                className="bg-[#0b3b60] text-white font-mono text-xs px-2 py-1 rounded border border-white/20"
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिन्दी (HI)</option>
                <option value="ta">தமிழ் (TA)</option>
                <option value="te">తెలుగు (TE)</option>
                <option value="mr">मराठी (MR)</option>
                <option value="bn">বাংলা (BN)</option>
              </select>
            </div>
          </div>
        )}
      </header>

      {/* Accessibility & Voice Settings Modal */}
      <AccessibilityModal
        isOpen={showAccessibility}
        onClose={() => setShowAccessibility(false)}
      />
    </>
  );
}
