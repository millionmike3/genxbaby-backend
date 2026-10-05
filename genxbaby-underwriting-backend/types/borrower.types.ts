// src/types/borrower.types.ts

export interface Borrower {
  id: number;                        // Primary key
  firstName: string;
  lastName: string;
  fullName?: string;                  // Optional convenience field
  email: string;

  // Identity & KYC
  ssnLast4?: string;
  dob?: Date;
  address?: string;
  kycVerified?: boolean;

  // Financial metrics
  annualIncome?: number | null;
  creditScore?: number | null;
  behaviorScore?: number | null;
  financialHealthScore?: number | null;

  // Employment
  employer?: string;

  // Metadata
  createdAt: Date;
}
