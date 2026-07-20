"use client";

import QRCode from "react-qr-code";

export default function CheckQR({ checkNumber }) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${checkNumber}`;

  return (
    <div className="p-4 bg-white border rounded inline-block">
      <QRCode value={url} size={128} />
      <p className="text-xs text-center mt-2">{url}</p>
    </div>
  );
}
