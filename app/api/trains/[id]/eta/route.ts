import { NextRequest, NextResponse } from 'next/server';
import { calculateDynamicETA } from '@/lib/eta/dynamic_eta_engine';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const trainId = params.id;
    if (!trainId) {
      return NextResponse.json({ error: 'Missing train id parameter' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const delayParam = searchParams.get('delay');
    const stationParam = searchParams.get('station');
    const timeParam = searchParams.get('time');
    const modeParam = searchParams.get('mode') as any;

    const etaResponse = calculateDynamicETA(trainId, {
      overrideCurrentDelay: delayParam !== null ? parseInt(delayParam, 10) : undefined,
      overrideCurrentStation: stationParam || undefined,
      simulatedCurrentTime: timeParam || undefined,
      dataMode: modeParam || 'DEMO'
    });

    return NextResponse.json(etaResponse, { status: 200 });
  } catch (error: any) {
    console.error('Error in /api/trains/[id]/eta:', error?.stack || error);
    return NextResponse.json(
      { error: 'Internal server error calculating Dynamic ETA', message: error?.message, stack: error?.stack },
      { status: 500 }
    );
  }
}
