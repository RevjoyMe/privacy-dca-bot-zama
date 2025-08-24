import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { DCAStrategyForm } from '../DCAStrategyForm';

// Mock wagmi hooks
jest.mock('wagmi', () => ({
  useAccount: () => ({
    address: '0x1234567890123456789012345678901234567890',
    isConnected: true,
  }),
  useContractWrite: () => ({
    write: jest.fn(),
    isLoading: false,
  }),
  usePrepareContractWrite: () => ({
    config: {},
  }),
}));

// Mock react-hook-form
jest.mock('react-hook-form', () => ({
  useForm: () => ({
    register: jest.fn(),
    handleSubmit: (fn: any) => fn,
    watch: jest.fn(() => ({
      budget: '1000',
      purchaseAmount: '100',
      timeframe: '24',
      frequency: '6',
    })),
    formState: { errors: {} },
    reset: jest.fn(),
  }),
}));

const renderWithChakra = (component: React.ReactElement) => {
  return render(<ChakraProvider>{component}</ChakraProvider>);
};

describe('DCAStrategyForm', () => {
  it('renders without crashing', () => {
    renderWithChakra(<DCAStrategyForm />);
    expect(screen.getByText('Create DCA Strategy')).toBeInTheDocument();
  });

  it('shows wallet connection message when not connected', () => {
    jest.doMock('wagmi', () => ({
      useAccount: () => ({
        address: null,
        isConnected: false,
      }),
      useContractWrite: () => ({
        write: jest.fn(),
        isLoading: false,
      }),
      usePrepareContractWrite: () => ({
        config: {},
      }),
    }));

    renderWithChakra(<DCAStrategyForm />);
    expect(screen.getByText('Please connect your wallet to create a DCA strategy')).toBeInTheDocument();
  });

  it('displays form fields when connected', () => {
    renderWithChakra(<DCAStrategyForm />);
    expect(screen.getByText('Budget (USDC)')).toBeInTheDocument();
    expect(screen.getByText('Purchase Amount (USDC)')).toBeInTheDocument();
    expect(screen.getByText('Timeframe (hours)')).toBeInTheDocument();
    expect(screen.getByText('Frequency (hours)')).toBeInTheDocument();
  });

  it('shows strategy summary when form is filled', () => {
    renderWithChakra(<DCAStrategyForm />);
    expect(screen.getByText('Strategy Summary:')).toBeInTheDocument();
  });

  it('has create strategy button', () => {
    renderWithChakra(<DCAStrategyForm />);
    expect(screen.getByText('Create Strategy')).toBeInTheDocument();
  });
});
