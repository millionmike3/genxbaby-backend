"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const prisma_1 = require("@/db/prisma");
const behavior_service_1 = require("@/services/behavior/behavior.service");
const property_service_1 = require("@/services/property/property.service");
const stock_service_1 = require("@/services/stock/stock.service");
const engine_1 = require("@/services/underwriting/engine");
const merkle_service_1 = require("@/services/merkle/merkle.service");
async function GET(req, { params }) {
    try {
        const applicationId = params.id;
        // 1. Load application from DB
        const application = await prisma_1.prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                property: true,
                stockSnapshot: true
            }
        });
        if (!application) {
            return server_1.NextResponse.json({ error: "Application not found" }, { status: 404 });
        }
        // 2. Run Behavior Module
        const behavior = await (0, behavior_service_1.analyzeBehavior)({
            applicationId,
            borrowerId: application.borrowerId,
            ipAddress: application.ipAddress,
            deviceId: application.deviceId,
            submittedAt: application.submittedAt,
            priorApplicationsCount: application.priorApplicationsCount,
            rejectedApplicationsCount: application.rejectedApplicationsCount,
            documentCount: application.documentCount,
            avgDocumentUploadDelayMinutes: application.avgDocDelayMinutes
        });
        // 3. Run Property Sanitizer
        const property = await (0, property_service_1.sanitizeProperty)({
            applicationId,
            address: application.property.address,
            city: application.property.city,
            state: application.property.state,
            postalCode: application.property.postalCode,
            country: application.property.country,
            propertyType: application.property.propertyType,
            estimatedValue: application.property.estimatedValue,
            loanAmount: application.property.loanAmount,
            units: application.property.units,
            yearBuilt: application.property.yearBuilt
        });
        // 4. Run Stock Sanitizer
        const stock = await (0, stock_service_1.sanitizeStock)({
            applicationId,
            asOf: new Date(),
            vixLevel: application.stockSnapshot.vixLevel,
            mortgageSpreadBps: application.stockSnapshot.mortgageSpreadBps,
            riskOnSentiment: application.stockSnapshot.riskOnSentiment,
            liquidityIndex: application.stockSnapshot.liquidityIndex
        });
        // 5. Run Underwriting Engine
        const underwriting = await (0, engine_1.runUnderwritingEngine)({
            application,
            behavior,
            property,
            stock
        });
        // 6. Generate Merkle Root
        const merkleRoot = (0, merkle_service_1.generateMerkleRoot)(underwriting.payload);
        // 7. Fetch anchor record (if exists)
        const anchorRecord = await prisma_1.prisma.anchorRecord.findFirst({
            where: { applicationId },
            orderBy: { anchoredAt: "desc" }
        });
        return server_1.NextResponse.json({
            applicationId,
            behavior,
            property,
            stock,
            decision: underwriting.decision,
            riskScore: underwriting.riskScore,
            payload: underwriting.payload,
            merkleRoot,
            anchor: anchorRecord || null
        });
    }
    catch (err) {
        console.error("Underwriting fetch error:", err);
        return server_1.NextResponse.json({ error: "Failed to fetch underwriting result" }, { status: 500 });
    }
}
