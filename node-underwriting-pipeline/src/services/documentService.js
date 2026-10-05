// genxbaby-backend/src/services/documentService.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {
  runGenericOCR,
  cleanOCRText,
  detectDocumentTypeFromOCR,
  extractFieldsFromOCR,
} = require("./ocrService");

/**
 * 1. Ingest a document and run OCR
 */
async function ingestDocument(ownerId, filePath) {
  // Run OCR
  const rawText = await runGenericOCR(filePath);
  const cleanedText = cleanOCRText(rawText);

  // Detect document type
  const docType = detectDocumentTypeFromOCR(cleanedText);

  // Extract fields
  const fields = extractFieldsFromOCR(docType, cleanedText);

  // Save snapshot
  const snapshot = await prisma.documentSnapshot.create({
    data: {
      ownerId,
      filePath,
      docType,
      rawText,
      cleanedText,
      fields,
      timestamp: new Date(),
    },
  });

  return snapshot;
}

/**
 * 2. Document authenticity checks
 */
function evaluateDocumentAuthenticity(snapshot) {
  const authenticity = {
    missingFields: 0,
    formattingIssues: 0,
    suspiciousPatterns: 0,
    confidence: 0,
  };

  const fields = snapshot.fields || {};

  // Missing fields
  authenticity.missingFields = Object.values(fields).filter((v) => !v).length;

  // Formatting issues
  if (snapshot.cleanedText.length < 40) authenticity.formattingIssues++;
  if (snapshot.cleanedText.includes("###")) authenticity.formattingIssues++;
  if (snapshot.cleanedText.includes("***")) authenticity.formattingIssues++;

  // Suspicious patterns
  if (snapshot.cleanedText.includes("VOID")) authenticity.suspiciousPatterns++;
  if (snapshot.cleanedText.includes("SAMPLE")) authenticity.suspiciousPatterns++;
  if (snapshot.cleanedText.includes("FAKE")) authenticity.suspiciousPatterns++;

  authenticity.confidence =
    100 -
    authenticity.missingFields * 5 -
    authenticity.formattingIssues * 10 -
    authenticity.suspiciousPatterns * 15;

  return authenticity;
}

/**
 * 3. Document classification (high-level)
 */
function classifyDocument(snapshot) {
  const type = snapshot.docType;

  switch (type) {
    case "PAYSTUB":
      return "INCOME_DOCUMENT";
    case "BANK_STATEMENT":
      return "BANK_DOCUMENT";
    case "IDENTIFICATION":
      return "ID_DOCUMENT";
    case "CHECK":
      return "CHECK_DOCUMENT";
    default:
      return "UNKNOWN_DOCUMENT";
  }
}

/**
 * 4. Build document intelligence object
 */
function buildDocumentIntelligence(snapshot, authenticity) {
  return {
    docType: snapshot.docType,
    classification: classifyDocument(snapshot),
    fields: snapshot.fields,
    authenticity,
    timestamp: snapshot.timestamp,
  };
}

/**
 * 5. Fetch all documents for an owner
 */
async function getOwnerDocuments(ownerId) {
  const docs = await prisma.documentSnapshot.findMany({
    where: { ownerId },
    orderBy: { timestamp: "desc" },
  });

  return docs.map((doc) => {
    const authenticity = evaluateDocumentAuthenticity(doc);
    return buildDocumentIntelligence(doc, authenticity);
  });
}

/**
 * 6. Fetch a single document intelligence snapshot
 */
async function getDocumentSnapshot(documentId) {
  const snapshot = await prisma.documentSnapshot.findUnique({
    where: { id: documentId },
  });

  if (!snapshot) return null;

  const authenticity = evaluateDocumentAuthenticity(snapshot);
  return buildDocumentIntelligence(snapshot, authenticity);
}

module.exports = {
  ingestDocument,
  evaluateDocumentAuthenticity,
  classifyDocument,
  buildDocumentIntelligence,
  getOwnerDocuments,
  getDocumentSnapshot,
};
