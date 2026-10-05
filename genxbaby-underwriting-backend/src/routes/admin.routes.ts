// src/routes/admin.routes.ts
import { Router } from "express";
import { listCases, getCase } from "../controllers/admin.controller";

const router = Router();

router.get("/underwriting/cases", listCases);
router.get("/underwriting/case/:id", getCase);

export default router;

