"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationQueue = exports.anchoringQueue = exports.underwritingQueue = void 0;
exports.listUnderwritingCases = listUnderwritingCases;
const bullmq_1 = require("bullmq");
const connection_1 = require("../workers/connection");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function listUnderwritingCases() {
    return prisma.underwritingCase.findMany({
    // Add filters or includes if needed, otherwise leave empty
    });
}
/**
 * Underwriting Queue
 * Runs risk scoring for mortgage underwriting cases.
 */
exports.underwritingQueue = new bullmq_1.Queue("underwriting", {
    connection: connection_1.connection
});
/**
 * Anchoring Queue
 * Anchors underwriting cases on-chain (simulated).
 */
exports.anchoringQueue = new bullmq_1.Queue("anchoring", {
    connection: connection_1.connection
});
/**
 * Notification Queue
 * Stores notifications triggered by underwriting + anchoring.
 */
exports.notificationQueue = new bullmq_1.Queue("notifications", {
    connection: connection_1.connection
});
