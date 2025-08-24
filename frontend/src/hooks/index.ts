import { useState, useEffect, useCallback } from 'react';
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction, useProvider } from 'wagmi';
import { useToast } from '@chakra-ui/react';
import { ChainId, BatchData, CrossChainBatchData } from '../types';
import { CONTRACT_ADDRESSES } from '../constants';
import { FhevmInstance, getInstance, FhevmConfig } from 'fhevm';
import { ethers } from 'ethers';

// Hook for managing contract interactions
export const useContractInteraction = () => {
  const { address } = useAccount();
  const toast = useToast();

  const { data: batchData, refetch: refetchBatches } = useContractRead({
    address: CONTRACT_ADDRESSES.DCA_BOT as `0x${string}`,
    abi: [], // Replace with actual ABI
    functionName: 'getBatches',
    args: [address as `0x${string}`],
    enabled: !!address,
    watch: true,
  });

  const { write: createBatch, isLoading: isCreatingBatch } = useContractWrite({
    address: CONTRACT_ADDRESSES.DCA_BOT as `0x${string}`,
    abi: [], // Replace with actual ABI
    functionName: 'createBatch',
  });

  const { write: executeBatch, isLoading: isExecutingBatch } = useContractWrite({
    address: CONTRACT_ADDRESSES.DCA_BOT as `0x${string}`,
    abi: [], // Replace with actual ABI
    functionName: 'executeBatch',
  });

  return {
    batchData,
    refetchBatches,
    createBatch,
    isCreatingBatch,
    executeBatch,
    isExecutingBatch,
  };
};

// Hook for managing cross-chain operations
export const useCrossChainOperations = () => {
  const { address } = useAccount();
  const toast = useToast();

  const { data: crossChainData, refetch: refetchCrossChain } = useContractRead({
    address: CONTRACT_ADDRESSES.DCA_BOT as `0x${string}`,
    abi: [], // Replace with actual ABI
    functionName: 'getCrossChainBatches',
    args: [address as `0x${string}`],
    enabled: !!address,
    watch: true,
  });

  const { write: bridgeBatch, isLoading: isBridging } = useContractWrite({
    address: CONTRACT_ADDRESSES.DCA_BOT as `0x${string}`,
    abi: [], // Replace with actual ABI
    functionName: 'bridgeBatch',
  });

  return {
    crossChainData,
    refetchCrossChain,
    bridgeBatch,
    isBridging,
  };
};

// Hook for managing AI optimization
export const useAIOptimization = () => {
  const { address } = useAccount();
  const toast = useToast();

  const { data: aiRecommendations, refetch: refetchAI } = useContractRead({
    address: CONTRACT_ADDRESSES.DCA_BOT as `0x${string}`,
    abi: [], // Replace with actual ABI
    functionName: 'getAIRecommendations',
    args: [address as `0x${string}`],
    enabled: !!address,
    watch: true,
  });

  const { write: applyAIRecommendation, isLoading: isApplyingAI } = useContractWrite({
    address: CONTRACT_ADDRESSES.DCA_BOT as `0x${string}`,
    abi: [], // Replace with actual ABI
    functionName: 'applyAIRecommendation',
  });

  return {
    aiRecommendations,
    refetchAI,
    applyAIRecommendation,
    isApplyingAI,
  };
};

// Hook for managing gamification and achievements
export const useGamification = () => {
  const { address } = useAccount();
  const toast = useToast();

  const { data: achievements, refetch: refetchAchievements } = useContractRead({
    address: CONTRACT_ADDRESSES.ACHIEVEMENT_NFT as `0x${string}`,
    abi: [], // Replace with actual ABI
    functionName: 'getUserAchievements',
    args: [address as `0x${string}`],
    enabled: !!address,
    watch: true,
  });

  const { write: mintAchievement, isLoading: isMintingAchievement } = useContractWrite({
    address: CONTRACT_ADDRESSES.ACHIEVEMENT_NFT as `0x${string}`,
    abi: [], // Replace with actual ABI
    functionName: 'mintAchievement',
  });

  return {
    achievements,
    refetchAchievements,
    mintAchievement,
    isMintingAchievement,
  };
};

// Hook for managing network connectivity
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

// FHEVM Hook based on official Zama documentation
export const useFhevm = () => {
  const { isConnected } = useAccount();
  const provider = useProvider();
  const [fhevmInstance, setFhevmInstance] = useState<FhevmInstance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initFhevm = async () => {
      if (provider && isConnected) {
        setIsLoading(true);
        setError(null);
        try {
          // Initialize FHEVM with provider
          const instance = await getInstance(provider);
          setFhevmInstance(instance);
        } catch (err) {
          console.error('Failed to initialize FHEVM:', err);
          setError('Failed to initialize FHE encryption');
        } finally {
          setIsLoading(false);
        }
      } else {
        setFhevmInstance(null);
      }
    };

    initFhevm();
  }, [provider, isConnected]);

  return {
    fhevmInstance,
    isLoading,
    error,
    isConnected,
  };
};

// FHE Encryption Hook with full Zama functionality
export const useFheEncryption = () => {
  const { fhevmInstance, isLoading, error } = useFhevm();

  const encrypt = async (data: number, precision: 32 | 64 = 32): Promise<string> => {
    if (!fhevmInstance) {
      throw new Error('FHEVM not initialized');
    }
    
    try {
      const encrypted = precision === 32 
        ? fhevmInstance.encrypt32(data)
        : fhevmInstance.encrypt64(data);
      return encrypted;
    } catch (err) {
      console.error('Encryption error:', err);
      throw new Error('Failed to encrypt data');
    }
  };

  const decrypt = async (encryptedData: string, precision: 32 | 64 = 32): Promise<number> => {
    if (!fhevmInstance) {
      throw new Error('FHEVM not initialized');
    }
    
    try {
      const decrypted = precision === 32 
        ? fhevmInstance.decrypt32(encryptedData)
        : fhevmInstance.decrypt64(encryptedData);
      return decrypted;
    } catch (err) {
      console.error('Decryption error:', err);
      throw new Error('Failed to decrypt data');
    }
  };

  const fheAdd = (a: string, b: string): string => {
    if (!fhevmInstance) {
      throw new Error('FHEVM not initialized');
    }
    
    try {
      return fhevmInstance.add(a, b);
    } catch (err) {
      console.error('FHE addition error:', err);
      throw new Error('Failed to perform FHE addition');
    }
  };

  const fheSub = (a: string, b: string): string => {
    if (!fhevmInstance) {
      throw new Error('FHEVM not initialized');
    }
    
    try {
      return fhevmInstance.sub(a, b);
    } catch (err) {
      console.error('FHE subtraction error:', err);
      throw new Error('Failed to perform FHE subtraction');
    }
  };

  const fheMul = (a: string, b: string): string => {
    if (!fhevmInstance) {
      throw new Error('FHEVM not initialized');
    }
    
    try {
      return fhevmInstance.mul(a, b);
    } catch (err) {
      console.error('FHE multiplication error:', err);
      throw new Error('Failed to perform FHE multiplication');
    }
  };

  const fheDiv = (a: string, b: string): string => {
    if (!fhevmInstance) {
      throw new Error('FHEVM not initialized');
    }
    
    try {
      return fhevmInstance.div(a, b);
    } catch (err) {
      console.error('FHE division error:', err);
      throw new Error('Failed to perform FHE division');
    }
  };

  const fheGt = (a: string, b: string): boolean => {
    if (!fhevmInstance) {
      throw new Error('FHEVM not initialized');
    }
    
    try {
      return fhevmInstance.gt(a, b);
    } catch (err) {
      console.error('FHE greater than error:', err);
      throw new Error('Failed to perform FHE comparison');
    }
  };

  const fheLt = (a: string, b: string): boolean => {
    if (!fhevmInstance) {
      throw new Error('FHEVM not initialized');
    }
    
    try {
      return fhevmInstance.lt(a, b);
    } catch (err) {
      console.error('FHE less than error:', err);
      throw new Error('Failed to perform FHE comparison');
    }
  };

  const fheEq = (a: string, b: string): boolean => {
    if (!fhevmInstance) {
      throw new Error('FHEVM not initialized');
    }
    
    try {
      return fhevmInstance.eq(a, b);
    } catch (err) {
      console.error('FHE equality error:', err);
      throw new Error('Failed to perform FHE comparison');
    }
  };

  const fheGte = (a: string, b: string): boolean => {
    if (!fhevmInstance) {
      throw new Error('FHEVM not initialized');
    }
    
    try {
      return fhevmInstance.gte(a, b);
    } catch (err) {
      console.error('FHE greater than or equal error:', err);
      throw new Error('Failed to perform FHE comparison');
    }
  };

  const fheLte = (a: string, b: string): boolean => {
    if (!fhevmInstance) {
      throw new Error('FHEVM not initialized');
    }
    
    try {
      return fhevmInstance.lte(a, b);
    } catch (err) {
      console.error('FHE less than or equal error:', err);
      throw new Error('Failed to perform FHE comparison');
    }
  };

  const getPublicKey = (): string => {
    if (!fhevmInstance) {
      throw new Error('FHEVM not initialized');
    }
    return fhevmInstance.getPublicKey();
  };

  const getChainId = (): number => {
    if (!fhevmInstance) {
      throw new Error('FHEVM not initialized');
    }
    return fhevmInstance.getChainId();
  };

  return {
    encrypt,
    decrypt,
    fheAdd,
    fheSub,
    fheMul,
    fheDiv,
    fheGt,
    fheLt,
    fheEq,
    fheGte,
    fheLte,
    getPublicKey,
    getChainId,
    isLoading,
    error,
    isInitialized: !!fhevmInstance,
  };
};

// Enhanced DCA Strategy Hook with FHE
export const useDCAStrategy = () => {
  const { 
    encrypt, 
    fheAdd, 
    fheMul, 
    fheDiv, 
    fheSub,
    fheGt,
    fheLt,
    isLoading, 
    error, 
    isInitialized 
  } = useFheEncryption();

  const createEncryptedStrategy = async (
    budget: number,
    purchaseAmount: number,
    timeframe: number,
    frequency: number
  ) => {
    if (!isInitialized) {
      throw new Error('FHE not initialized');
    }

    try {
      // Encrypt all parameters with 32-bit precision for efficiency
      const encryptedBudget = await encrypt(budget * 100); // Multiply by 100 for precision
      const encryptedPurchaseAmount = await encrypt(purchaseAmount * 100);
      const encryptedTimeframe = await encrypt(timeframe);
      const encryptedFrequency = await encrypt(frequency);

      // Calculate total purchases using FHE
      const encryptedTotalPurchases = fheDiv(encryptedTimeframe, encryptedFrequency);
      
      // Calculate total investment using FHE
      const encryptedTotalInvestment = fheMul(encryptedTotalPurchases, encryptedPurchaseAmount);
      
      // Calculate remaining budget using FHE
      const encryptedRemainingBudget = fheSub(encryptedBudget, encryptedTotalInvestment);

      // Validate budget using FHE comparison
      const isOverBudget = fheLt(encryptedRemainingBudget, await encrypt(0));

      return {
        encryptedBudget,
        encryptedPurchaseAmount,
        encryptedTimeframe,
        encryptedFrequency,
        encryptedTotalPurchases,
        encryptedTotalInvestment,
        encryptedRemainingBudget,
        isOverBudget,
      };
    } catch (err) {
      console.error('Error creating encrypted strategy:', err);
      throw new Error('Failed to create encrypted strategy');
    }
  };

  const validateStrategy = async (
    encryptedBudget: string,
    encryptedPurchaseAmount: string,
    encryptedTimeframe: string,
    encryptedFrequency: string
  ) => {
    if (!isInitialized) {
      throw new Error('FHE not initialized');
    }

    try {
      // Calculate total purchases
      const encryptedTotalPurchases = fheDiv(encryptedTimeframe, encryptedFrequency);
      
      // Calculate total investment
      const encryptedTotalInvestment = fheMul(encryptedTotalPurchases, encryptedPurchaseAmount);
      
      // Check if budget is sufficient
      const isOverBudget = fheLt(encryptedTotalInvestment, encryptedBudget);
      
      return {
        isValid: !isOverBudget,
        encryptedTotalPurchases,
        encryptedTotalInvestment,
      };
    } catch (err) {
      console.error('Error validating strategy:', err);
      throw new Error('Failed to validate strategy');
    }
  };

  return {
    createEncryptedStrategy,
    validateStrategy,
    isLoading,
    error,
    isInitialized,
  };
};

// Hook for managing NFT operations
export const useNFTOperations = () => {
  const toast = useToast();

  const { write: mintNFT, isLoading: isMinting } = useContractWrite({
    address: CONTRACT_ADDRESSES.ACHIEVEMENT_NFT as `0x${string}`,
    abi: [], // Replace with actual ABI
    functionName: 'mint',
  });

  const { write: togglePrivacy, isLoading: isToggling } = useContractWrite({
    address: CONTRACT_ADDRESSES.ACHIEVEMENT_NFT as `0x${string}`,
    abi: [], // Replace with actual ABI
    functionName: 'togglePrivacy',
  });

  return {
    mintNFT,
    isMinting,
    togglePrivacy,
    isToggling,
  };
};

// Hook for managing privacy settings
export const usePrivacySettings = () => {
  const { address } = useAccount();
  const toast = useToast();

  const { data: privacyData, refetch } = useContractRead({
    address: CONTRACT_ADDRESSES.DCA_BOT as `0x${string}`,
    abi: [], // Replace with actual ABI
    functionName: 'getUserPrivacyLevel',
    args: [address as `0x${string}`],
    enabled: !!address,
    watch: true,
  });

  const { write: updatePrivacyLevel, isLoading: isUpdating } = useContractWrite({
    address: CONTRACT_ADDRESSES.DCA_BOT as `0x${string}`,
    abi: [], // Replace with actual ABI
    functionName: 'updatePrivacyLevel',
  });

  return {
    privacyData,
    refetch,
    updatePrivacyLevel,
    isUpdating,
  };
};

// Hook for managing achievements
export const useAchievements = () => {
  const { address } = useAccount();
  const toast = useToast();

  const { data: achievementsData, refetch } = useContractRead({
    address: CONTRACT_ADDRESSES.DCA_BOT as `0x${string}`,
    abi: [], // Replace with actual ABI
    functionName: 'getUserAchievements',
    args: [address as `0x${string}`],
    enabled: !!address,
    watch: true,
  });

  return {
    achievementsData,
    refetch,
  };
};

// Hook for managing local storage
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
};

// Hook for managing window size
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Hook for managing scroll position
export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.pageYOffset);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollPosition;
};
