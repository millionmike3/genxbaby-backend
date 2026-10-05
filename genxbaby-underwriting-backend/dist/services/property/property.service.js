"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeProperty = exports.propertyService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Property CRUD Service
 */
exports.propertyService = {
    async create(data) {
        return prisma.property.create({ data });
    },
    async list() {
        return prisma.property.findMany({
            orderBy: { createdAt: "desc" }
        });
    },
    async get(id) {
        return prisma.property.findUnique({
            where: { id }
        });
    }
};
/**
 * Utility Functions
 */
const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));
const normalizeAddress = (input) => {
    return `${input.address.trim()}, ${input.city.trim()}, ${input.state.trim()} ${input.postalCode.trim()}, ${input.country.trim()}`;
};
const calculateLtv = (loanAmount, estimatedValue) => {
    if (!estimatedValue || estimatedValue <= 0)
        return 100;
    return (loanAmount / estimatedValue) * 100;
};
const classifyLtvRisk = (ltv) => {
    if (ltv <= 70)
        return "LOW";
    if (ltv <= 85)
        return "MEDIUM";
    return "HIGH";
};
const scoreCollateral = (input, ltv) => {
    let baseScore = 80;
    let flags = [];
    if (input.propertyType === "COMMERCIAL") {
        baseScore -= 10;
        flags.push("COMMERCIAL_PROPERTY");
    }
    if (ltv > 85) {
        baseScore -= 20;
        flags.push("HIGH_LTV");
    }
    else if (ltv > 70) {
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
const sanitizeProperty = async (input) => {
    const normalizedAddress = normalizeAddress(input);
    const ltv = calculateLtv(input.loanAmount, input.estimatedValue);
    const ltvRisk = classifyLtvRisk(ltv);
    const { collateralScore, flags } = scoreCollateral(input, ltv);
    const notes = [];
    if (ltvRisk === "HIGH") {
        notes.push("High LTV; collateral risk elevated.");
    }
    else if (ltvRisk === "MEDIUM") {
        notes.push("Moderate LTV; collateral risk acceptable with conditions.");
    }
    else {
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
exports.sanitizeProperty = sanitizeProperty;
