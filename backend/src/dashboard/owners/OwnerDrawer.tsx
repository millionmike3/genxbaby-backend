import FraudDashboard from "../fraud/FraudDashboard";
import SyntheticPanel from "../synthetic/SyntheticPanel";
import UnderwritingPanel from "../underwriting/UnderwritingPanel";
import CasePanel from "../cases/CasePanel";

export default function OwnerDrawer({ ownerId, apiUrl, onClose }) {
  return (
    <div className="fixed right-0 top-0 w-[600px] h-full bg-[#1A1A22] border-l border-gray-700 p-6 overflow-y-auto">
      <button className="gx-btn-secondary mb-4" onClick={onClose}>
        Close
      </button>

      <FraudDashboard ownerId={ownerId} apiUrl={apiUrl} />
      <SyntheticPanel ownerId={ownerId} apiUrl={apiUrl} />
      <UnderwritingPanel ownerId={ownerId} apiUrl={apiUrl} />
      <CasePanel ownerId={ownerId} apiUrl={apiUrl} />
      <AlertsPanel apiUrl={apiUrl} ownerId={ownerId} />

    </div>

  );
}
