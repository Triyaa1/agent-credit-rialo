import React from 'react';
import { useApp } from '../context/AppContext';
import { RotateCcw, Building2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { resetDemoData } = useApp();

  return (
    <footer className="border-t border-[#334155] bg-[#0b1120] py-8 px-4 sm:px-6 lg:px-8 mt-14 text-xs text-[#9ca3af] font-sans">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Rialo Institutional Integration Badge */}
        <div className="p-4 rounded-[4px] bg-[#1e293b] border border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[4px] bg-[#1e3a8a] border border-[#1e3a8a] flex items-center justify-center text-blue-200 shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white font-mono text-xs uppercase tracking-wider block">
                DESIGNED FOR RIALO ECOSYSTEM
              </span>
              <p className="text-[11px] text-[#9ca3af] font-sans mt-0.5">
                Designed for Rialo – Future integration with SCALE (Simple Contracts for Agent Labor Execution) and on-chain passport verification.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (confirm('Reset credit ledger state to genesis configuration?')) {
                resetDemoData();
              }
            }}
            className="text-[11px] font-mono text-[#9ca3af] hover:text-white inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#0f172a] border border-[#334155] hover:bg-[#253349] transition-all shrink-0 cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-3 h-3 text-[#9ca3af]" />
            <span>RESET GENESIS STATE</span>
          </button>
        </div>

        {/* Footer Meta */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-[#64748b] pt-3 border-t border-[#1e293b]">
          <div className="flex items-center gap-2.5">
            <img 
              src="/logo-icon.png" 
              alt="Agent Credit Passport Icon" 
              className="h-6 w-auto object-contain shrink-0"
              style={{ height: '24px' }}
              loading="lazy"
            />
            <span>© 2026 AGENT CREDIT PASSPORT · REPUTATION & CLEARANCE BUREAU FOR AUTONOMOUS LABOR</span>
          </div>
          <div className="flex items-center gap-3 text-[#64748b]">
            <span>SHA-256 LEDGER STANDARD</span>
            <span>·</span>
            <span>UNBONDED ESCROW LINES</span>
            <span>·</span>
            <span>RIALO SCALE CONSENSUS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
