"use client";

export default function CheckThumbnail({ check }) {
  return (
    <div className="border rounded bg-white shadow-sm p-3 w-48 text-xs">
      <p className="font-bold text-sm">{check.bankProfile.bankName}</p>

      <div className="flex justify-between text-gray-700 mt-1">
        <span>Routing:</span>
        <span>{check.bankProfile.routingNumber}</span>
      </div>

      <div className="flex justify-between text-gray-700">
        <span>Account:</span>
        <span>{check.bankProfile.accountNumber}</span>
      </div>

      <hr className="my-2" />

      <p>
        <strong>Payee:</strong> {check.payee}
      </p>

      <p>
        <strong>Amount:</strong> ${check.amount.toFixed(2)}
      </p>

      <p>
        <strong>Date:</strong> {check.date}
      </p>

      <p className="font-mono text-xs mt-2">
        MICR: {check.bankProfile.routingNumber} • {check.bankProfile.accountNumber} • {check.checkNumber}
      </p>
    </div>
  );
}

