import React, { useState } from 'react';
import { GameState, DebtItem } from '../../types/game';
import { transferCashEmergency, payExtraDebt } from '../../engine/gameEngine';
import { soundFx } from '../../audio/soundFx';
import { 
  PiggyBank, 
  Wallet, 
  Flame, 
  ShieldCheck, 
  ArrowLeftRight, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  Info
} from 'lucide-react';

interface BankingHubProps {
  state: GameState;
  onUpdateState: (newState: GameState) => void;
}

export const BankingHub: React.FC<BankingHubProps> = ({ state, onUpdateState }) => {
  const [transferAmount, setTransferAmount] = useState<number>(500);
  const [transferDirection, setTransferDirection] = useState<'to_emergency' | 'to_checking'>('to_emergency');
  const [selectedDebt, setSelectedDebt] = useState<DebtItem | null>(null);
  const [debtPayAmount, setDebtPayAmount] = useState<number>(500);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleTransfer = () => {
    const res = transferCashEmergency(state, transferAmount, transferDirection);
    setToastMessage(res.message);
    if (res.success) {
      soundFx.playCoin();
      onUpdateState(res.nextState);
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePayDebt = () => {
    if (!selectedDebt) return;
    const res = payExtraDebt(state, selectedDebt.id, debtPayAmount);
    setToastMessage(res.message);
    if (res.success) {
      onUpdateState(res.nextState);
      setSelectedDebt(null);
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  const totalDebt = state.debts.reduce((sum, d) => sum + d.principal, 0);

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Checking Account */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Daily Checking Account</h3>
                <span className="text-[11px] text-slate-400">Primary operational cash flow</span>
              </div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
              0.01% APY
            </span>
          </div>

          <div className="mb-4">
            <span className="text-xs text-slate-400 block mb-0.5">Liquid Balance</span>
            <div className="font-mono text-3xl font-extrabold text-white">
              ${Math.round(state.cash).toLocaleString()}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/80">
            💡 Rule of thumb: Keep 1-2 months of living expenses in checking to pay bills. Excess cash should be parked in your High-Yield Savings Account.
          </p>
        </div>

        {/* High-Yield Savings Account (Emergency Fund) */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <PiggyBank className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">High-Yield Emergency Fund</h3>
                <span className="text-[11px] text-slate-400">Safe, liquid capital buffer</span>
              </div>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold font-mono">
              {(state.hysaInterestRate * 100).toFixed(1)}% APY
            </span>
          </div>

          <div className="mb-4">
            <span className="text-xs text-slate-400 block mb-0.5">Protected Balance</span>
            <div className="font-mono text-3xl font-extrabold text-emerald-400">
              ${Math.round(state.emergencyFund).toLocaleString()}
            </div>
          </div>

          {/* Quick Transfer Widget */}
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center gap-2">
            <input
              type="number"
              min={50}
              step={100}
              value={transferAmount}
              onChange={(e) => setTransferAmount(Number(e.target.value))}
              className="w-28 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs font-bold"
            />
            <select
              value={transferDirection}
              onChange={(e) => setTransferDirection(e.target.value as 'to_emergency' | 'to_checking')}
              className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-300 text-xs"
            >
              <option value="to_emergency">Checking ➔ HYSA</option>
              <option value="to_checking">HYSA ➔ Checking</option>
            </select>
            <button
              onClick={handleTransfer}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Transfer
            </button>
          </div>
        </div>

      </div>

      {/* Debt Annihilation Command Center */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Debt Payoff Command Center
            </h3>
            <p className="text-xs text-slate-400">
              Pay off high-interest debts using the Avalanche (highest interest first) or Snowball (smallest balance first) method.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Total Outstanding Debt</span>
            <span className="font-mono text-xl font-extrabold text-rose-400">
              ${Math.round(totalDebt).toLocaleString()}
            </span>
          </div>
        </div>

        {state.debts.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
            <div className="text-4xl mb-2">🎉</div>
            <h4 className="text-sm font-bold text-white mb-1">Debt Free!</h4>
            <p className="text-xs text-slate-400">
              You owe zero consumer debts or loans. Every dollar you earn now works directly for your freedom.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {state.debts.map((debt) => {
              const isHighInterest = debt.interestRate >= 0.12;
              return (
                <div
                  key={debt.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isHighInterest
                      ? 'bg-rose-950/20 border-rose-800/40'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-white">{debt.name}</span>
                      {isHighInterest && (
                        <span className="flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase">
                          <Flame className="w-3 h-3" />
                          Emergency Interest ({Math.round(debt.interestRate * 100)}% APR)
                        </span>
                      )}
                      {!isHighInterest && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                          {(debt.interestRate * 100).toFixed(1)}% APR
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">{debt.educationalTip}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">Remaining Balance</span>
                      <span className="font-mono text-base font-bold text-white">
                        ${Math.round(debt.principal).toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setSelectedDebt(debt);
                        setDebtPayAmount(Math.min(state.cash, Math.round(debt.principal)));
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer border border-slate-700"
                    >
                      Pay Principal
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pay Debt Modal */}
      {selectedDebt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel max-w-md w-full rounded-2xl p-6 border border-slate-700 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="font-bold text-base text-white">Pay Extra Toward Debt</h3>
                <span className="text-xs text-slate-400">{selectedDebt.name} ({(selectedDebt.interestRate * 100).toFixed(1)}% APR)</span>
              </div>
              <button
                onClick={() => setSelectedDebt(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <span className="text-xs text-slate-400 block mb-1.5">Payment Amount ($)</span>
              <input
                type="number"
                min={50}
                max={Math.min(state.cash, selectedDebt.principal)}
                step={50}
                value={debtPayAmount}
                onChange={(e) => setDebtPayAmount(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-lg font-bold"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[200, 500, Math.min(state.cash, selectedDebt.principal)].map((amt, idx) => (
                <button
                  key={idx}
                  onClick={() => setDebtPayAmount(Math.min(state.cash, amt))}
                  className="py-1 px-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  {amt === Math.min(state.cash, selectedDebt.principal) ? 'Pay Full' : `$${amt}`}
                </button>
              ))}
            </div>

            <button
              onClick={handlePayDebt}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Confirm Payment
            </button>
          </div>
        </div>
      )}

      {/* Insurance Protection Shield */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
          <ShieldCheck className="w-5 h-5 text-teal-400" />
          Insurance & Risk Shield
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Insurance transfers catastrophic financial risks (hospital stays, car accidents, fires) away from your life savings for a small monthly premium.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {state.insurance.map((ins) => (
            <div
              key={ins.id}
              className={`p-3.5 rounded-xl border flex items-center justify-between ${
                ins.isActive
                  ? 'bg-slate-900/80 border-slate-700'
                  : 'bg-slate-900/30 border-slate-800/60 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-xs text-white">{ins.name}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    ins.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {ins.isActive ? 'Active' : 'Uninsured'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">{ins.coverageDescription}</p>
                <span className="text-[10px] font-mono text-slate-300 font-semibold mt-1 block">
                  ${ins.monthlyPremium}/mo premium • ${ins.deductible} deductible
                </span>
              </div>

              <button
                onClick={() => {
                  soundFx.playClick();
                  ins.isActive = !ins.isActive;
                  onUpdateState({ ...state });
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  ins.isActive
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    : 'bg-teal-500 hover:bg-teal-400 text-slate-950'
                }`}
              >
                {ins.isActive ? 'Drop' : 'Enroll'}
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
