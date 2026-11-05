import React, { useState } from 'react';
import { GameState, SideHustle } from '../../types/game';
import { soundFx } from '../../audio/soundFx';
import { Briefcase, TrendingUp, Sparkles, Plus, CheckCircle, Clock } from 'lucide-react';

interface CareerHubProps {
  state: GameState;
  onUpdateState: (newState: GameState) => void;
}

export const CareerHub: React.FC<CareerHubProps> = ({ state, onUpdateState }) => {
  const [toast, setToast] = useState<string | null>(null);

  const availableCertifications = [
    {
      id: 'cert_ai_tools',
      title: 'Applied AI & Automation Certificate',
      cost: 600,
      salaryBonus: 5000,
      description: 'Master AI productivity tools and workflow automation to dramatically increase your workplace output.',
    },
    {
      id: 'cert_pmp',
      title: 'Project Management Professional (PMP)',
      cost: 1200,
      salaryBonus: 8500,
      description: 'Lead enterprise-wide initiatives and negotiate a senior operational title.',
    },
    {
      id: 'cert_leadership',
      title: 'Executive Communication & Negotiation',
      cost: 950,
      salaryBonus: 7000,
      description: 'Sharpen executive presence and high-stakes negotiation skills.',
    },
  ];

  const availableHustles: SideHustle[] = [
    {
      id: 'hustle_tutoring',
      title: 'Online STEM & Language Tutoring',
      monthlyIncome: 450,
      hoursPerWeek: 5,
      startupCost: 150,
      isActive: false,
      description: 'Tutor students in math or coding 5 hours per week during evenings.',
    },
    {
      id: 'hustle_freelance_consulting',
      title: 'Digital Freelance Consulting',
      monthlyIncome: 900,
      hoursPerWeek: 8,
      startupCost: 500,
      isActive: false,
      description: 'Offer contract consulting on weekends to small business clients.',
    },
    {
      id: 'hustle_content_channel',
      title: 'Niche Finance & Tech Newsletter',
      monthlyIncome: 650,
      hoursPerWeek: 6,
      startupCost: 200,
      isActive: false,
      description: 'Build a dedicated subscriber base and monetize with sponsorships.',
    },
  ];

  const handleBuyCert = (cert: typeof availableCertifications[0]) => {
    if (state.cash < cert.cost) {
      setToast('Insufficient cash to enroll in certification');
      setTimeout(() => setToast(null), 3000);
      return;
    }

    soundFx.playLevelUp();
    state.cash -= cert.cost;
    state.character.annualSalary += cert.salaryBonus;
    state.character.happiness = Math.min(100, state.character.happiness + 5);
    state.recentEvents.push({
      month: state.month,
      text: `Earned ${cert.title}! Annual salary increased by $${cert.salaryBonus.toLocaleString()}/yr.`,
      type: 'positive',
    });
    setToast(`🎉 Completed ${cert.title}! Salary boosted by $${cert.salaryBonus.toLocaleString()}/yr.`);
    setTimeout(() => setToast(null), 3500);
    onUpdateState({ ...state });
  };

  const handleToggleHustle = (hustle: SideHustle) => {
    const existing = state.sideHustles.find((h) => h.id === hustle.id);
    if (!existing) {
      if (state.cash < hustle.startupCost) {
        setToast('Insufficient cash for initial setup costs');
        setTimeout(() => setToast(null), 3000);
        return;
      }
      soundFx.playCoin();
      state.cash -= hustle.startupCost;
      state.sideHustles.push({ ...hustle, isActive: true });
      state.character.happiness = Math.max(10, state.character.happiness - 3); // time commitment
      setToast(`Launched side hustle: ${hustle.title} (+$${hustle.monthlyIncome}/mo)!`);
    } else {
      soundFx.playClick();
      existing.isActive = !existing.isActive;
      setToast(`${hustle.title} is now ${existing.isActive ? 'active' : 'paused'}.`);
    }
    setTimeout(() => setToast(null), 3500);
    onUpdateState({ ...state });
  };

  return (
    <div className="space-y-6">
      
      {/* Toast */}
      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <span>Career Engine & Human Capital</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Your Primary Income Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Your human capital and earning capacity are your greatest initial assets. Upskilling yields permanent compound returns.
          </p>
        </div>

        <div className="bg-slate-900/90 px-4 py-2.5 rounded-2xl border border-slate-800 text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Salary</span>
          <span className="font-mono text-2xl font-extrabold text-emerald-400">
            ${state.character.annualSalary.toLocaleString()}
            <span className="text-xs text-slate-400 font-sans font-normal ml-1">/ year</span>
          </span>
        </div>
      </div>

      {/* Professional Certifications & Upskilling */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-amber-400" />
          High-ROI Certifications & Credentials
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Investing $1,000 in your career skills that produces a $5,000/year raise is an immediate 500% annual return on your money.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {availableCertifications.map((cert) => (
            <div
              key={cert.id}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <h4 className="font-bold text-xs text-white mb-1">{cert.title}</h4>
                <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                  {cert.description}
                </p>
                <div className="flex items-center justify-between text-xs font-mono font-bold py-1.5 border-t border-slate-800/80 mb-3">
                  <span className="text-slate-400">Cost: ${cert.cost}</span>
                  <span className="text-emerald-400">+{cert.salaryBonus.toLocaleString()}/yr</span>
                </div>
              </div>

              <button
                onClick={() => handleBuyCert(cert)}
                className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                Enroll & Unlock Raise
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Side Hustles Hub */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-teal-400" />
          Side Hustles & Secondary Cash Flow
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Diversify your income streams to accelerate debt payoff and supercharge index fund investing.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {availableHustles.map((hustle) => {
            const activeHustle = state.sideHustles.find((h) => h.id === hustle.id);
            const isRunning = Boolean(activeHustle && activeHustle.isActive);

            return (
              <div
                key={hustle.id}
                className={`p-4 rounded-xl border flex flex-col justify-between ${
                  isRunning
                    ? 'bg-teal-950/20 border-teal-800/40'
                    : 'bg-slate-900/70 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-xs text-white">{hustle.title}</h4>
                    {isRunning && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                    {hustle.description}
                  </p>
                  <div className="text-xs font-mono font-bold mb-3 flex items-center justify-between text-slate-300">
                    <span>+{hustle.monthlyIncome}/mo</span>
                    <span className="text-slate-400 font-sans font-normal text-[10px]">
                      {hustle.hoursPerWeek} hrs/week
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleHustle(hustle)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isRunning
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      : 'bg-teal-500 hover:bg-teal-400 text-slate-950'
                  }`}
                >
                  {isRunning ? 'Pause Hustle' : `Start Hustle ($${hustle.startupCost} setup)`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
