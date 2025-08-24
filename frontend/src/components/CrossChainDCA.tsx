import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Select,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Badge,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  Grid,
  GridItem,
  Icon,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  Input,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb
} from '@chakra-ui/react';
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import { FaEthereum, FaLayerGroup, FaRocket, FaShieldAlt, FaCoins } from 'react-icons/fa';
import { SiPolygon, SiArbitrum, SiOptimism } from 'react-icons/si';

interface CrossChainDCAProps {
  contractAddress: string;
  abi: any;
}

export enum ChainId {
  ETHEREUM = 0,
  POLYGON = 1,
  ARBITRUM = 2,
  OPTIMISM = 3,
  BASE = 4,
  BSC = 5
}

interface ChainInfo {
  id: ChainId;
  name: string;
  icon: any;
  color: string;
  gasEstimate: number;
  supported: boolean;
  usdcAddress: string;
  wethAddress: string;
}

const CHAIN_CONFIG: Record<ChainId, ChainInfo> = {
  [ChainId.ETHEREUM]: {
    id: ChainId.ETHEREUM,
    name: 'Ethereum',
    icon: FaEthereum,
    color: 'blue',
    gasEstimate: 0.005,
    supported: true,
    usdcAddress: '0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8',
    wethAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
  },
  [ChainId.POLYGON]: {
    id: ChainId.POLYGON,
    name: 'Polygon',
    icon: SiPolygon,
    color: 'purple',
    gasEstimate: 0.001,
    supported: true,
    usdcAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    wethAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'
  },
  [ChainId.ARBITRUM]: {
    id: ChainId.ARBITRUM,
    name: 'Arbitrum',
    icon: SiArbitrum,
    color: 'cyan',
    gasEstimate: 0.002,
    supported: true,
    usdcAddress: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    wethAddress: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'
  },
  [ChainId.OPTIMISM]: {
    id: ChainId.OPTIMISM,
    name: 'Optimism',
    icon: SiOptimism,
    color: 'red',
    gasEstimate: 0.001,
    supported: true,
    usdcAddress: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
    wethAddress: '0x4200000000000000000000000000000000000006'
  },
  [ChainId.BASE]: {
    id: ChainId.BASE,
    name: 'Base',
    icon: FaLayerGroup,
    color: 'blue',
    gasEstimate: 0.001,
    supported: true,
    usdcAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    wethAddress: '0x4200000000000000000000000000000000000006'
  },
  [ChainId.BSC]: {
    id: ChainId.BSC,
    name: 'BSC',
    icon: FaCoins,
    color: 'yellow',
    gasEstimate: 0.001,
    supported: true,
    usdcAddress: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    wethAddress: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8'
  }
};

export const CrossChainDCA: React.FC<CrossChainDCAProps> = ({ contractAddress, abi }) => {
  const { address } = useAccount();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // State
  const [selectedChains, setSelectedChains] = useState<ChainId[]>([ChainId.ETHEREUM]);
  const [totalAmount, setTotalAmount] = useState<number>(100);
  const [chainAllocations, setChainAllocations] = useState<Record<ChainId, number>>({
    [ChainId.ETHEREUM]: 100,
    [ChainId.POLYGON]: 0,
    [ChainId.ARBITRUM]: 0,
    [ChainId.OPTIMISM]: 0,
    [ChainId.BASE]: 0,
    [ChainId.BSC]: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [estimatedGas, setEstimatedGas] = useState<number>(0);

  // Contract interactions
  const { data: crossChainBatchData, refetch } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'getCurrentCrossChainBatch',
    watch: true,
  });

  const { write: submitCrossChainIntent, isLoading: isSubmitting } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'submitCrossChainIntent',
  });

  const { write: executeCrossChainBatch, isLoading: isExecuting } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'executeCrossChainBatch',
  });

  useEffect(() => {
    calculateGasEstimate();
  }, [selectedChains, totalAmount]);

  const calculateGasEstimate = () => {
    const totalGas = selectedChains.reduce((sum, chainId) => {
      return sum + CHAIN_CONFIG[chainId].gasEstimate;
    }, 0);
    setEstimatedGas(totalGas);
  };

  const handleChainToggle = (chainId: ChainId) => {
    if (selectedChains.includes(chainId)) {
      setSelectedChains(prev => prev.filter(id => id !== chainId));
      setChainAllocations(prev => ({ ...prev, [chainId]: 0 }));
    } else {
      setSelectedChains(prev => [...prev, chainId]);
      // Redistribute amounts
      const newAllocations = { ...chainAllocations };
      const equalShare = 100 / (selectedChains.length + 1);
      selectedChains.forEach(id => {
        newAllocations[id] = equalShare;
      });
      newAllocations[chainId] = equalShare;
      setChainAllocations(newAllocations);
    }
  };

  const handleAllocationChange = (chainId: ChainId, percentage: number) => {
    setChainAllocations(prev => ({ ...prev, [chainId]: percentage }));
  };

  const handleSubmitCrossChainIntent = async () => {
    if (!submitCrossChainIntent || selectedChains.length === 0) return;

    try {
      setIsLoading(true);
      
      // Prepare encrypted data for each chain
      const chainData = selectedChains.map(chainId => ({
        chainId,
        amount: (totalAmount * chainAllocations[chainId]) / 100
      }));

      // TODO: Implement FHE encryption
      const encryptedData = chainData.map(data => ({
        chainId: data.chainId,
        encryptedAmount: '0x...' // Placeholder for encrypted amount
      }));

      await submitCrossChainIntent({
        args: [encryptedData],
        value: estimatedGas
      });

      toast({
        title: 'Cross-chain intent submitted',
        description: 'Your cross-chain DCA intent has been submitted successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error submitting cross-chain intent:', error);
      toast({
        title: 'Error submitting intent',
        description: 'Failed to submit cross-chain DCA intent',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteCrossChainBatch = async () => {
    if (!executeCrossChainBatch) return;

    try {
      await executeCrossChainBatch();
      toast({
        title: 'Cross-chain batch execution initiated',
        description: 'The cross-chain batch is being processed',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error executing cross-chain batch:', error);
      toast({
        title: 'Error executing batch',
        description: 'Failed to execute cross-chain batch',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (!address) {
    return (
      <Card>
        <CardHeader>
          <Heading size="md">🌐 Cross-Chain DCA</Heading>
        </CardHeader>
        <CardBody>
          <Alert status="info">
            <AlertIcon />
            Please connect your wallet to access cross-chain DCA features
          </Alert>
        </CardBody>
      </Card>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Cross-Chain Overview */}
      <Card>
        <CardHeader>
          <Heading size="md">🌐 Cross-Chain DCA</Heading>
        </CardHeader>
        <CardBody>
          <Text color="gray.600">
            Distribute your DCA strategy across multiple blockchain networks for better diversification and gas optimization
          </Text>
        </CardBody>
      </Card>

      {/* Chain Selection */}
      <Card>
        <CardHeader>
          <Heading size="md">🔗 Select Networks</Heading>
        </CardHeader>
        <CardBody>
          <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
            {Object.values(CHAIN_CONFIG).map((chain) => (
              <GridItem key={chain.id}>
                <Card
                  border="2px"
                  borderColor={selectedChains.includes(chain.id) ? `${chain.color}.500` : 'gray.200'}
                  cursor="pointer"
                  onClick={() => handleChainToggle(chain.id)}
                  _hover={{ borderColor: `${chain.color}.300` }}
                >
                  <CardBody>
                    <VStack spacing={2}>
                      <Icon as={chain.icon} boxSize={8} color={`${chain.color}.500`} />
                      <Text fontWeight="bold">{chain.name}</Text>
                      <Badge colorScheme={chain.color} variant="outline">
                        ${chain.gasEstimate.toFixed(3)} gas
                      </Badge>
                      <Checkbox
                        isChecked={selectedChains.includes(chain.id)}
                        onChange={() => handleChainToggle(chain.id)}
                      >
                        Select
                      </Checkbox>
                    </VStack>
                  </CardBody>
                </Card>
              </GridItem>
            ))}
          </Grid>
        </CardBody>
      </Card>

      {/* Amount Configuration */}
      <Card>
        <CardHeader>
          <Heading size="md">💰 Investment Amount</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Total Investment Amount (USDC)</FormLabel>
              <Input
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(parseFloat(e.target.value) || 0)}
                placeholder="100"
              />
            </FormControl>

            {selectedChains.length > 0 && (
              <Box>
                <Text fontWeight="bold" mb={3}>Chain Allocations (%)</Text>
                <VStack spacing={3} align="stretch">
                  {selectedChains.map((chainId) => {
                    const chain = CHAIN_CONFIG[chainId];
                    const allocation = chainAllocations[chainId];
                    const amount = (totalAmount * allocation) / 100;
                    
                    return (
                      <Box key={chainId} p={3} border="1px" borderColor="gray.200" borderRadius="md">
                        <HStack justify="space-between">
                          <HStack>
                            <Icon as={chain.icon} boxSize={5} color={`${chain.color}.500`} />
                            <Text fontWeight="bold">{chain.name}</Text>
                          </HStack>
                          <VStack align="end" spacing={1}>
                            <Text fontSize="sm" color="gray.600">
                              {allocation.toFixed(1)}% = ${amount.toFixed(2)}
                            </Text>
                            <Progress
                              value={allocation}
                              size="sm"
                              colorScheme={chain.color}
                              width="100px"
                            />
                          </VStack>
                        </HStack>
                        <Slider
                          value={allocation}
                          onChange={(value) => handleAllocationChange(chainId, value)}
                          min={0}
                          max={100}
                          step={1}
                          mt={2}
                        >
                          <SliderTrack>
                            <SliderFilledTrack />
                          </SliderTrack>
                          <SliderThumb />
                        </Slider>
                      </Box>
                    );
                  })}
                </VStack>
              </Box>
            )}
          </VStack>
        </CardBody>
      </Card>

      {/* Gas Estimation */}
      <Card>
        <CardHeader>
          <Heading size="md">⛽ Gas Estimation</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text>Estimated Gas Cost:</Text>
              <Badge colorScheme="orange" fontSize="lg">
                {estimatedGas.toFixed(3)} ETH
              </Badge>
            </HStack>
            <HStack justify="space-between">
              <Text>Selected Networks:</Text>
              <Text fontWeight="bold">{selectedChains.length}</Text>
            </HStack>
            <Alert status="info">
              <AlertIcon />
              Gas costs are estimated and may vary based on network conditions
            </Alert>
          </VStack>
        </CardBody>
      </Card>

      {/* Cross-Chain Batch Status */}
      {crossChainBatchData && (
        <Card>
          <CardHeader>
            <Heading size="md">📊 Cross-Chain Batch Status</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Text>Total Participants:</Text>
                <Badge colorScheme="blue">
                  {crossChainBatchData.userCount || 0}
                </Badge>
              </HStack>
              <HStack justify="space-between">
                <Text>Batch ID:</Text>
                <Text fontWeight="bold">{crossChainBatchData.batchId || 'N/A'}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Status:</Text>
                <Badge colorScheme={crossChainBatchData.isExecuted ? 'green' : 'yellow'}>
                  {crossChainBatchData.isExecuted ? 'Executed' : 'Pending'}
                </Badge>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Action Buttons */}
      <HStack spacing={4}>
        <Button
          colorScheme="purple"
          size="lg"
          onClick={handleSubmitCrossChainIntent}
          isLoading={isLoading || isSubmitting}
          loadingText="Submitting Intent"
          isDisabled={selectedChains.length === 0}
          flex={1}
        >
          🚀 Submit Cross-Chain Intent
        </Button>
        <Button
          colorScheme="green"
          size="lg"
          onClick={handleExecuteCrossChainBatch}
          isLoading={isExecuting}
          loadingText="Executing Batch"
          flex={1}
        >
          ⚡ Execute Cross-Chain Batch
        </Button>
      </HStack>

      {/* Cross-Chain Strategy Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>🌐 Cross-Chain Strategy Summary</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={6} align="stretch">
              <Alert status="success">
                <AlertIcon />
                <Box>
                  <AlertTitle>Cross-Chain Strategy Created!</AlertTitle>
                  <AlertDescription>
                    Your DCA strategy has been distributed across {selectedChains.length} networks.
                  </AlertDescription>
                </Box>
              </Alert>

              <Card>
                <CardHeader>
                  <Heading size="sm">📊 Strategy Breakdown</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={3} align="stretch">
                    {selectedChains.map((chainId) => {
                      const chain = CHAIN_CONFIG[chainId];
                      const allocation = chainAllocations[chainId];
                      const amount = (totalAmount * allocation) / 100;
                      
                      return (
                        <HStack key={chainId} justify="space-between" p={2} bg="gray.50" borderRadius="md">
                          <HStack>
                            <Icon as={chain.icon} boxSize={5} color={`${chain.color}.500`} />
                            <Text fontWeight="bold">{chain.name}</Text>
                          </HStack>
                          <VStack align="end" spacing={0}>
                            <Text fontWeight="bold">${amount.toFixed(2)}</Text>
                            <Text fontSize="sm" color="gray.600">{allocation.toFixed(1)}%</Text>
                          </VStack>
                        </HStack>
                      );
                    })}
                  </VStack>
                </CardBody>
              </Card>

              <HStack spacing={4}>
                <Button colorScheme="purple" onClick={onClose} flex={1}>
                  Close
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};
