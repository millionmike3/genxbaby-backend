"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.anchoringWorker = exports.notificationQueue = void 0;
const connection_1 = require("./connection");
const client_1 = require("@prisma/client");
const connection_2 = require("./connection");
const merkle_service_1 = require("../services/merkle.service");
const prisma = new client_1.PrismaClient();
// Notification queue
exports.notificationQueue = new connection_1.Queue("notifications", { connection: connection_2.connection });
/**
 * Anchoring Worker (Mortgage Underwriting System)
 *
 * This worker:
 *  - receives a leaf (caseId:riskScore)
 *  - generates a Merkle root for the single case
 *  - simulates anchoring on-chain (txHash + blockNumber)
 *  - updates the underwriting case
 *  - sends a notification
 */
exports.anchoringWorker = new connection_1.Worker("anchoring", async (job) => {
    const { caseId, leaf } = job.data;
    // Step 1 — Generate Merkle root for this single case
    const merkleRoot = (0, merkle_service_1.generateMerkleRoot)([leaf]);
    // Step 2 — Simulate Polygon anchoring
    const txHash = `0x${merkleRoot.slice(2, 66)}`;
    const blockNumber = Math.floor(Math.random() * 1000000);
    const anchoredAt = new Date();
    // Step 3 — Update underwriting case
    await prisma.underwritingCase.update({
        where: { id: caseId },
        data: {
            merkleRoot,
            anchoredTxHash: txHash,
            anchoredBlock: blockNumber,
            anchoredAt
        }
    });
    // Step 4 — Send notification
    await exports.notificationQueue.add("anchored", {
        type: "ANCHOR_COMPLETE",
        message: `Case ${caseId} anchored on-chain`,
        caseId,
        merkleRoot,
        txHash,
        blockNumber,
        anchoredAt
    });
    return { caseId, txHash, merkleRoot };
}, { connection: connection_2.connection });
