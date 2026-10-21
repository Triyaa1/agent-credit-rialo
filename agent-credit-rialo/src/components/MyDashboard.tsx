import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TIERS, getNextTier, formatAddress, formatRLO } from '../utils/creditScore';
import { 
  ShieldCheck, 
  FileCheck, 
  Briefcase, 
  TrendingUp, 
  Zap, 
  CheckCircle2, 
  Award,
  ArrowUpRight,
  Plus,
  Play,
  Building2,
  Diamond,
  Medal,
  CheckCheck,
  Fingerprint,
  Info
} from 'lucide-react';

interface MyDashboardProps {
  onOpenCreateTask: () => void;
  onOpenPassport: (passportId: string) => void;
  onOpenAgentSwitcher: () => void;
}

export const MyDashboard: React.FC<MyDashboardProps> = ({
  onOpenCreateTask,
  onOpenPassport,
  onOpenAgentSwitcher
}) => {
  const { 
    activeAgent, 
    tasks, 
    passports, 
    isWalletConnected, 
    setIsConnectModalOpen,
    requireWallet 
  } = useApp();
  const [activeTab, setActiveTab] = useState<'passports' | 'created_tasks' | 'accepted_tasks'>('passports');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; score: number; label: string; date: string } | null>(null);

  const tierConfig = TIERS[activeAgent.tier];
  const nextTier = getNextTier(activeAgent.tier);

  const myPassports = passports.filter(
    p => p.workerAddress.toLowerCase() === activeAgent.address.toLowerCase()
  );
  const myCreatedTasks = tasks.filter(
    t => t.clientAddress.toLowerCase() === activeAgent.address.toLowerCase()
  );
  const myAcceptedTasks = tasks.filter(
    t => t.workerAddress?.toLowerCase() === activeAgent.address.toLowerCase()
  );

  let progressPercent = 100;
  let pointsNeeded = 0;
  if (nextTier) {
    const range = nextTier.minScore - tierConfig.minScore;
    const progress = Math.max(0, activeAgent.creditScore - tierConfig.minScore);
    progressPercent = Math.min(100, Math.round((progress / range) * 100));
    pointsNeeded = Math.max(0, nextTier.minScore - activeAgent.creditScore);
  }

  // Institutional SVG Chart Calculation for Credit Score History
  const history = activeAgent.scoreHistory;
  const scores = history.map(h => h.score);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(100, ...scores);
  const scoreRange = Math.max(20, maxScore - minScore + 20);
  
  const svgWidth = 700;
  const svgHeight = 180;
  const paddingX = 45;
  const paddingY = 30;

  const points = history.map((entry, idx) => {
    const x = history.length <= 1 
      ? svgWidth / 2 
      : paddingX + (idx / (history.length - 1)) * (svgWidth - 2 * paddingX);
    const normalizedY = (entry.score - (minScore - 10)) / scoreRange;
    const y = svgHeight - paddingY - Math.max(0, Math.min(1, normalizedY)) * (svgHeight - 2 * paddingY);
    return { x, y, score: entry.score, label: entry.reason, date: entry.timestamp };
  });

  const lineD = points.length > 0 
    ? `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`
    : '';

  const areaD = points.length > 0
    ? `M ${points[0].x},${svgHeight - paddingY} L ${points.map(p => `${p.x},${p.y}`).join(' L ')} L ${points[points.length - 1].x},${svgHeight - paddingY} Z`
    : '';

  return (
    <div className="space-y-6 font-sans animate-enter">
      {/* Wallet Connection Banner (if not connected) */}
      {!isWalletConnected && (
        <div className="p-4 rounded-[4px] bg-[#1e293b] border border-[#10b981]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0"></span>
            <div>
              <span className="text-xs font-bold text-white uppercase block">
                PREVIEW MODE (WALLET DISCONNECTED)
              </span>
              <span className="text-[11px] text-[#9ca3af] font-sans block">
                Connect your Web3 agent wallet to authenticate your official credit dossier and sign dockets.
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsConnectModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-bold text-gray-950 bg-[#10b981] hover:bg-emerald-400 active:bg-emerald-600 rounded-[4px] transition-all whitespace-nowrap shadow-sm cursor-pointer"
          >
            CONNECT WALLET
          </button>
        </div>
      )}

      {/* Institutional Agent Header Banner */}
      <div className="p-6 bg-[#1e293b] border border-[#334155] rounded-[4px] space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[4px] bg-[#0f172a] border border-[#334155] flex items-center justify-center font-mono font-bold text-white text-lg">
              {activeAgent.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {activeAgent.name}
                </h2>
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-[4px] border border-[#334155] bg-[#0f172a] text-[#10b981]">
                  {tierConfig.label}
                </span>
              </div>
              <div className="text-xs font-mono text-[#9ca3af] mt-0.5">
                {activeAgent.address} · <span className="text-gray-300 font-sans">{activeAgent.specialty}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <button
              onClick={onOpenAgentSwitcher}
              className="px-3.5 py-1.5 text-xs text-gray-300 hover:text-white bg-[#0f172a] hover:bg-[#253349] rounded-[4px] border border-[#334155] transition-all cursor-pointer"
            >
              SWITCH AGENT
            </button>
            <button
              onClick={onOpenCreateTask}
              className="px-3.5 py-1.5 text-xs font-bold text-gray-950 bg-[#10b981] hover:bg-emerald-400 active:bg-emerald-600 rounded-[4px] transition-all inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>POST TASK</span>
            </button>
          </div>
        </div>

        {/* 4 Key Metrics Bloomberg Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-[4px] bg-[#0f172a] border border-[#334155]">
            <span className="text-[10px] font-mono text-[#9ca3af] uppercase tracking-wider block font-sans">CREDIT SCORE</span>
            <div className="text-2xl font-bold text-white font-mono mt-0.5 tabular-nums">
              <span className="text-[#10b981]">{activeAgent.creditScore}</span>
              <span className="text-xs font-normal text-gray-400 ml-1">PTS</span>
            </div>
            <span className="text-[10px] font-mono text-[#9ca3af] mt-1 block">
              Tier: {tierConfig.label.split(' ')[0]}
            </span>
          </div>

          <div className="p-3.5 rounded-[4px] bg-[#0f172a] border border-[#334155]">
            <span className="text-[10px] font-mono text-[#9ca3af] uppercase tracking-wider block font-sans">COLLATERAL REQUIRED</span>
            <div className="text-2xl font-bold text-white font-mono mt-0.5 tabular-nums">
              <span className={tierConfig.collateralPercent === 0 ? 'text-[#10b981]' : 'text-gray-200'}>
                {tierConfig.collateralPercent}%
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#9ca3af] mt-1 block font-sans">
              {tierConfig.collateralPercent === 0 ? 'Unbonded Labor' : `${100 - tierConfig.collateralPercent}% Collateral Discount`}
            </span>
          </div>

          <div className="p-3.5 rounded-[4px] bg-[#0f172a] border border-[#334155]">
            <span className="text-[10px] font-mono text-[#9ca3af] uppercase tracking-wider block font-sans">PASSPORTS EARNED</span>
            <div className="text-2xl font-bold text-white font-mono mt-0.5 tabular-nums">
              {myPassports.length}
            </div>
            <span className="text-[10px] font-mono text-[#9ca3af] mt-1 block font-sans">
              {activeAgent.tasksCompleted} Completed Contracts
            </span>
          </div>

          <div className="p-3.5 rounded-[4px] bg-[#0f172a] border border-[#334155]">
            <span className="text-[10px] font-mono text-[#9ca3af] uppercase tracking-wider block font-sans">TOTAL TRANSACTED</span>
            <div className="text-2xl font-bold text-white font-mono mt-0.5 tabular-nums">
              {formatRLO(activeAgent.totalValueTransacted)}
            </div>
            <span className="text-[10px] font-mono text-[#10b981] mt-1 block font-sans">
              {activeAgent.successRate}% Success Metric
            </span>
          </div>
        </div>

        {/* Tier Advancement Bar */}
        <div className="p-3.5 rounded-[4px] bg-[#0f172a] border border-[#334155] space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-1">
            <span className="text-gray-300 font-sans">
              CURRENT TIER: <strong className="text-white font-mono">{tierConfig.label}</strong> ({tierConfig.collateralPercent}% COLLATERAL)
            </span>
            {nextTier ? (
              <span className="text-[#10b981] font-medium">
                NEXT TIER: <strong>{nextTier.label}</strong> ({nextTier.minScore} PTS) · {pointsNeeded} PTS REQUIRED
              </span>
            ) : (
              <span className="text-cyan-300 font-bold">
                ★ HIGHEST PLATINUM TIER: 0% UNBONDED COLLATERAL
              </span>
            )}
          </div>
          <div className="h-2 w-full bg-[#0b1120] rounded-[2px] overflow-hidden border border-[#334155]">
            <div
              className="h-full bg-[#10b981] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Credit Score History Terminal Chart */}
      <div className="p-5 bg-[#1e293b] border border-[#334155] rounded-[4px] space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#334155] pb-3 gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-[#10b981] text-xs font-mono font-semibold uppercase tracking-wider mb-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> REPUTATION LEDGER AUDIT TRAIL
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">Credit Score Trajectory</h3>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-[#9ca3af]">
            <span>RANGE: <strong className="text-white">{minScore} – {maxScore} PTS</strong></span>
            <span>·</span>
            <span>BALANCE: <strong className="text-[#10b981]">{activeAgent.creditScore} PTS</strong></span>
          </div>
        </div>

        {/* SVG Terminal Chart with Hover Tooltip */}
        <div 
          className="relative w-full h-44 bg-[#0b1120] rounded-[4px] border border-[#334155] p-2 overflow-hidden flex items-center justify-center cursor-crosshair"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <svg className="w-full h-full" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Subtle horizontal grid lines */}
            {[0.25, 0.5, 0.75].map((ratio, i) => {
              const yVal = paddingY + ratio * (svgHeight - 2 * paddingY);
              return (
                <line 
                  key={i} 
                  x1={0} 
                  y1={yVal} 
                  x2={svgWidth} 
                  y2={yVal} 
                  stroke="#334155" 
                  strokeWidth="0.75"
                  strokeDasharray="4 4" 
                />
              );
            })}

            {/* Area Fill */}
            {areaD && (
              <path
                d={areaD}
                fill="url(#scoreGradient)"
              />
            )}

            {/* Green Line */}
            {lineD && (
              <path
                d={lineD}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data Points */}
            {points.map((pt, i) => (
              <g 
                key={i}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(pt)}
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="4.5"
                  className="fill-[#10b981] stroke-[#0b1120] stroke-2 hover:r-6 transition-all"
                />
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  fill="#94a3b8"
                  fontSize="10"
                  textAnchor="middle"
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight="600"
                >
                  {pt.score}
                </text>
              </g>
            ))}
          </svg>

          {/* Floating Tooltip */}
          {hoveredPoint && (
            <div 
              className="absolute pointer-events-none bg-[#1e293b] border border-[#334155] rounded-[4px] shadow-lg p-2 text-xs font-mono z-20 space-y-0.5"
              style={{
                left: `${Math.min(75, Math.max(10, (hoveredPoint.x / svgWidth) * 100))}%`,
                top: '12px'
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-[#10b981] font-bold">{hoveredPoint.score} PTS</span>
                <span className="text-[10px] text-[#9ca3af]">{hoveredPoint.date}</span>
              </div>
              <div className="text-[11px] text-gray-200 font-sans">{hoveredPoint.label}</div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-[10px] text-[#9ca3af] font-mono">
          <span>GENESIS AUDIT</span>
          <span>{history.length} AUDIT ENTRIES ON LEDGER</span>
          <span>LATEST COMMIT</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 border-b border-[#334155] pb-2.5 overflow-x-auto font-mono text-xs">
          <button
            onClick={() => setActiveTab('passports')}
            className={`px-3 py-1.5 font-bold rounded-[4px] transition-all whitespace-nowrap inline-flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'passports'
                ? 'bg-[#1e293b] text-[#10b981] border border-[#334155]'
                : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>EXECUTION PASSPORTS ({myPassports.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('accepted_tasks')}
            className={`px-3 py-1.5 font-bold rounded-[4px] transition-all whitespace-nowrap inline-flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'accepted_tasks'
                ? 'bg-[#1e293b] text-[#10b981] border border-[#334155]'
                : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>CONTRACTS AS WORKER ({myAcceptedTasks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('created_tasks')}
            className={`px-3 py-1.5 font-bold rounded-[4px] transition-all whitespace-nowrap inline-flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'created_tasks'
                ? 'bg-[#1e293b] text-[#10b981] border border-[#334155]'
                : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>CONTRACTS AS CLIENT ({myCreatedTasks.length})</span>
          </button>
        </div>

        {/* Tab 1: Official Execution Passports Grid */}
        {activeTab === 'passports' && (
          <div>
            {myPassports.length === 0 ? (
              <div className="p-8 text-center rounded-[4px] bg-[#1e293b] border border-[#334155] space-y-1.5 font-sans">
                <FileCheck className="w-6 h-6 text-gray-500 mx-auto" />
                <h4 className="text-xs font-bold text-white uppercase font-mono">NO PASSPORTS RECORDED</h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto font-sans">
                  Execute open tasks in the market to earn verified certificates and climb credit tiers.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {myPassports.map(p => (
                  <div
                    key={p.id}
                    onClick={() => onOpenPassport(p.id)}
                    className="relative p-4 rounded-[4px] bg-[#1e293b] border border-[#334155] hover:border-[#10b981] transition-all cursor-pointer group space-y-2.5 font-mono shadow-sm"
                  >
                    {/* Header Strip */}
                    <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                        <span className="font-bold text-xs text-white group-hover:text-[#10b981] transition-colors">
                          {p.id}
                        </span>
                      </div>
                      <span className="text-xs text-amber-400 font-bold tracking-widest">
                        {'★'.repeat(p.qualityRating)}
                      </span>
                    </div>

                    {/* Task Title */}
                    <div className="text-xs font-sans text-gray-200 line-clamp-2 leading-relaxed">
                      {p.taskTitle}
                    </div>

                    {/* Hash & Verified Status */}
                    <div className="p-2 rounded-[4px] bg-[#0f172a] border border-[#334155] flex items-center justify-between text-[10px]">
                      <span className="text-[#9ca3af] truncate max-w-[140px]">
                        HASH: {p.hashSignature.slice(0, 10)}...{p.hashSignature.slice(-6)}
                      </span>
                      <span className="text-[#10b981] font-bold inline-flex items-center gap-1">
                        <CheckCheck className="w-3 h-3 text-[#10b981]" /> VERIFIED
                      </span>
                    </div>

                    {/* Financial Clearance Metrics */}
                    <div className="space-y-1 text-[11px] text-[#9ca3af] pt-1 font-sans">
                      <div className="flex justify-between font-mono">
                        <span className="font-sans text-[10px]">REMITTANCE:</span>
                        <strong className="text-white">{formatRLO(p.paymentAmount)}</strong>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="font-sans text-[10px]">CAPITAL FREED:</span>
                        <strong className="text-[#10b981]">+{formatRLO(p.collateralSaved)}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Accepted Tasks */}
        {activeTab === 'accepted_tasks' && (
          <div className="space-y-2">
            {myAcceptedTasks.length === 0 ? (
              <div className="p-8 text-center rounded-[4px] bg-[#1e293b] border border-[#334155] text-xs text-gray-400 font-mono">
                NO WORKER CONTRACTS ACTIVE.
              </div>
            ) : (
              myAcceptedTasks.map(t => (
                <div
                  key={t.id}
                  className="p-3 rounded-[4px] bg-[#1e293b] border border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono shadow-sm"
                >
                  <div className="space-y-0.5 font-sans">
                    <div className="font-bold text-white text-xs">{t.title}</div>
                    <div className="text-gray-400 font-mono text-[11px]">
                      CLIENT: {t.clientName} · VALUE: <strong className="text-[#10b981]">{formatRLO(t.paymentAmount)}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold border border-[#334155] bg-[#0f172a] text-[#10b981]">
                      {t.status}
                    </span>
                    {t.passportId && (
                      <button
                        onClick={() => onOpenPassport(t.passportId!)}
                        className="px-2.5 py-1 bg-[#0f172a] hover:bg-[#253349] text-[#10b981] rounded-[4px] border border-[#334155] transition-colors text-[11px] cursor-pointer"
                      >
                        PASSPORT
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Created Tasks */}
        {activeTab === 'created_tasks' && (
          <div className="space-y-2">
            {myCreatedTasks.length === 0 ? (
              <div className="p-8 text-center rounded-[4px] bg-[#1e293b] border border-[#334155] text-xs text-gray-400 font-mono">
                NO CONTRACTS CREATED AS CLIENT.
              </div>
            ) : (
              myCreatedTasks.map(t => (
                <div
                  key={t.id}
                  className="p-3 rounded-[4px] bg-[#1e293b] border border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono shadow-sm"
                >
                  <div className="space-y-0.5 font-sans">
                    <div className="font-bold text-white text-xs">{t.title}</div>
                    <div className="text-gray-400 font-mono text-[11px]">
                      WORKER: {t.workerName || 'AWAITING DISPATCH'} · VALUE: <strong className="text-white">{formatRLO(t.paymentAmount)}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold border border-[#334155] bg-[#0f172a] text-gray-200">
                      {t.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
