import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { Queue, Worker } from "bullmq";
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "underwriting-backend" });
});

// Example underwriting route
app.post("/underwrite", async (req: Request, res: Response) => {
  const { borrowerId, loanAmount } = req.body;

  try {
    const borrower = await prisma.borrower.findUnique({ where: { id: borrowerId } });
    if (!borrower) return res.status(404).json({ error: "Borrower not found" });

    const approved = loanAmount < 100000; // placeholder rule

    await prisma.underwritingResult.create({
      data: { borrowerId, loanAmount, approved }
    });

    res.json({ borrowerId, loanAmount, approved });
  } catch (err) {
    console.error("Underwriting error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// BullMQ queue
const underwritingQueue = new Queue("underwriting", { connection: redis });
new Worker("underwriting", async (job) => {
  console.log("Processing underwriting job:", job.id, job.data);
}, { connection: redis });

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Underwriting backend running on port ${PORT}`);
});
