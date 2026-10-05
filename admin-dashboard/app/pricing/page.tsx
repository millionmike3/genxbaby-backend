export default async function PricingPage() {
  const curve = await api("/investor-portal/yield-curve");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Portfolio Yield Curve</h1>
      <YieldCurveChart data={curve} />
    </div>
  );
}
