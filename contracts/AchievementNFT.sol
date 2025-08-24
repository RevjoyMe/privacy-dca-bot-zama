// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@fhevm/solidity/lib/FHE.sol";

/**
 * @title AchievementNFT
 * @dev NFT collection for user achievements with privacy-preserving metadata
 */
contract AchievementNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    // Achievement types
    enum AchievementType {
        FIRST_STRATEGY,
        CONSISTENT_INVESTOR,
        AI_OPTIMIZER,
        CROSS_CHAIN_EXPLORER,
        PRIVACY_CHAMPION,
        BATCH_MASTER
    }

    struct AchievementMetadata {
        AchievementType achievementType;
        uint32 earnedAt;
        euint128 encryptedValue;  // Encrypted achievement value
        bool isPrivate;           // Whether metadata is private
        string publicDescription; // Public description (if not private)
    }

    // Mapping from token ID to achievement metadata
    mapping(uint256 => AchievementMetadata) public achievementMetadata;
    
    // Mapping from user to their achievement tokens
    mapping(address => uint256[]) public userAchievements;
    
    // Achievement descriptions
    mapping(AchievementType => string) public achievementDescriptions;
    
    // Events
    event AchievementMinted(
        address indexed user,
        uint256 indexed tokenId,
        AchievementType achievementType,
        bool isPrivate
    );
    
    event MetadataUpdated(
        uint256 indexed tokenId,
        bool isPrivate,
        string publicDescription
    );

    constructor() ERC721("Privacy DCA Achievements", "PDCA") {
        // Set achievement descriptions
        achievementDescriptions[AchievementType.FIRST_STRATEGY] = "First Steps - Created your first DCA strategy";
        achievementDescriptions[AchievementType.CONSISTENT_INVESTOR] = "Consistent Investor - Made 10+ DCA purchases";
        achievementDescriptions[AchievementType.AI_OPTIMIZER] = "AI Optimizer - Used AI-powered strategy optimization";
        achievementDescriptions[AchievementType.CROSS_CHAIN_EXPLORER] = "Cross-Chain Explorer - DCA across multiple blockchains";
        achievementDescriptions[AchievementType.PRIVACY_CHAMPION] = "Privacy Champion - Enabled advanced privacy features";
        achievementDescriptions[AchievementType.BATCH_MASTER] = "Batch Master - Participated in 20+ batch executions";
    }

    /**
     * @dev Mint achievement NFT (only callable by DCA bot contract)
     */
    function mintAchievement(
        address _user,
        AchievementType _achievementType,
        euint128 _encryptedValue,
        bool _isPrivate
    ) external onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(_user, newTokenId);

        // Create achievement metadata
        AchievementMetadata memory metadata = AchievementMetadata({
            achievementType: _achievementType,
            earnedAt: uint32(block.timestamp),
            encryptedValue: _encryptedValue,
            isPrivate: _isPrivate,
            publicDescription: _isPrivate ? "" : achievementDescriptions[_achievementType]
        });

        achievementMetadata[newTokenId] = metadata;
        userAchievements[_user].push(newTokenId);

        // Set token URI (private or public)
        string memory tokenURI = _isPrivate 
            ? _generatePrivateTokenURI(newTokenId, metadata)
            : _generatePublicTokenURI(newTokenId, metadata);
        
        _setTokenURI(newTokenId, tokenURI);

        emit AchievementMinted(_user, newTokenId, _achievementType, _isPrivate);

        return newTokenId;
    }

    /**
     * @dev Update achievement metadata privacy settings
     */
    function updateMetadataPrivacy(
        uint256 _tokenId,
        bool _isPrivate,
        string memory _publicDescription
    ) external {
        require(_exists(_tokenId), "Token does not exist");
        require(ownerOf(_tokenId) == msg.sender, "Not token owner");

        AchievementMetadata storage metadata = achievementMetadata[_tokenId];
        metadata.isPrivate = _isPrivate;
        
        if (!_isPrivate) {
            metadata.publicDescription = _publicDescription;
        }

        // Update token URI
        string memory tokenURI = _isPrivate 
            ? _generatePrivateTokenURI(_tokenId, metadata)
            : _generatePublicTokenURI(_tokenId, metadata);
        
        _setTokenURI(_tokenId, tokenURI);

        emit MetadataUpdated(_tokenId, _isPrivate, _publicDescription);
    }

    /**
     * @dev Get user's achievement tokens
     */
    function getUserAchievements(address _user) external view returns (uint256[] memory) {
        return userAchievements[_user];
    }

    /**
     * @dev Get achievement metadata (public version)
     */
    function getAchievementMetadata(uint256 _tokenId) external view returns (
        AchievementType achievementType,
        uint32 earnedAt,
        bool isPrivate,
        string memory publicDescription
    ) {
        require(_exists(_tokenId), "Token does not exist");
        
        AchievementMetadata memory metadata = achievementMetadata[_tokenId];
        return (
            metadata.achievementType,
            metadata.earnedAt,
            metadata.isPrivate,
            metadata.publicDescription
        );
    }

    /**
     * @dev Get encrypted achievement value (only for token owner)
     * Note: This function cannot be view since it returns encrypted data
     */
    function getEncryptedAchievementValue(uint256 _tokenId) external returns (euint128) {
        require(_exists(_tokenId), "Token does not exist");
        require(ownerOf(_tokenId) == msg.sender, "Not token owner");
        
        return achievementMetadata[_tokenId].encryptedValue;
    }

    /**
     * @dev Generate private token URI (encrypted metadata)
     */
    function _generatePrivateTokenURI(
        uint256 _tokenId,
        AchievementMetadata memory _metadata
    ) internal pure returns (string memory) {
        // In a real implementation, this would return encrypted metadata
        // For now, return a placeholder URI
        return string(abi.encodePacked(
            "data:application/json;base64,",
            _base64Encode(abi.encodePacked(
                '{"name":"Private Achievement #', _uint2str(_tokenId), '",',
                '"description":"This achievement metadata is private",',
                '"image":"data:image/svg+xml;base64,', _generatePrivateSVG(), '",',
                '"attributes":[{"trait_type":"Privacy","value":"Private"}]}'
            ))
        ));
    }

    /**
     * @dev Generate public token URI
     */
    function _generatePublicTokenURI(
        uint256 _tokenId,
        AchievementMetadata memory _metadata
    ) internal view returns (string memory) {
        string memory achievementName = _getAchievementName(_metadata.achievementType);
        
        return string(abi.encodePacked(
            "data:application/json;base64,",
            _base64Encode(abi.encodePacked(
                '{"name":"', achievementName, ' #', _uint2str(_tokenId), '",',
                '"description":"', _metadata.publicDescription, '",',
                '"image":"data:image/svg+xml;base64,', _generatePublicSVG(_metadata.achievementType), '",',
                '"attributes":[',
                '{"trait_type":"Achievement Type","value":"', achievementName, '"},',
                '{"trait_type":"Earned At","value":"', _uint2str(_metadata.earnedAt), '"},',
                '{"trait_type":"Privacy","value":"Public"}',
                ']}'
            ))
        ));
    }

    /**
     * @dev Generate private SVG image
     */
    function _generatePrivateSVG() internal pure returns (string memory) {
        return _base64Encode(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">',
            '<rect width="400" height="400" fill="#1a1a1a"/>',
            '<circle cx="200" cy="200" r="150" fill="none" stroke="#333" stroke-width="2"/>',
            '<text x="200" y="200" text-anchor="middle" fill="#666" font-family="Arial" font-size="16">',
            'Private Achievement</text>',
            '<text x="200" y="220" text-anchor="middle" fill="#666" font-family="Arial" font-size="12">',
            'Metadata Hidden</text>',
            '</svg>'
        ));
    }

    /**
     * @dev Generate public SVG image based on achievement type
     */
    function _generatePublicSVG(AchievementType _achievementType) internal pure returns (string memory) {
        string memory color = _getAchievementColor(_achievementType);
        string memory icon = _getAchievementIcon(_achievementType);
        
        return _base64Encode(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">',
            '<rect width="400" height="400" fill="', color, '"/>',
            '<circle cx="200" cy="200" r="150" fill="none" stroke="#fff" stroke-width="3"/>',
            '<text x="200" y="200" text-anchor="middle" fill="#fff" font-family="Arial" font-size="24">',
            icon, '</text>',
            '</svg>'
        ));
    }

    /**
     * @dev Get achievement name
     */
    function _getAchievementName(AchievementType _achievementType) internal pure returns (string memory) {
        if (_achievementType == AchievementType.FIRST_STRATEGY) return "First Strategy";
        if (_achievementType == AchievementType.CONSISTENT_INVESTOR) return "Consistent Investor";
        if (_achievementType == AchievementType.AI_OPTIMIZER) return "AI Optimizer";
        if (_achievementType == AchievementType.CROSS_CHAIN_EXPLORER) return "Cross-Chain Explorer";
        if (_achievementType == AchievementType.PRIVACY_CHAMPION) return "Privacy Champion";
        if (_achievementType == AchievementType.BATCH_MASTER) return "Batch Master";
        return "Unknown Achievement";
    }

    /**
     * @dev Get achievement color
     */
    function _getAchievementColor(AchievementType _achievementType) internal pure returns (string memory) {
        if (_achievementType == AchievementType.FIRST_STRATEGY) return "#4CAF50";
        if (_achievementType == AchievementType.CONSISTENT_INVESTOR) return "#2196F3";
        if (_achievementType == AchievementType.AI_OPTIMIZER) return "#9C27B0";
        if (_achievementType == AchievementType.CROSS_CHAIN_EXPLORER) return "#FF9800";
        if (_achievementType == AchievementType.PRIVACY_CHAMPION) return "#E91E63";
        if (_achievementType == AchievementType.BATCH_MASTER) return "#607D8B";
        return "#666666";
    }

    /**
     * @dev Get achievement icon
     */
    function _getAchievementIcon(AchievementType _achievementType) internal pure returns (string memory) {
        if (_achievementType == AchievementType.FIRST_STRATEGY) return "🚀";
        if (_achievementType == AchievementType.CONSISTENT_INVESTOR) return "📈";
        if (_achievementType == AchievementType.AI_OPTIMIZER) return "🤖";
        if (_achievementType == AchievementType.CROSS_CHAIN_EXPLORER) return "🌐";
        if (_achievementType == AchievementType.PRIVACY_CHAMPION) return "🔒";
        if (_achievementType == AchievementType.BATCH_MASTER) return "⚡";
        return "🏆";
    }

    /**
     * @dev Base64 encoding helper
     */
    function _base64Encode(bytes memory data) internal pure returns (string memory) {
        string memory table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        uint256 len = data.length;
        if (len == 0) return "";

        uint256 encodedLen = 4 * ((len + 2) / 3);
        bytes memory result = new bytes(encodedLen);

        uint256 i = 0;
        uint256 j = 0;

        while (i < len) {
            uint256 a = i < len ? uint8(data[i++]) : 0;
            uint256 b = i < len ? uint8(data[i++]) : 0;
            uint256 c = i < len ? uint8(data[i++]) : 0;

            uint256 triple = (a << 16) + (b << 8) + c;

            result[j++] = bytes1(bytes(table)[triple >> 18 & 0x3F]);
            result[j++] = bytes1(bytes(table)[triple >> 12 & 0x3F]);
            result[j++] = bytes1(bytes(table)[triple >> 6 & 0x3F]);
            result[j++] = bytes1(bytes(table)[triple & 0x3F]);
        }

        // Adjust for padding
        while (j > 0 && result[j - 1] == "=") {
            j--;
        }

        assembly {
            mstore(result, j)
        }

        return string(result);
    }

    /**
     * @dev Convert uint to string
     */
    function _uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) return "0";
        
        uint256 j = _i;
        uint256 length;
        
        while (j != 0) {
            length++;
            j /= 10;
        }
        
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        
        while (_i != 0) {
            k -= 1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        
        return string(bstr);
    }

    // Override required functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
