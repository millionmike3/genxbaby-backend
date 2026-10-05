"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blockchain_controller_1 = require("../controllers/blockchain.controller");
const router = (0, express_1.Router)();
router.get("/verify/:txHash", blockchain_controller_1.verifyAnchor);
exports.default = router;
