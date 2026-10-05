"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeProperty = void 0;
const sanitizeProperty = async (property) => {
    return {
        normalizedAddress: property.address.trim(),
        collateralScore: 85,
        ltvRisk: "LOW",
        flags: []
    };
};
exports.sanitizeProperty = sanitizeProperty;
