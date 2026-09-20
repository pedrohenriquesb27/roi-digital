'use client';

import React from 'react';
import { NotificationAlert } from '../lib/types';
import { Bell, CheckCircle2, AlertTriangle } from 'lucide-react';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: NotificationAlert[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onNavigateTab: (tab: string) => void;
}

export default function NotificationCenter({
  isOpen,
  onClose,
  alerts,
  onMarkAsRead,
  onMarkAllAsRead,
  onNavigateTab,
}: NotificationCenterProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-card rounded-2xl max-w-sm w-full h-full max-h-[600px] p-5 border border-cyan-500/30 bg-slate-900/95 shadow-2xl flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Central de Alertas</h3>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[460px] pr-1">
            {alerts.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 font-medium">
                Nenhum alerta pendente no momento.
              </div>
            ) : (
              alerts.map((a) => (
                <div
                  key={a.id}
                  onClick={() => {
                    onMarkAsRead(a.id);
                    if (a.targetTab) onNavigateTab(a.targetTab);
                  }}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    a.isRead ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-slate-900 border-cyan-500/30 text-white'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-cyan-300">{a.title}</span>
                    <span className="text-[10px] text-slate-500">{a.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-300">{a.description}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <button
          onClick={onMarkAllAsRead}
          className="w-full py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-400 hover:text-white"
        >
          Marcar todos como lidos
        </button>
      </div>
    </div>
  );
}
