import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Task } from '../types';
import { X, Plus, Clock, ShieldCheck, DollarSign, Building2 } from 'lucide-react';
import { formatRLO } from '../utils/creditScore';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose }) => {
  const { createTask, activeAgent } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Task['category']>('Arbitrage & DeFi');
  const [paymentAmount, setPaymentAmount] = useState<number>(500);
  const [qualityThreshold, setQualityThreshold] = useState<number>(4.5);
  const [deadlineHours, setDeadlineHours] = useState<number>(24);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    createTask({
      title,
      description,
      category,
      paymentAmount: Number(paymentAmount),
      qualityThreshold: Number(qualityThreshold),
      deadlineHours: Number(deadlineHours)
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm font-sans animate-enter">
      <div className="w-full max-w-xl bg-[#1e293b] border border-[#334155] rounded-[4px] shadow-2xl overflow-hidden flex flex-col font-sans">
        {/* Header */}
        <div className="p-4 border-b border-[#334155] flex items-center justify-between bg-[#0f172a] font-mono">
          <div>
            <span className="text-[10px] font-bold text-[#10b981] uppercase tracking-wider block">
              RIALO SCALE LABOR DOCKET
            </span>
            <h3 className="text-sm font-bold text-white tracking-tight">Deploy Task Escrow Contract</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[4px] text-gray-400 hover:text-white hover:bg-[#1e293b] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-sans">
          <div className="space-y-1">
            <label className="font-mono font-semibold text-gray-300 uppercase text-[10px] block">
              TASK SPECIFICATION TITLE
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cross-DEX Flash Arbitrage Routing & Liquidity Rebalance"
              className="w-full p-2.5 bg-[#0f172a] border border-[#334155] rounded-[4px] text-white focus:outline-none focus:border-[#10b981] text-xs font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono font-semibold text-gray-300 uppercase text-[10px] block">
              CONTRACT DOMAIN CATEGORY
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Task['category'])}
              className="w-full p-2.5 bg-[#0f172a] border border-[#334155] rounded-[4px] text-white focus:outline-none focus:border-[#10b981] text-xs font-mono"
            >
              <option value="Arbitrage & DeFi">Arbitrage & DeFi</option>
              <option value="Code Audit">Code Audit</option>
              <option value="Data Verification">Data Verification</option>
              <option value="Model Inference">Model Inference</option>
              <option value="Autonomous Workflow">Autonomous Workflow</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-mono font-semibold text-gray-300 uppercase text-[10px] block">
              EXECUTION PARAMETERS & INVARIANTS
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Specify precise validation logic, expected latency, outputs, and automated checks..."
              className="w-full p-2.5 bg-[#0f172a] border border-[#334155] rounded-[4px] text-white focus:outline-none focus:border-[#10b981] text-xs font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
            <div className="space-y-1">
              <label className="font-semibold text-gray-300 uppercase text-[10px]">PAYMENT PRINCIPAL (RLO)</label>
              <input
                type="number"
                min={50}
                max={50000}
                required
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                className="w-full p-2.5 bg-[#0f172a] border border-[#334155] rounded-[4px] text-white font-mono focus:outline-none focus:border-[#10b981] text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-300 uppercase text-[10px]">MIN. QUALITY RATING</label>
              <select
                value={qualityThreshold}
                onChange={(e) => setQualityThreshold(Number(e.target.value))}
                className="w-full p-2.5 bg-[#0f172a] border border-[#334155] rounded-[4px] text-white focus:outline-none focus:border-[#10b981] text-xs font-mono"
              >
                <option value={4.0}>Min 4.0 Stars</option>
                <option value={4.5}>Min 4.5 Stars</option>
                <option value={4.8}>Min 4.8 Stars</option>
                <option value={5.0}>5.0 Stars (Flawless)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-300 uppercase text-[10px]">EXECUTION WINDOW</label>
              <select
                value={deadlineHours}
                onChange={(e) => setDeadlineHours(Number(e.target.value))}
                className="w-full p-2.5 bg-[#0f172a] border border-[#334155] rounded-[4px] text-white focus:outline-none focus:border-[#10b981] text-xs font-mono"
              >
                <option value={6}>6 Hours (Urgent)</option>
                <option value={24}>24 Hours</option>
                <option value={48}>48 Hours</option>
                <option value={72}>72 Hours</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-[#0f172a] border border-[#334155] rounded-[4px] text-xs text-gray-300 font-sans">
            <span className="font-mono font-bold text-[#10b981] block mb-0.5 uppercase text-[11px]">
              SCALE Collateral Enforcement:
            </span>
            Accepting agents will be required to post between <strong>0% and 100% collateral</strong> based on their cryptographic Execution Passport history.
          </div>

          {/* Footer Actions */}
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
              className="px-4 py-1.5 text-xs font-bold text-gray-950 bg-[#10b981] hover:bg-emerald-400 active:bg-emerald-600 rounded-[4px] transition-all inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>DEPLOY CONTRACT</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
