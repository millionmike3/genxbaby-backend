"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMerkleSnapshot = createMerkleSnapshot;
exports.anchorToPolygon = anchorToPolygon;
// src/services/blockchainAnchoringService.ts
const timelineEventService_1 = require("./timelineEventService");
async function createMerkleSnapshot(applicationId, borrowerId, state) {
    const snapshot = await buildMerkleTree(state); // your logic
    await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, "MERKLE_SNAPSHOT_CREATED", { root: snapshot.root });
    return snapshot;
}
async function anchorToPolygon(applicationId, borrowerId, snapshot) {
    const receipt = await sendAnchorTx(snapshot.root); // your logic
    await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, "ANCHOR_TX_MINED", { txHash: receipt.txHash, blockNumber: receipt.blockNumber });
    return receipt;
}
