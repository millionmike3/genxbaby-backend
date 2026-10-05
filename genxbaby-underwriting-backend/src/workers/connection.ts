import { Worker, Queue } from "bullmq";

/**
 * Redis connection for BullMQ workers + queues
 * Works locally and in production (Railway, Render, etc.)
 */
export const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD || undefined
};

export { Worker, Queue };
