import { NextRequest, NextResponse } from 'next/server';
import { MockSMSProvider } from '@/lib/sms/sms_adapter';
import { SMSInboundRequest } from '@/lib/types/sms';

export async function POST(request: NextRequest) {
  try {
    let message = '';
    let sender = '9876543210';
    const contentType = request.headers.get('content-type') || '';

    // Handle Twilio / SMS Gateway URL-encoded form submissions
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      message = (formData.get('Body') || formData.get('message') || formData.get('text') || '').toString();
      sender = (formData.get('From') || formData.get('sender') || formData.get('from') || '9876543210').toString();
    } else {
      // Handle JSON body
      try {
        const body = await request.json();
        message = body.message || body.Body || body.text || '';
        sender = body.sender || body.From || '9876543210';
      } catch {
        message = 'PNR 1234567890';
      }
    }

    if (!message) {
      message = 'PNR 1234567890';
    }

    const response = MockSMSProvider.processInboundSMS({ message, sender });

    // Check if client requested XML / TwiML response (Twilio Webhook)
    const accept = request.headers.get('accept') || '';
    const { searchParams } = new URL(request.url);
    const wantsXml = accept.includes('xml') || searchParams.get('format') === 'xml';

    if (wantsXml) {
      const xml = MockSMSProvider.generateTwiML(response.sms_text);
      return new NextResponse(xml, {
        status: 200,
        headers: { 'Content-Type': 'application/xml' }
      });
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error in /api/sms/inbound:', error);
    return NextResponse.json(
      { error: 'Internal server error processing SMS inbound message', message: error?.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const message = searchParams.get('message') || searchParams.get('Body') || 'PNR 1234567890';
  const sender = searchParams.get('sender') || searchParams.get('From') || '9876543210';
  
  const response = MockSMSProvider.processInboundSMS({ message, sender });
  return NextResponse.json(response, { status: 200 });
}
