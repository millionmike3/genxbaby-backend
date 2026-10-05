// src/types/mortgage.types.ts

import { Borrower } from "./borrower.types";
import { Application, UnderwritingResult } from "./common";

// Mortgage application intake (1003-style)
export interface MortgageApplication {
  id: string;
  borrowerId: number;
  borrower: Borrower;
  propertyId?: string;
  propertyAddress?: string;
  loanAmount: number;
  loanType: LoanType;
  termMonths: number;
  interestRate?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Loan types
export enum LoanType {
  Conventional = "CONVENTIONAL",
  FHA = "FHA",
  VA = "VA",
  USDA = "USDA",
  Jumbo = "JUMBO"
}

// Asset & liability capture
export interface Asset {
  id: string;
  borrowerId: number;
  type: string;
  value: number;
}

export interface Liability {
  id: string;
  borrowerId: number;
  type: string;
  balance: number;
  monthlyPayment?: number;
}

// Employment & income
export interface Employment {
  id: string;
  borrowerId: number;
  employerName: string;
  position: string;
  startDate: Date;
  annualIncome: number;
}

// Loan Estimate (LE)
export interface LoanEstimate {
  id: string;
  applicationId: string;
  interestRate: number;
  monthlyPayment: number;
  closingCosts: number;
  cashToClose: number;
  createdAt: Date;
}

// Closing Disclosure (CD)
export interface ClosingDisclosure {
  id: string;
  applicationId: string;
  apr: number;
  monthlyPayment: number;
  cashToClose: number;
  funded: boolean;
  fundedAt?: Date;
}

// Full loan package
export interface LoanPackage {
  application: MortgageApplication;
  assets: Asset[];
  liabilities: Liability[];
  employment: Employment[];
  underwriting: UnderwritingResult;
  loanEstimate: LoanEstimate;
  closingDisclosure: ClosingDisclosure;
}
