// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract CheckRegistry is AccessControl {
    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;
    bytes32 public constant REGISTER_ROLE = keccak256("REGISTER_ROLE");
    bytes32 public constant VOID_ROLE = keccak256("VOID_ROLE");

    struct Check {
        uint256 amount;
        string memo;
        bool voided;
        bool exists;
    }

    // checkNumber => Check
    mapping(string => Check) private checks;

    // Latest anchored audit Merkle root
    bytes32 public latestAuditRoot;

    event CheckRegistered(string checkNumber, uint256 amount, string memo, address actor);
    event CheckVoided(string checkNumber, address actor);
    event AuditRootAnchored(bytes32 root, uint256 timestamp, address actor);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _setRoleAdmin(REGISTER_ROLE, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(VOID_ROLE, DEFAULT_ADMIN_ROLE);
    }

    function registerCheck(
        string calldata checkNumber,
        uint256 amount,
        string calldata memo
    ) external onlyRole(REGISTER_ROLE) {
        require(!checks[checkNumber].exists, "Check already exists");

        checks[checkNumber] = Check({
            amount: amount,
            memo: memo,
            voided: false,
            exists: true
        });

        emit CheckRegistered(checkNumber, amount, memo, msg.sender);
    }

    function voidCheck(string calldata checkNumber)
        external
        onlyRole(VOID_ROLE)
    {
        require(checks[checkNumber].exists, "Check not found");
        require(!checks[checkNumber].voided, "Already voided");

        checks[checkNumber].voided = true;

        emit CheckVoided(checkNumber, msg.sender);
    }

    function getCheck(string calldata checkNumber)
        external
        view
        returns (uint256 amount, string memory memo, bool voided, bool exists)
    {
        Check memory c = checks[checkNumber];
        return (c.amount, c.memo, c.voided, c.exists);
    }

    // -------- Blockchain‑anchored audit trail --------

    function anchorAuditRoot(bytes32 root)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        latestAuditRoot = root;
        emit AuditRootAnchored(root, block.timestamp, msg.sender);
    }
}
