"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mortgage_controller_1 = require("../controllers/mortgage.controller");
const router = (0, express_1.Router)();
router.post('/', mortgage_controller_1.createMortgage);
exports.default = router;
