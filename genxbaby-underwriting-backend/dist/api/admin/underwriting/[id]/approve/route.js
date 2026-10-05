"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const prisma_1 = require("@/db/prisma");
const rbac_1 = require("@/middleware/rbac");
const log_1 = require("@/services/audit/log");
const notify_service_1 = require("@/services/notifications/notify.service");
async function POST(req, { params }) {
    try {
        const userId = req.headers.get("x-user-id");
        await (0, rbac_1.requirePermission)(userId, "APPROVE_APPLICATION");
        const applicationId = params.id;
        await prisma_1.prisma.application.update({
            where: { id: applicationId },
            data: { decisionStatus: "APPROVED" }
        });
        await (0, notify_service_1.pushNotification)("APPROVE", `Application ${applicationId} approved`);
        await (0, log_1.logAudit)({
            actor: userId,
            action: "APPROVE_APPLICATION",
            target: applicationId,
            metadata: {}
        });
        return server_1.NextResponse.json({ success: true });
    }
    catch (err) {
        console.error("Approve error:", err);
        return server_1.NextResponse.json({ error: "Approve failed" }, { status: 500 });
    }
}
