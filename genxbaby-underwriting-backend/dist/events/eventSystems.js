"use strict";
// src/events/eventSystems.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventSystem = void 0;
var EventSystem;
(function (EventSystem) {
    EventSystem["PricingEngine"] = "PricingEngine";
    EventSystem["UnderwritingEngine"] = "UnderwritingEngine";
    EventSystem["AppraisalService"] = "AppraisalService";
    EventSystem["InsuranceService"] = "InsuranceService";
    EventSystem["TitleService"] = "TitleService";
    EventSystem["RateLockEngine"] = "RateLockEngine";
    EventSystem["ClosingEngine"] = "ClosingEngine";
    EventSystem["InvestorDeliveryEngine"] = "InvestorDeliveryEngine";
    EventSystem["BlockchainAnchoring"] = "BlockchainAnchoring";
})(EventSystem || (exports.EventSystem = EventSystem = {}));
