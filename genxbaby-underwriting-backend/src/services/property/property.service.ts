import { PrismaClient } from "@prisma/client";
import { PropertyInput, PropertySanitized } from "./property.types";

const prisma = new PrismaClient();

/**
 * Property CRUD Service
 */
export const propertyService = {
  async create(data: any) {
    return prisma.property.create({ data });
  },

  async list() {
    return prisma.property.findMany({
      orderBy: { createdAt: "desc" }
    });
  },

  async get(id: number) {
    return prisma.property.findUnique({
      where: { id }
    });
  }
};

/**
 * Utility Functions
 */
const clamp = (value: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, value));

const normalizeAddress = (input: PropertyInput) => {
  return `${input.address.trim()}, ${input.city.trim()}, ${input.state.trim()} ${input.postalCode.trim()}, ${input.country.trim()}`;
};

const calculateLtv = (loanAmount: number, estimatedValue: number) => {
  if (!estimatedValue || estimatedValue <= 0) return 100;
  return (loanAmount / estimatedValue) * 100;
};

const classifyLtvRisk = (ltv: number): "LOW" | "MEDIUM" | "HIGH" => {
  if (ltv <= 70) return "LOW";
  if (ltv <= 85) return "MEDIUM";
  return "HIGH";
};

const scoreCollateral = (input: PropertyInput, ltv: number) => {
  let baseScore = 80;
  let flags: string[] = [];

  if (input.propertyType === "COMMERCIAL") {
    baseScore -= 10;
    flags.push("COMMERCIAL_PROPERTY");
  }

  if (ltv > 85) {
    baseScore -= 20;
    flags.push("HIGH_LTV");
  } else if (ltv > 70) {
    baseScore -= 10;
    flags.push("MEDIUM_LTV");
  }

  if (input.yearBuilt && input.yearBuilt < 1970) {
    baseScore -= 10;
    flags.push("OLD_CONSTRUCTION");
  }

  return { collateralScore: clamp(baseScore), flags };
};

/**
 * Property Sanitization / Underwriting Prep
 */
export const sanitizeProperty = async (
  input: PropertyInput
): Promise<PropertySanitized> => {
  const normalizedAddress = normalizeAddress(input);
  const ltv = calculateLtv(input.loanAmount, input.estimatedValue);
  const ltvRisk = classifyLtvRisk(ltv);
  const { collateralScore, flags } = scoreCollateral(input, ltv);

  const notes: string[] = [];

  if (ltvRisk === "HIGH") {
    notes.push("High LTV; collateral risk elevated.");
  } else if (ltvRisk === "MEDIUM") {
    notes.push("Moderate LTV; collateral risk acceptable with conditions.");
  } else {
    notes.push("Low LTV; collateral risk appears favorable.");
  }

  if (flags.includes("COMMERCIAL_PROPERTY")) {
    notes.push("Commercial property may require additional underwriting criteria.");
  }

  if (flags.includes("OLD_CONSTRUCTION")) {
    notes.push("Older construction; consider inspection or additional documentation.");
  }

  return {
    normalizedAddress,
    ltv,
    collateralScore,
    ltvRisk,
    flags,
    notes
  };
};
