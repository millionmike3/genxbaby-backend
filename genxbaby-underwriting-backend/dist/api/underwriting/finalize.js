"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.finalizeUnderwritingHandler = void 0;
const behavior_service_1 = require("../../services/behavior/behavior.service");
const property_service_1 = require("../../services/property/property.service");
const stock_service_1 = require("../../services/stock/stock.service");
const engine_1 = require("../../services/underwriting/engine");
const finalizeUnderwritingHandler = async (req, res) => {
    const { application, propertyInput, stockInput } = req.body;
    const behavior = await (0, behavior_service_1.analyzeBehavior)({
        applicationId: application.id,
        borrowerId: application.borrowerId,
        ipAddress: application.ipAddress,
        deviceId: application.deviceId,
        submittedAt: new Date(application.submittedAt),
        priorApplicationsCount: application.priorApplicationsCount,
        rejectedApplicationsCount: application.rejectedApplicationsCount,
        documentCount: application.documentCount,
        avgDocumentUploadDelayMinutes: application.avgDocDelayMinutes
    });
    const property = await (0, property_service_1.sanitizeProperty)(propertyInput);
    const stock = await (0, stock_service_1.sanitizeStock)(stockInput);
    const result = await (0, engine_1.runUnderwritingAndAnchor)({
        application,
        behavior,
        property,
        stock
    });
    res.json(result);
};
exports.finalizeUnderwritingHandler = finalizeUnderwritingHandler;
