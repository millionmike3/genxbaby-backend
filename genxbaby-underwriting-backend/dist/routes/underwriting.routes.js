"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const queries_1 = require("../db/queries");
const queues_1 = require("../queue/queues");
const router = (0, express_1.Router)();
router.post("/", async (req, res) => {
    const data = req.body;
    const ucase = await (0, queries_1.createUnderwritingCase)(data);
    await queues_1.underwritingQueue.add("underwrite", { caseId: ucase.id });
    res.json({ success: true, case: ucase });
});
router.get("/", async (req, res) => {
    const cases = await (0, queries_1.listUnderwritingCases)();
    res.json({ cases });
});
router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const ucase = await (0, queries_1.getUnderwritingCase)(id);
    res.json({ case: ucase });
});
exports.default = router;
