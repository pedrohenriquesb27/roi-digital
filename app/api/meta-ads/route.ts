import { NextResponse } from 'next/server';
import { handleMetaAdsApiRequest } from '../../../lib/metaAdsService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await handleMetaAdsApiRequest(body);
    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Erro interno no servidor de anúncios: ' + err.message },
      { status: 500 }
    );
  }
}
