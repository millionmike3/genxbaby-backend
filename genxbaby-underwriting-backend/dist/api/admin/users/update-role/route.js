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
    const { targetUserId, roleId } = await req.json();
    await prisma_1.prisma.userRole.deleteMany({
        where: { userId: targetUserId }
    });
    await prisma_1.prisma.userRole.create({
        data: {
            userId: targetUserId,
            roleId
        }
    });
    await (0, notify_service_1.pushNotification)("USER_UPDATE", `User ${targetUserId} role updated`);
    await (0, log_1.logAudit)({
        actor: userId,
        action: "UPDATE_USER_ROLE",
        target: targetUserId,
        metadata: { roleId }
    });
    return server_1.NextResponse.json({ success: true });
}
