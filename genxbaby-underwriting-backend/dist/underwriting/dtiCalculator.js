"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDTI = calculateDTI;
function calculateDTI(monthlyDebt, monthlyIncome) {
    if (!monthlyIncome || monthlyIncome === 0)
        return 1; // worst case
    return monthlyDebt / monthlyIncome;
}
