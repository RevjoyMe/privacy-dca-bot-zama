import {
  CONTRACT_ADDRESSES,
  CHAIN_CONFIG,
  ACHIEVEMENTS,
  API_ENDPOINTS,
  DEFAULTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '../index';
import { ChainId } from '../../types';

describe('Constants', () => {
  describe('CONTRACT_ADDRESSES', () => {
    it('should have DCA_BOT and NFT addresses', () => {
      expect(CONTRACT_ADDRESSES).toHaveProperty('DCA_BOT');
      expect(CONTRACT_ADDRESSES).toHaveProperty('NFT');
    });
  });

  describe('CHAIN_CONFIG', () => {
    it('should have configuration for all chains', () => {
      expect(CHAIN_CONFIG[ChainId.ETHEREUM]).toBeDefined();
      expect(CHAIN_CONFIG[ChainId.POLYGON]).toBeDefined();
      expect(CHAIN_CONFIG[ChainId.ARBITRUM]).toBeDefined();
      expect(CHAIN_CONFIG[ChainId.OPTIMISM]).toBeDefined();
      expect(CHAIN_CONFIG[ChainId.BASE]).toBeDefined();
      expect(CHAIN_CONFIG[ChainId.BSC]).toBeDefined();
    });

    it('should have correct structure for each chain', () => {
      Object.values(CHAIN_CONFIG).forEach(chain => {
        expect(chain).toHaveProperty('id');
        expect(chain).toHaveProperty('name');
        expect(chain).toHaveProperty('icon');
        expect(chain).toHaveProperty('color');
        expect(chain).toHaveProperty('gasEstimate');
        expect(chain).toHaveProperty('supported');
        expect(chain).toHaveProperty('usdcAddress');
        expect(chain).toHaveProperty('wethAddress');
      });
    });

    it('should have unique chain IDs', () => {
      const ids = Object.values(CHAIN_CONFIG).map(chain => chain.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid gas estimates', () => {
      Object.values(CHAIN_CONFIG).forEach(chain => {
        expect(chain.gasEstimate).toBeGreaterThan(0);
        expect(typeof chain.gasEstimate).toBe('number');
      });
    });
  });

  describe('ACHIEVEMENTS', () => {
    it('should have 6 achievements', () => {
      expect(ACHIEVEMENTS).toHaveLength(6);
    });

    it('should have correct structure for each achievement', () => {
      ACHIEVEMENTS.forEach(achievement => {
        expect(achievement).toHaveProperty('id');
        expect(achievement).toHaveProperty('name');
        expect(achievement).toHaveProperty('description');
        expect(achievement).toHaveProperty('icon');
        expect(achievement).toHaveProperty('color');
        expect(achievement).toHaveProperty('rarity');
        expect(achievement).toHaveProperty('threshold');
        expect(achievement).toHaveProperty('isEarned');
        expect(achievement).toHaveProperty('isPrivate');
      });
    });

    it('should have unique achievement IDs', () => {
      const ids = ACHIEVEMENTS.map(achievement => achievement.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid rarity values', () => {
      const validRarities = ['common', 'rare', 'epic', 'legendary'];
      ACHIEVEMENTS.forEach(achievement => {
        expect(validRarities).toContain(achievement.rarity);
      });
    });

    it('should have positive thresholds', () => {
      ACHIEVEMENTS.forEach(achievement => {
        expect(achievement.threshold).toBeGreaterThan(0);
      });
    });
  });

  describe('API_ENDPOINTS', () => {
    it('should have all required endpoints', () => {
      expect(API_ENDPOINTS).toHaveProperty('COINGECKO');
      expect(API_ENDPOINTS).toHaveProperty('OPENAI');
      expect(API_ENDPOINTS).toHaveProperty('GEMINI');
      expect(API_ENDPOINTS).toHaveProperty('GROK');
      expect(API_ENDPOINTS).toHaveProperty('CLAUDE');
    });

    it('should have valid URLs', () => {
      Object.values(API_ENDPOINTS).forEach(endpoint => {
        expect(endpoint).toMatch(/^https?:\/\//);
      });
    });
  });

  describe('DEFAULTS', () => {
    it('should have all required default values', () => {
      expect(DEFAULTS).toHaveProperty('RISK_TOLERANCE');
      expect(DEFAULTS).toHaveProperty('INVESTMENT_HORIZON');
      expect(DEFAULTS).toHaveProperty('CURRENT_AMOUNT');
      expect(DEFAULTS).toHaveProperty('BATCH_TIMEOUT');
      expect(DEFAULTS).toHaveProperty('MIN_BATCH_SIZE');
      expect(DEFAULTS).toHaveProperty('MAX_BATCH_SIZE');
    });

    it('should have valid default values', () => {
      expect(DEFAULTS.RISK_TOLERANCE).toBeGreaterThan(0);
      expect(DEFAULTS.RISK_TOLERANCE).toBeLessThanOrEqual(10);
      expect(DEFAULTS.INVESTMENT_HORIZON).toBeGreaterThan(0);
      expect(DEFAULTS.CURRENT_AMOUNT).toBeGreaterThan(0);
      expect(DEFAULTS.BATCH_TIMEOUT).toBeGreaterThan(0);
      expect(DEFAULTS.MIN_BATCH_SIZE).toBeGreaterThan(0);
      expect(DEFAULTS.MAX_BATCH_SIZE).toBeGreaterThan(DEFAULTS.MIN_BATCH_SIZE);
    });
  });

  describe('ERROR_MESSAGES', () => {
    it('should have all required error messages', () => {
      expect(ERROR_MESSAGES).toHaveProperty('WALLET_NOT_CONNECTED');
      expect(ERROR_MESSAGES).toHaveProperty('INSUFFICIENT_BALANCE');
      expect(ERROR_MESSAGES).toHaveProperty('NETWORK_ERROR');
      expect(ERROR_MESSAGES).toHaveProperty('CONTRACT_ERROR');
      expect(ERROR_MESSAGES).toHaveProperty('AI_SERVICE_ERROR');
    });

    it('should have non-empty error messages', () => {
      Object.values(ERROR_MESSAGES).forEach(message => {
        expect(message).toBeTruthy();
        expect(typeof message).toBe('string');
        expect(message.length).toBeGreaterThan(0);
      });
    });
  });

  describe('SUCCESS_MESSAGES', () => {
    it('should have all required success messages', () => {
      expect(SUCCESS_MESSAGES).toHaveProperty('STRATEGY_CREATED');
      expect(SUCCESS_MESSAGES).toHaveProperty('BATCH_EXECUTED');
      expect(SUCCESS_MESSAGES).toHaveProperty('WITHDRAWAL_COMPLETED');
      expect(SUCCESS_MESSAGES).toHaveProperty('AI_RECOMMENDATION_GENERATED');
    });

    it('should have non-empty success messages', () => {
      Object.values(SUCCESS_MESSAGES).forEach(message => {
        expect(message).toBeTruthy();
        expect(typeof message).toBe('string');
        expect(message.length).toBeGreaterThan(0);
      });
    });
  });
});
