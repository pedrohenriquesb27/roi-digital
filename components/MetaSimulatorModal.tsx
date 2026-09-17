'use client';

import React, { useState } from 'react';
import { Target, Zap, Play, CheckCircle2, RefreshCw } from 'lucide-react';

interface MetaSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MetaSimulatorModal({ isOpen, onClose }: MetaSimulatorModalProps) {
  const [budget, setBudget] = useState('500');
  const [targetAudience, setTargetAudience] = useState('Interesses em Finanças & Investimentos');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimResult(null);

    setTimeout(() => {
      const budgetNum = parseFloat(budget) || 500;
      const estimatedClicks = Math.floor(budgetNum * 1.85);
      const estimatedSales = Math.floor(budgetNum * 0.048);
      const estimatedRevenue = estimatedSales * 97.0;
      const estimatedRoas = estimatedRevenue / budgetNum;

      setSimResult({
        budget: budgetNum,
        clicks: estimatedClicks,
        sales: estimatedSales,
        revenue: estimatedRevenue,
        roas: estimatedRoas,
      });
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-card rounded-2xl max-w-md w-full p-6 border border-cyan-500/30 bg-slate-900/95 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Simulador Meta Ads</h3>
              <p className="text-xs text-slate-400">Projeção de alcance e ROAS em tempo real</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">✕</button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-300">Orçamento Diário de Teste (R$)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-slate-300">Público-Alvo Segmentado</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {simResult && (
            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 space-y-2">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Projeção Estimada de Vendas:
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>Cliques: <strong className="text-white">{simResult.clicks}</strong></div>
                <div>Vendas: <strong className="text-white">{simResult.sales}</strong></div>
                <div>Faturamento: <strong className="text-cyan-400">R$ {simResult.revenue.toFixed(2)}</strong></div>
                <div>ROAS Projetado: <strong className="text-cyan-400">{simResult.roas.toFixed(2)}x</strong></div>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              <span>{isSimulating ? 'Simulando...' : 'Rodar Simulação Meta Ads'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
