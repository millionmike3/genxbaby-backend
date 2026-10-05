"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const borrower_controller_1 = require("../controllers/borrower.controller");
const router = (0, express_1.Router)();
router.post('/', borrower_controller_1.createBorrower);
exports.default = router;
