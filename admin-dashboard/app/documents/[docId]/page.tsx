export default async function DocumentDetail({ params }) {
  const data = await api(`/admin/document/${params.docId}`);

  return (
    <div className="space-y-6">
      <DocumentHeader document={data.document} />
      <OcrViewer text={data.ocr.map(o => o.text).join("\n")} />
      <FraudIssues issues={data.fraud[0]?.issues || []} />
    </div>
  );
}
