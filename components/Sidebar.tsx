'use client';

import React from 'react';
import {
  BarChart3,
  Users,
  Sliders,
  DollarSign,
  TrendingUp,
  FileSpreadsheet,
  PieChart,
  LogOut,
  Zap,
  Tag,
  Link as LinkIcon,
  Globe,
} from 'lucide-react';
import RoiLogo from './RoiLogo';

export type NavTabId =
  | 'overview'
  | 'kanban'
  | 'meta'
  | 'landing'
  | 'simulator'
  | 'report'
  | 'utm'
  | 'clients'
  | 'webhook'
  | 'config';

interface SidebarProps {
  activeTab: NavTabId;
  setActiveTab: (tab: NavTabId) => void;
  onOpenConfigModal: () => void;
  clientName?: string;
  onLogout?: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  onOpenConfigModal,
  clientName = 'Pedro Silva',
  onLogout,
}: SidebarProps) {
  const menuItems = [
    {
      id: 'overview' as NavTabId,
      label: 'Visão Geral',
      icon: BarChart3,
      badge: 'Principal',
    },
    {
      id: 'kanban' as NavTabId,
      label: 'Kanban Board',
      icon: DollarSign,
      badge: 'Vendas',
    },
    {
      id: 'meta' as NavTabId,
      label: 'Meta Ads',
      icon: TrendingUp,
      badge: 'Tráfego',
    },
    {
      id: 'landing' as NavTabId,
      label: 'Performance da Página',
      icon: Globe,
      badge: 'Páginas',
    },
    {
      id: 'simulator' as NavTabId,
      label: 'Simulador Escala',
      icon: PieChart,
      badge: 'What-If',
    },
    {
      id: 'report' as NavTabId,
      label: 'Relatórios PDF',
      icon: FileSpreadsheet,
    },
    {
      id: 'utm' as NavTabId,
      label: 'Códigos de UTM',
      icon: LinkIcon,
      badge: 'Gerador',
    },
    {
      id: 'clients' as NavTabId,
      label: 'Gestão de Clientes',
      icon: Users,
      badge: '3-Etapas',
    },
    {
      id: 'webhook' as NavTabId,
      label: 'Integrar Webhook',
      icon: Zap,
    },
    {
      id: 'config' as NavTabId,
      label: 'Integrar Meta Ads',
      icon: Sliders,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-72 bg-slate-950/95 border-r border-white/10 p-5 flex flex-col justify-between z-40 backdrop-blur-2xl hidden lg:flex">
      <div className="space-y-6">
        {/* Logo Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <RoiLogo variant="horizontal" size="md" />
        </div>

        {/* User Card */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 font-black text-slate-950 flex items-center justify-center text-xs shadow-md shadow-cyan-500/20">
              PS
            </div>
            <div>
              <div className="text-xs font-bold text-white">{clientName}</div>
              <div className="text-[10px] text-cyan-400 font-medium">Gestor de Tráfego</div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Sair do Sistema"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-slate-950 stroke-[2.5]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      isActive
                        ? 'bg-slate-950 text-cyan-400'
                        : 'bg-slate-900 text-slate-400 border border-white/5'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Branding */}
      <div className="pt-4 border-t border-white/10 text-center space-y-2">
        <div className="text-[11px] font-bold text-slate-400 flex items-center justify-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          ROI DIGITAL — v2.5.0 PRO
        </div>
        <div className="text-[10px] text-slate-500">
          Sincronização Meta API & Green Webhook 200 OK
        </div>
      </div>
    </aside>
  );
}
