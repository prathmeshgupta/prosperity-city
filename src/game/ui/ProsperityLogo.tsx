import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const ProsperityLogo: React.FC<LogoProps> = ({ size = 'md', showSubtitle = true }) => {
  const sizeMap = {
    sm: { width: 140, height: 38, text: 'text-sm', sub: 'text-[8px]', icon: 'w-7 h-7' },
    md: { width: 220, height: 56, text: 'text-lg', sub: 'text-[10px]', icon: 'w-10 h-10' },
    lg: { width: 340, height: 80, text: 'text-2xl', sub: 'text-xs', icon: 'w-14 h-14' },
    xl: { width: 440, height: 110, text: 'text-3xl sm:text-4xl', sub: 'text-xs sm:text-sm', icon: 'w-16 h-16 sm:w-20 sm:h-20' },
  };

  const cur = sizeMap[size];

  return (
    <div className="flex items-center gap-3 select-none">
      {/* 3D Geometric Vector Shield / City Skyline Emblem */}
      <div className={`relative ${cur.icon} shrink-0`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_4px_16px_rgba(16,185,129,0.4)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="skylineGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="beamGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Outer Hexagonal Shield */}
          <polygon
            points="50,4 92,25 92,75 50,96 8,75 8,25"
            fill="url(#shieldGrad)"
            stroke="url(#goldGrad)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Inner Dark Backdrop */}
          <polygon
            points="50,11 85,28 85,72 50,89 15,72 15,28"
            fill="url(#skylineGrad)"
            stroke="#065f46"
            strokeWidth="1.5"
          />

          {/* Upward Growth Diagonal Beam */}
          <path
            d="M 22 70 L 78 28 L 78 70 Z"
            fill="url(#beamGrad)"
          />

          {/* City Skyline Silhouettes */}
          {/* Skyscraper 1 */}
          <rect x="24" y="44" width="10" height="28" fill="#334155" rx="1" />
          <rect x="26" y="38" width="6" height="6" fill="#475569" />
          {/* Central Apex Tower */}
          <rect x="38" y="28" width="14" height="44" fill="#0ea5e9" rx="1.5" />
          <polygon points="45,18 43,28 47,28" fill="#38bdf8" />
          {/* Bank Columns Silhouette */}
          <rect x="56" y="42" width="12" height="30" fill="#f59e0b" rx="1" />
          <polygon points="62,34 54,42 70,42" fill="#fbbf24" />
          {/* Clock Tower / Skyscraper 3 */}
          <rect x="72" y="50" width="8" height="22" fill="#64748b" rx="1" />

          {/* Windows Glowing */}
          <circle cx="42" cy="36" r="1.2" fill="#fef08a" />
          <circle cx="48" cy="36" r="1.2" fill="#fef08a" />
          <circle cx="42" cy="44" r="1.2" fill="#fef08a" />
          <circle cx="48" cy="44" r="1.2" fill="#fef08a" />
          <circle cx="42" cy="52" r="1.2" fill="#fef08a" />
          <circle cx="48" cy="52" r="1.2" fill="#fef08a" />

          {/* Rising Bullish Exponential Trendline with Golden Arrowhead */}
          <path
            d="M 18 68 Q 45 64 78 26"
            stroke="url(#goldGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <polygon
            points="81,23 72,25 78,32"
            fill="#fbbf24"
            stroke="#b45309"
            strokeWidth="1"
          />

          {/* Shimmer Star */}
          <circle cx="81" cy="23" r="2.5" fill="#ffffff" />
        </svg>
      </div>

      {/* Typography */}
      <div>
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-tight ${cur.text} bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(16,185,129,0.3)] uppercase`}
            style={{ fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}
          >
            Prosperity City
          </span>
          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 uppercase tracking-widest shadow-sm">
            RPG
          </span>
        </div>
        {showSubtitle && (
          <p className={`${cur.sub} font-semibold text-slate-400 tracking-wider uppercase flex items-center gap-1.5`}>
            <span>Wealth</span>
            <span className="text-emerald-500">•</span>
            <span>Investing</span>
            <span className="text-emerald-500">•</span>
            <span>Life Simulator</span>
          </p>
        )}
      </div>
    </div>
  );
};
