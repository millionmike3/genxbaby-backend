import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";

export async function generateCheckPdf({
  bank,
  signatureImage,
  checkNumber,
  payee,
  amount,
  memo,
  date
})
 {
  const pdf = await PDFDocument.create();
// BACKGROUND TINT
page1.drawRectangle({
  x: 0,
  y: 0,
  width: 800,
  height: 350,
  color: rgb(0.95, 0.97, 1.0) // very light blue
});

  //
  // PAGE 1 — FRONT OF CHECK
  //
  const page1 = pdf.addPage([800, 350]);
// WATERMARK (light diagonal text)
page1.drawText("GENXBABY SECURE CHECK", {
  x: 150,
  y: 150,
  size: 40,
  font: bold,
  color: rgb(0.85, 0.85, 0.85),
  rotate: { type: "degrees", angle: 30 },
  opacity: 0.25
});
// OPTIONAL: VOID PATTERN (light)
page1.drawText("VOID VOID VOID VOID VOID", {
  x: 50,
  y: 180,
  size: 50,
  font: bold,
  color: rgb(0.9, 0.9, 0.9),
  opacity: 0.15
});

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  // BANK INFO
  page1.drawText(bank.bankName, { x: 40, y: 300, size: 16, font: bold });
  page1.drawText(`Routing: ${bank.routingNumber}`, { x: 40, y: 280, size: 12, font });
  page1.drawText(`Account: ${bank.accountNumber}`, { x: 40, y: 260, size: 12, font });

  // CHECK NUMBER
  page1.drawText(`#${checkNumber}`, { x: 700, y: 300, size: 18, font: bold });

  // PAYEE
  page1.drawText("Pay to the Order of:", { x: 40, y: 220, size: 12, font });
  page1.drawText(payee, { x: 180, y: 220, size: 14, font: bold });

  // AMOUNT
  page1.drawText(`$${amount}`, { x: 700, y: 220, size: 14, font: bold });

  // DATE
  page1.drawText(`Date: ${date}`, { x: 40, y: 200, size: 12, font });

  // MEMO
  page1.drawText(`Memo: ${memo}`, { x: 40, y: 140, size: 12, font });

  // SIGNATURE
 if (signatureImage) {
  const sigImage = await pdf.embedPng(signatureImage);

    page1.drawImage(sigImage, {
      x: 600,
      y: 140,
      width: 150,
      height: 50
    });
  }
// QR CODE (verification link)
const verifyUrl = `https://yourdomain.com/verify/check/${checkNumber}`;

const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
  margin: 1,
  width: 120
});

const qrImage = await pdf.embedPng(qrDataUrl);
page1.drawImage(qrImage, {
  x: 40,
  y: 20,
  width: 100,
  height: 100
});
// MICRO-TEXT SECURITY LINE
page1.drawText(
  "AUTHORIZED SIGNATURE • SECURITY FEATURES INCLUDED • DO NOT CASH IF ALTERED",
  {
    x: 40,
    y: 110,
    size: 6,
    font,
    color: rgb(0.2, 0.2, 0.2)
  }
);

  // MICR LINE
  const micr = `⑆${bank.routingNumber}⑆ ${bank.accountNumber}⑈ ${checkNumber}`;
  page1.drawText(micr, {
    x: 40,
    y: 80,
    size: 18,
    font: bold,
    color: rgb(0, 0, 0)
  });

  //
  // PAGE 2 — BACK OF CHECK (ENDORSEMENT)
  //
  const page2 = pdf.addPage([800, 350]);

  // Title
  page2.drawText("ENDORSE HERE", {
    x: 40,
    y: 300,
    size: 20,
    font: bold
  });

  // Endorsement box
  page2.drawRectangle({
    x: 40,
    y: 200,
    width: 720,
    height: 80,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1
  });

  page2.drawText("Sign within the box above. Do not write below this line.", {
    x: 40,
    y: 180,
    size: 12,
    font
  });

  // Deposit instructions
  page2.drawText("For Mobile Deposit Only", {
    x: 40,
    y: 150,
    size: 14,
    font: bold
  });

  page2.drawText(`Account: ${bank.accountNumber}`, {
    x: 40,
    y: 130,
    size: 12,
    font
  });

  return await pdf.save();
}
