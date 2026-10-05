import express from "express";
import cors from "cors";

// Option A Routes (Mortgage Underwriting)
import borrowerRoutes from "./routes/borrower.routes";
import propertyRoutes from "./routes/property.routes";
import mortgageRoutes from "./routes/mortgage.routes";
import underwritingRoutes from "./routes/underwriting.routes";

// System / Admin / Blockchain
import blockchainRoutes from "./routes/blockchain.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Admin
app.use("/admin", adminRoutes);

// Core Mortgage Underwriting Routes (Option A)
app.use("/borrower", borrowerRoutes);
app.use("/property", propertyRoutes);
app.use("/mortgage", mortgageRoutes);
app.use("/underwriting", underwritingRoutes);

// Blockchain (simulated anchoring)
app.use("/blockchain", blockchainRoutes);

export default app;
