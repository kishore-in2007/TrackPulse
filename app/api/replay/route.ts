import { NextRequest, NextResponse } from 'next/server';
import { ReplayEngine } from '@/lib/replay/replay_engine';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const step = parseInt(searchParams.get('step') || '0', 10);
    const playing = searchParams.get('playing') === 'true';
    const speed = parseFloat(searchParams.get('speed') || '1');

    const state = ReplayEngine.getReplayState(step, playing, speed);
    return NextResponse.json(state, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/replay:', error);
    return NextResponse.json(
      { error: 'Internal server error fetching replay state', message: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const step = parseInt(body.step || '0', 10);
    const playing = body.playing === true;
    const speed = parseFloat(body.speed || '1');

    const state = ReplayEngine.getReplayState(step, playing, speed);
    return NextResponse.json(state, { status: 200 });
  } catch (error: any) {
    console.error('Error in POST /api/replay:', error);
    return NextResponse.json(
      { error: 'Internal server error updating replay step', message: error?.message },
      { status: 500 }
    );
  }
}
