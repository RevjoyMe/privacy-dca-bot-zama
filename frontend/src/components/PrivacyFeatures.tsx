import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Icon,
  SimpleGrid,
  Badge,
  Button,
  Input,
  Alert,
  AlertIcon,
  Code,
  useToast,
} from '@chakra-ui/react';
import { 
  LockIcon, 
  ShieldIcon, 
  EyeIcon, 
  UsersIcon,
  ChartBarIcon,
  CogIcon 
} from '@chakra-ui/icons';
import { useAccount } from 'wagmi';
import { useFheEncryption } from '../hooks';
import { formatEncryptedData } from '../utils';

const privacyFeatures = [
  {
    icon: LockIcon,
    title: 'End-to-End Encryption',
    description: 'All strategy parameters are encrypted using FHE, ensuring complete privacy of your investment amounts and timing.',
    color: 'purple',
  },
  {
    icon: UsersIcon,
    title: 'K-Anonymity Protection',
    description: 'Your transactions are batched with other users, providing k-anonymity where k=10 users per batch.',
    color: 'blue',
  },
  {
    icon: ShieldIcon,
    title: 'MEV Protection',
    description: 'Batched transactions prevent front-running and MEV attacks by hiding individual trading patterns.',
    color: 'green',
  },
  {
    icon: EyeIcon,
    title: 'Zero Information Leakage',
    description: 'No individual purchase amounts, frequencies, or strategies are visible on the blockchain.',
    color: 'red',
  },
  {
    icon: ChartBarIcon,
    title: 'Portfolio Privacy',
    description: 'Your total investment amounts and wealth remain completely hidden from competitors and trackers.',
    color: 'orange',
  },
  {
    icon: CogIcon,
    title: 'Automated Execution',
    description: 'Chainlink Automation ensures reliable, decentralized execution without revealing your strategy.',
    color: 'teal',
  },
];

export const PrivacyFeatures: React.FC = () => {
  const { isConnected } = useAccount();
  const toast = useToast();
  const { encrypt, decrypt, isLoading, error, isInitialized } = useFheEncryption();
  const [demoValue, setDemoValue] = useState('100');
  const [encryptedValue, setEncryptedValue] = useState<string>('');
  const [decryptedValue, setDecryptedValue] = useState<string>('');

  const handleEncrypt = async () => {
    if (!isInitialized) {
      toast({
        title: 'FHE not initialized',
        description: 'Please connect your wallet first',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const value = parseFloat(demoValue);
      const encrypted = await encrypt(value);
      setEncryptedValue(encrypted);
      setDecryptedValue('');
      
      toast({
        title: 'Data Encrypted',
        description: 'Your data has been encrypted using FHE',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Encryption error:', error);
      toast({
        title: 'Encryption Failed',
        description: 'Failed to encrypt data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDecrypt = async () => {
    if (!isInitialized || !encryptedValue) {
      toast({
        title: 'Cannot Decrypt',
        description: 'No encrypted data available',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const decrypted = await decrypt(encryptedValue);
      setDecryptedValue(decrypted.toString());
      
      toast({
        title: 'Data Decrypted',
        description: 'Your data has been decrypted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Decryption error:', error);
      toast({
        title: 'Decryption Failed',
        description: 'Failed to decrypt data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <VStack spacing={2} align="start">
          <Heading size="lg">🔒 Privacy Features</Heading>
          <Text color="gray.600">
            Complete privacy protection for your DCA strategy using state-of-the-art FHE technology from Zama
          </Text>
        </VStack>
      </CardHeader>
      <CardBody>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {privacyFeatures.map((feature, index) => (
            <Box
              key={index}
              p={6}
              border="1px"
              borderColor={`${feature.color}.200`}
              borderRadius="lg"
              bg={`${feature.color}.50`}
              _hover={{
                transform: 'translateY(-2px)',
                shadow: 'lg',
                transition: 'all 0.2s',
              }}
            >
              <VStack spacing={4} align="start">
                <HStack>
                  <Icon
                    as={feature.icon}
                    boxSize={6}
                    color={`${feature.color}.500`}
                  />
                  <Badge colorScheme={feature.color} variant="subtle">
                    {feature.title}
                  </Badge>
                </HStack>
                <Text fontSize="sm" color="gray.700">
                  {feature.description}
                </Text>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>

        {/* FHE Demo */}
        {isConnected && isInitialized && (
          <Box mt={8} p={6} bg="purple.50" borderRadius="lg" border="1px" borderColor="purple.200">
            <VStack spacing={4} align="start">
              <Heading size="md" color="purple.700">🔐 Live FHE Demo</Heading>
              <Text fontSize="sm" color="purple.700">
                Experience real FHE encryption and decryption using Zama's technology
              </Text>
              
              <HStack spacing={4} width="full">
                <VStack spacing={2} align="start" flex={1}>
                  <Text fontSize="sm" fontWeight="bold">Original Value:</Text>
                  <Input
                    value={demoValue}
                    onChange={(e) => setDemoValue(e.target.value)}
                    placeholder="Enter a number"
                    size="sm"
                  />
                </VStack>
                
                <VStack spacing={2} align="start" flex={1}>
                  <Text fontSize="sm" fontWeight="bold">Encrypted Value:</Text>
                  <Code p={2} bg="gray.100" fontSize="xs" width="full">
                    {encryptedValue ? formatEncryptedData(encryptedValue) : 'Not encrypted yet'}
                  </Code>
                </VStack>
                
                <VStack spacing={2} align="start" flex={1}>
                  <Text fontSize="sm" fontWeight="bold">Decrypted Value:</Text>
                  <Code p={2} bg="gray.100" fontSize="xs" width="full">
                    {decryptedValue || 'Not decrypted yet'}
                  </Code>
                </VStack>
              </HStack>
              
              <HStack spacing={4}>
                <Button
                  colorScheme="purple"
                  size="sm"
                  onClick={handleEncrypt}
                  isLoading={isLoading}
                  loadingText="Encrypting"
                >
                  🔒 Encrypt
                </Button>
                <Button
                  colorScheme="green"
                  size="sm"
                  onClick={handleDecrypt}
                  isLoading={isLoading}
                  loadingText="Decrypting"
                  isDisabled={!encryptedValue}
                >
                  🔓 Decrypt
                </Button>
              </HStack>
            </VStack>
          </Box>
        )}

        {!isConnected && (
          <Alert status="info" mt={6}>
            <AlertIcon />
            Connect your wallet to experience live FHE encryption and decryption
          </Alert>
        )}

        {error && (
          <Alert status="error" mt={6}>
            <AlertIcon />
            FHE Error: {error}
          </Alert>
        )}

        {/* How it works */}
        <Box mt={8} p={6} bg="gray.50" borderRadius="lg">
          <VStack spacing={4} align="start">
            <Heading size="md">How FHE Privacy Works</Heading>
            <VStack spacing={3} align="start">
              <HStack>
                <Badge colorScheme="purple">1</Badge>
                <Text fontSize="sm">
                  <strong>Encrypt:</strong> Your DCA parameters are encrypted using FHE before being sent to the blockchain
                </Text>
              </HStack>
              <HStack>
                <Badge colorScheme="blue">2</Badge>
                <Text fontSize="sm">
                  <strong>Batch:</strong> Your encrypted intent is combined with 9 other users into a single batch
                </Text>
              </HStack>
              <HStack>
                <Badge colorScheme="green">3</Badge>
                <Text fontSize="sm">
                  <strong>Execute:</strong> The batch executes as a single transaction on Uniswap, hiding individual amounts
                </Text>
              </HStack>
              <HStack>
                <Badge colorScheme="orange">4</Badge>
                <Text fontSize="sm">
                  <strong>Distribute:</strong> ETH shares are calculated and distributed proportionally using encrypted math
                </Text>
              </HStack>
            </VStack>
          </VStack>
        </Box>

        {/* Privacy vs Traditional */}
        <Box mt={6} p={6} bg="red.50" borderRadius="lg" border="1px" borderColor="red.200">
          <VStack spacing={4} align="start">
            <Heading size="md" color="red.700">Traditional DCA vs Privacy DCA</Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} width="full">
              <Box>
                <Text fontWeight="bold" color="red.700" mb={2}>❌ Traditional DCA</Text>
                <VStack spacing={2} align="start" fontSize="sm">
                  <Text>• Individual transactions visible</Text>
                  <Text>• Purchase amounts exposed</Text>
                  <Text>• Trading patterns tracked</Text>
                  <Text>• Vulnerable to MEV attacks</Text>
                  <Text>• Portfolio profiling possible</Text>
                </VStack>
              </Box>
              <Box>
                <Text fontWeight="bold" color="green.700" mb={2}>✅ Privacy DCA with FHE</Text>
                <VStack spacing={2} align="start" fontSize="sm">
                  <Text>• Batched transactions only</Text>
                  <Text>• Encrypted amounts using FHE</Text>
                  <Text>• Hidden trading patterns</Text>
                  <Text>• MEV protection</Text>
                  <Text>• Complete privacy with Zama FHE</Text>
                </VStack>
              </Box>
            </SimpleGrid>
          </VStack>
        </Box>
      </CardBody>
    </Card>
  );
};
