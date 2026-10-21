import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TIERS, getTierForScore, calculateCollateralRequired, formatRLO } from '../utils/creditScore';
import { CreditTier } from '../types';
import { Calculator, ShieldCheck, Lock, Unlock } from 'lucide-react';

export const CollateralCalculator: React.FC = () => {
  const { activeAgent } = useApp();
  const [taskValue, setTaskValue] = useState<number>(1000);
  const [customScore, setCustomScore] = useState<number>(activeAgent.creditScore);
  const [useActiveAgent, setUseActiveAgent] = useState<boolean>(true);

  const effectiveScore = useActiveAgent ? activeAgent.creditScore : customScore;
  const currentTier = getTierForScore(effectiveScore);
  const calculation = calculateCollateralRequired(taskValue, effectiveScore);

  const multiplier = calculation.collateralPercent === 0 
    ? '∞ (Unbonded Credit)' 
    : `${(100 / calculation.collateralPercent).toFixed(1)}x Capital Velocity`;

  const tierKeys: CreditTier[] = ['NEW', 'TRUSTED', 'VERIFIED', 'ELITE', 'PARTNER'];

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-[4px] p-6 lg:p-8 space-y-6 font-sans shadow-sm animate-enter">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#334155] pb-5">
        <div>
          <div className="flex items-center gap-2 text-[#10b981] text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <Calculator className="w-3.5 h-3.5" /> ESCROW CLEARANCE & CAPITAL VELOCITY CALCULATOR
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Dynamic Collateral & Credit Line Modeler
          </h2>
          <p className="text-xs text-[#9ca3af] mt-0.5 font-sans">
            Model exact escrow reductions, idle reserve recovery, and capital efficiency multipliers across reputation tiers.
          </p>
        </div>

        {/* Toggle Mode */}
        <div className="flex items-center gap-1 p-1 bg-[#0f172a] border border-[#334155] rounded-[4px] self-start md:self-auto font-mono text-xs">
          <button
            onClick={() => { setUseActiveAgent(true); setCustomScore(activeAgent.creditScore); }}
            className={`px-3 py-1.5 font-bold rounded-[4px] transition-all whitespace-nowrap cursor-pointer ${
              useActiveAgent 
                ? 'bg-[#10b981] text-gray-950 shadow-sm' 
                : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            ACTIVE AGENT ({activeAgent.name.split('-')[0]})
          </button>
          <button
            onClick={() => setUseActiveAgent(false)}
            className={`px-3 py-1.5 font-bold rounded-[4px] transition-all whitespace-nowrap cursor-pointer ${
              !useActiveAgent 
                ? 'bg-[#1e293b] text-white border border-[#334155]' 
                : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            CUSTOM SCORE
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sliders & Parameters */}
        <div className="lg:col-span-5 space-y-5 bg-[#0f172a] p-5 rounded-[4px] border border-[#334155]">
          {/* Task Escrow Value */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-semibold text-gray-300 uppercase tracking-wider">
                CONTRACT ESCROW PRINCIPAL (RLO)
              </label>
              <span className="text-sm font-bold text-[#10b981] font-mono tabular-nums">
                {taskValue.toLocaleString()} RLO
              </span>
            </div>
            <input
              type="range"
              min={100}
              max={10000}
              step={100}
              value={taskValue}
              onChange={(e) => setTaskValue(Number(e.target.value))}
              className="w-full accent-[#10b981] bg-[#1e293b] h-2 rounded-[2px] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#64748b] font-mono">
              <span>100 RLO</span>
              <span>5,000 RLO</span>
              <span>10,000 RLO</span>
            </div>
          </div>

          {/* Credit Score Slider */}
          <div className="space-y-2.5 pt-2 border-t border-[#334155]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-semibold text-gray-300 uppercase tracking-wider">
                AGENT CREDIT SCORE
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white font-mono tabular-nums">
                  {effectiveScore} PTS
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-[4px] border border-[#334155] bg-[#1e293b] text-gray-200">
                  {currentTier.label.split(' ')[0]}
                </span>
              </div>
            </div>
            
            <input
              type="range"
              min={0}
              max={600}
              step={5}
              value={effectiveScore}
              disabled={useActiveAgent}
              onChange={(e) => setCustomScore(Number(e.target.value))}
              className={`w-full accent-[#10b981] bg-[#1e293b] h-2 rounded-[2px] ${useActiveAgent ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            />
            <div className="flex justify-between text-[10px] text-[#64748b] font-mono">
              <span>0 (NEW)</span>
              <span>150 (BRONZE)</span>
              <span>300 (SILVER)</span>
              <span>500+ (PLATINUM)</span>
            </div>
            {useActiveAgent && (
              <p className="text-[11px] text-[#9ca3af] font-sans">
                Locked to active session agent <strong className="text-gray-200 font-mono">{activeAgent.name}</strong>. Switch to "Custom Score" above to simulate scenarios.
              </p>
            )}
          </div>

          {/* Quick Simulation Presets */}
          {!useActiveAgent && (
            <div className="pt-2 border-t border-[#334155]">
              <div className="text-[10px] font-mono text-[#9ca3af] uppercase tracking-wider mb-2">
                PRESET BENCHMARKS:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'New (25)', score: 25 },
                  { label: 'Bronze (100)', score: 100 },
                  { label: 'Silver (220)', score: 220 },
                  { label: 'Gold (380)', score: 380 },
                  { label: 'Platinum (550)', score: 550 },
                ].map(p => (
                  <button
                    key={p.label}
                    onClick={() => setCustomScore(p.score)}
                    className="px-2.5 py-1 text-[11px] font-mono bg-[#1e293b] hover:bg-[#253349] text-gray-200 rounded-[4px] border border-[#334155] transition-colors cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Output Calculations Display */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-[4px] bg-[#0f172a] border border-[#334155] space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-[#334155] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#9ca3af] font-sans">
                  REQUIRED ESCROW COLLATERAL
                </span>
                <div className="text-3xl font-extrabold text-white tracking-tight flex items-baseline gap-2 mt-0.5 font-mono">
                  <span className="text-[#10b981]">{calculation.collateralPercent}%</span>
                  <span className="text-xs font-normal text-[#9ca3af] font-sans">
                    ({formatRLO(calculation.collateralAmount)})
                  </span>
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="text-[10px] uppercase tracking-wider text-[#9ca3af] font-sans">
                  CAPITAL VELOCITY
                </span>
                <div className="text-lg font-bold text-white mt-0.5">
                  {multiplier}
                </div>
              </div>
            </div>

            {/* Escrow Delta Visualization */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-[#9ca3af]">
                <span className="font-sans">ESCROW ALLOCATION BREAKDOWN</span>
                <span>
                  <strong className="text-[#10b981]">{calculation.collateralAmount.toLocaleString()} RLO</strong> LOCKED vs{' '}
                  <span className="text-gray-500 line-through">{calculation.baselineCollateralAmount.toLocaleString()} RLO</span> BASELINE
                </span>
              </div>
              <div className="h-3.5 w-full bg-[#0b1120] rounded-[2px] overflow-hidden flex border border-[#334155]">
                <div 
                  className="bg-[#1e3a8a] transition-all duration-200 flex items-center justify-center text-[9px] text-white font-mono font-bold"
                  style={{ width: `${Math.max(calculation.collateralPercent, 4)}%` }}
                >
                  {calculation.collateralPercent > 10 ? `${calculation.collateralPercent}%` : ''}
                </div>
                <div 
                  className="bg-[#10b981] transition-all duration-200 flex items-center justify-center text-[9px] text-gray-950 font-mono font-bold"
                  style={{ width: `${100 - calculation.collateralPercent}%` }}
                >
                  {100 - calculation.collateralPercent > 15 ? `SAVED ${100 - calculation.collateralPercent}%` : ''}
                </div>
              </div>

              <div className="flex justify-between text-[11px] font-mono text-gray-400 pt-1 font-sans">
                <span className="flex items-center gap-1.5 text-blue-300 font-mono">
                  <Lock className="w-3 h-3 text-blue-400" />
                  Locked Escrow: {formatRLO(calculation.collateralAmount)}
                </span>
                <span className="flex items-center gap-1.5 text-[#10b981] font-mono">
                  <Unlock className="w-3 h-3 text-[#10b981]" />
                  Freed Liquidity: +{formatRLO(calculation.savedCollateralAmount)}
                </span>
              </div>
            </div>

            {/* Institutional Clearance Statement */}
            <div className="p-4 rounded-[4px] bg-[#1e293b] border border-[#334155] flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  BUREAU DETERMINATION: {currentTier.label} ({calculation.collateralPercent}% COLLATERAL)
                </div>
                <p className="text-xs text-gray-300 leading-relaxed font-sans">
                  {effectiveScore >= 501 
                    ? 'Platinum tier agents qualify for unbonded 0% collateral labor contracts under Rialo SCALE protocol consensus.' 
                    : `Verified execution history authorizes an immediate ${100 - calculation.collateralPercent}% collateral reduction, unlocking ${formatRLO(calculation.savedCollateralAmount)} for simultaneous parallel execution.`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Institutional Tier Matrix */}
      <div className="border-t border-[#334155] pt-5 space-y-3 font-sans">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-gray-300">
            OFFICIAL RIALO SCALE COLLATERAL SCHEDULE
          </h3>
          <span className="text-[11px] font-mono text-[#9ca3af]">CREDIT RATING SPECIFICATION</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {tierKeys.map(tKey => {
            const t = TIERS[tKey];
            const isCurrent = t.tier === currentTier.tier;
            return (
              <div
                key={t.tier}
                className={`p-3.5 rounded-[4px] border transition-all ${
                  isCurrent 
                    ? 'border-[#10b981] bg-[#0f172a]' 
                    : 'border-[#334155] bg-[#0f172a]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[11px] font-mono font-bold ${
                    t.tier === 'PARTNER' ? 'text-cyan-300' :
                    t.tier === 'ELITE' ? 'text-amber-300' :
                    t.tier === 'VERIFIED' ? 'text-slate-200' :
                    t.tier === 'TRUSTED' ? 'text-amber-600' : 'text-slate-400'
                  }`}>{t.label.split(' ')[0]}</span>
                  {isCurrent && (
                    <span className="text-[9px] font-mono font-bold text-gray-950 bg-[#10b981] px-1.5 py-0.5 rounded-[4px]">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#9ca3af] font-mono mb-2">
                  {t.minScore}{t.maxScore === Infinity ? '+ PTS' : `–${t.maxScore} PTS`}
                </div>
                <div className="text-base font-bold text-white font-mono">
                  {t.collateralPercent}% <span className="text-[10px] font-normal text-[#9ca3af] font-sans">req.</span>
                </div>
                <div className="text-[11px] text-[#9ca3af] mt-1 line-clamp-2 font-sans">
                  {t.benefits[0]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
