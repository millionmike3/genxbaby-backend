"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function BorrowerPage() {
  const router = useRouter();

  const [applications, setApplications] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Protect route — only borrowers or admin can access
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) router.push("/login");
    if (role !== "borrower" && role !== "admin") router.push("/dashboard");
  }, []);

  // Load borrower dashboard data
  useEffect(() => {
    async function loadData() {
      try {
        const apps = await api("/borrower/applications");
        const docs = await api("/borrower/documents");
        const pays = await api("/borrower/payments");
        const prof = await api("/borrower/profile");

        setApplications(apps);
        setDocuments(docs);
        setPayments(pays);
        setProfile(prof);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading borrower dashboard…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">

      <h1 className="text-3xl font-bold">Borrower Dashboard</h1>

      {/* PROFILE + XP */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Your Profile</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Name</div>
            <div className="text-xl font-bold">{profile?.name}</div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Credit Score</div>
            <div className="text-xl font-bold text-blue-600">
              {profile?.credit_score}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">XP</div>
            <div className="text-xl font-bold text-green-600">
              {profile?.xp}
            </div>
          </div>

        </div>
      </div>

      {/* LOAN APPLICATIONS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Your Loan Applications</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Property</th>
              <th className="py-2">Loan Amount</th>
              <th className="py-2">Status</th>
              <th className="py-2">Submitted</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((app, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-2">{app.property_address}</td>
                <td className="py-2">${app.loan_amount}</td>
                <td className="py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      app.status === "approved"
                        ? "bg-green-600"
                        : app.status === "pending"
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="py-2">{app.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DOCUMENTS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Required Documents</h2>

        <ul className="space-y-2">
          {documents.map((doc, idx) => (
            <li key={idx} className="border-b pb-2 flex justify-between">
              <div>
                <div className="font-medium">{doc.name}</div>
                <div className="text-sm text-gray-500">{doc.status}</div>
              </div>

              <button
                onClick={() => alert("Upload coming soon")}
                className="bg-black text-white px-3 py-1 rounded-lg"
              >
                Upload
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* PAYMENT SCHEDULE */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Payment Schedule</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Amount</th>
              <th className="py-2">Due Date</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((p, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-2">${p.amount}</td>
                <td className="py-2">{p.due_date}</td>
                <td className="py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      p.status === "paid"
                        ? "bg-green-600"
                        : p.status === "due"
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
