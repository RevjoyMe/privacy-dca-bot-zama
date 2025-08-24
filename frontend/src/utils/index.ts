import { ChainId } from '../types';
import { FhevmInstance, getInstance } from 'fhevm';
import { ethers } from 'ethers';

// Format currency
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Format percentage
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

// Format large numbers
export const formatLargeNumber = (num: number): string => {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + 'B';
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M';
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + 'K';
  }
  return num.toString();
};

// Format time ago
export const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
};

// Truncate address
export const truncateAddress = (address: string, length: number = 6): string => {
  if (!address) return '';
  return `${address.slice(0, length)}...${address.slice(-length)}`;
};

// Validate Ethereum address
export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Get chain name by ID
export const getChainName = (chainId: ChainId): string => {
  const chainNames: Record<ChainId, string> = {
    [ChainId.ETHEREUM]: 'Ethereum',
    [ChainId.POLYGON]: 'Polygon',
    [ChainId.ARBITRUM]: 'Arbitrum',
    [ChainId.OPTIMISM]: 'Optimism',
    [ChainId.BASE]: 'Base',
    [ChainId.BSC]: 'BSC'
  };
  return chainNames[chainId] || 'Unknown';
};

// Calculate gas estimate for multiple chains
export const calculateTotalGas = (chainIds: ChainId[]): number => {
  const gasEstimates: Record<ChainId, number> = {
    [ChainId.ETHEREUM]: 0.005,
    [ChainId.POLYGON]: 0.001,
    [ChainId.ARBITRUM]: 0.002,
    [ChainId.OPTIMISM]: 0.001,
    [ChainId.BASE]: 0.001,
    [ChainId.BSC]: 0.001
  };
  
  return chainIds.reduce((total, chainId) => {
    return total + (gasEstimates[chainId] || 0);
  }, 0);
};

// Generate random ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Copy to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};

// Sleep function
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Retry function
export const retry = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await sleep(delay);
      return retry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get color by rarity
export const getRarityColor = (rarity: string): string => {
  const colors: Record<string, string> = {
    common: 'gray',
    rare: 'blue',
    epic: 'purple',
    legendary: 'orange'
  };
  return colors[rarity] || 'gray';
};

// Calculate achievement progress
export const calculateProgress = (current: number, target: number): number => {
  return Math.min((current / target) * 100, 100);
};

// FHE Encryption utilities
export const encryptData = async (instance: FhevmInstance, data: number): Promise<string> => {
  try {
    const encrypted = instance.encrypt32(data);
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

export const decryptData = async (instance: FhevmInstance, encryptedData: string): Promise<number> => {
  try {
    const decrypted = instance.decrypt32(encryptedData);
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

// Initialize FHEVM instance
export const initializeFhevm = async (provider: ethers.providers.Provider): Promise<FhevmInstance> => {
  try {
    const instance = await getInstance(provider);
    return instance;
  } catch (error) {
    console.error('Failed to initialize FHEVM:', error);
    throw new Error('Failed to initialize FHE encryption');
  }
};

// FHE Math operations
export const fheAdd = (instance: FhevmInstance, a: string, b: string): string => {
  try {
    return instance.add(a, b);
  } catch (error) {
    console.error('FHE addition error:', error);
    throw new Error('Failed to perform FHE addition');
  }
};

export const fheSub = (instance: FhevmInstance, a: string, b: string): string => {
  try {
    return instance.sub(a, b);
  } catch (error) {
    console.error('FHE subtraction error:', error);
    throw new Error('Failed to perform FHE subtraction');
  }
};

export const fheMul = (instance: FhevmInstance, a: string, b: string): string => {
  try {
    return instance.mul(a, b);
  } catch (error) {
    console.error('FHE multiplication error:', error);
    throw new Error('Failed to perform FHE multiplication');
  }
};

export const fheDiv = (instance: FhevmInstance, a: string, b: string): string => {
  try {
    return instance.div(a, b);
  } catch (error) {
    console.error('FHE division error:', error);
    throw new Error('Failed to perform FHE division');
  }
};

// FHE Comparison operations
export const fheGt = (instance: FhevmInstance, a: string, b: string): boolean => {
  try {
    return instance.gt(a, b);
  } catch (error) {
    console.error('FHE greater than error:', error);
    throw new Error('Failed to perform FHE comparison');
  }
};

export const fheLt = (instance: FhevmInstance, a: string, b: string): boolean => {
  try {
    return instance.lt(a, b);
  } catch (error) {
    console.error('FHE less than error:', error);
    throw new Error('Failed to perform FHE comparison');
  }
};

export const fheEq = (instance: FhevmInstance, a: string, b: string): boolean => {
  try {
    return instance.eq(a, b);
  } catch (error) {
    console.error('FHE equality error:', error);
    throw new Error('Failed to perform FHE comparison');
  }
};

// Utility functions for DCA calculations
export const calculateDCAParameters = (
  budget: number,
  purchaseAmount: number,
  timeframe: number,
  frequency: number
) => {
  const totalPurchases = Math.floor(timeframe / frequency);
  const totalInvestment = totalPurchases * purchaseAmount;
  const remainingBudget = budget - totalInvestment;

  return {
    totalPurchases,
    totalInvestment,
    remainingBudget,
    isOverBudget: remainingBudget < 0,
  };
};

// Format encrypted data for display
export const formatEncryptedData = (encryptedData: string): string => {
  return `${encryptedData.substring(0, 10)}...${encryptedData.substring(encryptedData.length - 8)}`;
};

// Validate FHE parameters
export const validateFHEParameters = (data: any): boolean => {
  return data && typeof data === 'object' && 'encrypted' in data;
};
