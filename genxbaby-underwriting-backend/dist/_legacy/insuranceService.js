"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestInsuranceQuote = requestInsuranceQuote;
exports.selectPolicy = selectPolicy;
// src/services/insuranceService.ts
const timelineEventService_1 = require("./timelineEventService");
async function requestInsuranceQuote(applicationId, borrowerId, property) {
    const quote = await fetchQuote(property); // your logic
    await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, "INSURANCE_QUOTE_RECEIVED", quote);
    return quote;
}
async function selectPolicy(applicationId, borrowerId, policy) {
    const savedPolicy = await savePolicy(policy); // your logic
    await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, "INSURANCE_POLICY_SELECTED", savedPolicy);
    return savedPolicy;
}
