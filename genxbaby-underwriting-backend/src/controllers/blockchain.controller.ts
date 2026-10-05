// src/controllers/blockchain.controller.ts
import { Request, Response } from "express";
import { provider } from "../blockchain/contract";

export async function verifyAnchor(req: Request, res: Response) {
  try {
    const { txHash } = req.params;
    const receipt = await provider.getTransactionReceipt(txHash);

    if (!receipt) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json({
      txHash,
      blockNumber: receipt.blockNumber,
      success: receipt.status === 1,
      confirmations: receipt.confirmations,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
