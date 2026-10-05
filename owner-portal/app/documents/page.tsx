import DocumentsTable from "@/components/documents/DocumentsTable";
import { api } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/login");

  const documents = await api(`/owner-portal/${session.ownerId}/documents`);

  return (
    <div className="ml-64 p-10">
      <h1 className="text-3xl font-bold text-white mb-6">Documents</h1>
      <DocumentsTable documents={documents} />
    </div>
  );
}
