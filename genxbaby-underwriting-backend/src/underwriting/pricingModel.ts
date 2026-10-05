// src/underwriting/pricingModel.ts

/**
 * Returns the pricing adjustment (margin) for a given risk tier.
 */
export function pricingForTier(tier: string): number {
  const pricing: Record<string, number> = {
    "A+": 0.05,
    A: 0.06,
    B: 0.07,
    C: 0.08,
    D: 0.09,
    HIGH_RISK: 0.12
  };

  return pricing[tier as keyof typeof pricing];
}
