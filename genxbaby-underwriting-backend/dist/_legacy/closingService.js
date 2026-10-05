"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCommitmentLetter = generateCommitmentLetter;
exports.generateClosingDisclosure = generateClosingDisclosure;
exports.fundLoan = fundLoan;
// src/services/closingService.ts
const timelineEventService_1 = require("./timelineEventService");
async function generateCommitmentLetter(applicationId, borrowerId, data) {
    const letter = await buildCommitmentLetter(data); // your logic
    await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, "COMMITMENT_LETTER_ISSUED", { url: letter.url, terms: letter.terms });
    return letter;
}
async function generateClosingDisclosure(applicationId, borrowerId, data) {
    const cd = await buildClosingDisclosure(data); // your logic
    await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, "CLOSING_DISCLOSURE_ISSUED", { url: cd.url, apr: cd.apr, cashToClose: cd.cashToClose });
    return cd;
}
async function fundLoan(applicationId, borrowerId, funding) {
    const result = await executeFunding(funding); // your logic
    await timelineEventService_1.TimelineEventService.logEvent(applicationId, borrowerId, "FUNDED", result);
    return result;
}
