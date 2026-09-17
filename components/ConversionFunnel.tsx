import React from 'react';
import { Target, TrendingUp, Users, ShoppingCart, DollarSign, CheckCircle2 } from 'lucide-react';

interface ConversionFunnelProps {
  initialClicks?: number;
  lpViews?: number;
  checkoutsStarted?: number;
  approvedSales?: number;
  monthlyRevenue?: number;
}

export default function ConversionFunnel({
  initialClicks = 620,
  lpViews = 262,
  checkoutsStarted = 161,
  approvedSales = 29,
  monthlyRevenue = 20880,
}: ConversionFunnelProps) {
  // Funnel calculations
  const lpConversion = ((lpViews / initialClicks) * 100).toFixed(1);
  const checkoutConversion = ((checkoutsStarted / lpViews) * 100).toFixed(1);
  const saleConversion = ((approvedSales / checkoutsStarted) * 100).toFixed(1);
  const overallConversion = ((approvedSales / initialClicks) * 100).toFixed(2);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-blue-950/40 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Alta Conversão
            </span>
            <span className="text-xs font-semibold text-slate-400">Meta Ads ➔ Green Checkout</span>
          </div>
          <h3 className="text-xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
            Funil Imponente de Conversão de Vendas
          </h3>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/60 p-2.5 rounded-xl border border-cyan-500/20">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Faturamento Consolidado</span>
            <span className="text-lg font-black font-mono text-cyan-400">{formatCurrency(monthlyRevenue)}</span>
          </div>
        </div>
      </div>

      {/* Visual Funnel Step Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {/* Step 1: Clicks */}
        <div className="glass-card rounded-xl p-4 border border-white/10 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">1. Cliques Meta</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{initialClicks}</div>
          <div className="text-[11px] text-slate-400 mt-1">Tráfego pago vindo dos anúncios</div>
          <div className="mt-3 pt-2 border-t border-white/5 text-[10px] font-semibold text-cyan-400">
            Base de Entrada (100%)
          </div>
        </div>

        {/* Step 2: LP Views */}
        <div className="glass-card rounded-xl p-4 border border-white/10 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">2. Visitas LP</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{lpViews}</div>
          <div className="text-[11px] text-slate-400 mt-1">Visualizações de página carregadas</div>
          <div className="mt-3 pt-2 border-t border-white/5 text-[10px] font-bold text-cyan-400 flex justify-between">
            <span>Taxa Retenção LP:</span>
            <span className="font-mono">{lpConversion}%</span>
          </div>
        </div>

        {/* Step 3: Checkout Initiated */}
        <div className="glass-card rounded-xl p-4 border border-white/10 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">3. Checkouts</span>
            <ShoppingCart className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{checkoutsStarted}</div>
          <div className="text-[11px] text-slate-400 mt-1">Iniciaram pagamento na Green</div>
          <div className="mt-3 pt-2 border-t border-white/5 text-[10px] font-bold text-blue-400 flex justify-between">
            <span>Conversão LP ➔ Checkout:</span>
            <span className="font-mono">{checkoutConversion}%</span>
          </div>
        </div>

        {/* Step 4: Approved Sales */}
        <div className="glass-card rounded-xl p-4 border border-cyan-500/40 bg-cyan-500/10 relative overflow-hidden group hover:border-cyan-400 transition-all">
          <div className="flex items-center justify-between text-cyan-300 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider">4. Vendas Paga</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{approvedSales}</div>
          <div className="text-[11px] text-cyan-200/80 mt-1">Aprovadas no gateway</div>
          <div className="mt-3 pt-2 border-t border-cyan-500/20 text-[10px] font-black text-cyan-300 flex justify-between">
            <span>Conversão Checkout ➔ Venda:</span>
            <span className="font-mono text-cyan-300">{saleConversion}%</span>
          </div>
        </div>
      </div>

      {/* Summary Footer Bar */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <span>Taxa Global de Conversão de Anúncio para Venda Final:</span>
          <strong className="text-white font-mono text-sm bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/40">
            {overallConversion}%
          </strong>
        </div>

        <div className="text-slate-400 text-[11px]">
          Desempenho <span className="text-cyan-400 font-bold">28.4% acima</span> da média de mercado do segmento.
        </div>
      </div>
    </div>
  );
}
