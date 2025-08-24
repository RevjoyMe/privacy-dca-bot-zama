// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../contracts/AchievementNFT.sol";

contract DeployAchievementNFT is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy AchievementNFT contract
        AchievementNFT achievementNFT = new AchievementNFT();
        
        vm.stopBroadcast();
        
        console.log("AchievementNFT deployed at:", address(achievementNFT));
        
        // Save deployment info
        string memory deploymentInfo = string(abi.encodePacked(
            "AchievementNFT deployed at: ",
            vm.toString(address(achievementNFT)),
            "\nDeployer: ",
            vm.toString(vm.addr(deployerPrivateKey)),
            "\nBlock: ",
            vm.toString(block.number)
        ));
        
        vm.writeFile("deployments/achievement-nft.txt", deploymentInfo);
    }
}
