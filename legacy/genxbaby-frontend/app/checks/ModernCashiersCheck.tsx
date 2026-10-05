"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import PrintCheckModal from "./PrintCheckModal";

export default function ModernCashiersCheck({ check, bulkChecks }) {
  const {
    bankName = "Resilient America Inc.",
    bankAddress = "123 Liberty Avenue, Queens, NY 11419",
    payee = "Payee Name",
    amount = "0.00",
    amountWritten = "Zero Dollars and 00/100",
    memo = "Memo / Purpose",
    date = "MM/DD/YYYY",
    checkNumber = "0000",
    routingNumber = "123456789",
    accountNumber = "9876543210",
    signatureImageUrl = null,
  } = check;

  const formattedAmount =
    typeof amount === "number" ? amount.toFixed(2) : amount;

  const verifyUrl = `https://verify.resilientamerica.org/check/${checkNumber}`;

  const [downloading, setDownloading] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  // -----------------------------
  // PDF DOWNLOAD
  // -----------------------------
  async function downloadPdf() {
    try {
      setDownloading(true);

      const res = await fetch("/api/checks/pdf-modern", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(check),
      });

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `cashiers-check-${checkNumber}.pdf`;
      a.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download failed:", err);
      alert("Failed to download PDF.");
    } finally {
      setDownloading(false);
    }
  }

  // -----------------------------
  // EMAIL CHECK
  // -----------------------------
  async function emailCheck() {
    const email = prompt("Enter recipient email:");
    if (!email) return;

    const res = await fetch("/api/checks/email-modern", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, check }),
    });

    if (res.ok) {
      alert("Check emailed successfully.");
    } else {
      alert("Failed to send email.");
    }
  }

  // -----------------------------
  // BULK PDF EXPORT
  // -----------------------------
  async function bulkPdfExport() {
    try {
      setBulkLoading(true);

      const res = await fetch("/api/checks/bulk-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checks: bulkChecks }),
      });

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "cashiers-checks-bulk.zip";
      a.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Bulk PDF export failed:", err);
      alert("Failed to export bulk PDFs.");
    } finally {
      setBulkLoading(false);
    }
  }

  // -----------------------------
  // BULK EMAIL
  // -----------------------------
  async function bulkEmail() {
    const email = prompt("Enter recipient email for ALL checks:");
    if (!email) return;

    try {
      setBulkLoading(true);

      const res = await fetch("/api/checks/bulk-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emails: bulkChecks.map(() => email),
          checks: bulkChecks,
        }),
      });

      if (res.ok) {
        alert("Bulk email sent successfully.");
      } else {
        alert("Failed to send bulk email.");
      }
    } catch (err) {
      console.error("Bulk email error:", err);
      alert("Bulk email failed.");
    } finally {
      setBulkLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto border rounded-lg shadow-xl bg-gradient-to-r from-blue-50 to-gray-100 p-8 space-y-6 font-sans">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-blue-800 tracking-wide">
            CASHIER'S CHECK
          </h2>
          <p className="text-sm text-gray-700">{bankName}</p>
          <p className="text-xs text-gray-600">{bankAddress}</p>
        </div>

        <div className="text-right text-sm text-gray-700">
          <p className="font-semibold">No. {checkNumber}</p>
          <p>Date: {date}</p>
        </div>
      </div>

      {/* PAYEE */}
      <div className="border-t border-gray-300 pt-4">
        <p className="font-semibold text-gray-800">PAY TO THE ORDER OF:</p>
        <p className="text-xl border-b border-gray-400 pb-1 font-medium">
          {payee}
        </p>
      </div>

      {/* AMOUNT */}
      <div className="flex justify-between items-center mt-4">
        <p className="italic text-gray-700 text-lg">{amountWritten}</p>
        <div className="border border-gray-400 rounded px-4 py-2 text-xl font-bold text-gray-900 bg-white shadow-sm">
          ${formattedAmount}
        </div>
      </div>

      {/* MEMO + QR */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-700">
          FOR: <span className="border-b border-gray-400">{memo}</span>
        </p>

        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-white rounded shadow-md p-1">
            <QRCode value={verifyUrl} size={80} />
          </div>
          <p className="text-xs text-gray-600 mt-1">Scan to Verify</p>
        </div>
      </div>

      {/* HOLOGRAM SEAL */}
      <div className="mt-4 flex justify-end">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 via-blue-400 to-purple-600 shadow-md border border-white flex items-center justify-center text-[9px] font-semibold text-white text-center">
          SECURE<br />FUNDS
        </div>
      </div>

      {/* SIGNATURE */}
      <div className="flex justify-between items-end mt-8">
        <div className="text-xs text-gray-600">
          Secure Funds – Verified by Resilient America Inc.
        </div>

        <div className="text-right">
          {signatureImageUrl ? (
            <img
              src={signatureImageUrl}
              alt="Digital Signature"
              className="h-10 object-contain mb-1"
            />
          ) : (
            <p className="border-b border-gray-400 w-56 text-right italic text-gray-800 text-lg">
              Michael Turner
            </p>
          )}
          <p className="text-xs text-gray-600">Authorized Officer</p>
        </div>
      </div>

      {/* MICR LINE */}
      <div className="border-t border-gray-300 pt-4 text-center font-mono text-lg text-gray-700 tracking-widest">
        :{routingNumber}: {accountNumber} {checkNumber}
      </div>

      {/* ACTION BUTTONS */}
      <div className="pt-6 flex flex-wrap gap-4 justify-end">

        {/* PRINT */}
        <button
          onClick={() => setShowPrintModal(true)}
          className="px-6 py-3 bg-green-700 text-white rounded-lg shadow hover:bg-green-800 transition"
        >
          Print Check
        </button>

        {/* EMAIL */}
        <button
          onClick={emailCheck}
          className="px-6 py-3 bg-purple-700 text-white rounded-lg shadow hover:bg-purple-800 transition"
        >
          Share via Email
        </button>

        {/* PDF */}
        <button
          onClick={downloadPdf}
          disabled={downloading}
          className="px-6 py-3 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition disabled:opacity-50"
        >
          {downloading ? "Generating PDF..." : "Download PDF"}
        </button>

        {/* BULK PDF */}
        <button
          onClick={bulkPdfExport}
          disabled={bulkLoading}
          className="px-6 py-3 bg-orange-600 text-white rounded-lg shadow hover:bg-orange-700 transition disabled:opacity-50"
        >
          {bulkLoading ? "Exporting..." : "Bulk PDF Export"}
        </button>

        {/* BULK EMAIL */}
        <button
          onClick={bulkEmail}
          disabled={bulkLoading}
          className="px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition disabled:opacity-50"
        >
          {bulkLoading ? "Sending..." : "Bulk Email"}
        </button>
      </div>

      {/* PRINT MODAL */}
      {showPrintModal && (
        <PrintCheckModal
          check={check}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
}
