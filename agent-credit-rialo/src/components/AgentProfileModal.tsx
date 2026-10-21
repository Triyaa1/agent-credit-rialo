import React from 'react';
import { useApp } from '../context/AppContext';
import { Agent, ExecutionPassport, CreditTier } from '../types';
import { TIERS, getNextTier, formatAddress, formatRLO } from '../utils/creditScore';
import { 
  ShieldCheck, 
  X, 
  ExternalLink, 
  CheckCircle2, 
  FileCheck, 
  TrendingUp, 
  Award, 
  Zap, 
  Clock, 
  ArrowRight, 
  Diamond, 
  Medal, 
  Building2, 
  Lock, 
  Unlock 
} from 'lucide-react';

interface AgentProfileModalProps {
  agent: Agent | null;
  onClose: () => void;
  onOpenPassport: (passportId: string) => void;
}

export const AgentProfileModal: React.FC<AgentProfileModalProps> = ({
  agent,
  onClose,
  onOpenPassport
}) => {
  const { passports, activeAgent, setActiveAgentId } = useApp();

  if (!agent) return null;

  const tierConfig = TIERS[agent.tier];
  const nextTier = getNextTier(agent.tier);
  const agentPassports = passports.filter(p => p.workerAddress.toLowerCase() === agent.address.toLowerCase());
  const isActive = activeAgent.id === agent.id;

  let progressPercent = 100;
  let pointsNeeded = 0;
  if (nextTier) {
    const range = nextTier.minScore - tierConfig.minScore;
    const progress = Math.max(0, agent.creditScore - tierConfig.minScore);
    progressPercent = Math.min(100, Math.round((progress / range) * 100));
    pointsNeeded = Math.max(0, nextTier.minScore - agent.creditScore);
  }

  const renderTierPill = (tier: CreditTier) => {
    switch (tier) {
      case 'PARTNER':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[4px] text-[11px] font-mono font-bold bg-[#1e293b] text-cyan-300 border border-cyan-500/70">
            <Diamond className="w-3 h-3 text-cyan-300" />
            PLATINUM (0% COLLATERAL)
          </span>
        );
      case 'ELITE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[4px] text-[11px] font-mono font-bold bg-[#1e293b] text-amber-300 border border-amber-500/80">
            <Award className="w-3 h-3 text-amber-300" />
            GOLD (25% COLLATERAL)
          </span>
        );
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[4px] text-[11px] font-mono font-bold bg-[#1e293b] text-slate-200 border border-slate-400">
            <Medal className="w-3 h-3 text-slate-300" />
            SILVER (50% COLLATERAL)
          </span>
        );
      case 'TRUSTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[4px] text-[11px] font-mono font-bold bg-[#1e293b] text-amber-600 border border-amber-700/80">
            <ShieldCheck className="w-3 h-3 text-amber-600" />
            BRONZE (75% COLLATERAL)
          </span>
        );
      case 'NEW':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[4px] text-[11px] font-mono font-medium bg-[#1e293b] text-slate-400 border border-slate-600">
            NEW AGENT (100% COLLATERAL)
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm font-sans animate-enter">
      <div className="relative w-full max-w-3xl bg-[#0b1120] border border-[#334155] rounded-[4px] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col font-sans">
        
        {/* Dossier Header */}
        <div className="bg-[#0f172a] border-b border-[#334155] p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-[4px] bg-[#1e293b] border border-[#334155] flex items-center justify-center text-lg font-bold font-mono text-white shrink-0">
                {agent.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-white tracking-tight">{agent.name}</h3>
                  {renderTierPill(agent.tier)}
                  {isActive && (
                    <span className="text-[10px] font-mono font-bold text-[#10b981] bg-[#1e293b] px-2 py-0.5 rounded-[4px] border border-[#10b981]/50">
                      CURRENT SESSION
                    </span>
                  )}
                </div>
                <div className="text-xs font-mono text-[#9ca3af] break-all">{agent.address}</div>
                <p className="text-xs text-gray-300 mt-1 max-w-xl leading-relaxed font-sans">{agent.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 font-mono">
              {!isActive && (
                <button
                  onClick={() => {
                    setActiveAgentId(agent.id);
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-gray-950 bg-[#10b981] hover:bg-emerald-400 active:bg-emerald-600 rounded-[4px] transition-all whitespace-nowrap shadow-sm cursor-pointer"
                >
                  SET ACTIVE
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-[4px] text-gray-400 hover:text-white hover:bg-[#1e293b] transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dossier Body */}
        <div className="p-5 overflow-y-auto space-y-5 bg-[#0b1120]">
          {/* Credit Rating Card */}
          <div className="p-4 rounded-[4px] bg-[#1e293b] border border-[#334155] space-y-3 font-mono shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-[#9ca3af] uppercase tracking-wider block font-sans">BUREAU CREDIT SCORE</span>
                <div className="text-2xl font-extrabold text-white tracking-tight flex items-baseline gap-2 mt-0.5">
                  <span className="text-[#10b981]">{agent.creditScore}</span>
                  <span className="text-xs font-normal text-[#9ca3af]">POINTS</span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-[#9ca3af] uppercase tracking-wider block font-sans">ESCROW CLEARANCE PRIVILEGE</span>
                <div className="text-lg font-bold text-white mt-0.5">
                  <span className={tierConfig.collateralPercent === 0 ? 'text-[#10b981]' : 'text-gray-200'}>
                    {tierConfig.collateralPercent}% REQUIRED
                  </span>
                  <span className="text-xs font-normal text-[#9ca3af] ml-1.5 font-sans">
                    ({100 - tierConfig.collateralPercent}% relief)
                  </span>
                </div>
              </div>
            </div>

            {/* Progression to Next Rating */}
            {nextTier ? (
              <div className="space-y-1.5 pt-2 border-t border-[#334155]">
                <div className="flex justify-between text-[11px] text-gray-300 font-sans">
                  <span>PROGRESS TO <strong className="text-white font-mono">{nextTier.label}</strong> ({nextTier.minScore} PTS)</span>
                  <span><strong className="text-[#10b981] font-mono">{pointsNeeded}</strong> PTS TO UNLOCK {nextTier.collateralPercent}% COLLATERAL</span>
                </div>
                <div className="h-2 w-full bg-[#0f172a] rounded-[2px] overflow-hidden border border-[#334155]">
                  <div
                    className="h-full bg-[#10b981] transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-xs text-cyan-300 pt-2 border-t border-[#334155] flex items-center gap-1.5">
                <Diamond className="w-3.5 h-3.5 text-cyan-300" />
                <span>MAXIMUM PLATINUM TIER RATING: UNBONDED ESCROW EXEMPTION APPROVED.</span>
              </div>
            )}
          </div>

          {/* Core Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono">
            <div className="p-3 rounded-[4px] bg-[#1e293b] border border-[#334155] text-center shadow-sm">
              <span className="text-[10px] text-[#9ca3af] uppercase block font-sans">TASKS CLEARED</span>
              <div className="text-base font-bold text-white mt-0.5 tabular-nums">
                {agent.tasksCompleted}
              </div>
            </div>

            <div className="p-3 rounded-[4px] bg-[#1e293b] border border-[#334155] text-center shadow-sm">
              <span className="text-[10px] text-[#9ca3af] uppercase block font-sans">SUCCESS RATE</span>
              <div className="text-base font-bold text-[#10b981] mt-0.5 tabular-nums">
                {agent.successRate}%
              </div>
            </div>

            <div className="p-3 rounded-[4px] bg-[#1e293b] border border-[#334155] text-center shadow-sm">
              <span className="text-[10px] text-[#9ca3af] uppercase block font-sans">TRANSACTED</span>
              <div className="text-base font-bold text-gray-200 mt-0.5 tabular-nums">
                {formatRLO(agent.totalValueTransacted)}
              </div>
            </div>

            <div className="p-3 rounded-[4px] bg-[#1e293b] border border-[#334155] text-center shadow-sm">
              <span className="text-[10px] text-[#9ca3af] uppercase block font-sans">PASSPORTS SEALED</span>
              <div className="text-base font-bold text-amber-400 mt-0.5 tabular-nums">
                {agentPassports.length}
              </div>
            </div>
          </div>

          {/* Passports List */}
          <div className="space-y-2.5 font-sans">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-[#10b981]" />
                VERIFIED EXECUTION PASSPORTS ({agentPassports.length})
              </h4>
              <span className="text-[10px] font-mono text-[#9ca3af]">ON-CHAIN SHA-256 SIGNATURES</span>
            </div>

            {agentPassports.length === 0 ? (
              <div className="p-5 rounded-[4px] bg-[#1e293b] border border-[#334155] text-center text-xs text-[#9ca3af] font-mono">
                NO PASSPORTS RECORDED YET.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono">
                {agentPassports.map(pass => (
                  <div
                    key={pass.id}
                    onClick={() => onOpenPassport(pass.id)}
                    className="p-3 rounded-[4px] bg-[#1e293b] border border-[#334155] hover:border-[#10b981] transition-all cursor-pointer group space-y-1.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white group-hover:text-[#10b981]">
                        {pass.id}
                      </span>
                      <span className="text-amber-400 font-bold">
                        {'★'.repeat(pass.qualityRating)}
                      </span>
                    </div>

                    <div className="text-xs font-sans text-gray-200 line-clamp-1">
                      {pass.taskTitle}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#9ca3af] pt-1 border-t border-[#334155]">
                      <span>Saved: <strong className="text-[#10b981]">+{formatRLO(pass.collateralSaved)}</strong></span>
                      <span className="text-[#9ca3af]">{new Date(pass.completedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#334155] bg-[#0f172a] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-mono font-bold text-gray-950 bg-[#10b981] hover:bg-emerald-400 active:bg-emerald-600 rounded-[4px] transition-all cursor-pointer shadow-sm"
          >
            CLOSE DOSSIER
          </button>
        </div>
      </div>
    </div>
  );
};
