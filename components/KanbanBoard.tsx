'use client';

import React from 'react';
import { Transaction } from '../lib/types';
import { DollarSign, Clock, AlertCircle, ShoppingBag } from 'lucide-react';

interface KanbanBoardProps {
  transactions?: Transaction[];
}

export default function KanbanBoard({ transactions = [] }: KanbanBoardProps) {
  const columns = [
    {
      id: 'PENDENTE',
      title: '1. Novo Lead / Pix Gerado',
      icon: Clock,
      color: 'amber',
      badge: 'Aguardando Pagamento',
    },
    {
      id: 'APROVADO',
      title: '2. Venda Aprovada (Ganho)',
      icon: ShoppingBag,
      color: 'cyan',
      badge: 'Faturamento Liberado',
    },
    {
      id: 'ABANDONADO',
      title: '3. Carrinho Abandonado',
      icon: AlertCircle,
      color: 'rose',
      badge: 'Remarketing Necessário',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/80">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2.5">
            <DollarSign className="w-6 h-6 text-cyan-400" />
            Kanban Board de Vendas em Tempo Real
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Visualização automatizada de cartões alimentada pelos eventos recebidos via Webhook Green.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {columns.map((col) => {
          const Icon = col.icon;
          const colTransactions = transactions.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className="glass-card rounded-2xl p-5 border border-white/10 bg-slate-950/60 flex flex-col justify-between min-h-[500px]"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white tracking-tight">{col.title}</h3>
                  </div>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-slate-900 border border-white/10 text-cyan-300 font-mono">
                    {colTransactions.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {colTransactions.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500 font-medium">
                      Nenhum cartão nesta coluna.
                    </div>
                  ) : (
                    colTransactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="p-4 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-500/40 transition-all space-y-2 shadow-sm"
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-mono text-cyan-400 font-bold">{tx.id}</span>
                          <span className="text-[10px] text-slate-400">{tx.timestamp}</span>
                        </div>
                        <div className="text-xs font-bold text-white">{tx.buyerName}</div>
                        <div className="flex justify-between items-center text-xs pt-2 border-t border-white/5">
                          <span className="font-mono text-cyan-300 font-black">
                            R$ {tx.amount.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase">{tx.paymentMethod}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
