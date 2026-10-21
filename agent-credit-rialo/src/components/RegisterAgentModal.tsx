import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Bot, ShieldCheck, Building2 } from 'lucide-react';

interface RegisterAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterAgentModal: React.FC<RegisterAgentModalProps> = ({ isOpen, onClose }) => {
  const { registerNewAgent } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [specialty, setSpecialty] = useState('Arbitrage & DeFi');
  const [address, setAddress] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    registerNewAgent({
      name,
      description,
      address: address.trim() || undefined,
      specialty
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm font-sans animate-enter">
      <div className="w-full max-w-lg bg-[#1e293b] border border-[#334155] rounded-[4px] shadow-2xl overflow-hidden flex flex-col font-sans">
        {/* Header */}
        <div className="p-4 border-b border-[#334155] flex items-center justify-between bg-[#0f172a] font-mono">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[4px] bg-[#1e3a8a] border border-[#1e3a8a] flex items-center justify-center text-blue-200">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#10b981] uppercase tracking-wider block">
                CREDIT BUREAU REGISTRATION
              </span>
              <h3 className="text-sm font-bold text-white tracking-tight">Register Autonomous Agent Entity</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[4px] text-gray-400 hover:text-white hover:bg-[#1e293b] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs font-sans">
          <div className="space-y-1">
            <label className="font-mono font-semibold text-gray-300 uppercase text-[11px] block">Entity Name / Call-Sign</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cerberus-Arbitrage-Bot"
              className="w-full p-2.5 bg-[#0f172a] border border-[#334155] rounded-[4px] text-white focus:outline-none focus:border-[#10b981] text-xs font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono font-semibold text-gray-300 uppercase text-[11px] block">Primary Execution Domain</label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full p-2.5 bg-[#0f172a] border border-[#334155] rounded-[4px] text-white focus:outline-none focus:border-[#10b981] text-xs font-mono"
            >
              <option value="Arbitrage & DeFi">Arbitrage & DeFi</option>
              <option value="Code Audit">Code Audit & Formal Verification</option>
              <option value="Data Verification">Data Verification & ZK Oracles</option>
              <option value="Model Inference">Model Inference & LLM Ops</option>
              <option value="Autonomous Workflow">Autonomous Workflow & Crawling</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-mono font-semibold text-gray-300 uppercase text-[11px] block">System Capabilities & Specifications</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide machine architectural constraints, proof models, and verification methods..."
              className="w-full p-2.5 bg-[#0f172a] border border-[#334155] rounded-[4px] text-white focus:outline-none focus:border-[#10b981] text-xs font-sans"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono font-semibold text-gray-300 uppercase text-[11px] block">
              On-Chain Wallet Address <span className="text-gray-500 font-normal">(Optional, will auto-generate if blank)</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
              className="w-full p-2.5 bg-[#0f172a] border border-[#334155] rounded-[4px] text-white font-mono focus:outline-none focus:border-[#10b981] text-xs"
            />
          </div>

          <div className="p-3 bg-[#0f172a] rounded-[4px] border border-[#334155] text-[11px] text-[#9ca3af] space-y-1 font-sans">
            <div className="flex items-center gap-1.5 text-gray-200 font-mono font-bold uppercase text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" /> Genesis Credit Status
            </div>
            <p>
              Newly registered entities start at <strong>Entry Tier (0 points)</strong> with standard 100% escrow requirements. Successful execution builds verified passport history to unlock 0% unbonded labor.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#334155] font-mono">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-[#9ca3af] hover:text-white cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 font-bold text-gray-950 bg-[#10b981] hover:bg-emerald-400 active:bg-emerald-600 rounded-[4px] transition-all cursor-pointer shadow-sm"
            >
              INITIALIZE AGENT RECORD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
