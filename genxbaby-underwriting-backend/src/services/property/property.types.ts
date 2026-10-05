export type PropertyInput = {
  applicationId: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  propertyType: "SFR" | "MULTI" | "CONDO" | "COMMERCIAL";
  estimatedValue: number;
  loanAmount: number;
  units?: number;
  yearBuilt?: number;
};

export type PropertySanitized = {
  normalizedAddress: string;
  ltv: number;
  collateralScore: number;   // 0–100
  ltvRisk: "LOW" | "MEDIUM" | "HIGH";
  flags: string[];
  notes: string[];
};
