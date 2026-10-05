"use strict";
// src/routes/adminSearch.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const router = (0, express_1.Router)();
/**
 * GET /admin/search?query=<string>
 * Searches applications by borrower name, SSN last4, or application ID
 */
router.get("/search", async (req, res) => {
    const { query } = req.query;
    if (!query || typeof query !== "string") {
        return res.status(400).json({ message: "Missing search query" });
    }
    try {
        const results = await db_1.prisma.application.findMany({
            where: {
                OR: [
                    // Borrower name
                    {
                        borrower: {
                            fullName: {
                                contains: query,
                                mode: "insensitive",
                            },
                        },
                    },
                    // SSN last4
                    {
                        borrower: {
                            ssnLast4: {
                                contains: query,
                                mode: "insensitive",
                            },
                        },
                    },
                    // Application ID
                    {
                        id: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                    // Employer search
                    {
                        employer: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                    // Decision status search
                    {
                        decisionStatus: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                ],
            },
            include: {
                borrower: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.json({
            query,
            count: results.length,
            results,
        });
    }
    catch (err) {
        console.error("Admin search error:", err);
        res.status(500).json({ message: "Failed to perform search" });
    }
});
exports.default = router;
