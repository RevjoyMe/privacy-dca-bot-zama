import { FhevmInstance } from 'fhevm';

export enum AIProvider {
  CHATGPT = 0,
  GEMINI = 1,
  GROK = 2,
  CLAUDE = 3,
  NONE = 4
}

export interface AIMarketData {
  price: number;
  volume: number;
  marketCap: number;
  volatility: number;
  sentiment: number;
  timestamp: number;
}

export interface AIRecommendation {
  recommendedAmount: number;
  marketSentiment: number;
  volatilityIndex: number;
  optimalTiming: number;
  confidence: number;
  reasoning: string;
}

export interface AIProviderConfig {
  name: string;
  apiKey: string;
  endpoint: string;
  fee: number;
  enabled: boolean;
}

class AIService {
  private providers: Map<AIProvider, AIProviderConfig> = new Map();
  private marketDataCache: Map<string, AIMarketData> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    this.providers.set(AIProvider.CHATGPT, {
      name: 'ChatGPT',
      apiKey: (window as any).REACT_APP_OPENAI_API_KEY || '',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      fee: 0.001,
      enabled: true
    });

    this.providers.set(AIProvider.GEMINI, {
      name: 'Gemini',
      apiKey: (window as any).REACT_APP_GEMINI_API_KEY || '',
      endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      fee: 0.001,
      enabled: true
    });

    this.providers.set(AIProvider.GROK, {
      name: 'Grok',
      apiKey: (window as any).REACT_APP_GROK_API_KEY || '',
      endpoint: 'https://api.x.ai/v1/chat/completions',
      fee: 0.002,
      enabled: true
    });

    this.providers.set(AIProvider.CLAUDE, {
      name: 'Claude',
      apiKey: (window as any).REACT_APP_CLAUDE_API_KEY || '',
      endpoint: 'https://api.anthropic.com/v1/messages',
      fee: 0.0015,
      enabled: true
    });
  }

  /**
   * Get market data for AI analysis
   */
  async getMarketData(symbol: string = 'ETH'): Promise<AIMarketData> {
    const cacheKey = `${symbol}_${Math.floor(Date.now() / this.cacheTimeout)}`;
    
    if (this.marketDataCache.has(cacheKey)) {
      return this.marketDataCache.get(cacheKey)!;
    }

    try {
      // Fetch from CoinGecko API
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true&include_market_cap=true`
      );
      
      const data = await response.json();
      const ethData = data.ethereum;

      const marketData: AIMarketData = {
        price: ethData.usd,
        volume: ethData.usd_24h_vol || 0,
        marketCap: ethData.usd_market_cap || 0,
        volatility: Math.abs(ethData.usd_24h_change || 0),
        sentiment: this.calculateSentiment(ethData.usd_24h_change || 0),
        timestamp: Date.now()
      };

      this.marketDataCache.set(cacheKey, marketData);
      return marketData;
    } catch (error) {
      console.error('Error fetching market data:', error);
      
      // Return fallback data
      return {
        price: 2000,
        volume: 1000000000,
        marketCap: 240000000000,
        volatility: 5,
        sentiment: 50,
        timestamp: Date.now()
      };
    }
  }

  private calculateSentiment(priceChange: number): number {
    // Simple sentiment calculation based on price change
    if (priceChange > 5) return 80; // Very bullish
    if (priceChange > 2) return 65; // Bullish
    if (priceChange > 0) return 55; // Slightly bullish
    if (priceChange > -2) return 45; // Neutral
    if (priceChange > -5) return 35; // Bearish
    return 20; // Very bearish
  }

  /**
   * Generate AI recommendation
   */
  async generateRecommendation(
    provider: AIProvider,
    marketData: AIMarketData,
    userPreferences: any
  ): Promise<AIRecommendation> {
    const config = this.providers.get(provider);
    if (!config || !config.enabled) {
      throw new Error(`AI provider ${provider} is not available`);
    }

    try {
      switch (provider) {
        case AIProvider.CHATGPT:
          return await this.generateChatGPTRecommendation(config, marketData, userPreferences);
        case AIProvider.GEMINI:
          return await this.generateGeminiRecommendation(config, marketData, userPreferences);
        case AIProvider.GROK:
          return await this.generateGrokRecommendation(config, marketData, userPreferences);
        case AIProvider.CLAUDE:
          return await this.generateClaudeRecommendation(config, marketData, userPreferences);
        default:
          return this.generateFallbackRecommendation(marketData, userPreferences);
      }
    } catch (error) {
      console.error(`Error generating recommendation from ${provider}:`, error);
      return this.generateFallbackRecommendation(marketData, userPreferences);
    }
  }

  private async generateChatGPTRecommendation(
    config: AIProviderConfig,
    marketData: AIMarketData,
    userPreferences: any
  ): Promise<AIRecommendation> {
    const prompt = this.buildAIPrompt(marketData, userPreferences);
    
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a financial advisor specializing in cryptocurrency DCA strategies. Provide concise, actionable advice.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || '';
    
    return this.parseAIResponse(aiResponse, marketData, userPreferences);
  }

  private async generateGeminiRecommendation(
    config: AIProviderConfig,
    marketData: AIMarketData,
    userPreferences: any
  ): Promise<AIRecommendation> {
    const prompt = this.buildAIPrompt(marketData, userPreferences);
    
    const response = await fetch(`${config.endpoint}?key=${config.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    const aiResponse = data.candidates[0]?.content?.parts[0]?.text || '';
    
    return this.parseAIResponse(aiResponse, marketData, userPreferences);
  }

  private async generateGrokRecommendation(
    config: AIProviderConfig,
    marketData: AIMarketData,
    userPreferences: any
  ): Promise<AIRecommendation> {
    const prompt = this.buildAIPrompt(marketData, userPreferences);
    
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [
          {
            role: 'system',
            content: 'You are a financial advisor specializing in cryptocurrency DCA strategies. Provide concise, actionable advice.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || '';
    
    return this.parseAIResponse(aiResponse, marketData, userPreferences);
  }

  private async generateClaudeRecommendation(
    config: AIProviderConfig,
    marketData: AIMarketData,
    userPreferences: any
  ): Promise<AIRecommendation> {
    const prompt = this.buildAIPrompt(marketData, userPreferences);
    
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();
    const aiResponse = data.content[0]?.text || '';
    
    return this.parseAIResponse(aiResponse, marketData, userPreferences);
  }

  private buildAIPrompt(marketData: AIMarketData, userPreferences: any): string {
    return `
      As a cryptocurrency DCA advisor, analyze the current market conditions and provide a recommendation:

      Market Data:
      - ETH Price: $${marketData.price}
      - 24h Volume: $${marketData.volume.toLocaleString()}
      - Market Cap: $${marketData.marketCap.toLocaleString()}
      - Volatility: ${marketData.volatility}%
      - Sentiment: ${marketData.sentiment}/100

      User Preferences:
      - Risk Tolerance: ${userPreferences.riskTolerance}/10
      - Investment Horizon: ${userPreferences.investmentHorizon} months
      - Current Amount: $${userPreferences.currentAmount}

      Provide a recommendation in this format:
      - Recommended Amount: [number]
      - Market Sentiment: [0-100]
      - Volatility Index: [0-100]
      - Optimal Timing: [0-24 hours]
      - Confidence: [0-100]
      - Reasoning: [brief explanation]
    `;
  }

  private parseAIResponse(response: string, marketData: AIMarketData, userPreferences: any): AIRecommendation {
    try {
      // Simple parsing - in production, use more robust parsing
      const lines = response.split('\n');
      const recommendation: AIRecommendation = {
        recommendedAmount: userPreferences.currentAmount * 1.1, // Default 10% increase
        marketSentiment: marketData.sentiment,
        volatilityIndex: marketData.volatility,
        optimalTiming: 12, // Default to noon
        confidence: 70,
        reasoning: 'AI analysis based on current market conditions'
      };

      // Try to extract values from response
      lines.forEach(line => {
        if (line.includes('Recommended Amount:')) {
          const match = line.match(/\d+/);
          if (match) recommendation.recommendedAmount = parseInt(match[0]);
        }
        if (line.includes('Market Sentiment:')) {
          const match = line.match(/\d+/);
          if (match) recommendation.marketSentiment = parseInt(match[0]);
        }
        if (line.includes('Confidence:')) {
          const match = line.match(/\d+/);
          if (match) recommendation.confidence = parseInt(match[0]);
        }
      });

      return recommendation;
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return this.generateFallbackRecommendation(marketData, userPreferences);
    }
  }

  private generateFallbackRecommendation(
    marketData: AIMarketData,
    userPreferences: any
  ): AIRecommendation {
    return {
      recommendedAmount: userPreferences.currentAmount,
      marketSentiment: marketData.sentiment,
      volatilityIndex: marketData.volatility,
      optimalTiming: 12,
      confidence: 50,
      reasoning: 'Fallback recommendation based on market data'
    };
  }

  /**
   * Encrypt recommendation for blockchain storage
   */
  encryptRecommendation(recommendation: AIRecommendation) {
    // TODO: Implement FHE encryption
    // For now, return placeholder encrypted data
    return {
      recommendedAmount: '0x...',
      marketSentiment: '0x...',
      volatilityIndex: '0x...',
      optimalTiming: '0x...'
    };
  }

  getProviderConfig(provider: AIProvider): AIProviderConfig | undefined {
    return this.providers.get(provider);
  }

  getAvailableProviders(): AIProvider[] {
    return Array.from(this.providers.keys()).filter(
      provider => this.providers.get(provider)?.enabled
    );
  }

  updateProviderConfig(provider: AIProvider, config: Partial<AIProviderConfig>): void {
    const existingConfig = this.providers.get(provider);
    if (existingConfig) {
      this.providers.set(provider, { ...existingConfig, ...config });
    }
  }
}

export const aiService = new AIService();
export default aiService;
