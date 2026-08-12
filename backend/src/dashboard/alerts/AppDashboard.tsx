import { useState } from "react";
import Sidebar from "./layout/Sidebar";
import OwnersPage from "./owners/OwnersPage";
import AlertsPanel from "./alerts/AlertsPanel";

export default function AppDashboard({ apiUrl }) {
  const [page, setPage] = useState("owners");

  return (
    <div className="flex">
      <Sidebar onNavigate={setPage} />

      <div className="flex-1 bg-[#0B0B0F] text-gray-200">
        {page === "owners" && <OwnersPage apiUrl={apiUrl} />}
        {page === "alerts" && <GlobalAlertsPanel apiUrl={apiUrl} />}

      </div>
    </div>
  );
}
