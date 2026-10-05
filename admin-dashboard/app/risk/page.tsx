export default async function RiskPage() {
  const curve = await api("/investor-portal/risk-curve");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Portfolio Risk Curve</h1>
      <RiskCurveChart data={curve} />
    </div>
  );
}
