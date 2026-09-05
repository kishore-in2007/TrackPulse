import { NextRequest, NextResponse } from 'next/server';
import { analyzeStationNetwork } from '@/lib/propagation/propagation_engine';

export async function POST(request: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const stationId = body.station_id || body.station || 'MAS';
    const timeWindow = body.time_window_minutes || 120;
    const delayOverrides = body.delay_overrides || {};

    const response = analyzeStationNetwork(stationId, {
      timeWindowMinutes: timeWindow,
      delayOverrides: delayOverrides
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error in /api/network/analyze:', error);
    return NextResponse.json(
      { error: 'Internal server error analyzing station network', message: error?.message },
      { status: 500 }
    );
  }
}
