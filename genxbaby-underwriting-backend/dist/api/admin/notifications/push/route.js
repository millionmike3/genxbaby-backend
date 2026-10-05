"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const notify_service_1 = require("@/services/notifications/notify.service");
const rbac_1 = require("@/middleware/rbac");
const log_1 = require("@/services/audit/log");
/**
 * POST /api/admin/notifications/push
 *
 * Body:
 * {
 *   "type": "APPROVE",
 *   "message": "Application A1001 approved"
 * }
 */
async function POST(req) {
    try {
        const userId = req.headers.get("x-user-id");
        // Only admins or auditors can push notifications
        await (0, rbac_1.requirePermission)(userId, "VIEW_AUDIT_LOGS");
        const body = await req.json();
        const { type, message } = body;
        if (!type || !message) {
            return server_1.NextResponse.json({ error: "Missing required fields: type, message" }, { status: 400 });
        }
        // Push notification
        await (0, notify_service_1.pushNotification)(type, message);
        // Audit log
        await (0, log_1.logAudit)({
            actor: userId,
            action: "PUSH_NOTIFICATION",
            target: type,
            metadata: { message }
        });
        return server_1.NextResponse.json({
            success: true,
            message: "Notification pushed successfully"
        });
    }
    catch (err) {
        console.error("Push notification error:", err);
        return server_1.NextResponse.json({ error: "Failed to push notification" }, { status: 500 });
    }
}
