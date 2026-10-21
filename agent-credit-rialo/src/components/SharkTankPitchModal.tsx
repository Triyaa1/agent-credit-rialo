import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Award,
  Play,
  RotateCcw,
  Building2,
  Lock,
  Unlock,
  CheckCheck,
  FileCheck
} from 'lucide-react';
import { formatRLO } from '../utils/creditScore';

interface SharkTankPitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInspectPassport: (passportId: string) => void;
}

export const SharkTankPitchModal: React.FC<SharkTankPitchModalProps> = ({
  isOpen,
  onClose,
  onInspectPassport
}) => {
  const { 
    agents, 
    tasks, 
    approveTaskAndIssuePassport, 
    setActiveAgentId,
    activeAgent
  } = useApp();

  const [step, setStep] = useState<number>(1);
  const [demoExecuting, setDemoExecuting] = useState<boolean>(false);
  const [demoCompletedPassportId, setDemoCompletedPassportId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExecuteLiveDemo = async () => {
    setDemoExecuting(true);
    setActiveAgentId('agent-6'); // NovaCrawler-Alpha (New Agent)

    setTimeout(async () => {
      const targetTask = tasks.find(t => t.id === 'task-prog-2');
      if (targetTask) {
        const passport = await approveTaskAndIssuePassport(
          targetTask.id,
          5,
          'Institutional Clearance: Verifiable sub-graph state proof passed with 100% quorum consensus.'
        );
        setDemoExecuting(false);
        if (passport) {
          setDemoCompletedPassportId(passport.id);
          setStep(4);
        }
      } else {
        setDemoExecuting(false);
        setStep(4);
      }
    }, 1100);
  };

  const handleResetTour = () => {
    setStep(1);
    setDemoExecuting(false);
    setDemoCompletedPassportId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm font-sans animate-enter">
      <div className="relative w-full max-w-2xl bg-[#0b1120] border border-[#334155] rounded-[4px] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col font-sans">
        {/* Header */}
        <div className="bg-[#0f172a] border-b border-[#334155] px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[4px] bg-[#1e3a8a] border border-[#1e3a8a] flex items-center justify-center text-blue-200">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-[#10b981] uppercase tracking-wider block">
                EXECUTIVE BRIEFING & DEMO TOUR
              </span>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Agent Credit Passport: Institutional Trust Infrastructure
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-[4px] text-gray-400 hover:text-white hover:bg-[#1e293b] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator Tabs */}
        <div className="grid grid-cols-4 border-b border-[#334155] bg-[#0f172a] text-center text-xs font-mono">
          {[
            { num: 1, label: 'THE PROBLEM' },
            { num: 2, label: 'THE ARCHITECTURE' },
            { num: 3, label: 'LIVE PROOF' },
            { num: 4, label: 'SCALE IMPACT' },
          ].map(s => (
            <button
              key={s.num}
              onClick={() => setStep(s.num)}
              className={`py-2.5 px-2 border-b-2 font-bold transition-all cursor-pointer ${
                step === s.num 
                  ? 'border-[#10b981] text-[#10b981] bg-[#1e293b]' 
                  : 'border-transparent text-[#9ca3af] hover:text-gray-200'
              }`}
            >
              <span className="text-[10px] mr-1">0{s.num}.</span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-gray-200 bg-[#0b1120]">
          {/* STEP 1: The Problem */}
          {step === 1 && (
            <div className="space-y-4 font-sans">
              <div className="p-4 rounded-[4px] bg-[#1e293b] border border-red-500/60 space-y-1.5 shadow-sm">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-red-400">
                  THE MULTI-BILLION DOLLAR BOTTLENECK
                </span>
                <h4 className="text-base font-bold text-white">
                  Why Autonomous AI Labor Is Constrained by 100% Escrow Locks
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed font-sans">
                  Autonomous agents execute millions of transactions daily across DeFi, code verification, and data synthesis. Because smart contracts have no credit identity for AI, <strong>every agent must over-collateralize every single transaction by 100%</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                <div className="p-3.5 rounded-[4px] bg-[#1e293b] border border-[#334155] space-y-1 shadow-sm">
                  <div className="font-bold text-white font-mono text-[11px] uppercase">CAPITAL INEFFICIENCY</div>
                  <div className="text-[#9ca3af] text-xs">
                    To execute 10,000 RLO in parallel contracts, an agent must freeze 10,000 RLO idle in escrow contracts.
                  </div>
                </div>
                <div className="p-3.5 rounded-[4px] bg-[#1e293b] border border-[#334155] space-y-1 shadow-sm">
                  <div className="font-bold text-white font-mono text-[11px] uppercase">ZERO HISTORICAL PORTABILITY</div>
                  <div className="text-[#9ca3af] text-xs">
                    Flawless execution for Counterparty A provides zero collateral relief when contracting with Counterparty B.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: The Architecture */}
          {step === 2 && (
            <div className="space-y-4 font-sans">
              <div className="p-4 rounded-[4px] bg-[#1e293b] border border-blue-500/60 space-y-1.5 shadow-sm">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-blue-400">
                  THE FINANCIAL MECHANISM
                </span>
                <h4 className="text-base font-bold text-white">
                  The Execution Passport: Verifiable AI Credit History
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed font-sans">
                  When tasks clear client verification, the network mints an immutable <strong>Execution Passport</strong>. The passport contains cryptographic SHA-256 signatures, contract principal, quality ratings, and validator quorum signatures.
                </p>
              </div>

              <div className="p-4 rounded-[4px] bg-[#1e293b] border border-[#334155] space-y-2 font-mono text-xs shadow-sm">
                <div className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider">
                  SCHEDULE OF ESCROW RELIEF:
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between py-1 border-b border-[#334155] text-[#9ca3af]">
                    <span>ENTRY AGENT (GRAY) · 0–50 PTS</span>
                    <strong className="text-white">100% ESCROW REQUIRED</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#334155] text-amber-500">
                    <span>BRONZE AGENT · 51–150 PTS</span>
                    <strong>75% COLLATERAL (25% RELIEF)</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#334155] text-slate-200">
                    <span>SILVER AGENT · 151–300 PTS</span>
                    <strong>50% COLLATERAL (50% RELIEF)</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#334155] text-amber-300">
                    <span>GOLD AGENT · 301–500 PTS</span>
                    <strong>25% COLLATERAL (75% RELIEF, 4X VELOCITY)</strong>
                  </div>
                  <div className="flex justify-between py-1 text-cyan-300 font-bold">
                    <span>PLATINUM AGENT · 500+ PTS</span>
                    <strong>0% COLLATERAL (UNBONDED CREDIT)</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Live Proof */}
          {step === 3 && (
            <div className="space-y-4 font-sans">
              <div className="p-4 rounded-[4px] bg-[#1e293b] border border-[#10b981]/60 space-y-1.5 shadow-sm">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#10b981]">
                  LIVE INTERACTIVE EXECUTION PROOF
                </span>
                <h4 className="text-base font-bold text-white">
                  Execute Task & Mint Cryptographic Passport
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed font-sans">
                  We will clear an active contract with <strong>NovaCrawler-Alpha</strong> (Current score: 35 pts, Entry Tier, 100% escrow required) for counterparty QuantOracle-Zero.
                </p>
              </div>

              <div className="p-4 rounded-[4px] bg-[#1e293b] border border-[#334155] space-y-2.5 font-mono text-xs shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#9ca3af]">ESCROW CONTRACT:</span>
                  <span className="font-bold text-white font-sans text-xs">Distributed Sub-Graph Synchronization</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#9ca3af]">PRINCIPAL REMITTANCE:</span>
                  <span className="font-bold text-[#10b981]">260 RLO</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#9ca3af]">SCORE TRAJECTORY:</span>
                  <span className="font-bold text-white">+15 PTS (PROMOTES TO BRONZE TIER)</span>
                </div>

                <button
                  onClick={handleExecuteLiveDemo}
                  disabled={demoExecuting}
                  className="w-full mt-2 py-2.5 px-4 text-xs font-mono font-bold text-gray-950 bg-[#10b981] hover:bg-emerald-400 active:bg-emerald-600 rounded-[4px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  {demoExecuting ? (
                    <>
                      <span className="animate-spin text-xs">⏳</span>
                      <span>COMPUTING SHA-256 HASH & STAMPING PASSPORT...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-gray-950 text-gray-950" />
                      <span>SIGN & STAMP PASSPORT INTO LEDGER</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success & SCALE Integration */}
          {step === 4 && (
            <div className="space-y-4 font-sans">
              <div className="p-4 rounded-[4px] bg-[#1e293b] border border-[#10b981] space-y-1.5 shadow-sm">
                <div className="flex items-center gap-2 text-[#10b981] text-[10px] font-mono font-bold uppercase tracking-wider">
                  <CheckCheck className="w-4 h-4" /> LEDGER STAMPING VERIFIED
                </div>
                <h4 className="text-base font-bold text-white">
                  Execution Passport Minted · Credit Tier Upgraded
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed font-sans">
                  Cryptographic passport registered. The agent's credit score advanced to <strong>50 points</strong>, crossing the threshold into the <strong>Bronze Tier</strong> with an immediate <strong>25% collateral reduction</strong> on future labor.
                </p>
              </div>

              {demoCompletedPassportId && (
                <div className="p-3.5 rounded-[4px] bg-[#0f172a] border border-[#334155] flex items-center justify-between font-mono">
                  <div>
                    <div className="text-[10px] text-[#9ca3af] uppercase font-sans">OFFICIAL CERTIFICATE ID</div>
                    <div className="text-xs font-bold text-white">{demoCompletedPassportId}</div>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onInspectPassport(demoCompletedPassportId);
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-[#10b981] bg-[#1e293b] hover:bg-[#253349] border border-[#10b981]/60 rounded-[4px] transition-all cursor-pointer shadow-sm"
                  >
                    INSPECT CERTIFICATE
                  </button>
                </div>
              )}

              <div className="p-3.5 rounded-[4px] bg-[#1e293b] border border-[#334155] text-xs text-gray-300 space-y-1 shadow-sm">
                <div className="font-mono font-bold text-white text-[11px] uppercase">
                  RIALO SCALE PROTOCOL INTEGRATION
                </div>
                <p className="text-gray-300 leading-relaxed text-xs font-sans">
                  Rialo's Simple Contracts for Agent Labor Execution (SCALE) smart contracts read this passport registry via pre-compiled oracles, automatically adjusting escrow locking limits at the virtual machine level.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#334155] px-6 py-3.5 bg-[#0f172a] flex items-center justify-between font-mono">
          <button
            onClick={handleResetTour}
            className="text-xs text-[#9ca3af] hover:text-white inline-flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RESET TOUR</span>
          </button>

          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-[#1e293b] hover:bg-[#253349] rounded-[4px] border border-[#334155] cursor-pointer"
              >
                BACK
              </button>
            )}

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-4 py-1.5 text-xs font-bold text-gray-950 bg-[#10b981] hover:bg-emerald-400 active:bg-emerald-600 rounded-[4px] transition-all inline-flex items-center gap-1 cursor-pointer shadow-sm"
              >
                <span>NEXT</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-1.5 text-xs font-bold text-gray-950 bg-[#10b981] hover:bg-emerald-400 active:bg-emerald-600 rounded-[4px] transition-all cursor-pointer shadow-sm"
              >
                ENTER DASHBOARD
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
