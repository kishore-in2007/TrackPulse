import { NextRequest, NextResponse } from 'next/server';
import { recommendTrains } from '@/lib/recommendation/recommendation_engine';
import { RecommendationRequest } from '@/lib/types/recommendation';

export async function POST(request: NextRequest) {
  try {
    let body: RecommendationRequest = {
      source: 'MAS',
      destination: 'CBE'
    };
    try {
      body = await request.json();
    } catch {
      // default
    }

    const response = recommendTrains(body);
    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error in /api/recommend:', error);
    return NextResponse.json(
      { error: 'Internal server error processing recommendation', message: error?.message },
      { status: 500 }
    );
  }
}
