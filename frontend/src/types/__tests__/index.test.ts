import { ChainId, AchievementType } from '../index';

describe('Types', () => {
  describe('ChainId enum', () => {
    it('should have correct values', () => {
      expect(ChainId.ETHEREUM).toBe(0);
      expect(ChainId.POLYGON).toBe(1);
      expect(ChainId.ARBITRUM).toBe(2);
      expect(ChainId.OPTIMISM).toBe(3);
      expect(ChainId.BASE).toBe(4);
      expect(ChainId.BSC).toBe(5);
    });

    it('should have 6 chain IDs', () => {
      const chainIds = Object.values(ChainId).filter(value => typeof value === 'number');
      expect(chainIds).toHaveLength(6);
    });
  });

  describe('AchievementType enum', () => {
    it('should have correct values', () => {
      expect(AchievementType.FIRST_STRATEGY).toBe(0);
      expect(AchievementType.CONSISTENT_INVESTOR).toBe(1);
      expect(AchievementType.AI_OPTIMIZER).toBe(2);
      expect(AchievementType.CROSS_CHAIN_EXPLORER).toBe(3);
      expect(AchievementType.PRIVACY_CHAMPION).toBe(4);
      expect(AchievementType.BATCH_MASTER).toBe(5);
    });

    it('should have 6 achievement types', () => {
      const achievementTypes = Object.values(AchievementType).filter(value => typeof value === 'number');
      expect(achievementTypes).toHaveLength(6);
    });
  });

  describe('Type compatibility', () => {
    it('should allow valid chain IDs', () => {
      const validChainIds: ChainId[] = [
        ChainId.ETHEREUM,
        ChainId.POLYGON,
        ChainId.ARBITRUM,
        ChainId.OPTIMISM,
        ChainId.BASE,
        ChainId.BSC,
      ];

      validChainIds.forEach(chainId => {
        expect(typeof chainId).toBe('number');
        expect(chainId).toBeGreaterThanOrEqual(0);
        expect(chainId).toBeLessThan(6);
      });
    });

    it('should allow valid achievement types', () => {
      const validAchievementTypes: AchievementType[] = [
        AchievementType.FIRST_STRATEGY,
        AchievementType.CONSISTENT_INVESTOR,
        AchievementType.AI_OPTIMIZER,
        AchievementType.CROSS_CHAIN_EXPLORER,
        AchievementType.PRIVACY_CHAMPION,
        AchievementType.BATCH_MASTER,
      ];

      validAchievementTypes.forEach(achievementType => {
        expect(typeof achievementType).toBe('number');
        expect(achievementType).toBeGreaterThanOrEqual(0);
        expect(achievementType).toBeLessThan(6);
      });
    });
  });
});
