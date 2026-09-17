'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  subValue?: string;
  changePercent?: number;
  icon: LucideIcon;
  variant?: 'cyan' | 'blue' | 'warning' | 'neutral' | 'default';
  tooltipText?: string;
}

export default function MetricCard({
  title,
  value,
  subValue,
  changePercent,
  icon: Icon,
  variant = 'default',
  tooltipText,
}: MetricCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'cyan':
        return 'border-cyan-500/40 bg-slate-900/90 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.1)]';
      case 'blue':
        return 'border-blue-500/40 bg-slate-900/90 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.1)]';
      case 'warning':
        return 'border-amber-500/40 bg-slate-900/90 text-amber-300';
      case 'neutral':
        return 'border-slate-800 bg-slate-900/80 text-slate-300';
      default:
        return 'border-white/10 bg-slate-900/80 text-white';
    }
  };

  return (
    <div
      className={`p-5 rounded-2xl border ${getVariantStyles()} backdrop-blur-md transition-all duration-300 hover:scale-[1.01] flex flex-col justify-between group relative`}
      title={tooltipText}
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {title}
          </span>
          <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5 group-hover:border-cyan-500/30 transition-colors">
            <Icon className="w-4 h-4 text-cyan-400" />
          </div>
        </div>

        <div className="text-2xl font-black tracking-tight text-white">{value}</div>
        {subValue && <div className="text-xs text-slate-400 mt-1 font-medium">{subValue}</div>}
      </div>

      {changePercent !== undefined && (
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold">
          <span className="text-slate-500 text-[10px]">Variação Recente</span>
          <span className={changePercent >= 0 ? 'text-cyan-400' : 'text-rose-400'}>
            {changePercent >= 0 ? `+${changePercent}%` : `${changePercent}%`}
          </span>
        </div>
      )}
    </div>
  );
}
