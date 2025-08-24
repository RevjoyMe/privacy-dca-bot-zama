import { ChainId } from '../types';

// FHE Configuration based on Zama documentation
export const FHE_CONFIG = {
  // FHEVM Network Configuration
  FHEVM_TESTNET: {
    chainId: ChainId.FHEVM_TESTNET,
    name: 'FHEVM Testnet',
    rpcUrl: 'https://testnet.fhevm.zama.ai',
    explorer: 'https://explorer.fhevm.zama.ai',
    currency: 'ETH',
    decimals: 18,
  },
  
  // FHE Encryption Settings
  ENCRYPTION: {
    PRECISION_MULTIPLIER: 100, // Multiply by 100 for 2 decimal precision
    MAX_VALUE: 999999999, // Maximum value that can be encrypted
    MIN_VALUE: 0, // Minimum value that can be encrypted
    DEFAULT_PRECISION: 32, // Default precision for encryption
  },
  
  // FHE Math Operations
  MATH_OPERATIONS: {
    ADD: 'add',
    SUBTRACT: 'sub',
    MULTIPLY: 'mul',
    DIVIDE: 'div',
  },
  
  // FHE Comparison Operations
  COMPARISON_OPERATIONS: {
    GREATER_THAN: 'gt',
    LESS_THAN: 'lt',
    EQUAL: 'eq',
    GREATER_THAN_EQUAL: 'gte',
    LESS_THAN_EQUAL: 'lte',
  },
  
  // Privacy Settings
  PRIVACY: {
    K_ANONYMITY: 10, // k value for k-anonymity
    BATCH_SIZE: 10, // Number of users per batch
    ENCRYPTION_LEVEL: 'enhanced', // standard, enhanced, maximum
    DATA_RETENTION: 'minimal', // minimal, standard, extended
  },
} as const;

// Contract Addresses for FHEVM Testnet
export const CONTRACT_ADDRESSES = {
  DCA_BOT: '0x1234567890123456789012345678901234567890', // Replace with actual deployed contract address
  ACHIEVEMENT_NFT: '0x0987654321098765432109876543210987654321', // Replace with actual NFT contract address
  USDC: '0x1111111111111111111111111111111111111111', // Replace with actual USDC address on FHEVM testnet
  WETH: '0x2222222222222222222222222222222222222222', // Replace with actual WETH address on FHEVM testnet
} as const;

// Contract ABIs (simplified - replace with actual ABIs)
export const CONTRACT_ABIS = {
  DCA_BOT: [
    {
      inputs: [
        { name: 'encryptedBudget', type: 'bytes' },
        { name: 'encryptedPurchaseAmount', type: 'bytes' },
        { name: 'encryptedTimeframe', type: 'bytes' },
        { name: 'encryptedFrequency', type: 'bytes' },
      ],
      name: 'createStrategy',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ name: 'strategyId', type: 'uint256' }],
      name: 'getStrategy',
      outputs: [
        { name: 'encryptedBudget', type: 'bytes' },
        { name: 'encryptedPurchaseAmount', type: 'bytes' },
        { name: 'encryptedTimeframe', type: 'bytes' },
        { name: 'encryptedFrequency', type: 'bytes' },
        { name: 'isActive', type: 'bool' },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ name: 'strategyId', type: 'uint256' }],
      name: 'withdrawShares',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ name: 'user', type: 'address' }],
      name: 'getUserStrategy',
      outputs: [
        { name: 'budget', type: 'uint256' },
        { name: 'purchaseAmount', type: 'uint256' },
        { name: 'timeframe', type: 'uint32' },
        { name: 'frequency', type: 'uint32' },
        { name: 'lastPurchaseTime', type: 'uint32' },
        { name: 'purchasesMade', type: 'uint32' },
        { name: 'remainingBudget', type: 'uint256' },
        { name: 'isActive', type: 'bool' },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'emergencyWithdraw',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
  
  ACHIEVEMENT_NFT: [
    {
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'achievementId', type: 'uint256' },
        { name: 'metadata', type: 'string' },
      ],
      name: 'mintAchievement',
      outputs: [{ name: 'tokenId', type: 'uint256' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ name: 'tokenId', type: 'uint256' }],
      name: 'tokenURI',
      outputs: [{ name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ name: 'user', type: 'address' }],
      name: 'getUserAchievements',
      outputs: [{ name: 'achievements', type: 'uint256[]' }],
      stateMutability: 'view',
      type: 'function',
    },
  ],
} as const;

// DCA Strategy Defaults
export const DCA_DEFAULTS = {
  MIN_BUDGET: 10, // Minimum budget in USDC
  MAX_BUDGET: 1000000, // Maximum budget in USDC
  MIN_PURCHASE_AMOUNT: 1, // Minimum purchase amount in USDC
  MAX_PURCHASE_AMOUNT: 100000, // Maximum purchase amount in USDC
  MIN_TIMEFRAME: 1, // Minimum timeframe in hours
  MAX_TIMEFRAME: 8760, // Maximum timeframe in hours (1 year)
  MIN_FREQUENCY: 1, // Minimum frequency in hours
  MAX_FREQUENCY: 168, // Maximum frequency in hours (1 week)
  
  // Default strategy values
  DEFAULT_BUDGET: 1000,
  DEFAULT_PURCHASE_AMOUNT: 100,
  DEFAULT_TIMEFRAME: 720, // 1 month
  DEFAULT_FREQUENCY: 24, // 24 hours
} as const;

// Timeframe Options
export const TIMEFRAME_OPTIONS = [
  { value: '24', label: '24 hours' },
  { value: '168', label: '1 week' },
  { value: '720', label: '1 month' },
  { value: '2160', label: '3 months' },
  { value: '4320', label: '6 months' },
  { value: '8760', label: '1 year' },
] as const;

// Frequency Options
export const FREQUENCY_OPTIONS = [
  { value: '1', label: '1 hour' },
  { value: '6', label: '6 hours' },
  { value: '12', label: '12 hours' },
  { value: '24', label: '24 hours' },
  { value: '48', label: '48 hours' },
  { value: '168', label: '1 week' },
] as const;

// AI Providers
export const AI_PROVIDERS = {
  OPENAI: {
    name: 'ChatGPT',
    apiKey: typeof process !== 'undefined' ? process.env.REACT_APP_OPENAI_API_KEY : '',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4',
  },
  GEMINI: {
    name: 'Gemini',
    apiKey: typeof process !== 'undefined' ? process.env.REACT_APP_GEMINI_API_KEY : '',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    model: 'gemini-pro',
  },
  GROK: {
    name: 'Grok',
    apiKey: typeof process !== 'undefined' ? process.env.REACT_APP_GROK_API_KEY : '',
    endpoint: 'https://api.x.ai/v1/chat/completions',
    model: 'grok-beta',
  },
  CLAUDE: {
    name: 'Claude',
    apiKey: typeof process !== 'undefined' ? process.env.REACT_APP_CLAUDE_API_KEY : '',
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-sonnet-20240229',
  },
} as const;

// Achievement Definitions
export const ACHIEVEMENTS = {
  FIRST_STRATEGY: {
    id: 'first_strategy',
    name: 'First Steps',
    description: 'Created your first DCA strategy',
    icon: '🚀',
    criteria: { type: 'strategies_created', value: 1 },
  },
  CONSISTENT_INVESTOR: {
    id: 'consistent_investor',
    name: 'Consistent Investor',
    description: 'Maintained a strategy for 30 consecutive days',
    icon: '📈',
    criteria: { type: 'consecutive_purchases', value: 30 },
  },
  AI_OPTIMIZER: {
    id: 'ai_optimizer',
    name: 'AI Optimizer',
    description: 'Used AI to optimize your strategy',
    icon: '🤖',
    criteria: { type: 'strategies_created', value: 5 },
  },
  CROSS_CHAIN_EXPLORER: {
    id: 'cross_chain_explorer',
    name: 'Cross-Chain Explorer',
    description: 'Used DCA across multiple chains',
    icon: '🌐',
    criteria: { type: 'strategies_created', value: 3 },
  },
  PRIVACY_CHAMPION: {
    id: 'privacy_champion',
    name: 'Privacy Champion',
    description: 'Used maximum privacy settings',
    icon: '🔒',
    criteria: { type: 'total_invested', value: 1000 },
  },
  BATCH_MASTER: {
    id: 'batch_master',
    name: 'Batch Master',
    description: 'Participated in 100 batched transactions',
    icon: '📦',
    criteria: { type: 'consecutive_purchases', value: 100 },
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  FHE_INITIALIZATION_FAILED: 'Failed to initialize FHE encryption',
  ENCRYPTION_FAILED: 'Failed to encrypt data',
  DECRYPTION_FAILED: 'Failed to decrypt data',
  INVALID_STRATEGY: 'Invalid strategy parameters',
  WALLET_NOT_CONNECTED: 'Please connect your wallet',
  INSUFFICIENT_BALANCE: 'Insufficient balance',
  NETWORK_ERROR: 'Network error occurred',
  CONTRACT_ERROR: 'Contract interaction failed',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  STRATEGY_CREATED: 'Strategy created successfully',
  DATA_ENCRYPTED: 'Data encrypted successfully',
  DATA_DECRYPTED: 'Data decrypted successfully',
  TRANSACTION_COMPLETED: 'Transaction completed successfully',
  ACHIEVEMENT_UNLOCKED: 'Achievement unlocked!',
} as const;

// UI Constants
export const UI_CONSTANTS = {
  TOAST_DURATION: 5000,
  LOADING_TIMEOUT: 30000,
  MAX_RETRIES: 3,
  REFRESH_INTERVAL: 30000, // 30 seconds
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  MARKET_DATA: '/api/market-data',
  USER_PROFILE: '/api/user-profile',
  STRATEGIES: '/api/strategies',
  BATCHES: '/api/batches',
  ACHIEVEMENTS: '/api/achievements',
  AI_OPTIMIZATION: '/api/ai-optimization',
} as const;

// Zama FHE Documentation Links
export const ZAMA_LINKS = {
  HOMEPAGE: 'https://docs.zama.ai/homepage/',
  FHEVM_GITHUB: 'https://github.com/zama-ai/fhevm',
  TFHE_RS_DOCS: 'https://docs.zama.ai/tfhe-rs',
  CONCRETE_DOCS: 'https://docs.zama.ai/concrete',
  CONCRETE_ML_DOCS: 'https://docs.zama.ai/concrete-ml',
  FHEVM_DOCS: 'https://docs.zama.ai/fhevm',
  BLOG: 'https://www.zama.ai/blog',
  TUTORIALS: 'https://docs.zama.ai/tutorials',
  DISCORD: 'https://discord.gg/zama',
} as const;
