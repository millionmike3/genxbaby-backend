"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = exports.Worker = exports.connection = void 0;
const bullmq_1 = require("bullmq");
Object.defineProperty(exports, "Worker", { enumerable: true, get: function () { return bullmq_1.Worker; } });
Object.defineProperty(exports, "Queue", { enumerable: true, get: function () { return bullmq_1.Queue; } });
/**
 * Redis connection for BullMQ workers + queues
 * Works locally and in production (Railway, Render, etc.)
 */
exports.connection = {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD || undefined
};
