"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderTitle = orderTitle;
exports.handleTitleCommitment = handleTitleCommitment;
// src/services/titleService.ts
const timelineEventService_1 = require("./timelineEventService");
async function orderTitle(applicationId, borrowerId, payload) {
    const order = await sendTitleOrder(payload); // your logic
    await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, "TITLE_ORDERED", order);
    return order;
}
async function handleTitleCommitment(applicationId, borrowerId, commitment) {
    await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, "TITLE_COMMITMENT_RECEIVED", commitment);
    const validation = await validateLiens(commitment); // your logic
    await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, "TITLE_LIENS_VALIDATED", validation);
    return validation;
}
