pragma solidity ^0.8.28;

contract CheckRegistry {
    mapping(uint256 => bool) public checks;

    function registerCheck(uint256 checkId) external {
        checks[checkId] = true;
    }

    function isRegistered(uint256 checkId) external view returns (bool) {
        return checks[checkId];
    }
}
