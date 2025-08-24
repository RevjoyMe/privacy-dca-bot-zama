import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Text,
  useToast,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Divider,
  Badge,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { useForm } from 'react-hook-form';
import { useFheEncryption } from '../hooks';

// Contract ABI (simplified)
const CONTRACT_ABI = [
  {
    inputs: [
      { name: 'encryptedBudget', type: 'bytes' },
      { name: 'encryptedPurchaseAmount', type: 'bytes' },
      { name: 'encryptedTimeframe', type: 'bytes' },
      { name: 'encryptedFrequency', type: 'bytes' },
    ],
    name: 'createStrategy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

const CONTRACT_ADDRESS = '0x...'; // Replace with deployed contract address

interface DCAStrategyFormData {
  budget: string;
  purchaseAmount: string;
  timeframe: string;
  frequency: string;
}

export const DCAStrategyForm: React.FC = () => {
  const { address, isConnected } = useAccount();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { encrypt, isLoading: isFheLoading, error: fheError, isInitialized } = useFheEncryption();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<DCAStrategyFormData>();

  const budget = watch('budget');
  const purchaseAmount = watch('purchaseAmount');
  const timeframe = watch('timeframe');
  const frequency = watch('frequency');

  // Calculate strategy summary
  const calculateStrategy = () => {
    if (!budget || !purchaseAmount || !timeframe || !frequency) return null;

    const budgetNum = parseFloat(budget);
    const purchaseNum = parseFloat(purchaseAmount);
    const timeframeNum = parseInt(timeframe);
    const frequencyNum = parseInt(frequency);

    if (budgetNum && purchaseNum && timeframeNum && frequencyNum) {
      const totalPurchases = Math.floor(timeframeNum / frequencyNum);
      const totalInvestment = totalPurchases * purchaseNum;
      const remainingBudget = budgetNum - totalInvestment;

      return {
        totalPurchases,
        totalInvestment,
        remainingBudget,
        isOverBudget: remainingBudget < 0,
      };
    }
    return null;
  };

  const strategy = calculateStrategy();

  // Prepare contract write
  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'createStrategy',
    enabled: false, // We'll enable it when we have encrypted data
  });

  const { write: createStrategy, isLoading: isCreating } = useContractWrite(config);

  const onSubmit = async (data: DCAStrategyFormData) => {
    if (!isConnected) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to create a strategy',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!isInitialized) {
      toast({
        title: 'FHE not initialized',
        description: 'Please wait for FHE encryption to initialize',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (strategy?.isOverBudget) {
      toast({
        title: 'Invalid strategy',
        description: 'Total investment exceeds budget',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      // Encrypt data using FHE
      const encryptedBudget = await encrypt(parseFloat(data.budget) * 100); // Multiply by 100 for precision
      const encryptedPurchaseAmount = await encrypt(parseFloat(data.purchaseAmount) * 100);
      const encryptedTimeframe = await encrypt(parseInt(data.timeframe));
      const encryptedFrequency = await encrypt(parseInt(data.frequency));

      if (createStrategy) {
        await createStrategy({
          args: [
            encryptedBudget,
            encryptedPurchaseAmount,
            encryptedTimeframe,
            encryptedFrequency,
          ],
        });

        toast({
          title: 'Strategy created',
          description: 'Your encrypted DCA strategy has been created successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        reset();
      }
    } catch (error) {
      console.error('Error creating strategy:', error);
      toast({
        title: 'Error creating strategy',
        description: 'There was an error creating your encrypted strategy',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <Heading size="md">Create DCA Strategy</Heading>
        </CardHeader>
        <CardBody>
          <Alert status="info">
            <AlertIcon />
            Please connect your wallet to create a DCA strategy
          </Alert>
        </CardBody>
      </Card>
    );
  }

  if (!isInitialized) {
    return (
      <Card>
        <CardHeader>
          <Heading size="md">Create DCA Strategy</Heading>
        </CardHeader>
        <CardBody>
          <Alert status="info">
            <AlertIcon />
            Initializing FHE encryption...
          </Alert>
        </CardBody>
      </Card>
    );
  }

  if (fheError) {
    return (
      <Card>
        <CardHeader>
          <Heading size="md">Create DCA Strategy</Heading>
        </CardHeader>
        <CardBody>
          <Alert status="error">
            <AlertIcon />
            FHE initialization failed: {fheError}
          </Alert>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Create DCA Strategy</Heading>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={6} align="stretch">
            <HStack spacing={4}>
              <FormControl isInvalid={!!errors.budget}>
                <FormLabel>Budget (USDC)</FormLabel>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="1000"
                  {...register('budget', { required: 'Budget is required' })}
                />
                {errors.budget && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.budget.message}
                  </Text>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.purchaseAmount}>
                <FormLabel>Purchase Amount (USDC)</FormLabel>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="100"
                  {...register('purchaseAmount', { required: 'Purchase amount is required' })}
                />
                {errors.purchaseAmount && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.purchaseAmount.message}
                  </Text>
                )}
              </FormControl>
            </HStack>

            <HStack spacing={4}>
              <FormControl isInvalid={!!errors.timeframe}>
                <FormLabel>Timeframe (hours)</FormLabel>
                <Select
                  placeholder="Select timeframe"
                  {...register('timeframe', { required: 'Timeframe is required' })}
                >
                  <option value="24">24 hours</option>
                  <option value="168">1 week</option>
                  <option value="720">1 month</option>
                  <option value="8760">1 year</option>
                </Select>
                {errors.timeframe && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.timeframe.message}
                  </Text>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.frequency}>
                <FormLabel>Frequency (hours)</FormLabel>
                <Select
                  placeholder="Select frequency"
                  {...register('frequency', { required: 'Frequency is required' })}
                >
                  <option value="1">1 hour</option>
                  <option value="6">6 hours</option>
                  <option value="12">12 hours</option>
                  <option value="24">24 hours</option>
                </Select>
                {errors.frequency && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.frequency.message}
                  </Text>
                )}
              </FormControl>
            </HStack>

            {strategy && (
              <Box p={4} border="1px" borderColor="gray.200" borderRadius="md">
                <VStack spacing={2} align="start">
                  <Text fontWeight="bold">Strategy Summary:</Text>
                  <HStack spacing={4}>
                    <Badge colorScheme="blue">
                      Total Purchases: {strategy.totalPurchases}
                    </Badge>
                    <Badge colorScheme="green">
                      Total Investment: ${strategy.totalInvestment.toFixed(2)}
                    </Badge>
                    <Badge colorScheme={strategy.isOverBudget ? 'red' : 'gray'}>
                      Remaining: ${strategy.remainingBudget.toFixed(2)}
                    </Badge>
                  </HStack>
                  {strategy.isOverBudget && (
                    <Alert status="warning">
                      <AlertIcon />
                      Total investment exceeds budget
                    </Alert>
                  )}
                </VStack>
              </Box>
            )}

            <Button
              type="submit"
              colorScheme="purple"
              size="lg"
              isLoading={isLoading || isCreating}
              loadingText="Creating Strategy"
              isDisabled={strategy?.isOverBudget}
            >
              Create Strategy
            </Button>
          </VStack>
        </form>
      </CardBody>
    </Card>
  );
};
