// src/polygon/anchor.ts

import { ethers } from "ethers";
import {
  getPolygonProvider,
  getUnderwritingAnchorContract
} from "../blockchain/config";

export async function anchorDecisionOnPolygon(app: any) {
  const provider = getPolygonProvider();

  // Use a private key from env for now (service wallet)
  const privateKey = process.env.POLYGON_ANCHOR_PRIVATE_KEY as string;
  if (!privateKey) {
    throw new Error("POLYGON_ANCHOR_PRIVATE_KEY is not set");
  }

  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = getUnderwritingAnchorContract(wallet);

  // Very simple “merkle root”: hash of app.id + decision + riskScore
  const payload = JSON.stringify({
    applicationId: app.id,
    decision: app.underwriting?.decision,
    riskScore: app.underwriting?.riskScore
  });

  const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes(payload));

  const txResponse = await contract.anchor(merkleRoot);
  const txReceipt = await txResponse.wait();

  return {
    hash: txReceipt.transactionHash,
    merkleRoot
  };
}
