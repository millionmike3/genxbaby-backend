export default function DocumentsTable({ documents }) {
  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4">Documents</h3>

      <table className="w-full text-left text-gray-300">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="py-2">File Name</th>
            <th>Status</th>
            <th>Uploaded</th>
          </tr>
        </thead>

        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="border-b border-gray-800">
              <td className="py-3">{doc.fileName}</td>
              <td>
                <span className="px-3 py-1 rounded bg-gray-800 text-white">
                  {doc.status}
                </span>
              </td>
              <td>{new Date(doc.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
