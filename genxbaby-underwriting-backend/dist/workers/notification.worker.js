"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationWorker = void 0;
const connection_1 = require("./connection");
const client_1 = require("@prisma/client");
const connection_2 = require("./connection");
const prisma = new client_1.PrismaClient();
/**
 * Notification Worker
 * Stores notifications triggered by underwriting + anchoring events.
 */
exports.notificationWorker = new connection_1.Worker("notifications", async (job) => {
    try {
        const { type, message } = job.data;
        // Save notification in DB
        const saved = await prisma.notification.create({
            data: {
                type,
                message
            }
        });
        console.log(`[NotificationWorker] Notification saved → ID: ${saved.id}, Type: ${saved.type}`);
        return saved;
    }
    catch (err) {
        console.error("[NotificationWorker] Error processing job:", err);
        throw err;
    }
}, {
    connection: connection_2.connection,
    concurrency: 5
});
// Worker lifecycle events
exports.notificationWorker.on("completed", job => {
    console.log(`[NotificationWorker] Job completed → ID: ${job.id}, Queue: ${job.queueName}`);
});
exports.notificationWorker.on("failed", (job, err) => {
    console.error(`[NotificationWorker] Job FAILED → ID: ${job?.id}, Error: ${err.message}`);
});
