import { api } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page({ params }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const data = await api(`/owner-portal/document/${params.docId}`);

  return (
    <div className="ml-64 p-10 space-y-10">
      <h1 className="text-3xl font-bold text-white">Document Details</h1>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
        <h2 className="text-xl font-semibold text-white mb-2">
          {data.document.fileName}
        </h2>
        <p className="text-gray-400">Status: {data.document.status}</p>
      </div>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
        <h3 className="text-xl font-bold text-white mb-4">OCR Extraction</h3>
        <pre className="text-gray-300 whitespace-pre-wrap">
          {data.ocr.map((o) => o.text).join("\n")}
        </pre>
      </div>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
        <h3 className="text-xl font-bold text-white mb-4">Fraud Analysis</h3>
        <ul className="text-gray-300 list-disc pl-6">
          {data.fraud[0]?.issues?.map((issue, idx) => (
            <li key={idx}>{issue}</li>
          )) || <li>No fraud issues detected</li>}
        </ul>
      </div>
    </div>
  );
}
