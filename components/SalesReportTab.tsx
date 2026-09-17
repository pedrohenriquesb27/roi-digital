'use client';

import React from 'react';
import { Client, Transaction, MetaCampaign } from '../lib/types';
import { FileSpreadsheet, Download, CheckCircle2 } from 'lucide-react';

interface SalesReportTabProps {
  clients: Client[];
  transactions: Transaction[];
  campaigns: MetaCampaign[];
}

export default function SalesReportTab({ clients, transactions, campaigns }: SalesReportTabProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  const handleDownloadPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/80">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6 text-cyan-400" />
            Gerador de Relatórios Executivos PDF
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gere relatórios consolidados de desempenho de vendas e tráfego pago para apresentação ao cliente.
          </p>
        </div>

        <button
          onClick={handleDownloadPdf}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Download className="w-4 h-4" /> Baixar / Imprimir PDF
        </button>
      </div>

      <div className="glass-card rounded-2xl p-8 border border-white/10 bg-slate-900/90 space-y-6 print:bg-white print:text-black">
        <div className="border-b border-white/10 pb-4">
          <h3 className="text-lg font-bold text-white">Relatório de Desempenho Mensal — ROI DIGITAL</h3>
          <p className="text-xs text-slate-400">Consolidado de Vendas Green Gateway + Meta Ads</p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block">Total de Clientes</span>
            <strong className="text-lg text-white font-bold">{clients.length}</strong>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block">Vendas Registradas</span>
            <strong className="text-lg text-cyan-400 font-bold">{transactions.length}</strong>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block">Investimento Meta Ads</span>
            <strong className="text-lg text-white font-bold">
              {formatCurrency(campaigns.reduce((acc, c) => acc + c.spend, 0))}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
