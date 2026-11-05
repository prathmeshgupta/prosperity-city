import React, { useState, useMemo } from 'react';
import { soundFx } from '../../audio/soundFx';
import { 
  FlaskConical, 
  Sparkles, 
  TrendingUp, 
  Percent, 
  Clock, 
  AlertOctagon, 
  Coins, 
  HelpCircle,
  RotateCcw
} from 'lucide-react';

interface SimulationPoint {
  year: number;
  totalContributions: number;
  nominalWealth: number;
  realWealth: number;
  feesLost: number;
}

export const WealthLab: React.FC = () => {
  const [startingCapital, setStartingCapital] = useState<number>(10000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [annualReturn, setAnnualReturn] = useState<number>(0.09); // 9%
  const [inflationRate, setInflationRate] = useState<number>(0.03); // 3%
  const [feeRate, setFeeRate] = useState<number>(0.0003); // 0.03% low cost index
  const [years, setYears] = useState<number>(30);
  const [hasCrashShock, setHasCrashShock] = useState<boolean>(false);
  const [crashYear, setCrashYear] = useState<number>(15);
  const [hoveredPoint, setHoveredPoint] = useState<SimulationPoint | null>(null);

  // Presets
  const applyPreset = (preset: 'early_start' | 'fee_vampire' | 'aggressive' | 'retire_early') => {
    soundFx.playClick();
    switch (preset) {
      case 'early_start':
        setStartingCapital(5000);
        setMonthlyContribution(400);
        setAnnualReturn(0.10);
        setInflationRate(0.03);
        setFeeRate(0.0003);
        setYears(40);
        setHasCrashShock(false);
        break;
      case 'fee_vampire':
        setStartingCapital(10000);
        setMonthlyContribution(600);
        setAnnualReturn(0.09);
        setInflationRate(0.03);
        setFeeRate(0.02); // 2% active fee vampire!
        setYears(35);
        setHasCrashShock(false);
        break;
      case 'aggressive':
        setStartingCapital(25000);
        setMonthlyContribution(1200);
        setAnnualReturn(0.11);
        setInflationRate(0.032);
        setFeeRate(0.0005);
        setYears(25);
        setHasCrashShock(true);
        setCrashYear(10);
        break;
      case 'retire_early':
        setStartingCapital(20000);
        setMonthlyContribution(2000);
        setAnnualReturn(0.085);
        setInflationRate(0.028);
        setFeeRate(0.0003);
        setYears(18);
        setHasCrashShock(false);
        break;
    }
  };

  // Run simulation calculation
  const simulationData = useMemo(() => {
    const points: SimulationPoint[] = [];
    let nominal = startingCapital;
    let baselineNoFee = startingCapital;
    let totalContrib = startingCapital;

    const netAnnualReturn = annualReturn - feeRate;

    points.push({
      year: 0,
      totalContributions: totalContrib,
      nominalWealth: nominal,
      realWealth: nominal,
      feesLost: 0,
    });

    for (let y = 1; y <= years; y++) {
      // 12 months compounding
      for (let m = 0; m < 12; m++) {
        nominal = (nominal + monthlyContribution) * (1 + netAnnualReturn / 12);
        baselineNoFee = (baselineNoFee + monthlyContribution) * (1 + annualReturn / 12);
        totalContrib += monthlyContribution;
      }

      // Apply simulated market crash shock if enabled
      if (hasCrashShock && y === crashYear) {
        nominal = nominal * 0.65; // 35% crash shock
        baselineNoFee = baselineNoFee * 0.65;
      }

      // Real purchasing power adjusted for inflation
      const inflationDiscount = Math.pow(1 + inflationRate, y);
      const realWealth = nominal / inflationDiscount;
      const feesLost = Math.max(0, baselineNoFee - nominal);

      points.push({
        year: y,
        totalContributions: Math.round(totalContrib),
        nominalWealth: Math.round(nominal),
        realWealth: Math.round(realWealth),
        feesLost: Math.round(feesLost),
      });
    }

    return points;
  }, [startingCapital, monthlyContribution, annualReturn, inflationRate, feeRate, years, hasCrashShock, crashYear]);

  const finalPoint = simulationData[simulationData.length - 1];
  const maxVal = Math.max(...simulationData.map((d) => Math.max(d.nominalWealth, d.totalContributions + d.feesLost)));

  // SVG Chart Dimensions
  const width = 800;
  const height = 340;
  const padding = 50;

  const getX = (y: number) => padding + (y / years) * (width - padding * 2);
  const getY = (val: number) => height - padding - (val / (maxVal || 1)) * (height - padding * 2);

  // Generate SVG path strings
  const nominalPath = simulationData
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.year)} ${getY(p.nominalWealth)}`)
    .join(' ');

  const realPath = simulationData
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.year)} ${getY(p.realWealth)}`)
    .join(' ');

  const contribPath = simulationData
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.year)} ${getY(p.totalContributions)}`)
    .join(' ');

  const areaNominalPath = `${nominalPath} L ${getX(years)} ${getY(0)} L ${getX(0)} ${getY(0)} Z`;

  return (
    <div className="space-y-6">
      
      {/* Top Header & Presets */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
              <FlaskConical className="w-4 h-4 text-emerald-400" />
              <span>Interactive Wealth Lab & Simulator</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Experiment with Compound Growth & Market Realities
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Adjust variables in real time to see how fees, inflation, starting age, and contributions shape your financial destiny.
            </p>
          </div>

          {/* Quick Scenario Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Test Scenarios:
            </span>
            <button
              onClick={() => applyPreset('early_start')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 text-xs font-bold border border-emerald-500/20 transition-all cursor-pointer"
            >
              🌱 Start at 20 (Early Bird)
            </button>
            <button
              onClick={() => applyPreset('fee_vampire')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-400 text-xs font-bold border border-rose-500/20 transition-all cursor-pointer"
            >
              🧛 2% Fee Vampire Trap
            </button>
            <button
              onClick={() => applyPreset('aggressive')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-purple-400 text-xs font-bold border border-purple-500/20 transition-all cursor-pointer"
            >
              🚀 Aggressive + Crash Shock
            </button>
            <button
              onClick={() => applyPreset('retire_early')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-400 text-xs font-bold border border-teal-500/20 transition-all cursor-pointer"
            >
              🔥 Fast Track FIRE
            </button>
          </div>
        </div>

        {/* Results Overview KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block mb-0.5">Final Total Wealth</span>
            <span className="font-mono text-xl sm:text-2xl font-extrabold text-emerald-400">
              ${finalPoint.nominalWealth.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 block">Nominal dollars</span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block mb-0.5">Your Total Contributions</span>
            <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-300">
              ${finalPoint.totalContributions.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 block">Out-of-pocket cash</span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block mb-0.5">Pure Compound Interest</span>
            <span className="font-mono text-xl sm:text-2xl font-extrabold text-teal-400">
              +${Math.max(0, finalPoint.nominalWealth - finalPoint.totalContributions).toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 block">
              {(finalPoint.nominalWealth / (finalPoint.totalContributions || 1)).toFixed(1)}x multiplier
            </span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block mb-0.5">Lost to Management Fees</span>
            <span className={`font-mono text-xl sm:text-2xl font-extrabold ${finalPoint.feesLost > 50000 ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`}>
              -${finalPoint.feesLost.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 block">
              {feeRate > 0.005 ? '⚠️ Wall St fee drag' : 'Low-cost index advantage'}
            </span>
          </div>
        </div>

        {/* Live Interactive SVG Line Chart */}
        <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 relative">
          
          {/* Chart Legends */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-2 px-2 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-white font-semibold">Total Wealth</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-cyan-400" />
                <span className="text-slate-300">Real (Inflation Adjusted)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-1 bg-slate-500" />
                <span className="text-slate-400">Total Contributions</span>
              </div>
            </div>

            {hoveredPoint && (
              <div className="bg-slate-900 px-3 py-1 rounded-lg border border-slate-700 text-xs font-mono">
                Year {hoveredPoint.year}:{' '}
                <span className="text-emerald-400 font-bold">${hoveredPoint.nominalWealth.toLocaleString()}</span>
                {' '}(Real: ${hoveredPoint.realWealth.toLocaleString()})
              </div>
            )}
          </div>

          {/* SVG Canvas */}
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-auto min-w-[600px] select-none"
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
                const y = height - padding - pct * (height - padding * 2);
                return (
                  <g key={idx}>
                    <line
                      x1={padding}
                      y1={y}
                      x2={width - padding}
                      y2={y}
                      stroke="#1e293b"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={padding - 8}
                      y={y + 4}
                      fill="#64748b"
                      fontSize="10"
                      textAnchor="end"
                      fontFamily="monospace"
                    >
                      ${Math.round((pct * maxVal) / 1000)}k
                    </text>
                  </g>
                );
              })}

              {/* Shaded Area under nominal curve */}
              <path d={areaNominalPath} fill="url(#areaGrad)" />

              {/* Contributions Line */}
              <path
                d={contribPath}
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Real Wealth Line (cyan) */}
              <path
                d={realPath}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeOpacity="0.85"
              />

              {/* Nominal Wealth Line (emerald) */}
              <path
                d={nominalPath}
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
              />

              {/* Hoverable nodes along the path */}
              {simulationData.map((pt) => {
                const cx = getX(pt.year);
                const cy = getY(pt.nominalWealth);
                const isHovered = hoveredPoint?.year === pt.year;
                return (
                  <circle
                    key={pt.year}
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 6 : 3.5}
                    fill={isHovered ? '#34d399' : '#10b981'}
                    stroke="#0b0f19"
                    strokeWidth="2"
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredPoint(pt)}
                  />
                );
              })}

              {/* Crash marker if enabled */}
              {hasCrashShock && (
                <g>
                  <line
                    x1={getX(crashYear)}
                    y1={padding}
                    x2={getX(crashYear)}
                    y2={height - padding}
                    stroke="#f43f5e"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={getX(crashYear)}
                    y={padding - 6}
                    fill="#f43f5e"
                    fontSize="10"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    💥 -35% Crash Shock
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>
      </div>

      {/* Control Sliders Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Savings & Contribution Sliders */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-emerald-400" />
            Contributions & Principal
          </h3>

          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span>Starting Capital:</span>
              <span className="font-mono font-bold text-emerald-400">${startingCapital.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100000}
              step={1000}
              value={startingCapital}
              onChange={(e) => setStartingCapital(Number(e.target.value))}
              className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span>Monthly Savings:</span>
              <span className="font-mono font-bold text-emerald-400">${monthlyContribution.toLocaleString()} / mo</span>
            </div>
            <input
              type="range"
              min={0}
              max={3000}
              step={50}
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span>Time Horizon:</span>
              <span className="font-mono font-bold text-white">{years} Years</span>
            </div>
            <input
              type="range"
              min={5}
              max={45}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Market Rate & Inflation */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Percent className="w-4 h-4 text-cyan-400" />
            Returns & Economic Rates
          </h3>

          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span>Expected Annual Return:</span>
              <span className="font-mono font-bold text-cyan-400">{(annualReturn * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min={0.03}
              max={0.16}
              step={0.005}
              value={annualReturn}
              onChange={(e) => setAnnualReturn(Number(e.target.value))}
              className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">Historical S&P 500: ~10%</span>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span>Annual Inflation Rate:</span>
              <span className="font-mono font-bold text-amber-400">{(inflationRate * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min={0.01}
              max={0.08}
              step={0.002}
              value={inflationRate}
              onChange={(e) => setInflationRate(Number(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">Fed Target: ~2.5%</span>
          </div>
        </div>

        {/* Expense Drag & Market Shock */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            Friction & Stress Tests
          </h3>

          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span>Investment Fee (Expense Ratio):</span>
              <span className={`font-mono font-bold ${feeRate > 0.01 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {(feeRate * 100).toFixed(2)}%
              </span>
            </div>
            <input
              type="range"
              min={0.0003}
              max={0.025}
              step={0.0005}
              value={feeRate}
              onChange={(e) => setFeeRate(Number(e.target.value))}
              className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">Index ETF: 0.03% vs Active Hedge Fund: 2.0%</span>
          </div>

          {/* Market Crash Toggle */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300">Inject Market Crash (-35%):</span>
              <button
                onClick={() => setHasCrashShock(!hasCrashShock)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  hasCrashShock
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {hasCrashShock ? 'Enabled' : 'Disabled'}
              </button>
            </div>
            {hasCrashShock && (
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>Occurs at Year:</span>
                  <span className="font-mono text-white font-bold">{crashYear}</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={years - 2}
                  value={crashYear}
                  onChange={(e) => setCrashYear(Number(e.target.value))}
                  className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
