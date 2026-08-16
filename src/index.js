// Load environment variables
require("dotenv").config({ override: true });

import { logTimelineEvent } from '../../libs/timeline-logger/src/timelineLogger';
import { Systems, EventTypes } from '../../libs/timeline-logger/src/constants';


// Verify DATABASE_URL is loaded
console.log("Loaded DATABASE_URL:", process.env.DATABASE_URL);

// Initialize Prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Simple server (Express optional)
const express = require("express");
const app = express();
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("GenxBaby Backend is running");
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
