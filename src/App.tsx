import React, { useState, useEffect } from 'react';
import { GameState } from './types/game';
import { createInitialGameState } from './engine/defaultState';
import { GameCanvas } from './game/engine/GameCanvas';
import { TitleScreen } from './game/ui/TitleScreen';
import { OnboardingCutscene } from './game/ui/OnboardingCutscene';
import { ProsperityLogo } from './game/ui/ProsperityLogo';
import { ArchetypeSelectorModal } from './components/ArchetypeSelectorModal';
import { soundFx } from './audio/soundFx';
import { 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  Sparkles,
  Home as HomeIcon
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'prosperity_city_save_v2';

export function App() {
  const [hasSave, setHasSave] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem(LOCAL_STORAGE_KEY);
    } catch {
      return false;
    }
  });

  const [state, setState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return createInitialGameState('archetype_fresh_grad');
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showCutscene, setShowCutscene] = useState<boolean>(false);
  const [showCharacterModal, setShowCharacterModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(soundFx.getMuted());

  // Auto-save on state update
  const handleUpdateState = (newState: GameState) => {
    setState(newState);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
      setHasSave(true);
    } catch {
      // ignore
    }
  };

  const handleStartNewCareer = (archetypeId: string) => {
    const fresh = createInitialGameState(archetypeId);
    setState(fresh);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fresh));
      setHasSave(true);
    } catch {
      // ignore
    }
    setShowCutscene(true);
    setIsPlaying(true);
  };

  const handleResumeGame = () => {
    soundFx.playLevelUp();
    setIsPlaying(true);
    setShowCutscene(false);
  };

  const toggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
    if (!muted) soundFx.playClick();
  };

  // If player hasn't pressed start yet, show the rich Title Screen
  if (!isPlaying) {
    return (
      <TitleScreen
        onStartGame={handleStartNewCareer}
        hasExistingSave={hasSave}
        onResumeGame={handleResumeGame}
      />
    );
  }

  return (
    <div className="w-screen h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden selection:bg-emerald-500 selection:text-white">
      
      {/* Top Header Bar */}
      <header className="h-14 px-4 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-4">
          <ProsperityLogo size="sm" showSubtitle={false} />

          {/* Quick controls hint */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 font-mono bg-slate-900/80 px-3 py-1 rounded-xl border border-slate-800">
            <span>Move: <strong className="text-emerald-400">WASD / Arrow Keys</strong></span>
            <span>•</span>
            <span>Interact: <strong className="text-emerald-400">[E] / Space</strong></span>
            <span>•</span>
            <span>Bag: <strong className="text-emerald-400">[I]</strong></span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
            title="How to Play"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
          </button>

          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={() => setShowCharacterModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 transition-all cursor-pointer"
            title="Change Character Origin"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Change Avatar</span>
          </button>

          <button
            onClick={() => setIsPlaying(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold border border-slate-800 transition-all cursor-pointer"
            title="Return to Title Screen"
          >
            <HomeIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Menu</span>
          </button>
        </div>
      </header>

      {/* Main Full-Screen Game World */}
      <main className="flex-1 relative overflow-hidden p-2 sm:p-3">
        <GameCanvas
          state={state}
          onUpdateState={handleUpdateState}
          onSwitchToExecutiveMode={() => {}}
        />
      </main>

      {/* Onboarding Cutscene when starting new game */}
      {showCutscene && (
        <OnboardingCutscene
          playerName={state.character.name}
          avatarEmoji={state.character.avatar}
          careerTitle={state.character.careerTitle}
          startingCash={state.cash}
          onFinish={() => setShowCutscene(false)}
        />
      )}

      {/* Character Origin Selector Modal */}
      {showCharacterModal && (
        <ArchetypeSelectorModal
          onSelectArchetype={(archId) => {
            const fresh = createInitialGameState(archId);
            handleUpdateState(fresh);
            setShowCharacterModal(false);
          }}
          onClose={() => setShowCharacterModal(false)}
        />
      )}

      {/* How to Play Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel max-w-lg w-full rounded-3xl p-6 border border-slate-700 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <span>🏙️ How to Play Prosperity City</span>
              </h3>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed mb-5">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-bold text-amber-400 block mb-0.5">🧭 Guided Objective Compass:</span>
                The golden compass at the top of your screen points directly to your active quest building with distance in meters!
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-bold text-emerald-400 block mb-0.5">🎮 Controls:</span>
                Move using <strong>W, A, S, D</strong> or <strong>Arrow Keys</strong>, or click anywhere on the street. Press <strong>[E]</strong> or <strong>Space</strong> to enter buildings or talk to citizens.
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-bold text-cyan-400 block mb-0.5">🏛️ Explore 8 City Districts:</span>
                Visit the Bank Vault, Wall Street Stock Exchange, Prestige Auto Dealership, MegaMart, and Suburban Duplexes on the 64x50 metropolis map.
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Resume Journey
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
