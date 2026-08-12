import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { logAudit } from "../../lib/logAudit";

export default async function pdfModern(req, res) {
  try {
    const check = req.body;

    const pdf = await PDFDocument.create();
    const page = pdf.addPage([800, 400]);
    const font = await pdf.embedFont(StandardFonts.Helvetica);

    const draw = (text, x, y, size = 12) =>
      page.drawText(text, { x, y, size, font, color: rgb(0, 0, 0) });

    draw("CASHIER'S CHECK", 30, 360, 20);
    draw(check.bankName, 30, 335, 12);
    draw(check.bankAddress, 30, 320, 10);
    draw(`No. ${check.checkNumber}`, 650, 360, 12);
    draw(`Date: ${check.date}`, 650, 340, 12);
    draw("PAY TO THE ORDER OF:", 30, 290, 12);
    draw(check.payee, 30, 270, 16);
    draw(check.amountWritten, 30, 240, 12);
    draw(`$${check.amount}`, 650, 240, 16);
    draw(`FOR: ${check.memo}`, 30, 210, 12);
    draw("Michael Turner", 600, 150, 14);
    draw("Authorized Officer", 600, 130, 10);
    draw(`:${check.routingNumber}: ${check.accountNumber} ${check.checkNumber}`, 250, 60, 14);

    const pdfBytes = await pdf.save();

    await logAudit(req.user.id, "GENERATE_PDF_MODERN", { checkId: check.id });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=cashiers-check-${check.checkNumber}.pdf`
    );

    return res.status(200).send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error("PDF generation error:", err);
    return res.status(500).json({ error: "Failed to generate PDF" });
  }
}
