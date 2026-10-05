// genxbaby-backend/src/routes/banking.routes.js

const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {
  syncBankingData,
  getBankAccounts,
  getBankTransactions,
  computeBankRiskScore,
  computeCashFlowMetrics,
} = require("../services/bankingService");

/**
 * POST /banking/:ownerId/sync
 * Syncs banking data (accounts + transactions) from Plaid or other provider
 */
router.post("/:ownerId/sync", async (req, res) => {
  try {
    const { ownerId } = req.params;

    // Ensure owner exists
    const owner = await prisma.owner.findUnique({
      where: { id: ownerId },
    });

    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    const syncResult = await syncBankingData(ownerId);

    res.json({
      ownerId,
      synced: true,
      accounts: syncResult.accounts,
      transactions: syncResult.transactions,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("Banking Sync Error:", err);
    res.status(500).json({ error: "Failed to sync banking data" });
  }
});

/**
 * GET /banking/:ownerId/accounts
 * Returns bank accounts for an owner
 */
router.get("/:ownerId/accounts", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({
      where: { id: ownerId },
    });

    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    const accounts = await getBankAccounts(ownerId);

    res.json({
      ownerId,
      accounts,
    });
  } catch (err) {
    console.error("Bank Accounts Error:", err);
    res.status(500).json({ error: "Failed to load bank accounts" });
  }
});

/**
 * GET /banking/:ownerId/transactions
 * Returns bank transactions for an owner
 */
router.get("/:ownerId/transactions", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({
      where: { id: ownerId },
    });

    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    const transactions = await getBankTransactions(ownerId);

    res.json({
      ownerId,
      transactions,
    });
  } catch (err) {
    console.error("Bank Transactions Error:", err);
    res.status(500).json({ error: "Failed to load bank transactions" });
  }
});

/**
 * GET /banking/:ownerId/risk
 * Returns bank risk score (overdrafts, NSFs, volatility, cash flow stability)
 */
router.get("/:ownerId/risk", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({
      where: { id: ownerId },
    });

    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    const riskScore = await computeBankRiskScore(ownerId);

    res.json({
      ownerId,
      bankRiskScore: riskScore,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("Bank Risk Error:", err);
    res.status(500).json({ error: "Failed to compute bank risk score" });
  }
});

/**
 * GET /banking/:ownerId/cashflow
 * Returns cash flow metrics (monthly inflow/outflow, stability, burn rate)
 */
router.get("/:ownerId/cashflow", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({
      where: { id: ownerId },
    });

    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    const metrics = await computeCashFlowMetrics(ownerId);

    res.json({
      ownerId,
      cashflow: metrics,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("Cashflow Error:", err);
    res.status(500).json({ error: "Failed to compute cashflow metrics" });
  }
});

module.exports = router;
