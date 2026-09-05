import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import GlobalStatusBar from '@/components/GlobalStatusBar';
import './globals.css';

export const metadata: Metadata = {
  title: 'TrackPulse — Dynamic Forecast of Expected Time of Arrival (ETA) for Coaching Trains',
  description: 'SIH26028 Ministry of Railways Prototype: Dynamic ETA forecasting, uncertainty bounds (P10/P50/P90), multi-train delay propagation, passenger recommendations, what-if simulations, and SMS adapters.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-rail-dark text-slate-100 flex flex-col antialiased selection:bg-sky-500 selection:text-black">
        <GlobalStatusBar />
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="glass-panel border-t border-white/5 py-4 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-300">TRACKPULSE v1.0.0</span>
              <span>•</span>
              <span>Smart India Hackathon SIH26028</span>
              <span>•</span>
              <span className="text-sky-400">Ministry of Railways</span>
            </div>
            <div className="text-slate-400 font-mono text-[11px]">
              Hybrid Sectional & LightGBM Machine Learning Pipeline (Zero Leakage)
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
