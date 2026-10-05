"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMortgage = createMortgage;
const mortgage_service_1 = require("../services/mortgage.service");
async function createMortgage(req, res) {
    try {
        const mortgage = await mortgage_service_1.mortgageService.create(req.body);
        res.status(201).json(mortgage);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}
