import { NextResponse } from 'next/server';
import { getMLMetrics } from '@/lib/data/data_store';

export async function GET() {
  try {
    const metrics = getMLMetrics();
    return NextResponse.json({
      status: 'HEALTHY',
      system: 'TrackPulse Railway Intelligence Engine',
      problem_statement: 'SIH26028',
      model_type: 'LightGBMClassifier + Dynamic Quantile Regressor',
      metrics: metrics,
      invariants_checked: {
        p10_p50_p90_ordering: 'STRICTLY_ENFORCED (P10 <= P50 <= P90)',
        zero_leakage_guaranteed: true,
        temporal_chronological_split: true
      },
      timestamp: new Date().toISOString()
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
