"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDeliveryPackage = createDeliveryPackage;
exports.markLoanSold = markLoanSold;
// src/services/investorDeliveryService.ts
const timelineEventService_1 = require("./timelineEventService");
async function createDeliveryPackage(applicationId, borrowerId, loan) {
    const pkg = await buildDeliveryPackage(loan); // your logic
    await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, "DELIVERY_PACKAGE_CREATED", { url: pkg.url, investor: pkg.investor });
    return pkg;
}
async function markLoanSold(applicationId, borrowerId, sale) {
    const result = await recordSale(sale); // your logic
    await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, "LOAN_SOLD", result);
    return result;
}
