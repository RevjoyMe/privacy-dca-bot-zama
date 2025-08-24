import aiService, { AIProvider } from '../AIService';

// Mock fetch
global.fetch = jest.fn();

describe('AIService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMarketData', () => {
    it('should fetch market data successfully', async () => {
      const mockResponse = {
        ethereum: {
          usd: 2000,
          usd_24h_vol: 1000000000,
          usd_market_cap: 240000000000,
          usd_24h_change: 5.2,
        },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      const result = await aiService.getMarketData('ETH');

      expect(result).toEqual({
        price: 2000,
        volume: 1000000000,
        marketCap: 240000000000,
        volatility: 5.2,
        sentiment: 65,
        timestamp: expect.any(Number),
      });
    });

    it('should return fallback data on error', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await aiService.getMarketData('ETH');

      expect(result).toEqual({
        price: 2000,
        volume: 1000000000,
        marketCap: 240000000000,
        volatility: 5,
        sentiment: 50,
        timestamp: expect.any(Number),
      });
    });
  });

  describe('generateRecommendation', () => {
    it('should generate recommendation with ChatGPT', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'Recommended Amount: 110\nMarket Sentiment: 75\nConfidence: 85',
            },
          },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      const marketData = {
        price: 2000,
        volume: 1000000000,
        marketCap: 240000000000,
        volatility: 5,
        sentiment: 50,
        timestamp: Date.now(),
      };

      const userPreferences = {
        riskTolerance: 5,
        investmentHorizon: 12,
        currentAmount: 100,
      };

      const result = await aiService.generateRecommendation(
        AIProvider.CHATGPT,
        marketData,
        userPreferences
      );

      expect(result).toEqual({
        recommendedAmount: 110,
        marketSentiment: 75,
        volatilityIndex: 5,
        optimalTiming: 12,
        confidence: 85,
        reasoning: expect.any(String),
      });
    });

    it('should return fallback recommendation on error', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('API error'));

      const marketData = {
        price: 2000,
        volume: 1000000000,
        marketCap: 240000000000,
        volatility: 5,
        sentiment: 50,
        timestamp: Date.now(),
      };

      const userPreferences = {
        riskTolerance: 5,
        investmentHorizon: 12,
        currentAmount: 100,
      };

      const result = await aiService.generateRecommendation(
        AIProvider.CHATGPT,
        marketData,
        userPreferences
      );

      expect(result).toEqual({
        recommendedAmount: 100,
        marketSentiment: 50,
        volatilityIndex: 5,
        optimalTiming: 12,
        confidence: 50,
        reasoning: 'Fallback recommendation based on market data',
      });
    });
  });

  describe('getAvailableProviders', () => {
    it('should return available providers', () => {
      const providers = aiService.getAvailableProviders();
      expect(providers).toContain(AIProvider.CHATGPT);
      expect(providers).toContain(AIProvider.GEMINI);
      expect(providers).toContain(AIProvider.GROK);
      expect(providers).toContain(AIProvider.CLAUDE);
    });
  });

  describe('getProviderConfig', () => {
    it('should return provider configuration', () => {
      const config = aiService.getProviderConfig(AIProvider.CHATGPT);
      expect(config).toEqual({
        name: 'ChatGPT',
        apiKey: '',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        fee: 0.001,
        enabled: true,
      });
    });

    it('should return undefined for invalid provider', () => {
      const config = aiService.getProviderConfig(999 as AIProvider);
      expect(config).toBeUndefined();
    });
  });

  describe('encryptRecommendation', () => {
    it('should return placeholder encrypted data', () => {
      const recommendation = {
        recommendedAmount: 100,
        marketSentiment: 50,
        volatilityIndex: 5,
        optimalTiming: 12,
        confidence: 75,
        reasoning: 'Test recommendation',
      };

      const result = aiService.encryptRecommendation(recommendation);

      expect(result).toEqual({
        recommendedAmount: '0x...',
        marketSentiment: '0x...',
        volatilityIndex: '0x...',
        optimalTiming: '0x...',
      });
    });
  });
});
