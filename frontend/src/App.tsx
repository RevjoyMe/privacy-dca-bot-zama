import React from 'react';
import { ChakraProvider, Box, VStack, Heading, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { fhevmTestnet } from './chains/fhevmTestnet';
import { publicProvider } from 'wagmi/providers/public';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

import { DCAStrategyForm } from './components/DCAStrategyForm';
import { BatchStatus } from './components/BatchStatus';
import { UserDashboard } from './components/UserDashboard';
import { PrivacyFeatures } from './components/PrivacyFeatures';
import { AIOptimization } from './components/AIOptimization';
import { CrossChainDCA } from './components/CrossChainDCA';
import { Gamification } from './components/Gamification';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [fhevmTestnet],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'Privacy DCA Bot',
  projectId: 'YOUR_PROJECT_ID', // Replace with your WalletConnect project ID
  chains,
});

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function App() {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains}>
        <ChakraProvider>
          <Box minH="100vh" bg="gray.50">
            <Box as="header" bg="white" shadow="sm" py={6}>
              <Box maxW="7xl" mx="auto" px={4}>
                <VStack spacing={2} align="start">
                  <Heading size="lg" color="purple.600">
                    🔒 Privacy DCA Bot
                  </Heading>
                  <Text color="gray.600" fontSize="md">
                    Dollar-Cost Averaging with Complete Privacy using FHE
                  </Text>
                </VStack>
              </Box>
            </Box>

            <Box as="main" maxW="7xl" mx="auto" px={4} py={8}>
              <Tabs variant="enclosed" colorScheme="purple">
                <TabList>
                  <Tab>🏠 Dashboard</Tab>
                  <Tab>🤖 AI Optimization</Tab>
                  <Tab>🌐 Cross-Chain</Tab>
                  <Tab>🏆 Achievements</Tab>
                  <Tab>🔒 Privacy</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <VStack spacing={8} align="stretch">
                      {/* User Dashboard */}
                      <UserDashboard />

                      {/* DCA Strategy Form */}
                      <DCAStrategyForm />

                      {/* Batch Status */}
                      <BatchStatus />
                    </VStack>
                  </TabPanel>

                  <TabPanel>
                    <AIOptimization 
                      contractAddress="0x..." // Replace with actual contract address
                      abi={[]} // Replace with actual ABI
                    />
                  </TabPanel>

                  <TabPanel>
                    <CrossChainDCA 
                      contractAddress="0x..." // Replace with actual contract address
                      abi={[]} // Replace with actual ABI
                    />
                  </TabPanel>

                  <TabPanel>
                    <Gamification 
                      contractAddress="0x..." // Replace with actual contract address
                      abi={[]} // Replace with actual ABI
                      nftContractAddress="0x..." // Replace with actual NFT contract address
                      nftAbi={[]} // Replace with actual NFT ABI
                    />
                  </TabPanel>

                  <TabPanel>
                    <PrivacyFeatures />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </Box>
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
