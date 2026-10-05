"use client";

import { useEffect, useRef } from "react";
import ModernCashiersCheck from "./ModernCashiersCheck";

export default function PrintCheckModal({ check, onClose }) {
  const printRef = useRef(null);

  useEffect(() => {
    if (printRef.current) {
      setTimeout(() => {
        window.print();
      }, 300);
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        ref={printRef}
        className="bg-white p-6 rounded shadow-xl max-w-4xl w-full"
      >
        <ModernCashiersCheck check={check} />

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
