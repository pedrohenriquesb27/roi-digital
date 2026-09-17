import { NextResponse } from 'next/server';
import {
  processGreenWebhookPayload,
  getWebhookLogs,
  getWebhookCards,
} from '@/lib/webhookStore';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId') || body?.custom_data?.clientId;

    const result = processGreenWebhookPayload(body, clientId);
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    logs: getWebhookLogs(),
    cards: getWebhookCards(),
  });
}
