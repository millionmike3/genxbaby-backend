import express from "express";
import dotenv from "dotenv";
import { appendBlock, getChainState } from "./chainState.js";
import { generateMerkleRoot } from "./merkle.js";

dotenv.config();

const app = express();
app.use(express.json());

app.post("/anchor", async (req, res) => {
  try {
    const { underwritingCaseId, payload } = req.body;

    if (!underwritingCaseId || !payload) {
      return res.status(400).json({ error: "Missing underwritingCaseId or payload" });
    }

    // Generate Merkle root from payload
    const merkleRoot = generateMerkleRoot(payload);

    // Append block to chain
    const block = appendBlock({
      underwritingCaseId,
      merkleRoot,
      timestamp: Date.now(),
    });

    return res.json({
      success: true,
      block,
    });
  } catch (err) {
    console.error("Anchor error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/chain", (req, res) => {
  return res.json(getChainState());
});

const PORT = process.env.PORT || 4005;
app.listen(PORT, () => {
  console.log(`Node Registry running on port ${PORT}`);
});
