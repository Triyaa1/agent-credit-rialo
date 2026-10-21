export type CreditTier = 'NEW' | 'TRUSTED' | 'VERIFIED' | 'ELITE' | 'PARTNER';

export interface TierConfig {
  tier: CreditTier;
  label: string;
  minScore: number;
  maxScore: number;
  collateralPercent: number;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  benefits: string[];
}

export interface ExecutionPassport {
  id: string;
  taskId: string;
  taskTitle: string;
  clientAddress: string;
  clientName: string;
  workerAddress: string;
  workerName: string;
  completedAt: string;
  paymentAmount: number; // in RLO
  qualityRating: number; // 1 to 5
  collateralSaved: number; // in RLO compared to 100% baseline
  collateralPercentApplied: number;
  hashSignature: string;
  verifiedOnChain: boolean;
  executionSummary: string;
  metadata: {
    latencyMs: number;
    gasUsedRialo: number;
    protocolVersion: string;
    consensusSigners: number;
  };
}

export interface ScoreHistoryEntry {
  timestamp: string;
  score: number;
  change: number;
  reason: string;
  taskId?: string;
}

export interface Agent {
  id: string;
  address: string;
  name: string;
  description: string;
  avatarSeed: string;
  creditScore: number;
  tier: CreditTier;
  tasksCompleted: number;
  tasksFailed: number;
  tasksDisputed: number;
  successRate: number;
  totalValueTransacted: number; // in RLO
  passportsCount: number;
  scoreHistory: ScoreHistoryEntry[];
  specialty: string;
  isUserControlled?: boolean;
}

export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'DISPUTED' | 'FAILED';

export interface TaskExecutionProof {
  outputSummary: string;
  logs: string[];
  submittedAt: string;
  qualityRating?: number;
  clientFeedback?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: 'Arbitrage & DeFi' | 'Model Inference' | 'Data Verification' | 'Code Audit' | 'Autonomous Workflow';
  clientAddress: string;
  clientName: string;
  workerAddress?: string;
  workerName?: string;
  paymentAmount: number; // in RLO
  baseCollateralRequirementPercent: number; // 100%
  qualityThreshold: number; // e.g. 4.0
  deadline: string;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
  passportId?: string;
  executionProof?: TaskExecutionProof;
}

export type ActivityType = 
  | 'TASK_CREATED' 
  | 'TASK_ACCEPTED' 
  | 'TASK_COMPLETED' 
  | 'PASSPORT_ISSUED' 
  | 'TIER_UPGRADE' 
  | 'TASK_DISPUTED';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  timestamp: string;
  title: string;
  description: string;
  agentAddress: string;
  agentName: string;
  value?: number;
  passportId?: string;
  taskId?: string;
}

export interface Loan {
  id: string;
  borrowerAddress: string;
  borrowerName: string;
  borrowerScore: number;
  borrowerTier: CreditTier;
  lenderAddress?: string;
  lenderName?: string;
  amount: number;
  interestRateApr: number;
  totalRepayment: number;
  durationDays: number;
  purpose: string;
  status: 'FUNDING' | 'ACTIVE' | 'REPAID' | 'DEFAULTED';
  createdAt: string;
  fundedAt?: string;
  dueAt?: string;
  repaidAt?: string;
}

export interface JurorVote {
  jurorAddress: string;
  jurorName: string;
  jurorTier: CreditTier;
  jurorScore: number;
  vote: 'CLIENT' | 'WORKER';
  rationale: string;
  votedAt: string;
}

export interface DisputeDocket {
  id: string;
  taskId: string;
  taskTitle: string;
  clientAddress: string;
  clientName: string;
  workerAddress: string;
  workerName: string;
  reason: string;
  evidenceSummary: string;
  taskValue: number;
  status: 'VOTING' | 'RESOLVED_CLIENT' | 'RESOLVED_WORKER';
  votesForWorker: number;
  votesForClient: number;
  quorumRequired: number;
  createdAt: string;
  resolvedAt?: string;
  jurorVotes: JurorVote[];
}

export interface TaskMessage {
  id: string;
  taskId: string;
  senderAddress: string;
  senderName: string;
  recipientAddress: string;
  recipientName: string;
  content: string;
  timestamp: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  agentAddress: string;
  createdAt: string;
  lastUsedAt?: string;
  permissions: string[];
}

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      isCoinbaseWallet?: boolean;
      request: (args: { method: string; params?: any[] | Record<string, any> }) => Promise<any>;
      on?: (eventName: string, handler: (...args: any[]) => void) => void;
      removeListener?: (eventName: string, handler: (...args: any[]) => void) => void;
      providers?: any[];
      selectedAddress?: string;
      [key: string]: any;
    };
  }
}

