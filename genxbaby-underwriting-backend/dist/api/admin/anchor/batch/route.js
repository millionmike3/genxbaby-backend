"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const rbac_1 = require("@/middleware/rbac");
const log_1 = require("@/services/audit/log");
const notify_service_1 = require("@/services/notifications/notify.service");
const batchAnchor_service_1 = require("@/services/anchor/batchAnchor.service");
async function POST(req) {
    try {
        const userId = req.headers.get("x-user-id");
        await (0, rbac_1.requirePermission)(userId, "BATCH_ANCHOR");
        const body = await req.json();
        const applicationIds = body.applicationIds;
        if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
            return server_1.NextResponse.json({ error: "applicationIds must be a non-empty array" }, { status: 400 });
        }
        const result = await (0, batchAnchor_service_1.batchAnchorApplications)(applicationIds);
        await (0, notify_service_1.pushNotification)("BATCH_ANCHOR", `Batch ${result.batch.id} anchored (${applicationIds.length} apps)`);
        await (0, log_1.logAudit)({
            actor: userId,
            action: "BATCH_ANCHOR",
            target: result.batch.id,
            metadata: {
                applicationIds,
                batchMerkleRoot: result.batch.merkleRoot,
                txHash: result.batch.txHash
            }
        });
        return server_1.NextResponse.json({
            success: true,
            batch: result.batch,
            anchorRecords: result.anchorRecords
        });
    }
    catch (err) {
        console.error("Batch anchor error:", err);
        return server_1.NextResponse.json({ error: "Batch anchor failed" }, { status: 500 });
    }
}
