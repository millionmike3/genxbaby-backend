"use client";

import { useState, useMemo } from "react";
import CheckThumbnail from "./CheckThumbnail";

export default function CheckHistoryClient({ checks }) {
  const [selectedChecks, setSelectedChecks] = useState([]);
  const [selectedCheck, setSelectedCheck] = useState(null);

  function openModal(check) {
    setSelectedCheck(check);
  }

  function closeModal() {
    setSelectedCheck(null);
  }

  // SEARCH + FILTER STATES
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fraudOnly, setFraudOnly] = useState(false);
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  function toggleCheckSelection(id, checked) {
    setSelectedChecks((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    );
  }

  // BATCH ACTIONS
  async function printBatch() {
    const res = await fetch("/api/checks/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkIds: selectedChecks }),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }

  async function voidBatch() {
    await fetch("/api/checks/batch-void", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkIds: selectedChecks }),
    });

    window.location.reload();
  }

  async function reissueBatch() {
    await fetch("/api/checks/batch-reissue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkIds: selectedChecks }),
    });

    window.location.reload();
  }

  async function exportCsvBatch() {
    const res = await fetch("/api/checks/batch-csv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkIds: selectedChecks }),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "checks_export.csv";
    a.click();
  }

  async function emailPdfBatch() {
    const email = prompt("Enter email address to send PDF:");
    if (!email) return;

    await fetch("/api/checks/batch-email-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkIds: selectedChecks, email }),
    });

    alert("Batch PDF emailed successfully.");
  }

  async function emailCsvBatch() {
    const email = prompt("Enter email address to send CSV:");
    if (!email) return;

    await fetch("/api/checks/batch-email-csv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkIds: selectedChecks, email }),
    });

    alert("Batch CSV emailed successfully.");
  }

  // FILTER LOGIC
  const filteredChecks = useMemo(() => {
    return checks.filter((check) => {
      const matchesSearch =
        search === "" ||
        check.payee.toLowerCase().includes(search.toLowerCase()) ||
        check.memo?.toLowerCase().includes(search.toLowerCase()) ||
        check.signer?.name.toLowerCase().includes(search.toLowerCase()) ||
        check.bankProfile.bankName.toLowerCase().includes(search.toLowerCase()) ||
        check.checkNumber.toString().includes(search);

      const matchesStatus =
        statusFilter === "all" || check.status === statusFilter;

      const matchesFraud = !fraudOnly || check.fraudFlags.length > 0;

      const matchesMinAmount =
        minAmount === "" || check.amount >= Number(minAmount);

      const matchesMaxAmount =
        maxAmount === "" || check.amount <= Number(maxAmount);

      const matchesStartDate =
        startDate === "" || new Date(check.date) >= new Date(startDate);

      const matchesEndDate =
        endDate === "" || new Date(check.date) <= new Date(endDate);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesFraud &&
        matchesMinAmount &&
        matchesMaxAmount &&
        matchesStartDate &&
        matchesEndDate
      );
    });
  }, [
    checks,
    search,
    statusFilter,
    fraudOnly,
    minAmount,
    maxAmount,
    startDate,
    endDate,
  ]);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Check History</h1>

      {/* SEARCH + FILTERS */}
      <div className="bg-white p-4 rounded shadow space-y-4">
        <input
          type="text"
          placeholder="Search payee, memo, signer, bank, check number..."
          className="w-full border rounded px-3 py-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <select
            className="border rounded px-3 py-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="valid">Valid</option>
            <option value="voided">Voided</option>
            <option value="reissued">Reissued</option>
          </select>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={fraudOnly}
              onChange={(e) => setFraudOnly(e.target.checked)}
            />
            Fraud Only
          </label>

          <input
            type="number"
            placeholder="Min Amount"
            className="border rounded px-3 py-2"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
          />

          <input
            type="number"
            placeholder="Max Amount"
            className="border rounded px-3 py-2"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            className="border rounded px-3 py-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <input
            type="date"
            className="border rounded px-3 py-2"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* BATCH ACTION BUTTONS */}
      <div className="flex flex-wrap gap-3">
        <button
          className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
          onClick={printBatch}
          disabled={selectedChecks.length === 0}
        >
          Print Selected
        </button>

        <button
          className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
          onClick={voidBatch}
          disabled={selectedChecks.length === 0}
        >
          Void Selected
        </button>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          onClick={reissueBatch}
          disabled={selectedChecks.length === 0}
        >
          Reissue Selected
        </button>

        <button
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          onClick={exportCsvBatch}
          disabled={selectedChecks.length === 0}
        >
          Export CSV
        </button>

        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
          onClick={emailPdfBatch}
          disabled={selectedChecks.length === 0}
        >
          Email PDF
        </button>

        <button
          className="px-4 py-2 bg-teal-600 text-white rounded disabled:opacity-50"
          onClick={emailCsvBatch}
          disabled={selectedChecks.length === 0}
        >
          Email CSV
        </button>
      </div>

      {/* CHECK LIST */}
      {filteredChecks.length === 0 && (
        <p className="text-gray-600">No checks match your filters.</p>
      )}

      {filteredChecks.map((check) => (
        <div
          key={check.id}
          className="border p-4 rounded bg-gray-50 space-y-2 shadow-sm"
        >
          {/* THUMBNAIL PREVIEW */}
          <div className="flex justify-center mb-3">
            <CheckThumbnail check={check} />
          </div>

          <div className="flex justify-between items-center">
            <p className="font-semibold text-lg">
              Check #{check.checkNumber}
            </p>

            <input
              type="checkbox"
              value={check.id}
              onChange={(e) =>
                toggleCheckSelection(check.id, e.target.checked)
              }
            />
          </div>

          <span
            className={`px-3 py-1 rounded text-sm font-semibold ${
              check.status === "valid"
                ? "bg-green-200 text-green-800"
                : check.status === "voided"
                ? "bg-red-200 text-red-800"
                : "bg-yellow-200 text-yellow-800"
            }`}
          >
            {check.status.toUpperCase()}
          </span>

          <p><strong>Payee:</strong> {check.payee}</p>
          <p><strong>Amount:</strong> ${check.amount.toFixed(2)}</p>
          <p><strong>Date:</strong> {check.date}</p>
          {check.memo && <p><strong>Memo:</strong> {check.memo}</p>}

          <p>
            <strong>Signer:</strong> {check.signer?.name} ({check.signer?.title})
          </p>

          <hr className="my-2" />

          <p><strong>Bank:</strong> {check.bankProfile.bankName}</p>
          <p><strong>Routing:</strong> {check.bankProfile.routingNumber}</p>
          <p><strong>Account:</strong> {check.bankProfile.accountNumber}</p>

          <p className="text-xs text-gray-500">
            Created: {new Date(check.createdAt).toLocaleString()}
          </p>

          {check.fraudFlags.length > 0 && (
            <div className="mt-2 space-y-1">
              {check.fraudFlags.map((flag) => (
                <p
                  key={flag.id}
                  className={`text-sm ${
                    flag.severity === "critical"
                      ? "text-red-700"
                      : flag.severity === "warning"
                      ? "text-yellow-700"
                      : "text-gray-600"
                  }`}
                >
                  ⚠️ {flag.message}
                </p>
              ))}
            </div>
          )}

          <div className="flex gap-4 mt-3">
            <button
              className="text-blue-700 underline"
              onClick={() => openModal(check)}
            >
              View Details
            </button>

            {check.status === "valid" && (
              <>
                <form action="/api/checks/void" method="POST">
                  <input type="hidden" name="checkId" value={check.id} />
                  <button className="text-red-600 underline">Void</button>
                </form>

                <form action="/api/checks/reissue" method="POST">
                  <input type="hidden" name="checkId" value={check.id} />
                  <button className="text-blue-600 underline">Reissue</button>
                </form>
              </>
            )}

            <a
              href={`/checks/verify/${check.checkNumber}`}
              className="text-green-700 underline"
            >
              Verify
            </a>
          </div>
        </div>
      ))}

      {/* CHECK DETAIL MODAL */}
      {selectedCheck && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full space-y-4">
            <h2 className="text-2xl font-bold">
              Check #{selectedCheck.checkNumber}
            </h2>

            <p><strong>Payee:</strong> {selectedCheck.payee}</p>
            <p><strong>Amount:</strong> ${selectedCheck.amount.toFixed(2)}</p>
            <p><strong>Date:</strong> {selectedCheck.date}</p>
            {selectedCheck.memo && (
              <p><strong>Memo:</strong> {selectedCheck.memo}</p>
            )}

            <p>
              <strong>Signer:</strong> {selectedCheck.signer?.name} (
              {selectedCheck.signer?.title})
            </p>

            <hr />

            <p><strong>Bank:</strong> {selectedCheck.bankProfile.bankName}</p>
            <p><strong>Routing:</strong> {selectedCheck.bankProfile.routingNumber}</p>
            <p><strong>Account:</strong> {selectedCheck.bankProfile.accountNumber}</p>

            <p className="text-xs text-gray-500">
              Created: {new Date(selectedCheck.createdAt).toLocaleString()}
            </p>

            {selectedCheck.fraudFlags.length > 0 && (
              <div className="mt-2 space-y-1">
                {selectedCheck.fraudFlags.map((flag) => (
                  <p
                    key={flag.id}
                    className={`text-sm ${
                      flag.severity === "critical"
                        ? "text-red-700"
                        : flag.severity === "warning"
                        ? "text-yellow-700"
                        : "text-gray-600"
                    }`}
                  >
                    ⚠️ {flag.message}
                  </p>
                ))}
              </div>
            )}

            <button
              className="mt-4 px-4 py-2 bg-gray-700 text-white rounded"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
