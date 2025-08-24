// Global type declarations for modules without TypeScript definitions
// Based on official Zama documentation: https://docs.zama.ai/fhevm

declare module 'fhevm' {
  import { ethers } from 'ethers';

  export interface FhevmInstance {
    // Core encryption/decryption methods
    encrypt32: (data: number) => string;
    decrypt32: (encryptedData: string) => number;
    encrypt64: (data: number) => string;
    decrypt64: (encryptedData: string) => number;
    
    // Mathematical operations
    add: (a: string, b: string) => string;
    sub: (a: string, b: string) => string;
    mul: (a: string, b: string) => string;
    div: (a: string, b: string) => string;
    
    // Comparison operations
    gt: (a: string, b: string) => boolean;
    lt: (a: string, b: string) => boolean;
    eq: (a: string, b: string) => boolean;
    gte: (a: string, b: string) => boolean;
    lte: (a: string, b: string) => boolean;
    
    // Utility methods
    getPublicKey: () => string;
    getChainId: () => number;
  }

  export interface FhevmConfig {
    chainId: number;
    publicKey: string;
  }

  export function getInstance(provider: ethers.providers.Provider): Promise<FhevmInstance>;
  export function getInstance(provider: ethers.providers.Provider, config: FhevmConfig): Promise<FhevmInstance>;
}

declare module '@chakra-ui/react' {
  export interface IconProps {
    boxSize?: number | string;
    color?: string;
  }
  
  export interface ToastProps {
    title: string;
    description?: string;
    status: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    isClosable?: boolean;
  }
  
  export interface ChangeEvent<T = Element> extends Event {
    target: T & { value: string; checked?: boolean };
  }
  
  export interface HTMLInputElement {
    value: string;
    checked?: boolean;
  }
  
  export interface HTMLSelectElement {
    value: string;
  }
  
  export function useToast(): (props: ToastProps) => void;
  export function useDisclosure(): { isOpen: boolean; onOpen: () => void; onClose: () => void };
  
  // All Chakra UI components
  export const Box: React.FC<any>;
  export const VStack: React.FC<any>;
  export const HStack: React.FC<any>;
  export const Text: React.FC<any>;
  export const Button: React.FC<any>;
  export const Select: React.FC<any>;
  export const Progress: React.FC<any>;
  export const Badge: React.FC<any>;
  export const Card: React.FC<any>;
  export const CardBody: React.FC<any>;
  export const CardHeader: React.FC<any>;
  export const Heading: React.FC<any>;
  export const Alert: React.FC<any>;
  export const AlertIcon: React.FC<any>;
  export const AlertTitle: React.FC<any>;
  export const AlertDescription: React.FC<any>;
  export const Divider: React.FC<any>;
  export const Stat: React.FC<any>;
  export const StatLabel: React.FC<any>;
  export const StatNumber: React.FC<any>;
  export const StatHelpText: React.FC<any>;
  export const Modal: React.FC<any>;
  export const ModalOverlay: React.FC<any>;
  export const ModalContent: React.FC<any>;
  export const ModalHeader: React.FC<any>;
  export const ModalBody: React.FC<any>;
  export const ModalCloseButton: React.FC<any>;
  export const Slider: React.FC<any>;
  export const SliderTrack: React.FC<any>;
  export const SliderFilledTrack: React.FC<any>;
  export const SliderThumb: React.FC<any>;
  export const SliderMark: React.FC<any>;
  export const FormControl: React.FC<any>;
  export const FormLabel: React.FC<any>;
  export const Switch: React.FC<any>;
  export const Input: React.FC<any>;
  export const Code: React.FC<any>;
  export const SimpleGrid: React.FC<any>;
  export const Icon: React.FC<any>;
}

declare module '@chakra-ui/icons' {
  import { IconProps } from '@chakra-ui/react';
  
  export const LockIcon: React.FC<IconProps>;
  export const ShieldIcon: React.FC<IconProps>;
  export const EyeIcon: React.FC<IconProps>;
  export const UsersIcon: React.FC<IconProps>;
  export const ChartBarIcon: React.FC<IconProps>;
  export const CogIcon: React.FC<IconProps>;
  export const CheckIcon: React.FC<IconProps>;
  export const WarningIcon: React.FC<IconProps>;
  export const InfoIcon: React.FC<IconProps>;
  export const CloseIcon: React.FC<IconProps>;
}

declare module 'react-hook-form' {
  export interface UseFormReturn<T> {
    register: (name: keyof T, options?: any) => any;
    handleSubmit: (onSubmit: (data: T) => void) => (e: any) => void;
    watch: (name?: keyof T) => any;
    formState: {
      errors: Record<keyof T, any>;
      isSubmitting: boolean;
      isValid: boolean;
    };
    reset: (values?: Partial<T>) => void;
    setValue: (name: keyof T, value: any) => void;
    getValues: () => T;
  }

  export function useForm<T = any>(config?: any): UseFormReturn<T>;
}

declare module 'wagmi' {
  import { ReactNode } from 'react';

  export interface Account {
    address: string;
    isConnected: boolean;
  }

  export interface ContractReadConfig {
    address: `0x${string}`;
    abi: any[];
    functionName: string;
    args?: any[];
    enabled?: boolean;
    watch?: boolean;
  }

  export interface ContractWriteConfig {
    address: `0x${string}`;
    abi: any[];
    functionName: string;
    enabled?: boolean;
  }

  export interface WagmiConfigProps {
    config: any;
    children: ReactNode;
  }

  export function useAccount(): Account;
  export function useProvider(): any;
  export function useContractWrite(config: ContractWriteConfig): {
    data?: { hash: string };
    write: ((args?: any) => Promise<any>) | undefined;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: Error | null;
  };
  export function usePrepareContractWrite(config: ContractWriteConfig): {
    config: any;
    error: Error | null;
  };
  export function useContractRead(config: ContractReadConfig): {
    data: any;
    refetch: () => void;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
  };
  export function useWaitForTransaction(config: any): {
    data: any;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
  };
  export function WagmiConfig(props: WagmiConfigProps): JSX.Element;
  export function createConfig(config: any): any;
  export function configureChains(chains: any[], providers: any[]): any;
  export function publicProvider(): any;
}

declare module '@rainbow-me/rainbowkit' {
  import { ReactNode } from 'react';

  export interface RainbowKitProviderProps {
    chains: any[];
    children: ReactNode;
  }

  export interface GetDefaultWalletsConfig {
    appName: string;
    projectId: string;
    chains: any[];
  }

  export function getDefaultWallets(config: GetDefaultWalletsConfig): { connectors: any[] };
  export function RainbowKitProvider(props: RainbowKitProviderProps): JSX.Element;
  export function ConnectButton(): JSX.Element;
}

declare module 'ethers' {
  export namespace providers {
    export interface Provider {
      getNetwork(): Promise<any>;
      getBlockNumber(): Promise<number>;
      getBalance(address: string): Promise<any>;
    }
  }

  export interface Contract {
    address: string;
    interface: any;
    provider: providers.Provider;
    signer?: any;
  }

  export function ethers(): any;
  export function Contract(address: string, abi: any[], signerOrProvider?: any): Contract;
}

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
  
  export interface FC<P = {}> {
    (props: P & { children?: ReactNode }): ReactElement | null;
  }
  
  export interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }
  
  export interface ReactNode {}
  export type Key = string | number;
  export type JSXElementConstructor<P> = ((props: P) => ReactElement<any, any> | null) | (new (props: P) => Component<P, any>);
  export class Component<P = {}, S = {}> {}
  
  export function useState<S>(initialState: S | (() => S)): [S, (value: S | ((prev: S) => S)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
}

// Environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_FHEVM_RPC_URL: string;
    REACT_APP_CONTRACT_ADDRESS: string;
    REACT_APP_WALLET_CONNECT_PROJECT_ID: string;
    REACT_APP_OPENAI_API_KEY: string;
    REACT_APP_GEMINI_API_KEY: string;
    REACT_APP_GROK_API_KEY: string;
    REACT_APP_CLAUDE_API_KEY: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}

// Global React types
declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: any;
      span: any;
      button: any;
      input: any;
      select: any;
      option: any;
      form: any;
      label: any;
      h1: any;
      h2: any;
      h3: any;
      h4: any;
      h5: any;
      h6: any;
      p: any;
      a: any;
      img: any;
      ul: any;
      ol: any;
      li: any;
      table: any;
      tr: any;
      td: any;
      th: any;
      thead: any;
      tbody: any;
      tfoot: any;
      section: any;
      article: any;
      header: any;
      footer: any;
      nav: any;
      main: any;
      aside: any;
      figure: any;
      figcaption: any;
      [elemName: string]: any;
    }
    interface Element extends React.ReactElement<any, any> { }
    interface ElementClass extends React.Component<any> {
      render(): React.ReactNode;
    }
    interface ElementAttributesProperty { props: {}; }
    interface ElementChildrenAttribute { children: {}; }
  }
  
  // React types
  namespace React {
    interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
      type: T;
      props: P;
      key: Key | null;
    }
    
    interface ReactNode {}
    type Key = string | number;
    type JSXElementConstructor<P> = ((props: P) => ReactElement<any, any> | null) | (new (props: P) => Component<P, any>);
    
    interface FC<P = {}> {
      (props: P & { children?: ReactNode }): ReactElement | null;
    }
    
    class Component<P = {}, S = {}> {
      props: P;
      state: S;
      render(): ReactNode;
    }
  }
}
