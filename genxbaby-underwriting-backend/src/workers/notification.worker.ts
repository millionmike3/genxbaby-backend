import { Worker } from "./connection";
import { PrismaClient } from "@prisma/client";
import { connection } from "./connection";

const prisma = new PrismaClient();

/**
 * Notification Worker
 * Stores notifications triggered by underwriting + anchoring events.
 */
export const notificationWorker = new Worker(
  "notifications",
  async job => {
    try {
      const { type, message } = job.data;

      // Save notification in DB
      const saved = await prisma.notification.create({
        data: {
          type,
          message
        }
      });

      console.log(
        `[NotificationWorker] Notification saved → ID: ${saved.id}, Type: ${saved.type}`
      );

      return saved;
    } catch (err) {
      console.error("[NotificationWorker] Error processing job:", err);
      throw err;
    }
  },
  {
    connection,
    concurrency: 5
  }
);

// Worker lifecycle events
notificationWorker.on("completed", job => {
  console.log(
    `[NotificationWorker] Job completed → ID: ${job.id}, Queue: ${job.queueName}`
  );
});

notificationWorker.on("failed", (job, err) => {
  console.error(
    `[NotificationWorker] Job FAILED → ID: ${job?.id}, Error: ${err.message}`
  );
});
