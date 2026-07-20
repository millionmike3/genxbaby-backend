"use client";

import CheckPreview from "./CheckPreview";

export default function CheckPreviewCard({
  bank,
  signer,
  checkNumber,
  payee,
  amount,
  memo,
  date
}) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 900,
        margin: "0 auto",
        padding: 20,
        borderRadius: 12,
        background: "#ffffff",
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        border: "1px solid #e5e7eb"
      }}
    >
      <h2
        style={{
          fontSize: 20,
          fontWeight: 700,
          marginBottom: 20,
          color: "#1f2937"
        }}
      >
        Check Preview
      </h2>

      <CheckPreview
        bank={bank}
        signer={signer}
        checkNumber={checkNumber}
        payee={payee}
        amount={amount}
        memo={memo}
        date={date}
      />
    </div>
  );
}
