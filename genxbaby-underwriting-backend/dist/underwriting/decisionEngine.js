"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runUnderwriting = runUnderwriting;
const incomeVerification_1 = require("./incomeVerification");
const ltvCalculator_1 = require("./ltvCalculator");
const dtiCalculator_1 = require("./dtiCalculator");
const fraudSignals_1 = require("./fraudSignals");
const riskTier_1 = require("./riskTier");
const pricingModel_1 = require("./pricingModel");
function runUnderwriting(application, borrower) {
    const income = (0, incomeVerification_1.verifyIncome)(application.incomeAmount, application.incomeYears);
    const ltv = (0, ltvCalculator_1.calculateLTV)(application.amount, application.propertyValue);
    const dti = (0, dtiCalculator_1.calculateDTI)(application.monthlyDebt || 0, application.incomeAmount / 12);
    const fraud = (0, fraudSignals_1.detectFraud)(application, borrower);
    // Risk score calculation
    let score = income.combined * 400 +
        (1 - ltv) * 300 +
        (1 - dti) * 300 -
        fraud.riskPenalty;
    score = Math.max(0, Math.min(score, 1000)); // clamp
    const tier = (0, riskTier_1.mapRiskTier)(score);
    const rate = (0, pricingModel_1.pricingForTier)(tier);
    const decision = tier === "HIGH_RISK" ? "DECLINED" :
        tier === "D" ? "NEEDS_MORE_INFO" :
            "APPROVED";
    return {
        score,
        tier,
        rate,
        decision,
        fraudSignals: fraud.signals
    };
}
