"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCases = listCases;
exports.getCase = getCase;
exports.updateBorrower = updateBorrower;
exports.updateDecision = updateDecision;
exports.uploadDocument = uploadDocument;
exports.deleteDocument = deleteDocument;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * List all underwriting cases
 */
async function listCases(req, res) {
    try {
        const cases = await prisma.underwritingCase.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                borrower: true,
                mortgage: true
            }
        });
        return res.json({ success: true, cases });
    }
    catch (err) {
        console.error("LIST CASES ERROR:", err);
        return res.status(500).json({ error: "Failed to list cases" });
    }
}
/**
 * Get a single underwriting case by ID
 */
async function getCase(req, res) {
    try {
        const { id } = req.params;
        const uwCase = await prisma.underwritingCase.findUnique({
            where: { id: Number(id) },
            include: {
                borrower: true,
                mortgage: {
                    include: {
                        property: true
                    }
                }
            }
        });
        if (!uwCase) {
            return res.status(404).json({ error: "Case not found" });
        }
        return res.json({ success: true, case: uwCase });
    }
    catch (err) {
        console.error("GET CASE ERROR:", err);
        return res.status(500).json({ error: "Failed to fetch case" });
    }
}
/**
 * Update borrower information
 */
async function updateBorrower(req, res) {
    try {
        const { id } = req.params;
        const data = req.body;
        const borrower = await prisma.borrower.update({
            where: { id: Number(id) },
            data
        });
        return res.json({ success: true, borrower });
    }
    catch (err) {
        console.error("UPDATE BORROWER ERROR:", err);
        return res.status(500).json({ error: "Failed to update borrower" });
    }
}
/**
 * Update underwriting decision (via Application → Underwriting)
 */
async function updateDecision(req, res) {
    try {
        const { applicationId } = req.params;
        const { decision, pricingModel } = req.body;
        const updated = await prisma.underwriting.update({
            where: { applicationId },
            data: {
                decision,
                pricingModel,
                decidedAt: new Date()
            }
        });
        return res.json({ success: true, underwriting: updated });
    }
    catch (err) {
        console.error("UPDATE DECISION ERROR:", err);
        return res.status(500).json({ error: "Failed to update decision" });
    }
}
/**
 * Upload a document to an application
 */
async function uploadDocument(req, res) {
    try {
        const { applicationId } = req.params;
        const data = req.body;
        const doc = await prisma.document.create({
            data: {
                ...data,
                applicationId
            }
        });
        return res.json({ success: true, document: doc });
    }
    catch (err) {
        console.error("UPLOAD DOCUMENT ERROR:", err);
        return res.status(500).json({ error: "Failed to upload document" });
    }
}
/**
 * Delete a document
 */
async function deleteDocument(req, res) {
    try {
        const { docId } = req.params;
        await prisma.document.delete({
            where: { id: docId }
        });
        return res.json({ success: true });
    }
    catch (err) {
        console.error("DELETE DOCUMENT ERROR:", err);
        return res.status(500).json({ error: "Failed to delete document" });
    }
}
