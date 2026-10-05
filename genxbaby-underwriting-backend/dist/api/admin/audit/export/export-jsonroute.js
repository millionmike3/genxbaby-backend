"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const prisma_1 = require("@/db/prisma");
const rbac_1 = require("@/middleware/rbac");
const log_1 = require("@/services/audit/log");
const notify_service_1 = require("@/services/notifications/notify.service");
async function GET(req) {
    const userId = req.headers.get("x-user-id");
    await (0, rbac_1.requirePermission)(userId, "VIEW_AUDIT_LOGS");
    const logs = await prisma_1.prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 5000
    });
    await (0, notify_service_1.pushNotification)("AUDIT_EXPORT", "Audit logs exported (JSON)");
    await (0, log_1.logAudit)({
        actor: userId,
        action: "EXPORT_AUDIT_LOGS_JSON",
        target: "audit-log-json",
        metadata: { count: logs.length }
    });
    return server_1.NextResponse.json(logs);
}
