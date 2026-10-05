"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAnchor = verifyAnchor;
const contract_1 = require("../blockchain/contract");
async function verifyAnchor(req, res) {
    try {
        const { txHash } = req.params;
        const receipt = await contract_1.provider.getTransactionReceipt(txHash);
        if (!receipt) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        res.json({
            txHash,
            blockNumber: receipt.blockNumber,
            success: receipt.status === 1,
            confirmations: receipt.confirmations,
        });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}
