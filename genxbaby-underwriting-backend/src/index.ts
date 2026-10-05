import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { Queue, Worker } from "bullmq";
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// Initialize services
const app = express();
const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// Middleware
app.use(cors());
app.use(express.json());

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
  } catch (err: any) {
    console.error("Underwriting error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// BullMQ queue for async jobs
const underwritingQueue = new Queue("underwriting", { connection: redis });

// Worker to process jobs
const worker = new Worker(
  "underwriting",
  async (job) => {
    console.log("Processing underwriting job:", job.id, job.data);
    // Add underwriting logic here
  },
  { connection: redis }
);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Underwriting backend running on port ${PORT}`);
});
