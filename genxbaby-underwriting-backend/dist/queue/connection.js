"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = exports.Queue = exports.connection = void 0;
const bullmq_1 = require("bullmq");
Object.defineProperty(exports, "Queue", { enumerable: true, get: function () { return bullmq_1.Queue; } });
Object.defineProperty(exports, "Worker", { enumerable: true, get: function () { return bullmq_1.Worker; } });
const connection = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379,
};
exports.connection = connection;
