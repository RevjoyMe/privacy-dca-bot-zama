// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/PrivacyDCABotV2.sol";
import "../contracts/interfaces/IDEX.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title PrivacyDCABot Test
 * @dev Test suite for PrivacyDCABot contract
 */
contract PrivacyDCABotTest is Test {
    PrivacyDCABotV2 public dcaBot;
    
    // Test addresses
    address constant USDC = 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238;
    address constant WETH = 0x097D90c9d3E0B50Ca60e1ae45F6A81010f9FB534;
    address constant DEX = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
    
    // Test users
    address user1 = address(0x1);
    address user2 = address(0x2);
    address user3 = address(0x3);
    address owner = address(0x4);
    
    // FHE Public Key
    bytes32 constant FHE_PUBLIC_KEY = 0x1234567890123456789012345678901234567890123456789012345678901234;
    
    // Test amounts
    uint256 constant BUDGET = 1000e6; // 1000 USDC
    uint256 constant PURCHASE_AMOUNT = 100e6; // 100 USDC
    uint32 constant TIMEFRAME = 86400; // 1 day
    uint32 constant FREQUENCY = 3600; // 1 hour

    function setUp() public {
        // Deploy contract
        dcaBot = new PrivacyDCABotV2(USDC, WETH, DEX, FHE_PUBLIC_KEY);
        
        // Set owner
        dcaBot.transferOwnership(owner);
        
        // Setup test environment
        vm.label(address(dcaBot), "PrivacyDCABot");
        vm.label(USDC, "USDC");
        vm.label(WETH, "WETH");
        vm.label(DEX, "UniswapV3Router");
        vm.label(user1, "User1");
        vm.label(user2, "User2");
        vm.label(user3, "User3");
        vm.label(owner, "Owner");
    }

    function test_Constructor() public {
        assertEq(address(dcaBot.usdc()), USDC);
        assertEq(address(dcaBot.weth()), WETH);
        assertEq(address(dcaBot.dex()), DEX);
        assertEq(dcaBot.fhePublicKey(), FHE_PUBLIC_KEY);
        assertEq(dcaBot.owner(), owner);
    }

    function test_CreateStrategy() public {
        vm.startPrank(user1);
        
        // Create encrypted parameters (simplified for testing)
        bytes memory encryptedBudget = _encryptValue(BUDGET);
        bytes memory encryptedPurchaseAmount = _encryptValue(PURCHASE_AMOUNT);
        bytes memory encryptedTimeframe = _encryptValue(uint256(TIMEFRAME));
        bytes memory encryptedFrequency = _encryptValue(uint256(FREQUENCY));
        
        // Create strategy
        dcaBot.createStrategy(
            encryptedBudget,
            encryptedPurchaseAmount,
            encryptedTimeframe,
            encryptedFrequency
        );
        
        // Verify strategy was created
        (
            uint256 budget,
            uint256 purchaseAmount,
            uint32 timeframe,
            uint32 frequency,
            uint32 lastPurchaseTime,
            uint32 purchasesMade,
            uint256 remainingBudget,
            bool isActive
        ) = dcaBot.getUserStrategy(user1);
        
        assertEq(budget, BUDGET);
        assertEq(purchaseAmount, PURCHASE_AMOUNT);
        assertEq(timeframe, TIMEFRAME);
        assertEq(frequency, FREQUENCY);
        assertEq(lastPurchaseTime, 0);
        assertEq(purchasesMade, 0);
        assertEq(remainingBudget, BUDGET);
        assertTrue(isActive);
        
        vm.stopPrank();
    }

    function test_SubmitDCAIntent() public {
        // Setup: Create strategy first
        vm.startPrank(user1);
        
        bytes memory encryptedBudget = _encryptValue(BUDGET);
        bytes memory encryptedPurchaseAmount = _encryptValue(PURCHASE_AMOUNT);
        bytes memory encryptedTimeframe = _encryptValue(uint256(TIMEFRAME));
        bytes memory encryptedFrequency = _encryptValue(uint256(FREQUENCY));
        
        dcaBot.createStrategy(
            encryptedBudget,
            encryptedPurchaseAmount,
            encryptedTimeframe,
            encryptedFrequency
        );
        
        // Mock USDC balance and approval
        deal(USDC, user1, PURCHASE_AMOUNT);
        IERC20(USDC).approve(address(dcaBot), PURCHASE_AMOUNT);
        
        // Submit DCA intent
        bytes memory encryptedAmount = _encryptValue(PURCHASE_AMOUNT);
        dcaBot.submitDCAIntent(encryptedAmount);
        
        // Verify batch was created
        (
            uint256 totalAmount,
            uint32 userCount,
            uint32 batchId,
            bool isExecuted,
            uint32 createdAt,
            address[] memory participants
        ) = dcaBot.getCurrentBatch();
        
        assertEq(totalAmount, PURCHASE_AMOUNT);
        assertEq(userCount, 1);
        assertEq(batchId, 0);
        assertFalse(isExecuted);
        assertEq(participants.length, 1);
        assertEq(participants[0], user1);
        
        vm.stopPrank();
    }

    function test_BatchExecution() public {
        // Setup: Create multiple users with strategies
        _setupMultipleUsers();
        
        // Submit intents from multiple users
        vm.startPrank(user1);
        deal(USDC, user1, PURCHASE_AMOUNT);
        IERC20(USDC).approve(address(dcaBot), PURCHASE_AMOUNT);
        dcaBot.submitDCAIntent(_encryptValue(PURCHASE_AMOUNT));
        vm.stopPrank();
        
        vm.startPrank(user2);
        deal(USDC, user2, PURCHASE_AMOUNT);
        IERC20(USDC).approve(address(dcaBot), PURCHASE_AMOUNT);
        dcaBot.submitDCAIntent(_encryptValue(PURCHASE_AMOUNT));
        vm.stopPrank();
        
        vm.startPrank(user3);
        deal(USDC, user3, PURCHASE_AMOUNT);
        IERC20(USDC).approve(address(dcaBot), PURCHASE_AMOUNT);
        dcaBot.submitDCAIntent(_encryptValue(PURCHASE_AMOUNT));
        vm.stopPrank();
        
        // Execute batch as owner
        vm.startPrank(owner);
        dcaBot.executeBatch();
        vm.stopPrank();
        
        // Verify batch was executed
        (
            uint256 totalAmount,
            uint32 userCount,
            uint32 batchId,
            bool isExecuted,
            uint32 createdAt,
            address[] memory participants
        ) = dcaBot.getCurrentBatch();
        
        assertEq(totalAmount, 0); // New batch should be empty
        assertEq(userCount, 0);
        assertTrue(isExecuted);
    }

    function test_AutomationUpkeep() public {
        // Setup: Create users and submit intents
        _setupMultipleUsers();
        
        // Submit intents to fill batch
        _submitIntentsFromUsers();
        
        // Fast forward time to trigger automation
        vm.warp(block.timestamp + 301); // BATCH_TIMEOUT + 1
        
        // Check if upkeep is needed
        (bool upkeepNeeded, bytes memory performData) = dcaBot.checkUpkeep("");
        assertTrue(upkeepNeeded);
        
        // Perform upkeep
        vm.startPrank(owner);
        dcaBot.performUpkeep(performData);
        vm.stopPrank();
        
        // Verify automation was triggered
        assertEq(dcaBot.lastAutomationCheck(), block.timestamp);
    }

    function test_EmergencyWithdraw() public {
        // Setup: Create user and submit intent
        vm.startPrank(user1);
        
        bytes memory encryptedBudget = _encryptValue(BUDGET);
        bytes memory encryptedPurchaseAmount = _encryptValue(PURCHASE_AMOUNT);
        bytes memory encryptedTimeframe = _encryptValue(uint256(TIMEFRAME));
        bytes memory encryptedFrequency = _encryptValue(uint256(FREQUENCY));
        
        dcaBot.createStrategy(
            encryptedBudget,
            encryptedPurchaseAmount,
            encryptedTimeframe,
            encryptedFrequency
        );
        
        deal(USDC, user1, PURCHASE_AMOUNT);
        IERC20(USDC).approve(address(dcaBot), PURCHASE_AMOUNT);
        
        dcaBot.submitDCAIntent(_encryptValue(PURCHASE_AMOUNT));
        
        // Emergency withdraw
        dcaBot.emergencyWithdraw();
        
        // Verify USDC was returned
        assertEq(IERC20(USDC).balanceOf(user1), PURCHASE_AMOUNT);
        
        vm.stopPrank();
    }

    function test_Revert_NoActiveStrategy() public {
        vm.startPrank(user1);
        
        // Try to submit intent without creating strategy
        deal(USDC, user1, PURCHASE_AMOUNT);
        IERC20(USDC).approve(address(dcaBot), PURCHASE_AMOUNT);
        
        vm.expectRevert("No active strategy");
        dcaBot.submitDCAIntent(_encryptValue(PURCHASE_AMOUNT));
        
        vm.stopPrank();
    }

    function test_Revert_AlreadyParticipated() public {
        vm.startPrank(user1);
        
        // Create strategy
        bytes memory encryptedBudget = _encryptValue(BUDGET);
        bytes memory encryptedPurchaseAmount = _encryptValue(PURCHASE_AMOUNT);
        bytes memory encryptedTimeframe = _encryptValue(uint256(TIMEFRAME));
        bytes memory encryptedFrequency = _encryptValue(uint256(FREQUENCY));
        
        dcaBot.createStrategy(
            encryptedBudget,
            encryptedPurchaseAmount,
            encryptedTimeframe,
            encryptedFrequency
        );
        
        deal(USDC, user1, PURCHASE_AMOUNT * 2);
        IERC20(USDC).approve(address(dcaBot), PURCHASE_AMOUNT * 2);
        
        // Submit first intent
        dcaBot.submitDCAIntent(_encryptValue(PURCHASE_AMOUNT));
        
        // Try to submit second intent
        vm.expectRevert("Already participated");
        dcaBot.submitDCAIntent(_encryptValue(PURCHASE_AMOUNT));
        
        vm.stopPrank();
    }

    // ============ HELPER FUNCTIONS ============

    function _setupMultipleUsers() internal {
        // Setup user1
        vm.startPrank(user1);
        bytes memory encryptedBudget = _encryptValue(BUDGET);
        bytes memory encryptedPurchaseAmount = _encryptValue(PURCHASE_AMOUNT);
        bytes memory encryptedTimeframe = _encryptValue(uint256(TIMEFRAME));
        bytes memory encryptedFrequency = _encryptValue(uint256(FREQUENCY));
        
        dcaBot.createStrategy(
            encryptedBudget,
            encryptedPurchaseAmount,
            encryptedTimeframe,
            encryptedFrequency
        );
        vm.stopPrank();
        
        // Setup user2
        vm.startPrank(user2);
        dcaBot.createStrategy(
            encryptedBudget,
            encryptedPurchaseAmount,
            encryptedTimeframe,
            encryptedFrequency
        );
        vm.stopPrank();
        
        // Setup user3
        vm.startPrank(user3);
        dcaBot.createStrategy(
            encryptedBudget,
            encryptedPurchaseAmount,
            encryptedTimeframe,
            encryptedFrequency
        );
        vm.stopPrank();
    }

    function _submitIntentsFromUsers() internal {
        // User1
        vm.startPrank(user1);
        deal(USDC, user1, PURCHASE_AMOUNT);
        IERC20(USDC).approve(address(dcaBot), PURCHASE_AMOUNT);
        dcaBot.submitDCAIntent(_encryptValue(PURCHASE_AMOUNT));
        vm.stopPrank();
        
        // User2
        vm.startPrank(user2);
        deal(USDC, user2, PURCHASE_AMOUNT);
        IERC20(USDC).approve(address(dcaBot), PURCHASE_AMOUNT);
        dcaBot.submitDCAIntent(_encryptValue(PURCHASE_AMOUNT));
        vm.stopPrank();
        
        // User3
        vm.startPrank(user3);
        deal(USDC, user3, PURCHASE_AMOUNT);
        IERC20(USDC).approve(address(dcaBot), PURCHASE_AMOUNT);
        dcaBot.submitDCAIntent(_encryptValue(PURCHASE_AMOUNT));
        vm.stopPrank();
    }

    function _encryptValue(uint256 value) internal pure returns (bytes memory) {
        // Simplified encryption for testing
        // In real implementation, this would use proper FHE encryption
        return abi.encode(value);
    }
}
