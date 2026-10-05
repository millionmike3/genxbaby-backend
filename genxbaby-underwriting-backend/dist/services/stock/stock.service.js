"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeStock = void 0;
const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));
const scoreVolatility = (vixLevel) => {
    if (vixLevel == null)
        return { risk: 50, flag: "VIX_UNKNOWN" };
    if (vixLevel <= 15)
        return { risk: 20, flag: "" };
    if (vixLevel <= 25)
        return { risk: 40, flag: "ELEVATED_VOLATILITY" };
    return { risk: 70, flag: "HIGH_VOLATILITY" };
};
const scoreSpread = (mortgageSpreadBps) => {
    if (mortgageSpreadBps == null)
        return { risk: 50, flag: "SPREAD_UNKNOWN" };
    if (mortgageSpreadBps <= 150)
        return { risk: 25, flag: "" };
    if (mortgageSpreadBps <= 250)
        return { risk: 45, flag: "ELEVATED_SPREADS" };
    return { risk: 65, flag: "STRESSED_SPREADS" };
};
const scoreLiquidity = (liquidityIndex) => {
    if (liquidityIndex == null)
        return { risk: 50, flag: "LIQUIDITY_UNKNOWN" };
    if (liquidityIndex >= 80)
        return { risk: 20, flag: "" };
    if (liquidityIndex >= 60)
        return { risk: 40, flag: "MODERATE_LIQUIDITY" };
    return { risk: 70, flag: "LOW_LIQUIDITY" };
};
const scoreSentiment = (riskOnSentiment) => {
    if (riskOnSentiment == null)
        return { appetite: 50, flag: "SENTIMENT_UNKNOWN" };
    if (riskOnSentiment >= 70)
        return { appetite: 80, flag: "RISK_ON_ENVIRONMENT" };
    if (riskOnSentiment >= 40)
        return { appetite: 55, flag: "NEUTRAL_SENTIMENT" };
    return { appetite: 30, flag: "RISK_OFF_ENVIRONMENT" };
};
const classifyMarketCondition = (macroRiskScore) => {
    if (macroRiskScore <= 35)
        return "RISK_ON";
    if (macroRiskScore <= 60)
        return "NEUTRAL";
    return "RISK_OFF";
};
const sanitizeStock = async (input) => {
    const vol = scoreVolatility(input.vixLevel);
    const spread = scoreSpread(input.mortgageSpreadBps);
    const liq = scoreLiquidity(input.liquidityIndex);
    const sent = scoreSentiment(input.riskOnSentiment);
    const macroRiskScore = clamp((vol.risk * 0.35) +
        (spread.risk * 0.30) +
        (liq.risk * 0.35));
    const investorAppetiteScore = clamp(sent.appetite);
    const flags = [
        vol.flag,
        spread.flag,
        liq.flag,
        sent.flag
    ].filter(Boolean);
    const marketCondition = classifyMarketCondition(macroRiskScore);
    const notes = [];
    if (marketCondition === "RISK_OFF") {
        notes.push("Macro environment is risk-off; consider tighter underwriting and pricing.");
    }
    else if (marketCondition === "NEUTRAL") {
        notes.push("Macro environment is neutral; standard underwriting conditions apply.");
    }
    else {
        notes.push("Macro environment is risk-on; investor appetite may support more volume.");
    }
    if (flags.includes("HIGH_VOLATILITY")) {
        notes.push("High volatility; monitor market closely for dislocations.");
    }
    if (flags.includes("STRESSED_SPREADS")) {
        notes.push("Stressed spreads; funding costs may be elevated.");
    }
    if (flags.includes("LOW_LIQUIDITY")) {
        notes.push("Low liquidity; secondary market execution may be challenging.");
    }
    return {
        macroRiskScore,
        investorAppetiteScore,
        marketCondition,
        flags,
        notes
    };
};
exports.sanitizeStock = sanitizeStock;
