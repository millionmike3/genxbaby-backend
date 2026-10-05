"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyIncome = verifyIncome;
function verifyIncome(incomeAmount, incomeYears) {
    const stabilityScore = incomeYears >= 5 ? 1 :
        incomeYears >= 3 ? 0.8 :
            incomeYears >= 1 ? 0.6 :
                0.3;
    const incomeScore = incomeAmount >= 150000 ? 1 :
        incomeAmount >= 100000 ? 0.9 :
            incomeAmount >= 75000 ? 0.8 :
                incomeAmount >= 50000 ? 0.6 :
                    0.3;
    return {
        stabilityScore,
        incomeScore,
        combined: (stabilityScore + incomeScore) / 2
    };
}
