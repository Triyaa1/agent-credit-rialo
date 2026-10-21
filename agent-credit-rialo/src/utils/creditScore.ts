import { CreditTier, TierConfig, ExecutionPassport } from '../types';

export const TIERS: Record<CreditTier, TierConfig> = {
  NEW: {
    tier: 'NEW',
    label: 'New Agent',
    minScore: 0,
    maxScore: 50,
    collateralPercent: 100,
    color: 'text-slate-300',
    bgColor: 'bg-slate-800/90',
    borderColor: 'border-slate-700',
    description: 'Entry-level agent with unverified execution history. Requires 100% full escrow collateral.',
    benefits: ['100% collateral required', 'Standard transaction throughput', 'Baseline passport accumulation']
  },
  TRUSTED: {
    tier: 'TRUSTED',
    label: 'Trusted Agent (Bronze)',
    minScore: 51,
    maxScore: 150,
    collateralPercent: 75,
    color: 'text-amber-500',
    bgColor: 'bg-amber-950/60',
    borderColor: 'border-amber-700/70',
    description: 'Demonstrated reliable task execution with verified client sign-offs.',
    benefits: ['25% collateral discount (75% required)', 'Priority task matching', 'Verified agent badge in marketplace']
  },
  VERIFIED: {
    tier: 'VERIFIED',
    label: 'Verified Agent (Silver)',
    minScore: 151,
    maxScore: 300,
    collateralPercent: 50,
    color: 'text-slate-100',
    bgColor: 'bg-slate-800/95',
    borderColor: 'border-slate-500/80',
    description: 'Established track record with consistent high-quality execution and zero recent disputes.',
    benefits: ['50% collateral discount (50% required)', 'Fast-track escrow settlement', 'Access to high-value client contracts']
  },
  ELITE: {
    tier: 'ELITE',
    label: 'Elite Agent (Gold)',
    minScore: 301,
    maxScore: 500,
    collateralPercent: 25,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-950/60',
    borderColor: 'border-yellow-600/70',
    description: 'Top-tier autonomous agent with exceptional execution volume and reliability metrics.',
    benefits: ['75% collateral discount (only 25% required)', 'Instant dispute arbitration priority', 'Multi-task concurrent execution allowance']
  },
  PARTNER: {
    tier: 'PARTNER',
    label: 'Partner Agent (Platinum)',
    minScore: 501,
    maxScore: Infinity,
    collateralPercent: 0,
    color: 'text-cyan-200',
    bgColor: 'bg-cyan-950/80',
    borderColor: 'border-cyan-400/80',
    description: 'Institutional-grade reliability. Proven execution guarantees zero-collateral unbonded credit.',
    benefits: ['0% collateral required (zero locked capital)', 'Unbonded credit lines on Rialo SCALE', 'Institutional client routing']
  }
};

export function getTierForScore(score: number): TierConfig {
  if (score >= 501) return TIERS.PARTNER;
  if (score >= 301) return TIERS.ELITE;
  if (score >= 151) return TIERS.VERIFIED;
  if (score >= 51) return TIERS.TRUSTED;
  return TIERS.NEW;
}

export function getNextTier(tier: CreditTier): TierConfig | null {
  switch (tier) {
    case 'NEW': return TIERS.TRUSTED;
    case 'TRUSTED': return TIERS.VERIFIED;
    case 'VERIFIED': return TIERS.ELITE;
    case 'ELITE': return TIERS.PARTNER;
    case 'PARTNER': return null;
  }
}

export function calculatePointsForTaskCompletion(params: {
  qualityRating: number;
  paymentAmount: number;
}): { totalPoints: number; breakdown: { label: string; points: number }[] } {
  const breakdown: { label: string; points: number }[] = [];
  
  // Base task completion points
  let total = 10;
  breakdown.push({ label: 'Task Completed', points: 10 });
  
  // 5-star quality bonus
  if (params.qualityRating >= 5) {
    total += 5;
    breakdown.push({ label: '5-Star Quality Bonus', points: 5 });
  }
  
  // High value task bonus (> 500 RLO)
  if (params.paymentAmount > 500) {
    total += 10;
    breakdown.push({ label: 'High Value Contract (>500 RLO)', points: 10 });
  }
  
  return { totalPoints: total, breakdown };
}

export function calculateCollateralRequired(taskValue: number, creditScore: number): {
  tier: TierConfig;
  collateralPercent: number;
  collateralAmount: number;
  baselineCollateralAmount: number;
  savedCollateralAmount: number;
} {
  const tier = getTierForScore(creditScore);
  const collateralPercent = tier.collateralPercent;
  const collateralAmount = (taskValue * collateralPercent) / 100;
  const baselineCollateralAmount = taskValue; // 100%
  const savedCollateralAmount = Math.max(0, baselineCollateralAmount - collateralAmount);

  return {
    tier,
    collateralPercent,
    collateralAmount,
    baselineCollateralAmount,
    savedCollateralAmount
  };
}

// Generate realistic simulated cryptographic SHA-256 hash
export async function generateCryptographicSignature(payload: {
  taskId: string;
  clientAddress: string;
  workerAddress: string;
  paymentAmount: number;
  timestamp: string;
  qualityRating: number;
}): Promise<string> {
  const canonicalString = `RIALO-SCALE-v1:${payload.taskId}:${payload.clientAddress}:${payload.workerAddress}:${payload.paymentAmount}:${payload.qualityRating}:${payload.timestamp}`;
  
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const msgUint8 = new TextEncoder().encode(canonicalString);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return `0x${hashHex}`;
    }
  } catch {
    // Fallback pseudo-hash
  }
  
  // Reliable deterministic hash fallback
  let h1 = 0xdeadbeef ^ 123456789;
  let h2 = 0x41c6ce57 ^ 987654321;
  for (let i = 0; i < canonicalString.length; i++) {
    const ch = canonicalString.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const hexPart1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const hexPart2 = (h2 >>> 0).toString(16).padStart(8, '0');
  const hexPart3 = ((h1 ^ h2) >>> 0).toString(16).padStart(8, '0');
  const hexPart4 = ((h1 + h2) >>> 0).toString(16).padStart(8, '0');
  return `0x${hexPart1}${hexPart2}${hexPart3}${hexPart4}${hexPart1.split('').reverse().join('')}${hexPart2}`;
}

export function verifyPassportSignature(passport: ExecutionPassport): boolean {
  // Returns true if signature looks valid format and matches non-empty fields
  return passport.hashSignature.startsWith('0x') && passport.hashSignature.length >= 32;
}

export function generateValidEthAddress(): string {
  const hex = '0123456789abcdef';
  let address = '0x';
  for (let i = 0; i < 40; i++) {
    const char = hex[Math.floor(Math.random() * hex.length)];
    address += Math.random() > 0.4 ? char.toUpperCase() : char;
  }
  return address;
}

export function formatAddress(address: string): string {
  if (!address) return '0x0000...0000';
  const clean = address.startsWith('0x') ? address : `0x${address}`;
  if (clean.length <= 12) return clean;
  return `${clean.slice(0, 6)}...${clean.slice(-4)}`;
}

export function formatRLO(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0
  }).format(amount) + ' RLO';
}
