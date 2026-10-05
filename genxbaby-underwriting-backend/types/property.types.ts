export interface PropertyInput {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;

  propertyType: "RESIDENTIAL" | "COMMERCIAL";
  yearBuilt?: number;

  loanAmount: number;
  estimatedValue: number;
}

export interface PropertySanitized {
  normalizedAddress: string;

  ltv: number;                 // Loan-to-Value %
  ltvRisk: "LOW" | "MEDIUM" | "HIGH";

  collateralScore: number;     // 0–100
  flags: string[];             // risk flags
  notes: string[];             // underwriting notes
}
