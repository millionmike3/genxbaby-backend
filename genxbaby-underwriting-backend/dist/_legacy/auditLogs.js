"use strict";
// src/routes/auditLogs.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const router = (0, express_1.Router)();
/**
 * GET /audit/logs/:applicationId
 * Returns full audit history for an underwriting application
 */
router.get("/logs/:applicationId", async (req, res) => {
    const { applicationId } = req.params;
    try {
        // Check if application exists
        const app = await db_1.prisma.application.findUnique({
            where: { id: applicationId },
        });
        if (!app) {
            return res.status(404).json({ message: "Application not found" });
        }
        // Fetch audit logs
        const logs = await db_1.prisma.auditLog.findMany({
            where: { applicationId },
            orderBy: { createdAt: "desc" },
        });
        // Format logs for frontend
        const formatted = logs.map((log) => ({
            id: log.id,
            createdAt: log.createdAt,
            decision: {
                status: log.decisionStatus,
                tier: log.decisionTier,
                rate: log.decisionRate,
                notes: log.decisionNotes,
            },
            risk: {
                tier: log.riskTier,
                score: log.riskScore,
                fraudSignals: JSON.parse(log.fraudSignals || "[]"),
            },
            merkle: {
                leaf: log.merkleLeaf,
                root: log.merkleRoot,
                tree: JSON.parse(log.merkleTree || "[]"),
            },
            anchor: {
                txHash: log.anchorTxHash,
                block: log.anchorBlock,
                success: log.anchorSuccess,
            },
        }));
        res.json({
            applicationId,
            count: formatted.length,
            logs: formatted,
        });
    }
    catch (err) {
        console.error("Audit log route error:", err);
        res.status(500).json({ message: "Failed to load audit logs" });
    }
});
exports.default = router;
