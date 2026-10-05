"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePricing = generatePricing;
// src/services/pricingEngine.ts
const timelineEventService_1 = require("./timelineEventService");
async function generatePricing(applicationId, borrowerId, input) {
    const pricingData = await calculatePricing(input); // your existing logic
    await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, "PRICING_GENERATED", pricingData);
    return pricingData;
}
