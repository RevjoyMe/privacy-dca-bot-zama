import { renderHook, act } from '@testing-library/react';
import {
  useLocalStorage,
  useWindowSize,
  useScrollPosition,
  useOnlineStatus,
} from '../index';

// Mock wagmi hooks
jest.mock('wagmi', () => ({
  useAccount: () => ({
    address: '0x1234567890123456789012345678901234567890',
    isConnected: true,
  }),
  useContractRead: () => ({
    data: null,
    refetch: jest.fn(),
  }),
  useContractWrite: () => ({
    write: jest.fn(),
    isLoading: false,
  }),
  useWaitForTransaction: () => ({
    isLoading: false,
    isSuccess: false,
  }),
}));

// Mock Chakra UI hooks
jest.mock('@chakra-ui/react', () => ({
  useToast: () => jest.fn(),
}));

describe('Hooks', () => {
  describe('useLocalStorage', () => {
    beforeEach(() => {
      localStorage.clear();
      jest.clearAllMocks();
    });

    it('should initialize with default value', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
      expect(result.current[0]).toBe('default');
    });

    it('should read from localStorage', () => {
      localStorage.setItem('test-key', JSON.stringify('stored-value'));
      const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
      expect(result.current[0]).toBe('stored-value');
    });

    it('should update localStorage when value changes', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

      act(() => {
        result.current[1]('new-value');
      });

      expect(result.current[0]).toBe('new-value');
      expect(localStorage.getItem('test-key')).toBe(JSON.stringify('new-value'));
    });

    it('should handle function updates', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 0));

      act(() => {
        result.current[1]((prev: number) => prev + 1);
      });

      expect(result.current[0]).toBe(1);
    });

    it('should handle localStorage errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Mock localStorage to throw error
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jest.fn(() => {
            throw new Error('localStorage error');
          }),
          setItem: jest.fn(),
          removeItem: jest.fn(),
          clear: jest.fn(),
        },
        writable: true,
      });

      const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
      expect(result.current[0]).toBe('default');

      consoleSpy.mockRestore();
    });
  });

  describe('useWindowSize', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 768,
      });
    });

    it('should return current window size', () => {
      const { result } = renderHook(() => useWindowSize());
      expect(result.current).toEqual({ width: 1024, height: 768 });
    });

    it('should update on window resize', () => {
      const { result } = renderHook(() => useWindowSize());

      act(() => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 1920,
        });
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: 1080,
        });

        window.dispatchEvent(new Event('resize'));
      });

      expect(result.current).toEqual({ width: 1920, height: 1080 });
    });
  });

  describe('useScrollPosition', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'pageYOffset', {
        writable: true,
        configurable: true,
        value: 0,
      });
    });

    it('should return current scroll position', () => {
      const { result } = renderHook(() => useScrollPosition());
      expect(result.current).toBe(0);
    });

    it('should update on scroll', () => {
      const { result } = renderHook(() => useScrollPosition());

      act(() => {
        Object.defineProperty(window, 'pageYOffset', {
          writable: true,
          configurable: true,
          value: 100,
        });

        window.dispatchEvent(new Event('scroll'));
      });

      expect(result.current).toBe(100);
    });
  });

  describe('useOnlineStatus', () => {
    beforeEach(() => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        configurable: true,
        value: true,
      });
    });

    it('should return current online status', () => {
      const { result } = renderHook(() => useOnlineStatus());
      expect(result.current).toBe(true);
    });

    it('should update when going offline', () => {
      const { result } = renderHook(() => useOnlineStatus());

      act(() => {
        Object.defineProperty(navigator, 'onLine', {
          writable: true,
          configurable: true,
          value: false,
        });

        window.dispatchEvent(new Event('offline'));
      });

      expect(result.current).toBe(false);
    });

    it('should update when going online', () => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        configurable: true,
        value: false,
      });

      const { result } = renderHook(() => useOnlineStatus());

      act(() => {
        Object.defineProperty(navigator, 'onLine', {
          writable: true,
          configurable: true,
          value: true,
        });

        window.dispatchEvent(new Event('online'));
      });

      expect(result.current).toBe(true);
    });
  });
});
