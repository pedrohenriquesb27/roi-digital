import React from 'react';

interface RoiLogoProps {
  variant?: 'horizontal' | 'vertical' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

export default function RoiLogo({ variant = 'horizontal', size = 'md' }: RoiLogoProps) {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'h-6 text-sm';
      case 'lg':
        return 'h-12 text-2xl';
      default:
        return 'h-8 text-lg';
    }
  };

  return (
    <div className={`flex items-center gap-2 ${getSizeStyles()}`}>
      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-600 via-cyan-500 to-cyan-400 font-black text-slate-950 flex items-center justify-center text-xs shadow-lg shadow-cyan-500/30">
        ROI
      </div>
      {variant !== 'icon' && (
        <span className="font-black text-white tracking-wider">
          ROI <span className="text-cyan-400 font-extrabold">DIGITAL</span>
        </span>
      )}
    </div>
  );
}
