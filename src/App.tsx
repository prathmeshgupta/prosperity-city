import React, { useState } from 'react';
import { GameState } from './types/game';
import { createInitialGameState } from './engine/defaultState';
import { GameCanvas } from './game/engine/GameCanvas';
import { ArchetypeSelectorModal } from './components/ArchetypeSelectorModal';
import { soundFx } from './audio/soundFx';
import { 
  Gamepad2, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Scroll, 
  MapPin, 
  Coins, 
  HelpCircle 
} from 'lucide-react';

export function App() {
  const [state, setState] = useState<GameState>(() => createInitialGameState('archetype_fresh_grad'));
  const [showCharacterModal, setShowCharacterModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(soundFx.getMuted());

  const toggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
    if (!muted) soundFx.playClick();
  };

  return (
    <div className="w-screen h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden selection:bg-emerald-500 selection:text-white">
      
      {/* Top Header Bar */}
      <header className="h-14 px-4 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-lg">
              🏙️
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                Prosperity City
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
                2D RPG
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              A Playable Financial Universe & Open World
            </p>
          </div>
        </div>

        {/* Controls Guide Banner */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-mono bg-slate-900/80 px-3 py-1 rounded-xl border border-slate-800">
          <span>Walk: <strong className="text-emerald-400">WASD / Arrows / Tap</strong></span>
          <span>•</span>
          <span>Interact: <strong className="text-emerald-400">[E] / Space</strong></span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
            title="How to Play"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
          </button>

          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={() => setShowCharacterModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 transition-all cursor-pointer"
            title="Switch Character Origin"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Change Avatar</span>
          </button>
        </div>
      </header>

      {/* Main Full-Screen Game World */}
      <main className="flex-1 relative overflow-hidden p-2 sm:p-4">
        <GameCanvas
          state={state}
          onUpdateState={(ns) => setState(ns)}
          onSwitchToExecutiveMode={() => {}}
        />
      </main>

      {/* Character Selection Modal */}
      {showCharacterModal && (
        <ArchetypeSelectorModal
          onSelectArchetype={(archId) => {
            const fresh = createInitialGameState(archId);
            setState(fresh);
            setShowCharacterModal(false);
          }}
          onClose={() => setShowCharacterModal(false)}
        />
      )}

      {/* How to Play Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel max-w-lg w-full rounded-3xl p-6 border border-slate-700 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <span>🏙️ How to Play Prosperity City</span>
              </h3>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed mb-5">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-bold text-emerald-400 block mb-0.5">🎮 Controls:</span>
                Move using <strong>W, A, S, D</strong> or <strong>Arrow Keys</strong>, or click anywhere on the ground to walk. On mobile devices, use the virtual D-Pad.
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-bold text-cyan-400 block mb-0.5">🏛️ Explore Buildings:</span>
                Walk up to glowing doorways and press <strong>[E]</strong> or click the prompt to enter First Prosperity Bank, Wall Street Stock Exchange, Prestige Auto Dealership, Career Tower, and your Apartment.
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-bold text-amber-400 block mb-0.5">🗣️ Talk to Citizens & Collectibles:</span>
                Meet Banker Sterling, Aunt Penny, Trader Chad, and Shady Sam. Walk over glowing gold coins and scrolls to gain bonus cash and financial XP!
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Start Exploring!
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
