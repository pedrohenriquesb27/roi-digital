import React from 'react';
import { Sliders, Key, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { MetaApiConfig } from '../lib/types';

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: MetaApiConfig;
  onSave: (newConfig: MetaApiConfig) => void;
}

export default function ApiConfigModal({
  isOpen,
  onClose,
  config,
  onSave,
}: ApiConfigModalProps) {
  const [accessToken, setAccessToken] = React.useState(config.accessToken);
  const [adAccountId, setAdAccountId] = React.useState(config.adAccountId);
  const [pixelId, setPixelId] = React.useState(config.pixelId);
  const [testResult, setTestResult] = React.useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = React.useState(false);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/meta-ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test_connection',
          accessToken,
          adAccountId,
        }),
      });
      const data = await res.json();
      setTestResult({
        success: data.success,
        message: data.message || 'API Meta Ads respondendo com sucesso.',
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: 'Erro ao conectar à API: ' + err.message,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      accessToken,
      adAccountId,
      pixelId,
      isConnected: testResult ? testResult.success : config.isConnected,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-card rounded-2xl max-w-lg w-full p-6 border border-cyan-500/30 bg-slate-900/95 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Configurações de API Meta Ads</h3>
              <p className="text-xs text-slate-400">Insira as credenciais da Meta Graph API para sincronização em tempo real</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-cyan-400" /> Token de Acesso do Usuário do Sistema (Meta)
            </label>
            <input
              type="password"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="EAAG9823019847..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Ad Account ID</label>
              <input
                type="text"
                value={adAccountId}
                onChange={(e) => setAdAccountId(e.target.value)}
                placeholder="act_389201948"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Pixel ID</label>
              <input
                type="text"
                value={pixelId}
                onChange={(e) => setPixelId(e.target.value)}
                placeholder="98201948102"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 border ${
                testResult.success
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold hover:bg-slate-700 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              Testar Conexão API
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs font-semibold hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-md shadow-cyan-500/20"
              >
                Salvar Credenciais
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
