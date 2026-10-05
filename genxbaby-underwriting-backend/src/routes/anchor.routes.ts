import { Router } from "express";
import { batchAnchorCases } from "../services/anchor/batchAnchor.service";

const router = Router();

router.post("/batch", async (req, res) => {
  const { caseIds } = req.body;

  const result = await batchAnchorCases(caseIds);

  res.json({ success: true, result });
});

export default router;
