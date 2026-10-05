"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const property_controller_1 = require("../controllers/property.controller");
const router = (0, express_1.Router)();
router.post('/', property_controller_1.createProperty);
exports.default = router;
