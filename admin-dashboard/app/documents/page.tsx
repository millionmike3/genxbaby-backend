export default async function DocumentsPage() {
  const docs = await api("/admin/documents");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Documents</h1>
      <DocumentsTable documents={docs} />
    </div>
  );
}
