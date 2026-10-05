// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title UnderwritingRegistry
 * @notice Stores and manages underwriting cases, decisions, and audit trail.
 * @dev Designed for off-chain integration via backend + admin dashboard.
 */
contract UnderwritingRegistry {
    enum CaseStatus {
        Pending,
        Approved,
        Declined,
        Withdrawn
    }

    struct UnderwritingCase {
        uint256 id;
        address applicant;
        string externalRef;      // e.g. loan/app ID in your backend
        uint256 requestedAmount; // in smallest unit (e.g. wei or cents mapped off-chain)
        uint256 approvedAmount;  // 0 until approved
        CaseStatus status;
        address underwriter;
        uint256 createdAt;
        uint256 decidedAt;
        string decisionNotes;    // short explanation or code
    }

    // Incremental case ID
    uint256 private _nextCaseId;

    // Case storage
    mapping(uint256 => UnderwritingCase) private _cases;

    // Role management
    address public owner;
    mapping(address => bool) public isUnderwriter;
    mapping(address => bool) public isAdmin;

    // Events
    event CaseCreated(
        uint256 indexed caseId,
        address indexed applicant,
        string externalRef,
        uint256 requestedAmount
    );

    event CaseApproved(
        uint256 indexed caseId,
        address indexed underwriter,
        uint256 approvedAmount,
        string decisionNotes
    );

    event CaseDeclined(
        uint256 indexed caseId,
        address indexed underwriter,
        string decisionNotes
    );

    event CaseWithdrawn(
        uint256 indexed caseId,
        address indexed applicant
    );

    event UnderwriterAdded(address indexed account);
    event UnderwriterRemoved(address indexed account);
    event AdminAdded(address indexed account);
    event AdminRemoved(address indexed account);
    event OwnerTransferred(address indexed oldOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyAdmin() {
        require(isAdmin[msg.sender] || msg.sender == owner, "Not admin");
        _;
    }

    modifier onlyUnderwriter() {
        require(isUnderwriter[msg.sender], "Not underwriter");
        _;
    }

    constructor() {
        owner = msg.sender;
        isAdmin[msg.sender] = true;
        _nextCaseId = 1;
    }

    // --- Role management ---

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero address");
        emit OwnerTransferred(owner, newOwner);
        owner = newOwner;
        isAdmin[newOwner] = true;
    }

    function addUnderwriter(address account) external onlyAdmin {
        require(account != address(0), "Zero address");
        require(!isUnderwriter[account], "Already underwriter");
        isUnderwriter[account] = true;
        emit UnderwriterAdded(account);
    }

    function removeUnderwriter(address account) external onlyAdmin {
        require(isUnderwriter[account], "Not underwriter");
        isUnderwriter[account] = false;
        emit UnderwriterRemoved(account);
    }

    function addAdmin(address account) external onlyOwner {
        require(account != address(0), "Zero address");
        require(!isAdmin[account], "Already admin");
        isAdmin[account] = true;
        emit AdminAdded(account);
    }

    function removeAdmin(address account) external onlyOwner {
        require(isAdmin[account], "Not admin");
        isAdmin[account] = false;
        emit AdminRemoved(account);
    }

    // --- Case lifecycle ---

    /**
     * @notice Create a new underwriting case.
     * @param externalRef Off-chain reference (loan ID, file ID, etc.).
     * @param requestedAmount Amount requested (interpretation handled off-chain).
     */
    function createCase(
        string calldata externalRef,
        uint256 requestedAmount
    ) external returns (uint256) {
        require(requestedAmount > 0, "Invalid amount");

        uint256 caseId = _nextCaseId;
        _nextCaseId++;

        UnderwritingCase storage c = _cases[caseId];
        c.id = caseId;
        c.applicant = msg.sender;
        c.externalRef = externalRef;
        c.requestedAmount = requestedAmount;
        c.approvedAmount = 0;
        c.status = CaseStatus.Pending;
        c.underwriter = address(0);
        c.createdAt = block.timestamp;
        c.decidedAt = 0;
        c.decisionNotes = "";

        emit CaseCreated(caseId, msg.sender, externalRef, requestedAmount);
        return caseId;
    }

    /**
     * @notice Approve a case with an amount and notes.
     * @dev Only underwriters can approve. Case must be Pending.
     */
    function approveCase(
        uint256 caseId,
        uint256 approvedAmount,
        string calldata decisionNotes
    ) external onlyUnderwriter {
        UnderwritingCase storage c = _cases[caseId];
        require(c.id != 0, "Case not found");
        require(c.status == CaseStatus.Pending, "Not pending");
        require(approvedAmount > 0, "Invalid approved amount");
        require(approvedAmount <= c.requestedAmount, "Exceeds requested");

        c.approvedAmount = approvedAmount;
        c.status = CaseStatus.Approved;
        c.underwriter = msg.sender;
        c.decidedAt = block.timestamp;
        c.decisionNotes = decisionNotes;

        emit CaseApproved(caseId, msg.sender, approvedAmount, decisionNotes);
    }

    /**
     * @notice Decline a case with notes.
     * @dev Only underwriters can decline. Case must be Pending.
     */
    function declineCase(
        uint256 caseId,
        string calldata decisionNotes
    ) external onlyUnderwriter {
        UnderwritingCase storage c = _cases[caseId];
        require(c.id != 0, "Case not found");
        require(c.status == CaseStatus.Pending, "Not pending");

        c.approvedAmount = 0;
        c.status = CaseStatus.Declined;
        c.underwriter = msg.sender;
        c.decidedAt = block.timestamp;
        c.decisionNotes = decisionNotes;

        emit CaseDeclined(caseId, msg.sender, decisionNotes);
    }

    /**
     * @notice Applicant can withdraw a pending case.
     */
    function withdrawCase(uint256 caseId) external {
        UnderwritingCase storage c = _cases[caseId];
        require(c.id != 0, "Case not found");
        require(c.applicant == msg.sender, "Not applicant");
        require(c.status == CaseStatus.Pending, "Not pending");

        c.status = CaseStatus.Withdrawn;
        c.decidedAt = block.timestamp;

        emit CaseWithdrawn(caseId, msg.sender);
    }

    // --- View functions ---

    function getCase(uint256 caseId)
        external
        view
        returns (UnderwritingCase memory)
    {
        require(_cases[caseId].id != 0, "Case not found");
        return _cases[caseId];
    }

    function getCaseStatus(uint256 caseId) external view returns (CaseStatus) {
        require(_cases[caseId].id != 0, "Case not found");
        return _cases[caseId].status;
    }

    function getApplicant(uint256 caseId) external view returns (address) {
        require(_cases[caseId].id != 0, "Case not found");
        return _cases[caseId].applicant;
    }

    function nextCaseId() external view returns (uint256) {
        return _nextCaseId;
    }
}
