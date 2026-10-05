export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <Sidebar />
        <main className="ml-64 p-6">{children}</main>
      </body>
    </html>
  );
}
