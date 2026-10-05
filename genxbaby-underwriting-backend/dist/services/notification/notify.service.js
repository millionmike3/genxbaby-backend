"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildNotificationMessage = buildNotificationMessage;
function buildNotificationMessage({ caseId, decision, riskScore }) {
    return `Case ${caseId} decision: ${decision} (Risk Score: ${riskScore})`;
}
