import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Button,
  useToast,
  Alert,
  AlertIcon,
  Divider,
} from '@chakra-ui/react';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Contract ABI (simplified)
const CONTRACT_ABI = [
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getUserStrategy',
    outputs: [
      { name: 'budget', type: 'uint256' },
      { name: 'purchaseAmount', type: 'uint256' },
      { name: 'timeframe', type: 'uint32' },
      { name: 'frequency', type: 'uint32' },
      { name: 'lastPurchaseTime', type: 'uint32' },
      { name: 'purchasesMade', type: 'uint32' },
      { name: 'remainingBudget', type: 'uint256' },
      { name: 'isActive', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'withdrawShares',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'emergencyWithdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

const CONTRACT_ADDRESS = '0x...'; // Replace with deployed contract address

export const UserDashboard: React.FC = () => {
  const { address, isConnected } = useAccount();
  const toast = useToast();

  // Read user strategy
  const { data: strategyData, refetch } = useContractRead({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getUserStrategy',
    args: [address as `0x${string}`],
    enabled: !!address,
    watch: true,
  });

  // Withdraw shares function
  const { write: withdrawShares, isLoading: isWithdrawing } = useContractWrite({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'withdrawShares',
  });

  // Emergency withdraw function
  const { write: emergencyWithdraw, isLoading: isEmergencyWithdrawing } = useContractWrite({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'emergencyWithdraw',
  });

  const handleWithdrawShares = async () => {
    if (!withdrawShares) return;

    try {
      await withdrawShares();
      toast({
        title: 'Withdrawal initiated',
        description: 'Your ETH shares are being transferred to your wallet',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error withdrawing shares:', error);
      toast({
        title: 'Error withdrawing shares',
        description: 'There was an error withdrawing your shares',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEmergencyWithdraw = async () => {
    if (!emergencyWithdraw) return;

    try {
      await emergencyWithdraw();
      toast({
        title: 'Emergency withdrawal initiated',
        description: 'Your USDC is being returned to your wallet',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error emergency withdrawing:', error);
      toast({
        title: 'Error emergency withdrawing',
        description: 'There was an error processing your emergency withdrawal',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <Heading size="md">User Dashboard</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4}>
            <Text color="gray.600">Connect your wallet to view your DCA strategy</Text>
            <ConnectButton />
          </VStack>
        </CardBody>
      </Card>
    );
  }

  if (!strategyData) {
    return (
      <Card>
        <CardHeader>
          <Heading size="md">User Dashboard</Heading>
        </CardHeader>
        <CardBody>
          <Text color="gray.500">Loading your strategy...</Text>
        </CardBody>
      </Card>
    );
  }

  const [
    budget,
    purchaseAmount,
    timeframe,
    frequency,
    lastPurchaseTime,
    purchasesMade,
    remainingBudget,
    isActive,
  ] = strategyData;

  const budgetUsdc = Number(budget) / 1e6;
  const purchaseAmountUsdc = Number(purchaseAmount) / 1e6;
  const remainingBudgetUsdc = Number(remainingBudget) / 1e6;

  return (
    <Card>
      <CardHeader>
        <HStack justify="space-between">
          <Heading size="md">Your DCA Strategy</Heading>
          <Badge colorScheme={isActive ? 'green' : 'red'} fontSize="sm">
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack spacing={6} align="stretch">
          {/* Strategy Status */}
          {!isActive && (
            <Alert status="warning">
              <AlertIcon />
              Your strategy is currently inactive. Create a new strategy to start DCA.
            </Alert>
          )}

          {/* Strategy Statistics */}
          <HStack spacing={8} justify="space-between">
            <Stat>
              <StatLabel>Total Budget</StatLabel>
              <StatNumber>{budgetUsdc.toFixed(2)} USDC</StatNumber>
              <StatHelpText>Encrypted amount</StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Purchase Amount</StatLabel>
              <StatNumber>{purchaseAmountUsdc.toFixed(2)} USDC</StatNumber>
              <StatHelpText>Per interval</StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Remaining Budget</StatLabel>
              <StatNumber color={remainingBudgetUsdc < 0 ? 'red.500' : 'green.500'}>
                {remainingBudgetUsdc.toFixed(2)} USDC
              </StatNumber>
              <StatHelpText>Available for DCA</StatHelpText>
            </Stat>
          </HStack>

          {/* Strategy Details */}
          <Box p={4} bg="gray.50" borderRadius="md">
            <VStack spacing={3} align="start">
              <HStack>
                <Text fontWeight="medium">Strategy Duration:</Text>
                <Badge colorScheme="blue">
                  {Math.floor(Number(timeframe) / 86400)} days
                </Badge>
              </HStack>
              <HStack>
                <Text fontWeight="medium">Purchase Frequency:</Text>
                <Badge colorScheme="purple">
                  Every {Math.floor(Number(frequency) / 3600)} hours
                </Badge>
              </HStack>
              <HStack>
                <Text fontWeight="medium">Purchases Made:</Text>
                <Badge colorScheme="green">{purchasesMade.toString()}</Badge>
              </HStack>
              {lastPurchaseTime > 0 && (
                <HStack>
                  <Text fontWeight="medium">Last Purchase:</Text>
                  <Badge colorScheme="orange">
                    {new Date(Number(lastPurchaseTime) * 1000).toLocaleDateString()}
                  </Badge>
                </HStack>
              )}
            </VStack>
          </Box>

          <Divider />

          {/* Action Buttons */}
          <VStack spacing={3}>
            <Button
              colorScheme="purple"
              size="lg"
              width="full"
              onClick={handleWithdrawShares}
              isLoading={isWithdrawing}
              loadingText="Withdrawing Shares..."
              isDisabled={!isActive}
            >
              Withdraw ETH Shares
            </Button>

            <Button
              colorScheme="red"
              variant="outline"
              size="md"
              width="full"
              onClick={handleEmergencyWithdraw}
              isLoading={isEmergencyWithdrawing}
              loadingText="Emergency Withdrawing..."
            >
              Emergency Withdraw USDC
            </Button>
          </VStack>

          {/* Privacy Notice */}
          <Box p={4} bg="purple.50" borderRadius="md" border="1px" borderColor="purple.200">
            <Text fontSize="sm" color="purple.800">
              🔒 <strong>Your Privacy:</strong> All strategy details are encrypted on-chain.
              Only you can see your actual investment amounts and timing.
            </Text>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
};
