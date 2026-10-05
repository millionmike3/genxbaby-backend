export default function FinancialHealthCard({ health }) {
  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
      <h3 className="text-xl font-bold text-white mb-2">Financial Health</h3>

      <p className="text-gray-400">Liquidity: {health.liquidityScore}</p>
      <p className="text-gray-400">Cashflow: {health.cashFlowScore}</p>
      <p className="text-gray-400">Overdraft Risk: {health.overdraftRisk}</p>

      <p className="text-3xl font-bold text-[#3CF46B] mt-4">
        {health.financialHealthScore}
      </p>
    </div>
  );
}
