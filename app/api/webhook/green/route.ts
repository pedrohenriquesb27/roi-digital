import { NextResponse } from 'next/server';
import {
  recordRawWebhookLog,
  updateWebhookAuditLog,
  resolveClientId,
  getProvidedSecret,
  DEFAULT_WEBHOOK_SECRET,
  processGreenWebhookPayload,
  getSdWebhookLogs,
  getWebhookLogs,
  getWebhookCards,
} from '@/lib/webhookStore';

export async function POST(req: Request) {
  const url = new URL(req.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());

  // Converte cabeçalhos para mapa manipulável em minúsculas
  const headersObj: Record<string, string> = {};
  req.headers.forEach((val, key) => {
    headersObj[key.toLowerCase()] = val;
  });

  let body: any = {};
  let rawText = '';
  try {
    rawText = await req.text();
    if (rawText) {
      body = JSON.parse(rawText);
    }
  } catch (err) {
    body = { rawText };
  }

  // 1. TABELA DE LOGS CRUS (AUDITORIA): Grava imediatamente no sd_webhook_logs com processed = false
  const auditLog = recordRawWebhookLog({
    endpoint: url.pathname,
    raw_payload: body,
    headers: headersObj,
    query_params: queryParams,
    processed: false, // Inicia obrigatoriamente como false
    status_code: 500,
  });

  // 2. O PORTEIRO (IDENTIFICAÇÃO E SEGURANÇA DO CLIENTE)
  // Ordem obrigatória de verificação:
  // a) Cabeçalho x-conectai-client-id
  // b) Query string ?client_id= ou ?clientId=
  // c) Propriedade interna no payload (client_id, merchant_id, account_id, custom_data.clientId)
  const resolvedClientId = resolveClientId(headersObj, queryParams, body);

  if (!resolvedClientId) {
    const errorMsg = 'Unprocessable Entity: Identificador do cliente não encontrado. Envie no cabeçalho x-conectai-client-id, query string ?client_id= ou propriedade interna no payload.';
    updateWebhookAuditLog(auditLog.id, {
      status_code: 422,
      error_reason: errorMsg,
      processed: false,
    });
    return NextResponse.json(
      { success: false, error: errorMsg, code: 422 },
      { status: 422 }
    );
  }

  // Atualiza o client_id identificado no log de auditoria
  updateWebhookAuditLog(auditLog.id, { client_id: resolvedClientId });

  // 3. VALIDAÇÃO DE CHAVE SECRETA (webhook_secret)
  // Exige correspondência com o valor enviado no cabeçalho x-webhook-secret ou query ?secret=
  const providedSecret = getProvidedSecret(headersObj, queryParams);
  const expectedSecret = DEFAULT_WEBHOOK_SECRET;

  if (!providedSecret || providedSecret !== expectedSecret) {
    const errorMsg = 'Unauthorized: Chave secreta de webhook (webhook_secret) inválida ou ausente.';
    updateWebhookAuditLog(auditLog.id, {
      status_code: 401,
      error_reason: errorMsg,
      processed: false,
    });
    return NextResponse.json(
      { success: false, error: errorMsg, code: 401 },
      { status: 401 }
    );
  }

  // 4. RETORNO DE SUCESSO (200 OK) E PROCESSAMENTO
  updateWebhookAuditLog(auditLog.id, {
    status_code: 200,
    processed: true, // Marca como processado com sucesso após todas as validações
  });

  const processResult = processGreenWebhookPayload(body, resolvedClientId);

  return NextResponse.json(
    {
      success: true,
      message: 'Webhook auditado, autenticado e processado com sucesso (200 OK).',
      log_id: auditLog.id,
      client_id: resolvedClientId,
      transaction: processResult.transaction,
    },
    { status: 200 }
  );
}

export async function GET() {
  return NextResponse.json({
    success: true,
    raw_logs: getSdWebhookLogs(),
    logs: getWebhookLogs(),
    cards: getWebhookCards(),
  });
}
