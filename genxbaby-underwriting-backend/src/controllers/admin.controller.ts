import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * List all underwriting cases
 */
export async function listCases(req: Request, res: Response) {
  try {
    const cases = await prisma.underwritingCase.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        borrower: true,
        mortgage: true
      }
    });

    return res.json({ success: true, cases });
  } catch (err) {
    console.error("LIST CASES ERROR:", err);
    return res.status(500).json({ error: "Failed to list cases" });
  }
}

/**
 * Get a single underwriting case by ID
 */
export async function getCase(req: Request, res: Response) {
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
  } catch (err) {
    console.error("GET CASE ERROR:", err);
    return res.status(500).json({ error: "Failed to fetch case" });
  }
}

/**
 * Update borrower information
 */
export async function updateBorrower(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = req.body;

    const borrower = await prisma.borrower.update({
      where: { id: Number(id) },
      data
    });

    return res.json({ success: true, borrower });
  } catch (err) {
    console.error("UPDATE BORROWER ERROR:", err);
    return res.status(500).json({ error: "Failed to update borrower" });
  }
}

/**
 * Update underwriting decision (via Application → Underwriting)
 */
export async function updateDecision(req: Request, res: Response) {
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
  } catch (err) {
    console.error("UPDATE DECISION ERROR:", err);
    return res.status(500).json({ error: "Failed to update decision" });
  }
}

/**
 * Upload a document to an application
 */
export async function uploadDocument(req: Request, res: Response) {
  try {
    const applicationId = Array.isArray(req.query.applicationId)
   ? req.query.applicationId[0]
   : req.query.applicationId;

    const data = req.body;

    const doc = await prisma.document.create({
      data: {
        ...data,
        applicationId
      }
    });

    return res.json({ success: true, document: doc });
  } catch (err) {
    console.error("UPLOAD DOCUMENT ERROR:", err);
    return res.status(500).json({ error: "Failed to upload document" });
  }
}

/**
 * Delete a document
 */
export async function deleteDocument(req: Request, res: Response) {
  try {
    const { docId } = req.params;

    await prisma.document.delete({
      where: { id: docId }
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("DELETE DOCUMENT ERROR:", err);
    return res.status(500).json({ error: "Failed to delete document" });
  }
}
