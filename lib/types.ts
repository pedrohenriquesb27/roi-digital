export type TransactionStatus = 'APROVADO' | 'PENDENTE' | 'ABANDONADO' | 'CANCELADO';
export type PaymentMethod = 'PIX' | 'CARTAO' | 'BOLETO';

export interface Transaction {
  id: string;
  amount: number;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  buyerName: string;
  buyerEmail: string;
  productName: string;
  timestamp: string;
  utmSource?: string;
  utmCampaign?: string;
  utmContent?: string;
  hasOrderbump?: boolean;
  clientId?: string;
}

export interface Client {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  adAccountId?: string;
  metaAccessToken?: string;
  pixelId?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  hoursWithoutSales?: number;
  totalSalesCount?: number;
  totalRevenue?: number;
}

export interface MetaCampaign {
  id: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  conversions: number;
  costPerConversion: number;
  roas: number;
  adAccountId?: string;
}

export interface MetaApiConfig {
  accessToken: string;
  adAccountId: string;
  pixelId: string;
  isConnected: boolean;
}

export interface WebhookLog {
  id: string;
  receivedAt: string;
  payload: any;
  event: string;
  amount: number;
  paymentMethod: string;
  buyerName: string;
  clientId?: string;
}

export type PeriodFilter = 'hoje' | '7dias' | '30dias' | 'este_mes';

export interface NotificationAlert {
  id: string;
  title: string;
  description: string;
  category: 'CONVERSION' | 'CPA' | 'INTEGRATION' | 'INACTIVITY';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  timestamp: string;
  isRead: boolean;
  actionLabel?: string;
  targetTab?: string;
}
