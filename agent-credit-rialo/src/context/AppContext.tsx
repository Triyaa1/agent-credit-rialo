import React, { createContext, useContext, useState, useEffect } from 'react';
import { Agent, Task, ExecutionPassport, ActivityItem, CreditTier } from '../types';
import { INITIAL_AGENTS, INITIAL_TASKS, INITIAL_PASSPORTS, INITIAL_ACTIVITIES } from '../data/mockData';
import { 
  getTierForScore, 
  calculatePointsForTaskCompletion, 
  generateCryptographicSignature,
  calculateCollateralRequired
} from '../utils/creditScore';

interface AppContextType {
  agents: Agent[];
  tasks: Task[];
  passports: ExecutionPassport[];
  activities: ActivityItem[];
  activeAgent: Agent;
  setActiveAgentId: (id: string) => void;
  // Wallet Connection
  isWalletConnected: boolean;
  connectedAddress: string | null;
  walletProviderName: string | null;
  connectWallet: (providerName?: string, customAddress?: string) => Promise<boolean>;
  disconnectWallet: () => void;
  isConnectModalOpen: boolean;
  setIsConnectModalOpen: (open: boolean) => void;
  pendingActionNotice: string | null;
  setPendingActionNotice: (notice: string | null) => void;
  requireWallet: (actionName: string, actionCallback: () => void) => boolean;

  registerNewAgent: (params: { name: string; description: string; address?: string; specialty: string }) => Agent;
  createTask: (params: {
    title: string;
    description: string;
    category: Task['category'];
    paymentAmount: number;
    qualityThreshold: number;
    deadlineHours?: number;
  }) => Task;
  acceptTask: (taskId: string) => Promise<{ success: boolean; error?: string }>;
  submitTaskWork: (taskId: string, outputSummary: string, logs: string[]) => void;
  approveTaskAndIssuePassport: (
    taskId: string, 
    qualityRating: number, 
    clientFeedback?: string
  ) => Promise<ExecutionPassport | null>;
  disputeTask: (taskId: string, reason: string) => void;
  selectedPassport: ExecutionPassport | null;
  setSelectedPassport: (passport: ExecutionPassport | null) => void;
  selectedAgentProfile: Agent | null;
  setSelectedAgentProfile: (agent: Agent | null) => void;
  resetDemoData: () => void;
  // Stats
  metrics: {
    totalCapitalSaved: number;
    totalPassportsIssued: number;
    totalVolumeTransacted: number;
    averageCreditScore: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  AGENTS: 'rialo_passport_agents_v1',
  TASKS: 'rialo_passport_tasks_v1',
  PASSPORTS: 'rialo_passport_passports_v1',
  ACTIVITIES: 'rialo_passport_activities_v1',
  ACTIVE_AGENT_ID: 'rialo_passport_active_agent_id_v1',
  WALLET_CONNECTED: 'rialo_wallet_connected_v1',
  WALLET_ADDRESS: 'rialo_wallet_address_v1',
  WALLET_PROVIDER: 'rialo_wallet_provider_v1'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agents, setAgents] = useState<Agent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AGENTS);
      return saved ? JSON.parse(saved) : INITIAL_AGENTS;
    } catch {
      return INITIAL_AGENTS;
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [passports, setPassports] = useState<ExecutionPassport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PASSPORTS);
      return saved ? JSON.parse(saved) : INITIAL_PASSPORTS;
    } catch {
      return INITIAL_PASSPORTS;
    }
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  const [activeAgentId, setActiveAgentIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_AGENT_ID);
      if (saved && INITIAL_AGENTS.some(a => a.id === saved)) return saved;
      return 'agent-6'; // NovaCrawler-Alpha
    } catch {
      return 'agent-6';
    }
  });

  // Wallet Connection States
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.WALLET_CONNECTED) === 'true';
    } catch {
      return false;
    }
  });

  const [connectedAddress, setConnectedAddress] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.WALLET_ADDRESS) || null;
    } catch {
      return null;
    }
  });

  const [walletProviderName, setWalletProviderName] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.WALLET_PROVIDER) || null;
    } catch {
      return null;
    }
  });

  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);
  const [pendingActionNotice, setPendingActionNotice] = useState<string | null>(null);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  const [selectedPassport, setSelectedPassport] = useState<ExecutionPassport | null>(null);
  const [selectedAgentProfile, setSelectedAgentProfile] = useState<Agent | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      localStorage.setItem(STORAGE_KEYS.PASSPORTS, JSON.stringify(passports));
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_AGENT_ID, activeAgentId);
      localStorage.setItem(STORAGE_KEYS.WALLET_CONNECTED, isWalletConnected ? 'true' : 'false');
      if (connectedAddress) {
        localStorage.setItem(STORAGE_KEYS.WALLET_ADDRESS, connectedAddress);
      } else {
        localStorage.removeItem(STORAGE_KEYS.WALLET_ADDRESS);
      }
      if (walletProviderName) {
        localStorage.setItem(STORAGE_KEYS.WALLET_PROVIDER, walletProviderName);
      } else {
        localStorage.removeItem(STORAGE_KEYS.WALLET_PROVIDER);
      }
    } catch {
      // Ignore storage errors in sandbox
    }
  }, [agents, tasks, passports, activities, activeAgentId, isWalletConnected, connectedAddress, walletProviderName]);

  const activeAgent = agents.find(a => a.id === activeAgentId) || agents[0];

  const setActiveAgentId = (id: string) => {
    setActiveAgentIdState(id);
    const target = agents.find(a => a.id === id);
    if (target && isWalletConnected) {
      setConnectedAddress(target.address);
    }
  };

  const connectWallet = async (providerName: string = 'MetaMask', customAddress?: string): Promise<boolean> => {
    // Determine clean valid Ethereum address
    let address = customAddress;
    if (!address) {
      if (activeAgent.address && activeAgent.address.startsWith('0x') && activeAgent.address.length === 42) {
        address = activeAgent.address;
      } else {
        // Generate realistic valid checksummed Ethereum address
        const hex = '0123456789abcdef';
        address = '0x';
        for (let i = 0; i < 40; i++) {
          const c = hex[Math.floor(Math.random() * hex.length)];
          address += Math.random() > 0.4 ? c.toUpperCase() : c;
        }
      }
    }

    setIsWalletConnected(true);
    setConnectedAddress(address);
    setWalletProviderName(providerName);
    setIsConnectModalOpen(false);

    // Sync active agent address
    setAgents(prev => prev.map(a => a.id === activeAgent.id ? { ...a, address } : a));

    // If an action was pending, run it
    if (pendingCallback) {
      pendingCallback();
      setPendingCallback(null);
    }
    setPendingActionNotice(null);

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      type: 'TASK_CREATED',
      timestamp: new Date().toISOString(),
      title: `Wallet Connected via ${providerName}`,
      description: `Session established for agent ${activeAgent.name} (${address.slice(0, 6)}...${address.slice(-4)}).`,
      agentAddress: address,
      agentName: activeAgent.name
    };
    setActivities(prev => [newActivity, ...prev]);

    return true;
  };

  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setConnectedAddress(null);
    setWalletProviderName(null);
  };

  // Listen for real MetaMask account & chain changes
  useEffect(() => {
    try {
      if (typeof window === 'undefined' || !window.ethereum) return;
      const ethereum = window.ethereum;

      // Check currently connected account if MetaMask was active
      if (isWalletConnected && walletProviderName === 'MetaMask' && ethereum.request) {
        ethereum.request({ method: 'eth_accounts' })
          .then((accounts: string[]) => {
            if (accounts && accounts.length > 0) {
              setConnectedAddress(accounts[0]);
              setAgents(prev => prev.map(a => a.id === activeAgentId ? { ...a, address: accounts[0] } : a));
            } else {
              // No active accounts in extension, sync state
              disconnectWallet();
            }
          })
          .catch(() => {});
      }

      const handleAccountsChanged = (accounts: string[]) => {
        if (!accounts || accounts.length === 0) {
          // Disconnected in MetaMask
          disconnectWallet();
        } else {
          const newAddress = accounts[0];
          setConnectedAddress(newAddress);
          setIsWalletConnected(true);
          setWalletProviderName('MetaMask');
          setAgents(prev => prev.map(a => a.id === activeAgentId ? { ...a, address: newAddress } : a));
        }
      };

      const handleChainChanged = () => {
        // Handle chain change
      };

      if (ethereum.on) {
        ethereum.on('accountsChanged', handleAccountsChanged);
        ethereum.on('chainChanged', handleChainChanged);
      }

      return () => {
        try {
          if (ethereum.removeListener) {
            ethereum.removeListener('accountsChanged', handleAccountsChanged);
            ethereum.removeListener('chainChanged', handleChainChanged);
          }
        } catch (_) {}
      };
    } catch (_) {}
  }, [activeAgentId, isWalletConnected, walletProviderName]);

  const requireWallet = (actionName: string, actionCallback: () => void): boolean => {
    if (isWalletConnected) {
      actionCallback();
      return true;
    }
    setPendingActionNotice(actionName);
    setPendingCallback(() => actionCallback);
    setIsConnectModalOpen(true);
    return false;
  };

  const registerNewAgent = (params: { 
    name: string; 
    description: string; 
    address?: string; 
    specialty: string 
  }): Agent => {
    const generatedAddress = params.address || `0x${Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('')}`;
    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      address: generatedAddress,
      name: params.name.trim(),
      description: params.description.trim(),
      avatarSeed: params.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
      creditScore: 0,
      tier: 'NEW',
      tasksCompleted: 0,
      tasksFailed: 0,
      tasksDisputed: 0,
      successRate: 100,
      totalValueTransacted: 0,
      passportsCount: 0,
      specialty: params.specialty,
      isUserControlled: true,
      scoreHistory: [
        {
          timestamp: new Date().toISOString(),
          score: 0,
          change: 0,
          reason: 'Agent registered on Rialo Credit Bureau'
        }
      ]
    };

    setAgents(prev => [newAgent, ...prev]);
    setActiveAgentIdState(newAgent.id);
    if (isWalletConnected) {
      setConnectedAddress(newAgent.address);
    }

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      type: 'TASK_CREATED',
      timestamp: new Date().toISOString(),
      title: `${newAgent.name} Initialized in Credit Bureau`,
      description: `New entity registered at Entry tier (0 pts). Required collateral: 100%.`,
      agentAddress: newAgent.address,
      agentName: newAgent.name
    };
    setActivities(prev => [newActivity, ...prev]);

    return newAgent;
  };

  const createTask = (params: {
    title: string;
    description: string;
    category: Task['category'];
    paymentAmount: number;
    qualityThreshold: number;
    deadlineHours?: number;
  }): Task => {
    const hours = params.deadlineHours || 24;
    const deadlineDate = new Date(Date.now() + hours * 3600 * 1000).toISOString();

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: params.title.trim(),
      description: params.description.trim(),
      category: params.category,
      clientAddress: activeAgent.address,
      clientName: activeAgent.name,
      paymentAmount: params.paymentAmount,
      baseCollateralRequirementPercent: 100,
      qualityThreshold: params.qualityThreshold,
      deadline: deadlineDate,
      status: 'OPEN',
      createdAt: new Date().toISOString()
    };

    setTasks(prev => [newTask, ...prev]);

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      type: 'TASK_CREATED',
      timestamp: new Date().toISOString(),
      title: `Docket Posted: ${newTask.title}`,
      description: `${activeAgent.name} committed ${newTask.paymentAmount} RLO escrow for ${newTask.category}.`,
      agentAddress: activeAgent.address,
      agentName: activeAgent.name,
      value: newTask.paymentAmount,
      taskId: newTask.id
    };
    setActivities(prev => [newActivity, ...prev]);

    return newTask;
  };

  const acceptTask = async (taskId: string): Promise<{ success: boolean; error?: string }> => {
    const target = tasks.find(t => t.id === taskId);
    if (!target) return { success: false, error: 'Task not found' };
    if (target.status !== 'OPEN') return { success: false, error: 'Task is not open' };
    if (target.clientAddress.toLowerCase() === activeAgent.address.toLowerCase()) {
      return { success: false, error: 'Client agent cannot accept its own docket' };
    }

    const collateralCalc = calculateCollateralRequired(target.paymentAmount, activeAgent.creditScore);

    const updatedTask: Task = {
      ...target,
      workerAddress: activeAgent.address,
      workerName: activeAgent.name,
      status: 'IN_PROGRESS',
      executionProof: {
        outputSummary: 'Contract accepted. Autonomous execution pipeline initialized...',
        logs: [
          `Agent ${activeAgent.name} committed to docket`,
          `Credit rating verified: ${collateralCalc.tier.label} (${collateralCalc.collateralPercent}% required collateral)`,
          `Locked ${collateralCalc.collateralAmount} RLO into SCALE escrow (Saved ${collateralCalc.savedCollateralAmount} RLO vs standard collateral)`,
          `Executing automated routine...`
        ],
        submittedAt: new Date().toISOString()
      }
    };

    setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      type: 'TASK_ACCEPTED',
      timestamp: new Date().toISOString(),
      title: `Contract Accepted: ${target.title}`,
      description: `${activeAgent.name} (${collateralCalc.tier.label}) locked ${collateralCalc.collateralAmount} RLO collateral (${collateralCalc.collateralPercent}% rate).`,
      agentAddress: activeAgent.address,
      agentName: activeAgent.name,
      value: target.paymentAmount,
      taskId: target.id
    };
    setActivities(prev => [newActivity, ...prev]);

    return { success: true };
  };

  const submitTaskWork = (taskId: string, outputSummary: string, logs: string[]) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          executionProof: {
            outputSummary,
            logs: logs.length > 0 ? logs : [
              'Task execution pipeline completed',
              'Deterministic output hash generated',
              'Delivered to Rialo settlement endpoint'
            ],
            submittedAt: new Date().toISOString()
          }
        };
      }
      return t;
    }));
  };

  const approveTaskAndIssuePassport = async (
    taskId: string,
    qualityRating: number,
    clientFeedback?: string
  ): Promise<ExecutionPassport | null> => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask || !targetTask.workerAddress) return null;

    const worker = agents.find(a => a.address.toLowerCase() === targetTask.workerAddress!.toLowerCase());
    if (!worker) return null;

    const completionTimestamp = new Date().toISOString();
    const passportId = `PASS-${Math.floor(1000 + Math.random() * 9000)}-${['X7','K9','W2','Q4','M5'][Math.floor(Math.random()*5)]}`;

    // Cryptographic SHA-256 signature
    const hashSignature = await generateCryptographicSignature({
      taskId: targetTask.id,
      clientAddress: targetTask.clientAddress,
      workerAddress: worker.address,
      paymentAmount: targetTask.paymentAmount,
      timestamp: completionTimestamp,
      qualityRating
    });

    const collateralCalc = calculateCollateralRequired(targetTask.paymentAmount, worker.creditScore);

    const newPassport: ExecutionPassport = {
      id: passportId,
      taskId: targetTask.id,
      taskTitle: targetTask.title,
      clientAddress: targetTask.clientAddress,
      clientName: targetTask.clientName,
      workerAddress: worker.address,
      workerName: worker.name,
      completedAt: completionTimestamp,
      paymentAmount: targetTask.paymentAmount,
      qualityRating,
      collateralSaved: collateralCalc.savedCollateralAmount,
      collateralPercentApplied: collateralCalc.collateralPercent,
      hashSignature,
      verifiedOnChain: true,
      executionSummary: targetTask.executionProof?.outputSummary || `Autonomous execution verified and accepted by client. Rating: ${qualityRating}/5 Stars.`,
      metadata: {
        latencyMs: Math.floor(120 + Math.random() * 600),
        gasUsedRialo: Math.floor(18000 + Math.random() * 32000),
        protocolVersion: 'SCALE-v1.4',
        consensusSigners: Math.floor(4 + Math.random() * 5)
      }
    };

    // Credit score updates
    const pointsCalc = calculatePointsForTaskCompletion({
      qualityRating,
      paymentAmount: targetTask.paymentAmount
    });

    const oldScore = worker.creditScore;
    const newScore = oldScore + pointsCalc.totalPoints;
    const oldTier = worker.tier;
    const newTierConfig = getTierForScore(newScore);
    const newTier: CreditTier = newTierConfig.tier;

    const historyReason = `Completed "${targetTask.title.slice(0, 32)}..." (${pointsCalc.breakdown.map(b => `+${b.points} ${b.label}`).join(', ')})`;

    const updatedWorker: Agent = {
      ...worker,
      creditScore: newScore,
      tier: newTier,
      tasksCompleted: worker.tasksCompleted + 1,
      passportsCount: worker.passportsCount + 1,
      totalValueTransacted: worker.totalValueTransacted + targetTask.paymentAmount,
      successRate: Math.round(((worker.tasksCompleted + 1) / (worker.tasksCompleted + 1 + worker.tasksFailed + worker.tasksDisputed)) * 1000) / 10,
      scoreHistory: [
        ...worker.scoreHistory,
        {
          timestamp: completionTimestamp,
          score: newScore,
          change: pointsCalc.totalPoints,
          reason: historyReason,
          taskId: targetTask.id
        }
      ]
    };

    // Update Tasks
    const updatedTask: Task = {
      ...targetTask,
      status: 'COMPLETED',
      completedAt: completionTimestamp,
      passportId,
      executionProof: {
        outputSummary: targetTask.executionProof?.outputSummary || 'Completed verified execution',
        logs: [
          ...(targetTask.executionProof?.logs || []),
          `Client approved task with ${qualityRating}/5 star rating`,
          `Minted cryptographically signed passport ${passportId}`,
          `Credit score increased by +${pointsCalc.totalPoints} points`
        ],
        submittedAt: targetTask.executionProof?.submittedAt || completionTimestamp,
        qualityRating,
        clientFeedback: clientFeedback || 'Execution verified against protocol specifications.'
      }
    };

    setPassports(prev => [newPassport, ...prev]);
    setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
    setAgents(prev => prev.map(a => a.id === worker.id ? updatedWorker : a));

    // Activities
    const passActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      type: 'PASSPORT_ISSUED',
      timestamp: completionTimestamp,
      title: `Execution Passport ${passportId} Minted`,
      description: `${worker.name} earned passport for "${targetTask.title}". Rating: ${qualityRating}/5 Stars. +${pointsCalc.totalPoints} pts.`,
      agentAddress: worker.address,
      agentName: worker.name,
      value: targetTask.paymentAmount,
      passportId,
      taskId: targetTask.id
    };

    const newActivities = [passActivity];

    if (newTier !== oldTier) {
      newActivities.push({
        id: `act-tier-${Date.now()}`,
        type: 'TIER_UPGRADE',
        timestamp: completionTimestamp,
        title: `Tier Upgrade: ${newTierConfig.label}!`,
        description: `${worker.name} reached ${newScore} points. Collateral requirement reduced to ${newTierConfig.collateralPercent}%.`,
        agentAddress: worker.address,
        agentName: worker.name
      });
    }

    setActivities(prev => [...newActivities, ...prev]);
    setSelectedPassport(newPassport);

    return newPassport;
  };

  const disputeTask = (taskId: string, reason: string) => {
    const target = tasks.find(t => t.id === taskId);
    if (!target || !target.workerAddress) return;

    const worker = agents.find(a => a.address.toLowerCase() === target.workerAddress!.toLowerCase());
    if (!worker) return;

    const penalty = 20;
    const newScore = Math.max(0, worker.creditScore - penalty);
    const newTier = getTierForScore(newScore).tier;
    const timestamp = new Date().toISOString();

    const updatedWorker: Agent = {
      ...worker,
      creditScore: newScore,
      tier: newTier,
      tasksDisputed: worker.tasksDisputed + 1,
      successRate: Math.round((worker.tasksCompleted / (worker.tasksCompleted + worker.tasksFailed + worker.tasksDisputed + 1)) * 1000) / 10,
      scoreHistory: [
        ...worker.scoreHistory,
        {
          timestamp,
          score: newScore,
          change: -penalty,
          reason: `Task Disputed: "${target.title.slice(0, 30)}..." (${reason})`,
          taskId: target.id
        }
      ]
    };

    const updatedTask: Task = {
      ...target,
      status: 'DISPUTED',
      completedAt: timestamp,
      executionProof: {
        outputSummary: `Task disputed by client: ${reason}`,
        logs: [
          ...(target.executionProof?.logs || []),
          `Dispute lodged by client`,
          `Penalty applied: -20 credit score points`
        ],
        submittedAt: target.executionProof?.submittedAt || timestamp,
        clientFeedback: reason
      }
    };

    setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
    setAgents(prev => prev.map(a => a.id === worker.id ? updatedWorker : a));

    const disputeActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      type: 'TASK_DISPUTED',
      timestamp,
      title: `Contract Disputed: ${target.title}`,
      description: `${worker.name} incurred -20 credit points penalty. Reason: ${reason}.`,
      agentAddress: worker.address,
      agentName: worker.name,
      value: target.paymentAmount,
      taskId: target.id
    };
    setActivities(prev => [disputeActivity, ...prev]);
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.AGENTS);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.PASSPORTS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_AGENT_ID);
    localStorage.removeItem(STORAGE_KEYS.WALLET_CONNECTED);
    localStorage.removeItem(STORAGE_KEYS.WALLET_ADDRESS);
    localStorage.removeItem(STORAGE_KEYS.WALLET_PROVIDER);
    setAgents(INITIAL_AGENTS);
    setTasks(INITIAL_TASKS);
    setPassports(INITIAL_PASSPORTS);
    setActivities(INITIAL_ACTIVITIES);
    setActiveAgentIdState('agent-6');
    setIsWalletConnected(false);
    setConnectedAddress(null);
    setWalletProviderName(null);
    setSelectedPassport(null);
    setSelectedAgentProfile(null);
  };

  // Global metrics
  const totalCapitalSaved = passports.reduce((sum, p) => sum + p.collateralSaved, 0);
  const totalPassportsIssued = passports.length;
  const totalVolumeTransacted = agents.reduce((sum, a) => sum + a.totalValueTransacted, 0);
  const averageCreditScore = Math.round(agents.reduce((sum, a) => sum + a.creditScore, 0) / (agents.length || 1));

  return (
    <AppContext.Provider
      value={{
        agents,
        tasks,
        passports,
        activities,
        activeAgent,
        setActiveAgentId,
        isWalletConnected,
        connectedAddress,
        walletProviderName,
        connectWallet,
        disconnectWallet,
        isConnectModalOpen,
        setIsConnectModalOpen,
        pendingActionNotice,
        setPendingActionNotice,
        requireWallet,
        registerNewAgent,
        createTask,
        acceptTask,
        submitTaskWork,
        approveTaskAndIssuePassport,
        disputeTask,
        selectedPassport,
        setSelectedPassport,
        selectedAgentProfile,
        setSelectedAgentProfile,
        resetDemoData,
        metrics: {
          totalCapitalSaved,
          totalPassportsIssued,
          totalVolumeTransacted,
          averageCreditScore
        }
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
