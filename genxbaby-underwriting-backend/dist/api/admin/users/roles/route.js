"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const prisma_1 = require("@/db/prisma");
const rbac_1 = require("@/middleware/rbac");
async function GET(req) {
    const userId = req.headers.get("x-user-id");
    await (0, rbac_1.requirePermission)(userId, "VIEW_AUDIT_LOGS");
    const roles = await prisma_1.prisma.role.findMany();
    return server_1.NextResponse.json({ roles });
}
