"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMortgageUnderwriting = runMortgageUnderwriting;
exports.createUnderwritingCase = createUnderwritingCase;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Mortgage Underwriting Engine (Option A)
 *
 * This engine:
 *  - computes LTV
 *  - computes collateral score
 *  - computes fraud score
 *  - computes financial score
 *  - computes behavior score
 *  - computes risk score
 *  - determines decision + pricing
 *
 * Merkle root is NOT generated here — anchoring worker handles that.
 */
async function runMortgageUnderwriting({ borrower, mortgage, property }) {
    // -----------------------------
    // Collateral / LTV
    // -----------------------------
    const loanAmount = mortgage.loanAmount || 0;
    const estimatedValue = property.estimatedValue || 0;
    const ltv = estimatedValue > 0 ? loanAmount / estimatedValue : 1;
    const collateralScore = Math.max(0, 100 - ltv * 100); // 0–100
    // -----------------------------
    // Fraud Score (placeholder)
    // -----------------------------
    const fraudScore = borrower.ssn ? 0 : 50;
    // -----------------------------
    // Financial Score
    // -----------------------------
    const creditScore = borrower.creditScore || 600;
    const financialScore = Math.min(100, (creditScore / 850) * 100);
    // -----------------------------
    // Behavior Score (placeholder)
    // -----------------------------
    const behaviorScore = 70;
    // -----------------------------
    // Risk Score (lower is better)
    // -----------------------------
    const riskScore = (100 - collateralScore) +
        (700 - creditScore) / 10 +
        fraudScore +
        (100 - behaviorScore);
    // -----------------------------
    // Decision
    // -----------------------------
    const decision = riskScore < 200 ? "APPROVE" : "DECLINE";
    // -----------------------------
    // Pricing Model
    // -----------------------------
    const pricing = {
        rate: decision === "APPROVE" ? 6.25 : null,
        points: decision === "APPROVE" ? 1.0 : null
    };
    return {
        ltv,
        collateralScore,
        fraudScore,
        financialScore,
        behaviorScore,
        riskScore,
        decision,
        pricing
    };
}
/**
 * Create underwriting case (Option A)
 */
async function createUnderwritingCase(data) {
    return prisma.underwritingCase.create({ data });
}
