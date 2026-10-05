// genxbaby-backend/src/services/riskSignalService.js

const fraudService = require("./fraudService");
const sarService = require("./sarService");
const bankingService = require("./bankingService");
const behaviorService = require("./behaviorService");
const volatilityService = require("./volatilityService");

/**
 * Collects all risk signals for a given owner.
 * Returns normalized values ready for riskScoreService.
 */
async function getRiskSignals(ownerId) {
  // 1. Fraud score (0–100)
  const fraudScore = await fraudService.getFraudScore(ownerId);

  // 2. SAR severity (0–5)
  const sarSeverity = await sarService.getSarSeverity(ownerId);

  // 3. Volatility index (0–100)
  const volatilityIndex = await volatilityService.getVolatilityIndex(ownerId);

  // 4. Behavior score (0–100, higher = better)
  const behaviorScore = await behaviorService.getBehaviorScore(ownerId);

  // 5. Bank risk score (0–100)
  const bankRiskScore = await bankingService.getBankRiskScore(ownerId);

  return {
    fraudScore,
    sarSeverity,
    volatilityIndex,
    behaviorScore,
    bankRiskScore,
  };
}

module.exports = { getRiskSignals };
