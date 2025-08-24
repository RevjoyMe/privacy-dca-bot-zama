import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Select,
  Progress,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  FormControl,
  FormLabel,
  Switch,
  Input
} from '@chakra-ui/react';
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';
import aiService, { AIProvider, AIRecommendation, AIMarketData } from '../services/AIService';

interface AIOptimizationProps {
  contractAddress: string;
  abi: any;
}

export const AIOptimization: React.FC<AIOptimizationProps> = ({ contractAddress, abi }) => {
  const { address } = useAccount();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // State
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(AIProvider.CHATGPT);
  const [marketData, setMarketData] = useState<AIMarketData | null>(null);
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    riskTolerance: 5,
    investmentHorizon: 12,
    currentAmount: 100
  });
  const [aiOptimizationEnabled, setAiOptimizationEnabled] = useState(false);
  const [availableProviders, setAvailableProviders] = useState<AIProvider[]>([]);

  // Contract interactions
  const { data: generateData, write: generateRecommendation } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'generateAIRecommendation',
  });

  const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess } = useWaitForTransaction({
    hash: generateData?.hash,
  });

  useEffect(() => {
    loadMarketData();
    loadAvailableProviders();
  }, []);

  useEffect(() => {
    if (isTransactionSuccess) {
      toast({
        title: 'AI Recommendation Generated',
        description: 'Your AI recommendation has been successfully generated and stored on-chain.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onClose();
    }
  }, [isTransactionSuccess, toast, onClose]);

  const loadMarketData = async () => {
    try {
      setIsLoading(true);
      const data = await aiService.getMarketData();
      setMarketData(data);
    } catch (error) {
      console.error('Error loading market data:', error);
      toast({
        title: 'Error loading market data',
        description: 'Failed to fetch current market data',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailableProviders = () => {
    const providers = aiService.getAvailableProviders();
    setAvailableProviders(providers);
  };

  const handleGenerateRecommendation = async () => {
    if (!marketData) {
      toast({
        title: 'No market data',
        description: 'Please wait for market data to load',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsGenerating(true);
      const recommendation = await aiService.generateRecommendation(
        selectedProvider,
        marketData,
        userPreferences
      );
      setRecommendation(recommendation);
      onOpen();
    } catch (error) {
      console.error('Error generating recommendation:', error);
      toast({
        title: 'Error generating recommendation',
        description: 'Failed to generate AI recommendation',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitToBlockchain = async () => {
    if (!recommendation || !generateRecommendation) return;

    try {
      const encryptedData = aiService.encryptRecommendation(recommendation);
      
      await generateRecommendation({
        args: [
          selectedProvider,
          encryptedData.recommendedAmount,
          encryptedData.marketSentiment,
          encryptedData.volatilityIndex,
          encryptedData.optimalTiming
        ],
        value: aiService.getProviderConfig(selectedProvider)?.fee || 0
      });
    } catch (error) {
      console.error('Error submitting to blockchain:', error);
      toast({
        title: 'Error submitting to blockchain',
        description: 'Failed to store recommendation on-chain',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getProviderName = (provider: AIProvider): string => {
    switch (provider) {
      case AIProvider.CHATGPT: return 'ChatGPT';
      case AIProvider.GEMINI: return 'Gemini';
      case AIProvider.GROK: return 'Grok';
      case AIProvider.CLAUDE: return 'Claude';
      default: return 'Unknown';
    }
  };

  const getProviderColor = (provider: AIProvider): string => {
    switch (provider) {
      case AIProvider.CHATGPT: return 'green';
      case AIProvider.GEMINI: return 'blue';
      case AIProvider.GROK: return 'purple';
      case AIProvider.CLAUDE: return 'orange';
      default: return 'gray';
    }
  };

  if (!address) {
    return (
      <Card>
        <CardHeader>
          <Heading size="md">🤖 AI Strategy Optimization</Heading>
        </CardHeader>
        <CardBody>
          <Alert status="info">
            <AlertIcon />
            Please connect your wallet to access AI optimization features
          </Alert>
        </CardBody>
      </Card>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* AI Optimization Toggle */}
      <Card>
        <CardHeader>
          <HStack justify="space-between">
            <Heading size="md">🤖 AI Strategy Optimization</Heading>
            <FormControl display="flex" alignItems="center" maxW="200px">
              <FormLabel htmlFor="ai-optimization" mb="0">
                Enable AI
              </FormLabel>
              <Switch
                id="ai-optimization"
                isChecked={aiOptimizationEnabled}
                onChange={(e) => setAiOptimizationEnabled(e.target.checked)}
                colorScheme="purple"
              />
            </FormControl>
          </HStack>
        </CardHeader>
        <CardBody>
          <Text color="gray.600">
            Use AI to optimize your DCA strategy based on real-time market conditions
          </Text>
        </CardBody>
      </Card>

      {aiOptimizationEnabled && (
        <>
          {/* Market Data Display */}
          <Card>
            <CardHeader>
              <Heading size="md">📊 Market Data</Heading>
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <Progress size="xs" isIndeterminate colorScheme="purple" />
              ) : marketData ? (
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <Stat>
                      <StatLabel>ETH Price</StatLabel>
                      <StatNumber>${marketData.price.toLocaleString()}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>24h Volume</StatLabel>
                      <StatNumber>${(marketData.volume / 1e9).toFixed(1)}B</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Market Cap</StatLabel>
                      <StatNumber>${(marketData.marketCap / 1e9).toFixed(1)}B</StatNumber>
                    </Stat>
                  </HStack>
                  <HStack justify="space-between">
                    <Stat>
                      <StatLabel>Volatility</StatLabel>
                      <StatNumber>{marketData.volatility.toFixed(1)}%</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Sentiment</StatLabel>
                      <StatNumber>{marketData.sentiment}/100</StatNumber>
                      <StatHelpText>
                        <Progress value={marketData.sentiment} size="sm" colorScheme="green" />
                      </StatHelpText>
                    </Stat>
                  </HStack>
                </VStack>
              ) : (
                <Text color="gray.500">Failed to load market data</Text>
              )}
            </CardBody>
          </Card>

          {/* AI Provider Selection */}
          <Card>
            <CardHeader>
              <Heading size="md">🤖 AI Provider</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Select AI Provider</FormLabel>
                  <Select
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(parseInt(e.target.value) as AIProvider)}
                  >
                    {availableProviders.map(provider => (
                      <option key={provider} value={provider}>
                        {getProviderName(provider)}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                
                <HStack spacing={2}>
                  {availableProviders.map(provider => (
                    <Badge
                      key={provider}
                      colorScheme={getProviderColor(provider)}
                      variant={selectedProvider === provider ? 'solid' : 'outline'}
                      cursor="pointer"
                      onClick={() => setSelectedProvider(provider)}
                    >
                      {getProviderName(provider)}
                    </Badge>
                  ))}
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* User Preferences */}
          <Card>
            <CardHeader>
              <Heading size="md">⚙️ Investment Preferences</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={6} align="stretch">
                <FormControl>
                  <FormLabel>Risk Tolerance: {userPreferences.riskTolerance}/10</FormLabel>
                  <Slider
                    value={userPreferences.riskTolerance}
                    onChange={(value) => setUserPreferences(prev => ({ ...prev, riskTolerance: value }))}
                    min={1}
                    max={10}
                    step={1}
                  >
                    <SliderMark value={1} mt="2" ml="-2.5" fontSize="sm">
                      Conservative
                    </SliderMark>
                    <SliderMark value={10} mt="2" ml="-2.5" fontSize="sm">
                      Aggressive
                    </SliderMark>
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                </FormControl>

                <FormControl>
                  <FormLabel>Investment Horizon: {userPreferences.investmentHorizon} months</FormLabel>
                  <Slider
                    value={userPreferences.investmentHorizon}
                    onChange={(value) => setUserPreferences(prev => ({ ...prev, investmentHorizon: value }))}
                    min={1}
                    max={60}
                    step={1}
                  >
                    <SliderMark value={1} mt="2" ml="-2.5" fontSize="sm">
                      1 month
                    </SliderMark>
                    <SliderMark value={60} mt="2" ml="-2.5" fontSize="sm">
                      5 years
                    </SliderMark>
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                </FormControl>

                <FormControl>
                  <FormLabel>Current DCA Amount (USDC)</FormLabel>
                  <Input
                    type="number"
                    value={userPreferences.currentAmount}
                    onChange={(e) => setUserPreferences(prev => ({ ...prev, currentAmount: parseFloat(e.target.value) || 0 }))}
                    placeholder="100"
                  />
                </FormControl>
              </VStack>
            </CardBody>
          </Card>

          {/* Generate Recommendation Button */}
          <Button
            colorScheme="purple"
            size="lg"
            onClick={handleGenerateRecommendation}
            isLoading={isGenerating}
            loadingText="Generating Recommendation"
            isDisabled={!marketData}
          >
            🚀 Generate AI Recommendation
          </Button>
        </>
      )}

      {/* AI Recommendation Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>🤖 AI Recommendation</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {recommendation && (
              <VStack spacing={6} align="stretch">
                <Card>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <HStack justify="space-between">
                        <Text fontWeight="bold">Recommended Amount:</Text>
                        <Badge colorScheme="green" fontSize="lg">
                          ${recommendation.recommendedAmount.toFixed(2)} USDC
                        </Badge>
                      </HStack>
                      
                      <HStack justify="space-between">
                        <Text fontWeight="bold">Market Sentiment:</Text>
                        <Badge colorScheme="blue">
                          {recommendation.marketSentiment}/100
                        </Badge>
                      </HStack>
                      
                      <HStack justify="space-between">
                        <Text fontWeight="bold">Volatility Index:</Text>
                        <Badge colorScheme="orange">
                          {recommendation.volatilityIndex}/100
                        </Badge>
                      </HStack>
                      
                      <HStack justify="space-between">
                        <Text fontWeight="bold">Optimal Timing:</Text>
                        <Badge colorScheme="purple">
                          {recommendation.optimalTiming} hours
                        </Badge>
                      </HStack>
                      
                      <HStack justify="space-between">
                        <Text fontWeight="bold">Confidence:</Text>
                        <Badge colorScheme="teal">
                          {recommendation.confidence}%
                        </Badge>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <Heading size="sm">📝 AI Reasoning</Heading>
                  </CardHeader>
                  <CardBody>
                    <Text>{recommendation.reasoning}</Text>
                  </CardBody>
                </Card>

                <HStack spacing={4}>
                  <Button
                    colorScheme="purple"
                    onClick={handleSubmitToBlockchain}
                    isLoading={isTransactionLoading}
                    loadingText="Submitting to Blockchain"
                    flex={1}
                  >
                    💾 Save to Blockchain
                  </Button>
                  <Button onClick={onClose} flex={1}>
                    Close
                  </Button>
                </HStack>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};
