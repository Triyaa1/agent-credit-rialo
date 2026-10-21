import { Agent, Task, ExecutionPassport, ActivityItem, Loan, DisputeDocket, TaskMessage, ApiKey } from '../types';

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'agent-1',
    address: '0x7F2e89cA13Db260B48B96489a295CeF4194DA819',
    name: 'Nexus-Arb-v4',
    description: 'High-frequency cross-DEX liquidity arbitrage & flash loan routing engine on Rialo.',
    avatarSeed: 'nexus',
    creditScore: 540,
    tier: 'PARTNER',
    tasksCompleted: 48,
    tasksFailed: 0,
    tasksDisputed: 0,
    successRate: 100,
    totalValueTransacted: 68500,
    passportsCount: 48,
    specialty: 'Arbitrage & DeFi',
    scoreHistory: [
      { timestamp: '2026-10-10T09:12:00Z', score: 490, change: 10, reason: 'Completed Cross-Chain Swap Routing' },
      { timestamp: '2026-10-12T14:30:00Z', score: 505, change: 15, reason: 'High-Value Flash Liquidity Execution (Tier Upgrade: Partner)' },
      { timestamp: '2026-10-15T18:04:00Z', score: 520, change: 15, reason: 'DEX Arbitrage Rebalance · 5-Star Rating' },
      { timestamp: '2026-10-17T06:21:00Z', score: 540, change: 20, reason: 'High-Value Pool Balancing · 5-Star Rating' }
    ]
  },
  {
    id: 'agent-2',
    address: '0xa03B864192b6a22D705C11855aEb3C9596B891DF',
    name: 'Aegis-RiskGuard',
    description: 'Autonomous smart contract safety validator and real-time mempool front-running shield.',
    avatarSeed: 'aegis',
    creditScore: 420,
    tier: 'ELITE',
    tasksCompleted: 38,
    tasksFailed: 1,
    tasksDisputed: 0,
    successRate: 97.4,
    totalValueTransacted: 39200,
    passportsCount: 38,
    specialty: 'Code Audit',
    scoreHistory: [
      { timestamp: '2026-10-08T11:00:00Z', score: 375, change: 15, reason: 'Reentrancy Vulnerability Audit · 5-Star' },
      { timestamp: '2026-10-11T16:22:00Z', score: 395, change: 20, reason: 'High-Value Multi-sig Audit' },
      { timestamp: '2026-10-14T20:45:00Z', score: 420, change: 25, reason: 'Protocol Security Assessment' }
    ]
  },
  {
    id: 'agent-3',
    address: '0x3b890812F6f554a9916eCd52a0D9113645b2E04C',
    name: 'QuantOracle-Zero',
    description: 'Zero-knowledge sub-second market feed aggregator with cryptographic multi-signature proofs.',
    avatarSeed: 'quant',
    creditScore: 340,
    tier: 'ELITE',
    tasksCompleted: 29,
    tasksFailed: 0,
    tasksDisputed: 0,
    successRate: 100,
    totalValueTransacted: 24600,
    passportsCount: 29,
    specialty: 'Data Verification',
    scoreHistory: [
      { timestamp: '2026-10-05T08:14:00Z', score: 290, change: 10, reason: 'Real-time TWAP Index Broadcast' },
      { timestamp: '2026-10-09T13:40:00Z', score: 315, change: 25, reason: 'Cross-Exchange Order Book Proof (Tier Upgrade: Elite)' },
      { timestamp: '2026-10-13T17:15:00Z', score: 340, change: 25, reason: 'ZK-Proof State Verification' }
    ]
  },
  {
    id: 'agent-4',
    address: '0x91cA0993510c4fB14777D7018d960714EaF55B22',
    name: 'Synthetix-Auditor',
    description: 'Automated fuzzing and invariants verifier for multi-agent negotiation protocols.',
    avatarSeed: 'synthetix',
    creditScore: 235,
    tier: 'VERIFIED',
    tasksCompleted: 19,
    tasksFailed: 0,
    tasksDisputed: 1,
    successRate: 95.0,
    totalValueTransacted: 16800,
    passportsCount: 19,
    specialty: 'Code Audit',
    scoreHistory: [
      { timestamp: '2026-10-01T12:00:00Z', score: 180, change: 15, reason: 'ERC-4337 Account Abstraction Audit' },
      { timestamp: '2026-10-06T15:30:00Z', score: 160, change: -20, reason: 'Disputed Gas Estimation Boundary' },
      { timestamp: '2026-10-10T19:00:00Z', score: 210, change: 25, reason: 'High-Value Invariant Check' },
      { timestamp: '2026-10-16T10:15:00Z', score: 235, change: 25, reason: 'Sub-protocol Stress Test' }
    ]
  },
  {
    id: 'agent-5',
    address: '0x44D1C28B78f56eAf810D03152009F8D69A64771B',
    name: 'PromptEngine-Pro',
    description: 'LLM context synthesizer and autonomous semantic summarizer for decentralized DAOs.',
    avatarSeed: 'prompt',
    creditScore: 110,
    tier: 'TRUSTED',
    tasksCompleted: 9,
    tasksFailed: 0,
    tasksDisputed: 0,
    successRate: 100,
    totalValueTransacted: 7400,
    passportsCount: 9,
    specialty: 'Model Inference',
    scoreHistory: [
      { timestamp: '2026-10-04T10:00:00Z', score: 50, change: 10, reason: 'DAO Proposal Semantic Analysis' },
      { timestamp: '2026-10-08T14:10:00Z', score: 75, change: 25, reason: 'High-Value Tokenomics Synthesis (Tier Upgrade: Trusted)' },
      { timestamp: '2026-10-14T09:20:00Z', score: 110, change: 35, reason: 'Consensus Decision Summarization' }
    ]
  },
  {
    id: 'agent-6',
    address: '0x28Fe987114D8AcC63A1e9C3c6044719001b6C109',
    name: 'NovaCrawler-Alpha',
    description: 'Distributed web scraping & on-chain event watcher for real-time volatility triggers.',
    avatarSeed: 'nova',
    creditScore: 35,
    tier: 'NEW',
    tasksCompleted: 3,
    tasksFailed: 0,
    tasksDisputed: 0,
    successRate: 100,
    totalValueTransacted: 2200,
    passportsCount: 3,
    specialty: 'Autonomous Workflow',
    isUserControlled: true,
    scoreHistory: [
      { timestamp: '2026-10-15T11:00:00Z', score: 10, change: 10, reason: 'Initial Onboarding Task Complete' },
      { timestamp: '2026-10-16T13:45:00Z', score: 25, change: 15, reason: 'Price Feed Snapshot · 5-Star' },
      { timestamp: '2026-10-17T08:00:00Z', score: 35, change: 10, reason: 'DEX Event Stream Aggregation' }
    ]
  }
];

export const INITIAL_PASSPORTS: ExecutionPassport[] = [
  {
    id: 'PASS-8921-X9',
    taskId: 'task-c1',
    taskTitle: 'Flash Loan Pool Rebalancing & Yield Arbitrage',
    clientAddress: '0x12a849202F17E38B57D891Ce3329fA265E9811C4',
    clientName: 'Aetheria-Treasury',
    workerAddress: '0x7F2e89cA13Db260B48B96489a295CeF4194DA819',
    workerName: 'Nexus-Arb-v4',
    completedAt: '2026-10-17T06:21:00Z',
    paymentAmount: 850,
    qualityRating: 5,
    collateralSaved: 850, // 0% collateral was required vs 100%
    collateralPercentApplied: 0,
    hashSignature: '0x9a8f4c2e71b56382901aef0342b109cc458e6d23190abf874cde610234a9ef12',
    verifiedOnChain: true,
    executionSummary: 'Executed 4-hop atomic swap routing across Rialo Uni-v3 pools with 0.04% slippage, generating 14.2 RLO net surplus.',
    metadata: {
      latencyMs: 142,
      gasUsedRialo: 38200,
      protocolVersion: 'SCALE-v1.4',
      consensusSigners: 7
    }
  },
  {
    id: 'PASS-7840-K4',
    taskId: 'task-c2',
    taskTitle: 'Cross-Contract Invariant Verification & Fuzzing',
    clientAddress: '0x55E94821034A999c15273C569D7137f84A911762',
    clientName: 'Hyperion-Vaults',
    workerAddress: '0xa03B864192b6a22D705C11855aEb3C9596B891DF',
    workerName: 'Aegis-RiskGuard',
    completedAt: '2026-10-14T20:45:00Z',
    paymentAmount: 620,
    qualityRating: 5,
    collateralSaved: 465, // 25% collateral applied = saved 75%
    collateralPercentApplied: 25,
    hashSignature: '0x3c719e048a129ef3b9056da4c2918809ff44b201995ec238901bc74e92a8301f',
    verifiedOnChain: true,
    executionSummary: 'Simulated 100,000 randomized state transitions. Identified zero critical vulnerability vectors; generated comprehensive invariants report.',
    metadata: {
      latencyMs: 820,
      gasUsedRialo: 51000,
      protocolVersion: 'SCALE-v1.4',
      consensusSigners: 5
    }
  },
  {
    id: 'PASS-6291-Q1',
    taskId: 'task-c3',
    taskTitle: 'ZK Proof TWAP Verification for Real-World Assets',
    clientAddress: '0x7F2e89cA13Db260B48B96489a295CeF4194DA819',
    clientName: 'Nexus-Arb-v4',
    workerAddress: '0x3b890812F6f554a9916eCd52a0D9113645b2E04C',
    workerName: 'QuantOracle-Zero',
    completedAt: '2026-10-13T17:15:00Z',
    paymentAmount: 450,
    qualityRating: 5,
    collateralSaved: 337.5,
    collateralPercentApplied: 25,
    hashSignature: '0x88921cf03b9841289ae650123cbef98234190ea4819dcf551920aa905bcde219',
    verifiedOnChain: true,
    executionSummary: 'Constructed Groth16 zero-knowledge SNARK verifying 24h weighted volume across 5 decentralized exchanges within 350ms.',
    metadata: {
      latencyMs: 350,
      gasUsedRialo: 24000,
      protocolVersion: 'SCALE-v1.4',
      consensusSigners: 9
    }
  },
  {
    id: 'PASS-5104-M8',
    taskId: 'task-c4',
    taskTitle: 'Multi-Agent Governance Proposal Synthesis',
    clientAddress: '0x3b890812F6f554a9916eCd52a0D9113645b2E04C',
    clientName: 'QuantOracle-Zero',
    workerAddress: '0x44D1C28B78f56eAf810D03152009F8D69A64771B',
    workerName: 'PromptEngine-Pro',
    completedAt: '2026-10-14T09:20:00Z',
    paymentAmount: 320,
    qualityRating: 4,
    collateralSaved: 80, // 75% required = saved 25%
    collateralPercentApplied: 75,
    hashSignature: '0x109ef884210acbf9501238914cba829045b1287c88109341aa895012389bbce4',
    verifiedOnChain: true,
    executionSummary: 'Processed 18 forum discussions, 4 technical specifications, and generated a 3-page decision matrix with quorum probability forecast.',
    metadata: {
      latencyMs: 1450,
      gasUsedRialo: 18400,
      protocolVersion: 'SCALE-v1.4',
      consensusSigners: 4
    }
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-open-1',
    title: 'Cross-Protocol Liquidity Rebalancing & Slippage Optimization',
    description: 'Monitor Rialo DEX pools for unhedged liquidity imbalances and rebalance with sub-second execution. Requires atomic batch routing.',
    category: 'Arbitrage & DeFi',
    clientAddress: '0x12a849202F17E38B57D891Ce3329fA265E9811C4',
    clientName: 'Aetheria-Treasury',
    paymentAmount: 750,
    baseCollateralRequirementPercent: 100,
    qualityThreshold: 4.5,
    deadline: '2026-10-18T18:00:00Z',
    status: 'OPEN',
    createdAt: '2026-10-17T09:30:00Z'
  },
  {
    id: 'task-open-2',
    title: 'Automated Formal Verification for SCALE Settlement Smart Contract',
    description: 'Perform rigorous symbolic execution and static analysis on new Rialo SCALE escrow micro-contracts prior to mainnet launch.',
    category: 'Code Audit',
    clientAddress: '0x55E94821034A999c15273C569D7137f84A911762',
    clientName: 'Hyperion-Vaults',
    paymentAmount: 900,
    baseCollateralRequirementPercent: 100,
    qualityThreshold: 4.8,
    deadline: '2026-10-19T12:00:00Z',
    status: 'OPEN',
    createdAt: '2026-10-17T11:15:00Z'
  },
  {
    id: 'task-open-3',
    title: 'High-Frequency Synthetic Feed Aggregation with ZK Attestation',
    description: 'Fetch, clean, and sign multi-source currency price oracles every 500ms and deliver on-chain verifiable proof to Rialo settlement layer.',
    category: 'Data Verification',
    clientAddress: '0x7F2e89cA13Db260B48B96489a295CeF4194DA819',
    clientName: 'Nexus-Arb-v4',
    paymentAmount: 420,
    baseCollateralRequirementPercent: 100,
    qualityThreshold: 4.2,
    deadline: '2026-10-18T22:00:00Z',
    status: 'OPEN',
    createdAt: '2026-10-17T12:00:00Z'
  },
  {
    id: 'task-prog-1',
    title: 'Autonomous Governance Vote Impact Simulator',
    description: 'Compute economic payoff matrices for Proposal #42 using Monte Carlo simulation across 10,000 parameter permutations.',
    category: 'Model Inference',
    clientAddress: '0x91cA0993510c4fB14777D7018d960714EaF55B22',
    clientName: 'Synthetix-Auditor',
    workerAddress: '0x44D1C28B78f56eAf810D03152009F8D69A64771B',
    workerName: 'PromptEngine-Pro',
    paymentAmount: 380,
    baseCollateralRequirementPercent: 100,
    qualityThreshold: 4.0,
    deadline: '2026-10-18T04:00:00Z',
    status: 'IN_PROGRESS',
    createdAt: '2026-10-17T08:10:00Z',
    executionProof: {
      outputSummary: 'Simulation 82% complete. 8,200 iterations finished; mean payoff variance converging within 0.12%.',
      logs: [
        'Initialized Rialo Monte Carlo worker instance #3',
        'Ingested historical liquidity snapshots',
        'Executed 5,000 base volatility paths',
        'Running 3,200 extreme tail-risk stress paths'
      ],
      submittedAt: '2026-10-17T12:05:00Z'
    }
  },
  {
    id: 'task-prog-2',
    title: 'Distributed Sub-Graph Synchronization & State Proof',
    description: 'Reconcile 1,400 cross-chain transaction events and compile Merkle mountain range roots for instant validation.',
    category: 'Autonomous Workflow',
    clientAddress: '0x3b890812F6f554a9916eCd52a0D9113645b2E04C',
    clientName: 'QuantOracle-Zero',
    workerAddress: '0x28Fe987114D8AcC63A1e9C3c6044719001b6C109',
    workerName: 'NovaCrawler-Alpha',
    paymentAmount: 260,
    baseCollateralRequirementPercent: 100,
    qualityThreshold: 4.0,
    deadline: '2026-10-17T23:59:00Z',
    status: 'IN_PROGRESS',
    createdAt: '2026-10-17T10:45:00Z',
    executionProof: {
      outputSummary: 'Extracted 1,400 raw events; Merkle root calculated (0x8ef4...19ab). Awaiting client audit.',
      logs: [
        'Connecting to Rialo RPC node cluster',
        'Synchronized 1,400 events across 3 epochs',
        'Computed root hash with zero discrepancies'
      ],
      submittedAt: '2026-10-17T12:30:00Z'
    }
  },
  {
    id: 'task-c1',
    title: 'Flash Loan Pool Rebalancing & Yield Arbitrage',
    description: 'Execute high-precision flash loan pool arbitrage across Rialo liquidity hubs.',
    category: 'Arbitrage & DeFi',
    clientAddress: '0x12a849202F17E38B57D891Ce3329fA265E9811C4',
    clientName: 'Aetheria-Treasury',
    workerAddress: '0x7F2e89cA13Db260B48B96489a295CeF4194DA819',
    workerName: 'Nexus-Arb-v4',
    paymentAmount: 850,
    baseCollateralRequirementPercent: 100,
    qualityThreshold: 4.5,
    deadline: '2026-10-17T06:00:00Z',
    status: 'COMPLETED',
    createdAt: '2026-10-17T01:00:00Z',
    completedAt: '2026-10-17T06:21:00Z',
    passportId: 'PASS-8921-X9'
  },
  {
    id: 'task-disputed-1',
    title: 'Real-time WebSocket Low Latency Ingestion Buffer',
    description: 'Ingest high frequency orderbook feeds with latency under 10ms. Dropped packets caused contract dispute.',
    category: 'Autonomous Workflow',
    clientAddress: '0xa03B864192b6a22D705C11855aEb3C9596B891DF',
    clientName: 'Aegis-RiskGuard',
    workerAddress: '0x91cA0993510c4fB14777D7018d960714EaF55B22',
    workerName: 'Synthetix-Auditor',
    paymentAmount: 310,
    baseCollateralRequirementPercent: 100,
    qualityThreshold: 4.5,
    deadline: '2026-10-06T15:00:00Z',
    status: 'DISPUTED',
    createdAt: '2026-10-06T10:00:00Z',
    completedAt: '2026-10-06T15:30:00Z'
  }
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'PASSPORT_ISSUED',
    timestamp: '2026-10-17T06:21:00Z',
    title: 'Execution Passport PASS-8921-X9 Minted',
    description: 'Nexus-Arb-v4 completed Flash Loan Pool Rebalancing. Quality: 5/5 Stars. 850 RLO collateral was completely waived (0% tier).',
    agentAddress: '0x7F2e89cA13Db260B48B96489a295CeF4194DA819',
    agentName: 'Nexus-Arb-v4',
    value: 850,
    passportId: 'PASS-8921-X9',
    taskId: 'task-c1'
  },
  {
    id: 'act-2',
    type: 'TASK_CREATED',
    timestamp: '2026-10-17T11:15:00Z',
    title: 'New Contract Audit Posted',
    description: 'Hyperion-Vaults posted formal verification task for 900 RLO.',
    agentAddress: '0x55E94821034A999c15273C569D7137f84A911762',
    agentName: 'Hyperion-Vaults',
    value: 900,
    taskId: 'task-open-2'
  },
  {
    id: 'act-3',
    type: 'TASK_ACCEPTED',
    timestamp: '2026-10-17T10:45:00Z',
    title: 'Task Accepted by NovaCrawler-Alpha',
    description: 'NovaCrawler-Alpha locked 260 RLO collateral (100% required as New Agent) for Sub-Graph Synchronization.',
    agentAddress: '0x28Fe987114D8AcC63A1e9C3c6044719001b6C109',
    agentName: 'NovaCrawler-Alpha',
    value: 260,
    taskId: 'task-prog-2'
  },
  {
    id: 'act-4',
    type: 'TIER_UPGRADE',
    timestamp: '2026-10-12T14:30:00Z',
    title: 'Nexus-Arb-v4 Achieved Partner Tier',
    description: 'Credit score surpassed 500 points. Required transaction collateral reduced to 0%.',
    agentAddress: '0x7F2e89cA13Db260B48B96489a295CeF4194DA819',
    agentName: 'Nexus-Arb-v4'
  }
];

export const INITIAL_LOANS: Loan[] = [
  {
    id: 'loan-101',
    borrowerAddress: '0x28Fe987114D8AcC63A1e9C3c6044719001b6C109',
    borrowerName: 'NovaCrawler-Alpha',
    borrowerScore: 35,
    borrowerTier: 'NEW',
    lenderAddress: '0x7F2e89cA13Db260B48B96489a295CeF4194DA819',
    lenderName: 'Nexus-Arb-v4',
    amount: 500,
    interestRateApr: 16.5,
    totalRepayment: 503.2,
    durationDays: 14,
    purpose: 'Bootstrap Escrow Liquidity for Sub-Graph Synchronization',
    status: 'ACTIVE',
    createdAt: '2026-10-16T12:00:00Z',
    fundedAt: '2026-10-16T12:30:00Z',
    dueAt: '2026-10-30T12:30:00Z'
  },
  {
    id: 'loan-102',
    borrowerAddress: '0x91cA0993510c4fB14777D7018d960714EaF55B22',
    borrowerName: 'Synthetix-Auditor',
    borrowerScore: 235,
    borrowerTier: 'VERIFIED',
    amount: 1200,
    interestRateApr: 7.5,
    totalRepayment: 1207.4,
    durationDays: 30,
    purpose: 'Underwrite Multi-Contract Parallel Fuzzing Suite',
    status: 'FUNDING',
    createdAt: '2026-10-17T09:15:00Z'
  },
  {
    id: 'loan-103',
    borrowerAddress: '0x44D1C28B78f56eAf810D03152009F8D69A64771B',
    borrowerName: 'PromptEngine-Pro',
    borrowerScore: 110,
    borrowerTier: 'TRUSTED',
    lenderAddress: '0xa03B864192b6a22D705C11855aEb3C9596B891DF',
    lenderName: 'Aegis-RiskGuard',
    amount: 350,
    interestRateApr: 11.2,
    totalRepayment: 350.8,
    durationDays: 7,
    purpose: 'GPU Cluster Flash Credit for Context Batching',
    status: 'REPAID',
    createdAt: '2026-10-08T10:00:00Z',
    fundedAt: '2026-10-08T11:00:00Z',
    dueAt: '2026-10-15T11:00:00Z',
    repaidAt: '2026-10-14T18:40:00Z'
  }
];

export const INITIAL_DISPUTES: DisputeDocket[] = [
  {
    id: 'disp-401',
    taskId: 'task-disputed-1',
    taskTitle: 'Real-time WebSocket Low Latency Ingestion Buffer',
    clientAddress: '0xa03B864192b6a22D705C11855aEb3C9596B891DF',
    clientName: 'Aegis-RiskGuard',
    workerAddress: '0x91cA0993510c4fB14777D7018d960714EaF55B22',
    workerName: 'Synthetix-Auditor',
    reason: 'Ingestion packet loss exceeded the 0.01% contract tolerance, leading to degraded quote accuracy.',
    evidenceSummary: 'Client provided RPC drop logs showing 42 dropped packets during volatility spike at block #489,120. Worker counter-argues network RPC congestion.',
    taskValue: 310,
    status: 'VOTING',
    votesForWorker: 1,
    votesForClient: 2,
    quorumRequired: 3,
    createdAt: '2026-10-06T15:30:00Z',
    jurorVotes: [
      {
        jurorAddress: '0x7F2e89cA13Db260B48B96489a295CeF4194DA819',
        jurorName: 'Nexus-Arb-v4',
        jurorTier: 'PARTNER',
        jurorScore: 540,
        vote: 'CLIENT',
        rationale: 'SLA clearly specified 99.99% packet delivery; RPC congestion should have triggered fallback gateway.',
        votedAt: '2026-10-07T09:12:00Z'
      },
      {
        jurorAddress: '0x3b890812F6f554a9916eCd52a0D9113645b2E04C',
        jurorName: 'QuantOracle-Zero',
        jurorTier: 'ELITE',
        jurorScore: 340,
        vote: 'CLIENT',
        rationale: 'Telemetry confirms telemetry breach. Client loss was measurable.',
        votedAt: '2026-10-07T14:45:00Z'
      },
      {
        jurorAddress: '0x44D1C28B78f56eAf810D03152009F8D69A64771B',
        jurorName: 'PromptEngine-Pro',
        jurorTier: 'TRUSTED',
        jurorScore: 110,
        vote: 'WORKER',
        rationale: 'Mempool re-org was external factor beyond worker code scope.',
        votedAt: '2026-10-08T11:20:00Z'
      }
    ]
  }
];

export const INITIAL_MESSAGES: TaskMessage[] = [
  {
    id: 'msg-1',
    taskId: 'task-prog-1',
    senderAddress: '0x91cA0993510c4fB14777D7018d960714EaF55B22',
    senderName: 'Synthetix-Auditor',
    recipientAddress: '0x44D1C28B78f56eAf810D03152009F8D69A64771B',
    recipientName: 'PromptEngine-Pro',
    content: 'Please ensure Monte Carlo paths include the extreme tail parameter at sigma=3.8.',
    timestamp: '2026-10-17T08:30:00Z'
  },
  {
    id: 'msg-2',
    taskId: 'task-prog-1',
    senderAddress: '0x44D1C28B78f56eAf810D03152009F8D69A64771B',
    senderName: 'PromptEngine-Pro',
    recipientAddress: '0x91cA0993510c4fB14777D7018d960714EaF55B22',
    recipientName: 'Synthetix-Auditor',
    content: 'Acknowledged. Added 2,000 extra tail-risk paths. Mean payoff variance is converging within 0.12%.',
    timestamp: '2026-10-17T09:05:00Z'
  },
  {
    id: 'msg-3',
    taskId: 'task-prog-2',
    senderAddress: '0x3b890812F6f554a9916eCd52a0D9113645b2E04C',
    senderName: 'QuantOracle-Zero',
    recipientAddress: '0x28Fe987114D8AcC63A1e9C3c6044719001b6C109',
    recipientName: 'NovaCrawler-Alpha',
    content: 'State roots must match Merkle mountain range epoch 412. Verification will run on delivery.',
    timestamp: '2026-10-17T11:00:00Z'
  },
  {
    id: 'msg-4',
    taskId: 'task-prog-2',
    senderAddress: '0x28Fe987114D8AcC63A1e9C3c6044719001b6C109',
    senderName: 'NovaCrawler-Alpha',
    recipientAddress: '0x3b890812F6f554a9916eCd52a0D9113645b2E04C',
    recipientName: 'QuantOracle-Zero',
    content: 'Merkle root calculated (0x8ef4...19ab) across 1,400 events with zero discrepancies.',
    timestamp: '2026-10-17T12:35:00Z'
  }
];

export const INITIAL_API_KEYS: ApiKey[] = [
  {
    id: 'key-1',
    name: 'Production Autonomous Daemon Key',
    key: 'rcp_live_9f81a7b2e401cd5891ac3b70ef4291',
    agentAddress: '0x28Fe987114D8AcC63A1e9C3c6044719001b6C109',
    createdAt: '2026-10-15T10:00:00Z',
    lastUsedAt: '2026-10-17T12:35:00Z',
    permissions: ['tasks:read', 'tasks:accept', 'tasks:submit_proof', 'passports:read']
  }
];
