"use client";

import { useEffect, useState } from "react";
import CheckPreviewCard from "@/components/CheckPreviewCard";

export default function CreateCheckPage() {
  const [bankProfiles, setBankProfiles] = useState([]);
  const [signers, setSigners] = useState([]);
  const [selectedBankProfile, setSelectedBankProfile] = useState("");
  const [selectedSigner, setSelectedSigner] = useState(null);
  const [autoCheckNumber, setAutoCheckNumber] = useState("");
  const [bankPreview, setBankPreview] = useState(null);
  const [payee, setPayee] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [dateValue, setDateValue] = useState("");

  // Load bank profiles on mount
  useEffect(() => {
    fetch("/api/bank-profiles/list")
      .then((res) => res.json())
      .then((data) => setBankProfiles(data));
  }, []);

  // Load signers when bank profile changes
  useEffect(() => {
    if (!selectedBankProfile) return;

    fetch(`/api/signers/by-bank/${selectedBankProfile}`)
      .then((res) => res.json())
      .then((data) => setSigners(data));
  }, [selectedBankProfile]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Create Check</h1>

      <div className="flex gap-6">
        {/* LEFT SIDE — FORM */}
        <div className="flex-1">
          <form action="/api/checks/create" method="POST" className="space-y-4">

            {/* BANK PROFILE */}
            <div>
              <label className="block font-medium">Bank Profile</label>
              <select
                name="bankProfileId"
                className="border p-2 rounded w-full"
                required
                onChange={async (e) => {
                  const bankId = e.target.value;
                  setSelectedBankProfile(bankId);
                  setSelectedSigner(null);
                  setBankPreview(null);

                  if (bankId) {
                    // Load next check number
                    const nextCheckRes = await fetch(`/api/bank-profiles/next-check/${bankId}`);
                    const nextCheckData = await nextCheckRes.json();
                    setAutoCheckNumber(nextCheckData.nextCheckNumber);

                    // Load bank preview
                    const previewRes = await fetch(`/api/bank-profiles/details/${bankId}`);
                    const previewData = await previewRes.json();
                    setBankPreview(previewData);
                  }
                }}
              >
                <option value="">Select Bank Profile</option>
                {bankProfiles.map((bp) => (
                  <option key={bp.id} value={bp.id}>
                    {bp.bankName}
                  </option>
                ))}
              </select>
            </div>

            {/* SIGNER */}
            <div>
              <label className="block font-medium">Signer</label>

              {selectedSigner && (
                <div className="mb-2">
                  <img
                    src={selectedSigner.signatureImage}
                    alt="Signature Preview"
                    className="h-16 object-contain border p-2 bg-white"
                  />
                </div>
              )}

              <select
                name="signerId"
                className="border p-2 rounded w-full"
                required
                onChange={(e) => {
                  const signer = signers.find((s) => s.id === e.target.value);
                  setSelectedSigner(signer || null);
                }}
              >
                <option value="">Select Signer</option>
                {signers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.title ? `(${s.title})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* CHECK NUMBER */}
            <div>
              <label className="block font-medium">Check Number</label>
              <input
                name="checkNumber"
                type="number"
                className="border p-2 rounded w-full"
                required
                value={autoCheckNumber}
                onChange={(e) => setAutoCheckNumber(e.target.value)}
              />
            </div>

            {/* PAYEE */}
            <div>
              <label className="block font-medium">Payee</label>
              <input
                name="payee"
                className="border p-2 rounded w-full"
                required
                value={payee}
                onChange={(e) => setPayee(e.target.value)}
              />
            </div>

            {/* AMOUNT */}
            <div>
              <label className="block font-medium">Amount</label>
              <input
                name="amount"
                type="number"
                step="0.01"
                className="border p-2 rounded w-full"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* MEMO */}
            <div>
              <label className="block font-medium">Memo</label>
              <input
                name="memo"
                className="border p-2 rounded w-full"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </div>

            {/* DATE */}
            <div>
              <label className="block font-medium">Date</label>
              <input
                name="date"
                type="date"
                className="border p-2 rounded w-full"
                required
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
              />
            </div>

            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              Create Check
            </button>
          </form>
        </div>

        {/* RIGHT SIDE — CHECK PREVIEW */}
        <div className="w-[900px]">
          <CheckPreviewCard
            bank={bankPreview}
            signer={selectedSigner}
            checkNumber={autoCheckNumber}
            payee={payee}
            amount={parseFloat(amount || 0)}
            memo={memo}
            date={dateValue}
          />
        </div>
      </div>
    </div>
  );
}
