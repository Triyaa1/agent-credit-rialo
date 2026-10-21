import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ExecutionPassport, CreditTier } from '../types';
import { formatAddress, formatRLO, getTierForScore, getNextTier, TIERS } from '../utils/creditScore';
import { 
  Copy, 
  Check, 
  ExternalLink, 
  X, 
  Lock, 
  Fingerprint, 
  CheckCheck,
  Building2,
  RefreshCw,
  Award,
  TrendingUp,
  Diamond,
  Medal,
  ShieldCheck
} from 'lucide-react';

interface PassportModalProps {
  passport: ExecutionPassport | null;
  onClose: () => void;
  onViewAgent?: (address: string) => void;
}

export const PassportModal: React.FC<PassportModalProps> = ({ passport, onClose, onViewAgent }) => {
  const { agents } = useApp();
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [stampActive, setStampActive] = useState(true);

  if (!passport) return null;

  // Find worker agent if available in directory to get current credit score and tier progression
  const workerAgent = agents.find(a => a.address.toLowerCase() === passport.workerAddress.toLowerCase());
  const workerScore = workerAgent ? workerAgent.creditScore : 120;
  const workerTierConfig = workerAgent ? TIERS[workerAgent.tier] : getTierForScore(workerScore);
  const workerTierKey: CreditTier = workerTierConfig.tier;
  const tierConfig = workerTierConfig;
  const nextTier = getNextTier(workerTierKey);

  let progressPercent = 100;
  let pointsNeeded = 0;
  if (nextTier) {
    const range = nextTier.minScore - tierConfig.minScore;
    const progress = Math.max(0, workerScore - tierConfig.minScore);
    progressPercent = Math.min(100, Math.round((progress / range) * 100));
    pointsNeeded = Math.max(0, nextTier.minScore - workerScore);
  }

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(passport, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReVerify = () => {
    setVerifying(true);
    setStampActive(false);
    setTimeout(() => {
      setVerifying(false);
      setStampActive(true);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm font-sans animate-enter">
      <div className="relative w-full max-w-2xl bg-[#0b1120] border border-[#334155] rounded-[4px] shadow-2xl overflow-hidden max-h-[94vh] flex flex-col font-sans">
        
        {/* Certificate Authority Top Header Strip */}
        <div className="bg-[#0f172a] border-b border-[#334155] px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[4px] bg-[#1e3a8a] border border-[#1e3a8a] flex items-center justify-center text-blue-200">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono tracking-wider text-gray-200 font-bold uppercase">
                  RIALO CREDIT BUREAU
                </span>
                <span className="text-gray-600">|</span>
                <span className="text-[10px] font-mono text-[#10b981] font-medium">SCALE PROTOCOL STANDARD</span>
              </div>
              <div className="text-xs text-[#9ca3af]">Official Labor Execution & Collateral Clearance Record</div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-[4px] text-gray-400 hover:text-white hover:bg-[#1e293b] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Paper Container with Faint Ledger / Grid Background */}
        <div className="p-6 overflow-y-auto space-y-5 bg-[#0b1120] text-gray-200">
          
          {/* Official Document Border Frame with subtle pattern */}
          <div className="relative border border-[#334155] rounded-[4px] p-5 sm:p-6 bg-[#0f172a] passport-certificate-pattern space-y-5 shadow-sm">
            
            {/* Top Certificate Identification */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#334155] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest font-mono text-[#9ca3af]">
                    CERTIFICATE ID
                  </span>
                  <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-bold bg-[#1e293b] text-[#10b981] border border-[#10b981]/50">
                    STATUS: RECORDED & SEALED
                  </span>
                </div>
                <h3 className="text-xl font-bold font-mono text-white tracking-tight">
                  {passport.id}
                </h3>
                <div className="text-[11px] font-mono text-[#9ca3af]">
                  ISSUED: {new Date(passport.completedAt).toUTCString()}
                </div>
              </div>

              {/* Large Prominent Green "Verified" Seal & Fingerprint with Stamping Animation */}
              <div className="flex items-center gap-3 self-end sm:self-start">
                <div 
                  className={`relative p-3 rounded-[4px] border-2 border-[#10b981] bg-[#1e293b] shadow-sm flex items-center justify-center ${stampActive ? 'animate-stamp' : ''}`}
                  title="Cryptographically Verified Seal"
                >
                  <Fingerprint className="w-10 h-10 text-[#10b981]" />
                  <div className="absolute -bottom-1 -right-1 bg-[#10b981] text-gray-950 rounded-[2px] p-0.5 shadow-sm">
                    <CheckCheck className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <div className="text-[11px] font-mono uppercase text-[#10b981] font-bold tracking-wider">
                    VERIFIED
                  </div>
                  <div className="text-[10px] font-mono text-gray-300">
                    RIALO CONSENSUS
                  </div>
                  <div className="text-[9px] font-mono text-gray-400">
                    {passport.metadata.consensusSigners} VALIDATORS
                  </div>
                </div>
              </div>
            </div>

            {/* Agent's Credit Score & Tier Progression Banner */}
            <div className="p-3.5 rounded-[4px] bg-[#1e293b] border border-[#334155] space-y-2.5 font-mono">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#9ca3af]">AGENT CREDIT TIER:</span>
                  <span className="px-2 py-0.5 rounded-[4px] font-bold text-[11px] bg-[#0f172a] text-white border border-[#334155]">
                    {tierConfig.label} ({tierConfig.collateralPercent}% Collateral)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-[#9ca3af] font-sans">Credit Score:</span>
                  <strong className="text-[#10b981] font-bold tabular-nums text-sm">
                    {workerScore} PTS
                  </strong>
                </div>
              </div>

              {/* Progress bar to next tier */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#9ca3af] font-sans">
                  <span>
                    {nextTier 
                      ? `Progress to ${nextTier.label} (${nextTier.minScore} pts)` 
                      : 'Maximum Institutional Tier Reached'}
                  </span>
                  <span className="font-mono text-[#10b981] font-bold">
                    {nextTier ? `${progressPercent}% complete (${pointsNeeded} pts left)` : 'TOP TIER (0% ESCROW)'}
                  </span>
                </div>
                <div className="w-full bg-[#0b1120] h-2 rounded-[2px] overflow-hidden border border-[#334155]">
                  <div 
                    className="bg-[#10b981] h-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Core Ledger Particulars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Executing Worker Agent */}
              <div className="p-3.5 rounded-[4px] bg-[#1e293b] border border-[#334155] space-y-1.5">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#9ca3af] flex items-center justify-between">
                  <span>BENEFICIARY (WORKER AGENT)</span>
                  {onViewAgent && (
                    <button 
                      onClick={() => onViewAgent(passport.workerAddress)}
                      className="text-[#10b981] hover:text-emerald-300 inline-flex items-center gap-0.5 font-bold cursor-pointer"
                    >
                      Audit Record <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
                <div className="text-sm font-semibold text-white">
                  {passport.workerName}
                </div>
                <div className="text-[11px] font-mono text-gray-300 break-all bg-[#0f172a] p-2 rounded-[4px] border border-[#334155]">
                  {passport.workerAddress}
                </div>
              </div>

              {/* Client & Escrow Authority */}
              <div className="p-3.5 rounded-[4px] bg-[#1e293b] border border-[#334155] space-y-1.5">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#9ca3af]">
                  ISSUING COUNTERPARTY (CLIENT)
                </div>
                <div className="text-sm font-semibold text-white">
                  {passport.clientName}
                </div>
                <div className="text-[11px] font-mono text-gray-300 break-all bg-[#0f172a] p-2 rounded-[4px] border border-[#334155]">
                  {passport.clientAddress}
                </div>
              </div>
            </div>

            {/* Task Deliverable Statement */}
            <div className="p-4 rounded-[4px] bg-[#1e293b] border border-[#334155] space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#9ca3af]">
                <span>CERTIFIED LABOR PERFORMANCE</span>
                <span className="text-amber-400 font-bold font-mono">
                  QUALITY SCORE: {'★'.repeat(passport.qualityRating)} ({passport.qualityRating}/5.0)
                </span>
              </div>
              <div className="text-sm font-semibold text-white font-mono">
                {passport.taskTitle}
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                {passport.executionSummary}
              </p>
            </div>

            {/* Financial Ledger & Collateral Clearance Strip */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-[4px] bg-[#1e293b] border border-[#334155] text-center font-mono">
              <div className="border-r border-[#334155] pr-2">
                <span className="text-[10px] text-[#9ca3af] uppercase block">Settled Remittance</span>
                <span className="text-base font-bold text-white tabular-nums">
                  {formatRLO(passport.paymentAmount)}
                </span>
                <span className="text-[10px] text-[#9ca3af] block font-sans">via Escrow</span>
              </div>

              <div className="border-r border-[#334155] pr-2">
                <span className="text-[10px] text-[#9ca3af] uppercase block">Applied Collateral</span>
                <span className="text-base font-bold text-gray-200 tabular-nums">
                  {passport.collateralPercentApplied}%
                </span>
                <span className="text-[10px] text-[#9ca3af] block font-sans">Required Rate</span>
              </div>

              <div>
                <span className="text-[10px] text-[#9ca3af] uppercase block">Capital Saved</span>
                <span className="text-base font-bold text-[#10b981] tabular-nums">
                  +{formatRLO(passport.collateralSaved)}
                </span>
                <span className="text-[10px] text-[#9ca3af] block font-sans">Freed Reserve</span>
              </div>
            </div>

            {/* Cryptographic SHA-256 Ledger Digest */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#9ca3af] flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-[#10b981]" />
                  CRYPTOGRAPHIC SHA-256 DIGEST
                </span>
                <button
                  onClick={handleReVerify}
                  disabled={verifying}
                  className="text-[11px] font-mono text-[#10b981] hover:text-emerald-300 transition-colors inline-flex items-center gap-1 font-bold cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${verifying ? 'animate-spin' : ''}`} />
                  <span>Verify Audit Hash</span>
                </button>
              </div>
              <div className="p-2.5 bg-[#0b1120] rounded-[4px] border border-[#334155] font-mono text-xs text-[#10b981] break-all select-all font-bold">
                {passport.hashSignature}
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-[#9ca3af]">
                <span>PROTOCOL: {passport.metadata.protocolVersion}</span>
                <span>EXECUTION LATENCY: {passport.metadata.latencyMs}ms</span>
                <span>GAS: {passport.metadata.gasUsedRialo.toLocaleString()} RLO</span>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="border-t border-[#334155] px-6 py-3.5 bg-[#0f172a] flex items-center justify-between">
          <button
            onClick={handleCopyJson}
            className="px-3.5 py-1.5 text-xs font-mono font-medium text-gray-200 hover:text-white bg-[#1e293b] hover:bg-[#253349] rounded-[4px] border border-[#334155] transition-all inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
            <span>{copied ? 'COPIED JSON LEDGER' : 'EXPORT JSON PAYLOAD'}</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-5 py-1.5 text-xs font-mono font-bold text-gray-950 bg-[#10b981] hover:bg-emerald-400 active:bg-emerald-600 rounded-[4px] transition-all shadow-sm cursor-pointer"
          >
            Dismiss Record
          </button>
        </div>
      </div>
    </div>
  );
};
