export function mapRiskTier(score: number) {
  if (score >= 900) return "A+";
  if (score >= 800) return "A";
  if (score >= 700) return "B";
  if (score >= 600) return "C";
  if (score >= 500) return "D";
  return "HIGH_RISK";
}
