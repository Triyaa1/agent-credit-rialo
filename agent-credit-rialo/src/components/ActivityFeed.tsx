import React from 'react';
import { useApp } from '../context/AppContext';
import { formatAddress, formatRLO } from '../utils/creditScore';
import { 
  FileCheck, 
  Briefcase, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';

interface ActivityFeedProps {
  onOpenPassport: (passportId: string) => void;
  onOpenAgentProfile: (address: string) => void;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  onOpenPassport,
  onOpenAgentProfile
}) => {
  const { activities } = useApp();

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-[4px] p-4 space-y-3 font-sans shadow-sm">
      <div className="flex items-center justify-between border-b border-[#334155] pb-3">
        <div>
          <div className="flex items-center gap-1.5 text-[#10b981] text-[10px] font-mono font-semibold uppercase tracking-wider mb-0.5">
            <Clock className="w-3.5 h-3.5" /> REAL-TIME CLEARANCE LEDGER
          </div>
          <h3 className="text-sm font-bold text-white tracking-tight">On-Chain Activity Stream</h3>
        </div>
        <span className="text-[10px] font-mono text-[#9ca3af] tabular-nums">
          {activities.length} EVENTS
        </span>
      </div>

      <div className="divide-y divide-[#334155] max-h-[460px] overflow-y-auto pr-1 space-y-1.5 font-sans">
        {activities.map(act => {
          let icon = <Briefcase className="w-3.5 h-3.5 text-blue-400" />;
          let iconBg = 'bg-[#0f172a] border-[#334155]';

          if (act.type === 'PASSPORT_ISSUED') {
            icon = <FileCheck className="w-3.5 h-3.5 text-[#10b981]" />;
            iconBg = 'bg-[#0f172a] border-[#10b981]/50';
          } else if (act.type === 'TIER_UPGRADE') {
            icon = <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
            iconBg = 'bg-[#0f172a] border-amber-500/50';
          } else if (act.type === 'TASK_DISPUTED') {
            icon = <AlertTriangle className="w-3.5 h-3.5 text-red-400" />;
            iconBg = 'bg-[#0f172a] border-red-700/50';
          } else if (act.type === 'TASK_ACCEPTED') {
            icon = <CheckCircle2 className="w-3.5 h-3.5 text-gray-300" />;
            iconBg = 'bg-[#0f172a] border-[#334155]';
          }

          return (
            <div key={act.id} className="pt-2.5 pb-2 flex items-start gap-2.5 text-xs">
              <div className={`w-7 h-7 rounded-[4px] border flex items-center justify-center shrink-0 ${iconBg}`}>
                {icon}
              </div>

              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-white tracking-tight text-xs">{act.title}</span>
                  <span className="text-[10px] text-[#9ca3af] font-mono shrink-0">
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-gray-300 text-xs leading-relaxed font-sans">{act.description}</p>

                <div className="flex items-center gap-2 text-[10px] text-[#9ca3af] pt-0.5 font-mono">
                  <button
                    onClick={() => onOpenAgentProfile(act.agentAddress)}
                    className="text-[#9ca3af] hover:text-[#10b981] transition-colors cursor-pointer"
                  >
                    AGENT: {act.agentName} ({formatAddress(act.agentAddress)})
                  </button>

                  {act.value && (
                    <>
                      <span>·</span>
                      <span className="text-[#10b981] font-bold">{formatRLO(act.value)}</span>
                    </>
                  )}

                  {act.passportId && (
                    <>
                      <span>·</span>
                      <button
                        onClick={() => onOpenPassport(act.passportId!)}
                        className="text-[#10b981] hover:text-emerald-300 font-bold inline-flex items-center gap-0.5 cursor-pointer"
                      >
                        INSPECT #{act.passportId}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
