// Blockchain and Network Types
export enum ChainId {
  ETHEREUM = 1,
  POLYGON = 137,
  ARBITRUM = 42161,
  OPTIMISM = 10,
  BASE = 8453,
  BSC = 56,
  FHEVM_TESTNET = 1337,
}

// FHE Types
export interface FhevmInstance {
  encrypt32: (data: number) => string;
  decrypt32: (encryptedData: string) => number;
  add: (a: string, b: string) => string;
  sub: (a: string, b: string) => string;
  mul: (a: string, b: string) => string;
  div: (a: string, b: string) => string;
  gt: (a: string, b: string) => boolean;
  lt: (a: string, b: string) => boolean;
  eq: (a: string, b: string) => boolean;
}

export interface EncryptedData {
  encrypted: string;
  originalValue?: number;
  timestamp: number;
}

export interface FheStrategy {
  encryptedBudget: string;
  encryptedPurchaseAmount: string;
  encryptedTimeframe: string;
  encryptedFrequency: string;
  encryptedTotalPurchases?: string;
  encryptedTotalInvestment?: string;
  encryptedRemainingBudget?: string;
}

// DCA Strategy Types
export interface DCAStrategy {
  id: string;
  userId: string;
  budget: number;
  purchaseAmount: number;
  timeframe: number; // in hours
  frequency: number; // in hours
  totalPurchases: number;
  totalInvestment: number;
  remainingBudget: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EncryptedDCAStrategy {
  id: string;
  userId: string;
  encryptedBudget: string;
  encryptedPurchaseAmount: string;
  encryptedTimeframe: string;
  encryptedFrequency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Batch Types
export interface BatchData {
  batchId: string;
  totalAmount: number;
  participantCount: number;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  createdAt: Date;
  executedAt?: Date;
  transactionHash?: string;
}

export interface EncryptedBatchData {
  batchId: string;
  encryptedTotalAmount: string;
  participantCount: number;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  createdAt: Date;
  executedAt?: Date;
  transactionHash?: string;
}

// Cross-Chain Types
export interface CrossChainBatchData {
  sourceChain: ChainId;
  targetChain: ChainId;
  batchId: string;
  totalAmount: number;
  participantCount: number;
  status: 'pending' | 'bridging' | 'executing' | 'completed' | 'failed';
  bridgeTransactionHash?: string;
  targetTransactionHash?: string;
  createdAt: Date;
  completedAt?: Date;
}

// AI Optimization Types
export interface AIOptimizationParams {
  strategyId: string;
  marketConditions: 'bull' | 'bear' | 'sideways';
  volatility: 'low' | 'medium' | 'high';
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  timeHorizon: 'short' | 'medium' | 'long';
}

export interface AIOptimizationResult {
  strategyId: string;
  recommendedPurchaseAmount: number;
  recommendedFrequency: number;
  confidence: number;
  reasoning: string;
  timestamp: Date;
}

// Gamification Types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: {
    type: 'total_invested' | 'consecutive_purchases' | 'profit_made' | 'strategies_created';
    value: number;
  };
  isUnlocked: boolean;
  unlockedAt?: Date;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

// User Types
export interface UserProfile {
  address: string;
  totalInvested: number;
  totalStrategies: number;
  activeStrategies: number;
  achievements: Achievement[];
  joinDate: Date;
  lastActive: Date;
}

export interface EncryptedUserProfile {
  address: string;
  encryptedTotalInvested: string;
  totalStrategies: number;
  activeStrategies: number;
  achievements: Achievement[];
  joinDate: Date;
  lastActive: Date;
}

// Market Data Types
export interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  timestamp: Date;
}

// Privacy Types
export interface PrivacySettings {
  kAnonymity: number; // k value for k-anonymity
  batchSize: number; // number of users per batch
  encryptionLevel: 'standard' | 'enhanced' | 'maximum';
  dataRetention: 'minimal' | 'standard' | 'extended';
}

// Error Types
export interface FheError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Contract Types
export interface ContractConfig {
  address: string;
  abi: any[];
  chainId: ChainId;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

// Event Types
export interface StrategyCreatedEvent {
  strategyId: string;
  userId: string;
  encryptedBudget: string;
  encryptedPurchaseAmount: string;
  encryptedTimeframe: string;
  encryptedFrequency: string;
  timestamp: Date;
}

export interface BatchExecutedEvent {
  batchId: string;
  totalAmount: number;
  participantCount: number;
  transactionHash: string;
  timestamp: Date;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

// FHE Math Operation Types
export type FheMathOperation = 'add' | 'sub' | 'mul' | 'div';
export type FheComparisonOperation = 'gt' | 'lt' | 'eq';

export interface FheMathResult {
  operation: FheMathOperation;
  operands: string[];
  result: string;
  timestamp: Date;
}

export interface FheComparisonResult {
  operation: FheComparisonOperation;
  operands: string[];
  result: boolean;
  timestamp: Date;
}
