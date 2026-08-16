// genxbaby-backend/src/services/checksService.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Extract MICR line (routing, account, check number) from OCR text
 */
function extractMICR(text) {
  const lines = text.split("\n");
  let micrLine = null;

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (
      lower.includes("routing") ||
      lower.includes("account") ||
      lower.match(/\d{9}/) || // routing-like
      lower.match(/\d{4,}/)   // account/check-like
    ) {
      micrLine = line.trim();
      break;
    }
  }

  if (!micrLine) {
    return {
      raw: null,
      routingNumber: null,
      accountNumber: null,
      checkNumber: null,
    };
  }

  const numbers = micrLine.match(/\d+/g) || [];

  return {
    raw: micrLine,
    routingNumber: numbers[0] || null,
    accountNumber: numbers[1] || null,
    checkNumber: numbers[2] || null,
  };
}

/**
 * Extract check fields (amount, issuer, payee, date) from OCR text
 */
function extractCheckFields(text) {
  const lines = text.split("\n");

  let amount = null;
  let issuer = null;
  let payee = null;
  let date = null;

  for (const line of lines) {
    const lower = line.toLowerCase();

    // Amount
    if (lower.includes("amount") || lower.includes("pay") || lower.includes("$")) {
      const match = line.match(/[\d,.]+/);
      if (match) amount = parseFloat(match[0].replace(/,/g, ""));
    }

    // Date
    if (lower.includes("date")) {
      const match = line.match(
        /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b|\b\d{4}-\d{1,2}-\d{1,2}\b/
      );
      if (match) date = match[0];
    }

    // Issuer (from top-left area, often includes name/address)
    if (!issuer && (lower.includes("company") || lower.includes("inc") || lower.includes("llc"))) {
      issuer = line.trim();
    }

    // Payee (line starting with "Pay to the order of")
    if (!payee && lower.includes("pay to the order of")) {
      payee = line.replace(/pay to the order of/i, "").trim();
    }
  }

  return {
    amount,
    issuer,
    payee,
    date,
  };
}

/**
 * Detect check fraud patterns
 */
function detectCheckFraudPatterns({ micr, fields }) {
  const patterns = [];

  if (!micr.raw) patterns.push("MISSING_MICR_LINE");
  if (!micr.routingNumber) patterns.push("MISSING_ROUTING_NUMBER");
  if (!micr.accountNumber) patterns.push("MISSING_ACCOUNT_NUMBER");
  if (!micr.checkNumber) patterns.push("MISSING_CHECK_NUMBER");

  if (!fields.amount || fields.amount <= 0) patterns.push("INVALID_AMOUNT");
  if (!fields.issuer) patterns.push("MISSING_ISSUER");
  if (!fields.payee) patterns.push("MISSING_PAYEE");
  if (!fields.date) patterns.push("MISSING_DATE");

  // Large amount
  if (fields.amount && fields.amount > 50000) {
    patterns.push("LARGE_CHECK_AMOUNT");
  }

  // Potential duplicate check number
  if (micr.checkNumber) {
    patterns.push("CHECK_NUMBER_NOT_VERIFIED"); // actual duplicate check detection can be added later
  }

  return patterns;
}

/**
 * Compute check risk score (0–100)
 */
function computeCheckRiskScore({ micr, fields, fraudPatterns }) {
  let score = 0;

  // Base on amount
  if (fields.amount) {
    score += fields.amount / 1000; // 100k = +100
  }

  // Missing critical fields
  if (!micr.routingNumber || !micr.accountNumber || !micr.checkNumber) {
    score += 20;
  }

  if (!fields.issuer || !fields.payee || !fields.date) {
    score += 15;
  }

  // Fraud patterns
  score += fraudPatterns.length * 10;

  return Math.min(score, 100);
}

/**
 * Compute severity from risk score
 */
function computeCheckSeverity(score) {
  if (score < 25) return "LOW";
  if (score < 50) return "MEDIUM";
  if (score < 75) return "HIGH";
  return "CRITICAL";
}

/**
 * Compute trend for check risk
 */
async function computeCheckTrend(ownerId) {
  const history = await prisma.checkSnapshot.findMany({
    where: { ownerId },
    orderBy: { timestamp: "asc" },
  });

  if (history.length < 2) return "stable";

  const last = history[history.length - 1].riskScore;
  const prev = history[history.length - 2].riskScore;

  if (last < prev) return "improving";
  if (last > prev) return "worsening";
  return "stable";
}

/**
 * Build snapshot object (if needed separately)
 */
function buildCheckSnapshot({ micr, fields, fraudPatterns, riskScore, severity }) {
  return {
    micr,
    fields,
    fraudPatterns,
    riskScore,
    severity,
    timestamp: new Date(),
  };
}

module.exports = {
  extractMICR,
  extractCheckFields,
  detectCheckFraudPatterns,
  computeCheckRiskScore,
  computeCheckSeverity,
  computeCheckTrend,
  buildCheckSnapshot,
};
