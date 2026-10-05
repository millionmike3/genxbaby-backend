"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCase = createCase;
exports.getCase = getCase;
exports.listCases = listCases;
const queries_1 = require("../db/queries");
const queues_1 = require("../queue/queues");
async function createCase(req, res) {
    const data = req.body;
    const ucase = await (0, queries_1.createUnderwritingCase)(data);
    await queues_1.underwritingQueue.add("underwrite", { caseId: ucase.id });
    res.json({ success: true, case: ucase });
}
async function getCase(req, res) {
    const id = Number(req.params.id);
    const ucase = await (0, queries_1.getUnderwritingCase)(id);
    res.json({ case: ucase });
}
async function listCases(req, res) {
    const cases = await (0, queries_1.listUnderwritingCases)();
    res.json({ cases });
}
