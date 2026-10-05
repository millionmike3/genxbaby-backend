import { Router } from "express";
import {
  createUnderwritingCase,
  listUnderwritingCases,
  getUnderwritingCase
} from "../db/queries";
import { underwritingQueue } from "../queue/queues";

const router = Router();

router.post("/", async (req, res) => {
  const data = req.body;
  const ucase = await createUnderwritingCase(data);

  await underwritingQueue.add("underwrite", { caseId: ucase.id });

  res.json({ success: true, case: ucase });
});

router.get("/", async (req, res) => {
  const cases = await listUnderwritingCases();
  res.json({ cases });
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const ucase = await getUnderwritingCase(id);
  res.json({ case: ucase });
});

export default router;
