"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingService = void 0;
const timelineEventService_1 = require("../timelineEventService");
const eventTypes_1 = require("../../events/eventTypes");
const eventSystems_1 = require("../../events/eventSystems");
exports.PricingService = {
    async generatePricing(applicationId, borrowerId, input) {
        // TODO: Insert pricing logic
        const pricingData = {
            baseRate: 6.25,
            adjustments: { credit: 0.125, ltv: 0.25 },
            finalRate: 6.875
        };
        await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, eventTypes_1.EventType.PRICING_GENERATED, {
            system: eventSystems_1.EventSystem.PricingEngine,
            ...pricingData
        });
        return pricingData;
    }
};
