"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TitleService = void 0;
const timelineEventService_1 = require("../timelineEventService");
const eventTypes_1 = require("../../events/eventTypes");
const eventSystems_1 = require("../../events/eventSystems");
exports.TitleService = {
    async orderTitle(applicationId, borrowerId, payload) {
        const order = { orderId: "T-001", status: "ORDERED" };
        await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, eventTypes_1.EventType.TITLE_ORDERED, {
            system: eventSystems_1.EventSystem.TitleService,
            ...order
        });
        return order;
    },
    async handleCommitment(applicationId, borrowerId, commitment) {
        await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, eventTypes_1.EventType.TITLE_COMMITMENT_RECEIVED, {
            system: eventSystems_1.EventSystem.TitleService,
            ...commitment
        });
        const validation = { liens: [], clear: true };
        await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, eventTypes_1.EventType.TITLE_LIENS_VALIDATED, {
            system: eventSystems_1.EventSystem.TitleService,
            ...validation
        });
        return validation;
    }
};
