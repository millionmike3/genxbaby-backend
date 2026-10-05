import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { emails, checks } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    for (let i = 0; i < checks.length; i++) {
      const check = checks[i];
      const email = emails[i];

      const pdf = await PDFDocument.create();
      const page = pdf.addPage([800, 400]);
      const font = await pdf.embedFont(StandardFonts.Helvetica);

      const draw = (text: string, x: number, y: number, size = 12) =>
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

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Cashier's Check #${check.checkNumber}`,
        text: "Attached is your cashier's check.",
        attachments: [
          {
            filename: `cashiers-check-${check.checkNumber}.pdf`,
            content: pdfBytes,
          },
        ],
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Bulk email error:", err);
    return NextResponse.json({ error: "Failed to send bulk email" }, { status: 500 });
  }
}
