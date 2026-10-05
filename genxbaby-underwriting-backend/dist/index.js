"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Initialize services
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const redis = new ioredis_1.default(process.env.REDIS_URL || "redis://localhost:6379");
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Example health check
app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "underwriting-backend" });
});
// Example underwriting route
app.post("/underwrite", async (req, res) => {
    const { borrowerId, loanAmount } = req.body;
    try {
        // Example DB lookup
        const borrower = await prisma.borrower.findUnique({ where: { id: borrowerId } });
        if (!borrower) {
            return res.status(404).json({ error: "Borrower not found" });
        }
        // Example underwriting logic (placeholder)
        const approved = loanAmount < 100000; // simplistic rule
        // Log result
        await prisma.underwritingResult.create({
            data: {
                borrowerId,
                loanAmount,
                approved,
            },
        });
        res.json({ borrowerId, loanAmount, approved });
    }
    catch (err) {
        console.error("Underwriting error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
// BullMQ queue for async jobs
const underwritingQueue = new bullmq_1.Queue("underwriting", { connection: redis });
// Worker to process jobs
const worker = new bullmq_1.Worker("underwriting", async (job) => {
    console.log("Processing underwriting job:", job.id, job.data);
    // Add underwriting logic here
}, { connection: redis });
// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Underwriting backend running on port ${PORT}`);
});
