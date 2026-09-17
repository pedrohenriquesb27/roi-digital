'use client';

import React, { useEffect } from 'react';
import RoiLogo from './RoiLogo';

interface SplashScreenProps {
  onFinish: () => void;
  durationMs?: number;
}

export default function SplashScreen({ onFinish, durationMs = 1800 }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, durationMs);
    return () => clearTimeout(timer);
  }, [onFinish, durationMs]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center animate-fadeOut">
      <div className="flex flex-col items-center space-y-4 animate-scaleUp">
        <RoiLogo variant="vertical" size="lg" />
        <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
