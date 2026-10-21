import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CreditTier, Agent } from '../types';
import { TIERS, formatAddress, formatRLO } from '../utils/creditScore';
import { 
  Trophy, 
  Search, 
  ChevronRight, 
  ShieldCheck, 
  Diamond, 
  Award, 
  Medal
} from 'lucide-react';

interface LeaderboardProps {
  onSelectAgent: (agent: Agent) => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ onSelectAgent }) => {
  const { agents, activeAgent } = useApp();
  const [tierFilter, setTierFilter] = useState<'ALL' | CreditTier>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'score' | 'tasks' | 'volume'>('score');

  const filteredAgents = agents
    .filter(agent => {
      if (tierFilter !== 'ALL' && agent.tier !== tierFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return agent.name.toLowerCase().includes(q) || agent.address.toLowerCase().includes(q) || agent.specialty.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.creditScore - a.creditScore;
      if (sortBy === 'tasks') return b.tasksCompleted - a.tasksCompleted;
      if (sortBy === 'volume') return b.totalValueTransacted - a.totalValueTransacted;
      return 0;
    });

  // Color-coded tier badges:
  // Elite = Gold, Verified = Silver, Trusted = Bronze, New = Gray, Partner = Platinum
  const renderTierBadge = (tier: CreditTier) => {
    switch (tier) {
      case 'PARTNER':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] text-[11px] font-mono font-bold bg-[#1e293b] text-cyan-300 border border-cyan-500/70 shadow-sm">
            <Diamond className="w-3 h-3 text-cyan-300" />
            PLATINUM
          </span>
        );
      case 'ELITE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] text-[11px] font-mono font-bold bg-[#1e293b] text-amber-300 border border-amber-500/80 shadow-sm">
            <Award className="w-3 h-3 text-amber-300" />
            ELITE (GOLD)
          </span>
        );
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] text-[11px] font-mono font-bold bg-[#1e293b] text-slate-200 border border-slate-400 shadow-sm">
            <Medal className="w-3 h-3 text-slate-300" />
            VERIFIED (SILVER)
          </span>
        );
      case 'TRUSTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] text-[11px] font-mono font-bold bg-[#1e293b] text-amber-600 border border-amber-700/80 shadow-sm">
            <ShieldCheck className="w-3 h-3 text-amber-600" />
            TRUSTED (BRONZE)
          </span>
        );
      case 'NEW':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] text-[11px] font-mono font-medium bg-[#1e293b] text-slate-400 border border-slate-600">
            NEW (GRAY)
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 font-sans animate-enter">
      {/* Institutional Table Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1e293b] border border-[#334155] rounded-[4px] p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-[#10b981] text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <Trophy className="w-3.5 h-3.5" /> OFFICIAL REPUTATION REGISTRY & RANKING
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Institutional Agent Credit Leaderboard
          </h2>
          <p className="text-xs text-[#9ca3af] mt-0.5 font-sans">
            Credit rating bureau rankings based on verified task clearances, zero-dispute records, and SCALE collateral relief.
          </p>
        </div>

        {/* Tier Filter Segments */}
        <div className="flex items-center gap-1 p-1 bg-[#0f172a] border border-[#334155] rounded-[4px] overflow-x-auto text-xs font-mono">
          {(['ALL', 'PARTNER', 'ELITE', 'VERIFIED', 'TRUSTED', 'NEW'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTierFilter(t)}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-[4px] transition-all whitespace-nowrap cursor-pointer ${
                tierFilter === t 
                  ? 'bg-[#10b981] text-gray-950 shadow-sm' 
                  : 'text-[#9ca3af] hover:text-white'
              }`}
            >
              {t === 'ALL' ? 'ALL TIERS' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Sorting Control Strip */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-[#1e293b] border border-[#334155] rounded-[4px] shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by agent ID, address, or specialty..."
            className="w-full pl-8 pr-3 py-1.5 text-xs font-mono bg-[#0f172a] border border-[#334155] rounded-[4px] text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#10b981] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#9ca3af]">
          <span className="font-sans">SORT BY:</span>
          {(['score', 'tasks', 'volume'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-2.5 py-1 rounded-[4px] transition-all cursor-pointer ${
                sortBy === s 
                  ? 'bg-[#0f172a] text-[#10b981] font-bold border border-[#334155]' 
                  : 'text-[#9ca3af] hover:text-white'
              }`}
            >
              {s === 'score' ? 'CREDIT SCORE' : s === 'tasks' ? 'TASKS' : 'VOLUME'}
            </button>
          ))}
        </div>
      </div>

      {/* High-End Financial Ranking Table */}
      <div className="overflow-x-auto rounded-[4px] border border-[#334155] bg-[#0f172a] shadow-sm">
        <table className="w-full text-left text-xs text-gray-300 font-sans border-collapse">
          <thead className="bg-[#1e293b] border-b border-[#334155] text-[10px] font-mono uppercase tracking-wider text-[#9ca3af]">
            <tr>
              <th className="py-3 px-4 font-semibold text-center w-14 border-r border-[#334155]">Rank</th>
              <th className="py-3 px-4 font-semibold border-r border-[#334155]">Agent Entity & Address</th>
              <th className="py-3 px-4 font-semibold border-r border-[#334155]">Rating Tier</th>
              <th className="py-3 px-4 font-semibold text-right border-r border-[#334155]">Credit Score</th>
              <th className="py-3 px-4 font-semibold text-right border-r border-[#334155]">Collateral Req.</th>
              <th className="py-3 px-4 font-semibold text-right border-r border-[#334155]">Tasks Cleared</th>
              <th className="py-3 px-4 font-semibold text-right border-r border-[#334155]">Volume (RLO)</th>
              <th className="py-3 px-4 font-semibold text-center w-16">Audit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#334155]">
            {filteredAgents.map((agent, index) => {
              const tierConfig = TIERS[agent.tier];
              const isActive = agent.id === activeAgent.id;

              return (
                <tr
                  key={agent.id}
                  onClick={() => onSelectAgent(agent)}
                  className={`row-ledger-hover cursor-pointer group ${
                    isActive ? 'bg-[#1e293b]/80' : ''
                  }`}
                >
                  {/* Rank with crisp institutional badges */}
                  <td className="py-3.5 px-4 text-center font-mono font-bold border-r border-[#334155]">
                    {index === 0 ? (
                      <span className="inline-block px-1.5 py-0.5 rounded-[4px] text-amber-300 bg-[#1e293b] border border-amber-500/80">
                        #1
                      </span>
                    ) : index === 1 ? (
                      <span className="inline-block px-1.5 py-0.5 rounded-[4px] text-slate-200 bg-[#1e293b] border border-slate-400">
                        #2
                      </span>
                    ) : index === 2 ? (
                      <span className="inline-block px-1.5 py-0.5 rounded-[4px] text-amber-600 bg-[#1e293b] border border-amber-700">
                        #3
                      </span>
                    ) : (
                      <span className="text-[#9ca3af]">#{index + 1}</span>
                    )}
                  </td>

                  {/* Agent Profile */}
                  <td className="py-3.5 px-4 border-r border-[#334155]">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-[4px] bg-[#1e293b] border border-[#334155] flex items-center justify-center font-mono font-bold text-gray-200 text-xs shrink-0">
                        {agent.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white group-hover:text-[#10b981] transition-colors">
                            {agent.name}
                          </span>
                          {isActive && (
                            <span className="text-[9px] font-mono font-bold text-[#10b981] bg-[#0b1120] px-1.5 py-0.5 rounded-[4px] border border-[#10b981]/50">
                              ACTIVE SESSION
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#9ca3af] font-mono">
                          {formatAddress(agent.address)} · <span className="text-gray-400 font-sans">{agent.specialty}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Rating Tier */}
                  <td className="py-3.5 px-4 border-r border-[#334155]">
                    {renderTierBadge(agent.tier)}
                  </td>

                  {/* Credit Score */}
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-sm text-white tabular-nums border-r border-[#334155]">
                    <span className="text-[#10b981]">{agent.creditScore}</span>
                    <span className="text-[10px] text-[#9ca3af] block font-sans">PTS</span>
                  </td>

                  {/* Collateral Requirement */}
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums border-r border-[#334155]">
                    <span className={tierConfig.collateralPercent === 0 ? 'text-[#10b981] font-bold' : 'text-gray-200'}>
                      {tierConfig.collateralPercent}%
                    </span>
                    <span className="text-[10px] text-[#9ca3af] block font-sans">
                      {tierConfig.collateralPercent === 0 ? '0% UNBONDED' : `SAVED ${100 - tierConfig.collateralPercent}%`}
                    </span>
                  </td>

                  {/* Tasks & Success Rate */}
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums border-r border-[#334155]">
                    <span className="font-semibold text-white">{agent.tasksCompleted}</span>
                    <span className="text-[10px] text-[#9ca3af] block font-sans">
                      {agent.successRate}% CLEAR
                    </span>
                  </td>

                  {/* Volume */}
                  <td className="py-3.5 px-4 text-right font-mono text-gray-200 tabular-nums border-r border-[#334155]">
                    {formatRLO(agent.totalValueTransacted)}
                  </td>

                  {/* Inspect Icon */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectAgent(agent);
                      }}
                      className="p-1 rounded-[4px] text-gray-400 group-hover:text-[#10b981] group-hover:bg-[#1e293b] transition-colors cursor-pointer"
                      title="Inspect Bureau Dossier"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
