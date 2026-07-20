import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-64 w-full">
        <TopNav />
        <div className="pt-20 p-6">{children}</div>
      </div>
    </div>
  );
}
