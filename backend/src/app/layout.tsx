export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <div className="flex min-h-screen">
          <aside className="w-64 bg-white border-r p-4">
            <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
            <nav className="space-y-2">
              <a href="/checks" className="block">Checks</a>
              <a href="/cases" className="block">Cases</a>
              <a href="/owners" className="block">Owners</a>
            </nav>
          </aside>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
