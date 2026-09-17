'use client';

import React, { useState } from 'react';
import { PieChart, Calculator, TrendingUp } from 'lucide-react';

interface ScaleSimulatorTabProps {
  currentSpend: number;
  currentRevenue: number;
  currentSalesCount: number;
  currentTicketPrice: number;
}

export default function ScaleSimulatorTab({
  currentSpend,
  currentRevenue,
}: ScaleSimulatorTabProps) {
  const [multiplier, setMultiplier] = useState(2);

  const projectedSpend = currentSpend * multiplier;
  const projectedRevenue = currentRevenue * multiplier * 0.92;
  const projectedProfit = projectedRevenue - projectedSpend;
  const projectedRoas = projectedSpend > 0 ? projectedRevenue / projectedSpend : 0;

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
            <PieChart className="w-6 h-6 text-cyan-400" />
            Simulador de Escala de Tráfego (What-If)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Simule o aumento de investimento no Meta Ads e a projeção de faturamento e lucro líquido.
          </p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300">Multiplicador de Orçamento Meta Ads: {multiplier}x</label>
          <input
            type="range"
            min="1"
            max="10"
            step="0.5"
            value={multiplier}
            onChange={(e) => setMultiplier(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block">Investimento Simulado</span>
            <strong className="text-lg text-white font-mono">{formatCurrency(projectedSpend)}</strong>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block">Faturamento Estimado</span>
            <strong className="text-lg text-cyan-400 font-mono">{formatCurrency(projectedRevenue)}</strong>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30">
            <span className="text-slate-400 block">Lucro Líquido Estimado</span>
            <strong className="text-lg text-cyan-300 font-mono">{formatCurrency(projectedProfit)}</strong>
            <span className="text-[10px] text-slate-400 block mt-1">ROAS: {projectedRoas.toFixed(2)}x</span>
          </div>
        </div>
      </div>
    </div>
  );
}
