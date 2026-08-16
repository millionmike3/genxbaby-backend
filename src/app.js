// genxbaby-backend/src/app.js

const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// -----------------------------
// RISK ROUTES (clean prefixes)
// -----------------------------
app.use("/risk/dashboard", require("./routes/riskDashboard.routes"));
app.use("/risk/history", require("./routes/riskHistory.routes"));
app.use("/risk/tier", require("./routes/riskTier.routes"));

// -----------------------------
// PRICING ROUTES
// -----------------------------
app.use("/pricing", require("./routes/pricingHistory.routes"));

// -----------------------------
// CHECK RISK ROUTES
// -----------------------------
app.use("/checks", require("./routes/checkRisk.routes"));

// -----------------------------
// UNDERWRITING SUMMARY
// -----------------------------
app.use("/underwriting", require("./routes/underwritingSummary.routes"));

// -----------------------------
// DOCUMENT ROUTES
// -----------------------------
app.use("/", require("./routes/document.routes")); 
// ensures /owners/:ownerId/documents works correctly

// -----------------------------
// FINANCIAL HEALTH
// -----------------------------
app.use("/financial-health", require("./routes/financialHealth.routes"));

// -----------------------------
// PORTFOLIO
// -----------------------------
app.use("/portfolio", require("./routes/portfolio.routes"));

// -----------------------------
// OCR + FRAUD
// -----------------------------
app.use("/ocr", require("./routes/ocr.routes"));
app.use("/fraud/documents", require("./routes/documentFraud.routes"));
app.use("/fraud/checks", require("./routes/fraud.routes"));

// -----------------------------
// SAR / VOLATILITY / BEHAVIOR / BANKING
// -----------------------------
app.use("/sar", require("./routes/sar.routes"));
app.use("/volatility", require("./routes/volatility.routes"));
app.use("/behavior", require("./routes/behavior.routes"));
app.use("/banking", require("./routes/banking.routes"));

// -----------------------------
// INCOME VERIFICATION
// -----------------------------
app.use("/income-verification", require("./routes/incomeVerification.routes"));

// -----------------------------
// HEALTH CHECK
// -----------------------------
app.get("/", (req, res) => {
  res.json({ status: "OK", service: "GenXBaby Backend API" });
});

// -----------------------------
// ERROR HANDLER
// -----------------------------
app.use((err, req, res, next) => {
  console.error("API Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
