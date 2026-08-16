const express = require("express");
const router = express.Router();
const { requirePermission } = require("../middleware/rbac");
const { getConfig, updateConfig } = require("../services/configService");

router.get("/", requirePermission("config.read"), async (req, res) => {
  const ownerId = req.user.ownerId;
  const config = await getConfig(ownerId);
  res.json(config);
});

router.post("/", requirePermission("config.write"), async (req, res) => {
  const ownerId = req.user.ownerId;
  const config = await updateConfig(ownerId, req.body);
  res.json(config);
});

module.exports = router;
