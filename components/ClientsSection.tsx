'use client';

import React, { useState, useEffect } from 'react';
import { Client, MetaApiConfig, PaymentMethod, TransactionStatus } from '../lib/types';
import {
  Users,
  UserPlus,
  Building2,
  Mail,
  Phone,
  SlidersHorizontal,
  CheckCircle2,
  Search,
  Plus,
  X,
  DollarSign,
  ShoppingBag,
  AlertTriangle,
  Key,
  Target,
  RefreshCw,
  Zap,
  Globe,
  Tag,
  Send,
  ExternalLink,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Sliders,
  FileText,
} from 'lucide-react';
import MetaSimulatorModal from './MetaSimulatorModal';

export type SubTabCategory = 'clients' | 'green' | 'meta';
export type DetailSubTab = 'dados' | 'meta' | 'green';

interface ClientsSectionProps {
  clients: Client[];
  selectedClientId: string | null;
  onSelectClient: (clientId: string | null) => void;
  onAddClient: (newClient: Client) => void;
  onUpdateClient: (updatedClient: Client) => void;
  onAddTransaction?: (newTx: any) => void;
  metaConfig?: MetaApiConfig;
  onUpdateMetaConfig?: (newConfig: Partial<MetaApiConfig>) => void;
  initialSubTab?: SubTabCategory;
}

export default function ClientsSection({
  clients,
  selectedClientId,
  onSelectClient,
  onAddClient,
  onUpdateClient,
  onAddTransaction,
  metaConfig = {
    accessToken: 'EAAG982301984719283719238',
    adAccountId: 'act_389201948',
    pixelId: '98201948102',
    isConnected: true,
  },
  onUpdateMetaConfig,
  initialSubTab = 'clients',
}: ClientsSectionProps) {
  // 1. STATE DE NAVEGAÇÃO DE TELA (LISTA | CRIAR | DETALHES)
  const [viewState, setViewState] = useState<'list' | 'create' | 'detail'>('list');
  const [activeDetailClientId, setActiveDetailClientId] = useState<string | null>(selectedClientId || (clients[0]?.id ?? null));
  const [activeDetailSubTab, setActiveDetailSubTab] = useState<DetailSubTab>('dados');

  // Ajusta navegação com base na prop inicial do Dashboard
  useEffect(() => {
    if (initialSubTab === 'green') {
      setActiveDetailSubTab('green');
      if (selectedClientId || clients[0]) {
        setActiveDetailClientId(selectedClientId || clients[0].id);
        setViewState('detail');
      }
    } else if (initialSubTab === 'meta') {
      setActiveDetailSubTab('meta');
      if (selectedClientId || clients[0]) {
        setActiveDetailClientId(selectedClientId || clients[0].id);
        setViewState('detail');
      }
    }
  }, [initialSubTab, selectedClientId, clients]);

  // Cliente Ativo em Detalhes
  const currentDetailClient = clients.find((c) => c.id === activeDetailClientId) || clients[0] || null;

  // 2. STATE PARA BUSCA NA LISTA
  const [searchTerm, setSearchTerm] = useState('');

  // 3. STATE PARA NOVO CLIENTE (FORMULÁRIO BÁSICO)
  const [newClientName, setNewClientName] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAdAccountId, setNewAdAccountId] = useState('act_389201948');

  // 4. STATE PARA VENDA RÁPIDA DENTRO DA ABA DADOS DO CLIENTE
  const [saleAmount, setSaleAmount] = useState('97.00');
  const [saleStatus, setSaleStatus] = useState<TransactionStatus>('APROVADO');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [utmSource, setUtmSource] = useState('facebook');
  const [utmCampaign, setUtmCampaign] = useState('cbo_escala_direto');
  const [utmContent, setUtmContent] = useState('criativo_video_v1');
  const [saleSuccessMsg, setSaleSuccessMsg] = useState('');

  // 5. STATE PARA INTEGRAÇÃO GREEN GATEWAY
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [isSendingGreenTest, setIsSendingGreenTest] = useState(false);
  const [greenTestResult, setGreenTestResult] = useState<any>(null);
  const [greenLogs, setGreenLogs] = useState<any[]>([]);

  // 6. STATE PARA INTEGRAÇÃO META ADS
  const [showMetaToken, setShowMetaToken] = useState(false);
  const [isTestingMeta, setIsTestingMeta] = useState(false);
  const [metaTestResult, setMetaTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isMetaSimulatorOpen, setIsMetaSimulatorOpen] = useState(false);

  // Custom Token / Account per Client
  const [clientMetaToken, setClientMetaToken] = useState('');
  const [clientAdAccount, setClientAdAccount] = useState('');
  const [clientPixelId, setClientPixelId] = useState('');
  const [metaSaveSuccess, setMetaSaveSuccess] = useState('');

  useEffect(() => {
    if (currentDetailClient) {
      setClientMetaToken(currentDetailClient.metaAccessToken || metaConfig.accessToken);
      setClientAdAccount(currentDetailClient.adAccountId || metaConfig.adAccountId);
      setClientPixelId(currentDetailClient.pixelId || metaConfig.pixelId);
    }
  }, [currentDetailClient, metaConfig]);

  // Fetch Green Webhook logs
  const fetchGreenLogs = async () => {
    try {
      const res = await fetch('/api/webhook/green');
      if (res.ok) {
        const data = await res.json();
        setGreenLogs(data.logs || []);
      }
    } catch (err) {
      console.error('[Fetch Green Logs Error]:', err);
    }
  };

  useEffect(() => {
    fetchGreenLogs();
    const interval = setInterval(fetchGreenLogs, 4000);
    return () => clearInterval(interval);
  }, []);

  // ----------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------

  // Handler para Abrir Perfil do Cliente
  const handleOpenClientDetail = (clientId: string, subTab: DetailSubTab = 'dados') => {
    setActiveDetailClientId(clientId);
    setActiveDetailSubTab(subTab);
    setViewState('detail');
  };

  // Handler de Criação de Novo Cliente
  const handleCreateClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    const createdId = `cli_${Date.now()}`;
    const createdClient: Client = {
      id: createdId,
      name: newClientName.trim(),
      companyName: newCompanyName.trim() || newClientName.trim(),
      email: newEmail.trim() || 'contato@cliente.com',
      phone: newPhone.trim() || '(11) 99999-8888',
      adAccountId: newAdAccountId.trim() || 'act_389201948',
      status: 'ACTIVE',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      hoursWithoutSales: 0,
      totalSalesCount: 0,
      totalRevenue: 0,
    };

    onAddClient(createdClient);

    // Reset Form
    setNewClientName('');
    setNewCompanyName('');
    setNewEmail('');
    setNewPhone('');

    // Redireciona imediatamente para o Perfil do Cliente Criado!
    setActiveDetailClientId(createdId);
    setActiveDetailSubTab('dados');
    setViewState('detail');
  };

  // Handler de Cadastro de Venda Rápida
  const handleQuickSaleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDetailClient) return;

    const amountNum = parseFloat(saleAmount) || 97.0;
    const codeId = `GRN-${Math.floor(100000 + Math.random() * 900000)}`;

    let greenEvent = 'venda_aprovada';
    if (saleStatus === 'PENDENTE') greenEvent = 'pedido_criado';
    if (saleStatus === 'ABANDONADO') greenEvent = 'carrinho_abandonado';

    try {
      await fetch('/api/webhook/green', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: greenEvent,
          id: codeId,
          status: saleStatus,
          payment_method: paymentMethod,
          buyer: {
            name: currentDetailClient.name,
            email: currentDetailClient.email,
            phone: currentDetailClient.phone,
          },
          product: { name: 'Checkup Financeiro Completo' },
          amount: amountNum,
          custom_data: {
            utm_source: utmSource.trim() || 'facebook',
            utm_campaign: utmCampaign.trim() || 'cbo_escala_direto',
            utm_content: utmContent.trim() || 'criativo_v1',
            clientId: currentDetailClient.id,
          },
        }),
      });

      // Atualiza métricas locais do cliente
      if (saleStatus === 'APROVADO') {
        const updated = {
          ...currentDetailClient,
          totalSalesCount: (currentDetailClient.totalSalesCount || 0) + 1,
          totalRevenue: (currentDetailClient.totalRevenue || 0) + amountNum,
          hoursWithoutSales: 0,
        };
        onUpdateClient(updated);
      }

      fetchGreenLogs();
    } catch (err) {
      console.error('[Manual Client Sale Error]:', err);
    }

    setSaleSuccessMsg(
      `Venda de R$ ${amountNum.toFixed(2)} registrada para '${currentDetailClient.name}'! Alimenta o Kanban (${saleStatus}) e a Visão Geral.`
    );
    setTimeout(() => setSaleSuccessMsg(''), 5000);
  };

  // Handler para Salvar Configurações Meta Ads do Cliente
  const handleSaveMetaCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDetailClient) return;

    const updated: Client = {
      ...currentDetailClient,
      metaAccessToken: clientMetaToken,
      adAccountId: clientAdAccount,
      pixelId: clientPixelId,
    };

    onUpdateClient(updated);
    setMetaSaveSuccess('Credenciais da Meta Ads salvas com sucesso para este cliente!');
    setTimeout(() => setMetaSaveSuccess(''), 4000);
  };

  // Handlers para Green Test Event
  const handleSendGreenTestEvent = async (
    eventType: 'pedido_criado' | 'carrinho_abandonado' | 'venda_aprovada' | 'venda_reembolsada'
  ) => {
    setIsSendingGreenTest(true);
    setGreenTestResult(null);

    const testCode = `GRN-${Math.floor(100000 + Math.random() * 900000)}`;
    const clientName = currentDetailClient ? currentDetailClient.name : 'Cliente Exemplo';
    const clientEmail = currentDetailClient ? currentDetailClient.email : 'cliente@email.com';

    let payload: any = {};
    if (eventType === 'pedido_criado') {
      payload = {
        event: 'pedido_criado',
        id: testCode,
        status: 'PENDENTE',
        payment_method: 'PIX',
        buyer: { name: `${clientName} (Pix Gerado)`, email: clientEmail },
        product: { name: 'Checkup Financeiro Completo' },
        amount: 67.0,
        custom_data: { utm_source: 'google_ads', utm_campaign: 'search_brand' },
      };
    } else if (eventType === 'carrinho_abandonado') {
      payload = {
        event: 'carrinho_abandonado',
        id: testCode,
        status: 'ABANDONADO',
        payment_method: 'CARTAO',
        buyer: { name: `${clientName} (Abandonou Checkout)`, email: clientEmail },
        product: { name: 'Checkup Financeiro Completo' },
        amount: 147.0,
        custom_data: { utm_source: 'instagram', utm_campaign: 'retargeting_stories' },
      };
    } else if (eventType === 'venda_aprovada') {
      payload = {
        event: 'venda_aprovada',
        id: testCode,
        status: 'APROVADO',
        payment_method: 'PIX',
        buyer: { name: `${clientName} (Venda Aprovada)`, email: clientEmail },
        product: { name: 'Checkup Financeiro Completo' },
        amount: 97.0,
        custom_data: { utm_source: 'facebook', utm_campaign: 'cbo_direto_checkout' },
      };
    } else if (eventType === 'venda_reembolsada') {
      payload = {
        event: 'venda_reembolsada',
        id: testCode,
        status: 'CANCELADO',
        payment_method: 'CARTAO',
        buyer: { name: `${clientName} (Reembolsada)`, email: clientEmail },
        product: { name: 'Checkup Financeiro Completo' },
        amount: 97.0,
        custom_data: { utm_source: 'tiktok', utm_campaign: 'spark_ads' },
      };
    }

    try {
      const res = await fetch('/api/webhook/green', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setGreenTestResult(data);
      fetchGreenLogs();
    } catch (err: any) {
      setGreenTestResult({ success: false, error: err.message });
    } font-mono {
      setIsSendingGreenTest(false);
    }
  };

  // Handler para Testar Conexão Meta Ads API
  const handleTestMetaConnection = async () => {
    setIsTestingMeta(true);
    setMetaTestResult(null);
    try {
      const res = await fetch('/api/meta-ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test_connection',
          accessToken: clientMetaToken || metaConfig.accessToken,
          adAccountId: clientAdAccount || metaConfig.adAccountId,
        }),
      });
      const data = await res.json();
      setMetaTestResult({ success: data.success, message: data.message });
      if (data.success && onUpdateMetaConfig) {
        onUpdateMetaConfig({ isConnected: true });
      }
    } catch (err: any) {
      setMetaTestResult({ success: false, message: 'Erro de conexão: ' + err.message });
    } finally {
      setIsTestingMeta(false);
    }
  };

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  const webhookUrl =
    typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.host}/api/webhook/green`
      : 'http://localhost:3000/api/webhook/green';

  const webhookSecret = 'whsec_green_9823019847192837';

  // ----------------------------------------------------
  // FLUXO 1: LISTA LIMPA DE GESTÃO DE CLIENTES
  // ----------------------------------------------------
  if (viewState === 'list') {
    return (
      <div className="space-y-6">
        {/* Cabeçalho Limpo da Aba de Gestão de Clientes */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/80">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Users className="w-6 h-6 text-cyan-400" />
              Gestão de Clientes
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Gerencie sua carteira de clientes, acesse os perfis e configure integrações de forma individual.
            </p>
          </div>

          {/* BOTÃO EM DESTAQUE "+ Novo Cliente" */}
          <button
            onClick={() => setViewState('create')}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>+ Novo Cliente</span>
          </button>
        </div>

        {/* Barra de Pesquisa e Resumo da Lista */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar cliente por nome, empresa ou e-mail..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Total: <strong className="text-white font-bold">{clients.length} clientes cadastrados</strong>
          </div>
        </div>

        {/* Cards Grid Limpo dos Clientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClients.map((client) => {
            const isSelected = selectedClientId === client.id;
            const hasNoSalesAlert = (client.hoursWithoutSales || 0) >= 24;

            return (
              <div
                key={client.id}
                className={`glass-card rounded-2xl p-5 border transition-all duration-300 relative flex flex-col justify-between hover:border-cyan-500/40 ${
                  isSelected
                    ? 'border-cyan-400 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-blue-950/40 shadow-[0_0_20px_rgba(34,211,238,0.12)]'
                    : 'border-white/10 hover:bg-slate-900/80'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[10px] font-bold tracking-wider uppercase text-cyan-400 block mb-0.5 font-mono">
                        ID: {client.id}
                      </span>
                      <h4 className="text-base font-bold text-white tracking-tight">
                        {client.name}
                      </h4>
                      <p className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-blue-400" />
                        {client.companyName}
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        client.status === 'ACTIVE'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {client.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>

                  {hasNoSalesAlert && (
                    <div className="mb-3 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[11px] flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span className="font-semibold">Nenhuma venda há +24 horas!</span>
                    </div>
                  )}

                  <div className="space-y-1.5 text-xs py-3 border-y border-white/5 text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" /> E-mail:
                      </span>
                      <span className="font-mono text-slate-200">{client.email}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> Telefone:
                      </span>
                      <span className="font-mono text-slate-200">{client.phone}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3">
                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Vendas Totais
                      </span>
                      <span className="text-sm font-bold text-white flex items-center gap-1 mt-0.5">
                        <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
                        {client.totalSalesCount || 0}
                      </span>
                    </div>

                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Faturamento
                      </span>
                      <span className="text-sm font-bold text-cyan-400 mt-0.5 block font-mono">
                        {formatCurrency(client.totalRevenue || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botões de Ação do Card */}
                <div className="mt-4 pt-3 border-t border-white/5 flex flex-col gap-2">
                  <button
                    onClick={() => handleOpenClientDetail(client.id, 'dados')}
                    className="w-full py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-blue-600/30 to-cyan-500/30 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Ver Perfil & Configurar Integrações</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onSelectClient(isSelected ? null : client.id)}
                    className={`w-full py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-900/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    {isSelected ? '✓ Filtrando no Dashboard' : 'Filtrar no Dashboard'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // FLUXO 2: FORMULÁRIO LIMPO DE CADASTRO (MODAL / OVERLAY)
  // ----------------------------------------------------
  if (viewState === 'create') {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Botão para voltar */}
        <button
          onClick={() => setViewState('list')}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para Lista de Clientes
        </button>

        {/* Form Container Limpo */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-cyan-500/40 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950/40 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-tight">
                Cadastrar Perfil Básico do Cliente
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Preencha os dados básicos. As integrações do Meta Ads e Green serão configuradas logo em seguida no perfil do cliente.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateClientSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              {/* Nome do Cliente */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-200">Nome Completo do Cliente *</label>
                <div className="relative">
                  <Users className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="Ex: Carlos Eduardo Silva"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Empresa / Marca */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-200">Empresa / Nome da Marca</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-blue-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    placeholder="Ex: E-commerce Brasil Ltda"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              {/* E-mail de Contato */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-200">E-mail de Contato</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="carlos@empresa.com.br"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Telefone / WhatsApp */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-200">WhatsApp / Telefone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="(11) 98877-6655"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* ID da Conta de Anúncios (Opcional Inicialmente) */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block font-bold text-slate-200">
                  ID da Conta de Anúncios Meta Ads (Opcional)
                </label>
                <div className="relative">
                  <SlidersHorizontal className="w-4 h-4 text-blue-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={newAdAccountId}
                    onChange={(e) => setNewAdAccountId(e.target.value)}
                    placeholder="act_389201948"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-400 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setViewState('list')}
                className="px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 font-bold text-xs hover:bg-slate-800 transition-all"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                <Plus className="w-4 h-4" /> Cadastrar e Configurar Perfil
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // FLUXO 3: TELA DE DETALHES DO CLIENTE COM ABAS INTERNAS DEDICADAS
  // ----------------------------------------------------
  if (!currentDetailClient) {
    return (
      <div className="p-8 text-center text-slate-400">
        Nenhum cliente selecionado.{' '}
        <button onClick={() => setViewState('list')} className="text-cyan-400 underline font-bold">
          Voltar para Lista
        </button>
      </div>
    );
  }

  const isFilteredInDashboard = selectedClientId === currentDetailClient.id;

  return (
    <div className="space-y-6">
      {/* Barra de Topo do Perfil do Cliente */}
      <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950/40 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewState('list')}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400 transition-all"
              title="Voltar para Lista de Clientes"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase font-mono">
                  ID: {currentDetailClient.id}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    currentDetailClient.status === 'ACTIVE'
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {currentDetailClient.status === 'ACTIVE' ? 'Cliente Ativo' : 'Inativo'}
                </span>
              </div>

              <h2 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
                {currentDetailClient.name}
                <span className="text-sm font-semibold text-slate-400">({currentDetailClient.companyName})</span>
              </h2>
            </div>
          </div>

          <button
            onClick={() => onSelectClient(isFilteredInDashboard ? null : currentDetailClient.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
              isFilteredInDashboard
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 border border-slate-700 text-slate-200 hover:border-cyan-400'
            }`}
          >
            {isFilteredInDashboard ? '✓ Filtrando no Dashboard Global' : 'Filtrar no Dashboard Global'}
          </button>
        </div>
      </div>

      {/* ABAS INTERNAS DEDICADAS DO CLIENTE */}
      <div className="glass-card rounded-2xl p-2 border border-white/10 flex items-center gap-2 bg-slate-950/90 overflow-x-auto">
        <button
          onClick={() => setActiveDetailSubTab('dados')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeDetailSubTab === 'dados'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Aba "Dados do Cliente"</span>
        </button>

        <button
          onClick={() => setActiveDetailSubTab('meta')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeDetailSubTab === 'meta'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Aba "Integração Meta Ads"</span>
        </button>

        <button
          onClick={() => setActiveDetailSubTab('green')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeDetailSubTab === 'green'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Aba "Integração Green"</span>
        </button>
      </div>

      {/* ------------------------------------------------ */}
      {/* ABA INTERNA 1: DADOS DO CLIENTE & CADASTRO DE VENDA */}
      {/* ------------------------------------------------ */}
      {activeDetailSubTab === 'dados' && (
        <div className="space-y-6">
          {/* Card Resumo do Perfil */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Contato Principal
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-200">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono">{currentDetailClient.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Phone className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono">{currentDetailClient.phone}</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Vendas & Faturamento
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Vendas Totais</span>
                  <strong className="text-base text-white">{currentDetailClient.totalSalesCount || 0}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Faturamento</span>
                  <strong className="text-base text-cyan-400 font-mono">
                    {formatCurrency(currentDetailClient.totalRevenue || 0)}
                  </strong>
                </div>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Conta Meta Vinculada
              </span>
              <div className="text-xs space-y-1">
                <span className="text-slate-400 block">Ad Account ID:</span>
                <span className="font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30 inline-block">
                  {currentDetailClient.adAccountId || 'act_389201948'}
                </span>
              </div>
            </div>
          </div>

          {/* Cadastro de Venda Rápida para o Cliente */}
          <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-blue-950/40 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Lançar Venda Manual para {currentDetailClient.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Alimenta instantaneamente o Kanban Board e as métricas da Visão Geral.
                  </p>
                </div>
              </div>
            </div>

            {saleSuccessMsg && (
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>{saleSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleQuickSaleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {/* Valor */}
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-300">Valor da Venda (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={saleAmount}
                    onChange={(e) => setSaleAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-cyan-300 font-mono font-bold focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-300">Status da Venda</label>
                  <select
                    value={saleStatus}
                    onChange={(e: any) => setSaleStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-semibold focus:outline-none focus:border-cyan-400"
                  >
                    <option value="APROVADO">Aprovado ➔ Coluna GANHO</option>
                    <option value="PENDENTE">Pendente (Pix) ➔ Coluna NOVO LEAD</option>
                    <option value="ABANDONADO">Carrinho Abandonado ➔ Coluna ABANDONADO</option>
                  </select>
                </div>

                {/* Forma de Pagamento */}
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-300">Forma de Pagamento</label>
                  <select
                    value={paymentMethod}
                    onChange={(e: any) => setPaymentMethod(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-semibold focus:outline-none focus:border-cyan-400"
                  >
                    <option value="PIX">PIX</option>
                    <option value="CARTAO">Cartão de Crédito</option>
                    <option value="BOLETO">Boleto Bancário</option>
                  </select>
                </div>

                {/* utm_source */}
                <div className="space-y-1">
                  <label className="block font-semibold text-cyan-400 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> utm_source
                  </label>
                  <input
                    type="text"
                    value={utmSource}
                    onChange={(e) => setUtmSource(e.target.value)}
                    placeholder="facebook"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  <Plus className="w-4 h-4" /> Registrar Venda no Kanban & Visão Geral
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------ */}
      {/* ABA INTERNA 2: INTEGRAÇÃO META ADS DO CLIENTE */}
      {/* ------------------------------------------------ */}
      {activeDetailSubTab === 'meta' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-white/10 relative space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  Configuração da Meta Marketing API ({currentDetailClient.name})
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    🟢 Ativo
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure o Token de Acesso do Usuário do Sistema e o ID da Conta de Anúncios deste cliente especificamente.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMetaSimulatorOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-blue-500/40 text-cyan-300 font-bold text-xs hover:bg-blue-500/10 transition-all shadow-md"
                >
                  <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span>🎯 Abrir Simulador Meta Ads</span>
                </button>

                <button
                  onClick={handleTestMetaConnection}
                  disabled={isTestingMeta}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isTestingMeta ? 'animate-spin' : ''}`} />
                  {isTestingMeta ? 'Testando Conexão...' : 'Testar Conexão API'}
                </button>
              </div>
            </div>

            {metaSaveSuccess && (
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
                ✅ {metaSaveSuccess}
              </div>
            )}

            {metaTestResult && (
              <div
                className={`p-3 rounded-xl text-xs font-mono border ${
                  metaTestResult.success
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                {metaTestResult.success ? '✅' : '⚠️'} {metaTestResult.message}
              </div>
            )}

            {/* Form de Credenciais Meta Ads */}
            <form onSubmit={handleSaveMetaCredentials} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Access Token */}
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-300 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-cyan-400" />
                    Meta System Access Token
                  </label>
                  <input
                    type="password"
                    value={clientMetaToken}
                    onChange={(e) => setClientMetaToken(e.target.value)}
                    placeholder="EAAG982301984719283719238..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Ad Account ID */}
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-300 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
                    ID da Conta de Anúncios (Ad Account ID)
                  </label>
                  <input
                    type="text"
                    value={clientAdAccount}
                    onChange={(e) => setClientAdAccount(e.target.value)}
                    placeholder="act_389201948"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-blue-400"
                  />
                </div>

                {/* Pixel ID */}
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-300 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-cyan-400" />
                    Pixel ID Meta
                  </label>
                  <input
                    type="text"
                    value={clientPixelId}
                    onChange={(e) => setClientPixelId(e.target.value)}
                    placeholder="98201948102"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  Salvar Credenciais da Meta Ads
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------ */}
      {/* ABA INTERNA 3: INTEGRAÇÃO GREEN GATEWAY (WEBHOOK) */}
      {/* ------------------------------------------------ */}
      {activeDetailSubTab === 'green' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-blue-950/50 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    Webhook Green Gateway — {currentDetailClient.name}
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      200 OK — Ativo
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Copie a URL de webhook abaixo e cole na plataforma da Green para este cliente.
                  </p>
                </div>
              </div>

              <a
                href="https://greenn.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-400 font-semibold text-xs hover:border-cyan-400 transition-colors"
              >
                Acessar Painel da Green <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Endpoint Codes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  <h4 className="text-sm font-bold text-white">URL de Webhook Exclusiva do Cliente</h4>
                </div>
                <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                  POST Method
                </span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={`${webhookUrl}?clientId=${currentDetailClient.id}`}
                  className="w-full bg-slate-950 border border-cyan-500/40 rounded-xl px-4 py-3 pr-28 text-xs font-mono text-cyan-300 font-semibold shadow-inner focus:outline-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${webhookUrl}?clientId=${currentDetailClient.id}`);
                    setCopiedUrl(true);
                    setTimeout(() => setCopiedUrl(false), 2500);
                  }}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
                >
                  {copiedUrl ? 'Copiado!' : 'Copiar URL'}
                </button>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-blue-400" />
                  <h4 className="text-sm font-bold text-white">Chave Secreta (Secret Token)</h4>
                </div>
                <span className="text-[10px] font-bold text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                  Validação HMAC
                </span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={webhookSecret}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 pr-28 text-xs font-mono text-slate-300 font-semibold shadow-inner focus:outline-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(webhookSecret);
                    setCopiedSecret(true);
                    setTimeout(() => setCopiedSecret(false), 2500);
                  }}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-all"
                >
                  {copiedSecret ? 'Copiado!' : 'Copiar Chave'}
                </button>
              </div>
            </div>
          </div>

          {/* Test Buttons */}
          <div className="glass-card p-6 rounded-2xl border border-cyan-500/30 space-y-4 bg-slate-900/80">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-cyan-400" /> Disparar Testes para {currentDetailClient.name} em 1-Clique:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={() => handleSendGreenTestEvent('pedido_criado')}
                disabled={isSendingGreenTest}
                className="p-3 rounded-xl bg-blue-950/60 border border-blue-500/40 text-blue-300 hover:bg-blue-900/60 transition-all text-left space-y-1"
              >
                <div className="text-xs font-bold">🔵 Pix / Boleto Gerado</div>
                <div className="text-[10px] text-slate-400">Novo Lead</div>
              </button>

              <button
                onClick={() => handleSendGreenTestEvent('carrinho_abandonado')}
                disabled={isSendingGreenTest}
                className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 hover:bg-amber-900/60 transition-all text-left space-y-1"
              >
                <div className="text-xs font-bold">🟡 Checkout Abandonado</div>
                <div className="text-[10px] text-slate-400">Carrinho Abandonado</div>
              </button>

              <button
                onClick={() => handleSendGreenTestEvent('venda_aprovada')}
                disabled={isSendingGreenTest}
                className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 transition-all text-left space-y-1"
              >
                <div className="text-xs font-bold">🟢 Venda Aprovada</div>
                <div className="text-[10px] text-slate-400">Ganho</div>
              </button>

              <button
                onClick={() => handleSendGreenTestEvent('venda_reembolsada')}
                disabled={isSendingGreenTest}
                className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 hover:bg-rose-900/60 transition-all text-left space-y-1"
              >
                <div className="text-xs font-bold">🔴 Venda Reembolsada</div>
                <div className="text-[10px] text-slate-400">Perdido</div>
              </button>
            </div>
          </div>

          {/* Webhook Logs Stream */}
          <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
              Stream de Logs do Webhook ({greenLogs.length} recebidos)
            </h4>

            <div className="space-y-2.5 max-h-64 overflow-y-auto">
              {greenLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1 font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-400 font-bold">{log.id}</span>
                    <span className="text-slate-500 text-[10px]">{log.receivedAt}</span>
                  </div>
                  <div className="text-slate-300 font-sans">
                    <strong>{log.buyerName}</strong> — R$ {log.amount?.toFixed(2)} ({log.paymentMethod})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Simulador Meta Ads */}
      <MetaSimulatorModal
        isOpen={isMetaSimulatorOpen}
        onClose={() => setIsMetaSimulatorOpen(false)}
      />
    </div>
  );
}
