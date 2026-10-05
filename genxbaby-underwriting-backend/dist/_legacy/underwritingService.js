"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.issueDecision = issueDecision;
// src/services/underwritingService.ts
const timelineEventService_1 = require("./timelineEventService");
async function issueDecision(applicationId, borrowerId, file) {
    const decision = await runUnderwriting(file); // your existing logic
    await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, "UW_DECISION_ISSUED", decision);
    if (decision.conditions?.length) {
        await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, "UW_CONDITIONS_CREATED", { conditions: decision.conditions });
    }
    return decision;
}
