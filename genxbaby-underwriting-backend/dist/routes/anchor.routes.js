"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const batchAnchor_service_1 = require("../services/anchor/batchAnchor.service");
const router = (0, express_1.Router)();
router.post("/batch", async (req, res) => {
    const { caseIds } = req.body;
    const result = await (0, batchAnchor_service_1.batchAnchorCases)(caseIds);
    res.json({ success: true, result });
});
exports.default = router;
