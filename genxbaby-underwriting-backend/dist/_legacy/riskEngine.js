"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeRisk = computeRisk;
function computeRisk(app) {
    const signals = [];
    // Simple example rules
    if (app.ltv > 80)
        signals.push("High LTV");
    if (app.dti > 45)
        signals.push("High DTI");
    if (!app.incomeVerified)
        signals.push("Unverified Income");
    let score = 700;
    if (app.ltv > 80)
        score -= 50;
    if (app.dti > 45)
        score -= 50;
    if (!app.incomeVerified)
        score -= 75;
    let tier = "A";
    if (score < 650)
        tier = "B";
    if (score < 600)
        tier = "C";
    const baseRate = 6.0;
    const margin = tier === "A" ? 0.5 :
        tier === "B" ? 1.0 :
            1.5;
    const finalRate = baseRate + margin;
    return {
        tier,
        score,
        fraudSignals: signals,
        pricing: {
            baseRate,
            margin,
            finalRate,
        },
    };
}
