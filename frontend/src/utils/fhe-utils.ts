import { createInstance, SepoliaConfig, initSDK } from "@zama-fhe/relayer-sdk";
import { ethers } from "ethers";

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Initialize FHE Relayer SDK
export async function initFHE() {
  try {
    // Initialize SDK for bundler support
    await initSDK();
    
    // Create instance with Sepolia configuration
    const relayer = await createInstance({
      chain: SepoliaConfig,
      signer: await getSigner(),
    });
    
    return relayer;
  } catch (error) {
    console.error("Failed to initialize FHE:", error);
    throw error;
  }
}

// Get signer from wallet
async function getSigner() {
  if (!window.ethereum) {
    throw new Error("MetaMask not found");
  }
  
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  const provider = new ethers.BrowserProvider(window.ethereum);
  return await provider.getSigner();
}

// Create encrypted input for DCA strategy
export async function createDCAStrategyInput(
  contractAddress: string,
  userAddress: string,
  budget: bigint,
  purchaseAmount: bigint,
  timeframe: number,
  frequency: number
) {
  const relayer = await initFHE();
  const input = await relayer.createEncryptedInput(contractAddress, userAddress);
  input.add128(budget);        // index 0
  input.add128(purchaseAmount); // index 1
  input.add32(timeframe);      // index 2
  input.add32(frequency);      // index 3
  const { handles, inputProof } = await input.encrypt();
  return { handles, inputProof };
}

// Create encrypted input for DCA intent
export async function createDCAIntentInput(
  contractAddress: string,
  userAddress: string,
  amount: bigint
) {
  const relayer = await initFHE();
  const input = await relayer.createEncryptedInput(contractAddress, userAddress);
  input.add128(amount);        // index 0
  const { handles, inputProof } = await input.encrypt();
  return { handles, inputProof };
}

// User decryption for private data (EIP-712)
export async function userDecrypt(
  contractAddress: string,
  handle: string,
  schema: string = "uint128"
) {
  const relayer = await initFHE();
  return await relayer.userDecrypt({
    contract: contractAddress,
    handle: handle,
    schema: schema,
  });
}

// Public decryption for publicly decryptable data
export async function publicDecrypt(
  contractAddress: string,
  handle: string,
  schema: string = "uint128"
) {
  const relayer = await initFHE();
  return await relayer.publicDecrypt({
    contract: contractAddress,
    handle: handle,
    schema: schema,
  });
}

// Get user's encrypted strategy data
export async function getUserStrategy(userAddress: string) {
  const relayer = await initFHE();
  
  // This would be called after the strategy is created
  // The contract would emit events with handles for private data
  // User can then decrypt their private data
  
  return {
    // Example handles that would come from contract events
    budgetHandle: "", // Would be populated from contract events
    purchaseAmountHandle: "",
    timeframeHandle: "",
    frequencyHandle: "",
  };
}

// Get batch information (public data)
export async function getBatchInfo(contractAddress: string) {
  const relayer = await initFHE();
  
  // This would get publicly decryptable batch data
  // like total amount, user count, etc.
  
  return {
    totalAmount: 0n, // Would be populated from public decryption
    userCount: 0,
    batchId: 0,
  };
}

// Helper function to format amounts for display
export function formatAmount(amount: bigint, decimals: number = 6): string {
  const divisor = BigInt(10 ** decimals);
  const whole = amount / divisor;
  const fraction = amount % divisor;
  
  return `${whole}.${fraction.toString().padStart(decimals, '0')}`;
}

// Helper function to parse amounts from user input
export function parseAmount(amount: string, decimals: number = 6): bigint {
  const [whole, fraction = '0'] = amount.split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  
  return BigInt(whole + paddedFraction);
}
