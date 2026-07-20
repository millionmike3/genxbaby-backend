export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
      <div className="p-6 border border-red-700 bg-red-900/40 rounded-xl">
        <h1 className="text-xl font-semibold mb-2">Access Denied</h1>
        <p className="text-sm text-red-200">
          You do not have permission to view this page.
        </p>
      </div>
    </main>
  );
}
