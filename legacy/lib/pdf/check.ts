import PDFDocument = require("pdfkit");
import QRCode from "qrcode";
import path from "path";
import fs from "fs";

export async function generateCertifiedCheckPdf({
  profile,
  payee,
  amount,
  memo,
}) {
  return new Promise(async (resolve) => {
    const doc = new PDFDocument({
      size: "LETTER",
      margin: 40,
    });

    const buffers: Buffer[] = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    //
    // REGISTER MICR FONT
    //
    doc.registerFont(
      "MICR",
      path.join(process.cwd(), "public/fonts/micr/E13B.ttf")
    );

    //
    // SECURITY BACKGROUND
    //
    doc.save();
    doc.rect(40, 40, 532, 300);
    doc.fillColor("#0b1b30").fillOpacity(0.06).fill();
    doc.restore();

    // Cross‑hatch pattern
    doc.save();
    doc.strokeColor("#1f3b5a").strokeOpacity(0.08);

    for (let x = 40; x < 572; x += 20) {
      doc.moveTo(x, 40).lineTo(x + 40, 340).stroke();
    }
    for (let y = 40; y < 340; y += 20) {
      doc.moveTo(40, y).lineTo(572, y + 40).stroke();
    }

    doc.restore();

    //
    // STEP 10 — BRANDING + POLISH
    //

    // Bank Logo
    if (profile.logoUrl) {
      const logoPath = path.join(process.cwd(), "public", profile.logoUrl);
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 40, 40, { width: 120 });
      }
    }

    // Bank Address Block
    if (profile.bankAddress) {
      doc.fontSize(9)
        .fillColor("#333")
        .text(profile.bankAddress, 40, 170, { width: 200 });
    }

    // Professional Check Border
    doc.save();
    doc.lineWidth(1.2)
      .strokeColor("#1a1a1a")
      .rect(35, 35, 540, 310)
      .stroke();
    doc.restore();

    //
    // WATERMARK
    //
    doc.save();
    doc.fillColor("#0b1b30").fillOpacity(0.08);
    doc.fontSize(60);
    doc.rotate(-30, { origin: [300, 300] });
    doc.text("CERTIFIED CHECK", 80, 250, { align: "center", width: 500 });
    doc.restore();

    //
    // MICROTEXT ANTI‑COPY LINE
    //
    doc.save();
    doc.fontSize(5).fillColor("#0b1b30").fillOpacity(0.9);
    doc.text(
      "AUTHORIZED DOCUMENT • DO NOT DUPLICATE • CERTIFIED CHECK SECURITY PRINT • MICROTEXT ANTI‑COPY LINE",
      40,
      300,
      { width: 532, align: "center" }
    );
    doc.restore();

    //
    // HEADER — BANK INFO
    //
    doc.fontSize(22).fillColor("#000").text(profile.bankName, 180, 40);
    doc.fontSize(10)
      .text(`Routing: ${profile.routingNumber}`, 180, 70)
      .text(`Account: ${profile.accountNumber}`, 180, 85);

    //
    // QR CODE (verification)
    //
    const checkNumber = profile.nextCheckNumber;
    const verifyUrl = `https://yourdomain.com/verify/check/${checkNumber}`;

    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      margin: 1,
      width: 120,
    });

    const qrImage = qrDataUrl.replace(/^data:image\/png;base64,/, "");
    doc.image(Buffer.from(qrImage, "base64"), 40, 320, { width: 100 });

    //
    // CHECK NUMBER + DATE
    //
    doc.fontSize(12)
      .text(`Check No: ${checkNumber}`, 400, 40, { align: "right" })
      .text(`Date: ${new Date().toLocaleDateString()}`, 400, 60, {
        align: "right",
      });

    //
    // PAYEE
    //
    doc.fontSize(12).text("Pay to the Order of:", 40, 130);
    doc.moveTo(160, 145).lineTo(550, 145).stroke();
    doc.text(payee, 165, 130);

    //
    // AMOUNT
    //
    doc.rect(400, 120, 150, 30).stroke();
    doc.fontSize(14).text(`$${amount.toFixed(2)}`, 405, 127);

    //
    // AMOUNT IN WORDS
    //
    const amountWords = convertAmountToWords(amount);
    doc.fontSize(12).text(amountWords + " dollars", 40, 180);
    doc.moveTo(40, 195).lineTo(550, 195).stroke();

    //
    // MEMO
    //
    doc.fontSize(10).text("Memo:", 40, 250);
    doc.moveTo(80, 265).lineTo(300, 265).stroke();
    if (memo) doc.text(memo, 85, 250);

    //
    // STEP 11 — FRAUD‑DETECTION ENHANCEMENTS
    //

    // Hologram‑style gradient behind signature
    doc.save();
    const gradient = doc.linearGradient(350, 230, 550, 260);
    gradient.stop(0, "#d4e1f5");
    gradient.stop(1, "#f5d4e1");
    doc.rect(350, 230, 200, 40).fill(gradient);
    doc.restore();

    // Micro‑text signature line
    doc.save();
    doc.moveTo(350, 265).lineTo(550, 265).stroke();
    doc.fontSize(6).fillColor("#0b1b30");
    doc.text(
      "AUTHORIZED SIGNATURE • MICROTEXT SECURITY LINE • DO NOT DUPLICATE",
      350,
      270,
      { width: 200, align: "center" }
    );
    doc.restore();

    // VOID pantograph (subtle)
    doc.save();
    doc.fillColor("#c0c4cf").fillOpacity(0.12);
    doc.fontSize(40);
    doc.text("VOID", 200, 200, { width: 300, align: "center" });
    doc.restore();

    //
    // SIGNATURE IMAGE
    //
    if (profile.signatureUrl) {
      const sigPath = path.join(process.cwd(), "public", profile.signatureUrl);
      if (fs.existsSync(sigPath)) {
        doc.image(sigPath, 360, 235, { width: 160 });
      }
    }

    //
    // MICR LINE (E13B)
    //
    const transit = "\u2446";
    const onUs = "\u2447";
    const routing = profile.routingNumber;
    const account = profile.accountNumber;
    const checkNoPadded = checkNumber.toString().padStart(6, "0");

    const micrLine =
      `${transit}${routing}${transit}` +
      ` ${onUs}${account}${onUs}` +
      ` ${onUs}${checkNoPadded}${onUs}`;

    doc.font("MICR").fontSize(14).fillColor("#000").text(micrLine, 40, 720, {
      align: "center",
    });

    //
    // PAGE 2 — ENDORSEMENT
    //
    doc.addPage({ size: "LETTER", margin: 40 });

    doc.save();
    doc.rect(40, 40, 532, 300);
    doc.fillColor("#0b1b30").fillOpacity(0.04).fill();
    doc.restore();

    doc.fontSize(16).text("ENDORSEMENT", 40, 60);

    doc.moveTo(40, 120).lineTo(550, 120).stroke();
    doc.moveTo(40, 160).lineTo(550, 160).stroke();
    doc.moveTo(40, 200).lineTo(550, 200).stroke();

    doc.fontSize(10).text(
      "Sign your name exactly as written on the front of the check.",
      40,
      210
    );

    doc.save();
    doc.moveTo(40, 260).lineTo(550, 260).stroke();
    doc.fontSize(8).text(
      "DO NOT WRITE, STAMP, OR SIGN BELOW THIS LINE",
      40,
      265,
      { width: 532, align: "center" }
    );
    doc.restore();

    doc.fontSize(10).text(
      "For mobile deposit: Endorse with your signature and write 'For Mobile Deposit Only'.",
      40,
      300,
      { width: 532 }
    );

    doc.end();
  });
}

function convertAmountToWords(amount: number) {
  const [whole, decimal] = amount.toFixed(2).split(".");
  const words = numberToWords(Number(whole));
  return `${words} and ${decimal}/100`;
}

function numberToWords(num: number): string {
  const a = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const b = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  if (num < 20) return a[num];
  if (num < 100)
    return (
      b[Math.floor(num / 10)] + (num % 10 ? "-" + a[num % 10] : "")
    );
  if (num < 1000)
    return (
      a[Math.floor(num / 100)] +
      " hundred" +
      (num % 100 === 0 ? "" : " " + numberToWords(num % 100))
    );
  if (num < 1000000)
    return (
      numberToWords(Math.floor(num / 1000)) +
      " thousand" +
      (num % 1000 === 0 ? "" : " " + numberToWords(num % 1000))
    );

  return num.toString();
}
