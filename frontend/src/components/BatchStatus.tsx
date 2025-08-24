import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Progress,
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
} from '@chakra-ui/react';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import { formatDistanceToNow } from 'date-fns';

// Contract ABI (simplified)
const CONTRACT_ABI = [
  {
    inputs: [],
    name: 'getCurrentBatch',
    outputs: [
      { name: 'totalAmount', type: 'uint256' },
      { name: 'userCount', type: 'uint32' },
      { name: 'batchId', type: 'uint32' },
      { name: 'isExecuted', type: 'bool' },
      { name: 'createdAt', type: 'uint32' },
      { name: 'participants', type: 'address[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'executeBatch',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

const CONTRACT_ADDRESS = '0x...'; // Replace with deployed contract address

export const BatchStatus: React.FC = () => {
  const { address, isConnected } = useAccount();
  const toast = useToast();

  // Read current batch status
  const { data: batchData, refetch } = useContractRead({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getCurrentBatch',
    watch: true,
  });

  // Execute batch function
  const { write: executeBatch, isLoading: isExecuting } = useContractWrite({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'executeBatch',
  });

  const handleExecuteBatch = async () => {
    if (!executeBatch) return;

    try {
      await executeBatch();
      toast({
        title: 'Batch execution initiated',
        description: 'The batch is being processed on the blockchain',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error executing batch:', error);
      toast({
        title: 'Error executing batch',
        description: 'There was an error executing the batch',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (!batchData) {
    return (
      <Card>
        <CardHeader>
          <Heading size="md">Current Batch Status</Heading>
        </CardHeader>
        <CardBody>
          <Text color="gray.500">Loading batch information...</Text>
        </CardBody>
      </Card>
    );
  }

  const [totalAmount, userCount, batchId, isExecuted, createdAt, participants] = batchData;
  const batchAge = createdAt ? formatDistanceToNow(new Date(createdAt * 1000), { addSuffix: true }) : 'N/A';
  const batchProgress = Math.min((userCount / 10) * 100, 100); // Target: 10 users per batch

  return (
    <Card>
      <CardHeader>
        <HStack justify="space-between">
          <Heading size="md">Current Batch Status</Heading>
          <Badge colorScheme={isExecuted ? 'green' : 'blue'} fontSize="sm">
            {isExecuted ? 'Executed' : 'Active'}
          </Badge>
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack spacing={6} align="stretch">
          {/* Batch Progress */}
          <Box>
            <HStack justify="space-between" mb={2}>
              <Text fontWeight="medium">Batch Progress</Text>
              <Text fontSize="sm" color="gray.600">
                {userCount}/10 users
              </Text>
            </HStack>
            <Progress value={batchProgress} colorScheme="purple" size="lg" />
            <Text fontSize="sm" color="gray.600" mt={1}>
              {userCount < 5 ? 'Need at least 5 users to execute' : 'Ready for execution'}
            </Text>
          </Box>

          {/* Batch Statistics */}
          <HStack spacing={8} justify="space-between">
            <Stat>
              <StatLabel>Total Amount</StatLabel>
              <StatNumber>{(Number(totalAmount) / 1e6).toFixed(2)} USDC</StatNumber>
              <StatHelpText>Encrypted total</StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Participants</StatLabel>
              <StatNumber>{userCount}</StatNumber>
              <StatHelpText>Current batch</StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Batch Age</StatLabel>
              <StatNumber fontSize="lg">{batchAge}</StatNumber>
              <StatHelpText>Time since creation</StatHelpText>
            </Stat>
          </HStack>

          {/* Batch ID */}
          <Box p={4} bg="gray.50" borderRadius="md">
            <Text fontSize="sm" color="gray.600">
              Batch ID: {batchId.toString()}
            </Text>
          </Box>

          {/* Execute Button */}
          {isConnected && userCount >= 5 && !isExecuted && (
            <Button
              colorScheme="green"
              size="lg"
              onClick={handleExecuteBatch}
              isLoading={isExecuting}
              loadingText="Executing Batch..."
            >
              Execute Batch
            </Button>
          )}

          {/* Privacy Notice */}
          <Box p={4} bg="purple.50" borderRadius="md" border="1px" borderColor="purple.200">
            <Text fontSize="sm" color="purple.800">
              🔒 <strong>Privacy Protected:</strong> Individual user amounts and strategies remain encrypted.
              Only aggregated batch information is visible.
            </Text>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
};
