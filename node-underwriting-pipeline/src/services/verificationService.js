// genxbaby-backend/src/services/verificationService.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Verify identity using SSN, name, employer, and cross-document consistency
 */
function verifyIdentity({ ssn, name, employer, incomeFields, creditTradelines }) {
  const issues = [];

  if (!ssn) issues.push("MISSING_SSN");
  if (!name) issues.push("MISSING_NAME");
  if (!employer) issues.push("MISSING_EMPLOYER");

  // Employer mismatch between paystub and credit report
  if (incomeFields?.employer && employer && incomeFields.employer !== employer) {
    issues.push("EMPLOYER_MISMATCH");
  }

  // SSN mismatch between credit and uploaded docs
  if (creditTradelines?.ssn && ssn && creditTradelines.ssn !== ssn) {
    issues.push("SSN_MISMATCH");
  }

  return issues;
}

/**
 * Verify income consistency
 */
function verifyIncome({ incomeFields }) {
  const issues = [];

  if (!incomeFields) {
    issues.push("NO_INCOME_DATA");
    return issues;
  }

  const { grossPay, netPay, ytdGross, ytdNet, payFrequency } = incomeFields;

  if (!grossPay || grossPay <= 0) issues.push("INVALID_GROSS_PAY");
  if (!netPay || netPay <= 0) issues.push("INVALID_NET_PAY");
  if (!ytdGross || ytdGross <= 0) issues.push("INVALID_YTD_GROSS");
  if (!payFrequency) issues.push("MISSING_PAY_FREQUENCY");

  // YTD consistency check
  if (ytdGross < grossPay) issues.push("YTD_LESS_THAN_GROSS");

  return issues;
}

/**
 * Verify bank account consistency
 */
function verifyBank({ bankFields, balances, transactions }) {
  const issues = [];

  if (!bankFields) {
    issues.push("NO_BANK_DATA");
    return issues;
  }

  const { accountNumber, routingNumber } = bankFields;

  if (!accountNumber) issues.push("MISSING_ACCOUNT_NUMBER");
  if (!routingNumber) issues.push("MISSING_ROUTING_NUMBER");

  // Negative ending balance
  if (balances?.endingBalance < 0) issues.push("NEGATIVE_ENDING_BALANCE");

  // Suspicious deposits
  const largeDeposits = transactions?.filter((t) => t.amount > 10000) || [];
  if (largeDeposits.length > 3) issues.push("MULTIPLE_LARGE_DEPOSITS");

  return issues;
}

/**
 * Verify check consistency
 */
function verifyChecks({ micr, fields }) {
  const issues = [];

  if (!micr?.raw) issues.push("MISSING_MICR_LINE");
  if (!micr?.routingNumber) issues.push("MISSING_CHECK_ROUTING");
  if (!micr?.accountNumber) issues.push("MISSING_CHECK_ACCOUNT");
  if (!micr?.checkNumber) issues.push("MISSING_CHECK_NUMBER");

  if (!fields?.amount || fields.amount <= 0) issues.push("INVALID_CHECK_AMOUNT");
  if (!fields?.issuer) issues.push("MISSING_CHECK_ISSUER");
  if (!fields?.payee) issues.push("MISSING_CHECK_PAYEE");

  return issues;
}

/**
 * Verify ACH consistency
 */
function verifyACH({ entries }) {
  const issues = [];

  if (!entries || entries.length === 0) {
    issues.push("NO_ACH_ENTRIES");
    return issues;
  }

  const returns = entries.filter((e) => e.type === "RETURN");
  const highRiskCodes = ["R01", "R02", "R03", "R04", "R05", "R07", "R10", "R16"];

  if (returns.length >= 3) issues.push("EXCESSIVE_ACH_RETURNS");

  const flagged = returns.filter((r) => highRiskCodes.includes(r.returnCode));
  if (flagged.length > 0) issues.push("HIGH_RISK_ACH_RETURN_CODES");

  return issues;
}

/**
 * Verify credit consistency
 */
function verifyCredit({ tradelines, ssn }) {
  const issues = [];

  if (!tradelines || tradelines.length === 0) {
    issues.push("NO_TRADLINES");
    return issues;
  }

  const collections = tradelines.filter((t) => t.type === "COLLECTION");
  if (collections.length > 0) issues.push("HAS_COLLECTIONS");

  const highBalances = tradelines.filter((t) => t.balance > 50000);
  if (highBalances.length > 0) issues.push("HIGH_BALANCE_TRADELINES");

  if (!ssn) issues.push("MISSING_CREDIT_SSN");

  return issues;
}

/**
 * Aggregate all verification issues into a single list
 */
function aggregateVerification({
  identityIssues,
  incomeIssues,
  bankIssues,
  checkIssues,
  achIssues,
  creditIssues,
}) {
  return [
    ...identityIssues,
    ...incomeIssues,
    ...bankIssues,
    ...checkIssues,
    ...achIssues,
    ...creditIssues,
  ];
}

/**
 * Compute verification score (0–100)
 */
function computeVerificationScore(issues) {
  let score = issues.length * 10;
  return Math.min(score, 100);
}

/**
 * Compute severity
 */
function computeVerificationSeverity(score) {
  if (score < 25) return "LOW";
  if (score < 50) return "MEDIUM";
  if (score < 75) return "HIGH";
  return "CRITICAL";
}

/**
 * Trend analysis
 */
async function computeVerificationTrend(ownerId) {
  const history = await prisma.verificationSnapshot.findMany({
    where: { ownerId },
    orderBy: { timestamp: "asc" },
  });

  if (history.length < 2) return "stable";

  const last = history[history.length - 1].score;
  const prev = history[history.length - 2].score;

  if (last < prev) return "improving";
  if (last > prev) return "worsening";
  return "stable";
}

/**
 * Build verification snapshot object
 */
function buildVerificationSnapshot({
  identityIssues,
  incomeIssues,
  bankIssues,
  checkIssues,
  achIssues,
  creditIssues,
  score,
  severity,
}) {
  return {
    identityIssues,
    incomeIssues,
    bankIssues,
    checkIssues,
    achIssues,
    creditIssues,
    score,
    severity,
    timestamp: new Date(),
  };
}

module.exports = {
  verifyIdentity,
  verifyIncome,
  verifyBank,
  verifyChecks,
  verifyACH,
  verifyCredit,
  aggregateVerification,
  computeVerificationScore,
  computeVerificationSeverity,
  computeVerificationTrend,
  buildVerificationSnapshot,
};
