import { fhevmTestnet } from '../fhevmTestnet';

describe('fhevmTestnet', () => {
  it('should have correct chain configuration', () => {
    expect(fhevmTestnet).toHaveProperty('id');
    expect(fhevmTestnet).toHaveProperty('name');
    expect(fhevmTestnet).toHaveProperty('network');
    expect(fhevmTestnet).toHaveProperty('nativeCurrency');
    expect(fhevmTestnet).toHaveProperty('rpcUrls');
    expect(fhevmTestnet).toHaveProperty('blockExplorers');
    expect(fhevmTestnet).toHaveProperty('testnet');
  });

  it('should have correct chain ID', () => {
    expect(fhevmTestnet.id).toBe(1337);
  });

  it('should have correct name', () => {
    expect(fhevmTestnet.name).toBe('FHEVM Testnet');
  });

  it('should have correct network identifier', () => {
    expect(fhevmTestnet.network).toBe('fhevm-testnet');
  });

  it('should have correct native currency configuration', () => {
    expect(fhevmTestnet.nativeCurrency).toEqual({
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH',
    });
  });

  it('should have correct RPC URLs', () => {
    expect(fhevmTestnet.rpcUrls).toEqual({
      public: { http: ['https://testnet.fhevm.zama.ai'] },
      default: { http: ['https://testnet.fhevm.zama.ai'] },
    });
  });

  it('should have correct block explorer configuration', () => {
    expect(fhevmTestnet.blockExplorers).toEqual({
      etherscan: { name: 'FHEVM Explorer', url: 'https://explorer.fhevm.zama.ai' },
      default: { name: 'FHEVM Explorer', url: 'https://explorer.fhevm.zama.ai' },
    });
  });

  it('should be marked as testnet', () => {
    expect(fhevmTestnet.testnet).toBe(true);
  });

  it('should have valid RPC URLs', () => {
    const rpcUrls = fhevmTestnet.rpcUrls;
    expect(rpcUrls.public.http[0]).toMatch(/^https?:\/\//);
    expect(rpcUrls.default.http[0]).toMatch(/^https?:\/\//);
  });

  it('should have valid block explorer URLs', () => {
    const blockExplorers = fhevmTestnet.blockExplorers;
    expect(blockExplorers.etherscan.url).toMatch(/^https?:\/\//);
    expect(blockExplorers.default.url).toMatch(/^https?:\/\//);
  });

  it('should have consistent explorer configuration', () => {
    const blockExplorers = fhevmTestnet.blockExplorers;
    expect(blockExplorers.etherscan.name).toBe(blockExplorers.default.name);
    expect(blockExplorers.etherscan.url).toBe(blockExplorers.default.url);
  });
});
