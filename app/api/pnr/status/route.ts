import { NextRequest, NextResponse } from 'next/server';
import { MockPNRProvider } from '@/lib/pnr/pnr_provider';

export async function POST(request: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const pnr = body.pnr ? String(body.pnr).trim() : '1234567890';
    const status = MockPNRProvider.getPNRStatus(pnr);

    if (!status) {
      return NextResponse.json(
        {
          error: 'PNR record not found',
          message: 'The requested PNR does not exist in the prototype database. Try sample demo PNRs: 1234567890, 9876543210, or 4567890123.'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(status, { status: 200 });
  } catch (error: any) {
    console.error('Error in /api/pnr/status:', error);
    return NextResponse.json(
      { error: 'Internal server error looking up PNR', message: error?.message },
      { status: 500 }
    );
  }
}
