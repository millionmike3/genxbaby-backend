"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainAnchoringService = void 0;
const timelineEventService_1 = require("../timelineEventService");
const eventTypes_1 = require("../../events/eventTypes");
const eventSystems_1 = require("../../events/eventSystems");
exports.BlockchainAnchoringService = {
    async createMerkleSnapshot(applicationId, borrowerId, state) {
        const snapshot = { root: "abc123" };
        await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, eventTypes_1.EventType.MERKLE_SNAPSHOT_CREATED, {
            system: eventSystems_1.EventSystem.BlockchainAnchoring,
            ...snapshot
        });
        return snapshot;
    },
    async anchorToPolygon(applicationId, borrowerId, snapshot) {
        const receipt = { txHash: "0x123", blockNumber: 987654 };
        await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, eventTypes_1.EventType.ANCHOR_TX_MINED, {
            system: eventSystems_1.EventSystem.BlockchainAnchoring,
            ...receipt
        });
        return receipt;
    }
};
