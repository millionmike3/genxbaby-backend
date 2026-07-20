import { PDFDocument } from "pdf-lib";
import { generateCheckPdf } from "./checkGenerator";

export async function generateBatchChecksPdf(checks) {
  const masterPdf = await PDFDocument.create();

  for (const check of checks) {
    const singlePdfBytes = await generateCheckPdf(check);
    const singlePdf = await PDFDocument.load(singlePdfBytes);

    const copiedPages = await masterPdf.copyPages(
      singlePdf,
      singlePdf.getPageIndices()
    );

    for (const page of copiedPages) {
      masterPdf.addPage(page);
    }
  }

  return await masterPdf.save();
}
