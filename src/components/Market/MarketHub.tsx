import React, { useState } from 'react';
import { AssetCategory, AssetDefinition, GameState } from '../../types/game';
import { executeBuyAsset, executeSellAsset } from '../../engine/gameEngine';
import { soundFx } from '../../audio/soundFx';
import { 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  ShieldAlert, 
  Info, 
  DollarSign, 
  Search,
  SlidersHorizontal,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface MarketHubProps {
  state: GameState;
  onUpdateState: (newState: GameState) => void;
}

export const MarketHub: React.FC<MarketHubProps> = ({ state, onUpdateState }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [tradingAsset, setTradingAsset] = useState<AssetDefinition | null>(null);
  const [tradeMode, setTradeMode] = useState<'BUY' | 'SELL'>('BUY');
  const [tradeAmount, setTradeAmount] = useState<number>(500);
  const [tradeFeedback, setTradeFeedback] = useState<{ text: string; success: boolean } | null>(null);

  // Filter assets
  const filteredAssets = state.assets.filter((asset) => {
    const matchesCategory = selectedCategory === 'ALL' || asset.category === selectedCategory;
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories: { key: string; label: string }[] = [
    { key: 'ALL', label: 'All Assets' },
    { key: 'INDEX_FUND', label: 'Index Funds' },
    { key: 'TECH_GROWTH', label: 'Tech Growth' },
    { key: 'BLUE_CHIP', label: 'Dividend Equities' },
    { key: 'GOV_BOND', label: 'Bonds' },
    { key: 'REAL_ESTATE_REIT', label: 'Real Estate' },
    { key: 'CRYPTO', label: 'Crypto' },
    { key: 'GREEN_ENERGY', label: 'Clean Energy' },
    { key: 'COMMODITY', label: 'Commodities' },
  ];

  const handleOpenTrade = (asset: AssetDefinition, mode: 'BUY' | 'SELL') => {
    soundFx.playClick();
    setTradingAsset(asset);
    setTradeMode(mode);
    setTradeFeedback(null);
    if (mode === 'BUY') {
      setTradeAmount(Math.min(state.cash, Math.max(asset.minPurchase, 500)));
    } else {
      const pos = state.portfolio.find((p) => p.assetId === asset.id);
      setTradeAmount(pos ? pos.shares : 0);
    }
  };

  const handleConfirmTrade = () => {
    if (!tradingAsset) return;

    if (tradeMode === 'BUY') {
      const res = executeBuyAsset(state, tradingAsset.id, tradeAmount);
      setTradeFeedback({ text: res.message, success: res.success });
      if (res.success) {
        onUpdateState(res.nextState);
        setTimeout(() => setTradingAsset(null), 1000);
      }
    } else {
      const res = executeSellAsset(state, tradingAsset.id, tradeAmount);
      setTradeFeedback({ text: res.message, success: res.success });
      if (res.success) {
        onUpdateState(res.nextState);
        setTimeout(() => setTradingAsset(null), 1000);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Title & Filters Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <span>📈 Financial Markets & Exchange</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              Live Prices
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Build a durable portfolio: balance passive index funds with income, growth, and alternative assets.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assets, symbols..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => {
              soundFx.playClick();
              setSelectedCategory(cat.key);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.key
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.map((asset) => {
          const position = state.portfolio.find((p) => p.assetId === asset.id);
          const sharesOwned = position?.shares || 0;
          const currentPositionVal = sharesOwned * asset.currentPrice;
          const costBasisVal = position ? position.shares * position.costBasis : 0;
          const unrealizedGain = currentPositionVal - costBasisVal;
          const unrealizedGainPct = costBasisVal > 0 ? (unrealizedGain / costBasisVal) * 100 : 0;

          // Price change in recent period
          const prevPrice = asset.historicalPrices[asset.historicalPrices.length - 2] || asset.currentPrice;
          const priceChange = asset.currentPrice - prevPrice;
          const priceChangePct = prevPrice > 0 ? (priceChange / prevPrice) * 100 : 0;

          return (
            <div
              key={asset.id}
              className="glass-panel-interactive rounded-2xl p-5 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                {/* Header: Icon, Symbol, Category */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl">
                      {asset.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-extrabold text-sm text-white">
                          {asset.symbol}
                        </span>
                        {asset.expansionPackId && (
                          <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold">
                            Pack
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs text-slate-300 font-semibold line-clamp-1">
                        {asset.name}
                      </h4>
                    </div>
                  </div>

                  {/* Risk stars */}
                  <div className="flex items-center gap-0.5 text-amber-400" title={`Risk Rating: ${asset.riskRating} / 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-xs ${i < asset.riskRating ? 'text-amber-400' : 'text-slate-700'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price & Sparkline indicator */}
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span className="font-mono text-2xl font-extrabold text-white">
                      ${asset.currentPrice.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">/ share</span>
                  </div>

                  <div className={`flex items-center gap-0.5 text-xs font-bold font-mono ${
                    priceChange >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {priceChange >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    <span>{priceChange >= 0 ? '+' : ''}{priceChangePct.toFixed(1)}%</span>
                  </div>
                </div>

                {/* Educational Note */}
                <p className="text-[11px] text-slate-400 mb-4 line-clamp-2 leading-relaxed bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/60">
                  💡 {asset.educationalNote}
                </p>

                {/* Dividend / Yield Info */}
                <div className="flex items-center justify-between text-xs py-1.5 border-t border-slate-800/80 mb-3 text-slate-400">
                  <span>Dividend / Staking Yield:</span>
                  <span className="font-mono font-bold text-teal-400">
                    {(asset.dividendYield * 100).toFixed(1)}% / yr
                  </span>
                </div>

                {/* Current Holding Banner */}
                {sharesOwned > 0 && (
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 mb-3 text-xs">
                    <div className="flex items-center justify-between text-slate-400 mb-0.5">
                      <span>You Own:</span>
                      <span className="font-mono font-bold text-white">
                        {sharesOwned.toFixed(2)} shares (${Math.round(currentPositionVal).toLocaleString()})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Unrealized Return:</span>
                      <span className={`font-mono text-[11px] font-bold ${
                        unrealizedGain >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {unrealizedGain >= 0 ? '+' : ''}${Math.round(unrealizedGain).toLocaleString()} ({unrealizedGainPct.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Trade Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() => handleOpenTrade(asset, 'BUY')}
                  className="py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer text-center"
                >
                  Buy / Invest
                </button>
                <button
                  onClick={() => handleOpenTrade(asset, 'SELL')}
                  disabled={sharesOwned <= 0}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer text-center disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Sell
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Trade Execution Modal */}
      {tradingAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel max-w-md w-full rounded-2xl p-6 border border-slate-700 shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{tradingAsset.icon}</span>
                <div>
                  <h3 className="font-bold text-base text-white">
                    {tradeMode === 'BUY' ? 'Buy Asset' : 'Sell Position'}: {tradingAsset.symbol}
                  </h3>
                  <span className="text-xs text-slate-400">${tradingAsset.currentPrice.toLocaleString()} per share</span>
                </div>
              </div>
              <button
                onClick={() => setTradingAsset(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Cash Available Info */}
            <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-900 border border-slate-800 mb-4">
              <span className="text-slate-400">Checking Cash Available:</span>
              <span className="font-mono font-bold text-emerald-400">${Math.round(state.cash).toLocaleString()}</span>
            </div>

            {/* Input Controls */}
            {tradeMode === 'BUY' ? (
              <div className="space-y-4 mb-5">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                    Dollar Amount to Invest ($)
                  </label>
                  <input
                    type="number"
                    min={tradingAsset.minPurchase}
                    max={state.cash}
                    step={50}
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-base font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Quick Presets */}
                <div className="grid grid-cols-4 gap-2">
                  {[100, 500, 1000, state.cash].map((amt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setTradeAmount(Math.min(state.cash, amt))}
                      className="py-1 px-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                    >
                      {amt === state.cash ? 'Max Cash' : `$${amt}`}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-slate-400">
                  Approx. shares:{' '}
                  <span className="font-mono font-bold text-white">
                    {(tradeAmount / tradingAsset.currentPrice).toFixed(3)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4 mb-5">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                    Shares to Sell
                  </label>
                  <input
                    type="number"
                    step={0.01}
                    min={0.01}
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-base font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="text-xs text-slate-400">
                  Total Proceeds:{' '}
                  <span className="font-mono font-bold text-emerald-400">
                    ${Math.round(tradeAmount * tradingAsset.currentPrice).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Feedback message */}
            {tradeFeedback && (
              <div
                className={`p-3 rounded-xl text-xs mb-4 ${
                  tradeFeedback.success
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {tradeFeedback.text}
              </div>
            )}

            <button
              onClick={handleConfirmTrade}
              className={`w-full py-3 rounded-xl font-bold text-sm shadow-lg transition-all cursor-pointer ${
                tradeMode === 'BUY'
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                  : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
              }`}
            >
              Confirm {tradeMode} Order
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
