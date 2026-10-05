"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveDecision = saveDecision;
// src/services/decisionService.ts
const db_1 = require("../db");
async function saveDecision(applicationId, status, notes) {
    // Simple mapping: status → tier/rate (could be more complex)
    let tier = "A";
    let rate = 6.5;
    if (status === "DECLINED") {
        tier = "DECLINED";
        rate = 0;
    }
    if (status === "NEEDS_MORE_INFO") {
        tier = "PENDING";
        rate = 0;
    }
    return db_1.prisma.application.update({
        where: { id: applicationId },
        data: {
            decisionStatus: status,
            decisionTier: tier,
            decisionRate: rate,
            decisionNotes: notes,
        },
    });
}
