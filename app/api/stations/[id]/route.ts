import { NextRequest, NextResponse } from 'next/server';
import { getStation, getAllStations } from '@/lib/data/data_store';
import { analyzeStationNetwork } from '@/lib/propagation/propagation_engine';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const stationId = params.id?.toUpperCase();
    if (!stationId) {
      return NextResponse.json({ error: 'Missing station id' }, { status: 400 });
    }

    if (stationId === 'ALL') {
      const all = getAllStations();
      return NextResponse.json(all, { status: 200 });
    }

    const station = getStation(stationId);
    if (!station) {
      return NextResponse.json({ error: 'Station not found' }, { status: 404 });
    }

    const traffic = analyzeStationNetwork(stationId);
    return NextResponse.json({
      station,
      traffic
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/stations/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error fetching station data', message: error?.message },
      { status: 500 }
    );
  }
}
