import React, { useState } from 'react';
import { ProsperityLogo } from './ProsperityLogo';
import { soundFx } from '../../audio/soundFx';
import { 
  Play, 
  HelpCircle, 
  Sparkles, 
  Compass, 
  Briefcase, 
  PiggyBank, 
  TrendingUp, 
  Home, 
  Bell, 
  ShieldAlert, 
  Zap, 
  ChevronRight,
  UserCheck,
  Clock,
  Sliders
} from 'lucide-react';
import { ProgressionSpeed, LifeFocus } from '../../types/game';

interface TitleScreenProps {
  onStartGame: (archetypeId: string, speed: ProgressionSpeed, focus: LifeFocus) => void;
  hasExistingSave?: boolean;
  onResumeGame?: () => void;
}

export const ARCHETYPES = [
  {
    id: 'archetype_fresh_grad',
    name: 'Fresh Graduate',
    role: 'Entry-Level Associate',
    avatar: '🎓',
    salary: 48000,
    cash: 500,
    debt: 28000,
    difficulty: 'Normal',
    desc: 'Broke with $28,000 in student loans, but a blank canvas with 40+ years of compound interest ahead.',
    perk: 'Fast learner: University certificates take 25% less time.',
  },
  {
    id: 'archetype_blue_collar',
    name: 'Skilled Tradesperson',
    role: 'Electrician / Plumber',
    avatar: '🔧',
    salary: 62000,
    cash: 3500,
    debt: 4200,
    difficulty: 'Easy',
    desc: 'Virtually zero student debt, steady union cashflow, and strong discipline for blue-collar wealth building.',
    perk: 'Low debt drag: Starts with positive monthly cashflow immediately.',
  },
  {
    id: 'archetype_corp_climber',
    name: 'Corporate Climber',
    role: 'Junior Analyst',
    avatar: '💼',
    salary: 85000,
    cash: 2000,
    debt: 18000,
    difficulty: 'Challenging',
    desc: 'High income, but trapped by high-cost city rent, lifestyle creep temptations, and heavy workplace burnout.',
    perk: 'High salary ceiling: Rapid promotion raises at Apex Tower.',
  },
  {
    id: 'archetype_freelancer',
    name: 'Tech Freelancer',
    role: 'UI/UX & Code Soloist',
    avatar: '💻',
    salary: 72000,
    cash: 4000,
    debt: 6000,
    difficulty: 'Normal',
    desc: 'Loves flexibility and gig hustling at The Daily Grind Cafe, but faces variable monthly income swings.',
    perk: 'Side-hustle master: Double gig payouts at The Daily Grind Cafe.',
  },
];

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  hasExistingSave = false,
  onResumeGame,
}) => {
  const [selectedArch, setSelectedArch] = useState<string>('archetype_fresh_grad');
  const [selectedSpeed, setSelectedSpeed] = useState<ProgressionSpeed>('QUARTERLY');
  const [selectedFocus, setSelectedFocus] = useState<LifeFocus>('BALANCED');
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);

  const activeArch = ARCHETYPES.find((a) => a.id === selectedArch) || ARCHETYPES[0];

  const handleStart = () => {
    soundFx.playLevelUp();
    onStartGame(selectedArch, selectedSpeed, selectedFocus);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between overflow-y-auto selection:bg-emerald-500 selection:text-white">
      {/* Background Animated Gradient Mesh & Starfield */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-40 w-[30rem] h-[30rem] bg-cyan-500/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-[36rem] h-[36rem] bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 px-6 py-5 max-w-7xl mx-auto w-full flex items-center justify-between">
        <ProsperityLogo size="lg" />

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundFx.playClick();
              setShowHowToPlay(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold border border-slate-800 transition-all cursor-pointer backdrop-blur-md"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>How to Play & Win</span>
          </button>
        </div>
      </header>

      {/* Hero Body */}
      <main className="relative z-10 max-w-7xl mx-auto w-full px-6 py-4 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Mission, Value Prop & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>THE 2D OPEN-WORLD FINANCIAL LIFE RPG</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Escape the Rat Race. <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                Build Lasting Wealth.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              You step into <strong className="text-white">Prosperity City</strong> with $500 in your pocket and a rented room. 
              Clock in at Apex Tower, budget paychecks at the Bank Vault, dodge debt traps, compound index funds on Wall Street, 
              buy rental duplexes, and achieve complete <strong className="text-emerald-400">Financial Independence (FIRE)</strong>.
            </p>

            {/* 4 Core Pillars of Gameplay */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800/80">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">1. Work & Upskill</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Apex Tower & University</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800/80">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
                  <PiggyBank className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">2. 50/30/20 Vault</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">High-Yield Savings & Debt</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800/80">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">3. Wall St Stocks</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Index Funds & DCA</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800/80">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2">
                  <Home className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">4. Real Estate</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Passive Rental Income</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <button
                onClick={handleStart}
                className="group px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-emerald-500/25 flex items-center gap-3 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>START NEW CAREER ({activeArch.name.toUpperCase()})</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {hasExistingSave && onResumeGame && (
                <button
                  onClick={onResumeGame}
                  className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700/80 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Resume Current Career</span>
                </button>
              )}
            </div>

            {/* Quick Goal Callout */}
            <div className="flex items-center gap-2.5 text-xs text-slate-400 font-mono">
              <span className="text-amber-400 font-bold">🏆 Ultimate Win Condition:</span>
              <span>Reach <strong>$1,000,000 Net Worth</strong> or <strong>$4,000/mo Passive Income</strong> to ring the Freedom Bell!</span>
            </div>
          </div>

          {/* Right Column: Archetype Selector Preview */}
          <div className="lg:col-span-5">
            <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Select Starting Origin</span>
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  {activeArch.difficulty}
                </span>
              </div>

              {/* Archetype Cards Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {ARCHETYPES.map((arch) => {
                  const isSelected = arch.id === selectedArch;
                  return (
                    <button
                      key={arch.id}
                      onClick={() => {
                        soundFx.playClick();
                        setSelectedArch(arch.id);
                      }}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                          : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-2xl">{arch.avatar}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-white leading-tight">{arch.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{arch.role}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Archetype Detailed Inspection */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{activeArch.desc}"
                </p>

                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800/80 text-center font-mono">
                  <div className="p-2 rounded-xl bg-slate-900/60">
                    <span className="text-[9px] text-slate-400 block uppercase">Starting Salary</span>
                    <span className="font-bold text-xs text-emerald-400">${activeArch.salary.toLocaleString()}/yr</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/60">
                    <span className="text-[9px] text-slate-400 block uppercase">Starting Cash</span>
                    <span className="font-bold text-xs text-cyan-400">${activeArch.cash.toLocaleString()}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/60">
                    <span className="text-[9px] text-slate-400 block uppercase">Initial Debt</span>
                    <span className="font-bold text-xs text-rose-400">${activeArch.debt.toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-2">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Perk:</strong> {activeArch.perk}</span>
                </div>

                {/* Progression Speed Customization */}
                <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Progression Speed:</span>
                    </span>
                    <span className="font-mono text-cyan-400">{selectedSpeed}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'MONTHLY' as ProgressionSpeed, label: 'Monthly' },
                      { id: 'QUARTERLY' as ProgressionSpeed, label: 'Quarterly' },
                      { id: 'ANNUAL' as ProgressionSpeed, label: 'Annual' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSpeed(s.id)}
                        className={`py-1.5 rounded-xl text-[10px] font-bold border transition-colors cursor-pointer ${
                          selectedSpeed === s.id
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Starting Priority Focus */}
                <div className="pt-1.5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Life Priority Focus:</span>
                    </span>
                    <span className="font-mono text-emerald-400">{selectedFocus}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold">
                    {[
                      { id: 'BALANCED' as LifeFocus, label: '⚖️ Balanced' },
                      { id: 'HUSTLE' as LifeFocus, label: '💼 Career Hustle' },
                      { id: 'ZEN' as LifeFocus, label: '🌿 Zen Longevity' },
                      { id: 'FIRE_SPRINTER' as LifeFocus, label: '🚀 FIRE Sprinter' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setSelectedFocus(f.id)}
                        className={`py-1.5 px-2 rounded-xl border transition-colors text-left cursor-pointer truncate ${
                          selectedFocus === f.id
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer Bar */}
      <footer className="relative z-10 px-6 py-4 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 border-t border-slate-900">
        <div className="flex items-center gap-3">
          <span>Walk: <strong>WASD / Arrow Keys / Click Ground</strong></span>
          <span>•</span>
          <span>Interact: <strong>[E] / Space</strong></span>
          <span>•</span>
          <span>Inventory: <strong>[I]</strong></span>
        </div>
        <div className="mt-2 sm:mt-0 font-mono text-slate-400 text-[11px]">
          Prosperity City Metropolis v2.0 • 64x50 Map
        </div>
      </footer>

      {/* How to Play Modal */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel max-w-2xl w-full rounded-3xl p-6 border border-slate-700 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  🎮
                </div>
                <h3 className="font-black text-lg text-white">How to Play & Win Prosperity City</h3>
              </div>
              <button
                onClick={() => setShowHowToPlay(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="font-bold text-amber-400 text-sm block">1. What You Do When You Arrive:</span>
                <p>
                  You step off the train into the <strong>Town Plaza</strong> with $500 cash. 
                  A golden <strong>Guided Objective Compass</strong> at the top of your screen will point you toward your next milestone!
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-400 text-sm block">2. The 6-Chapter Campaign:</span>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  <li><strong>Chapter 1: The First Paycheck</strong> - Walk to Apex Career Tower and clock in your first shift.</li>
                  <li><strong>Chapter 2: The Emergency Shield</strong> - Open your 4.5% APY High-Yield Savings Vault at First Prosperity Bank.</li>
                  <li><strong>Chapter 3: Defeating Toxic Debt</strong> - Slay 24% credit card interest using the Avalanche method.</li>
                  <li><strong>Chapter 4: The Compound Engine</strong> - Buy your first S&P 500 index fund on Wall Street.</li>
                  <li><strong>Chapter 5: Real Estate Empire</strong> - Buy your first 2-unit rental duplex on Residential Row.</li>
                  <li><strong>Chapter 6: Financial Independence (FIRE)</strong> - Reach $1M Net Worth or $4k/mo passive income, then ring the Golden Freedom Bell!</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="font-bold text-cyan-400 text-sm block">3. Interactive In-Building Minigames:</span>
                <p>
                  Inside the <strong>Bank</strong>, play the <em>50/30/20 Vault Sorter</em>. 
                  Inside the <strong>Stock Exchange</strong>, play the <em>DCA Wave Rider</em>. 
                  Inside the <strong>MegaMart</strong>, play the <em>Smart Grocery Basket</em>. 
                  Earn bonus cash, XP, and unlock rare achievements!
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="font-bold text-purple-400 text-sm block">4. Controls & Navigation:</span>
                <p>
                  <strong>Move:</strong> WASD / Arrow Keys, or click anywhere on the street.<br />
                  <strong>Interact:</strong> Press [E] or Space near doors or citizens.<br />
                  <strong>Backpack:</strong> Press [I] to inspect items, pet your Compound Hound 🐕, and view certificates.<br />
                  <strong>Radar Mini-Map:</strong> Top-right corner shows the entire 64x50 city.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowHowToPlay(false)}
              className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors cursor-pointer"
            >
              GOT IT, LET'S PLAY!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
