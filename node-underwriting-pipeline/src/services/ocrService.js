// genxbaby-backend/src/services/ocrService.js

const Tesseract = require("tesseract.js");

/**
 * 1. Run generic OCR on any document
 */
async function runGenericOCR(filePath) {
  try {
    const result = await Tesseract.recognize(filePath, "eng", {
      logger: () => {},
    });

    return result.data.text || "";
  } catch (err) {
    console.error("OCR ERROR:", err);
    return "";
  }
}

/**
 * 2. Clean OCR text
 */
function cleanOCRText(text) {
  if (!text) return "";

  return text
    .replace(/\s+/g, " ")
    .replace(/[^\x20-\x7E]/g, "") // remove non-ASCII
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // remove zero-width chars
    .trim();
}

/**
 * 3. Detect document type from OCR text
 */
function detectDocumentTypeFromOCR(text) {
  const lower = text.toLowerCase();

  if (lower.includes("net pay") || lower.includes("gross pay")) return "PAYSTUB";
  if (lower.includes("statement period") || lower.includes("ending balance"))
    return "BANK_STATEMENT";
  if (lower.includes("pay to the order of") || lower.includes("micr"))
    return "CHECK";
  if (lower.includes("driver license") || lower.includes("passport"))
    return "IDENTIFICATION";

  return "UNKNOWN";
}

/**
 * 4. Extract fields based on document type
 */
function extractFieldsFromOCR(docType, text) {
  switch (docType) {
    case "PAYSTUB":
      return extractPaystubFields(text);
    case "BANK_STATEMENT":
      return extractBankFields(text);
    case "CHECK":
      return extractCheckFields(text);
    case "IDENTIFICATION":
      return extractIDFields(text);
    default:
      return {};
  }
}

/**
 * PAYSTUB FIELD EXTRACTION
 */
function extractPaystubFields(text) {
  return {
    name: findLine(text, ["Employee", "Name"]),
    employer: findLine(text, ["Employer", "Company"]),
    grossPay: findNumber(text, ["Gross", "Gross Pay"]),
    netPay: findNumber(text, ["Net", "Net Pay"]),
    payPeriod: findLine(text, ["Pay Period", "Period"]),
    ytdGross: findNumber(text, ["YTD", "Year to Date"]),
  };
}

/**
 * BANK STATEMENT FIELD EXTRACTION
 */
function extractBankFields(text) {
  return {
    accountName: findLine(text, ["Account Name", "Name"]),
    accountNumber: findNumber(text, ["Account Number", "Acct"]),
    routingNumber: findNumber(text, ["Routing", "RTN"]),
    beginningBalance: findNumber(text, ["Beginning Balance"]),
    endingBalance: findNumber(text, ["Ending Balance"]),
    statementPeriod: findLine(text, ["Statement Period"]),
    transactions: extractTransactions(text),
  };
}

/**
 * CHECK FIELD EXTRACTION
 */
function extractCheckFields(text) {
  return {
    payeeName: findLine(text, ["Payee", "Pay to the order of"]),
    payerName: findLine(text, ["From", "Payer"]),
    amount: findNumber(text, ["$", "Amount"]),
    date: findDate(text),
    routingNumber: findNumber(text, ["Routing"]),
    accountNumber: findNumber(text, ["Account"]),
    micr: parseMICR(text),
  };
}

/**
 * IDENTIFICATION FIELD EXTRACTION
 */
function extractIDFields(text) {
  return {
    name: findLine(text, ["Name"]),
    address: findLine(text, ["Address"]),
    idNumber: findLine(text, ["ID", "DL", "License"]),
    dob: findDate(text),
    expiration: findDate(text),
  };
}

/**
 * TRANSACTION EXTRACTION
 */
function extractTransactions(text) {
  const lines = text.split("\n");
  const txns = [];

  for (const line of lines) {
    const date = findDate(line);
    const amount = findNumber(line, ["$", "Amount"]);
    const desc = line.trim();

    if (date && amount && desc.length > 5) {
      txns.push({
        date,
        amount,
        description: desc,
      });
    }
  }

  return txns;
}

/**
 * MICR PARSING
 */
function parseMICR(text) {
  const micr = {
    routingNumber: null,
    accountNumber: null,
    checkNumber: null,
  };

  const routingMatch = text.match(/\b\d{9}\b/);
  if (routingMatch) micr.routingNumber = routingMatch[0];

  const accountMatch = text.match(/\b\d{6,14}\b/);
  if (accountMatch) micr.accountNumber = accountMatch[0];

  const checkMatch = text.match(/\b\d{3,6}\b/);
  if (checkMatch) micr.checkNumber = checkMatch[0];

  return micr;
}

/**
 * Helper: find a line containing keywords
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

/**
 * Helper: extract numeric values
 */
function findNumber(text, keywords) {
  const lines = text.split("\n");
  for (const line of lines) {
    for (const key of keywords) {
      if (line.toLowerCase().includes(key.toLowerCase())) {
        const match = line.match(/[\d,.]+/);
        return match ? parseFloat(match[0].replace(/,/g, "")) : null;
      }
    }
  }
  return null;
}

/**
 * Helper: extract dates
 */
function findDate(text) {
  const match = text.match(
    /\b(0?[1-9]|1[0-2])[\/\-\.](0?[1-9]|[12][0-9]|3[01])[\/\-\.](\d{2,4})\b/
  );
  return match ? match[0] : null;
}

module.exports = {
  runGenericOCR,
  cleanOCRText,
  detectDocumentTypeFromOCR,
  extractFieldsFromOCR,
  extractPaystubFields,
  extractBankFields,
  extractCheckFields,
  extractIDFields,
  extractTransactions,
  parseMICR,
  findLine,
  findNumber,
  findDate,
};
