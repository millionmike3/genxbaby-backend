"use strict";
// src/events/eventTypes.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventType = void 0;
var EventType;
(function (EventType) {
    // Pricing Engine
    EventType["PRICING_GENERATED"] = "PRICING_GENERATED";
    EventType["PRODUCT_PRICING_APPLIED"] = "PRODUCT_PRICING_APPLIED";
    EventType["RISK_TIER_APPLIED"] = "RISK_TIER_APPLIED";
    EventType["FINAL_RATE_CALCULATED"] = "FINAL_RATE_CALCULATED";
    EventType["PRICING_ERROR"] = "PRICING_ERROR";
    // Underwriting Engine
    EventType["UW_SUBMITTED"] = "UW_SUBMITTED";
    EventType["UW_DECISION_ISSUED"] = "UW_DECISION_ISSUED";
    EventType["UW_CONDITIONS_CREATED"] = "UW_CONDITIONS_CREATED";
    EventType["UW_CONDITION_SATISFIED"] = "UW_CONDITION_SATISFIED";
    EventType["UW_FINAL_APPROVAL"] = "UW_FINAL_APPROVAL";
    EventType["UW_ERROR"] = "UW_ERROR";
    // Appraisal Service
    EventType["APPRAISAL_ORDERED"] = "APPRAISAL_ORDERED";
    EventType["APPRAISAL_RECEIVED"] = "APPRAISAL_RECEIVED";
    EventType["APPRAISAL_EVALUATED"] = "APPRAISAL_EVALUATED";
    EventType["COLLATERAL_RISK_ASSIGNED"] = "COLLATERAL_RISK_ASSIGNED";
    // Insurance Service
    EventType["INSURANCE_QUOTE_RECEIVED"] = "INSURANCE_QUOTE_RECEIVED";
    EventType["INSURANCE_POLICY_SELECTED"] = "INSURANCE_POLICY_SELECTED";
    EventType["REPLACEMENT_COST_VALIDATED"] = "REPLACEMENT_COST_VALIDATED";
    // Title Service
    EventType["TITLE_ORDERED"] = "TITLE_ORDERED";
    EventType["TITLE_COMMITMENT_RECEIVED"] = "TITLE_COMMITMENT_RECEIVED";
    EventType["TITLE_LIENS_VALIDATED"] = "TITLE_LIENS_VALIDATED";
    // Rate Lock Engine
    EventType["RATE_LOCK_CREATED"] = "RATE_LOCK_CREATED";
    EventType["RATE_LOCK_VALIDATED"] = "RATE_LOCK_VALIDATED";
    EventType["RATE_LOCK_EXPIRED"] = "RATE_LOCK_EXPIRED";
    // Closing Engine
    EventType["COMMITMENT_LETTER_ISSUED"] = "COMMITMENT_LETTER_ISSUED";
    EventType["CLOSING_DISCLOSURE_ISSUED"] = "CLOSING_DISCLOSURE_ISSUED";
    EventType["CLOSING_PACKAGE_GENERATED"] = "CLOSING_PACKAGE_GENERATED";
    EventType["E_SIGN_COMPLETED"] = "E_SIGN_COMPLETED";
    EventType["FUNDED"] = "FUNDED";
    // Investor Delivery Engine
    EventType["DELIVERY_PACKAGE_CREATED"] = "DELIVERY_PACKAGE_CREATED";
    EventType["LOAN_SOLD"] = "LOAN_SOLD";
    EventType["BOARDING_COMPLETE"] = "BOARDING_COMPLETE";
    // Blockchain Anchoring
    EventType["MERKLE_SNAPSHOT_CREATED"] = "MERKLE_SNAPSHOT_CREATED";
    EventType["ANCHOR_TX_MINED"] = "ANCHOR_TX_MINED";
})(EventType || (exports.EventType = EventType = {}));
