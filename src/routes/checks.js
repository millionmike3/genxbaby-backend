const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { requirePermission } = require("../middleware/rbac");

router.post(
  "/issue",
  requirePermission("check.issue"),
  async (req, res) => {
    const { bankProfileId, signerId, payee, amount, memo } = req.body;

    // 1. Issue check
    const bank = await prisma.bankProfile.findUnique({
      where: { id: bankProfileId },
    });

    const checkNumber = bank.nextCheckNumber;

    const check = await prisma.check.create({
      data: {
        bankProfileId,
        signerId,
        checkNumber,
        payee,
        amount,
        memo,
        date: new Date(),
      },
    });

    // Increment next check number
    await prisma.bankProfile.update({
      where: { id: bankProfileId },
      data: { nextCheckNumber: checkNumber + 1 },
    });

    // 2. Fraud detection (simple example)
    let fraudFlags = [];
    if (amount > 10000) {
      const flag = await prisma.fraudFlag.create({
        data: {
          type: "HIGH_AMOUNT",
          severity: "HIGH",
          message: "Check amount exceeds $10,000",
          checkId: check.id,
        },
      });
      fraudFlags.push(flag);

      // 3. SAR report
      await prisma.suspiciousActivityReport.create({
        data: {
          flagId: flag.id,
          checkId: check.id,
          severity: "HIGH",
          type: "LARGE_TRANSACTION",
          summary: "SAR triggered due to high check amount",
        },
      });
    }

    // 4. Audit log
    await prisma.auditLog.create({
      data: {
        action: "CHECK_ISSUED",
        adminId: req.user.id,
        ip: req.ip,
        metadata: {
          checkId: check.id,
          fraudFlags,
        },
      },
    });

    res.json({
      check,
      fraudFlags,
    });
  }
);

module.exports = router;
