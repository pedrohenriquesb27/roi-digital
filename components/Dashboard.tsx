'use client';

import React, { useState, useEffect } from 'react';
import {
  initialTransactions,
  mockMetaCampaigns,
  mockDailyTrends,
  initialClients,
} from '../lib/mockData';
import {
  Transaction,
  PeriodFilter,
  MetaApiConfig,
  Client,
  NotificationAlert,
} from '../lib/types';
import Sidebar, { NavTabId } from './Sidebar';
import MetricCard from './MetricCard';
import TrendChart from './TrendChart';
import MetaAdsSection from './MetaAdsSection';
import TransactionsTable from './TransactionsTable';
import ClientsSection from './ClientsSection';
import ConversionFunnel from './ConversionFunnel';
import GreenWebhookTab from './GreenWebhookTab';
import KanbanBoard from './KanbanBoard';
import SalesReportTab from './SalesReportTab';
import ScaleSimulatorTab from './ScaleSimulatorTab';
import NotificationCenter from './NotificationCenter';
import LoginScreen from './LoginScreen';
import SplashScreen from './SplashScreen';
import ApiConfigModal from './ApiConfigModal';
import RoiLogo from './RoiLogo';
import GreenSimulatorModal from './GreenSimulatorModal';
import {
  ShoppingBag,
  Clock,
  XCircle,
  PlusCircle,
  DollarSign,
  Receipt,
  Target,
  TrendingUp,
  Sliders,
  Calendar,
  Zap,
  Activity,
  BarChart2,
  ListFilter,
  Key,
  Users,
  Building2,
  AlertTriangle,
  Bell,
} from 'lucide-react';

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<NavTabId>('overview');
  const [period, setPeriod] = useState<PeriodFilter>('30dias');
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  useEffect(() => {
    const authSession = localStorage.getItem('roi_digital_authenticated');
    if (authSession === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Sync transactions live from Webhook API (/api/webhook/green)
  useEffect(() => {
    const fetchWebhookTransactions = async () => {
      try {
        const res = await fetch('/api/webhook/green');
        if (res.ok) {
          const data = await res.json();
          if (data.transactions && Array.isArray(data.transactions) && data.transactions.length > 0) {
            setTransactions((prevTx) => {
              const webhookTxs: Transaction[] = data.transactions;
              const map = new Map<string, Transaction>();
              webhookTxs.forEach((t) => map.set(t.id, t));
              prevTx.forEach((t) => {
                if (!map.has(t.id)) {
                  map.set(t.id, t);
                }
              });
              return Array.from(map.values());
            });
          }
        }
      } catch (err) {
        console.error('[Dashboard Webhook Sync Error]:', err);
      }
    };

    fetchWebhookTransactions();
    const timer = setInterval(fetchWebhookTransactions, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleLoginSuccess = () => {
    setShowSplash(true);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('roi_digital_authenticated');
    localStorage.removeItem('roi_digital_user_email');
    setIsAuthenticated(false);
    setShowSplash(true);
  };

  const [alerts, setAlerts] = useState<NotificationAlert[]>([
    {
      id: 'alt_01',
      title: 'Queda na Conversão do Checkout',
      description: 'A taxa de conversão do checkout caiu para 2.4% no período recente (Média esperada: >4.5%). Recomenda-se verificar estabilidade do checkout.',
      category: 'CONVERSION',
      severity: 'CRITICAL',
      timestamp: 'Há 12 minutos',
      isRead: false,
      actionLabel: 'Ver no Funil',
      targetTab: 'overview',
    },
    {
      id: 'alt_02',
      title: 'CPA Elevado em Campanha Meta Ads',
      description: 'Campanha "CBO - Vendas Públicos Frios" atingiu CPA de R$ 85,20 (Limite recomendado da conta: R$ 45,00 por aquisição).',
      category: 'CPA',
      severity: 'WARNING',
      timestamp: 'Há 45 minutos',
      isRead: false,
      actionLabel: 'Analisar Anúncios',
      targetTab: 'meta',
    },
    {
      id: 'alt_03',
      title: 'Status Webhook Green 100% Ativo',
      description: 'Conexão via Webhook respondendo 200 OK sem falhas nos últimos 150 eventos recebidos.',
      category: 'INTEGRATION',
      severity: 'INFO',
      timestamp: 'Há 2 horas',
      isRead: true,
      actionLabel: 'Ver Webhook',
      targetTab: 'webhook',
    },
    {
      id: 'alt_04',
      title: 'Atenção: Nenhuma nova venda em 24h',
      description: 'Não foram registradas novas vendas aprovadas via webhook nas últimas 26 horas para o cliente ativo.',
      category: 'INACTIVITY',
      severity: 'WARNING',
      timestamp: 'Há 3 horas',
      isRead: false,
      actionLabel: 'Verificar Campanhas',
      targetTab: 'meta',
    },
  ]);

  const [metaConfig, setMetaConfig] = useState<MetaApiConfig>({
    accessToken: 'EAAG982301984719283719238',
    adAccountId: 'act_389201948',
    pixelId: '98201948102',
    isConnected: true,
  });

  // Filter transactions by selected client if any
  const displayedTransactions = selectedClientId
    ? transactions.filter((t) => t.clientId === selectedClientId)
    : transactions;

  // Calculate top metrics dynamically from transactions state
  const approvedTransactions = displayedTransactions.filter((t) => t.status === 'APROVADO');
  const pendingTransactions = displayedTransactions.filter((t) => t.status === 'PENDENTE');
  const abandonedTransactions = displayedTransactions.filter((t) => t.status === 'ABANDONADO');

  const realSalesCount = approvedTransactions.length;
  const realSalesAmount = approvedTransactions.reduce((acc, t) => acc + (t.hasOrderbump ? t.amount - 30 : t.amount), 0);

  const pendingCount = pendingTransactions.length;
  const pendingAmount = pendingTransactions.reduce((acc, t) => acc + t.amount, 0);

  const abandonedCount = abandonedTransactions.length;
  const abandonedAmount = abandonedTransactions.reduce((acc, t) => acc + t.amount, 0);

  const orderbumpTransactions = approvedTransactions.filter((t) => t.hasOrderbump);
  const orderbumpCount = orderbumpTransactions.length;
  const orderbumpAmount = orderbumpCount * 30.00;

  const totalRevenue = approvedTransactions.reduce((acc, t) => acc + t.amount, 0);
  const averageTicket = realSalesCount > 0 ? totalRevenue / realSalesCount : 0;

  const metaAdsSpend = mockMetaCampaigns.reduce((acc, c) => acc + c.spend, 0);
  const netProfit = totalRevenue - metaAdsSpend;
  const roas = metaAdsSpend > 0 ? totalRevenue / metaAdsSpend : 0;

  // Simulated 24h inactivity check (Demonstration mode)
  const hoursSinceLastSale = 26;
  const hasNoSalesAlert = hoursSinceLastSale >= 24 && !isAlertDismissed;

  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleAddClient = (newClient: Client) => {
    setClients((prev) => [...prev, newClient]);
  };

  const handleUpdateClient = (updatedClient: Client) => {
    setClients((prev) => prev.map((c) => (c.id === updatedClient.id ? updatedClient : c)));
  };

  const handleDeleteClient = (clientId: string) => {
    setClients((prev) => prev.filter((c) => c.id !== clientId));
    if (selectedClientId === clientId) {
      setSelectedClientId(null);
    }
  };

  const handleUpdateMetaConfig = (newConfig: Partial<MetaApiConfig>) => {
    setMetaConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  const selectedClientObject = clients.find((c) => c.id === selectedClientId);

  // Notification handlers
  const handleMarkAsRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, isRead: true } : a)));
  };

  const handleMarkAllAsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
  };

  // ROUTE PROTECTION GUARD
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isAuthenticated === false) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 radial-glow-blue radial-glow-cyan pb-16 selection:bg-cyan-500 selection:text-slate-950 flex relative">
      {/* TELa DE ABERTURA / SPLASH SCREEN INTRO */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} durationMs={2000} />}

      {/* MENU LATERAL FIXO (SIDEBAR) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenConfigModal={() => setIsConfigModalOpen(true)}
        clientName={selectedClientObject ? selectedClientObject.name : 'Pedro Silva'}
        onLogout={handleLogout}
      />

      {/* CONTEÚDO PRINCIPAL AO LADO DA SIDEBAR */}
      <div className="flex-1 lg:pl-72 w-full transition-all">
        {/* Topbar Header */}
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 print:hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <RoiLogo variant="horizontal" size="sm" />
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Dashboard Vendas & Meta Ads
              </span>
            </div>

            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
              {/* Client Selector Dropdown */}
              <div className="flex items-center gap-1.5 bg-slate-900 border border-cyan-500/30 rounded-xl px-2.5 py-1.5 text-xs font-semibold">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                <select
                  value={selectedClientId || ''}
                  onChange={(e) => setSelectedClientId(e.target.value || null)}
                  className="bg-transparent text-cyan-300 font-bold border-none focus:ring-0 text-xs cursor-pointer focus:outline-none"
                >
                  <option value="" className="bg-slate-900 text-white">Todos os Clientes</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                      {c.companyName} ({c.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Period Filter Dropdown */}
              <div className="flex items-center gap-1 bg-slate-900 border border-white/10 rounded-xl p-1 text-xs font-medium">
                <Calendar className="w-3.5 h-3.5 text-cyan-400 ml-2" />
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as PeriodFilter)}
                  className="bg-transparent text-slate-200 border-none focus:ring-0 text-xs font-semibold cursor-pointer py-1 pr-3 pl-1 focus:outline-none"
                >
                  <option value="hoje" className="bg-slate-900 text-white">Hoje</option>
                  <option value="7dias" className="bg-slate-900 text-white">Últimos 7 dias</option>
                  <option value="30dias" className="bg-slate-900 text-white">Últimos 30 dias</option>
                  <option value="este_mes" className="bg-slate-900 text-white">Mês Atual</option>
                </select>
              </div>

              {/* Central de Alertas Inteligentes (Notification Bell Button) */}
              <button
                onClick={() => setIsNotificationsOpen(true)}
                className="relative p-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all"
                title="Central de Alertas Inteligentes"
              >
                <Bell className="w-4 h-4 text-cyan-400" />
                {alerts.filter((a) => !a.isRead).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-cyan-400 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-slate-950 animate-pulse">
                    {alerts.filter((a) => !a.isRead).length}
                  </span>
                )}
              </button>

              {/* Settings button */}
              <button
                onClick={() => setIsConfigModalOpen(true)}
                className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-cyan-400/50 transition-all"
                title="Configurações de Conexão API"
              >
                <Sliders className="w-4 h-4 text-cyan-400" />
              </button>

              {/* Simulador de Webhook Green (Sem Ngrok) */}
              <button
                onClick={() => setIsSimulatorOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600/30 via-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 font-bold text-xs shadow-lg shadow-cyan-500/10 transition-all active:scale-95"
                title="Simular disparo de webhook da Green em tempo real (Sem Ngrok)"
              >
                <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="hidden sm:inline">Simulador Green</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content View Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 print:p-0 print:m-0">
          {/* Banner of selected client filter */}
          {selectedClientObject && (
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between text-xs text-cyan-300 print:hidden">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>
                  Filtrando métricas para o cliente: <strong>{selectedClientObject.companyName} ({selectedClientObject.name})</strong>
                </span>
              </div>
              <button
                onClick={() => setSelectedClientId(null)}
                className="text-cyan-400 hover:underline font-bold"
              >
                Limpar Filtro
              </button>
            </div>
          )}

          {/* ⚠️ ALERTA DE ATENÇÃO: NENHUMA VENDA EM 1 DIA (24 HORAS) */}
          {hasNoSalesAlert && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/90 via-amber-900/60 to-rose-950/40 border border-amber-500/50 text-amber-200 text-xs shadow-2xl flex items-start justify-between gap-4 animate-pulse print:hidden">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-amber-300 flex items-center gap-2">
                    ⚠️ ALERTA DE ATENÇÃO: NENHUMA VENDA REGISTRADA HÁ +24 HORAS!
                  </h4>
                  <p className="mt-1 text-slate-300 font-medium">
                    Identificamos que não há nenhuma nova venda aprovada registrada nas últimas <strong>{hoursSinceLastSale} horas</strong> para este cliente/conta.{' '}
                    <span className="text-amber-300 underline font-semibold">Ação recomendada:</span> Verifique se as campanhas do Meta Ads estão pausadas, se o link do checkout da Green está ativo ou se há saldo de orçamento.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAlertDismissed(true)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-amber-900/50 transition-colors"
                title="Dispensar Alerta"
              >
                ✕
              </button>
            </div>
          )}

          {/* TAB 1: VISÃO GERAL / DASHBOARD */}
          {activeTab === 'overview' && (
            <>
              {/* FUNIL IMPONENTE DE CONVERSÃO DE VENDAS (PRIMEIRO ELEMENTO) */}
              <ConversionFunnel
                initialClicks={620}
                lpViews={262}
                checkoutsStarted={161}
                approvedSales={approvedTransactions.length > 0 ? approvedTransactions.length : 29}
                monthlyRevenue={totalRevenue}
              />

              {/* Top Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Vendas Reais */}
                <MetricCard
                  title="Vendas Reais (Principal)"
                  value={`${realSalesCount} vendas`}
                  subValue={formatCurrency(realSalesAmount)}
                  changePercent={14.2}
                  icon={ShoppingBag}
                  variant="cyan"
                  tooltipText="Quantidade e faturamento total do produto principal aprovado na Green."
                />

                {/* 2. Vendas Abandonadas */}
                <MetricCard
                  title="Vendas Abandonadas"
                  value={formatCurrency(abandonedAmount)}
                  subValue={`${abandonedCount} carrinhos abandonados`}
                  changePercent={-4.8}
                  icon={XCircle}
                  variant="neutral"
                  tooltipText="Dinheiro retido no checkout abandonado. Oportunidade para remarketing."
                />

                {/* 3. Vendas Pendentes */}
                <MetricCard
                  title="Vendas Pendentes (Pix/Boleto)"
                  value={formatCurrency(pendingAmount)}
                  subValue={`${pendingCount} aguardando pagamento`}
                  icon={Clock}
                  variant="warning"
                  tooltipText="Transações geradas aguardando compensação de Pix ou pagamento de Boleto."
                />

                {/* 4. Orderbumps */}
                <MetricCard
                  title="Orderbumps Adicionais"
                  value={formatCurrency(orderbumpAmount)}
                  subValue={`${orderbumpCount} orderbumps (39.4% conversão)`}
                  changePercent={8.5}
                  icon={PlusCircle}
                  variant="blue"
                  tooltipText="Faturamento extra gerado por ofertas de orderbump marcadas no checkout."
                />

                {/* 5. Faturamento Total */}
                <MetricCard
                  title="Faturamento Total"
                  value={formatCurrency(totalRevenue)}
                  subValue="Aprovados (Principal + Bumps)"
                  changePercent={18.6}
                  icon={DollarSign}
                  variant="blue"
                  tooltipText="Soma consolidada de todas as transações aprovadas."
                />

                {/* 6. Ticket Médio */}
                <MetricCard
                  title="Ticket Médio"
                  value={formatCurrency(averageTicket)}
                  subValue="Média por venda aprovada"
                  changePercent={3.2}
                  icon={Receipt}
                  variant="default"
                  tooltipText="Valor médio faturado por cliente em cada pedido aprovado."
                />

                {/* 7. Gastos Meta Ads */}
                <MetricCard
                  title="Gastos Meta Ads"
                  value={formatCurrency(metaAdsSpend)}
                  subValue="Facebook & Instagram Ads"
                  icon={Target}
                  variant="default"
                  tooltipText="Valor total investido em campanhas do Facebook/Instagram no período."
                />

                {/* 8. Lucro Líquido / ROAS (DESTAQUE AUTOMÁTICO) */}
                <div className="relative p-5 rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-blue-950/60 backdrop-blur-md shadow-[0_0_30px_rgba(34,211,238,0.15)] flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                        Lucro Líquido & ROAS
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-500 text-slate-950 uppercase">
                        Cálculo Automático
                      </span>
                    </div>
                    <div className="text-2xl font-black text-white group-hover:text-cyan-300 transition-colors">
                      {formatCurrency(netProfit)}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-cyan-500/20 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-300">ROAS Atual:</span>
                    <span className="text-sm font-black font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-lg border border-cyan-500/30">
                      {roas.toFixed(2)}x
                    </span>
                  </div>
                </div>
              </div>

              {/* Gráfico de Evolução e Tendência */}
              <TrendChart data={mockDailyTrends} />

              {/* Tabela de Transações Recentes ao Vivo */}
              <TransactionsTable transactions={displayedTransactions} onAddTransaction={handleAddTransaction} />
            </>
          )}

          {/* TAB 3: KANBAN DE VENDAS */}
          {activeTab === 'kanban' && <KanbanBoard />}

          {/* TAB 4: PERFORMANCE META ADS */}
          {activeTab === 'meta' && (
            <MetaAdsSection
              campaigns={mockMetaCampaigns}
              config={metaConfig}
              onUpdateConfig={handleUpdateMetaConfig}
            />
          )}

          {/* TAB 5: SIMULADOR DE ESCALA (WHAT-IF) */}
          {activeTab === 'simulator' && (
            <ScaleSimulatorTab
              currentSpend={metaAdsSpend}
              currentRevenue={totalRevenue}
              currentSalesCount={realSalesCount}
              currentTicketPrice={averageTicket > 0 ? averageTicket : 720}
            />
          )}

          {/* TAB 6: GERADOR DE RELATÓRIOS */}
          {activeTab === 'report' && (
            <SalesReportTab
              clients={clients}
              transactions={displayedTransactions}
              campaigns={mockMetaCampaigns}
            />
          )}

          {/* TAB 7: GESTÃO DE CLIENTES & INTEGRAÇÕES UNIFICADAS */}
          {activeTab === 'clients' && (
            <ClientsSection
              clients={clients}
              selectedClientId={selectedClientId}
              onSelectClient={setSelectedClientId}
              onAddClient={handleAddClient}
              onUpdateClient={handleUpdateClient}
              onDeleteClient={handleDeleteClient}
              onAddTransaction={handleAddTransaction}
              metaConfig={metaConfig}
              onUpdateMetaConfig={handleUpdateMetaConfig}
              initialSubTab="clients"
            />
          )}

          {activeTab === 'webhook' && (
            <ClientsSection
              clients={clients}
              selectedClientId={selectedClientId}
              onSelectClient={setSelectedClientId}
              onAddClient={handleAddClient}
              onUpdateClient={handleUpdateClient}
              onDeleteClient={handleDeleteClient}
              onAddTransaction={handleAddTransaction}
              metaConfig={metaConfig}
              onUpdateMetaConfig={handleUpdateMetaConfig}
              initialSubTab="green"
            />
          )}

          {activeTab === 'config' && (
            <ClientsSection
              clients={clients}
              selectedClientId={selectedClientId}
              onSelectClient={setSelectedClientId}
              onAddClient={handleAddClient}
              onUpdateClient={handleUpdateClient}
              onDeleteClient={handleDeleteClient}
              onAddTransaction={handleAddTransaction}
              metaConfig={metaConfig}
              onUpdateMetaConfig={handleUpdateMetaConfig}
              initialSubTab="meta"
            />
          )}
        </main>
      </div>

      {/* Modal da Central de Alertas Inteligentes */}
      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        alerts={alerts}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onNavigateTab={(tab) => setActiveTab(tab as NavTabId)}
      />

      {/* Modal de Configuração de APIs */}
      <ApiConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        config={metaConfig}
        onSave={setMetaConfig}
      />

      {/* Modal Simulador de Webhook Green (Sem Ngrok) */}
      <GreenSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />
    </div>
  );
}
