// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title UnderwritingAnchor
/// @notice Anchors underwriting decisions on-chain via a Merkle root
contract UnderwritingAnchor {
    /// @dev Emitted whenever a new Merkle root is anchored
    event MerkleRootAnchored(
        bytes32 indexed merkleRoot,
        address indexed anchoredBy,
        uint256 indexed anchoredAt
    );

    /// @notice Last anchored Merkle root
    bytes32 public lastMerkleRoot;

    /// @notice Timestamp of last anchor
    uint256 public lastAnchoredAt;

    /// @notice Address that performed the last anchor
    address public lastAnchoredBy;

    /// @notice Anchor a new Merkle root representing an underwriting decision batch
    /// @param merkleRoot The Merkle root of the underwriting payload
    function anchor(bytes32 merkleRoot) external returns (bool) {
        require(merkleRoot != bytes32(0), "Invalid merkle root");

        lastMerkleRoot = merkleRoot;
        lastAnchoredAt = block.timestamp;
        lastAnchoredBy = msg.sender;

        emit MerkleRootAnchored(merkleRoot, msg.sender, block.timestamp);

        return true;
    }
}
