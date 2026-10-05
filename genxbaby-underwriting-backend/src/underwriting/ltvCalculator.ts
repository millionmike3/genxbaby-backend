export function calculateLTV(amount: number, propertyValue: number) {
  if (!propertyValue || propertyValue === 0) return 1; // worst case
  return amount / propertyValue;
}
