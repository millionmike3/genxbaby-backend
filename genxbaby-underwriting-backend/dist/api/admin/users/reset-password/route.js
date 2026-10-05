"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const prisma_1 = require("@/db/prisma");
const rbac_1 = require("@/middleware/rbac");
const log_1 = require("@/services/audit/log");
const notify_service_1 = require("@/services/notifications/notify.service");
async function POST(req) {
    const userId = req.headers.get("x-user-id");
    await (0, rbac_1.requirePermission)(userId, "VIEW_AUDIT_LOGS");
    const { targetUserId, newPassword } = await req.json();
    await prisma_1.prisma.user.update({
        where: { id: targetUserId },
        data: { password: newPassword }
    });
    await (0, notify_service_1.pushNotification)("USER_UPDATE", `Password reset for ${targetUserId}`);
    await (0, log_1.logAudit)({
        actor: userId,
        action: "RESET_PASSWORD",
        target: targetUserId,
        metadata: {}
    });
    return server_1.NextResponse.json({ success: true });
}
