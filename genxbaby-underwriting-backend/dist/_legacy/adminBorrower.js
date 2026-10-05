"use strict";
// src/routes/adminBorrower.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const router = (0, express_1.Router)();
/**
 * GET /admin/borrower/:borrowerId
 * Returns borrower identity + all applications
 */
router.get("/borrower/:borrowerId", async (req, res) => {
    const { borrowerId } = req.params;
    try {
        // Fetch borrower
        const borrower = await db_1.prisma.borrower.findUnique({
            where: { id: borrowerId },
        });
        if (!borrower) {
            return res.status(404).json({ message: "Borrower not found" });
        }
        // Fetch all applications for this borrower
        const applications = await db_1.prisma.application.findMany({
            where: { borrowerId },
            orderBy: { createdAt: "desc" },
        });
        // Build response
        const response = {
            borrower: {
                id: borrower.id,
                fullName: borrower.fullName,
                ssnLast4: borrower.ssnLast4,
                dob: borrower.dob,
                address: borrower.address,
                kycVerified: borrower.kycVerified,
                createdAt: borrower.createdAt,
            },
            applications: applications.map((app) => ({
                id: app.id,
                amount: app.amount,
                propertyValue: app.propertyValue,
                purpose: app.purpose,
                decisionStatus: app.decisionStatus,
                decisionTier: app.decisionTier,
                decisionRate: app.decisionRate,
                createdAt: app.createdAt,
            })),
        };
        res.json(response);
    }
    catch (err) {
        console.error("Admin borrower route error:", err);
        res.status(500).json({ message: "Failed to load borrower profile" });
    }
});
exports.default = router;
