'use client';

import React from 'react';
import { MetaCampaign, MetaApiConfig } from '../lib/types';
import { TrendingUp, RefreshCw, Zap } from 'lucide-react';

interface MetaAdsSectionProps {
  campaigns: MetaCampaign[];
  config: MetaApiConfig;
  onUpdateConfig: (newConfig: Partial<MetaApiConfig>) => void;
}

export default function MetaAdsSection({ campaigns, config }: MetaAdsSectionProps) {
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
      <div className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/80">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
            Performance Meta Ads
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Sincronização em tempo real das campanhas do Facebook & Instagram Ads via Marketing API.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <span className="text-xs font-bold text-slate-400 uppercase">Investimento Total</span>
          <div className="text-2xl font-black text-white mt-1">{formatCurrency(totalSpend)}</div>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <span className="text-xs font-bold text-slate-400 uppercase">Cliques em Anúncios</span>
          <div className="text-2xl font-black text-cyan-400 mt-1">{totalClicks} cliques</div>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <span className="text-xs font-bold text-slate-400 uppercase">Conversões Totais</span>
          <div className="text-2xl font-black text-white mt-1">{totalConversions} vendas</div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white">Campanhas Ativas no Meta Ads</h3>
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
      </div>
    </div>
  );
}
