import React from 'react';
import { GameMode, GameState } from '../types/game';
import { getNetWorth } from '../engine/gameEngine';
import { soundFx } from '../audio/soundFx';
import { 
  Gamepad2,
  Compass, 
  FlaskConical, 
  GraduationCap, 
  Puzzle, 
  BarChart3, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Play,
  Heart,
  Smile,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

interface NavbarProps {
  state: GameState;
  activeMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onAdvanceTurn: () => void;
  onResetGame: () => void;
  isTurnLoading?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  state,
  activeMode,
  onSelectMode,
  onAdvanceTurn,
  onResetGame,
  isTurnLoading = false,
}) => {
  const [isMuted, setIsMuted] = React.useState(soundFx.getMuted());
  const netWorth = getNetWorth(state);

  const toggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
    if (!muted) soundFx.playClick();
  };

  const navItems: { mode: GameMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { mode: 'rpg', label: 'Prosperity City RPG', icon: <Gamepad2 className="w-4 h-4 text-emerald-400" />, badge: 'WORLD' },
    { mode: 'story', label: 'Executive Odyssey', icon: <Compass className="w-4 h-4" /> },
    { mode: 'sandbox', label: 'Wealth Lab', icon: <FlaskConical className="w-4 h-4" />, badge: 'Sim' },
    { mode: 'academy', label: 'Academy', icon: <GraduationCap className="w-4 h-4" />, badge: `${state.totalXP} XP` },
    { mode: 'expansions', label: 'Expansions', icon: <Puzzle className="w-4 h-4" />, badge: `${state.activeExpansionIds.length}` },
    { mode: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectMode('story')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-xl">
                🪙
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  FinTwist
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  v2.0
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-400 font-medium">
                The Wealth & Life Odyssey
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            {navItems.map((item) => {
              const isActive = activeMode === item.mode;
              return (
                <button
                  key={item.mode}
                  onClick={() => {
                    soundFx.playClick();
                    onSelectMode(item.mode);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all relative ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  <span className="hidden md:inline">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold leading-tight ${
                        isActive
                          ? 'bg-emerald-950 text-emerald-300'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick HUD & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Player Mini Status */}
            <div className="hidden lg:flex items-center gap-3 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <div className="flex items-center gap-1.5" title="Character Happiness">
                <Smile className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold text-slate-200">{state.character.happiness}%</span>
              </div>
              <div className="w-px h-3 bg-slate-700" />
              <div className="flex items-center gap-1.5" title="Physical Health">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span className="font-semibold text-slate-200">{state.character.health}%</span>
              </div>
              <div className="w-px h-3 bg-slate-700" />
              <div className="flex items-center gap-1.5" title="Credit Score">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-semibold text-slate-200">{state.character.creditScore}</span>
              </div>
            </div>

            {/* Net Worth Chip */}
            <div className="flex flex-col items-end px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                Net Worth
              </span>
              <span
                className={`font-mono text-xs sm:text-sm font-bold ${
                  netWorth >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                ${netWorth.toLocaleString()}
              </span>
            </div>

            {/* Advance Turn Button */}
            <button
              onClick={() => {
                soundFx.playClick();
                onAdvanceTurn();
              }}
              disabled={isTurnLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer font-sans disabled:opacity-50"
              title="Advance one quarter (3 months)"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold">Next Qtr</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 transition-colors"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* New / Reset Game */}
            <button
              onClick={() => {
                if (window.confirm('Start a new game session with a different character or clean slate?')) {
                  onResetGame();
                }
              }}
              className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-amber-400 hover:bg-slate-800 border border-slate-800 transition-colors"
              title="Start New Life Odyssey"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
