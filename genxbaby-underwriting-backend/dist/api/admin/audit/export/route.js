"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const prisma_1 = require("@/db/prisma");
const rbac_1 = require("@/middleware/rbac");
const log_1 = require("@/services/audit/log");
const notify_service_1 = require("@/services/notifications/notify.service");
async function GET(req) {
    try {
        const userId = req.headers.get("x-user-id");
        await (0, rbac_1.requirePermission)(userId, "VIEW_AUDIT_LOGS");
        const logs = await prisma_1.prisma.auditLog.findMany({
            orderBy: { createdAt: "desc" },
            take: 5000
        });
        const header = [
            "id",
            "actor",
            "action",
            "target",
            "metadata",
            "createdAt"
        ].join(",");
        const rows = logs.map((log) => [
            log.id,
            log.actor,
            log.action,
            log.target ?? "",
            JSON.stringify(log.metadata ?? {}),
            log.createdAt.toISOString()
        ]
            .map((v) => `"${String(v).replace(/"/g, '""')}"`)
            .join(","));
        const csv = [header, ...rows].join("\n");
        await (0, notify_service_1.pushNotification)("AUDIT_EXPORT", `Audit logs exported (${logs.length} rows)`);
        await (0, log_1.logAudit)({
            actor: userId,
            action: "EXPORT_AUDIT_LOGS",
            target: "audit-log-csv",
            metadata: { rowCount: logs.length }
        });
        return new server_1.NextResponse(csv, {
            status: 200,
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="audit_logs_${Date.now()}.csv"`
            }
        });
    }
    catch (err) {
        console.error("Audit export error:", err);
        return server_1.NextResponse.json({ error: "Failed to export audit logs" }, { status: 500 });
    }
}
