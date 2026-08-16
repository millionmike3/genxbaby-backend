const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { requirePermission } = require("../middleware/rbac");

router.post(
  "/",
  requirePermission("owner.create"),
  async (req, res) => {
    const { name, email } = req.body;

    const owner = await prisma.owner.create({
      data: { name, email },
    });

    // Create default roles/permissions for this owner if needed

    res.status(201).json(owner);
  }
);

module.exports = router;
