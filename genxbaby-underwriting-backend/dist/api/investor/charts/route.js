"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const prisma_1 = require("@/db/prisma");
async function GET() {
    try {
        // Risk score distribution
        const riskScores = await prisma_1.prisma.anchorRecord.groupBy({
            by: ["riskScore"],
            _count: { riskScore: true }
        });
        // Anchored volume over time
        const batches = await prisma_1.prisma.anchorBatch.findMany({
            orderBy: { anchoredAt: "asc" },
            select: {
                anchoredAt: true,
                anchors: true
            }
        });
        const batchTimeline = batches.map((b) => ({
            date: b.anchoredAt.toISOString().split("T")[0],
            count: b.anchors.length
        }));
        // Investor exposure (total anchored principal)
        const exposure = await prisma_1.prisma.anchorRecord.findMany({
            include: {
                application: true
            }
        });
        const exposureTimeline = exposure.map((r) => ({
            date: r.anchoredAt.toISOString().split("T")[0],
            amount: r.application.amount
        }));
        return server_1.NextResponse.json({
            riskScores,
            batchTimeline,
            exposureTimeline
        });
    }
    catch (err) {
        console.error("Chart data error:", err);
        return server_1.NextResponse.json({ error: "Failed to load chart data" }, { status: 500 });
    }
}
