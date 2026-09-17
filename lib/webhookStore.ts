import { Transaction } from './types';

let webhookLogs: any[] = [
  {
    id: 'GRN-982019',
    receivedAt: '17/09/2026 13:45:10',
    event: 'venda_aprovada',
    amount: 197.0,
    paymentMethod: 'PIX',
    buyerName: 'Fernando Alcantara',
    clientId: 'cli_01',
  },
  {
    id: 'GRN-982018',
    receivedAt: '17/09/2026 13:32:44',
    event: 'venda_aprovada',
    amount: 97.0,
    paymentMethod: 'CARTAO',
    buyerName: 'Juliana Costa',
    clientId: 'cli_01',
  },
  {
    id: 'GRN-982017',
    receivedAt: '17/09/2026 13:18:02',
    event: 'carrinho_abandonado',
    amount: 147.0,
    paymentMethod: 'CARTAO',
    buyerName: 'Lucas Pedrosa',
    clientId: 'cli_02',
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
  {
    id: 'GRN-982017',
    amount: 147.0,
    status: 'ABANDONADO',
    paymentMethod: 'CARTAO',
    buyerName: 'Lucas Pedrosa',
    buyerEmail: 'pedrosa.lucas@outlook.com',
    productName: 'Checkup Financeiro Completo',
    timestamp: 'Há 32 minutos',
    utmSource: 'instagram',
    utmCampaign: 'retargeting_stories',
    utmContent: 'stories_urgencia',
    hasOrderbump: true,
    clientId: 'cli_02',
  },
  {
    id: 'GRN-982016',
    amount: 97.0,
    status: 'PENDENTE',
    paymentMethod: 'PIX',
    buyerName: 'Patricia Gomes',
    buyerEmail: 'patricia.gomes@yahoo.com.br',
    productName: 'Checkup Financeiro Completo',
    timestamp: 'Há 45 minutos',
    utmSource: 'facebook',
    utmCampaign: 'broad_sem_filtro',
    utmContent: 'video_chamada_direta',
    hasOrderbump: false,
    clientId: 'cli_01',
  },
];

export function getWebhookLogs() {
  return webhookLogs;
}

export function getWebhookCards() {
  return webhookCards;
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
