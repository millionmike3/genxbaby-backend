"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnderwritingService = void 0;
const timelineEventService_1 = require("../timelineEventService");
const eventTypes_1 = require("../../events/eventTypes");
const eventSystems_1 = require("../../events/eventSystems");
exports.UnderwritingService = {
    async issueDecision(applicationId, borrowerId, file) {
        // TODO: Insert underwriting logic
        const decision = {
            status: "CONDITIONAL",
            tier: "A2",
            conditions: ["Updated bank statements", "Insurance proof"]
        };
        await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, eventTypes_1.EventType.UW_DECISION_ISSUED, {
            system: eventSystems_1.EventSystem.UnderwritingEngine,
            ...decision
        });
        if (decision.conditions?.length) {
            await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, eventTypes_1.EventType.UW_CONDITIONS_CREATED, {
                system: eventSystems_1.EventSystem.UnderwritingEngine,
                conditions: decision.conditions
            });
        }
        return decision;
    }
};
