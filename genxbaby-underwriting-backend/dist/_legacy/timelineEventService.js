"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelineEventService = void 0;
const db_1 = require("../db");
exports.TimelineEventService = {
    /**
     * Create a timeline event
     */
    async createEvent({ applicationId, borrowerId, eventType, payload = null }) {
        return db_1.prisma.timelineEvent.create({
            data: {
                applicationId,
                borrowerId,
                eventType,
                payload
            }
        });
    },
    /**
     * Get all events for an application
     */
    async getApplicationTimeline(applicationId) {
        return db_1.prisma.timelineEvent.findMany({
            where: { applicationId },
            orderBy: { createdAt: "asc" }
        });
    },
    /**
     * Get all events for a borrower (across all applications)
     */
    async getBorrowerTimeline(borrowerId) {
        return db_1.prisma.timelineEvent.findMany({
            where: { borrowerId },
            orderBy: { createdAt: "asc" }
        });
    },
    /**
     * Log an event with auto-generated title
     */
    async logEvent(applicationId, borrowerId, eventType, payload = null) {
        return this.createEvent({
            applicationId,
            borrowerId,
            eventType,
            payload
        });
    }
};
