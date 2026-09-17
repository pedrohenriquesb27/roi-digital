'use client';

import React from 'react';
import { Transaction } from '../lib/types';
import { ShoppingBag, ArrowUpRight, DollarSign } from 'lucide-react';

interface TransactionsTableProps {
  transactions: Transaction[];
  onAddTransaction?: (newTx: Transaction) => void;
}

export default function TransactionsTable({ transactions }: TransactionsTableProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">Transações Recentes ao Vivo (Green Webhook)</h3>
        </div>
        <span className="text-xs text-slate-400">Total: {transactions.length} vendas</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-slate-400">
              <th className="pb-3 font-semibold">Código ID</th>
              <th className="pb-3 font-semibold">Cliente / Comprador</th>
              <th className="pb-3 font-semibold">Produto</th>
              <th className="pb-3 font-semibold">Pagamento</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-900/60">
                <td className="py-3 font-mono font-bold text-cyan-400">{t.id}</td>
                <td className="py-3 font-semibold text-white">{t.buyerName}</td>
                <td className="py-3 text-slate-300">{t.productName}</td>
                <td className="py-3 text-slate-400 uppercase">{t.paymentMethod}</td>
                <td className="py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'APROVADO'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                        : t.status === 'PENDENTE'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="py-3 text-right font-mono font-bold text-cyan-300">
                  {formatCurrency(t.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
