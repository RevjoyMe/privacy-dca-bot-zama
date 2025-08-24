// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../contracts/PrivacyDCABotV3.sol";
import "../contracts/AchievementNFT.sol";

/**
 * @title Deploy Script
 * @dev Script for deploying PrivacyDCABotV3 and AchievementNFT contracts
 */
contract DeployScript is Script {
    // FHE Public Key (placeholder - should be generated properly)
    bytes32 constant FHE_PUBLIC_KEY = 0x1234567890123456789012345678901234567890123456789012345678901234;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy AchievementNFT first
        AchievementNFT achievementNFT = new AchievementNFT();
        console.log("AchievementNFT deployed at:", address(achievementNFT));
        
        // Deploy PrivacyDCABotV3 with NFT contract address
        PrivacyDCABotV3 dcaBot = new PrivacyDCABotV3(
            FHE_PUBLIC_KEY,
            address(achievementNFT)
        );
        
        console.log("PrivacyDCABotV3 deployed at:", address(dcaBot));
        
        // Configure token addresses for different chains
        _configureTokenAddresses(dcaBot);
        
        vm.stopBroadcast();
        
        // Save deployment info
        _saveDeploymentInfo(dcaBot, achievementNFT, deployerPrivateKey);
        
        // Print next steps
        _printNextSteps(dcaBot, achievementNFT);
    }
    
    function _configureTokenAddresses(PrivacyDCABotV3 dcaBot) internal {
        // Ethereum Mainnet
        dcaBot.setTokenAddresses(0, 0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8, 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2); // USDC, WETH
        
        // Polygon
        dcaBot.setTokenAddresses(1, 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174, 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270); // USDC, WMATIC
        
        // Arbitrum
        dcaBot.setTokenAddresses(2, 0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8, 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1); // USDC, WETH
        
        // Optimism
        dcaBot.setTokenAddresses(3, 0x7F5c764cBc14f9669B88837ca1490cCa17c31607, 0x4200000000000000000000000000000000000006); // USDC, WETH
        
        // Base
        dcaBot.setTokenAddresses(4, 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913, 0x4200000000000000000000000000000000000006); // USDC, WETH
        
        // BSC
        dcaBot.setTokenAddresses(5, 0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d, 0x2170Ed0880ac9A755fd29B2688956BD959F933F8); // USDC, WBNB
        
        console.log("Token addresses configured for all supported chains");
    }
    
    function _saveDeploymentInfo(
        PrivacyDCABotV3 dcaBot, 
        AchievementNFT achievementNFT, 
        uint256 deployerPrivateKey
    ) internal {
        string memory deploymentInfo = string(abi.encodePacked(
            "PrivacyDCABotV3 deployed at: ",
            vm.toString(address(dcaBot)),
            "\nAchievementNFT deployed at: ",
            vm.toString(address(achievementNFT)),
            "\nDeployer: ",
            vm.toString(vm.addr(deployerPrivateKey)),
            "\nBlock: ",
            vm.toString(block.number),
            "\n\nEnvironment Variables:",
            "\nREACT_APP_DCA_CONTRACT_ADDRESS=",
            vm.toString(address(dcaBot)),
            "\nREACT_APP_NFT_CONTRACT_ADDRESS=",
            vm.toString(address(achievementNFT))
        ));
        
        vm.writeFile("deployments/deployment-info.txt", deploymentInfo);
        console.log("Deployment info saved to deployments/deployment-info.txt");
    }
    
    function _printNextSteps(PrivacyDCABotV3 dcaBot, AchievementNFT achievementNFT) internal view {
        console.log("\n=== NEXT STEPS ===");
        console.log("1. Update frontend environment variables:");
        console.log("   REACT_APP_DCA_CONTRACT_ADDRESS=", vm.toString(address(dcaBot)));
        console.log("   REACT_APP_NFT_CONTRACT_ADDRESS=", vm.toString(address(achievementNFT)));
        console.log("\n2. Configure Chainlink Automation:");
        console.log("   - Register upkeep for batch execution");
        console.log("   - Set appropriate gas limits and funding");
        console.log("\n3. Configure AI provider API keys:");
        console.log("   - OpenAI API key for ChatGPT");
        console.log("   - Google API key for Gemini");
        console.log("   - X.AI API key for Grok");
        console.log("   - Anthropic API key for Claude");
        console.log("\n4. Test the deployment:");
        console.log("   - Run: forge test");
        console.log("   - Verify all features work correctly");
        console.log("\n5. Deploy to production:");
        console.log("   - Update RPC endpoints");
        console.log("   - Configure production token addresses");
        console.log("   - Set up monitoring and alerts");
    }
}
