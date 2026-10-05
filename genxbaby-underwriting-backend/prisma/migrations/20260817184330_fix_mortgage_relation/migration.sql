/*
  Warnings:

  - You are about to drop the column `behaviorScore` on the `UnderwritingCase` table. All the data in the column will be lost.
  - You are about to drop the column `blockchainTx` on the `UnderwritingCase` table. All the data in the column will be lost.
  - You are about to drop the column `decisionReason` on the `UnderwritingCase` table. All the data in the column will be lost.
  - You are about to drop the column `financialHealthScore` on the `UnderwritingCase` table. All the data in the column will be lost.
  - You are about to drop the column `merkleRoot` on the `UnderwritingCase` table. All the data in the column will be lost.
  - You are about to drop the column `pricingOutput` on the `UnderwritingCase` table. All the data in the column will be lost.
  - You are about to drop the column `valuationAmount` on the `UnderwritingCase` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UnderwritingCase" DROP COLUMN "behaviorScore",
DROP COLUMN "blockchainTx",
DROP COLUMN "decisionReason",
DROP COLUMN "financialHealthScore",
DROP COLUMN "merkleRoot",
DROP COLUMN "pricingOutput",
DROP COLUMN "valuationAmount";
