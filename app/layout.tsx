import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import GlobalStatusBar from '@/components/GlobalStatusBar';
import Providers from '@/components/Providers';
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
    <html lang="en">
      <body className="min-h-screen bg-slate-100 text-slate-800 flex flex-col antialiased selection:bg-blue-600 selection:text-white">
        <Providers>
          <GlobalStatusBar />
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
        </Providers>
        <footer className="bg-white border-t border-slate-200 py-6 mt-auto text-slate-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-[#082b4c]">TRACKPULSE v1.0.0</span>
                <span>•</span>
                <span className="font-semibold text-slate-700">Smart India Hackathon SIH26028</span>
                <span>•</span>
                <span className="font-bold text-[#ea580c]">Ministry of Railways, Government of India</span>
              </div>
              <div className="text-slate-500 font-mono text-[11px]">
                Official National Prototype • CRIS / NTES Dynamic Telemetry Integrated
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 gap-2">
              <div>
                Designed & developed strictly in compliance with Indian Railway e-Governance and GIGW Accessibility Standards.
              </div>
              <div className="font-mono">
                Model: Zero-Leakage LightGBM GBDT + Dynamic Sectional Quantile Regressor
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
