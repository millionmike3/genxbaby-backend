"use client";
import { amountToWords } from "@/lib/amountToWords";
import { useState } from "react";

export default function ChecksClient({ profiles }) {
  const [selectedBank, setSelectedBank] = useState("");
  const [payee, setPayee] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [date, setDate] = useState("");
  const [generatedCheckNumber, setGeneratedCheckNumber] = useState(null);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const selectedProfile = profiles.find((p) => p.id === selectedBank);

  // FILTERED BANK LIST
  const filteredProfiles = profiles.filter((p) =>
    `${p.bankName} ${p.routingNumber} ${p.accountNumber}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ---------------------------------------------------------
  // 1. CREATE CHECK (auto-increment nextCheckNumber)
  // ---------------------------------------------------------
  async function createCheck() {
    if (!selectedBank) return alert("Select a bank profile first");

    setLoading(true);

    const res = await fetch("/api/checks/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profileId: selectedBank,
        payee,
        amount: parseFloat(amount),
        memo,
        date
      })
    });

    const data = await res.json();
    setGeneratedCheckNumber(data.checkNumber);
    setLoading(false);
  }
{/* LIVE CHECK PREVIEW */}
<div className="border rounded p-4 bg-white shadow space-y-2">
  <h2 className="font-semibold text-lg">Live Check Preview</h2>

  <div className="border p-4 rounded bg-gray-100 space-y-2">
    <p className="text-xl font-bold">{selectedProfile?.bankName || "Bank Name"}</p>

    <div className="flex justify-between">
      <p>Routing: {selectedProfile?.routingNumber || "XXXXXXX"}</p>
      <p>Account: {selectedProfile?.accountNumber || "XXXXXXX"}</p>
    </div>

    <hr />

    <p><strong>Pay to the Order of:</strong> {payee || "__________"}</p>

    <div className="flex justify-between">
      <p><strong>Date:</strong> {date || "MM/DD/YYYY"}</p>
      <p><strong>Amount:</strong> {amount ? `$${amount}` : "$0.00"}</p>
    </div>
<p>
  <strong>Amount in words:</strong>{" "}
  {amount ? amountToWords(parseFloat(amount)) : "zero dollars and 00/100"}
</p>

    <p><strong>Memo:</strong> {memo || "None"}</p>

    <hr />

    <p className="font-mono text-lg">
      {/* MICR LINE */}
      {selectedProfile
        ? `⑆${selectedProfile.routingNumber}⑆ ${selectedProfile.accountNumber}⑈ ${generatedCheckNumber || "#####"}`
        : "MICR LINE"
      }
      {selectedProfile?.signatureImage && (
  <img
    src={selectedProfile.signatureImage}
    alt="Signature"
    className="h-12 mt-2"
  />
  "use client";

import { useState } from "react";

export default function ChecksClient({ profiles }) {
  const [selectedBank, setSelectedBank] = useState("");
  const [payee, setPayee] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [date, setDate] = useState("");
  const [generatedCheckNumber, setGeneratedCheckNumber] = useState(null);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const selectedProfile = profiles.find((p) => p.id === selectedBank);

  // FILTERED BANK LIST
  const filteredProfiles = profiles.filter((p) =>
    `${p.bankName} ${p.routingNumber} ${p.accountNumber}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ---------------------------------------------------------
  // 1. CREATE CHECK (auto-increment nextCheckNumber)
  // ---------------------------------------------------------
  async function createCheck() {
    if (!selectedBank) return alert("Select a bank profile first");

    setLoading(true);

    const res = await fetch("/api/checks/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profileId: selectedBank,
        payee,
        amount: parseFloat(amount),
        memo,
        date
      })
    });

    const data = await res.json();
    setGeneratedCheckNumber(data.checkNumber);
    setLoading(false);
  }
{/* LIVE CHECK PREVIEW */}
<div className="border rounded p-4 bg-white shadow space-y-2">
  <h2 className="font-semibold text-lg">Live Check Preview</h2>

  <div className="border p-4 rounded bg-gray-100 space-y-2">
    <p className="text-xl font-bold">{selectedProfile?.bankName || "Bank Name"}</p>

    <div className="flex justify-between">
      <p>Routing: {selectedProfile?.routingNumber || "XXXXXXX"}</p>
      <p>Account: {selectedProfile?.accountNumber || "XXXXXXX"}</p>
    </div>

    <hr />

    <p><strong>Pay to the Order of:</strong> {payee || "__________"}</p>

    <div className="flex justify-between">
      <p><strong>Date:</strong> {date || "MM/DD/YYYY"}</p>
      <p><strong>Amount:</strong> {amount ? `$${amount}` : "$0.00"}</p>
    </div>

    <p><strong>Memo:</strong> {memo || "None"}</p>

    <hr />

    <p className="font-mono text-lg">
      {/* MICR LINE */}
      {selectedProfile
        ? `⑆${selectedProfile.routingNumber}⑆ ${selectedProfile.accountNumber}⑈ ${generatedCheckNumber || "#####"}`
        : "MICR LINE"
      }
      {selectedProfile?.signatureImage && (
  <img
    src={selectedProfile.signatureImage}
    alt="Signature"
    className="h-12 mt-2"
  />
)}

    </p>
  </div>
</div>

  // ---------------------------------------------------------
  // 2. DOWNLOAD PDF CHECK
  // ---------------------------------------------------------
  async function downloadPdf() {
    if (!generatedCheckNumber) return;

    const res = await fetch("/api/checks/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profile: selectedProfile,
        checkNumber: generatedCheckNumber,
        payee,
        amount: parseFloat(amount),
        memo,
        date
      })
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `check-${generatedCheckNumber}.pdf`;
    a.click();
  }

  return (
    <div className="space-y-8 p-6 max-w-2xl mx-auto">

      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search bank profiles..."
        className="border p-2 rounded w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* BANK DROPDOWN */}
      <div>
        <label className="block text-sm font-medium mb-1">Bank Profile</label>
        <select
          className="border rounded px-3 py-2 w-full"
          value={selectedBank}
          onChange={(e) => setSelectedBank(e.target.value)}
        >
          <option value="">Select a bank</option>
          {filteredProfiles.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {profile.bankName}
            </option>
          ))}
        </select>
      </div>

      {/* CHECK FORM */}
      <div className="space-y-4 border p-4 rounded bg-gray-50">
        <h2 className="font-semibold text-lg">Check Details</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Payee</label>
          <input
            type="text"
            className="border rounded px-3 py-2 w-full"
            value={payee}
            onChange={(e) => setPayee(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="number"
            className="border rounded px-3 py-2 w-full"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Memo</label>
          <input
            type="text"
            className="border rounded px-3 py-2 w-full"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            className="border rounded px-3 py-2 w-full"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button
          onClick={createCheck}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Generating…" : "Generate Check Number"}
        </button>
      </div>

      {/* RESULT + PDF BUTTON */}
      {generatedCheckNumber && (
        <div className="p-4 border rounded bg-green-50 space-y-3">
          <div>
            <p className="font-semibold">Generated Check Number:</p>
            <p className="text-xl">{generatedCheckNumber}</p>
          </div>

          {selectedProfile && (
            <div className="text-sm text-gray-700">
              <p><strong>Bank:</strong> {selectedProfile.bankName}</p>
              <p><strong>Routing:</strong> {selectedProfile.routingNumber}</p>
              <p><strong>Account:</strong> {selectedProfile.accountNumber}</p>
            </div>
          )}

          <button
            onClick={downloadPdf}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Download PDF Check
          </button>
        </div>
      )}
    </div>
  );
}

)}

    </p>
  </div>
</div>

  // ---------------------------------------------------------
  // 2. DOWNLOAD PDF CHECK
  // ---------------------------------------------------------
  async function downloadPdf() {
    if (!generatedCheckNumber) return;

    const res = await fetch("/api/checks/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profile: selectedProfile,
        checkNumber: generatedCheckNumber,
        payee,
        amount: parseFloat(amount),
        memo,
        date
      })
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `check-${generatedCheckNumber}.pdf`;
    a.click();
  }

  return (
    <div className="space-y-8 p-6 max-w-2xl mx-auto">

      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search bank profiles..."
        className="border p-2 rounded w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* BANK DROPDOWN */}
      <div>
        <label className="block text-sm font-medium mb-1">Bank Profile</label>
        <select
          className="border rounded px-3 py-2 w-full"
          value={selectedBank}
          onChange={(e) => setSelectedBank(e.target.value)}
        >
          <option value="">Select a bank</option>
          {filteredProfiles.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {profile.bankName}
            </option>
          ))}
        </select>
      </div>

      {/* CHECK FORM */}
      <div className="space-y-4 border p-4 rounded bg-gray-50">
        <h2 className="font-semibold text-lg">Check Details</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Payee</label>
          <input
            type="text"
            className="border rounded px-3 py-2 w-full"
            value={payee}
            onChange={(e) => setPayee(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="number"
            className="border rounded px-3 py-2 w-full"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Memo</label>
          <input
            type="text"
            className="border rounded px-3 py-2 w-full"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            className="border rounded px-3 py-2 w-full"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button
          onClick={createCheck}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Generating…" : "Generate Check Number"}
        </button>
      </div>

      {/* RESULT + PDF BUTTON */}
      {generatedCheckNumber && (
        <div className="p-4 border rounded bg-green-50 space-y-3">
          <div>
            <p className="font-semibold">Generated Check Number:</p>
            <p className="text-xl">{generatedCheckNumber}</p>
          </div>

          {selectedProfile && (
            <div className="text-sm text-gray-700">
              <p><strong>Bank:</strong> {selectedProfile.bankName}</p>
              <p><strong>Routing:</strong> {selectedProfile.routingNumber}</p>
              <p><strong>Account:</strong> {selectedProfile.accountNumber}</p>
            </div>
          )}

          <button
            onClick={downloadPdf}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Download PDF Check
          </button>
        </div>
      )}
    </div>
  );
}
