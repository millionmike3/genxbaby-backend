"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapRiskTier = mapRiskTier;
function mapRiskTier(score) {
    if (score >= 900)
        return "A+";
    if (score >= 800)
        return "A";
    if (score >= 700)
        return "B";
    if (score >= 600)
        return "C";
    if (score >= 500)
        return "D";
    return "HIGH_RISK";
}
