const express = require("express");
const bodyParser = require("body-parser");
const { authMiddleware } = require("./middleware/auth");

// ROUTES
const authRoutes = require("./routes/auth");
const bankRoutes = require("./routes/banks");
const checkRoutes = require("./routes/checks");

const app = express();
app.use(bodyParser.json());

const configRoutes = require("./routes/config/config.routes");
app.use("/owners/:ownerId/config", configRoutes);

const pricingRoutes = require("./routes/pricing.routes");
app.use("/api/pricing", pricingRoutes);

// 1️⃣ PUBLIC ROUTES (NO AUTH)
app.use("/auth", authRoutes);

// 2️⃣ PROTECTED ROUTES (AUTH REQUIRED)
app.use(authMiddleware);

// 3️⃣ OWNER‑SCOPED ROUTES
app.use("/owners/:ownerId/banks", bankRoutes);
app.use("/owners/:ownerId/checks", checkRoutes);

app.listen(4000, () => console.log("API running on :4000"));
