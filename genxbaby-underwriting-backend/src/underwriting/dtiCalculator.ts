export function calculateDTI(monthlyDebt: number, monthlyIncome: number) {
  if (!monthlyIncome || monthlyIncome === 0) return 1; // worst case
  return monthlyDebt / monthlyIncome;
}
