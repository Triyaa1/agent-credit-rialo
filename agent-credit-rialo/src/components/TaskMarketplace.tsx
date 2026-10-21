import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Task, TaskStatus } from '../types';
import { calculateCollateralRequired, formatAddress, formatRLO, getTierForScore } from '../utils/creditScore';
import { 
  Briefcase, 
  Search, 
  Plus, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Play, 
  Award, 
  AlertTriangle,
  FileCheck,
  Check,
  X,
  Building2,
  FileSpreadsheet,
  Lock,
  Unlock,
  CheckCheck
} from 'lucide-react';

interface TaskMarketplaceProps {
  onOpenCreateTask: () => void;
  onOpenPassport: (passportId: string) => void;
  onOpenAgentProfile: (address: string) => void;
}

export const TaskMarketplace: React.FC<TaskMarketplaceProps> = ({
  onOpenCreateTask,
  onOpenPassport,
  onOpenAgentProfile
}) => {
  const { 
    tasks, 
    activeAgent, 
    acceptTask, 
    submitTaskWork, 
    approveTaskAndIssuePassport, 
    disputeTask, 
    passports,
    isWalletConnected,
    requireWallet
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'ALL' | TaskStatus>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Interactive Execution & Review Modals
  const [executingTask, setExecutingTask] = useState<Task | null>(null);
  const [executionStep, setExecutionStep] = useState<number>(0);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [outputSummary, setOutputSummary] = useState<string>('');

  const [reviewingTask, setReviewingTask] = useState<Task | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>('Performance validated against Rialo SCALE specifications.');
  const [isApproving, setIsApproving] = useState<boolean>(false);

  const [disputeTaskId, setDisputeTaskId] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState<string>('');

  const categories = [
    'ALL',
    'Arbitrage & DeFi',
    'Code Audit',
    'Data Verification',
    'Model Inference',
    'Autonomous Workflow'
  ];

  const filteredTasks = tasks.filter(t => {
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description.toLowerCase().includes(q);
      const matchClient = t.clientName.toLowerCase().includes(q);
      const matchWorker = t.workerName?.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchClient || matchWorker;
    }
    return true;
  });

  const handleCreateTaskClick = () => {
    requireWallet('deploying a new contract docket', onOpenCreateTask);
  };

  const handleAcceptTaskWithAuth = (task: Task) => {
    requireWallet('accepting this contract docket', async () => {
      const res = await acceptTask(task.id);
      if (!res.success && res.error) {
        alert(res.error);
      }
    });
  };

  const handleStartExecution = (task: Task) => {
    setExecutingTask(task);
    setExecutionStep(1);
    setExecutionLogs([
      `Initializing autonomous execution environment for contract #${task.id.slice(-6)}`,
      `Worker verified: ${activeAgent.name} (${activeAgent.address.slice(0, 10)}...)`,
      `Verified collateral locked in Rialo SCALE escrow vault.`
    ]);
    setOutputSummary(`Execution sub-routine verified. Deterministic output state committed to ledger.`);
  };

  const handleRunNextStep = () => {
    if (executionStep === 1) {
      setExecutionLogs(prev => [
        ...prev,
        'Processing input state transition & cryptographic proof construction...',
        'Execution invariant checks passed across all parameters.'
      ]);
      setExecutionStep(2);
    } else if (executionStep === 2) {
      setExecutionLogs(prev => [
        ...prev,
        'Packaging execution artifacts and SHA-256 state digest...',
        'Labor complete. Delivered for counterparty settlement.'
      ]);
      setExecutionStep(3);
    }
  };

  const handleFinishExecution = () => {
    if (executingTask) {
      submitTaskWork(executingTask.id, outputSummary, executionLogs);
      setExecutingTask(null);
      setExecutionStep(0);
    }
  };

  const handleApprove = async () => {
    if (!reviewingTask) return;
    setIsApproving(true);
    try {
      const passport = await approveTaskAndIssuePassport(reviewingTask.id, rating, feedback);
      setIsApproving(false);
      setReviewingTask(null);
      if (passport) {
        onOpenPassport(passport.id);
      }
    } catch {
      setIsApproving(false);
    }
  };

  const handleDisputeSubmit = () => {
    if (!disputeTaskId || !disputeReason.trim()) return;
    disputeTask(disputeTaskId, disputeReason.trim());
    setDisputeTaskId(null);
    setDisputeReason('');
  };

  return (
    <div className="space-y-4 font-sans animate-enter">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1e293b] border border-[#334155] rounded-[4px] p-5 shadow-sm">
        <div>
          <div className="text-[10px] font-mono text-[#10b981] uppercase tracking-wider font-semibold">
            CONTRACT ESCROW & CLEARANCE
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Labor Market & Open Contracts</h2>
          <p className="text-xs text-[#9ca3af] mt-0.5 font-sans">
            Automated tasks secured by dynamic credit passports and SCALE collateral rules.
          </p>
        </div>

        <button
          onClick={handleCreateTaskClick}
          className="px-3.5 py-2 text-xs font-mono font-bold text-gray-950 bg-[#10b981] hover:bg-emerald-400 active:bg-emerald-600 rounded-[4px] transition-all inline-flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>NEW TASK ESCROW</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 bg-[#1e293b] border border-[#334155] rounded-[4px] shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, agents, contracts..."
            className="w-full pl-8 pr-3 py-1.5 text-xs font-mono bg-[#0f172a] border border-[#334155] rounded-[4px] text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#10b981] transition-colors"
          />
        </div>

        {/* Status segmented filters */}
        <div className="flex items-center gap-1 p-1 bg-[#0f172a] border border-[#334155] rounded-[4px] overflow-x-auto text-xs font-mono">
          {(['ALL', 'OPEN', 'IN_PROGRESS', 'COMPLETED', 'DISPUTED'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-[11px] font-medium rounded-[4px] transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === st 
                  ? 'bg-[#1e293b] text-[#10b981] font-bold border border-[#334155]' 
                  : 'text-[#9ca3af] hover:text-white'
              }`}
            >
              {st === 'ALL' ? 'ALL' : st === 'IN_PROGRESS' ? 'IN PROGRESS' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Category domain buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
        <span className="text-[#64748b] text-[10px] uppercase whitespace-nowrap pr-1">Domain:</span>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-2.5 py-1 rounded-[4px] text-[11px] whitespace-nowrap transition-all cursor-pointer ${
              categoryFilter === cat 
                ? 'bg-[#1e293b] text-white font-bold border border-[#334155]' 
                : 'text-[#9ca3af] hover:text-white bg-[#0f172a] border border-[#334155]'
            }`}
          >
            {cat === 'ALL' ? 'ALL DOMAINS' : cat}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="p-10 text-center rounded-[4px] bg-[#0f172a] border border-[#334155] space-y-2">
          <FileSpreadsheet className="w-8 h-8 text-gray-500 mx-auto" />
          <h3 className="text-sm font-semibold text-white">No contracts found</h3>
          <p className="text-xs text-[#9ca3af] max-w-sm mx-auto font-sans">
            No tasks match the active filters. Deploy a new task to seed the marketplace.
          </p>
          <button
            onClick={onOpenCreateTask}
            className="px-3.5 py-1.5 text-xs font-mono font-bold text-gray-950 bg-[#10b981] hover:bg-emerald-400 rounded-[4px] transition-colors inline-block mt-1 cursor-pointer"
          >
            CREATE FIRST CONTRACT
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {filteredTasks.map(task => {
            const isClient = task.clientAddress.toLowerCase() === activeAgent.address.toLowerCase();
            const isWorker = task.workerAddress?.toLowerCase() === activeAgent.address.toLowerCase();
            const collateralCalc = calculateCollateralRequired(task.paymentAmount, activeAgent.creditScore);

            return (
              <div
                key={task.id}
                className="p-5 rounded-[4px] bg-[#1e293b] border border-[#334155] hover:border-[#475569] transition-all space-y-3.5 shadow-sm"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#334155] pb-2.5">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#9ca3af]">
                    <span className="text-[#10b981] font-bold uppercase">{task.category}</span>
                    <span className="text-gray-600">|</span>
                    <span>CLIENT:</span>
                    <button
                      onClick={() => onOpenAgentProfile(task.clientAddress)}
                      className="text-gray-200 hover:text-[#10b981] transition-colors cursor-pointer"
                    >
                      {task.clientName} ({formatAddress(task.clientAddress)})
                    </button>
                    {isClient && (
                      <span className="text-[9px] font-mono font-bold text-blue-300 bg-[#1e3a8a]/40 px-1.5 py-0.5 rounded-[4px] border border-blue-700">
                        YOUR DOCKET
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 self-start sm:self-auto font-mono">
                    <span className="text-sm font-bold text-white tabular-nums">
                      {formatRLO(task.paymentAmount)}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-[4px] font-bold uppercase ${
                      task.status === 'OPEN' 
                        ? 'bg-[#1e3a8a]/40 text-blue-300 border border-blue-700' 
                        : task.status === 'IN_PROGRESS' 
                        ? 'bg-amber-950 text-amber-400 border border-amber-800' 
                        : task.status === 'COMPLETED' 
                        ? 'bg-emerald-950 text-[#10b981] border border-emerald-800' 
                        : 'bg-red-950 text-red-400 border border-red-800'
                    }`}>
                      {task.status === 'IN_PROGRESS' ? 'IN PROGRESS' : task.status}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">{task.title}</h3>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed font-sans">{task.description}</p>
                </div>

                {/* Collateral & Counterparty Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-[4px] bg-[#0f172a] border border-[#334155] text-xs font-mono">
                  {/* Collateral Requirement */}
                  <div>
                    <span className="text-[#9ca3af] text-[10px] uppercase block">COLLATERAL REQUIREMENT</span>
                    {task.status === 'OPEN' ? (
                      <div>
                        <span className="text-white font-bold">
                          {collateralCalc.collateralPercent}% ({formatRLO(collateralCalc.collateralAmount)})
                        </span>
                        <div className="text-[10px] text-[#10b981] mt-0.5">
                          {collateralCalc.collateralPercent < 100 
                            ? `Saves ${formatRLO(collateralCalc.savedCollateralAmount)} via ${collateralCalc.tier.label.split(' ')[0]}` 
                            : '100% Full Escrow Required'}
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-300 text-xs">
                        LOCKED IN ESCROW: <span className="font-bold text-white">RECORDED</span>
                      </div>
                    )}
                  </div>

                  {/* Worker status */}
                  <div>
                    <span className="text-[#9ca3af] text-[10px] uppercase block">ASSIGNED WORKER</span>
                    {task.workerAddress ? (
                      <div className="flex items-center gap-1.5 text-gray-200">
                        <button
                          onClick={() => onOpenAgentProfile(task.workerAddress!)}
                          className="hover:underline font-bold text-white cursor-pointer"
                        >
                          {task.workerName}
                        </button>
                        <span className="text-[#64748b] text-[10px]">({formatAddress(task.workerAddress)})</span>
                        {isWorker && (
                          <span className="text-[9px] font-bold text-[#10b981] bg-emerald-950 px-1 py-0.5 rounded-[4px]">
                            YOU
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[#64748b] italic font-sans">OPEN FOR BIDDING</span>
                    )}
                  </div>

                  {/* Quality & Window */}
                  <div>
                    <span className="text-[#9ca3af] text-[10px] uppercase block">MIN. QUALITY & DEADLINE</span>
                    <div className="text-gray-300 flex items-center gap-2">
                      <span>Threshold: <strong className="text-amber-400">{task.qualityThreshold}★</strong></span>
                      <span className="text-gray-600">·</span>
                      <span className="text-[#9ca3af] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Execution output proof log (if present) */}
                {task.executionProof && (
                  <div className="p-3 bg-[#0f172a] rounded-[4px] border border-[#334155] space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#9ca3af] uppercase">
                      <span className="text-gray-300 font-bold">EXECUTION PROOF LOG</span>
                      <span>{new Date(task.executionProof.submittedAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-gray-300 text-xs font-sans">{task.executionProof.outputSummary}</p>
                    {task.executionProof.logs.length > 0 && (
                      <div className="font-mono text-[10px] text-[#10b981] space-y-0.5 pt-1 border-t border-[#334155]">
                        {task.executionProof.logs.slice(-3).map((log, idx) => (
                          <div key={idx} className="flex items-start gap-1">
                            <span className="text-gray-500">›</span>
                            <span>{log}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="text-[11px] font-mono text-[#64748b]">
                    RECORDED: {new Date(task.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-2 font-mono">
                    {/* OPEN: Worker can accept */}
                    {task.status === 'OPEN' && (
                      <button
                        onClick={() => handleAcceptTaskWithAuth(task)}
                        disabled={isClient}
                        title={isClient ? "Client agent cannot accept its own task" : undefined}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-[4px] transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-sm ${
                          isClient 
                            ? 'bg-[#0f172a] text-[#64748b] cursor-not-allowed border border-[#334155]' 
                            : 'bg-[#10b981] hover:bg-emerald-400 active:bg-emerald-600 text-gray-950'
                        }`}
                      >
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>ACCEPT ({collateralCalc.collateralPercent}% COLLATERAL)</span>
                      </button>
                    )}

                    {/* IN_PROGRESS: Worker executes OR Client reviews */}
                    {task.status === 'IN_PROGRESS' && isWorker && (
                      <button
                        onClick={() => handleStartExecution(task)}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-600 rounded-[4px] transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>EXECUTE & COMMIT PROOF</span>
                      </button>
                    )}

                    {task.status === 'IN_PROGRESS' && isClient && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setReviewingTask(task)}
                          className="px-3.5 py-1.5 text-xs font-bold text-gray-950 bg-[#10b981] hover:bg-emerald-400 active:bg-emerald-600 rounded-[4px] transition-all inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>CLEAR ESCROW & ISSUE PASSPORT</span>
                        </button>
                        <button
                          onClick={() => { setDisputeTaskId(task.id); setDisputeReason(''); }}
                          className="px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/60 border border-red-900 rounded-[4px] transition-colors cursor-pointer"
                        >
                          DISPUTE
                        </button>
                      </div>
                    )}

                    {task.status === 'IN_PROGRESS' && !isWorker && !isClient && (
                      <button
                        onClick={() => setReviewingTask(task)}
                        className="px-3.5 py-1.5 text-xs text-gray-300 hover:text-white bg-[#0f172a] hover:bg-[#253349] rounded-[4px] border border-[#334155] transition-colors cursor-pointer"
                      >
                        AUDIT CONTRACT
                      </button>
                    )}

                    {/* COMPLETED: View signed passport */}
                    {task.status === 'COMPLETED' && task.passportId && (
                      <button
                        onClick={() => onOpenPassport(task.passportId!)}
                        className="px-3.5 py-1.5 text-xs font-bold text-[#10b981] bg-[#0f172a] hover:bg-[#1e293b] border border-[#10b981]/50 rounded-[4px] transition-colors inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>VIEW PASSPORT ({task.passportId})</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Execution Simulator Modal */}
      {executingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm font-sans animate-enter">
          <div className="w-full max-w-xl bg-[#1e293b] border border-[#334155] rounded-[4px] p-6 space-y-5 font-sans shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#334155] pb-3 font-mono">
              <div className="flex items-center gap-2 text-[#10b981]">
                <Play className="w-4 h-4 fill-[#10b981]" />
                <h3 className="text-sm font-bold text-white uppercase">AUTONOMOUS TASK EXECUTION CONSOLE</h3>
              </div>
              <button 
                onClick={() => setExecutingTask(null)}
                className="text-gray-400 hover:text-white p-1 rounded-[4px] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-bold text-white">{executingTask.title}</div>
              <p className="text-xs text-[#9ca3af] font-sans">{executingTask.description}</p>
            </div>

            {/* Terminal logs */}
            <div className="p-3.5 bg-[#0f172a] rounded-[4px] border border-[#334155] font-mono text-xs text-[#10b981] space-y-1.5 max-h-52 overflow-y-auto">
              {executionLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-[#64748b] select-none">[{i + 1}]</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold text-gray-300 uppercase">
                PROOF ARTIFACT SUMMARY
              </label>
              <textarea
                value={outputSummary}
                onChange={(e) => setOutputSummary(e.target.value)}
                rows={2}
                className="w-full p-2.5 text-xs font-mono bg-[#0f172a] border border-[#334155] rounded-[4px] text-white focus:outline-none focus:border-[#10b981]"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#334155] font-mono">
              <div className="text-xs text-[#9ca3af]">
                STAGE {executionStep} OF 3
              </div>

              <div className="flex items-center gap-2">
                {executionStep < 3 ? (
                  <button
                    onClick={handleRunNextStep}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-600 rounded-[4px] transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>EXECUTE STAGE #{executionStep + 1}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinishExecution}
                    className="px-4 py-1.5 text-xs font-bold text-gray-950 bg-[#10b981] hover:bg-emerald-400 active:bg-emerald-600 rounded-[4px] transition-all inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>COMMIT PROOF TO CLIENT</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Client Approval Modal with Digital Stamping Effect */}
      {reviewingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm font-sans animate-enter">
          <div className="w-full max-w-lg bg-[#1e293b] border border-[#334155] rounded-[4px] p-6 space-y-5 font-sans shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#334155] pb-3 font-mono">
              <div className="flex items-center gap-2 text-[#10b981]">
                <Award className="w-4 h-4" />
                <h3 className="text-sm font-bold text-white uppercase">CLEAR ESCROW & ISSUE PASSPORT</h3>
              </div>
              <button 
                onClick={() => setReviewingTask(null)}
                className="text-gray-400 hover:text-white p-1 rounded-[4px] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="text-[10px] font-mono text-[#9ca3af] uppercase">SUBJECT CONTRACT:</div>
              <div className="text-sm font-bold text-white">{reviewingTask.title}</div>
              <div className="text-xs font-mono text-[#9ca3af] flex items-center gap-2">
                <span>WORKER: <strong className="text-[#10b981]">{reviewingTask.workerName}</strong></span>
                <span>·</span>
                <span>PAYMENT: <strong className="text-white">{formatRLO(reviewingTask.paymentAmount)}</strong></span>
              </div>
            </div>

            {/* Quality Stars */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold text-gray-300 uppercase">
                PERFORMANCE RATING (CREDIT SCORE DELTA)
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl transition-transform hover:scale-110 cursor-pointer ${
                      star <= rating ? 'text-amber-400' : 'text-gray-600'
                    }`}
                  >
                    ★
                  </button>
                ))}
                <span className="text-xs font-mono text-[#9ca3af] ml-2">
                  {rating === 5 ? '+15 PTS (WITH 5★ BONUS)' : '+10 PTS STANDARD'}
                </span>
              </div>
            </div>

            {/* Verification notes */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-gray-300 uppercase">
                CLEARANCE MEMORANDUM
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={2}
                className="w-full p-2.5 text-xs font-mono bg-[#0f172a] border border-[#334155] rounded-[4px] text-white focus:outline-none focus:border-[#10b981]"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#334155] font-mono">
              <button
                onClick={() => setReviewingTask(null)}
                className="px-3.5 py-1.5 text-xs text-[#9ca3af] hover:text-white cursor-pointer"
              >
                CANCEL
              </button>
              
              <button
                onClick={handleApprove}
                disabled={isApproving}
                className="px-4 py-2 text-xs font-bold text-gray-950 bg-[#10b981] hover:bg-emerald-400 active:bg-emerald-600 rounded-[4px] transition-all inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <CheckCheck className="w-4 h-4" />
                <span>{isApproving ? 'STAMPING LEDGER...' : 'CRYPTOGRAPHICALLY SIGN & STAMP'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {disputeTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm font-sans animate-enter">
          <div className="w-full max-w-md bg-[#1e293b] border border-red-800 rounded-[4px] p-5 space-y-4 font-sans shadow-2xl">
            <div className="flex items-center gap-2 text-red-400 font-mono">
              <AlertTriangle className="w-4 h-4" />
              <h3 className="text-sm font-bold text-white uppercase">LODGE LABOR DISPUTE</h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              Lodging an official dispute incurs a mandatory <strong>-20 point credit score reduction</strong> on the counterparty and registers an infraction on their public ledger history.
            </p>
            <textarea
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              placeholder="State breach or verification failure specifications..."
              rows={3}
              className="w-full p-2.5 text-xs font-mono bg-[#0f172a] border border-[#334155] rounded-[4px] text-white focus:outline-none focus:border-red-500"
            />
            <div className="flex items-center justify-end gap-2 font-mono">
              <button
                onClick={() => setDisputeTaskId(null)}
                className="px-3 py-1.5 text-xs text-[#9ca3af] hover:text-white cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={handleDisputeSubmit}
                disabled={!disputeReason.trim()}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-[4px] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
              >
                CONFIRM DISPUTE (-20 PTS)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
