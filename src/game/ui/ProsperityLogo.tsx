import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const ProsperityLogo: React.FC<LogoProps> = ({ size = 'md', showSubtitle = true }) => {
  const sizeMap = {
    sm: { text: 'text-base sm:text-lg', sub: 'text-[9px]', icon: 'w-8 h-8', badge: 'text-[8px] px-1 py-0.2' },
    md: { text: 'text-xl sm:text-2xl', sub: 'text-[10px]', icon: 'w-11 h-11', badge: 'text-[9px] px-1.5 py-0.5' },
    lg: { text: 'text-2xl sm:text-3xl', sub: 'text-xs', icon: 'w-14 h-14', badge: 'text-[10px] px-2 py-0.5' },
    xl: { text: 'text-3xl sm:text-5xl', sub: 'text-xs sm:text-sm', icon: 'w-16 h-16 sm:w-20 sm:h-20', badge: 'text-xs px-2.5 py-1' },
  };

  const cur = sizeMap[size];

  return (
    <div className="flex items-center gap-3 select-none group">
      {/* 3D Gold & Emerald Vector Emblem */}
      <div className={`relative ${cur.icon} shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_4px_20px_rgba(16,185,129,0.5)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="pGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="70%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id="pEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>
            <linearGradient id="pSkylineGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#020617" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <radialGradient id="pGlowRadial" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
            <filter id="pGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Ambient Glow */}
          <circle cx="50" cy="50" r="46" fill="url(#pGlowRadial)" />

          {/* Outer Golden Coin Rim */}
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="url(#pSkylineGrad)"
            stroke="url(#pGoldGrad)"
            strokeWidth="3.5"
          />

          {/* Inner Hexagonal Shield */}
          <polygon
            points="50,14 82,30 82,70 50,86 18,70 18,30"
            fill="url(#pEmeraldGrad)"
            stroke="url(#pGoldGrad)"
            strokeWidth="2"
          />

          {/* Central Deep Chamber */}
          <polygon
            points="50,19 77,33 77,67 50,81 23,67 23,33"
            fill="url(#pSkylineGrad)"
          />

          {/* City Skyline Silhouettes */}
          {/* Left Tower */}
          <rect x="28" y="44" width="9" height="25" fill="#334155" rx="1" />
          <rect x="30" y="39" width="5" height="5" fill="#475569" />
          {/* Apex Central Skyscraper */}
          <rect x="42" y="27" width="16" height="42" fill="#0284c7" rx="1.5" />
          <polygon points="50,18 47,27 53,27" fill="#38bdf8" />
          {/* Wall Street Bank Pillars */}
          <rect x="63" y="42" width="11" height="27" fill="#f59e0b" rx="1" />
          <polygon points="68.5,35 61,42 76,42" fill="#fde047" />

          {/* Glowing Windows */}
          <circle cx="46" cy="34" r="1.2" fill="#fef08a" />
          <circle cx="54" cy="34" r="1.2" fill="#fef08a" />
          <circle cx="46" cy="42" r="1.2" fill="#fef08a" />
          <circle cx="54" cy="42" r="1.2" fill="#fef08a" />
          <circle cx="46" cy="50" r="1.2" fill="#fef08a" />
          <circle cx="54" cy="50" r="1.2" fill="#fef08a" />

          {/* Exponential Compounding Curve (Bull Market Arrow) */}
          <path
            d="M 22 66 Q 48 64 77 26"
            stroke="url(#pGoldGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <polygon
            points="81,22 71,25 77,33"
            fill="#fbbf24"
            stroke="#92400e"
            strokeWidth="1"
          />

          {/* Shimmer Specular Star */}
          <circle cx="81" cy="22" r="2.5" fill="#ffffff" filter="url(#pGlowFilter)" />
        </svg>
      </div>

      {/* Typography & Crest */}
      <div>
        <div className="flex items-center gap-2">
          <span
            className={`font-black tracking-tight ${cur.text} bg-gradient-to-r from-emerald-300 via-teal-100 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(16,185,129,0.4)] uppercase`}
            style={{ fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}
          >
            Prosperity City
          </span>
          <span className={`font-black ${cur.badge} rounded-md bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 uppercase tracking-widest shadow-md shadow-emerald-950/40 border border-amber-300/40`}>
            RPG
          </span>
        </div>
        {showSubtitle && (
          <p className={`${cur.sub} font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5 mt-0.5`}>
            <span className="text-emerald-400">Wealth</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400">Investing</span>
            <span className="text-slate-600">•</span>
            <span className="text-amber-400">Freedom Simulator</span>
          </p>
        )}
      </div>
    </div>
  );
};
