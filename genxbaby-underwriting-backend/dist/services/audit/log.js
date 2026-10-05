"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAudit = logAudit;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Audit Logging Service
 *
 * Records admin actions such as:
 *  - batch anchoring
 *  - underwriting decisions
 *  - system events
 */
async function logAudit(params) {
    const { actor, action, metadata, ip } = params;
    return prisma.auditLog.create({
        data: {
            adminId: actor,
            action,
            ip: ip ?? null,
            metadata: metadata ?? null
        }
    });
}
