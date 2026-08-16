const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const ownerId = req.params.ownerId;

  if (req.user.ownerId !== ownerId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const banks = await prisma.bankProfile.findMany({
    where: { ownerId },
  });

  res.json(banks);
});

module.exports = router;
