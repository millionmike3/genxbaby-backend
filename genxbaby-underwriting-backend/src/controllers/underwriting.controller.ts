import { Request, Response } from "express";
import {
  createUnderwritingCase,
  getUnderwritingCase,
  listUnderwritingCases
} from "../db/queries";
import { underwritingQueue } from "../queue/queues";

export async function createCase(req: Request, res: Response) {
  const data = req.body;
  const ucase = await createUnderwritingCase(data);

  await underwritingQueue.add("underwrite", { caseId: ucase.id });

  res.json({ success: true, case: ucase });
}

export async function getCase(req: Request, res: Response) {
  const id = Number(req.params.id);
  const ucase = await getUnderwritingCase(id);
  res.json({ case: ucase });
}

export async function listCases(req: Request, res: Response) {
  const cases = await listUnderwritingCases();
  res.json({ cases });
}
