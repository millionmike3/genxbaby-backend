"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderAppraisal = orderAppraisal;
exports.handleAppraisalCallback = handleAppraisalCallback;
// src/services/appraisalService.ts
const timelineEventService_1 = require("./timelineEventService");
async function orderAppraisal(applicationId, borrowerId, payload) {
    const order = await sendOrderToAMC(payload); // your existing logic
    await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, "APPRAISAL_ORDERED", order);
    return order;
}
async function handleAppraisalCallback(applicationId, borrowerId, report) {
    await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, "APPRAISAL_RECEIVED", report);
    const evaluation = await evaluateAppraisal(report); // your logic
    await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, "APPRAISAL_EVALUATED", evaluation);
    return evaluation;
}
