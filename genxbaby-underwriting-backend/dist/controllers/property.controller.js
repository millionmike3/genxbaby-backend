"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProperty = createProperty;
exports.listProperties = listProperties;
exports.getProperty = getProperty;
const property_service_1 = require("../services/property/property.service");
const property_service_2 = require("../services/property/property.service");
/**
 * Create a new property
 */
async function createProperty(req, res) {
    try {
        const data = req.body;
        // Optional: sanitize property before saving
        const sanitized = await (0, property_service_2.sanitizeProperty)(data);
        const property = await property_service_1.propertyService.create({
            ...data,
            normalizedAddress: sanitized.normalizedAddress,
            ltv: sanitized.ltv,
            collateralScore: sanitized.collateralScore,
            ltvRisk: sanitized.ltvRisk,
            flags: sanitized.flags,
            notes: sanitized.notes
        });
        return res.json({ success: true, property });
    }
    catch (err) {
        console.error("CREATE PROPERTY ERROR:", err);
        return res.status(500).json({ error: "Failed to create property" });
    }
}
/**
 * List all properties
 */
async function listProperties(req, res) {
    try {
        const properties = await property_service_1.propertyService.list();
        return res.json({ success: true, properties });
    }
    catch (err) {
        console.error("LIST PROPERTIES ERROR:", err);
        return res.status(500).json({ error: "Failed to list properties" });
    }
}
/**
 * Get a single property by ID
 */
async function getProperty(req, res) {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid property ID" });
        }
        const property = await property_service_1.propertyService.get(id);
        if (!property) {
            return res.status(404).json({ error: "Property not found" });
        }
        return res.json({ success: true, property });
    }
    catch (err) {
        console.error("GET PROPERTY ERROR:", err);
        return res.status(500).json({ error: "Failed to fetch property" });
    }
}
