"use client";

import { useState } from "react";

export default function VerifyCheckPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [message, setMessage] = useState("");

  async function verify() {
    setMessage("Verifying check...");
    const res = await fetch(`/api/verify/check?checkNumber=${input}`);
    const json = await res.json();
    setResult(json);
    setMessage("");
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-purple-700">Check Verification Portal</h1>
      <p className="text-gray-600">
        Enter a check number or scan the QR code printed on the check.
      </p>

      {/* Input */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Enter check number"
          className="flex-1 p-3 border rounded-lg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={verify}
          className="px-4 py-2 bg-purple-700 text-white rounded-lg"
        >
          Verify
        </button>
      </div>

      {message && (
        <div className="p-3 bg-blue-100 text-blue-700 rounded">{message}</div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Status */}
          <div
            className={`p-4 rounded-lg text-white ${
              result.valid ? "bg-green-600" : "bg-red-600"
            }`}
          >
            <h2 className="text-xl font-bold">
              {result.valid ? "Valid Certified Check" : "Invalid or Voided Check"}
            </h2>
            <p>{result.reason}</p>
          </div>

          {/* Check Details */}
          <div className="p-4 bg-white rounded-lg shadow space-y-2">
            <h3 className="text-lg font-semibold">Check Details</h3>
            <p><strong>Check #:</strong> {result.check.checkNumber}</p>
            <p><strong>Payee:</strong> {result.check.payee}</p>
            <p><strong>Amount:</strong> ${result.check.amount.toFixed(2)}</p>
            <p><strong>Memo:</strong> {result.check.memo || "None"}</p>
            <p><strong>Date:</strong> {new Date(result.check.date).toLocaleString()}</p>
          </div>

          {/* Bank Profile */}
          <div className="p-4 bg-white rounded-lg shadow space-y-2">
            <h3 className="text-lg font-semibold">Bank Profile</h3>
            <p><strong>Bank:</strong> {result.bank.bankName}</p>
            <p><strong>Routing:</strong> {result.bank.routingNumber}</p>
            <p><strong>Account:</strong> {result.bank.accountNumber}</p>
          </div>

          {/* Signer */}
          <div className="p-4 bg-white rounded-lg shadow space-y-2">
            <h3 className="text-lg font-semibold">Authorized Signer</h3>
            <p><strong>Name:</strong> {result.signer.name}</p>
            <p><strong>Title:</strong> {result.signer.title || "N/A"}</p>
          </div>

          {/* Fraud Flags */}
          {result.fraudFlags.length > 0 && (
            <div className="p-4 bg-red-100 rounded-lg shadow space-y-2">
              <h3 className="text-lg font-semibold text-red-700">Fraud Flags</h3>
              {result.fraudFlags.map((f: any) => (
                <div key={f.id} className="border-b pb-2">
                  <p><strong>Type:</strong> {f.type}</p>
                  <p><strong>Severity:</strong> {f.severity}</p>
                  <p><strong>Message:</strong> {f.message}</p>
                </div>
              ))}
            </div>
          )}

          {/* SAR Reports */}
          {result.sar.length > 0 && (
            <div className="p-4 bg-yellow-100 rounded-lg shadow space-y-2">
              <h3 className="text-lg font-semibold text-yellow-700">
                Suspicious Activity Reports
              </h3>
              {result.sar.map((s: any) => (
                <div key={s.id} className="border-b pb-2">
                  <p><strong>Type:</strong> {s.type}</p>
                  <p><strong>Severity:</strong> {s.severity}</p>
                  <p><strong>Summary:</strong> {s.summary}</p>
                </div>
              ))}
            </div>
          )}

          {/* Blockchain Proof */}
          <div className="p-4 bg-purple-100 rounded-lg shadow space-y-2">
            <h3 className="text-lg font-semibold text-purple-700">Blockchain Proof</h3>
            <p><strong>Merkle Root:</strong> {result.root}</p>
            <p><strong>Anchored:</strong> {result.anchored ? "Yes" : "No"}</p>
          </div>
        </div>
      )}
    </div>
  );
}
