import React, { useState } from 'react';
import { GameState } from '../../types/game';
import { transferCashEmergency } from '../../engine/gameEngine';
import { soundFx } from '../../audio/soundFx';
import { PiggyBank, Wallet, ArrowRight, CheckCircle2 } from 'lucide-react';

interface TransferModalProps {
  state: GameState;
  onClose: () => void;
  onUpdateState: (newState: GameState) => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({ state, onClose, onUpdateState }) => {
  const [amount, setAmount] = useState<number>(500);
  const [direction, setDirection] = useState<'to_emergency' | 'to_checking'>('to_emergency');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleExecute = () => {
    const res = transferCashEmergency(state, amount, direction);
    setFeedback(res.message);
    if (res.success) {
      soundFx.playCoin();
      onUpdateState(res.nextState);
      setTimeout(() => onClose(), 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="glass-panel max-w-md w-full rounded-2xl p-6 border border-slate-700 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base text-white">Transfer Funds</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* Current Balances preview */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block mb-0.5">Checking Cash</span>
            <span className="font-mono font-bold text-white text-sm">${Math.round(state.cash).toLocaleString()}</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block mb-0.5">Emergency HYSA</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">${Math.round(state.emergencyFund).toLocaleString()}</span>
          </div>
        </div>

        {/* Direction Switch */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={() => setDirection('to_emergency')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              direction === 'to_emergency'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Checking ➔ HYSA
          </button>
          <button
            onClick={() => setDirection('to_checking')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              direction === 'to_checking'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            HYSA ➔ Checking
          </button>
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
            Transfer Amount ($)
          </label>
          <input
            type="number"
            min={10}
            step={50}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-base font-bold focus:outline-none focus:border-emerald-500"
          />
        </div>

        {feedback && (
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-emerald-300 mb-4">
            {feedback}
          </div>
        )}

        <button
          onClick={handleExecute}
          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
        >
          Confirm Transfer
        </button>
      </div>
    </div>
  );
};
