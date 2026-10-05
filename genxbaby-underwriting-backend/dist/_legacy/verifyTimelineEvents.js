"use strict";
// src/tests/verifyTimelineEvents.ts
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = require("../services/pricing/service");
const service_2 = require("../services/underwriting/service");
const service_3 = require("../services/appraisal/service");
const service_4 = require("../services/insurance/service");
const service_5 = require("../services/title/service");
const service_6 = require("../services/ratelock/service");
const service_7 = require("../services/closing/service");
const service_8 = require("../services/investor/service");
const service_9 = require("../services/blockchain/service");
const prisma_1 = require("../lib/prisma"); // adjust if your prisma client path differs
const applicationId = "TEST-APP-001";
const borrowerId = "TEST-BORROWER-001";
async function runVerification() {
    console.log("🔍 Starting GENXBABY Timeline Verification...\n");
    // 1. Pricing Engine
    console.log("➡️ Pricing Engine...");
    await service_1.PricingService.generatePricing(applicationId, borrowerId, { product: "DSCR" });
    // 2. Underwriting Engine
    console.log("➡️ Underwriting Engine...");
    await service_2.UnderwritingService.issueDecision(applicationId, borrowerId, { file: "dummy" });
    // 3. Appraisal Service
    console.log("➡️ Appraisal Service...");
    await service_3.AppraisalService.orderAppraisal(applicationId, borrowerId, { address: "123 Main St" });
    await service_3.AppraisalService.handleAppraisalCallback(applicationId, borrowerId, { reportId: "RPT-001" });
    // 4. Insurance Service
    console.log("➡️ Insurance Service...");
    await service_4.InsuranceService.requestQuote(applicationId, borrowerId, { property: "123 Main St" });
    await service_4.InsuranceService.selectPolicy(applicationId, borrowerId, { policyId: "POL-001" });
    // 5. Title Service
    console.log("➡️ Title Service...");
    await service_5.TitleService.orderTitle(applicationId, borrowerId, { address: "123 Main St" });
    await service_5.TitleService.handleCommitment(applicationId, borrowerId, { commitmentId: "TC-001" });
    // 6. Rate Lock Engine
    console.log("➡️ Rate Lock Engine...");
    await service_6.RateLockService.createRateLock(applicationId, borrowerId, { finalRate: 6.875 });
    await service_6.RateLockService.validateRateLock(applicationId, borrowerId, { lockId: "RL-001" });
    // 7. Closing Engine
    console.log("➡️ Closing Engine...");
    await service_7.ClosingService.generateCommitmentLetter(applicationId, borrowerId, { terms: "Standard" });
    await service_7.ClosingService.generateClosingDisclosure(applicationId, borrowerId, { apr: 7.12 });
    await service_7.ClosingService.fundLoan(applicationId, borrowerId, { amount: 450000 });
    // 8. Investor Delivery Engine
    console.log("➡️ Investor Delivery Engine...");
    await service_8.InvestorDeliveryService.createDeliveryPackage(applicationId, borrowerId, { loanId: "LN-001" });
    await service_8.InvestorDeliveryService.markLoanSold(applicationId, borrowerId, { investor: "BlackRock" });
    // 9. Blockchain Anchoring Engine
    console.log("➡️ Blockchain Anchoring...");
    const snapshot = await service_9.BlockchainAnchoringService.createMerkleSnapshot(applicationId, borrowerId, { state: "dummy" });
    await service_9.BlockchainAnchoringService.anchorToPolygon(applicationId, borrowerId, snapshot);
    console.log("\n📥 Fetching timeline events from database...\n");
    const events = await prisma_1.prisma.timelineEvent.findMany({
        where: { applicationId },
        orderBy: { createdAt: "asc" }
    });
    console.log("📊 Timeline Events:");
    console.log(JSON.stringify(events, null, 2));
    console.log("\n✅ Verification Complete — All engines tested.");
}
runVerification()
    .catch((err) => {
    console.error("❌ Verification failed:", err);
})
    .finally(async () => {
    await prisma_1.prisma.$disconnect();
});
