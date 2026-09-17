'use client';

import React, { useState } from 'react';
import { Zap, Send, CheckCircle2 } from 'lucide-react';

interface GreenSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GreenSimulatorModal({ isOpen, onClose }: GreenSimulatorModalProps) {
  const [eventType, setEventType] = useState('venda_aprovada');
  const [amount, setAmount] = useState('97.00');
  const [buyerName, setBuyerName] = useState('Cliente Teste Green');
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleSend = async () => {
    setIsSending(true);
    setResult(null);

    const testCode = `GRN-${Math.floor(100000 + Math.random() * 900000)}`;
    const payload = {
      event: eventType,
      id: testCode,
      status: eventType === 'venda_aprovada' ? 'APROVADO' : 'PENDENTE',
      payment_method: 'PIX',
      buyer: { name: buyerName, email: 'cliente.teste@email.com' },
      product: { name: 'Checkup Financeiro Completo' },
      amount: parseFloat(amount) || 97.0,
      custom_data: { utm_source: 'facebook', utm_campaign: 'cbo_escala' },
    };

    try {
      const res = await fetch('/api/webhook/green', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setResult({ success: false, error: err.message });
    } finally {
      setIsSending(false);
    }
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
              <h3 className="text-base font-bold text-white tracking-tight">Simulador Webhook Green</h3>
              <p className="text-xs text-slate-400">Dispare eventos sem precisar do Ngrok</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">✕</button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-300">Tipo de Evento</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="venda_aprovada">Venda Aprovada (Ganho)</option>
              <option value="pedido_criado">Pix / Boleto Gerado (Pendente)</option>
              <option value="carrinho_abandonado">Carrinho Abandonado</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-slate-300">Nome do Comprador</label>
            <input
              type="text"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-slate-300">Valor da Venda (R$)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>

          {result && (
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>{result.message}</span>
            </div>
          )}

          <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
            <button
              onClick={handleSend}
              disabled={isSending}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? 'Disparando...' : 'Disparar Webhook Teste'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
