import { Request, Response } from "express";
import { propertyService } from "../services/property/property.service";
import { sanitizeProperty } from "../services/property/property.service";

/**
 * Create a new property
 */
export async function createProperty(req: Request, res: Response) {
  try {
    const data = req.body;

    // Optional: sanitize property before saving
    const sanitized = await sanitizeProperty(data);

    const property = await propertyService.create({
      ...data,
      normalizedAddress: sanitized.normalizedAddress,
      ltv: sanitized.ltv,
      collateralScore: sanitized.collateralScore,
      ltvRisk: sanitized.ltvRisk,
      flags: sanitized.flags,
      notes: sanitized.notes
    });

    return res.json({ success: true, property });
  } catch (err) {
    console.error("CREATE PROPERTY ERROR:", err);
    return res.status(500).json({ error: "Failed to create property" });
  }
}

/**
 * List all properties
 */
export async function listProperties(req: Request, res: Response) {
  try {
    const properties = await propertyService.list();
    return res.json({ success: true, properties });
  } catch (err) {
    console.error("LIST PROPERTIES ERROR:", err);
    return res.status(500).json({ error: "Failed to list properties" });
  }
}

/**
 * Get a single property by ID
 */
export async function getProperty(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid property ID" });
    }

    const property = await propertyService.get(id);

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    return res.json({ success: true, property });
  } catch (err) {
    console.error("GET PROPERTY ERROR:", err);
    return res.status(500).json({ error: "Failed to fetch property" });
  }
}
