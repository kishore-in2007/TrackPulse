import { NextRequest, NextResponse } from 'next/server';
import { runWhatIfSimulation } from '@/lib/simulation/simulation_engine';
import { SimulationRequest } from '@/lib/types/simulation';

export async function POST(request: NextRequest) {
  try {
    let body: SimulationRequest = {
      train_id: '12675',
      delay_injection_minutes: 30
    };
    try {
      body = await request.json();
    } catch {
      // default
    }

    if (!body.train_id) {
      body.train_id = '12675';
    }
    if (body.delay_injection_minutes === undefined) {
      body.delay_injection_minutes = 30;
    }

    const response = runWhatIfSimulation(body);
    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error in /api/simulate:', error);
    return NextResponse.json(
      { error: 'Internal server error running simulation', message: error?.message },
      { status: 500 }
    );
  }
}
