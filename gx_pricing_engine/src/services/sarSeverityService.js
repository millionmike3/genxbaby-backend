// gx_pricing_engine/src/services/sarSeverityService.js

/**
 * Compute SAR severity (1–5) from raw signals.
 * Higher = more serious suspicious activity.
 */
function computeSarSeverity({
  largeTransactions = 0,     // count
  unusualActivityFlags = 0,  // count
  structuringFlags = 0,      // count
  highRiskCounterparties = 0,// count
  anomalyScore = 0,          // 0–100
}) {
  const base =
    largeTransactions * 1.2 +
    unusualActivityFlags * 1.0 +
    structuringFlags * 1.5 +
    highRiskCounterparties * 1.3 +
    (anomalyScore / 25); // 0–4

  let severity = Math.ceil(base);

  if (severity < 1) severity = 1;
  if (severity > 5) severity = 5;

  return severity; // 1–5
}

module.exports = { computeSarSeverity };
