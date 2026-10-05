"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestorDeliveryService = void 0;
const timelineEventService_1 = require("../timelineEventService");
const eventTypes_1 = require("../../events/eventTypes");
const eventSystems_1 = require("../../events/eventSystems");
exports.InvestorDeliveryService = {
    async createDeliveryPackage(applicationId, borrowerId, loan) {
        const pkg = { url: "/docs/delivery.zip", investor: "BlackRock" };
        await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, eventTypes_1.EventType.DELIVERY_PACKAGE_CREATED, {
            system: eventSystems_1.EventSystem.InvestorDeliveryEngine,
            ...pkg
        });
        return pkg;
    },
    async markLoanSold(applicationId, borrowerId, sale) {
        const result = { sold: true, investor: sale.investor };
        await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, eventTypes_1.EventType.LOAN_SOLD, {
            system: eventSystems_1.EventSystem.InvestorDeliveryEngine,
            ...result
        });
        return result;
    }
};
