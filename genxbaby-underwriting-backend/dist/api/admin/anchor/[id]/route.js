"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const prisma_1 = require("@/db/prisma");
const rbac_1 = require("@/middleware/rbac");
const log_1 = require("@/services/audit/log");
const notify_service_1 = require("@/services/notifications/notify.service");
const anchor_service_1 = require("@/services/anchor/anchor.service");
const merkle_service_1 = require("@/services/merkle/merkle.service");
async function POST(req, { params }) {
    try {
        const userId = req.headers.get("x-user-id");
        await (0, rbac_1.requirePermission)(userId, "ANCHOR_UNDERWRITING");
        const applicationId = params.id;
        const app = await prisma_1.prisma.application.findUnique({
            where: { id: applicationId },
            include: { underwriting: true }
        });
        if (!app || !app.underwriting) {
            return server_1.NextResponse.json({ error: "Underwriting not found" }, { status: 404 });
        }
        const merkleRoot = (0, merkle_service_1.generateMerkleRoot)(app.underwriting);
        const anchor = await (0, anchor_service_1.anchorMerkleRoot)(merkleRoot);
        await prisma_1.prisma.application.update({
            where: { id: applicationId },
            data: {
                merkleRoot,
                polygonTxHash: anchor.txHash,
                anchoredAt: anchor.anchoredAt
            }
        });
        await (0, notify_service_1.pushNotification)("ANCHOR", `Application ${applicationId} anchored`);
        await (0, log_1.logAudit)({
            actor: userId,
            action: "ANCHOR_UNDERWRITING",
            target: applicationId,
            metadata: { merkleRoot, txHash: anchor.txHash }
        });
        return server_1.NextResponse.json({ success: true, anchor });
    }
    catch (err) {
        console.error("Anchor error:", err);
        return server_1.NextResponse.json({ error: "Anchor failed" }, { status: 500 });
    }
}
