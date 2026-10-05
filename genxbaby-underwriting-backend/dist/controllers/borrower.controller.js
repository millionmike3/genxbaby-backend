"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBorrower = createBorrower;
const borrower_service_1 = require("../services/borrower.service");
async function createBorrower(req, res) {
    try {
        const borrower = await borrower_service_1.borrowerService.create(req.body);
        res.status(201).json(borrower);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}
