// src/types/underwriting.types.ts

import { Borrower } from "./borrower.types";
import { Application, RiskScores, DecisionStatus, RiskTier } from "./common";

// Core underwriting input payload
export interface UnderwritingInputs {
  application: Application;
  borrower: Borrower;
  property?: PropertyData;
  behavior?: BehaviorData;
  stock?: StockData;
}

// Property data
export interface PropertyData {
  id: string;
  address: string;
  value: number;
  type?: string;
  appraisalValue?: number;
}

// Behavior data
export interface BehaviorData {
  score: number;
  signals?: string[];
}

// Stock / collateral data
export interface StockData {
  symbol: string;
  price: number;
  volatility?: number;
}

// Fraud signals
export interface FraudSignal {
  type: string;
  description: string;
  severity: RiskTier;
}

// Underwriting scoring breakdown
export interface UnderwritingScores extends RiskScores {
  overallScore: number;
  fraudSignals?: FraudSignal[];
}

// Decision outcome
export interface UnderwritingDecision {
  status: DecisionStatus;
  riskTier: RiskTier;
  notes?: string;
}

// Full underwriting result
export interface UnderwritingResult {
  id: number;
  borrowerId: number;
  applicationId: string;
  loanAmount: number;
  approved: boolean;
  riskScore?: number;
  decisionNotes?: string;
  fraudSignals?: FraudSignal[];
  createdAt: Date;
}
