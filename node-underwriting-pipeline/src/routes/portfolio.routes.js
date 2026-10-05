// genxbaby-backend/src/routes/portfolio.routes.js

const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * GET /portfolio
 * Returns all owners + aggregated portfolio metrics
 */
router.get("/", async (req, res) => {
  try {
    // Fetch all owners
    const owners = await prisma.owner.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (owners.length === 0) {
      return res.json({
        owners: [],
        metrics: {
          avgRiskScore: null,
          avgIncomeScore: null,
          avgBehaviorScore: null,
          avgVolatilityIndex: null,
          avgSarSeverity: null,
          avgIncomeVerificationScore: null,
        },
      });
    }

    // Aggregate metrics
    const ownerIds = owners.map((o) => o.id);

    // Latest snapshots for each metric
    const riskSnapshots = await prisma.riskSnapshot.groupBy({
      by: ["ownerId"],
      _max: { riskScore: true },
    });

    const incomeSnapshots = await prisma.incomeSnapshot.groupBy({
      by: ["ownerId"],
      _max: { monthlyIncome: true },
    });

    const behaviorSnapshots = await prisma.behaviorSnapshot.groupBy({
      by: ["ownerId"],
      _max: { behaviorScore: true },
    });

    const volatilitySnapshots = await prisma.volatilitySnapshot.groupBy({
      by: ["ownerId"],
      _max: { volatilityIndex: true },
    });

    const sarSnapshots = await prisma.sarSnapshot.groupBy({
      by: ["ownerId"],
      _max: { sarSeverity: true },
    });

    const incomeVerificationSnapshots =
      await prisma.incomeVerificationSnapshot.groupBy({
        by: ["ownerId"],
        _max: { incomeVerificationScore: true },
      });

    // Compute averages
    const avgRiskScore =
      riskSnapshots.reduce((sum, s) => sum + (s._max.riskScore || 0), 0) /
      riskSnapshots.length;

    const avgIncomeScore =
      incomeSnapshots.reduce(
        (sum, s) => sum + (s._max.monthlyIncome || 0),
        0
      ) / incomeSnapshots.length;

    const avgBehaviorScore =
      behaviorSnapshots.reduce(
        (sum, s) => sum + (s._max.behaviorScore || 0),
        0
      ) / behaviorSnapshots.length;

    const avgVolatilityIndex =
      volatilitySnapshots.reduce(
        (sum, s) => sum + (s._max.volatilityIndex || 0),
        0
      ) / volatilitySnapshots.length;

    const avgSarSeverity =
      sarSnapshots.reduce(
        (sum, s) => sum + (s._max.sarSeverity || 0),
        0
      ) / sarSnapshots.length;

    const avgIncomeVerificationScore =
      incomeVerificationSnapshots.reduce(
        (sum, s) => sum + (s._max.incomeVerificationScore || 0),
        0
      ) / incomeVerificationSnapshots.length;

    res.json({
      owners,
      metrics: {
        avgRiskScore,
        avgIncomeScore,
        avgBehaviorScore,
        avgVolatilityIndex,
        avgSarSeverity,
        avgIncomeVerificationScore,
      },
    });
  } catch (err) {
    console.error("Portfolio Error:", err);
    res.status(500).json({ error: "Failed to load portfolio" });
  }
});

/**
 * GET /portfolio/metrics
 * Returns portfolio-level aggregated metrics only
 */
router.get("/metrics", async (req, res) => {
  try {
    const riskSnapshots = await prisma.riskSnapshot.groupBy({
      by: ["ownerId"],
      _max: { riskScore: true },
    });

    const incomeSnapshots = await prisma.incomeSnapshot.groupBy({
      by: ["ownerId"],
      _max: { monthlyIncome: true },
    });

    const behaviorSnapshots = await prisma.behaviorSnapshot.groupBy({
      by: ["ownerId"],
      _max: { behaviorScore: true },
    });

    const volatilitySnapshots = await prisma.volatilitySnapshot.groupBy({
      by: ["ownerId"],
      _max: { volatilityIndex: true },
    });

    const sarSnapshots = await prisma.sarSnapshot.groupBy({
      by: ["ownerId"],
      _max: { sarSeverity: true },
    });

    const incomeVerificationSnapshots =
      await prisma.incomeVerificationSnapshot.groupBy({
        by: ["ownerId"],
        _max: { incomeVerificationScore: true },
      });

    const avgRiskScore =
      riskSnapshots.reduce((sum, s) => sum + (s._max.riskScore || 0), 0) /
      riskSnapshots.length;

    const avgIncomeScore =
      incomeSnapshots.reduce(
        (sum, s) => sum + (s._max.monthlyIncome || 0),
        0
      ) / incomeSnapshots.length;

    const avgBehaviorScore =
      behaviorSnapshots.reduce(
        (sum, s) => sum + (s._max.behaviorScore || 0),
        0
      ) / behaviorSnapshots.length;

    const avgVolatilityIndex =
      volatilitySnapshots.reduce(
        (sum, s) => sum + (s._max.volatilityIndex || 0),
        0
      ) / volatilitySnapshots.length;

    const avgSarSeverity =
      sarSnapshots.reduce(
        (sum, s) => sum + (s._max.sarSeverity || 0),
        0
      ) / sarSnapshots.length;

    const avgIncomeVerificationScore =
      incomeVerificationSnapshots.reduce(
        (sum, s) => sum + (s._max.incomeVerificationScore || 0),
        0
      ) / incomeVerificationSnapshots.length;

    res.json({
      avgRiskScore,
      avgIncomeScore,
      avgBehaviorScore,
      avgVolatilityIndex,
      avgSarSeverity,
      avgIncomeVerificationScore,
    });
  } catch (err) {
    console.error("Portfolio Metrics Error:", err);
    res.status(500).json({ error: "Failed to load portfolio metrics" });
  }
});

module.exports = router;
