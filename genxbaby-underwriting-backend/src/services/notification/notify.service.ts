export function buildNotificationMessage({ caseId, decision, riskScore }) {
  return `Case ${caseId} decision: ${decision} (Risk Score: ${riskScore})`;
}
