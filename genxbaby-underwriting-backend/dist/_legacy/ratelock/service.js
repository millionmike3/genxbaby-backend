"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLockService = void 0;
const timelineEventService_1 = require("../timelineEventService");
const eventTypes_1 = require("../../events/eventTypes");
const eventSystems_1 = require("../../events/eventSystems");
exports.RateLockService = {
    async createRateLock(applicationId, borrowerId, pricing) {
        const lock = { lockId: "RL-001", rate: pricing.finalRate };
        await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, eventTypes_1.EventType.RATE_LOCK_CREATED, {
            system: eventSystems_1.EventSystem.RateLockEngine,
            ...lock
        });
        return lock;
    },
    async validateRateLock(applicationId, borrowerId, lock) {
        const result = { valid: true };
        await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, eventTypes_1.EventType.RATE_LOCK_VALIDATED, {
            system: eventSystems_1.EventSystem.RateLockEngine,
            ...result
        });
        return result;
    }
};
