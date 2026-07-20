import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";
import QRCode from "qrcode";

type GenerateCheckPdfInput = {
  profile: {
    id: string;
    bankName: string;
    routingNumber: string;
    accountNumber: string;
    accountType: string;
    signerName: string;
    signatureImage?: string | null;
  };
  checkNumber: number;
  payee: string;
  amount: number;
  memo: string;
  date: string;
};

export async function generateCheckPdf({
  profile,
  checkNumber,
  payee,
  amount,
  memo,
  date
}: GenerateCheckPdfInput) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([800, 350]); // width, height
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const black = rgb(0, 0, 0);

  // --- QR CODE (verification URL) ---
  const verifyUrl = `http://localhost:3000/checks/verify/${checkNumber}`; // change to your prod domain
  const qrDataUrl = await QRCode.toDataURL(verifyUrl);
  const qrImage = await pdf.embedPng(qrDataUrl);

  page.drawImage(qrImage, {
    x: 650,
    y: 40,
    width: 120,
    height: 120
  });

  // --- HEADER / BANK INFO ---
  page.drawText(profile.bankName, {
    x: 40,
    y: 300,
    size: 14,
    font: bold,
    color: black
  });

  page.drawText(`${profile.accountType} Account`, {
    x: 40,
    y: 280,
    size: 10,
    font,
    color: black
  });

  // --- CHECK NUMBER (top right) ---
  page.drawText(`#${checkNumber}`, {
    x: 700,
    y: 300,
    size: 16,
    font: bold,
    color: black
  });

  // --- DATE ---
  page.drawText("Date:", { x: 600, y: 260, size: 10, font, color: black });
  page.drawText(date, { x: 640, y: 260, size: 12, font: bold, color: black });

  // --- PAYEE ---
  page.drawText("Pay to the Order of:", {
    x: 40,
    y: 240,
    size: 10,
    font,
    color: black
  });
  page.drawText(payee, {
    x: 160,
    y: 240,
    size: 12,
    font: bold,
    color: black
  });

  // --- AMOUNT ---
  page.drawText(`$${amount.toFixed(2)}`, {
    x: 600,
    y: 240,
    size: 14,
    font: bold,
    color: black
  });

  // --- MEMO ---
  page.drawText("Memo:", {
    x: 40,
    y: 180,
    size: 10,
    font,
    color: black
  });
  page.drawText(memo, {
    x: 90,
    y: 180,
    size: 12,
    font,
    color: black
  });

  // --- SIGNATURE ---
  if (profile.signatureImage) {
    try {
      const signaturePath = path.join(process.cwd(), "public", profile.signatureImage);
      const signatureBytes = fs.readFileSync(signaturePath);
      const signatureImage = await pdf.embedPng(signatureBytes);

      page.drawImage(signatureImage, {
        x: 600,
        y: 150,
        width: 150,
        height: 60
      });
    } catch (err) {
      console.log("Signature not found:", err);
    }
  }

  // --- MICR LINE (bottom) ---
  const micr = `${profile.routingNumber}  ${profile.accountNumber}  ${checkNumber}`;
  page.drawText(micr, {
    x: 40,
    y: 40,
    size: 14,
    font: bold,
    color: black
  });

  const pdfBytes = await pdf.save();
  return pdfBytes;
}
