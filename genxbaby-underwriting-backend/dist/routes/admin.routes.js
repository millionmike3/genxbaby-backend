"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/admin.routes.ts
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const router = (0, express_1.Router)();
router.get("/underwriting/cases", admin_controller_1.listCases);
router.get("/underwriting/case/:id", admin_controller_1.getCase);
exports.default = router;
