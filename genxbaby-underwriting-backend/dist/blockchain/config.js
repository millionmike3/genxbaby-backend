"use strict";
// src/blockchain/config.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNDERWRITING_ANCHOR_ABI = exports.UNDERWRITING_ANCHOR_CONTRACT_ADDRESS = exports.POLYGON_RPC_URL = void 0;
exports.getPolygonProvider = getPolygonProvider;
exports.getUnderwritingAnchorContract = getUnderwritingAnchorContract;
const ethers_1 = require("ethers");
exports.POLYGON_RPC_URL = process.env.POLYGON_RPC_URL;
exports.UNDERWRITING_ANCHOR_CONTRACT_ADDRESS = process.env.UNDERWRITING_ANCHOR_CONTRACT_ADDRESS;
// Minimal ABI: function anchor(bytes32 merkleRoot) returns (bool)
exports.UNDERWRITING_ANCHOR_ABI = [
    "function anchor(bytes32 merkleRoot) public returns (bool)"
];
function getPolygonProvider() {
    if (!exports.POLYGON_RPC_URL) {
        throw new Error("POLYGON_RPC_URL is not set");
    }
    return new ethers_1.ethers.JsonRpcProvider(exports.POLYGON_RPC_URL);
}
function getUnderwritingAnchorContract(signer) {
    if (!exports.UNDERWRITING_ANCHOR_CONTRACT_ADDRESS) {
        throw new Error("UNDERWRITING_ANCHOR_CONTRACT_ADDRESS is not set");
    }
    return new ethers_1.ethers.Contract(exports.UNDERWRITING_ANCHOR_CONTRACT_ADDRESS, exports.UNDERWRITING_ANCHOR_ABI, signer);
}
