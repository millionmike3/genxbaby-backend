// genxbaby-backend/src/routes/owner.routes.js

const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * POST /owners
 * Creates a new owner profile
 */
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const owner = await prisma.owner.create({
      data: {
        name,
        email,
        phone: phone || null,
        address: address || null,
        createdAt: new Date(),
      },
    });

    res.json({
      message: "Owner created successfully",
      owner,
    });
  } catch (err) {
    console.error("Owner Creation Error:", err);
    res.status(500).json({ error: "Failed to create owner" });
  }
});

/**
 * GET /owners/:ownerId
 * Returns full owner profile + latest risk + latest subsystem snapshots
 */
router.get("/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({
      where: { id: ownerId },
    });

    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    // Pull latest snapshots from every subsystem
    const [
      risk,
      aml,
      fraud,
      cashflow,
      volatility,
      behavior,
      kyc,
      sanctions,
      pep,
      bank,
      income,
      statements,
      checks,
      deposits,
    ] = await Promise.all([
      prisma.riskSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
      prisma.amlSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
      prisma.fraudSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
      prisma.cashflowSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
      prisma.volatilitySnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
      prisma.behaviorSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
      prisma.kycSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
      prisma.sanctionsSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
      prisma.pepSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
      prisma.bankSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
      prisma.incomeSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
      prisma.statementSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
      prisma.checkSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
      prisma.depositSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
    ]);

    res.json({
      owner,
      latestSnapshots: {
        risk,
        aml,
        fraud,
        cashflow,
        volatility,
        behavior,
        kyc,
        sanctions,
        pep,
        bank,
        income,
        statements,
        checks,
        deposits,
      },
    });
  } catch (err) {
    console.error("Owner Fetch Error:", err);
    res.status(500).json({ error: "Failed to load owner profile" });
  }
});

/**
 * PUT /owners/:ownerId
 * Updates owner profile
 */
router.put("/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;
    const { name, email, phone, address } = req.body;

    const owner = await prisma.owner.findUnique({
      where: { id: ownerId },
    });

    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    const updated = await prisma.owner.update({
      where: { id: ownerId },
      data: {
        name: name ?? owner.name,
        email: email ?? owner.email,
        phone: phone ?? owner.phone,
        address: address ?? owner.address,
        updatedAt: new Date(),
      },
    });

    res.json({
      message: "Owner updated successfully",
      owner: updated,
    });
  } catch (err) {
    console.error("Owner Update Error:", err);
    res.status(500).json({ error: "Failed to update owner" });
  }
});

/**
 * GET /owners/:ownerId/full-history
 * Returns ALL snapshots from ALL subsystems for full underwriting review
 */
router.get("/:ownerId/full-history", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({
      where: { id: ownerId },
    });

    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    const history = {
      risk: await prisma.riskSnapshot.findMany({ where: { ownerId }, orderBy: { timestamp: "asc" } }),
      aml: await prisma.amlSnapshot.findMany({ where: { ownerId }, orderBy: { timestamp: "asc" } }),
      fraud: await prisma.fraudSnapshot.findMany({ where: { ownerId }, orderBy: { timestamp: "asc" } }),
      cashflow: await prisma.cashflowSnapshot.findMany({ where: { ownerId }, orderBy: { timestamp: "asc" } }),
      volatility: await prisma.volatilitySnapshot.findMany({ where: { ownerId }, orderBy: { timestamp: "asc" } }),
      behavior: await prisma.behaviorSnapshot.findMany({ where: { ownerId }, orderBy: { timestamp: "asc" } }),
      kyc: await prisma.kycSnapshot.findMany({ where: { ownerId }, orderBy: { timestamp: "asc" } }),
      sanctions: await prisma.sanctionsSnapshot.findMany({ where: { ownerId }, orderBy: { timestamp: "asc" } }),
      pep: await prisma.pepSnapshot.findMany({ where: { ownerId }, orderBy: { timestamp: "asc" } }),
      bank: await prisma.bankSnapshot.findMany({ where: { ownerId }, orderBy: { timestamp: "asc" } }),
      income: await prisma.incomeSnapshot.findMany({ where: { ownerId }, orderBy: { timestamp: "asc" } }),
      statements: await prisma.statementSnapshot.findMany({ where: { ownerId }, orderBy: { timestamp: "asc" } }),
      checks: await prisma.checkSnapshot.findMany({ where: { ownerId }, orderBy: { timestamp: "asc" } }),
      deposits: await prisma.depositSnapshot.findMany({ where: { ownerId }, orderBy: { timestamp: "asc" } }),
    };

    res.json({
      owner,
      history,
    });
  } catch (err) {
    console.error("Owner Full History Error:", err);
    res.status(500).json({ error: "Failed to load full owner history" });
  }
});

module.exports = router;
