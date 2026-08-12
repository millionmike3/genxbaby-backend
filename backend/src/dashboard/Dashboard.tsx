import { useEffect, useState } from "react";

import AlertCenter from "./alerts/AlertCenter";
import FraudHeatmap from "./heatmap/FraudHeatmap";
import FraudClusterMap from "./clusters/FraudClusterMap";
import RiskTrendPanel from "./risk/RiskTrendPanel";
import CheckAiPanel from "./checks/CheckAiPanel";
import DocumentAiPanel from "./documents/DocumentAiPanel";
import RiskProfileCard from "./risk/RiskProfileCard";
import FraudTimeline from "./timeline/FraudTimeline";
import OwnerIntelligenceReport from "./report/OwnerIntelligenceReport";
import FraudNetworkGraph from "./network/FraudNetworkGraph";
import FraudInvestigatorChat from "./investigator/FraudInvestigatorChat";

export default function Dashboard({ apiUrl, user }) {
  const ownerId = user.ownerId;

  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch(`${apiUrl}/dashboard/summary`)
      .then((r) => r.json())
      .then((data) => setSummary(data));
  }, []);

  if (!summary) {
    return (
      <div className="p-6 text-gray-600">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* ======= SUMMARY CARDS ======= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border rounded shadow p-4">
          <h3 className="text-sm font-semibold text-gray-600">Total Checks</h3>
          <p className="text-2xl font-bold">{summary.totalChecks}</p>
        </div>

        <div className="bg-white border rounded shadow p-4">
          <h3 className="text-sm font-semibold text-gray-600">Flagged Checks</h3>
          <p className="text-2xl font-bold text-red-600">{summary.flaggedChecks}</p>
        </div>

        <div className="bg-white border rounded shadow p-4">
          <h3 className="text-sm font-semibold text-gray-600">Documents</h3>
          <p className="text-2xl font-bold">{summary.totalDocuments}</p>
        </div>

        <div className="bg-white border rounded shadow p-4">
          <h3 className="text-sm font-semibold text-gray-600">Owner Risk</h3>
          <p className="text-xl font-bold">{summary.ownerRisk.riskLevel}</p>
        </div>
      </div>

      {/* ======= RISK PROFILE + TREND ======= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RiskProfileCard apiUrl={apiUrl} />
        <RiskTrendPanel apiUrl={apiUrl} />
      </div>

      {/* ======= ALERT CENTER + HEATMAP ======= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AlertCenter apiUrl={apiUrl} ownerId={ownerId} />
        <FraudHeatmap apiUrl={apiUrl} />
      </div>

      {/* ======= FRAUD CLUSTER MAP + TIMELINE ======= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FraudClusterMap apiUrl={apiUrl} />
        <FraudTimeline apiUrl={apiUrl} />
      </div>

      {/* ======= NETWORK GRAPH + INTELLIGENCE REPORT ======= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FraudNetworkGraph apiUrl={apiUrl} />
        <OwnerIntelligenceReport apiUrl={apiUrl} />
      </div>

      {/* ======= AI INSIGHTS ======= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CheckAiPanel apiUrl={apiUrl} ownerId={ownerId} />
        <DocumentAiPanel apiUrl={apiUrl} ownerId={ownerId} />
      </div>

      {/* ======= AI FRAUD INVESTIGATOR CHAT ======= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FraudInvestigatorChat apiUrl={apiUrl} />
      </div>

    </div>
  );
}
