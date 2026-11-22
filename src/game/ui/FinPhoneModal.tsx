import React, { useState, useEffect } from 'react';
import { GameState } from '../../types/game';
import { radioEngine, RadioStation, RADIO_STATIONS } from '../engine/radioEngine';
import { wantedLevelEngine } from '../engine/wantedLevelEngine';
import { soundFx } from '../../audio/soundFx';
import { getPortfolioValue, executeBuyAsset, executeSellAsset } from '../../engine/gameEngine';
import { 
  X, 
  Wifi, 
  BatteryCharging, 
  TrendingUp, 
  Share2, 
  Building, 
  Landmark, 
  Radio, 
  Camera, 
  ShieldAlert, 
  Send, 
  Heart, 
  Repeat, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Sparkles,
  Award
} from 'lucide-react';

interface FinPhoneModalProps {
  state: GameState;
  onUpdateState: (newState: GameState) => void;
  onClose: () => void;
  onAlert: (msg: string) => void;
}

type PhoneApp = 'HOME' | 'FINTWIST' | 'ROBINTRADE' | 'LUXMANSIONS' | 'BANK' | 'LEGAL' | 'RADIO' | 'CAMERA';

export const FinPhoneModal: React.FC<FinPhoneModalProps> = ({
  state,
  onUpdateState,
  onClose,
  onAlert,
}) => {
  const [currentApp, setCurrentApp] = useState<PhoneApp>('HOME');
  const [currentStation, setCurrentStation] = useState<RadioStation>(radioEngine.getCurrentStation());
  const [stars, setStars] = useState<number>(wantedLevelEngine.getStars());

  // Listen to radio engine changes
  useEffect(() => {
    return radioEngine.subscribe((st) => setCurrentStation(st));
  }, []);

  // FinTwist Social Feed Posts
  const [socialFeed, setSocialFeed] = useState([
    {
      id: 1,
      author: 'Gordon Greed',
      handle: '@GordonGreed',
      avatar: '👔',
      content: 'If you are not leveraged 10x, you are just an observer in the casino of life. Cash is for quitters.',
      likes: 4210,
      retweets: 890,
      time: '2m ago',
    },
    {
      id: 2,
      author: 'Federal Reserve Wire',
      handle: '@FedChairWire',
      avatar: '🏛️',
      content: 'Core CPI came in at 3.2%. Yield curve remains inverted. Higher for longer until morale improves.',
      likes: 8940,
      retweets: 2430,
      time: '14m ago',
    },
    {
      id: 3,
      author: 'Satoshi Bro',
      handle: '@CryptoWhale',
      avatar: '🚀',
      content: 'Just collateralized my penthouse for a 50x long on Bitcoin. It literally cannot go down.',
      likes: 1240,
      retweets: 512,
      time: '32m ago',
    },
    {
      id: 4,
      author: 'IRS Enforcement Division',
      handle: '@IRS_Official',
      avatar: '⚖️',
      content: 'Friendly reminder: Failure to report offshore shell accounts carries statutory fines plus criminal referrals.',
      likes: 310,
      retweets: 98,
      time: '1h ago',
    },
  ]);

  const [tweetDraft, setTweetDraft] = useState('');

  const handlePostTweet = () => {
    if (!tweetDraft.trim()) return;
    soundFx.playPhoneChime();
    const newPost = {
      id: Date.now(),
      author: state.character.name,
      handle: `@${state.character.name.toLowerCase().replace(/\s+/g, '')}`,
      avatar: state.character.avatar,
      content: tweetDraft,
      likes: Math.floor(Math.random() * 200) + 15,
      retweets: Math.floor(Math.random() * 50) + 5,
      time: 'Just now',
    };
    setSocialFeed([newPost, ...socialFeed]);
    setTweetDraft('');
    state.totalXP += 30;
    onUpdateState({ ...state });
    onAlert('📱 FinTwist: Your tweet is going viral! (+30 XP)');
  };

  const handleLegalSettlement = () => {
    const res = wantedLevelEngine.settleWithAttorney(state.cash);
    if (res.success) {
      state.cash -= res.cost;
      setStars(0);
      onUpdateState({ ...state });
      onAlert(res.message);
    } else {
      onAlert(res.message);
    }
  };

  const handleQuickTrade = (assetSymbol: string, price: number, isBuy: boolean) => {
    // Match asset in state.assets
    const targetAsset = state.assets.find(
      (a) => a.symbol.toLowerCase() === assetSymbol.toLowerCase() || a.name.toLowerCase().includes(assetSymbol.toLowerCase())
    ) || state.assets[0];

    if (isBuy) {
      if (targetAsset) {
        const res = executeBuyAsset(state, targetAsset.id, price);
        if (res.success) {
          onUpdateState(res.nextState);
          onAlert(res.message);
        } else {
          onAlert(res.message);
        }
      }
    } else {
      if (targetAsset) {
        const pos = state.portfolio.find((p) => p.assetId === targetAsset.id);
        if (!pos || pos.shares <= 0) {
          onAlert(`You do not own any shares of ${targetAsset.name}.`);
          return;
        }
        const res = executeSellAsset(state, targetAsset.id, Math.min(1, pos.shares));
        if (res.success) {
          onUpdateState(res.nextState);
          onAlert(res.message);
        } else {
          onAlert(res.message);
        }
      }
    }
  };

  const handleBuyMansion = (name: string, price: number, monthlyCashflow: number) => {
    if (state.cash >= price) {
      state.cash -= price;
      state.sideHustles.push({
        id: `mansion_${Date.now()}`,
        title: name,
        monthlyIncome: monthlyCashflow,
        hoursPerWeek: 0,
        startupCost: price,
        isActive: true,
        description: 'Passive luxury property rental yield.',
      });
      state.totalXP += 250;
      soundFx.playLevelUp();
      onUpdateState({ ...state });
      onAlert(`🏰 Acquired ${name}! Rental cashflow +$${monthlyCashflow.toLocaleString()}/mo added!`);
    } else {
      onAlert(`Need $${price.toLocaleString()} to purchase ${name}.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end sm:pr-12 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* GTA Smartphone Body */}
      <div className="relative w-[340px] h-[670px] bg-slate-950 rounded-[50px] p-4 border-[6px] border-slate-700 shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-slate-100 select-none">
        
        {/* Dynamic Island / Speaker Pill */}
        <div className="absolute top-3 inset-x-0 mx-auto w-28 h-6 bg-black rounded-full flex items-center justify-center z-40">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 mr-2" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
        </div>

        {/* Top Status Bar */}
        <div className="flex items-center justify-between px-3 pt-1 pb-2 text-[11px] font-mono font-bold text-slate-400 z-30">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            {stars > 0 && (
              <span className="text-amber-400 font-extrabold animate-pulse tracking-tight">
                {'⭐'.repeat(stars)}
              </span>
            )}
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

        {/* Smartphone Screen Content */}
        <div className="flex-1 bg-gradient-to-b from-slate-900 to-slate-950 rounded-[38px] p-3 overflow-y-auto relative flex flex-col scrollbar-none border border-slate-800/80">
          
          {/* Top Bar with Back / Home Button */}
          {currentApp !== 'HOME' && (
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setCurrentApp('HOME');
                }}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                ◀ Home
              </button>
              <span className="text-xs font-extrabold text-slate-200">
                {currentApp}
              </span>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* APP 1: HOME SCREEN */}
          {currentApp === 'HOME' && (
            <div className="flex-1 flex flex-col justify-between py-2">
              <div>
                {/* Time & Weather Widget */}
                <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-3.5 border border-slate-700/60 mb-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-black text-white">Prosperity OS</div>
                      <div className="text-[11px] text-emerald-400 font-mono">
                        ${Math.round(state.cash).toLocaleString()} Checking
                      </div>
                    </div>
                    <div className="text-3xl">📱</div>
                  </div>
                  {stars > 0 && (
                    <div className="mt-2 text-[10px] bg-red-950/80 border border-red-500/50 text-red-300 px-2 py-1 rounded-lg font-bold flex items-center gap-1.5 animate-pulse">
                      <ShieldAlert className="w-3 h-3 text-red-400" />
                      <span>SEC / IRS Investigation Active ({stars} Stars)!</span>
                    </div>
                  )}
                </div>

                {/* App Grid */}
                <div className="grid grid-cols-3 gap-3.5 px-1">
                  {/* FinTwist */}
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setCurrentApp('FINTWIST');
                    }}
                    className="flex flex-col items-center gap-1 cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-all">
                      <Share2 className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-300">FinTwist</span>
                  </button>

                  {/* RobinTrade */}
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setCurrentApp('ROBINTRADE');
                    }}
                    className="flex flex-col items-center gap-1 cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-all">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-300">RobinTrade</span>
                  </button>

                  {/* LuxMansions */}
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setCurrentApp('LUXMANSIONS');
                    }}
                    className="flex flex-col items-center gap-1 cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-all">
                      <Building className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-300">Mansions</span>
                  </button>

                  {/* Bank Mobile */}
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setCurrentApp('BANK');
                    }}
                    className="flex flex-col items-center gap-1 cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-all">
                      <Landmark className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-300">Bank</span>
                  </button>

                  {/* Legal Fixer (BailBonds) */}
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setCurrentApp('LEGAL');
                    }}
                    className="flex flex-col items-center gap-1 cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-700 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-all">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-300">Legal Fixer</span>
                  </button>

                  {/* Radio */}
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setCurrentApp('RADIO');
                    }}
                    className="flex flex-col items-center gap-1 cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-fuchsia-600 to-pink-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-all">
                      <Radio className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-300">Radio</span>
                  </button>
                </div>
              </div>

              {/* Bottom Dock */}
              <div className="bg-slate-800/60 backdrop-blur-md rounded-3xl p-2.5 flex items-center justify-around border border-slate-700/50">
                <button
                  onClick={() => {
                    soundFx.playCameraSnap();
                    onAlert('📸 Snapshot taken! Saved to your Prosperity Gallery.');
                  }}
                  className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-white hover:bg-slate-600 cursor-pointer"
                  title="Camera"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    radioEngine.nextStation();
                  }}
                  className="w-10 h-10 rounded-xl bg-pink-600 flex items-center justify-center text-white hover:bg-pink-500 cursor-pointer"
                  title="Radio Quick-Switch"
                >
                  <Radio className="w-5 h-5" />
                </button>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-white hover:bg-slate-600 cursor-pointer"
                  title="Put Phone Away"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* APP 2: FINTWIST SOCIAL NETWORK */}
          {currentApp === 'FINTWIST' && (
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-3 overflow-y-auto max-h-[460px] pr-1 scrollbar-none">
                {/* Tweet Composer */}
                <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/80">
                  <textarea
                    value={tweetDraft}
                    onChange={(e) => setTweetDraft(e.target.value)}
                    placeholder="Post a market hot-take..."
                    rows={2}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-sky-500 resize-none"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-slate-400">Public Feed</span>
                    <button
                      onClick={handlePostTweet}
                      disabled={!tweetDraft.trim()}
                      className="px-3 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span>Post</span>
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Feed Items */}
                {socialFeed.map((post) => (
                  <div key={post.id} className="bg-slate-800/40 rounded-2xl p-3 border border-slate-700/50 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{post.avatar}</span>
                        <div>
                          <div className="text-xs font-bold text-white">{post.author}</div>
                          <div className="text-[10px] text-slate-400">{post.handle}</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500">{post.time}</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">{post.content}</p>
                    <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1 hover:text-red-400 cursor-pointer">
                        <Heart className="w-3 h-3" /> {post.likes}
                      </span>
                      <span className="flex items-center gap-1 hover:text-emerald-400 cursor-pointer">
                        <Repeat className="w-3 h-3" /> {post.retweets}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* APP 3: ROBINTRADE MOBILE */}
          {currentApp === 'ROBINTRADE' && (
            <div className="space-y-3">
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-3">
                <div className="text-[10px] text-emerald-400 font-bold uppercase">Liquid Portfolio</div>
                <div className="text-xl font-black text-white font-mono">
                  ${getPortfolioValue(state).toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Cash Available: ${Math.round(state.cash).toLocaleString()}</div>
              </div>

              {/* Equities List */}
              <div className="space-y-2">
                {[
                  { symbol: 'SPY 500', name: 'S&P Market Index', price: 540, change: '+1.4%' },
                  { symbol: 'NVDA-TECH', name: 'AI Silicon Giant', price: 920, change: '+4.8%' },
                  { symbol: 'TLT-BOND', name: '20Y Treasury Yield', price: 110, change: '-0.6%' },
                  { symbol: 'BTC-CRYPTO', name: 'Digital Reserve', price: 68000, change: '+6.2%' },
                ].map((item) => (
                  <div key={item.symbol} className="bg-slate-800/50 rounded-xl p-2.5 border border-slate-700/60 flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-xs text-white">{item.symbol}</div>
                      <div className="text-[10px] text-slate-400">{item.name}</div>
                      <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                        ${item.price.toLocaleString()} <span className="text-[10px] text-emerald-300">({item.change})</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleQuickTrade(item.symbol, item.price, true)}
                        className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-[11px] rounded-lg cursor-pointer"
                      >
                        Buy
                      </button>
                      <button
                        onClick={() => handleQuickTrade(item.symbol, item.price, false)}
                        className="px-2.5 py-1.5 bg-rose-500 hover:bg-rose-400 text-white font-extrabold text-[11px] rounded-lg cursor-pointer"
                      >
                        Sell
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* APP 4: LUXMANSIONS REAL ESTATE */}
          {currentApp === 'LUXMANSIONS' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Ultra-Luxury Portfolio
              </div>
              {[
                {
                  name: 'Ocean Boardwalk Penthouse',
                  price: 1250000,
                  cashflow: 6500,
                  loc: 'Waterfront District',
                  icon: '🏖️',
                },
                {
                  name: 'Financial Core Sky-Mansion',
                  price: 3500000,
                  cashflow: 18000,
                  loc: 'Wall Street Tower',
                  icon: '🏙️',
                },
                {
                  name: 'Suburban Gated Villa',
                  price: 450000,
                  cashflow: 2400,
                  loc: 'Residential Park',
                  icon: '🏡',
                },
              ].map((mansion) => (
                <div key={mansion.name} className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{mansion.icon}</span>
                    <span className="text-xs font-bold text-amber-400 font-mono">
                      ${mansion.price.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-white">{mansion.name}</div>
                    <div className="text-[10px] text-slate-400">{mansion.loc}</div>
                    <div className="text-[11px] font-mono text-emerald-400 font-bold mt-1">
                      +${mansion.cashflow.toLocaleString()}/mo Net Rental Yield
                    </div>
                  </div>
                  <button
                    onClick={() => handleBuyMansion(mansion.name, mansion.price, mansion.cashflow)}
                    className="w-full py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs cursor-pointer"
                  >
                    Buy Property
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* APP 5: BANK OF PROSPERITY */}
          {currentApp === 'BANK' && (
            <div className="space-y-3">
              <div className="bg-indigo-950/50 border border-indigo-500/40 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-indigo-300 font-bold">Checking Account</span>
                  <span className="text-xs font-mono font-black text-white">
                    ${Math.round(state.cash).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-300 font-bold">4.5% High-Yield Vault</span>
                  <span className="text-xs font-mono font-black text-white">
                    ${Math.round(state.emergencyFund).toLocaleString()}
                  </span>
                </div>
                <div className="pt-2 border-t border-indigo-800/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">FICO Credit Score</span>
                  <span className="text-sm font-extrabold text-emerald-400 font-mono">785 (Excellent)</span>
                </div>
              </div>

              {/* Instant Vault Transfer Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    if (state.cash >= 500) {
                      state.cash -= 500;
                      state.emergencyFund += 500;
                      soundFx.playCoin();
                      onUpdateState({ ...state });
                      onAlert('Vault Deposit: Transferred $500 to 4.5% High-Yield Vault!');
                    } else {
                      onAlert('Insufficient cash.');
                    }
                  }}
                  className="py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                  Deposit $500
                </button>

                <button
                  onClick={() => {
                    if (state.emergencyFund >= 500) {
                      state.emergencyFund -= 500;
                      state.cash += 500;
                      soundFx.playCoin();
                      onUpdateState({ ...state });
                      onAlert('Vault Withdrawal: Transferred $500 to Checking!');
                    } else {
                      onAlert('Insufficient vault funds.');
                    }
                  }}
                  className="py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  Withdraw $500
                </button>
              </div>
            </div>
          )}

          {/* APP 6: LEGAL FIXER & SEC BAIL BONDS */}
          {currentApp === 'LEGAL' && (
            <div className="space-y-3">
              <div className="bg-red-950/50 border border-red-500/40 rounded-2xl p-3.5 text-center space-y-2">
                <div className="text-xs font-bold text-red-300 uppercase">Regulatory Wanted Level</div>
                <div className="text-3xl tracking-widest text-amber-400 font-extrabold">
                  {stars > 0 ? '⭐'.repeat(stars) : 'CLEAN'}
                </div>
                <div className="text-[11px] text-slate-300">
                  {stars === 0
                    ? 'No active investigations or enforcement warrants.'
                    : `Active Investigation: ${wantedLevelEngine.getInfraction() || 'Federal Inquiry'}`}
                </div>
              </div>

              <div className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700 space-y-2 text-center">
                <div className="text-xs font-extrabold text-white">Call Defense Attorney Saul</div>
                <p className="text-[11px] text-slate-400">
                  Negotiate a confidential settlement with the SEC & IRS to completely clear your Wanted Stars and unfreeze all accounts.
                </p>
                <button
                  onClick={handleLegalSettlement}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg cursor-pointer"
                >
                  Pay Settlement & Drop Charges
                </button>
              </div>
            </div>
          )}

          {/* APP 7: RADIO PLAYER */}
          {currentApp === 'RADIO' && (
            <div className="space-y-3">
              <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-3xl shadow-xl">
                  📻
                </div>
                <div>
                  <div className="font-black text-sm text-white">{currentStation.name}</div>
                  <div className="text-xs text-pink-400 font-mono">{currentStation.frequency}</div>
                  <div className="text-[11px] text-slate-400 mt-1">{currentStation.currentTrack}</div>
                </div>

                {/* Stations List */}
                <div className="space-y-1.5 pt-2 text-left">
                  {RADIO_STATIONS.map((station) => (
                    <button
                      key={station.id}
                      onClick={() => radioEngine.setStation(station.id)}
                      className={`w-full p-2 rounded-xl text-left text-xs font-bold flex items-center justify-between cursor-pointer ${
                        currentStation.id === station.id
                          ? 'bg-pink-600/30 border border-pink-500/50 text-white'
                          : 'bg-slate-900/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>{station.name}</span>
                      <span className="font-mono text-[10px] text-slate-500">{station.frequency}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Home Bar Indicator (iPhone style) */}
        <div 
          onClick={() => {
            soundFx.playClick();
            if (currentApp === 'HOME') {
              onClose();
            } else {
              setCurrentApp('HOME');
            }
          }}
          className="w-32 h-1 bg-slate-500 hover:bg-slate-300 mx-auto rounded-full mt-2 cursor-pointer transition-colors"
        />
      </div>
    </div>
  );
};
