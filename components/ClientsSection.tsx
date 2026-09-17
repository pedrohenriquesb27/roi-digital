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
  XCircle,
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
  Code,
  ShieldCheck,
  Sliders,
} from 'lucide-react';
import MetaSimulatorModal from './MetaSimulatorModal';

export type SubTabCategory = 'clients' | 'green' | 'meta';

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
  const [activeSubTab, setActiveSubTab] = useState<SubTabCategory>(initialSubTab);

  useEffect(() => {
    setActiveSubTab(initialSubTab);
  }, [initialSubTab]);

  // 1. STATE PARA CADASTRO MANUA L RÁPIDO DE CLIENTE / VENDA
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [saleAmount, setSaleAmount] = useState('97.00');
  const [saleStatus, setSaleStatus] = useState<TransactionStatus>('APROVADO');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [utmSource, setUtmSource] = useState('facebook');
  const [utmCampaign, setUtmCampaign] = useState('cbo_escala_direto');
  const [utmContent, setUtmContent] = useState('criativo_video_v1');
  const [adAccountId, setAdAccountId] = useState('act_389201948');

  const [searchTerm, setSearchTerm] = useState('');
  const [formSuccessMsg, setFormSuccessMsg] = useState('');

  // 2. STATE PARA WEBHOOK GREEN LOGS & TESTES
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [isSendingGreenTest, setIsSendingGreenTest] = useState(false);
  const [greenTestResult, setGreenTestResult] = useState<any>(null);
  const [greenLogs, setGreenLogs] = useState<any[]>([]);

  const webhookUrl =
    typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.host}/api/webhook/green`
      : 'http://localhost:3000/api/webhook/green';

  const webhookSecret = 'whsec_green_9823019847192837';

  // 3. STATE PARA META ADS API
  const [showMetaToken, setShowMetaToken] = useState(false);
  const [isTestingMeta, setIsTestingMeta] = useState(false);
  const [metaTestResult, setMetaTestResult] = useState<{ success: boolean; message: string } | null>(
    null
  );
  const [isMetaSimulatorOpen, setIsMetaSimulatorOpen] = useState(false);

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

  // Handler para Cadastro Manual Rápido de Cliente + Venda
  const handleQuickClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const amountNum = parseFloat(saleAmount) || 97.0;
    const clientId = `cli_${Date.now()}`;
    const codeId = `GRN-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create New Client
    const newClient: Client = {
      id: clientId,
      name,
      companyName: companyName.trim() || name,
      email: email.trim() || 'cliente@exemplo.com',
      phone: phone.trim() || '(11) 99999-8888',
      adAccountId: adAccountId.trim() || 'act_389201948',
      status: 'ACTIVE',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      hoursWithoutSales: saleStatus === 'APROVADO' ? 0 : 26,
      totalSalesCount: saleStatus === 'APROVADO' ? 1 : 0,
      totalRevenue: saleStatus === 'APROVADO' ? amountNum : 0,
    };

    onAddClient(newClient);

    // Send Webhook payload to feed Kanban Board and Visão Geral metrics
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
            name,
            email: email.trim() || 'cliente@exemplo.com',
            phone: phone.trim() || '(11) 99999-8888',
          },
          product: { name: 'Checkup Financeiro Completo' },
          amount: amountNum,
          custom_data: {
            utm_source: utmSource.trim() || 'facebook',
            utm_campaign: utmCampaign.trim() || 'cbo_escala_direto',
            utm_content: utmContent.trim() || 'criativo_v1',
          },
        }),
      });
      fetchGreenLogs();
    } catch (err) {
      console.error('[Manual Client Webhook Dispatch Error]:', err);
    }

    setFormSuccessMsg(
      `Cliente '${name}' cadastrado com sucesso! Venda de R$ ${amountNum.toFixed(
        2
      )} adicionada ao Kanban (${saleStatus}) e Visão Geral.`
    );

    // Reset Form
    setName('');
    setCompanyName('');
    setEmail('');
    setPhone('');
    setSaleAmount('97.00');

    setTimeout(() => setFormSuccessMsg(''), 5000);
  };

  // Handlers para Green Test Event
  const handleSendGreenTestEvent = async (
    eventType: 'pedido_criado' | 'carrinho_abandonado' | 'venda_aprovada' | 'venda_reembolsada'
  ) => {
    setIsSendingGreenTest(true);
    setGreenTestResult(null);

    const testCode = `GRN-${Math.floor(100000 + Math.random() * 900000)}`;
    let payload: any = {};

    if (eventType === 'pedido_criado') {
      payload = {
        event: 'pedido_criado',
        id: testCode,
        status: 'PENDENTE',
        payment_method: 'PIX',
        buyer: { name: 'Lucas Mendes (Pix Gerado)', email: 'lucas@gmail.com' },
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
        buyer: { name: 'Fernanda Rocha (Abandonou Checkout)', email: 'fernanda@hotmail.com' },
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
        buyer: { name: 'Bruno Castro (Venda Aprovada)', email: 'bruno@yahoo.com' },
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
        buyer: { name: 'Patricia Souza (Reembolsada)', email: 'patricia@outlook.com' },
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
    } finally {
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
          accessToken: metaConfig.accessToken,
          adAccountId: metaConfig.adAccountId,
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

  return (
    <div className="space-y-6">
      {/* NAVEGAÇÃO PRINCIPAL DAS SUB-ABAS UNIFICADAS */}
      <div className="glass-card rounded-2xl p-2 border border-white/10 flex items-center gap-2 overflow-x-auto bg-slate-950/80">
        <button
          onClick={() => setActiveSubTab('clients')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'clients'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>1. Cadastro & Gestão de Clientes (Manual Rápido)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('green')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'green'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>2. Integração Green Gateway (Webhooks)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('meta')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'meta'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>3. Integração Meta Ads API (Facebook & Instagram)</span>
        </button>
      </div>

      {/* SUB-ABA 1: CADASTRO MANUA L RÁPIDO DE CLIENTES & LISTAGEM */}
      {activeSubTab === 'clients' && (
        <div className="space-y-6">
          {/* Formulário de Cadastro Manual Rápido */}
          <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-blue-950/40 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    Cadastro Manual Rápido de Cliente / Venda
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      Alimenta Kanban & Visão Geral
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Cadastre o cliente e atribua uma venda com valor e UTMs para impactar imediatamente o Kanban e as métricas.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Banner Message */}
            {formSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold animate-in fade-in duration-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>{formSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleQuickClientSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {/* Nome */}
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-300">Nome do Cliente *</label>
                  <div className="relative">
                    <Users className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Carlos Eduardo Silva"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Empresa */}
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-300">Empresa / Marca</label>
                  <div className="relative">
                    <Building2 className="w-3.5 h-3.5 text-blue-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Ex: E-commerce Brasil"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>

                {/* E-mail */}
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-300">E-mail de Contato</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="carlos@email.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Telefone */}
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-300">WhatsApp / Telefone</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 98877-6655"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Valor da Venda */}
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-300">Valor da Venda (R$)</label>
                  <div className="relative">
                    <DollarSign className="w-3.5 h-3.5 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      step="0.01"
                      value={saleAmount}
                      onChange={(e) => setSaleAmount(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2.5 text-cyan-300 font-mono font-bold focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Status da Venda */}
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

                {/* UTM Source */}
                <div className="space-y-1">
                  <label className="block font-semibold text-cyan-400 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> utm_source (Origem)
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

              {/* Botão de Envio */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  <Plus className="w-4 h-4" /> Cadastrar Cliente e Alimentar Kanban / Visão Geral
                </button>
              </div>
            </form>
          </div>

          {/* Search and Clients List */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar cliente por nome, empresa ou e-mail..."
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="text-xs text-slate-400 font-medium">
              Total: <strong className="text-white">{clients.length} clientes cadastrados</strong>
            </div>
          </div>

          {/* Cards Grid dos Clientes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClients.map((client) => {
              const isSelected = selectedClientId === client.id;
              const hasNoSalesAlert = (client.hoursWithoutSales || 0) >= 24;

              return (
                <div
                  key={client.id}
                  className={`glass-card rounded-2xl p-5 border transition-all duration-300 relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-cyan-400 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-blue-950/40 shadow-[0_0_25px_rgba(34,211,238,0.15)]'
                      : 'border-white/10 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-[10px] font-bold tracking-wider uppercase text-cyan-400 block mb-0.5">
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
                      <div className="mb-3 p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs flex items-start gap-2.5 animate-pulse">
                        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-bold text-amber-200">
                            ⚠️ ATENÇÃO: Nenhuma venda há +24 horas!
                          </strong>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 text-xs py-3 border-y border-white/5 text-slate-300">
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
                          {client.totalSalesCount}
                        </span>
                      </div>

                      <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Faturamento
                        </span>
                        <span className="text-sm font-bold text-cyan-400 mt-0.5 block font-mono">
                          {formatCurrency(client.totalRevenue)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectClient(isSelected ? null : client.id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950 shadow-md'
                          : 'bg-slate-900 border border-slate-700 text-slate-200 hover:border-cyan-400'
                      }`}
                    >
                      {isSelected ? '✓ Filtrando Dashboard' : 'Filtrar no Dashboard'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-ABA 2: INTEGRAÇÃO GREEN GATEWAY (WEBHOOKS) */}
      {activeSubTab === 'green' && (
        <div className="space-y-6">
          {/* Top Banner */}
          <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-blue-950/50 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    Aba de Configuração do Webhook Green Gateway
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      200 OK — Ativo
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Recebe eventos de pagamento em tempo real e atualiza o Kanban e métricas automaticamente.
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
                  <h4 className="text-sm font-bold text-white">URL do Webhook (Endpoint)</h4>
                </div>
                <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                  POST Method
                </span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={webhookUrl}
                  className="w-full bg-slate-950 border border-cyan-500/40 rounded-xl px-4 py-3 pr-28 text-xs font-mono text-cyan-300 font-semibold shadow-inner focus:outline-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(webhookUrl);
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
              <Send className="w-4 h-4 text-cyan-400" /> Disparar Testes de Eventos da Green em 1-Clique:
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

      {/* SUB-ABA 3: INTEGRAÇÃO META ADS API */}
      {activeSubTab === 'meta' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-white/10 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  Configuração da Meta Marketing API (Facebook & Instagram)
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      metaConfig.isConnected
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {metaConfig.isConnected ? '🟢 API Conectada & Sincronizada' : '🔴 Desconectado'}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Insira o Token do Usuário do Sistema e o ID da Conta de Anúncios da Meta
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

            {/* Test Result Box */}
            {metaTestResult && (
              <div
                className={`mt-4 p-3 rounded-xl text-xs font-mono border ${
                  metaTestResult.success
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                {metaTestResult.success ? '✅' : '⚠️'} {metaTestResult.message}
              </div>
            )}

            {/* Credenciais Form Inputs */}
            <div className="mt-6 pt-5 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-cyan-400" />
                  Meta System Access Token
                </label>
                <div className="relative">
                  <input
                    type={showMetaToken ? 'text' : 'password'}
                    value={metaConfig.accessToken}
                    onChange={(e) =>
                      onUpdateMetaConfig && onUpdateMetaConfig({ accessToken: e.target.value })
                    }
                    placeholder="EAAXXXXXXX..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
                  ID da Conta de Anúncios (Ad Account ID)
                </label>
                <input
                  type="text"
                  value={metaConfig.adAccountId}
                  onChange={(e) =>
                    onUpdateMetaConfig && onUpdateMetaConfig({ adAccountId: e.target.value })
                  }
                  placeholder="act_389201948"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  Pixel ID Meta
                </label>
                <input
                  type="text"
                  value={metaConfig.pixelId}
                  onChange={(e) =>
                    onUpdateMetaConfig && onUpdateMetaConfig({ pixelId: e.target.value })
                  }
                  placeholder="98201948102"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>
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
