'use client';

import React, { useState } from 'react';
import RoiLogo from './RoiLogo';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('gestor@roidigital.com.br');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      if (password === 'roidigital2026') {
        localStorage.setItem('roi_digital_authenticated', 'true');
        localStorage.setItem('roi_digital_user_email', email);
        onLoginSuccess();
      } else {
        setErrorMsg('Senha incorreta! Use a senha mestre roidigital2026 para acessar o dashboard.');
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden selection:bg-cyan-500 selection:text-slate-950">
      <div className="glass-card rounded-3xl p-8 sm:p-10 max-w-md w-full border border-cyan-500/30 bg-slate-900/90 shadow-2xl relative z-10 space-y-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <RoiLogo variant="vertical" size="lg" />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Acesso ao Dashboard PRO
          </h2>
          <p className="text-xs text-slate-400">
            Painel exclusivo de gestão de clientes, anúncios Meta Ads e Webhook Green Gateway.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5 text-xs">
            <label className="block font-bold text-slate-300">E-mail do Gestor</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="gestor@roidigital.com.br"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="block font-bold text-slate-300">Senha Mestre de Acesso</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite roidigital2026"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
            <p className="text-[11px] text-cyan-400 font-semibold mt-1">
              Dica: a senha é <code className="bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/30">roidigital2026</code>
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{isLoading ? 'Autenticando...' : 'Entrar no Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
