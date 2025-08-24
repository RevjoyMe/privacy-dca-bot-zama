import {
  formatCurrency,
  formatPercentage,
  formatLargeNumber,
  formatTimeAgo,
  truncateAddress,
  isValidAddress,
  getChainName,
  calculateTotalGas,
  generateId,
  debounce,
  throttle,
  copyToClipboard,
  sleep,
  retry,
  isValidEmail,
  formatFileSize,
  getRarityColor,
  calculateProgress,
} from '../index';
import { ChainId } from '../../types';

describe('Utils', () => {
  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(1000, 'EUR')).toBe('€1,000.00');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentage correctly', () => {
      expect(formatPercentage(12.345)).toBe('12.35%');
      expect(formatPercentage(0)).toBe('0.00%');
    });
  });

  describe('formatLargeNumber', () => {
    it('should format large numbers correctly', () => {
      expect(formatLargeNumber(1234)).toBe('1.2K');
      expect(formatLargeNumber(1234567)).toBe('1.2M');
      expect(formatLargeNumber(1234567890)).toBe('1.2B');
      expect(formatLargeNumber(123)).toBe('123');
    });
  });

  describe('formatTimeAgo', () => {
    it('should format time ago correctly', () => {
      const now = Date.now();
      const oneMinuteAgo = now - 60 * 1000;
      const oneHourAgo = now - 60 * 60 * 1000;
      const oneDayAgo = now - 24 * 60 * 60 * 1000;

      expect(formatTimeAgo(oneMinuteAgo)).toMatch(/^\d+m ago$/);
      expect(formatTimeAgo(oneHourAgo)).toMatch(/^\d+h ago$/);
      expect(formatTimeAgo(oneDayAgo)).toMatch(/^\d+d ago$/);
    });
  });

  describe('truncateAddress', () => {
    it('should truncate address correctly', () => {
      const address = '0x1234567890123456789012345678901234567890';
      expect(truncateAddress(address)).toBe('0x1234...7890');
      expect(truncateAddress(address, 4)).toBe('0x12...7890');
    });

    it('should handle empty address', () => {
      expect(truncateAddress('')).toBe('');
      expect(truncateAddress(null as any)).toBe('');
    });
  });

  describe('isValidAddress', () => {
    it('should validate Ethereum addresses correctly', () => {
      expect(isValidAddress('0x1234567890123456789012345678901234567890')).toBe(true);
      expect(isValidAddress('0x123456789012345678901234567890123456789')).toBe(false);
      expect(isValidAddress('invalid')).toBe(false);
      expect(isValidAddress('')).toBe(false);
    });
  });

  describe('getChainName', () => {
    it('should return correct chain names', () => {
      expect(getChainName(ChainId.ETHEREUM)).toBe('Ethereum');
      expect(getChainName(ChainId.POLYGON)).toBe('Polygon');
      expect(getChainName(ChainId.ARBITRUM)).toBe('Arbitrum');
      expect(getChainName(999 as ChainId)).toBe('Unknown');
    });
  });

  describe('calculateTotalGas', () => {
    it('should calculate total gas correctly', () => {
      const chains = [ChainId.ETHEREUM, ChainId.POLYGON];
      const total = calculateTotalGas(chains);
      expect(total).toBe(0.006); // 0.005 + 0.001
    });

    it('should return 0 for empty array', () => {
      expect(calculateTotalGas([])).toBe(0);
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      jest.useFakeTimers();
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      await Promise.resolve();

      expect(mockFn).toHaveBeenCalledTimes(1);
      jest.useRealTimers();
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', async () => {
      jest.useFakeTimers();
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);
      await Promise.resolve();

      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(2);
      jest.useRealTimers();
    });
  });

  describe('copyToClipboard', () => {
    it('should copy text to clipboard', async () => {
      const mockClipboard = {
        writeText: jest.fn().mockResolvedValue(undefined),
      };
      Object.assign(navigator, { clipboard: mockClipboard });

      const result = await copyToClipboard('test text');
      expect(result).toBe(true);
      expect(mockClipboard.writeText).toHaveBeenCalledWith('test text');
    });

    it('should handle clipboard errors', async () => {
      const mockClipboard = {
        writeText: jest.fn().mockRejectedValue(new Error('Clipboard error')),
      };
      Object.assign(navigator, { clipboard: mockClipboard });

      const result = await copyToClipboard('test text');
      expect(result).toBe(false);
    });
  });

  describe('sleep', () => {
    it('should sleep for specified time', async () => {
      jest.useFakeTimers();
      const sleepPromise = sleep(1000);
      
      jest.advanceTimersByTime(1000);
      await sleepPromise;
      
      jest.useRealTimers();
    });
  });

  describe('retry', () => {
    it('should retry failed operations', async () => {
      const mockFn = jest.fn()
        .mockRejectedValueOnce(new Error('First attempt'))
        .mockRejectedValueOnce(new Error('Second attempt'))
        .mockResolvedValueOnce('Success');

      const result = await retry(mockFn, 3, 100);
      expect(result).toBe('Success');
      expect(mockFn).toHaveBeenCalledTimes(3);
    });

    it('should throw error after max retries', async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error('Always fails'));

      await expect(retry(mockFn, 2, 100)).rejects.toThrow('Always fails');
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('isValidEmail', () => {
    it('should validate email addresses correctly', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('formatFileSize', () => {
    it('should format file sizes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });
  });

  describe('getRarityColor', () => {
    it('should return correct colors for rarities', () => {
      expect(getRarityColor('common')).toBe('gray');
      expect(getRarityColor('rare')).toBe('blue');
      expect(getRarityColor('epic')).toBe('purple');
      expect(getRarityColor('legendary')).toBe('orange');
      expect(getRarityColor('unknown')).toBe('gray');
    });
  });

  describe('calculateProgress', () => {
    it('should calculate progress correctly', () => {
      expect(calculateProgress(50, 100)).toBe(50);
      expect(calculateProgress(100, 100)).toBe(100);
      expect(calculateProgress(150, 100)).toBe(100); // Should cap at 100%
      expect(calculateProgress(0, 100)).toBe(0);
    });
  });
});
