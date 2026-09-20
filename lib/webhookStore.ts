import { Transaction, WebhookAuditLog } from './types';

// Tabela de Logs Crus para Auditoria (sd_webhook_logs)
let sd_webhook_logs: WebhookAuditLog[] = [
  {
    id: 'log_982019',
    received_at: '20/09/2026 10:30:15',
    endpoint: '/api/webhook/green',
    client_id: 'cli_01',
    raw_payload: { event: 'venda_aprovada', id: 'GRN-982019', amount: 197.0 },
    headers: { 'x-conectai-client-id': 'cli_01', 'x-webhook-secret': 'whsec_green_9823019847192837' },
    query_params: { client_id: 'cli_01' },
    processed: true,
    status_code: 200,
  },
  {
    id: 'log_982018',
    received_at: '20/09/2026 10:15:02',
    endpoint: '/api/webhook/green',
    client_id: null,
    raw_payload: { event: 'pedido_criado', amount: 67.0 },
    headers: {},
    query_params: {},
    processed: false,
    status_code: 422,
    error_reason: 'Unprocessable Entity: Identificador do cliente não encontrado.',
  },
];

let webhookLogs: any[] = [
  {
    id: 'GRN-982019',
    receivedAt: '20/09/2026 10:30:15',
    event: 'venda_aprovada',
    amount: 197.0,
    paymentMethod: 'PIX',
    buyerName: 'Fernando Alcantara',
    clientId: 'cli_01',
  },
  {
    id: 'GRN-982018',
    receivedAt: '20/09/2026 10:15:02',
    event: 'venda_aprovada',
    amount: 97.0,
    paymentMethod: 'CARTAO',
    buyerName: 'Juliana Costa',
    clientId: 'cli_01',
  },
];

let webhookCards: Transaction[] = [
  {
    id: 'GRN-982019',
    amount: 197.0,
    status: 'APROVADO',
    paymentMethod: 'PIX',
    buyerName: 'Fernando Alcantara',
    buyerEmail: 'fernando.alcantara@email.com',
    productName: 'Checkup Financeiro Completo',
    timestamp: 'Há 5 minutos',
    utmSource: 'facebook',
    utmCampaign: 'cbo_escala_vendas',
    utmContent: 'criativo_v3_depoimento',
    hasOrderbump: true,
    clientId: 'cli_01',
  },
  {
    id: 'GRN-982018',
    amount: 97.0,
    status: 'APROVADO',
    paymentMethod: 'CARTAO',
    buyerName: 'Juliana Costa',
    buyerEmail: 'juliana.costa@gmail.com',
    productName: 'Checkup Financeiro Completo',
    timestamp: 'Há 18 minutos',
    utmSource: 'facebook',
    utmCampaign: 'cbo_escala_vendas',
    utmContent: 'criativo_v1_estatica',
    hasOrderbump: false,
    clientId: 'cli_01',
  },
];

export const DEFAULT_WEBHOOK_SECRET = 'whsec_green_9823019847192837';

/**
 * Grava imediatamente todo payload bruto recebido na tabela sd_webhook_logs.
 * O campo 'processed' inicia OBRIGATORIAMENTE como false.
 */
export function recordRawWebhookLog(data: {
  endpoint: string;
  raw_payload: any;
  headers: Record<string, string>;
  query_params: Record<string, string>;
  client_id?: string | null;
  processed?: boolean;
  status_code?: number;
  error_reason?: string;
}): WebhookAuditLog {
  const newLog: WebhookAuditLog = {
    id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    received_at: new Date().toLocaleString('pt-BR'),
    endpoint: data.endpoint || '/api/webhook/green',
    client_id: data.client_id || null,
    raw_payload: data.raw_payload || {},
    headers: data.headers || {},
    query_params: data.query_params || {},
    processed: data.processed ?? false, // Inicia como false por padrão
    status_code: data.status_code || 500,
    error_reason: data.error_reason,
  };

  sd_webhook_logs = [newLog, ...sd_webhook_logs.slice(0, 99)];
  return newLog;
}

/**
 * Atualiza o status e detalhes do log de auditoria em sd_webhook_logs.
 */
export function updateWebhookAuditLog(logId: string, updates: Partial<WebhookAuditLog>) {
  sd_webhook_logs = sd_webhook_logs.map((log) =>
    log.id === logId ? { ...log, ...updates } : log
  );
}

/**
 * Retorna os logs de auditoria brutos (sd_webhook_logs).
 */
export function getSdWebhookLogs(): WebhookAuditLog[] {
  return sd_webhook_logs;
}

export function getWebhookLogs() {
  return webhookLogs;
}

export function getWebhookCards() {
  return webhookCards;
}

/**
 * O Porteiro: Identifica o cliente obrigatoriamente na seguinte ordem:
 * a) Cabeçalho x-conectai-client-id
 * b) Query string ?client_id= ou ?clientId=
 * c) Propriedade interna no payload (client_id, merchant_id, account_id ou custom_data.clientId)
 */
export function resolveClientId(
  headers: Record<string, string>,
  queryParams: Record<string, string>,
  body: any
): string | null {
  // a) Cabeçalho x-conectai-client-id
  const headerClientId = headers['x-conectai-client-id'] || headers['x-client-id'];
  if (headerClientId && typeof headerClientId === 'string' && headerClientId.trim()) {
    return headerClientId.trim();
  }

  // b) Query string ?client_id= ou ?clientId=
  const queryClientId = queryParams['client_id'] || queryParams['clientId'];
  if (queryClientId && typeof queryClientId === 'string' && queryClientId.trim()) {
    return queryClientId.trim();
  }

  // c) Propriedade interna no payload
  if (body && typeof body === 'object') {
    const bodyClientId =
      body.client_id ||
      body.clientId ||
      body.merchant_id ||
      body.merchantId ||
      body.account_id ||
      body.accountId ||
      body.custom_data?.clientId ||
      body.custom_data?.client_id;

    if (bodyClientId && typeof bodyClientId === 'string' && bodyClientId.trim()) {
      return bodyClientId.trim();
    }
  }

  return null;
}

/**
 * Extrai a chave secreta enviada no cabeçalho x-webhook-secret ou query ?secret=
 */
export function getProvidedSecret(
  headers: Record<string, string>,
  queryParams: Record<string, string>
): string | null {
  const headerSecret =
    headers['x-webhook-secret'] ||
    headers['x-green-secret'] ||
    headers['x-secret-token'];
  if (headerSecret && typeof headerSecret === 'string' && headerSecret.trim()) {
    return headerSecret.trim();
  }

  const querySecret =
    queryParams['secret'] ||
    queryParams['webhook_secret'] ||
    queryParams['token'];
  if (querySecret && typeof querySecret === 'string' && querySecret.trim()) {
    return querySecret.trim();
  }

  return null;
}

export function processGreenWebhookPayload(payload: any, clientIdParam?: string | null) {
  const event = payload.event || 'venda_aprovada';
  const codeId = payload.id || `GRN-${Math.floor(100000 + Math.random() * 900000)}`;
  const amount = parseFloat(payload.amount || payload.price || 97.0);
  const paymentMethod = (payload.payment_method || 'PIX').toUpperCase();
  const buyerName = payload.buyer?.name || 'Cliente Green Gateway';
  const buyerEmail = payload.buyer?.email || 'cliente@green.com.br';
  const productName = payload.product?.name || 'Checkup Financeiro Completo';
  const customData = payload.custom_data || {};
  const targetClientId = clientIdParam || customData.clientId || 'cli_01';

  let status: any = 'APROVADO';
  if (event === 'pedido_criado' || payload.status === 'PENDENTE') {
    status = 'PENDENTE';
  } else if (event === 'carrinho_abandonado' || payload.status === 'ABANDONADO') {
    status = 'ABANDONADO';
  } else if (event === 'venda_reembolsada' || payload.status === 'CANCELADO') {
    status = 'CANCELADO';
  }

  const newLog = {
    id: codeId,
    receivedAt: new Date().toLocaleString('pt-BR'),
    event,
    amount,
    paymentMethod,
    buyerName,
    clientId: targetClientId,
  };

  webhookLogs = [newLog, ...webhookLogs.slice(0, 49)];

  const newTx: Transaction = {
    id: codeId,
    amount,
    status,
    paymentMethod: paymentMethod as any,
    buyerName,
    buyerEmail,
    productName,
    timestamp: 'Agora mesmo',
    utmSource: customData.utm_source || 'facebook',
    utmCampaign: customData.utm_campaign || 'cbo_direto',
    utmContent: customData.utm_content || 'criativo_green',
    hasOrderbump: amount > 97.0,
    clientId: targetClientId,
  };

  webhookCards = [newTx, ...webhookCards];

  return {
    success: true,
    message: `Webhook Green (${event}) processado com sucesso!`,
    transaction: newTx,
  };
}
