import { Client, MetaCampaign, Transaction } from './types';

// A lista inicial de clientes nasce totalmente vazia ([]), pronta para exibir apenas clientes reais cadastrados
export const mockClients: Client[] = [];
export const initialClients: Client[] = [];

export const mockTransactions: Transaction[] = [];

export const initialTransactions: Transaction[] = mockTransactions;

export const mockMetaCampaigns: MetaCampaign[] = [
  {
    id: 'cmp_101',
    name: '[ESCALA] CBO — Conversao Checkout — Brasil',
    status: 'ACTIVE',
    spend: 1840.5,
    impressions: 48920,
    clicks: 1420,
    ctr: 2.9,
    cpc: 1.3,
    conversions: 42,
    costPerConversion: 43.82,
    roas: 4.82,
    adAccountId: 'act_389201948',
  },
  {
    id: 'cmp_102',
    name: '[REMARKETING] Stories + Reels 7D Interagiram',
    status: 'ACTIVE',
    spend: 420.0,
    impressions: 12400,
    clicks: 480,
    ctr: 3.87,
    cpc: 0.87,
    conversions: 18,
    costPerConversion: 23.33,
    roas: 6.45,
    adAccountId: 'act_389201948',
  },
];

export const mockDailyTrends = [
  { date: '11/09', sales: 18, revenue: 2140, spend: 480, roas: 4.45 },
  { date: '12/09', sales: 22, revenue: 2890, spend: 520, roas: 5.55 },
  { date: '13/09', sales: 15, revenue: 1780, spend: 490, roas: 3.63 },
  { date: '14/09', sales: 29, revenue: 3820, spend: 610, roas: 6.26 },
  { date: '15/09', sales: 31, revenue: 4120, spend: 680, roas: 6.05 },
  { date: '16/09', sales: 26, revenue: 3490, spend: 590, roas: 5.91 },
  { date: '17/09', sales: 34, revenue: 4680, spend: 710, roas: 6.59 },
];
