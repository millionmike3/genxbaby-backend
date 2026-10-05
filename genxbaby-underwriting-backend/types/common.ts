// src/types/common.ts

// Event systems used across underwriting flows
export enum EventSystem {
  AppraisalService = "APPRAISAL_SERVICE",
  BlockchainAnchoring = "BLOCKCHAIN_ANCHORING",
  ClosingEngine = "CLOSING_ENGINE",
  InsuranceService = "INSURANCE_SERVICE",
  InvestorDeliveryEngine = "INVESTOR_DELIVERY_ENGINE",
  PricingEngine = "PRICING_ENGINE",
  RateLockEngine = "RATE_LOCK_ENGINE",
  UnderwritingEngine = "UNDERWRITING_ENGINE"
}

// Decision outcomes
export enum DecisionStatus {
  Approved = "APPROVED",
  Declined = "DECLINED",
  ManualReview = "MANUAL_REVIEW"
}

// Risk tiers
export enum RiskTier {
  Low = "LOW",
  Medium = "MEDIUM",
  High = "HIGH",
  Critical = "CRITICAL"
}

// Generic application interface
export interface Application {
  id: string;
  borrowerId: number;
  loanAmount: number;
  propertyValue?: number;
  ltv?: number | null; // loan-to-value ratio
  createdAt: Date;
}

// Borrower interface (import from borrower.types if you want to keep separate)
export interface Borrower {
  id: number;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  ssnLast4?: string;
  dob?: Date;
  address?: string;
  kycVerified?: boolean;
  annualIncome?: number | null;
  creditScore?: number | null;
  behaviorScore?: number | null;
  financialHealthScore?: number | null;
  employer?: string;
  createdAt: Date;
}

// Underwriting result interface
export interface UnderwritingResult {
  id: number;
  borrowerId: number;
  applicationId: string;
  loanAmount: number;
  approved: boolean;
  riskScore?: number;
  decisionNotes?: string;
  createdAt: Date;
}

// Notification payload
export interface NotificationMessage {
  caseId: string;
  decision: DecisionStatus;
  riskScore: number;
}

// Utility type for scoring
export interface RiskScores {
  behaviorScore: number;
  collateralScore: number;
  macroRiskScore: number;
  borrowerScore: number;
}
