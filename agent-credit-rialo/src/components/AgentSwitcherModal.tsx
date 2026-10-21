import React from 'react';
import { useApp } from '../context/AppContext';
import { TIERS, formatAddress } from '../utils/creditScore';
import { X, Check, Plus, Bot, ShieldCheck } from 'lucide-react';

interface AgentSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister: () => void;
}

export const AgentSwitcherModal: React.FC<AgentSwitcherModalProps> = ({
  isOpen,
  onClose,
  onOpenRegister
}) => {
  const { agents, activeAgent, setActiveAgentId } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm font-sans animate-enter">
      <div className="w-full max-w-lg bg-[#1e293b] border border-[#334155] rounded-[4px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#334155] flex items-center justify-between bg-[#0f172a] font-mono">
          <div>
            <span className="text-[10px] font-bold text-[#10b981] uppercase tracking-wider block">
              SESSION MANAGEMENT
            </span>
            <h3 className="text-sm font-bold text-white tracking-tight">Select Active Agent Entity</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[4px] text-gray-400 hover:text-white hover:bg-[#1e293b] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="p-3 overflow-y-auto space-y-1.5 font-mono">
          {agents.map(agent => {
            const isCurrent = agent.id === activeAgent.id;
            const tierConfig = TIERS[agent.tier];

            return (
              <div
                key={agent.id}
                onClick={() => {
                  setActiveAgentId(agent.id);
                  onClose();
                }}
                className={`p-3 rounded-[4px] border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm ${
                  isCurrent 
                    ? 'border-[#10b981] bg-[#0f172a]' 
                    : 'border-[#334155] bg-[#0f172a] hover:bg-[#1e293b] hover:border-[#475569]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[4px] bg-[#1e293b] border border-[#334155] flex items-center justify-center text-xs font-bold font-mono text-white">
                    {agent.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{agent.name}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-[4px] border border-[#334155] bg-[#1e293b] text-gray-200">
                        {tierConfig.label.split(' ')[0]} ({tierConfig.collateralPercent}%)
                      </span>
                    </div>
                    <div className="text-[10px] text-[#9ca3af]">
                      {formatAddress(agent.address)} · <span className="text-[#10b981] font-bold">{agent.creditScore} PTS</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  {isCurrent ? (
                    <div className="w-5 h-5 rounded-[4px] bg-[#10b981] flex items-center justify-center text-gray-950 font-bold">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <span className="text-[11px] text-[#9ca3af] hover:text-[#10b981]">SWITCH</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[#334155] bg-[#0f172a] flex items-center justify-between font-mono">
          <button
            onClick={() => {
              onClose();
              onOpenRegister();
            }}
            className="px-3 py-1.5 text-xs font-bold text-[#10b981] hover:text-emerald-300 bg-[#1e293b] hover:bg-[#253349] border border-[#334155] rounded-[4px] transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>REGISTER NEW ENTITY</span>
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-[#9ca3af] hover:text-white cursor-pointer"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};
