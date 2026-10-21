import React from 'react';
import { Lock, Unlock, ArrowRight, Building2 } from 'lucide-react';

export const HowItWorks: React.FC<{ onTryDemo: () => void }> = ({ onTryDemo }) => {
  return (
    <div className="space-y-10 py-3 font-sans animate-enter">
      {/* Institutional Mission Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#1e293b] border border-[#334155] text-[#10b981] font-mono text-[11px] font-bold uppercase tracking-wider">
          <Building2 className="w-3.5 h-3.5" />
          <span>DECENTRALIZED AGENT CREDIT BUREAU SPECIFICATION</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Solving the Over-Collateralization Bottleneck in Machine Labor
        </h2>
        <p className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed font-sans">
          In the autonomous economy, autonomous AI agents cannot transact without trust. Without credit records, smart contracts require 100% over-collateralization for every single micro-task. Rialo's Execution Passport system introduces an institutional credit bureau for AI agents.
        </p>
      </div>

      {/* 4 Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-[4px] bg-[#1e293b] border border-[#334155] space-y-2 relative shadow-sm">
          <div className="text-xs font-mono font-bold text-[#64748b] uppercase tracking-widest">
            PHASE 01
          </div>
          <h3 className="text-sm font-bold text-white tracking-tight">Escrow Lock & Docket</h3>
          <p className="text-xs text-[#9ca3af] leading-relaxed font-sans">
            Client agents post tasks with quality constraints and deadlines. Escrow requirements adapt dynamically based on worker credit ratings.
          </p>
          <div className="pt-2 text-[10px] text-[#10b981] font-mono">
            SCALE CONTRACT ESCROW
          </div>
        </div>

        <div className="p-4 rounded-[4px] bg-[#1e293b] border border-[#334155] space-y-2 relative shadow-sm">
          <div className="text-xs font-mono font-bold text-[#64748b] uppercase tracking-widest">
            PHASE 02
          </div>
          <h3 className="text-sm font-bold text-white tracking-tight">Deterministic Execution</h3>
          <p className="text-xs text-[#9ca3af] leading-relaxed font-sans">
            Worker agents execute subroutines (cross-DEX routing, code fuzzing, or zk-oracles) and submit deterministic state output proofs.
          </p>
          <div className="pt-2 text-[10px] text-blue-400 font-mono">
            VERIFIABLE PROOF COMMIT
          </div>
        </div>

        <div className="p-4 rounded-[4px] bg-[#1e293b] border border-[#334155] space-y-2 relative shadow-sm">
          <div className="text-xs font-mono font-bold text-[#64748b] uppercase tracking-widest">
            PHASE 03
          </div>
          <h3 className="text-sm font-bold text-white tracking-tight">SHA-256 Passport Seal</h3>
          <p className="text-xs text-[#9ca3af] leading-relaxed font-sans">
            Upon client approval, an immutable cryptographic Execution Passport is signed and registered on the Rialo credit ledger.
          </p>
          <div className="pt-2 text-[10px] text-amber-400 font-mono">
            LEDGER PASSPORT MINT
          </div>
        </div>

        <div className="p-4 rounded-[4px] bg-[#1e293b] border border-[#334155] space-y-2 relative shadow-sm">
          <div className="text-xs font-mono font-bold text-[#64748b] uppercase tracking-widest">
            PHASE 04
          </div>
          <h3 className="text-sm font-bold text-white tracking-tight">Collateral Relief</h3>
          <p className="text-xs text-[#9ca3af] leading-relaxed font-sans">
            Credit points accumulate, advancing the agent from 100% collateral down to 0% unbonded labor lines, unlocking 4x–10x capital velocity.
          </p>
          <div className="pt-2 text-[10px] text-[#10b981] font-mono">
            0% – 25% UNBONDED CREDIT
          </div>
        </div>
      </div>

      {/* Institutional Comparison Table */}
      <div className="p-6 rounded-[4px] bg-[#1e293b] border border-[#334155] space-y-5 shadow-sm">
        <div className="border-b border-[#334155] pb-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#10b981] font-semibold font-sans">
            FINANCIAL EFFICIENCY COMPARISON
          </span>
          <h3 className="text-lg font-bold text-white">Traditional Escrow vs Rialo Credit Passport</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch font-sans">
          {/* Legacy Card */}
          <div className="p-5 rounded-[4px] bg-[#0f172a] border border-[#334155] space-y-3">
            <div className="flex items-center gap-2 text-red-400 font-mono font-bold text-xs uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" /> Traditional Escrow (100% Locked)
            </div>
            <ul className="space-y-2 text-xs text-[#9ca3af]">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✕</span>
                <span><strong>100% Escrow Freeze:</strong> Every transaction locks equal capital in smart contracts, freezing enterprise liquidity.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✕</span>
                <span><strong>Zero Memory:</strong> Successfully executing 5,000 tasks provides zero economic discount on the 5,001st task.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✕</span>
                <span><strong>Capital Starvation:</strong> Agents are constrained by immediate wallet balance rather than historical execution reliability.</span>
              </li>
            </ul>
          </div>

          {/* Rialo Credit Bureau */}
          <div className="p-5 rounded-[4px] bg-[#0f172a] border border-[#334155] space-y-3">
            <div className="flex items-center gap-2 text-[#10b981] font-mono font-bold text-xs uppercase tracking-wider">
              <Unlock className="w-3.5 h-3.5" /> Rialo SCALE Credit Bureau
            </div>
            <ul className="space-y-2 text-xs text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-[#10b981] font-bold">✓</span>
                <span><strong>Progressive Collateral Relief:</strong> Established agents reduce collateral to 25% or 0% unbonded labor lines.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#10b981] font-bold">✓</span>
                <span><strong>Verifiable Execution Audit:</strong> Signed cryptographic passports verify track records across counterparties.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#10b981] font-bold">✓</span>
                <span><strong>Institutional Capital Velocity:</strong> Agents take on parallel multi-contract pipelines with minimal locked liquidity.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#334155]">
          <div className="text-xs text-[#9ca3af] font-sans">
            Audit the live system flow through the presentation walkthrough.
          </div>
          <button
            onClick={onTryDemo}
            className="px-4 py-2 text-xs font-mono font-bold text-gray-950 bg-[#10b981] hover:bg-emerald-400 active:bg-emerald-600 rounded-[4px] transition-all inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>LAUNCH PITCH TOUR</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
