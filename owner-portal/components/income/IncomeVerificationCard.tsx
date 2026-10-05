export default function IncomeVerificationCard({ income }) {
  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
      <h3 className="text-xl font-bold text-white mb-2">Income Verification</h3>

      <p className="text-gray-400">Gross Monthly: ${income.grossMonthlyIncome}</p>
      <p className="text-gray-400">Net Monthly: ${income.netMonthlyIncome}</p>
      <p className="text-gray-400">Employer Match: {income.employerMatch}%</p>
      <p className="text-gray-400">Bank Match: {income.bankMatch}%</p>

      <p className="text-3xl font-bold text-blue-400 mt-4">
        {income.incomeVerificationScore}
      </p>
    </div>
  );
}
