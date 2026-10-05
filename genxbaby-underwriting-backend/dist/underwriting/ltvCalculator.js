"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateLTV = calculateLTV;
function calculateLTV(amount, propertyValue) {
    if (!propertyValue || propertyValue === 0)
        return 1; // worst case
    return amount / propertyValue;
}
