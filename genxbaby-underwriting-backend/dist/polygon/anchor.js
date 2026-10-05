"use strict";
// src/polygon/anchor.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.anchorDecisionOnPolygon = anchorDecisionOnPolygon;
const ethers_1 = require("ethers");
const config_1 = require("../blockchain/config");
async function anchorDecisionOnPolygon(app) {
    const provider = (0, config_1.getPolygonProvider)();
    // Use a private key from env for now (service wallet)
    const privateKey = process.env.POLYGON_ANCHOR_PRIVATE_KEY;
    if (!privateKey) {
        throw new Error("POLYGON_ANCHOR_PRIVATE_KEY is not set");
    }
    const wallet = new ethers_1.ethers.Wallet(privateKey, provider);
    const contract = (0, config_1.getUnderwritingAnchorContract)(wallet);
    // Very simple “merkle root”: hash of app.id + decision + riskScore
    const payload = JSON.stringify({
        applicationId: app.id,
        decision: app.underwriting?.decision,
        riskScore: app.underwriting?.riskScore
    });
    const merkleRoot = ethers_1.ethers.keccak256(ethers_1.ethers.toUtf8Bytes(payload));
    const txResponse = await contract.anchor(merkleRoot);
    const txReceipt = await txResponse.wait();
    return {
        hash: txReceipt.transactionHash,
        merkleRoot
    };
}
