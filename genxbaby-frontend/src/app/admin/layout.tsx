export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 px-6 py-4 flex justify-between">
        <h1 className="text-xl font-semibold">GenxBaby Underwriting Console</h1>
        <span className="text-sm text-slate-400">Investor Demo</span>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
