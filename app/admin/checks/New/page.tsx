"use client";

import { useState } from "react";

export default function NewCheckPage() {
  const [form, setForm] = useState({
    bankName: "Resilient America Inc.",
    bankAddress: "123 Liberty Avenue, Queens, NY 11419",
    payee: "",
    amount: "",
    amountWritten: "",
    memo: "",
    date: "",
    checkNumber: "",
    routingNumber: "",
    accountNumber: "",
  });

  async function submit() {
    const res = await fetch("/api/admin/checks/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Check created.");
    } else {
      alert("Failed to create check.");
    }
  }

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Create New Check</h1>
      {Object.keys(form).map((key) => (
        <div key={key} className="mb-3">
          <label className="block text-sm font-medium mb-1">
            {key}
          </label>
          <input
            className="w-full border rounded px-3 py-2"
            value={(form as any)[key]}
            onChange={(e) =>
              setForm({ ...form, [key]: e.target.value })
            }
          />
        </div>
      ))}
      <button
        onClick={submit}
        className="mt-4 px-4 py-2 bg-blue-700 text-white rounded"
      >
        Create Check
      </button>
    </div>
  );
}
