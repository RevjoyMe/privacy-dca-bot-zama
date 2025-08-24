import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import App from '../App';

// Mock wagmi configuration
const mockConfig = {
  autoConnect: true,
  connectors: [],
  publicClient: {},
  webSocketPublicClient: {},
};

const mockChains = [
  {
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
  },
];

// Mock components
jest.mock('../components/DCAStrategyForm', () => ({
  DCAStrategyForm: () => <div data-testid="dca-strategy-form">DCA Strategy Form</div>,
}));

jest.mock('../components/BatchStatus', () => ({
  BatchStatus: () => <div data-testid="batch-status">Batch Status</div>,
}));

jest.mock('../components/UserDashboard', () => ({
  UserDashboard: () => <div data-testid="user-dashboard">User Dashboard</div>,
}));

jest.mock('../components/PrivacyFeatures', () => ({
  PrivacyFeatures: () => <div data-testid="privacy-features">Privacy Features</div>,
}));

jest.mock('../components/AIOptimization', () => ({
  AIOptimization: () => <div data-testid="ai-optimization">AI Optimization</div>,
}));

jest.mock('../components/CrossChainDCA', () => ({
  CrossChainDCA: () => <div data-testid="cross-chain-dca">Cross Chain DCA</div>,
}));

jest.mock('../components/Gamification', () => ({
  Gamification: () => <div data-testid="gamification">Gamification</div>,
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <WagmiConfig config={mockConfig as any}>
      <RainbowKitProvider chains={mockChains as any}>
        <ChakraProvider>
          {component}
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

describe('App', () => {
  it('renders without crashing', () => {
    renderWithProviders(<App />);
    expect(screen.getByText('🔒 Privacy DCA Bot')).toBeInTheDocument();
  });

  it('displays the main heading', () => {
    renderWithProviders(<App />);
    expect(screen.getByText('🔒 Privacy DCA Bot')).toBeInTheDocument();
    expect(screen.getByText('Dollar-Cost Averaging with Complete Privacy using FHE')).toBeInTheDocument();
  });

  it('renders all tab labels', () => {
    renderWithProviders(<App />);
    expect(screen.getByText('🏠 Dashboard')).toBeInTheDocument();
    expect(screen.getByText('🤖 AI Optimization')).toBeInTheDocument();
    expect(screen.getByText('🌐 Cross-Chain')).toBeInTheDocument();
    expect(screen.getByText('🏆 Achievements')).toBeInTheDocument();
    expect(screen.getByText('🔒 Privacy')).toBeInTheDocument();
  });

  it('renders dashboard components by default', () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId('user-dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('dca-strategy-form')).toBeInTheDocument();
    expect(screen.getByTestId('batch-status')).toBeInTheDocument();
  });

  it('has proper tab structure', () => {
    renderWithProviders(<App />);
    
    // Check that tabs are present
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(5);
    
    // Check tab content areas
    const tabPanels = screen.getAllByRole('tabpanel');
    expect(tabPanels).toHaveLength(5);
  });

  it('renders with proper styling classes', () => {
    renderWithProviders(<App />);
    
    // Check for main container
    const mainContainer = screen.getByRole('main');
    expect(mainContainer).toBeInTheDocument();
    
    // Check for header
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });
});
