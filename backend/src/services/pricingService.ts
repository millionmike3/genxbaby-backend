import { computePriceWithLlpa } from "gx_pricing_engine/src/services/pricingEngine";

export async function priceScenario(input: PricingInput) {
  const result = await computePriceWithLlpa(input);

  return {
    rate: result.finalRateBps / 10000, // convert bps to rate
    components: result.components,
  };
}
