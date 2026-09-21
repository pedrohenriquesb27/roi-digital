'use client';

import React from 'react';
import { MetaCampaign, MetaApiConfig } from '../lib/types';
import { TrendingUp, RefreshCw, Zap, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface MetaAdsSectionProps {
  campaigns: MetaCampaign[];
  config: MetaApiConfig;
  onUpdateConfig: (newConfig: Partial<MetaApiConfig>) => void;
  onSyncMetaNow?: () => void;
  isSyncing?: boolean;
  lastSyncedAt?: string | null;
  syncError?: string | null;
  syncSuccessMsg?: string | null;
}

export default function MetaAdsSection({
  campaigns,
  config,
  onSyncMetaNow,
  isSyncing = false,
  lastSyncedAt = null,
  syncError = null,
  syncSuccessMsg = null,
}: MetaAdsSectionProps) {
  const totalSpend = campaigns.reduce((acc, c) => acc + c.spend, 0);
  const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0);
  const totalConversions = campaigns.reduce((acc, c) => acc + c.conversions, 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              Graph API v19.0
            </span>
            {lastSyncedAt && (
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" /> Sincronizado às: {lastSyncedAt}
              </span>
            )}
          </div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2.5 mt-1">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
            Performance Meta Ads
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Métricas em tempo real das campanhas do Facebook & Instagram Ads vinculadas à conta {config.adAccountId || 'act_...'}
          </p>
        </div>

        {/* Botão Sincronizar Agora */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSyncMetaNow}
            disabled={isSyncing}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            title="Forçar busca imediata de campanhas e métricas na Graph API da Meta"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Sincronizando Meta...' : 'Sincronizar Agora'}</span>
          </button>
        </div>
      </div>

      {/* Banner de Erro/Aviso da Meta API (se houver erro de permissão ou token) */}
      {syncError && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/90 via-slate-900 to-amber-950/40 border border-rose-500/40 text-rose-200 text-xs shadow-2xl flex items-start gap-3.5 animate-fadeIn">
          <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-extrabold text-rose-300 flex items-center gap-2">
              Aviso de Conexão com a Graph API da Meta
            </h4>
            <p className="text-slate-300 font-mono text-[11px] leading-relaxed">{syncError}</p>
            <p className="text-[11px] text-slate-400 pt-1">
              💡 <strong>Como resolver:</strong> Verifique se o Token de Acesso do Usuário possui a permissão <code className="text-cyan-300 bg-slate-950 px-1 py-0.5 rounded">ads_read</code> atribuída e se o ID da conta de anúncios está no formato correto (<code className="text-cyan-300 bg-slate-950 px-1 py-0.5 rounded">act_...</code>).
            </p>
          </div>
        </div>
      )}

      {/* Banner de Sucesso de Sincronização */}
      {syncSuccessMsg && !syncError && (
        <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{syncSuccessMsg}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <span className="text-xs font-bold text-slate-400 uppercase">Investimento Total</span>
          <div className="text-2xl font-black text-white mt-1">{formatCurrency(totalSpend)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Soma dos anúncios ativos</div>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <span className="text-xs font-bold text-slate-400 uppercase">Cliques em Anúncios</span>
          <div className="text-2xl font-black text-cyan-400 mt-1">{totalClicks} cliques</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Total de cliques registrados</div>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <span className="text-xs font-bold text-slate-400 uppercase">Conversões Totais</span>
          <div className="text-2xl font-black text-white mt-1">{totalConversions} vendas</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Pixel Meta / compras trackeadas</div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Campanhas Ativas no Meta Ads</h3>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
            {campaigns.length} campanhas
          </span>
        </div>

        {campaigns.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 font-medium">
            Nenhuma campanha do Meta Ads sincronizada. Clique no botão <strong>"Sincronizar Agora"</strong> acima ou configure as credenciais no perfil do cliente.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="pb-3 font-semibold">Nome da Campanha</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Investimento</th>
                  <th className="pb-3 font-semibold">Cliques</th>
                  <th className="pb-3 font-semibold">CTR</th>
                  <th className="pb-3 font-semibold">Vendas</th>
                  <th className="pb-3 font-semibold">ROAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-900/60">
                    <td className="py-3.5 font-bold text-white">{c.name}</td>
                    <td className="py-3.5 font-mono text-cyan-400">{c.status}</td>
                    <td className="py-3.5 font-mono text-white">{formatCurrency(c.spend)}</td>
                    <td className="py-3.5 font-mono text-slate-300">{c.clicks}</td>
                    <td className="py-3.5 font-mono text-slate-300">{c.ctr}%</td>
                    <td className="py-3.5 font-mono text-cyan-400 font-bold">{c.conversions}</td>
                    <td className="py-3.5 font-mono font-bold text-cyan-300">{c.roas.toFixed(2)}x</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
