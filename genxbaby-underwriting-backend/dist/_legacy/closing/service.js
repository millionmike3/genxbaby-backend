"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClosingService = void 0;
const timelineEventService_1 = require("../timelineEventService");
const eventTypes_1 = require("../../events/eventTypes");
const eventSystems_1 = require("../../events/eventSystems");
exports.ClosingService = {
    async generateCommitmentLetter(applicationId, borrowerId, data) {
        const letter = { url: "/docs/commitment.pdf", terms: data };
        await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, eventTypes_1.EventType.COMMITMENT_LETTER_ISSUED, {
            system: eventSystems_1.EventSystem.ClosingEngine,
            ...letter
        });
        return letter;
    },
    async generateClosingDisclosure(applicationId, borrowerId, data) {
        const cd = { url: "/docs/cd.pdf", apr: 7.12, cashToClose: 32000 };
        await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, eventTypes_1.EventType.CLOSING_DISCLOSURE_ISSUED, {
            system: eventSystems_1.EventSystem.ClosingEngine,
            ...cd
        });
        return cd;
    },
    async fundLoan(applicationId, borrowerId, funding) {
        const result = { funded: true, timestamp: Date.now() };
        await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, eventTypes_1.EventType.FUNDED, {
            system: eventSystems_1.EventSystem.ClosingEngine,
            ...result
        });
        return result;
    }
};
