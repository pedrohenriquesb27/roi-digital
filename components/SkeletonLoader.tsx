import React from 'react';

export default function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-12 bg-slate-900 rounded-xl border border-white/5" />
      <div className="grid grid-cols-4 gap-4">
        <div className="h-24 bg-slate-900 rounded-2xl border border-white/5" />
        <div className="h-24 bg-slate-900 rounded-2xl border border-white/5" />
        <div className="h-24 bg-slate-900 rounded-2xl border border-white/5" />
        <div className="h-24 bg-slate-900 rounded-2xl border border-white/5" />
      </div>
    </div>
  );
}
