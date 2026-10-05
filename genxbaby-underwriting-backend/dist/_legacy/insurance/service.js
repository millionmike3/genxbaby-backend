"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsuranceService = void 0;
const timelineEventService_1 = require("../timelineEventService");
const eventTypes_1 = require("../../events/eventTypes");
const eventSystems_1 = require("../../events/eventSystems");
exports.InsuranceService = {
    async requestQuote(applicationId, borrowerId, property) {
        // TODO: Insert insurance quote logic
        const quote = { premium: 1200, provider: "StateFarm" };
        await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, eventTypes_1.EventType.INSURANCE_QUOTE_RECEIVED, {
            system: eventSystems_1.EventSystem.InsuranceService,
            ...quote
        });
        return quote;
    },
    async selectPolicy(applicationId, borrowerId, policy) {
        // TODO: Insert policy selection logic
        const savedPolicy = { ...policy, selected: true };
        await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, eventTypes_1.EventType.INSURANCE_POLICY_SELECTED, {
            system: eventSystems_1.EventSystem.InsuranceService,
            ...savedPolicy
        });
        return savedPolicy;
    }
};
