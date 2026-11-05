import React, { useState } from 'react';
import { ExpansionPack, GameState } from '../../types/game';
import { expansionManager } from '../../expansions/registry';
import { soundFx } from '../../audio/soundFx';
import { 
  Puzzle, 
  Sparkles, 
  Download, 
  Upload, 
  Plus, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  Coins,
  FileCode,
  Trash2
} from 'lucide-react';

interface ExpansionManagerProps {
  state: GameState;
  onUpdateState: (newState: GameState) => void;
}

export const ExpansionManagerView: React.FC<ExpansionManagerProps> = ({ state, onUpdateState }) => {
  const [packs, setPacks] = useState<ExpansionPack[]>(expansionManager.getAllPacks());
  const [activeIds, setActiveIds] = useState<string[]>(expansionManager.getActivePackIds());
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [showStudioModal, setShowStudioModal] = useState<boolean>(false);

  // New Custom Pack Form State
  const [customPackName, setCustomPackName] = useState<string>('');
  const [customPackDesc, setCustomPackDesc] = useState<string>('');
  const [customPackAuthor, setCustomPackAuthor] = useState<string>('Player');
  const [customPackIcon, setCustomPackIcon] = useState<string>('🎮');

  const handleTogglePack = (packId: string) => {
    soundFx.playClick();
    expansionManager.togglePack(packId);
    const updatedActive = expansionManager.getActivePackIds();
    setActiveIds([...updatedActive]);

    // Synchronize assets and events into current state
    const allActivePacks = expansionManager.getActivePacks();
    const assetsList = [...state.assets];

    // Add any assets from newly enabled packs
    for (const p of allActivePacks) {
      if (p.assets) {
        for (const a of p.assets) {
          if (!assetsList.some((existing) => existing.id === a.id)) {
            assetsList.push(a);
          }
        }
      }
    }

    state.assets = assetsList;
    state.activeExpansionIds = updatedActive;
    onUpdateState({ ...state });
  };

  const handleImportJson = () => {
    if (!importJsonText.trim()) return;
    const res = expansionManager.importPackJson(importJsonText);
    if (res.success && res.pack) {
      soundFx.playLevelUp();
      setImportStatus({ success: true, message: `Successfully installed "${res.pack.name}"!` });
      setPacks(expansionManager.getAllPacks());
      setActiveIds(expansionManager.getActivePackIds());
      setImportJsonText('');
      state.activeExpansionIds = expansionManager.getActivePackIds();
      onUpdateState({ ...state });
    } else {
      soundFx.playBadTwist();
      setImportStatus({ success: false, message: res.error || 'Import failed' });
    }
  };

  const handleCreateCustomPack = () => {
    if (!customPackName.trim() || !customPackDesc.trim()) return;

    const newPack: ExpansionPack = {
      id: `pack_custom_${Date.now()}`,
      name: customPackName,
      version: '1.0.0',
      description: customPackDesc,
      author: customPackAuthor,
      icon: customPackIcon,
      themeColor: '#3B82F6',
      isBuiltIn: false,
      assets: [
        {
          id: `asset_custom_${Date.now()}`,
          name: `${customPackName} Token / Share`,
          symbol: customPackName.slice(0, 4).toUpperCase(),
          category: 'TECH_GROWTH',
          description: `Custom asset created in ${customPackName} expansion pack.`,
          educationalNote: 'Custom community created asset demonstrating modular game architecture.',
          initialPrice: 100,
          currentPrice: 100,
          historicalPrices: [90, 95, 98, 100],
          dividendYield: 0.02,
          volatility: 0.25,
          expectedAnnualReturn: 0.10,
          minPurchase: 25,
          icon: customPackIcon,
          riskRating: 3,
        },
      ],
      events: [
        {
          id: `event_custom_${Date.now()}`,
          title: `${customPackName} Flash Opportunity`,
          category: 'OPPORTUNITY',
          icon: customPackIcon,
          story: `An exciting new community event occurred in the ${customPackName} ecosystem!`,
          explanation: 'Expansion packs allow custom economic scenarios, career trajectories, and educational topics.',
          choices: [
            {
              text: 'Participate actively with $500',
              cashChange: -500,
              happinessChange: 5,
              educationalTakeaway: 'Expanding your horizons with controlled risk is a viable learning strategy.',
            },
            {
              text: 'Observe from the sidelines',
              happinessChange: 1,
              educationalTakeaway: 'Preserving capital when evaluating new asset categories is prudent.',
            },
          ],
        },
      ],
    };

    expansionManager.registerPack(newPack, true);
    soundFx.playLevelUp();
    setPacks(expansionManager.getAllPacks());
    setActiveIds(expansionManager.getActivePackIds());
    setShowStudioModal(false);
    setCustomPackName('');
    setCustomPackDesc('');

    state.activeExpansionIds = expansionManager.getActivePackIds();
    onUpdateState({ ...state });
  };

  const handleExportPack = (packId: string) => {
    soundFx.playClick();
    const json = expansionManager.exportPack(packId);
    if (!json) return;
    navigator.clipboard.writeText(json);
    alert('Expansion pack JSON copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 mb-1">
            <Puzzle className="w-4 h-4 text-purple-400" />
            <span>Extensible Architecture • Expansion Packs</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Expand Your Economy with Modular Packs
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Activate new asset classes, industry events, and career paths. Create, export, and import community packs.
          </p>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            setShowStudioModal(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Custom Pack</span>
        </button>
      </div>

      {/* Installed Packs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {packs.map((pack) => {
          const isActive = activeIds.includes(pack.id);

          return (
            <div
              key={pack.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-slate-900/90 border-purple-500/40 shadow-lg shadow-purple-950/20'
                  : 'bg-slate-900/40 border-slate-800 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-2xl">
                      {pack.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-white">{pack.name}</h3>
                        <span className="text-[10px] font-mono text-slate-400">v{pack.version}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">By {pack.author}</span>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => handleTogglePack(pack.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {isActive ? 'Active' : 'Disabled'}
                  </button>
                </div>

                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  {pack.description}
                </p>

                {/* Pack Contents Metadata */}
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold text-slate-400 mb-4">
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/80">
                    🪙 {pack.assets?.length || 0} Assets
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/80">
                    ⚡ {pack.events?.length || 0} Twist Events
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/80">
                    🏆 {pack.achievements?.length || 0} Trophies
                  </span>
                </div>
              </div>

              {/* Action Buttons: Export JSON */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                <button
                  onClick={() => handleExportPack(pack.id)}
                  className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>

                {!pack.isBuiltIn && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete custom pack "${pack.name}"?`)) {
                        expansionManager.unregisterPack(pack.id);
                        setPacks(expansionManager.getAllPacks());
                        setActiveIds(expansionManager.getActivePackIds());
                      }
                    }}
                    className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* JSON Import Box */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
          <Upload className="w-4 h-4 text-cyan-400" />
          Install Community Expansion Pack (JSON)
        </h3>
        <p className="text-xs text-slate-400 mb-3">
          Paste valid JSON definition exported from another player, teacher, or community pack.
        </p>

        <textarea
          rows={3}
          value={importJsonText}
          onChange={(e) => setImportJsonText(e.target.value)}
          placeholder='{"id": "pack_my_pack", "name": "Crypto Trading 101", ...}'
          className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 mb-3"
        />

        {importStatus && (
          <div className={`p-3 rounded-xl text-xs mb-3 ${
            importStatus.success ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
          }`}>
            {importStatus.message}
          </div>
        )}

        <button
          onClick={handleImportJson}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors cursor-pointer"
        >
          Install Pack from JSON
        </button>
      </div>

      {/* Custom Pack Studio Modal */}
      {showStudioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel max-w-lg w-full rounded-2xl p-6 border border-slate-700 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>🎨 Expansion Pack Studio</span>
              </h3>
              <button
                onClick={() => setShowStudioModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-5 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Pack Title</label>
                <input
                  type="text"
                  placeholder="e.g. High School Hustle or AI Startup Boom"
                  value={customPackName}
                  onChange={(e) => setCustomPackName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Emoji Icon</label>
                <input
                  type="text"
                  maxLength={4}
                  value={customPackIcon}
                  onChange={(e) => setCustomPackIcon(e.target.value)}
                  className="w-20 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-base text-center font-bold"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Author Name</label>
                <input
                  type="text"
                  placeholder="Your Name / Class"
                  value={customPackAuthor}
                  onChange={(e) => setCustomPackAuthor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="What new concepts, assets, and decisions does this pack introduce?"
                  value={customPackDesc}
                  onChange={(e) => setCustomPackDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>
            </div>

            <button
              onClick={handleCreateCustomPack}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Generate & Register Pack
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
