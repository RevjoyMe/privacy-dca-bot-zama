// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "@fhevm/solidity/lib/FHE.sol";
import "@fhevm/solidity/config/ZamaConfig.sol";
import "./interfaces/IDEX.sol";

/**
 * @title PrivacyDCABotV3
 * @dev Advanced privacy-preserving DCA bot with AI optimization, cross-chain support, and gamification
 */
contract PrivacyDCABotV3 is Ownable, ReentrancyGuard, AutomationCompatible, SepoliaConfig {
    using SafeERC20 for IERC20;

    // ============ ENUMS ============
    
    enum AIProvider {
        CHATGPT,
        GEMINI,
        GROK,
        CLAUDE,
        NONE
    }
    
    enum ChainId {
        ETHEREUM,
        POLYGON,
        ARBITRUM,
        OPTIMISM,
        BASE,
        BSC
    }
    
    enum AchievementType {
        FIRST_STRATEGY,
        CONSISTENT_INVESTOR,
        AI_OPTIMIZER,
        CROSS_CHAIN_EXPLORER,
        PRIVACY_CHAMPION,
        BATCH_MASTER
    }

    // ============ STRUCTS ============

    struct DCAStrategy {
        euint128 budget;                    // Total budget in USDC (using euint128 for arithmetic)
        euint128 purchaseAmount;            // Amount per purchase
        euint32 timeframe;                  // Total duration in seconds
        euint32 frequency;                  // Interval between purchases in seconds
        euint32 lastPurchaseTime;           // Last purchase timestamp
        euint32 purchasesMade;              // Number of purchases completed
        bool isActive;                      // Strategy status
        AIProvider aiProvider;              // AI provider for optimization
        bool aiOptimizationEnabled;         // Whether AI optimization is enabled
        euint64 aiConfidenceScore;          // AI confidence in current strategy (0-100)
        ChainId targetChain;                // Target blockchain for DCA
        euint128 crossChainFee;             // Cross-chain transaction fee
        bool isInstitutional;               // Institutional account flag
    }

    struct AIRecommendation {
        euint128 recommendedAmount;         // AI recommended purchase amount
        euint64 marketSentiment;            // Market sentiment score (0-100)
        euint64 volatilityIndex;            // Volatility index
        euint64 optimalTiming;              // Optimal timing score
        uint32 timestamp;                   // Recommendation timestamp
        AIProvider provider;                // AI provider that made recommendation
        bool isExecuted;                    // Whether recommendation was executed
    }

    struct CrossChainBatch {
        euint128 totalAmount;               // Total amount across all chains
        mapping(ChainId => euint128) chainAmounts; // Amount per chain
        uint32 userCount;                   // Number of users in batch
        uint32 batchId;                     // Unique batch identifier
        bool isExecuted;                    // Execution status
        uint32 createdAt;                   // Batch creation timestamp
        ChainId[] supportedChains;          // Supported chains for this batch
    }

    // Standard batch for single-chain DCA
    struct Batch {
        euint128 totalAmount;               // Total USDC amount in batch
        euint128 totalShares;               // Total shares to distribute
        uint32 userCount;                   // Number of users in batch
        uint32 batchId;                     // Unique batch identifier
        bool isExecuted;                    // Execution status
        uint32 createdAt;                   // Batch creation timestamp
        address[] participants;             // List of participants
    }

    struct UserAchievement {
        AchievementType achievementType;    // Type of achievement
        uint32 earnedAt;                    // When achievement was earned
        euint128 achievementValue;          // Encrypted value associated with achievement
        bool isMinted;                      // Whether NFT was minted
    }

    struct PrivacyLevel {
        bool differentialPrivacy;           // Enable differential privacy
        bool zeroKnowledgeProofs;           // Enable ZK proofs
        euint32 privacyBudget;              // Privacy budget for differential privacy
        bool institutionalMode;             // Institutional privacy mode
    }

    struct UserBatchParticipation {
        euint128 userAmount;                // User's contribution to batch
        euint128 userShares;                // User's share of the batch
        bool hasParticipated;               // Participation status
        bool hasWithdrawn;                  // Withdrawal status
        ChainId targetChain;                // User's target chain
        euint128 crossChainAmount;          // Cross-chain amount
    }

    // ============ STATE VARIABLES ============

    // Token addresses per chain
    mapping(ChainId => address) public usdcAddresses;
    mapping(ChainId => address) public wethAddresses;
    
    // FHE public key for encryption
    bytes32 public fhePublicKey;
    
    // Batch configuration
    uint32 public constant MIN_BATCH_SIZE = 5;
    uint32 public constant MAX_BATCH_SIZE = 15;
    uint32 public constant BATCH_TIMEOUT = 300; // 5 minutes
    uint24 public constant DEX_FEE = 3000; // 0.3%
    
    // AI configuration
    mapping(AIProvider => bool) public aiProvidersEnabled;
    mapping(AIProvider => uint256) public aiProviderFees;
    
    // Cross-chain configuration
    mapping(ChainId => bool) public supportedChains;
    mapping(ChainId => uint256) public chainGasEstimates;
    
    // Gamification
    IERC721 public achievementNFT;
    mapping(address => UserAchievement[]) public userAchievements;
    mapping(AchievementType => uint256) public achievementThresholds;
    
    // Privacy features
    mapping(address => PrivacyLevel) public userPrivacyLevels;
    
    // Current batches
    CrossChainBatch public currentCrossChainBatch;
    Batch public currentBatch;
    uint32 public nextBatchId = 1;
    
    // User data
    mapping(address => DCAStrategy) public userStrategies;
    mapping(address => AIRecommendation[]) public userAIRecommendations;
    mapping(address => UserBatchParticipation) public userBatchParticipation;
    mapping(uint32 => Batch) public batchHistory;
    
    // Automation
    uint32 public lastAutomationCheck;
    uint32 public constant AUTOMATION_INTERVAL = 60; // 1 minute
    
    // Events
    event StrategyCreated(address indexed user, uint32 strategyId, AIProvider aiProvider);
    event StrategyUpdated(address indexed user, AIProvider aiProvider);
    event AIRecommendationGenerated(address indexed user, AIProvider provider, uint256 confidence);
    event CrossChainBatchCreated(uint32 indexed batchId, uint32 userCount, ChainId[] chains);
    event CrossChainBatchExecuted(uint32 indexed batchId, uint256 totalAmount, ChainId[] chains);
    event BatchCreated(uint32 indexed batchId, uint32 userCount);
    event BatchExecuted(uint32 indexed batchId, uint256 totalAmount, uint256 ethReceived);
    event TokensDistributed(uint32 indexed batchId, address indexed user, uint256 shares);
    event AchievementEarned(address indexed user, AchievementType achievementType);
    event PrivacyLevelUpdated(address indexed user, bool differentialPrivacy, bool zeroKnowledgeProofs);
    event EmergencyWithdraw(address indexed user, uint256 amount, ChainId chain);
    event AutomationTriggered(uint32 timestamp);

    // ============ CONSTRUCTOR ============

    constructor(
        bytes32 _fhePublicKey,
        address _achievementNFT
    ) {
        fhePublicKey = _fhePublicKey;
        achievementNFT = IERC721(_achievementNFT);
        
        // Initialize AI providers
        aiProvidersEnabled[AIProvider.CHATGPT] = true;
        aiProvidersEnabled[AIProvider.GEMINI] = true;
        aiProvidersEnabled[AIProvider.GROK] = true;
        aiProvidersEnabled[AIProvider.CLAUDE] = true;
        
        // Set AI provider fees
        aiProviderFees[AIProvider.CHATGPT] = 0.001 ether;
        aiProviderFees[AIProvider.GEMINI] = 0.001 ether;
        aiProviderFees[AIProvider.GROK] = 0.002 ether;
        aiProviderFees[AIProvider.CLAUDE] = 0.0015 ether;
        
        // Initialize supported chains
        supportedChains[ChainId.ETHEREUM] = true;
        supportedChains[ChainId.POLYGON] = true;
        supportedChains[ChainId.ARBITRUM] = true;
        supportedChains[ChainId.OPTIMISM] = true;
        supportedChains[ChainId.BASE] = true;
        supportedChains[ChainId.BSC] = true;
        
        // Set achievement thresholds
        achievementThresholds[AchievementType.FIRST_STRATEGY] = 1;
        achievementThresholds[AchievementType.CONSISTENT_INVESTOR] = 10;
        achievementThresholds[AchievementType.AI_OPTIMIZER] = 5;
        achievementThresholds[AchievementType.CROSS_CHAIN_EXPLORER] = 3;
        achievementThresholds[AchievementType.PRIVACY_CHAMPION] = 1;
        achievementThresholds[AchievementType.BATCH_MASTER] = 20;
        
        // Initialize first batches
        currentBatch = Batch({
            totalAmount: FHE.asEuint128(0),
            totalShares: FHE.asEuint128(0),
            userCount: 0,
            batchId: 0,
            isExecuted: false,
            createdAt: 0,
            participants: new address[](0)
        });
        
        currentCrossChainBatch = CrossChainBatch({
            totalAmount: FHE.asEuint128(0),
            userCount: 0,
            batchId: 0,
            isExecuted: false,
            createdAt: 0,
            supportedChains: new ChainId[](0)
        });
    }

    // ============ CORE DCA FUNCTIONS ============

    /**
     * @dev Create a new DCA strategy with optional AI optimization
     */
    function createStrategy(
        externalEuint128 _budget,
        externalEuint128 _purchaseAmount,
        externalEuint32 _timeframe,
        externalEuint32 _frequency,
        AIProvider _aiProvider,
        bool _aiOptimizationEnabled,
        ChainId _targetChain,
        bool _isInstitutional,
        bytes calldata inputProof
    ) external payable nonReentrant {
        // Validate sender is allowed to use these encrypted inputs
        require(FHE.isSenderAllowed(_budget), "Sender not allowed for budget");
        require(FHE.isSenderAllowed(_purchaseAmount), "Sender not allowed for purchase amount");
        require(FHE.isSenderAllowed(_timeframe), "Sender not allowed for timeframe");
        require(FHE.isSenderAllowed(_frequency), "Sender not allowed for frequency");
        
        // Convert external encrypted inputs to internal encrypted values
        euint128 budget = FHE.fromExternal(_budget, inputProof);
        euint128 purchaseAmount = FHE.fromExternal(_purchaseAmount, inputProof);
        euint32 timeframe = FHE.fromExternal(_timeframe, inputProof);
        euint32 frequency = FHE.fromExternal(_frequency, inputProof);
        
        // Validate inputs using FHE operations
        ebool budgetValid = FHE.gt(budget, FHE.asEuint128(0));
        ebool purchaseAmountValid = FHE.gt(purchaseAmount, FHE.asEuint128(0));
        require(FHE.decrypt(budgetValid), "Budget must be greater than 0");
        require(FHE.decrypt(purchaseAmountValid), "Purchase amount must be greater than 0");
        require(supportedChains[_targetChain], "Chain not supported");
        
        // Handle AI provider fee
        if (_aiOptimizationEnabled && _aiProvider != AIProvider.NONE) {
            require(aiProvidersEnabled[_aiProvider], "AI provider not enabled");
            require(msg.value >= aiProviderFees[_aiProvider], "Insufficient AI provider fee");
        }
        
        DCAStrategy storage strategy = userStrategies[msg.sender];
        strategy.budget = budget;
        strategy.purchaseAmount = purchaseAmount;
        strategy.timeframe = timeframe;
        strategy.frequency = frequency;
        strategy.lastPurchaseTime = FHE.asEuint32(0);
        strategy.purchasesMade = FHE.asEuint32(0);
        strategy.isActive = true;
        strategy.aiProvider = _aiProvider;
        strategy.aiOptimizationEnabled = _aiOptimizationEnabled;
        strategy.aiConfidenceScore = FHE.asEuint64(0);
        strategy.targetChain = _targetChain;
        strategy.crossChainFee = FHE.asEuint128(0);
        strategy.isInstitutional = _isInstitutional;
        
        // Initialize privacy level
        PrivacyLevel storage privacy = userPrivacyLevels[msg.sender];
        privacy.differentialPrivacy = _isInstitutional;
        privacy.zeroKnowledgeProofs = _isInstitutional;
        privacy.privacyBudget = FHE.asEuint32(100);
        privacy.institutionalMode = _isInstitutional;
        
        // Check for achievements
        _checkAndAwardAchievements(msg.sender, AchievementType.FIRST_STRATEGY);
        if (_aiOptimizationEnabled) {
            _checkAndAwardAchievements(msg.sender, AchievementType.AI_OPTIMIZER);
        }
        if (_isInstitutional) {
            _checkAndAwardAchievements(msg.sender, AchievementType.PRIVACY_CHAMPION);
        }
        
        emit StrategyCreated(msg.sender, 1, _aiProvider);
    }

    /**
     * @dev Submit DCA intent to current batch (Core DCA functionality)
     */
    function submitDCAIntent(
        externalEuint128 encryptedAmount,
        bytes calldata inputProof
    ) external nonReentrant {
        require(userStrategies[msg.sender].isActive, "No active strategy");
        require(!userBatchParticipation[msg.sender].hasParticipated, "Already participated");
        
        // Validate sender is allowed to use this encrypted input
        require(FHE.isSenderAllowed(encryptedAmount), "Sender not allowed for amount");
        
        // Convert external encrypted input to internal encrypted value
        euint128 amount = FHE.fromExternal(encryptedAmount, inputProof);
        
        // Validate amount using FHE operations
        ebool amountValid = FHE.gt(amount, FHE.asEuint128(0));
        require(FHE.decrypt(amountValid), "Amount must be positive");
        
        // Check if we need to create a new batch
        if (currentBatch.userCount >= MAX_BATCH_SIZE || 
            (currentBatch.userCount >= MIN_BATCH_SIZE && 
             block.timestamp - currentBatch.createdAt >= BATCH_TIMEOUT)) {
            _executeCurrentBatch();
            _createNewBatch();
        }
        
        // Add user to current batch
        currentBatch.totalAmount = FHE.add(currentBatch.totalAmount, amount);
        currentBatch.userCount++;
        currentBatch.participants.push(msg.sender);
        
        userBatchParticipation[msg.sender] = UserBatchParticipation({
            userAmount: amount,
            userShares: FHE.asEuint128(0),
            hasParticipated: true,
            hasWithdrawn: false,
            targetChain: ChainId.ETHEREUM, // Default to Ethereum for standard DCA
            crossChainAmount: FHE.asEuint128(0)
        });
        
        // Set ACL for the user to access their encrypted data later
        FHE.allow(amount, msg.sender);
        FHE.allowThis(currentBatch.totalAmount);
        
        // Transfer USDC from user (assuming Ethereum mainnet)
        uint256 actualAmount = FHE.decrypt(amount);
        IERC20 usdc = IERC20(usdcAddresses[ChainId.ETHEREUM]);
        usdc.safeTransferFrom(msg.sender, address(this), actualAmount);
        
        emit BatchCreated(currentBatch.batchId, currentBatch.userCount);
    }

    /**
     * @dev Execute current batch by swapping USDC for ETH (Core DCA functionality)
     */
    function executeBatch() external onlyOwner {
        require(currentBatch.userCount > 0, "No batch to execute");
        require(!currentBatch.isExecuted, "Batch already executed");
        
        uint256 totalAmount = FHE.decrypt(currentBatch.totalAmount);
        require(totalAmount > 0, "No amount to swap");
        
        // Get quote from DEX (simplified - in real implementation would use actual DEX)
        uint256 expectedEth = _getDEXQuote(totalAmount);
        
        // Calculate minimum output with 1% slippage tolerance
        uint256 minOutput = expectedEth * 99 / 100;
        
        // Execute swap (simplified - in real implementation would use actual DEX)
        uint256 ethReceived = _executeDEXSwap(totalAmount, minOutput);
        
        // Calculate and distribute shares
        _calculateAndDistributeShares(ethReceived);
        
        // Store batch in history
        batchHistory[currentBatch.batchId] = currentBatch;
        
        currentBatch.isExecuted = true;
        
        emit BatchExecuted(currentBatch.batchId, totalAmount, ethReceived);
    }

    /**
     * @dev Withdraw user's ETH shares (Core DCA functionality)
     */
    function withdrawShares() external nonReentrant {
        UserBatchParticipation storage participation = userBatchParticipation[msg.sender];
        require(participation.hasParticipated, "No participation found");
        require(!participation.hasWithdrawn, "Already withdrawn");
        
        uint256 shares = FHE.decrypt(participation.userShares);
        require(shares > 0, "No shares to withdraw");
        
        // Mark as withdrawn
        participation.hasWithdrawn = true;
        
        // Transfer ETH to user
        IERC20 weth = IERC20(wethAddresses[ChainId.ETHEREUM]);
        weth.safeTransfer(msg.sender, shares);
        
        emit TokensDistributed(currentBatch.batchId, msg.sender, shares);
    }

    /**
     * @dev Emergency withdraw for users (Core DCA functionality)
     */
    function emergencyWithdraw() external nonReentrant {
        UserBatchParticipation storage participation = userBatchParticipation[msg.sender];
        require(participation.hasParticipated, "No participation found");
        require(!participation.hasWithdrawn, "Already withdrawn");
        
        uint256 amount = FHE.decrypt(participation.userAmount);
        require(amount > 0, "No amount to withdraw");
        
        // Mark as withdrawn
        participation.hasWithdrawn = true;
        
        // Return USDC to user
        IERC20 usdc = IERC20(usdcAddresses[ChainId.ETHEREUM]);
        usdc.safeTransfer(msg.sender, amount);
        
        emit EmergencyWithdraw(msg.sender, amount, ChainId.ETHEREUM);
    }

    // ============ AI FUNCTIONS ============

    /**
     * @dev Generate AI recommendation for strategy optimization
     */
    function generateAIRecommendation(
        AIProvider _provider,
        euint128 _marketData,
        euint128 _userPreferences
    ) external payable nonReentrant {
        require(aiProvidersEnabled[_provider], "AI provider not enabled");
        require(msg.value >= aiProviderFees[_provider], "Insufficient AI provider fee");
        
        DCAStrategy storage strategy = userStrategies[msg.sender];
        require(strategy.isActive, "Strategy not active");
        require(strategy.aiOptimizationEnabled, "AI optimization not enabled");
        
        // Simulate AI recommendation (in real implementation, this would call external AI APIs)
        AIRecommendation memory recommendation = AIRecommendation({
            recommendedAmount: _calculateAIRecommendation(_marketData, _userPreferences),
            marketSentiment: _calculateMarketSentiment(_marketData),
            volatilityIndex: _calculateVolatilityIndex(_marketData),
            optimalTiming: _calculateOptimalTiming(_marketData),
            timestamp: uint32(block.timestamp),
            provider: _provider,
            isExecuted: false
        });
        
        userAIRecommendations[msg.sender].push(recommendation);
        strategy.aiConfidenceScore = recommendation.marketSentiment;
        
        emit AIRecommendationGenerated(msg.sender, _provider, FHE.decrypt(recommendation.marketSentiment));
    }

    // ============ CROSS-CHAIN FUNCTIONS ============

    /**
     * @dev Execute cross-chain DCA batch
     */
    function executeCrossChainBatch() external onlyOwner nonReentrant {
        require(currentCrossChainBatch.userCount >= MIN_BATCH_SIZE, "Insufficient batch size");
        require(!currentCrossChainBatch.isExecuted, "Batch already executed");
        
        // Execute swaps on each supported chain
        for (uint i = 0; i < currentCrossChainBatch.supportedChains.length; i++) {
            ChainId chain = currentCrossChainBatch.supportedChains[i];
            if (FHE.decrypt(currentCrossChainBatch.chainAmounts[chain]) > 0) {
                _executeSwapOnChain(chain, currentCrossChainBatch.chainAmounts[chain]);
            }
        }
        
        currentCrossChainBatch.isExecuted = true;
        
        emit CrossChainBatchExecuted(
            currentCrossChainBatch.batchId,
            FHE.decrypt(currentCrossChainBatch.totalAmount),
            currentCrossChainBatch.supportedChains
        );
        
        // Create new cross-chain batch
        _createNewCrossChainBatch();
    }

    // ============ PRIVACY FUNCTIONS ============

    /**
     * @dev Update user privacy level
     */
    function updatePrivacyLevel(
        bool _differentialPrivacy,
        bool _zeroKnowledgeProofs,
        euint32 _privacyBudget
    ) external {
        PrivacyLevel storage privacy = userPrivacyLevels[msg.sender];
        privacy.differentialPrivacy = _differentialPrivacy;
        privacy.zeroKnowledgeProofs = _zeroKnowledgeProofs;
        privacy.privacyBudget = _privacyBudget;
        
        emit PrivacyLevelUpdated(msg.sender, _differentialPrivacy, _zeroKnowledgeProofs);
    }

    // ============ AUTOMATION FUNCTIONS ============

    /**
     * @dev Chainlink Automation check function
     */
    function checkUpkeep(bytes calldata) external view override returns (bool upkeepNeeded, bytes memory performData) {
        upkeepNeeded = false;
        
        // Check if enough time has passed since last automation
        if (block.timestamp - lastAutomationCheck < AUTOMATION_INTERVAL) {
            return (false, "");
        }
        
        // Check if current batch is ready for execution
        if (currentBatch.userCount >= MIN_BATCH_SIZE && 
            block.timestamp - currentBatch.createdAt >= BATCH_TIMEOUT) {
            upkeepNeeded = true;
            performData = abi.encode(currentBatch.batchId);
        }
        
        return (upkeepNeeded, performData);
    }

    /**
     * @dev Chainlink Automation perform function
     */
    function performUpkeep(bytes calldata performData) external override {
        (bool upkeepNeeded,) = this.checkUpkeep("");
        require(upkeepNeeded, "Upkeep not needed");
        
        lastAutomationCheck = uint32(block.timestamp);
        
        // Execute current batch
        _executeCurrentBatch();
        _createNewBatch();
        
        emit AutomationTriggered(uint32(block.timestamp));
    }

    // ============ INTERNAL FUNCTIONS ============

    function _executeCurrentBatch() internal {
        if (currentBatch.userCount > 0 && !currentBatch.isExecuted) {
            executeBatch();
        }
    }

    function _createNewBatch() internal {
        currentBatch = Batch({
            totalAmount: FHE.asEuint128(0),
            totalShares: FHE.asEuint128(0),
            userCount: 0,
            batchId: nextBatchId++,
            isExecuted: false,
            createdAt: uint32(block.timestamp),
            participants: new address[](0)
        });
    }

    function _createNewCrossChainBatch() internal {
        currentCrossChainBatch = CrossChainBatch({
            totalAmount: FHE.asEuint128(0),
            userCount: 0,
            batchId: nextBatchId++,
            isExecuted: false,
            createdAt: uint32(block.timestamp),
            supportedChains: new ChainId[](0)
        });
    }

    function _calculateAndDistributeShares(uint256 totalEthReceived) internal {
        euint128 totalShares = FHE.asEuint128(totalEthReceived);
        currentBatch.totalShares = totalShares;
        
        // Calculate proportional shares for each participant
        for (uint i = 0; i < currentBatch.participants.length; i++) {
            address participant = currentBatch.participants[i];
            UserBatchParticipation storage participation = userBatchParticipation[participant];
            
            // Calculate proportional share: (userAmount / totalAmount) * totalEthReceived
            euint128 userShare = FHE.div(FHE.mul(participation.userAmount, totalShares), currentBatch.totalAmount);
            participation.userShares = userShare;
            
            // Set ACL for user to access their shares later
            FHE.allow(userShare, participant);
        }
        
        // Make total shares publicly decryptable for transparency
        FHE.makePubliclyDecryptable(totalShares);
    }

    function _getDEXQuote(uint256 amount) internal pure returns (uint256) {
        // Simplified quote - in real implementation would use actual DEX
        return amount; // 1:1 ratio for simplicity
    }

    function _executeDEXSwap(uint256 amount, uint256 minOutput) internal returns (uint256) {
        // Simplified swap - in real implementation would use actual DEX
        // This is a placeholder for actual DEX integration
        return minOutput;
    }

    function _calculateAIRecommendation(
        euint128 _marketData,
        euint128 _userPreferences
    ) internal pure returns (euint128) {
        // Simplified AI calculation - in real implementation would use external AI
        return FHE.div(_marketData, _userPreferences);
    }

    function _calculateMarketSentiment(euint128 _marketData) internal pure returns (euint64) {
        // Simplified sentiment calculation
        return FHE.asEuint64(FHE.rem(_marketData, FHE.asEuint128(100)));
    }

    function _calculateVolatilityIndex(euint128 _marketData) internal pure returns (euint64) {
        // Simplified volatility calculation
        return FHE.asEuint64(FHE.rem(_marketData, FHE.asEuint128(50)));
    }

    function _calculateOptimalTiming(euint128 _marketData) internal pure returns (euint64) {
        // Simplified timing calculation
        return FHE.asEuint64(FHE.rem(_marketData, FHE.asEuint128(24)));
    }

    function _executeSwapOnChain(ChainId _chain, euint128 _amount) internal {
        // Simplified swap execution - in real implementation would use DEX contracts
        // This is a placeholder for actual cross-chain swap logic
    }

    function _checkAndAwardAchievements(address _user, AchievementType _achievementType) internal {
        // Check if user already has this achievement
        UserAchievement[] storage achievements = userAchievements[_user];
        for (uint i = 0; i < achievements.length; i++) {
            if (achievements[i].achievementType == _achievementType) {
                return; // Achievement already awarded
            }
        }
        
        // Award new achievement
        UserAchievement memory newAchievement = UserAchievement({
            achievementType: _achievementType,
            earnedAt: uint32(block.timestamp),
            achievementValue: FHE.asEuint128(1),
            isMinted: false
        });
        
        achievements.push(newAchievement);
        
        emit AchievementEarned(_user, _achievementType);
    }

    // ============ VIEW FUNCTIONS ============

    function getUserAchievements(address _user) external view returns (UserAchievement[] memory) {
        return userAchievements[_user];
    }

    function getAIRecommendations(address _user) external view returns (AIRecommendation[] memory) {
        return userAIRecommendations[_user];
    }

    function getSupportedChains() external view returns (ChainId[] memory) {
        ChainId[] memory chains = new ChainId[](6);
        uint count = 0;
        
        if (supportedChains[ChainId.ETHEREUM]) chains[count++] = ChainId.ETHEREUM;
        if (supportedChains[ChainId.POLYGON]) chains[count++] = ChainId.POLYGON;
        if (supportedChains[ChainId.ARBITRUM]) chains[count++] = ChainId.ARBITRUM;
        if (supportedChains[ChainId.OPTIMISM]) chains[count++] = ChainId.OPTIMISM;
        if (supportedChains[ChainId.BASE]) chains[count++] = ChainId.BASE;
        if (supportedChains[ChainId.BSC]) chains[count++] = ChainId.BSC;
        
        // Resize array to actual count
        assembly {
            mstore(chains, count)
        }
        
        return chains;
    }

    function getCurrentBatch() external view returns (
        uint256 totalAmount,
        uint32 userCount,
        uint32 batchId,
        bool isExecuted,
        uint32 createdAt,
        address[] memory participants
    ) {
        return (
            FHE.decrypt(currentBatch.totalAmount),
            currentBatch.userCount,
            currentBatch.batchId,
            currentBatch.isExecuted,
            currentBatch.createdAt,
            currentBatch.participants
        );
    }

    // ============ ADMIN FUNCTIONS ============

    function setAIProviderFee(AIProvider _provider, uint256 _fee) external onlyOwner {
        aiProviderFees[_provider] = _fee;
    }

    function setAIProviderEnabled(AIProvider _provider, bool _enabled) external onlyOwner {
        aiProvidersEnabled[_provider] = _enabled;
    }

    function setSupportedChain(ChainId _chain, bool _supported) external onlyOwner {
        supportedChains[_chain] = _supported;
    }

    function setAchievementThreshold(AchievementType _type, uint256 _threshold) external onlyOwner {
        achievementThresholds[_type] = _threshold;
    }

    function withdrawFees() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    /**
     * @dev Set token addresses for a specific chain
     */
    function setTokenAddresses(ChainId _chain, address _usdc, address _weth) external onlyOwner {
        usdcAddresses[_chain] = _usdc;
        wethAddresses[_chain] = _weth;
    }
}
