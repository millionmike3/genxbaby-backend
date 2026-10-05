// genxbaby-backend/src/services/documentsService.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Classify document type based on filename or extension
 */
function classifyDocumentType(fileName) {
  const lower = fileName.toLowerCase();

  if (lower.includes("paystub") || lower.includes("pay") || lower.includes("stub")) {
    return "PAYSTUB";
  }
  if (lower.includes("statement") || lower.includes("bank")) {
    return "BANK_STATEMENT";
  }
  if (lower.includes("id") || lower.includes("license") || lower.includes("passport")) {
    return "IDENTIFICATION";
  }
  if (lower.includes("check")) {
    return "CHECK";
  }

  return "UNKNOWN";
}

/**
 * Run OCR on a document (placeholder for your OCR engine)
 */
async function runDocumentOCR(filePath) {
  // Replace with your actual OCR engine (Tesseract, AWS Textract, Google Vision, etc.)
  return `OCR output for file: ${filePath}`;
}

/**
 * Extract fields depending on document type
 */
function extractDocumentFields(docType, ocrText) {
  switch (docType) {
    case "PAYSTUB":
      return extractPaystubFields(ocrText);
    case "BANK_STATEMENT":
      return extractBankStatementFields(ocrText);
    case "IDENTIFICATION":
      return extractIDFields(ocrText);
    case "CHECK":
      return extractCheckFields(ocrText);
    default:
      return { rawText: ocrText };
  }
}

/**
 * PAYSTUB field extraction
 */
function extractPaystubFields(text) {
  return {
    employer: findLine(text, ["Employer", "Company"]),
    grossPay: findNumber(text, ["Gross", "Gross Pay"]),
    netPay: findNumber(text, ["Net", "Net Pay"]),
    payDate: findDate(text),
  };
}

/**
 * BANK STATEMENT field extraction
 */
function extractBankStatementFields(text) {
  return {
    accountNumber: findLine(text, ["Account", "Acct"]),
    beginningBalance: findNumber(text, ["Beginning Balance"]),
    endingBalance: findNumber(text, ["Ending Balance"]),
    statementDate: findDate(text),
  };
}

/**
 * ID field extraction
 */
function extractIDFields(text) {
  return {
    name: findLine(text, ["Name"]),
    dob: findDate(text),
    address: findLine(text, ["Address"]),
    idNumber: findLine(text, ["ID", "DL", "License"]),
  };
}

/**
 * CHECK field extraction
 */
function extractCheckFields(text) {
  return {
    amount: findNumber(text, ["Amount", "Check Amount"]),
    date: findDate(text),
    payee: findLine(text, ["Payee", "To"]),
    memo: findLine(text, ["Memo"]),
  };
}

/**
 * Helpers for parsing text
 */
function findLine(text, keywords) {
  const lines = text.split("\n");
  for (const line of lines) {
    for (const key of keywords) {
      if (line.toLowerCase().includes(key.toLowerCase())) {
        return line.trim();
      }
    }
  }
  return null;
}

function findNumber(text, keywords) {
  const lines = text.split("\n");
  for (const line of lines) {
    for (const key of keywords) {
      if (line.toLowerCase().includes(key.toLowerCase())) {
        const match = line.match(/[\d,.]+/);
        return match ? match[0] : null;
      }
    }
  }
  return null;
}

function findDate(text) {
  const match = text.match(
    /\b(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-](\d{2,4})\b/
  );
  return match ? match[0] : null;
}

/**
 * Risk scoring (0–100)
 */
function computeDocumentRiskScore({ docType, fields, ocrText }) {
  let score = 0;

  // Unknown document type = higher risk
  if (docType === "UNKNOWN") score += 20;

  // Missing fields = higher risk
  const missingFields = Object.values(fields).filter((v) => !v).length;
  score += missingFields * 10;

  // Very short OCR text = suspicious
  if (ocrText.length < 50) score += 15;

  return Math.min(score, 100);
}

/**
 * Severity classification
 */
function computeDocumentSeverity(score) {
  if (score < 25) return "LOW";
  if (score < 50) return "MEDIUM";
  if (score < 75) return "HIGH";
  return "CRITICAL";
}

/**
 * Trend analysis
 */
async function computeDocumentTrend(ownerId) {
  const snapshots = await prisma.documentSnapshot.findMany({
    where: { ownerId },
    orderBy: { timestamp: "asc" },
  });

  if (snapshots.length < 2) return "stable";

  const last = snapshots[snapshots.length - 1].riskScore;
  const prev = snapshots[snapshots.length - 2].riskScore;

  if (last < prev) return "improving";
  if (last > prev) return "worsening";
  return "stable";
}

module.exports = {
  classifyDocumentType,
  runDocumentOCR,
  extractDocumentFields,
  computeDocumentRiskScore,
  computeDocumentSeverity,
  computeDocumentTrend,
};
