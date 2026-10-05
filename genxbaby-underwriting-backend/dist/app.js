"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// Option A Routes (Mortgage Underwriting)
const borrower_routes_1 = __importDefault(require("./routes/borrower.routes"));
const property_routes_1 = __importDefault(require("./routes/property.routes"));
const mortgage_routes_1 = __importDefault(require("./routes/mortgage.routes"));
const underwriting_routes_1 = __importDefault(require("./routes/underwriting.routes"));
// System / Admin / Blockchain
const blockchain_routes_1 = __importDefault(require("./routes/blockchain.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Admin
app.use("/admin", admin_routes_1.default);
// Core Mortgage Underwriting Routes (Option A)
app.use("/borrower", borrower_routes_1.default);
app.use("/property", property_routes_1.default);
app.use("/mortgage", mortgage_routes_1.default);
app.use("/underwriting", underwriting_routes_1.default);
// Blockchain (simulated anchoring)
app.use("/blockchain", blockchain_routes_1.default);
exports.default = app;
