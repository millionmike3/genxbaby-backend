import "../styles/globals.css";
import Sidebar from "@/components/sidebar/Sidebar";
import TopNav from "@/components/navigation/TopNav";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import { ToastProvider } from "@/components/toast/ToastProvider";

export const metadata = {
  title: "Owner Portal | GenXBaby",
  description: "Owner Portal for underwriting, financial health, documents, and checks.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0d0d0d] dark:bg-black text-gray-200 min-h-screen flex">
        <ToastProvider>
          <Sidebar />

          <div className="flex-1 ml-64 flex flex-col">
            <TopNav />

            <main className="p-10">
              <Breadcrumb />
              {children}
            </main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
