import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Badge,
  Progress,
  Grid,
  GridItem,
  Image,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  Icon,
  Tooltip,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Switch,
  FormControl,
  FormLabel
} from '@chakra-ui/react';
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import { FaTrophy, FaLock, FaUnlock, FaEye, FaEyeSlash, FaCrown, FaStar } from 'react-icons/fa';

interface GamificationProps {
  contractAddress: string;
  abi: any;
  nftContractAddress: string;
  nftAbi: any;
}

export enum AchievementType {
  FIRST_STRATEGY = 0,
  CONSISTENT_INVESTOR = 1,
  AI_OPTIMIZER = 2,
  CROSS_CHAIN_EXPLORER = 3,
  PRIVACY_CHAMPION = 4,
  BATCH_MASTER = 5
}

interface Achievement {
  id: AchievementType;
  name: string;
  description: string;
  icon: string;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  threshold: number;
  isEarned: boolean;
  isPrivate: boolean;
  earnedAt?: number;
  tokenId?: number;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: AchievementType.FIRST_STRATEGY,
    name: 'First Steps',
    description: 'Created your first DCA strategy',
    icon: '🚀',
    color: 'green',
    rarity: 'common',
    threshold: 1,
    isEarned: false,
    isPrivate: false
  },
  {
    id: AchievementType.CONSISTENT_INVESTOR,
    name: 'Consistent Investor',
    description: 'Made 10+ DCA purchases',
    icon: '📈',
    color: 'blue',
    rarity: 'rare',
    threshold: 10,
    isEarned: false,
    isPrivate: false
  },
  {
    id: AchievementType.AI_OPTIMIZER,
    name: 'AI Optimizer',
    description: 'Used AI-powered strategy optimization',
    icon: '🤖',
    color: 'purple',
    rarity: 'epic',
    threshold: 5,
    isEarned: false,
    isPrivate: false
  },
  {
    id: AchievementType.CROSS_CHAIN_EXPLORER,
    name: 'Cross-Chain Explorer',
    description: 'DCA across multiple blockchains',
    icon: '🌐',
    color: 'orange',
    rarity: 'epic',
    threshold: 3,
    isEarned: false,
    isPrivate: false
  },
  {
    id: AchievementType.PRIVACY_CHAMPION,
    name: 'Privacy Champion',
    description: 'Enabled advanced privacy features',
    icon: '🔒',
    color: 'pink',
    rarity: 'legendary',
    threshold: 1,
    isEarned: false,
    isPrivate: false
  },
  {
    id: AchievementType.BATCH_MASTER,
    name: 'Batch Master',
    description: 'Participated in 20+ batch executions',
    icon: '⚡',
    color: 'cyan',
    rarity: 'legendary',
    threshold: 20,
    isEarned: false,
    isPrivate: false
  }
];

export const Gamification: React.FC<GamificationProps> = ({ 
  contractAddress, 
  abi, 
  nftContractAddress, 
  nftAbi 
}) => {
  const { address } = useAccount();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // State
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [userStats, setUserStats] = useState({
    totalStrategies: 0,
    totalPurchases: 0,
    aiOptimizations: 0,
    crossChainTransactions: 0,
    privacyFeatures: 0,
    batchParticipations: 0,
    totalPoints: 0
  });
  const [showPrivateAchievements, setShowPrivateAchievements] = useState(false);

  // Contract interactions
  const { data: userAchievementsData } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'getUserAchievements',
    args: [address],
  });

  const { data: nftData, write: mintNFT } = useContractWrite({
    address: nftContractAddress as `0x${string}`,
    abi: nftAbi,
    functionName: 'mintAchievement',
  });

  const { data: updatePrivacyData, write: updatePrivacy } = useContractWrite({
    address: nftContractAddress as `0x${string}`,
    abi: nftAbi,
    functionName: 'updateMetadataPrivacy',
  });

  const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess } = useWaitForTransaction({
    hash: nftData?.hash || updatePrivacyData?.hash,
  });

  useEffect(() => {
    if (address) {
      loadUserAchievements();
      loadUserStats();
    }
  }, [address, userAchievementsData]);

  useEffect(() => {
    if (isTransactionSuccess) {
      toast({
        title: 'Success',
        description: 'Achievement NFT operation completed successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onClose();
    }
  }, [isTransactionSuccess, toast, onClose]);

  const loadUserAchievements = async () => {
    if (!userAchievementsData) return;

    try {
      // Update achievements based on blockchain data
      const updatedAchievements = achievements.map(achievement => {
        const blockchainAchievement = userAchievementsData.find(
          (a: any) => a.achievementType === achievement.id
        );
        
        if (blockchainAchievement) {
          return {
            ...achievement,
            isEarned: true,
            earnedAt: blockchainAchievement.earnedAt,
            tokenId: blockchainAchievement.tokenId,
            isPrivate: blockchainAchievement.isPrivate
          };
        }
        
        return achievement;
      });

      setAchievements(updatedAchievements);
    } catch (error) {
      console.error('Error loading user achievements:', error);
    }
  };

  const loadUserStats = async () => {
    // In a real implementation, this would fetch from the blockchain
    // For now, we'll simulate some stats
    setUserStats({
      totalStrategies: 3,
      totalPurchases: 15,
      aiOptimizations: 8,
      crossChainTransactions: 5,
      privacyFeatures: 2,
      batchParticipations: 25,
      totalPoints: 1250
    });
  };

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    onOpen();
  };

  const handleMintNFT = async (achievement: Achievement) => {
    if (!achievement.isEarned) return;

    try {
      // Mint NFT for the achievement
      mintNFT({
        args: [
          address,
          achievement.id,
          achievement.isPrivate // Use current privacy setting
        ]
      });
    } catch (error) {
      console.error('Error minting NFT:', error);
      toast({
        title: 'Error',
        description: 'Failed to mint achievement NFT',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleTogglePrivacy = async (achievement: Achievement) => {
    if (!achievement.tokenId) return;

    try {
      updatePrivacy({
        args: [
          achievement.tokenId,
          !achievement.isPrivate,
          achievement.description
        ]
      });
    } catch (error) {
      console.error('Error updating privacy:', error);
      toast({
        title: 'Error',
        description: 'Failed to update achievement privacy',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getRarityColor = (rarity: string): string => {
    switch (rarity) {
      case 'common': return 'gray';
      case 'rare': return 'blue';
      case 'epic': return 'purple';
      case 'legendary': return 'orange';
      default: return 'gray';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <FaStar color="#gray" />;
      case 'rare': return <FaStar color="#blue" />;
      case 'epic': return <FaStar color="#purple" />;
      case 'legendary': return <FaCrown color="#orange" />;
      default: return <FaStar />;
    }
  };

  const getProgressPercentage = (achievement: Achievement): number => {
    switch (achievement.id) {
      case AchievementType.FIRST_STRATEGY:
        return userStats.totalStrategies >= achievement.threshold ? 100 : (userStats.totalStrategies / achievement.threshold) * 100;
      case AchievementType.CONSISTENT_INVESTOR:
        return userStats.totalPurchases >= achievement.threshold ? 100 : (userStats.totalPurchases / achievement.threshold) * 100;
      case AchievementType.AI_OPTIMIZER:
        return userStats.aiOptimizations >= achievement.threshold ? 100 : (userStats.aiOptimizations / achievement.threshold) * 100;
      case AchievementType.CROSS_CHAIN_EXPLORER:
        return userStats.crossChainTransactions >= achievement.threshold ? 100 : (userStats.crossChainTransactions / achievement.threshold) * 100;
      case AchievementType.PRIVACY_CHAMPION:
        return userStats.privacyFeatures >= achievement.threshold ? 100 : (userStats.privacyFeatures / achievement.threshold) * 100;
      case AchievementType.BATCH_MASTER:
        return userStats.batchParticipations >= achievement.threshold ? 100 : (userStats.batchParticipations / achievement.threshold) * 100;
      default:
        return 0;
    }
  };

  if (!address) {
    return (
      <Card>
        <CardBody>
          <Text>Please connect your wallet to view your achievements.</Text>
        </CardBody>
      </Card>
    );
  }

  const earnedAchievements = achievements.filter(a => a.isEarned);
  const visibleAchievements = showPrivateAchievements 
    ? achievements 
    : achievements.filter(a => !a.isPrivate || a.isEarned);

  return (
    <VStack spacing={6} align="stretch">
      {/* User Stats */}
      <Card>
        <CardHeader>
          <HStack>
            <Icon as={FaTrophy} color="gold" />
            <Heading size="md">🏆 Achievement Dashboard</Heading>
          </HStack>
        </CardHeader>
        <CardBody>
          <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
            <Stat>
              <StatLabel>Total Points</StatLabel>
              <StatNumber>{userStats.totalPoints}</StatNumber>
              <StatHelpText>Your achievement score</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Achievements Earned</StatLabel>
              <StatNumber>{earnedAchievements.length}</StatNumber>
              <StatHelpText>Out of {achievements.length} total</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Rarity Level</StatLabel>
              <StatNumber>
                {earnedAchievements.filter(a => a.rarity === 'legendary').length > 0 ? 'Legendary' :
                 earnedAchievements.filter(a => a.rarity === 'epic').length > 0 ? 'Epic' :
                 earnedAchievements.filter(a => a.rarity === 'rare').length > 0 ? 'Rare' : 'Common'}
              </StatNumber>
              <StatHelpText>Based on your achievements</StatHelpText>
            </Stat>
          </Grid>
        </CardBody>
      </Card>

      {/* Privacy Toggle */}
      <Card>
        <CardBody>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="show-private" mb="0">
              Show Private Achievements
            </FormLabel>
            <Switch
              id="show-private"
              isChecked={showPrivateAchievements}
              onChange={(e) => setShowPrivateAchievements(e.target.checked)}
              colorScheme="purple"
            />
          </FormControl>
        </CardBody>
      </Card>

      {/* Achievements Grid */}
      <Card>
        <CardHeader>
          <Heading size="md">🎯 Achievements</Heading>
        </CardHeader>
        <CardBody>
          <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={4}>
            {visibleAchievements.map((achievement) => {
              const progress = getProgressPercentage(achievement);
              const isCompleted = progress >= 100;

              return (
                <GridItem key={achievement.id}>
                  <Card
                    variant={achievement.isEarned ? 'filled' : 'outline'}
                    borderColor={achievement.isEarned ? `${achievement.color}.500` : 'gray.200'}
                    cursor="pointer"
                    onClick={() => handleAchievementClick(achievement)}
                    _hover={{ borderColor: `${achievement.color}.300` }}
                  >
                    <CardBody>
                      <VStack spacing={3} align="stretch">
                        <HStack justify="space-between">
                          <HStack>
                            <Text fontSize="2xl">{achievement.icon}</Text>
                            <VStack align="start" spacing={0}>
                              <Text fontWeight="bold">{achievement.name}</Text>
                              <Text fontSize="sm" color="gray.500">
                                {achievement.description}
                              </Text>
                            </VStack>
                          </HStack>
                          <VStack align="end" spacing={1}>
                            <Badge colorScheme={getRarityColor(achievement.rarity)}>
                              {achievement.rarity.toUpperCase()}
                            </Badge>
                            {achievement.isPrivate && (
                              <Icon as={FaLock} color="gray.500" />
                            )}
                            {achievement.isEarned && (
                              <Icon as={FaTrophy} color="gold" />
                            )}
                          </VStack>
                        </HStack>

                        <Progress
                          value={progress}
                          colorScheme={isCompleted ? 'green' : 'blue'}
                          size="sm"
                        />

                        <HStack justify="space-between">
                          <Text fontSize="sm" color="gray.500">
                            Progress: {Math.round(progress)}%
                          </Text>
                          {achievement.isEarned && (
                            <HStack spacing={2}>
                              {achievement.tokenId && (
                                <Button
                                  size="sm"
                                  colorScheme="purple"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTogglePrivacy(achievement);
                                  }}
                                >
                                  <Icon as={achievement.isPrivate ? FaEye : FaEyeSlash} />
                                </Button>
                              )}
                              {!achievement.tokenId && (
                                <Button
                                  size="sm"
                                  colorScheme="green"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMintNFT(achievement);
                                  }}
                                  isLoading={isTransactionLoading}
                                >
                                  Mint NFT
                                </Button>
                              )}
                            </HStack>
                          )}
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>
                </GridItem>
              );
            })}
          </Grid>
        </CardBody>
      </Card>

      {/* Achievement Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Achievement Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedAchievement && (
              <VStack spacing={6} align="stretch">
                <Alert status={selectedAchievement.isEarned ? 'success' : 'info'}>
                  <AlertIcon />
                  <Box>
                    <AlertTitle>
                      {selectedAchievement.isEarned ? 'Achievement Unlocked!' : 'Achievement Locked'}
                    </AlertTitle>
                    <AlertDescription>
                      {selectedAchievement.isEarned 
                        ? `You earned this achievement on ${new Date(selectedAchievement.earnedAt! * 1000).toLocaleDateString()}`
                        : `Complete ${selectedAchievement.threshold} ${selectedAchievement.description.toLowerCase()} to unlock`
                      }
                    </AlertDescription>
                  </Box>
                </Alert>

                <Card>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <HStack justify="space-between">
                        <HStack>
                          <Text fontSize="4xl">{selectedAchievement.icon}</Text>
                          <VStack align="start" spacing={1}>
                            <Text fontSize="xl" fontWeight="bold">
                              {selectedAchievement.name}
                            </Text>
                            <Badge colorScheme={getRarityColor(selectedAchievement.rarity)}>
                              {selectedAchievement.rarity.toUpperCase()}
                            </Badge>
                          </VStack>
                        </HStack>
                        {selectedAchievement.isPrivate && (
                          <Icon as={FaLock} color="gray.500" size="lg" />
                        )}
                      </HStack>

                      <Divider />

                      <Text>{selectedAchievement.description}</Text>

                      <Divider />

                      <VStack spacing={2} align="stretch">
                        <Text fontWeight="bold">Progress:</Text>
                        <Progress
                          value={getProgressPercentage(selectedAchievement)}
                          colorScheme={selectedAchievement.isEarned ? 'green' : 'blue'}
                          size="lg"
                        />
                        <Text fontSize="sm" color="gray.500">
                          {Math.round(getProgressPercentage(selectedAchievement))}% complete
                        </Text>
                      </VStack>

                      {selectedAchievement.isEarned && (
                        <>
                          <Divider />
                          <VStack spacing={2} align="stretch">
                            <Text fontWeight="bold">Achievement Details:</Text>
                            <HStack justify="space-between">
                              <Text>Earned:</Text>
                              <Text>{new Date(selectedAchievement.earnedAt! * 1000).toLocaleString()}</Text>
                            </HStack>
                            {selectedAchievement.tokenId && (
                              <HStack justify="space-between">
                                <Text>NFT Token ID:</Text>
                                <Text fontWeight="bold">#{selectedAchievement.tokenId}</Text>
                              </HStack>
                            )}
                            <HStack justify="space-between">
                              <Text>Privacy:</Text>
                              <Badge colorScheme={selectedAchievement.isPrivate ? 'red' : 'green'}>
                                {selectedAchievement.isPrivate ? 'Private' : 'Public'}
                              </Badge>
                            </HStack>
                          </VStack>
                        </>
                      )}
                    </VStack>
                  </CardBody>
                </Card>

                {selectedAchievement.isEarned && (
                  <HStack spacing={4}>
                    {selectedAchievement.tokenId ? (
                      <Button
                        colorScheme="purple"
                        onClick={() => handleTogglePrivacy(selectedAchievement)}
                        isLoading={isTransactionLoading}
                      >
                        <Icon as={selectedAchievement.isPrivate ? FaEye : FaEyeSlash} mr={2} />
                        {selectedAchievement.isPrivate ? 'Make Public' : 'Make Private'}
                      </Button>
                    ) : (
                      <Button
                        colorScheme="green"
                        onClick={() => handleMintNFT(selectedAchievement)}
                        isLoading={isTransactionLoading}
                      >
                        Mint Achievement NFT
                      </Button>
                    )}
                    <Button variant="outline" onClick={onClose}>
                      Close
                    </Button>
                  </HStack>
                )}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};
