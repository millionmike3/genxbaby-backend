const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function analyzeDocumentFraud(docId) {
  const ocr = await prisma.oCRExtraction.findFirst({
    where: { docId },
    orderBy: { createdAt: "desc" },
  });

  if (!ocr) return { fraudScore: 0, issues: [] };

  const text = ocr.text.toLowerCase();

  const issues = [];

  // Example fraud checks
  if (text.includes("template")) issues.push("Possible template artifact");
  if (text.includes("sample")) issues.push("Document may be a sample");
  if (text.includes("void")) issues.push("Document contains VOID watermark");
  if (text.includes("photoshop")) issues.push("Possible editing software reference");

  const fraudScore = Math.min(100, issues.length * 20);

  await prisma.documentFraudResult.create({
    data: {
      docId,
      fraudScore,
      issues,
    },
  });

  return { fraudScore, issues };
}

module.exports = { analyzeDocumentFraud };
