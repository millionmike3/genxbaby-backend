"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppraisalService = void 0;
const timelineEventService_1 = require("../timelineEventService");
const eventTypes_1 = require("../../events/eventTypes");
const eventSystems_1 = require("../../events/eventSystems");
exports.AppraisalService = {
    async orderAppraisal(applicationId, borrowerId, payload) {
        // TODO: Insert appraisal ordering logic
        const order = { orderId: "AP-001", status: "ORDERED" };
        await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, eventTypes_1.EventType.APPRAISAL_ORDERED, {
            system: eventSystems_1.EventSystem.AppraisalService,
            ...order
        });
        return order;
    },
    async handleAppraisalCallback(applicationId, borrowerId, report) {
        await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, eventTypes_1.EventType.APPRAISAL_RECEIVED, {
            system: eventSystems_1.EventSystem.AppraisalService,
            ...report
        });
        // TODO: Insert evaluation logic
        const evaluation = { value: 525000, asIs: 500000 };
        await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, eventTypes_1.EventType.APPRAISAL_EVALUATED, {
            system: eventSystems_1.EventSystem.AppraisalService,
            ...evaluation
        });
        return evaluation;
    }
};
