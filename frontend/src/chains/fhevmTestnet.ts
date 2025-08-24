import { Chain } from 'wagmi';

export const fhevmTestnet: Chain = {
  id: 1337,
  name: 'FHEVM Testnet',
  network: 'fhevm-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://testnet.fhevm.zama.ai'] },
    default: { http: ['https://testnet.fhevm.zama.ai'] },
  },
  blockExplorers: {
    etherscan: { name: 'FHEVM Explorer', url: 'https://explorer.fhevm.zama.ai' },
    default: { name: 'FHEVM Explorer', url: 'https://explorer.fhevm.zama.ai' },
  },
  testnet: true,
};
