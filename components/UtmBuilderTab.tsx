'use client';

import React, { useState } from 'react';
import {
  Link as LinkIcon,
  Copy,
  Check,
  Globe,
  Sparkles,
  HelpCircle,
  Tag,
  Target,
  FileText,
  ExternalLink,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function UtmBuilderTab() {
  const defaultUtmParams =
    'utm_source=facebook&utm_medium={{adset.name}}&utm_campaign={{campaign.name}}&utm_content={{ad.id}}&utm_term={{placement}}';

  const [destinationUrl, setDestinationUrl] = useState('');
  const [copiedParams, setCopiedParams] = useState(false);
  const [copiedFullUrl, setCopiedFullUrl] = useState(false);

  // Generates final parameterized URL intelligently
  const generateFullUrl = () => {
    if (!destinationUrl.trim()) return '';
    let cleanUrl = destinationUrl.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }
    const separator = cleanUrl.includes('?') ? '&' : '?';
    return `${cleanUrl}${separator}${defaultUtmParams}`;
  };

  const fullGeneratedUrl = generateFullUrl();

  const handleCopyParams = () => {
    navigator.clipboard.writeText(defaultUtmParams);
    setCopiedParams(true);
    setTimeout(() => setCopiedParams(false), 2500);
  };

  const handleCopyFullUrl = () => {
    if (!fullGeneratedUrl) return;
    navigator.clipboard.writeText(fullGeneratedUrl);
    setCopiedFullUrl(true);
    setTimeout(() => setCopiedFullUrl(false), 2500);
  };

  const utmExplanations = [
    {
      param: 'utm_source',
      value: 'facebook',
      badge: 'Fixo',
      title: 'Origem da Tráfego',
      description: 'Identifica a rede social de onde o cliente veio (Facebook & Instagram Ads).',
      color: 'cyan',
    },
    {
      param: 'utm_medium',
      value: '{{adset.name}}',
      badge: 'Dinâmico Meta',
      title: 'Conjunto de Anúncios',
      description: 'O Meta substitui automaticamente pelo nome do seu Conjunto de Anúncios.',
      color: 'blue',
    },
    {
      param: 'utm_campaign',
      value: '{{campaign.name}}',
      badge: 'Dinâmico Meta',
      title: 'Nome da Campanha',
      description: 'Preenchido dinamicamente com o nome exato da sua Campanha no Gerenciador.',
      color: 'blue',
    },
    {
      param: 'utm_content',
      value: '{{ad.id}}',
      badge: 'Chave Crítica 🎯',
      title: 'ID do Anúncio (Criativo)',
      description:
        'Responsável pelo match exato do criativo no painel. Garante a rastreabilidade do anúncio que gerou a venda na Green.',
      color: 'emerald',
      highlight: true,
    },
    {
      param: 'utm_term',
      value: '{{placement}}',
      badge: 'Dinâmico Meta',
      title: 'Posicionamento do Anúncio',
      description: 'Mapeia onde o anúncio apareceu (Feed Instagram, Stories, Reels, Facebook, etc.).',
      color: 'cyan',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Cabeçalho Limpo */}
      <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950/40 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
              <LinkIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  Gerador Utilitário
                </span>
                <span className="text-xs font-semibold text-slate-400">Meta Ads ➔ Webhook Green</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
                Códigos & Gerador de UTM
              </h2>
            </div>
          </div>

          <div className="text-xs text-slate-400 max-w-xs sm:text-right font-medium">
            Copie os parâmetros recomendados ou monte a URL completa para colar no Gerenciador de Anúncios.
          </div>
        </div>
      </div>

      {/* BLOCO 1: STRING DE PARAMETROS PADRÃO RECOMENDADA */}
      <div className="glass-card rounded-2xl p-6 border border-cyan-500/40 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-blue-950/60 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Padrão Recomendado de UTM para o Meta Ads
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Cole diretamente no campo <strong className="text-cyan-300">"Parâmetros de URL"</strong> no Facebook Ads
          </span>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              readOnly
              value={defaultUtmParams}
              className="w-full bg-slate-950 border border-cyan-500/40 rounded-xl px-4 py-3.5 pr-36 text-xs font-mono text-cyan-300 font-bold shadow-inner focus:outline-none"
            />
            <button
              onClick={handleCopyParams}
              className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-md ${
                copiedParams
                  ? 'bg-emerald-500 text-slate-950 border border-emerald-400'
                  : 'bg-gradient-to-r from-blue-600 via-cyan-500 to-cyan-400 text-slate-950 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {copiedParams ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar UTMs</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-slate-400">
            💡 <strong>Onde colocar no Meta Ads?</strong> No Gerenciador de Anúncios, na edição do Anúncio (nível de Criativo), role até a seção <strong className="text-slate-200">"Rastreamento"</strong> ➔ Cole no campo <strong className="text-cyan-400">Parâmetros de URL</strong>.
          </p>
        </div>
      </div>

      {/* BLOCO 2: GERADOR DINÂMICO DE URL COMPLETA */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-5 bg-slate-900/60">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Globe className="w-5 h-5 text-blue-400" />
          <h3 className="text-base font-bold text-white tracking-tight">
            Montador Instantâneo de URL Parametrizada
          </h3>
        </div>

        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-200">
              Digite ou cole a URL do seu Site / Página de Vendas / Checkout:
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                placeholder="Ex: https://meusite.com.br/checkout"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Resultado Gerado */}
          {destinationUrl.trim() && (
            <div className="space-y-2 pt-2 animate-fadeIn">
              <label className="block font-bold text-cyan-400 flex items-center gap-1.5">
                <ArrowRight className="w-4 h-4" /> URL Final Completa com UTMs:
              </label>

              <div className="relative">
                <textarea
                  readOnly
                  rows={3}
                  value={fullGeneratedUrl}
                  className="w-full bg-slate-950 border border-cyan-500/40 rounded-xl p-3.5 pr-36 text-xs font-mono text-cyan-300 font-semibold focus:outline-none resize-none shadow-inner"
                />

                <button
                  onClick={handleCopyFullUrl}
                  className={`absolute right-3 top-3 px-4 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-md ${
                    copiedFullUrl
                      ? 'bg-emerald-500 text-slate-950 border border-emerald-400'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
                  }`}
                >
                  {copiedFullUrl ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar URL Completa</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BLOCO 3: GUIA VISUAL E EXPLICATIVO DOS PARÂMETROS */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          Entenda a Função de Cada Parâmetro no Rastreamento
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {utmExplanations.map((item) => (
            <div
              key={item.param}
              className={`glass-card p-5 rounded-2xl border transition-all space-y-3 relative overflow-hidden ${
                item.highlight
                  ? 'border-emerald-500/50 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-emerald-950/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                  : 'border-white/10 bg-slate-950/60 hover:border-cyan-500/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-lg border border-cyan-500/20">
                  {item.param}
                </span>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                    item.highlight
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-900 text-slate-400 border-white/10'
                  }`}
                >
                  {item.badge}
                </span>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-400 uppercase font-mono">{item.value}</div>
                <h4 className="text-sm font-bold text-white mt-1">{item.title}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
