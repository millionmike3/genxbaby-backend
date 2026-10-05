"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectFraud = detectFraud;
function detectFraud(application, borrower) {
    const signals = [];
    if (application.incomeVerified === false) {
        signals.push("UNVERIFIED_INCOME");
    }
    if (application.employer === "Self" && application.incomeYears < 2) {
        signals.push("SHORT_SELF_EMPLOYMENT");
    }
    if (borrower.address.includes("PO Box")) {
        signals.push("PO_BOX_ADDRESS");
    }
    return {
        signals,
        riskPenalty: signals.length * 50 // each signal adds risk
    };
}
