// genxbaby-backend/src/routes/pricing.routes.js

const express = require("express");
const router = express.Router();
const { requirePermission } = require("../middleware/rbac");
const { priceLoan } = require("../services/pricingService");

router.post(
  "/price",
  requirePermission("pricing.calculate"),
  async (req, res) => {
    try {
      const ownerId = req.user.ownerId;
      const { baseRateBps } = req.body;

      if (!baseRateBps) {
        return res.status(400).json({ error: "baseRateBps is required" });
      }

      const result = await priceLoan(ownerId, baseRateBps);
      res.json(result);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
