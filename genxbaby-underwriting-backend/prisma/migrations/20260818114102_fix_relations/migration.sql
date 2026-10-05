/*
  Warnings:

  - You are about to drop the column `cashflowScore` on the `Borrower` table. All the data in the column will be lost.
  - You are about to drop the column `dob` on the `Borrower` table. All the data in the column will be lost.
  - You are about to drop the column `dtiRatio` on the `Borrower` table. All the data in the column will be lost.
  - You are about to drop the column `employerName` on the `Borrower` table. All the data in the column will be lost.
  - You are about to drop the column `employmentStatus` on the `Borrower` table. All the data in the column will be lost.
  - You are about to drop the column `fraudScore` on the `Borrower` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Borrower` table. All the data in the column will be lost.
  - You are about to drop the column `ssn` on the `Borrower` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Borrower" DROP COLUMN "cashflowScore",
DROP COLUMN "dob",
DROP COLUMN "dtiRatio",
DROP COLUMN "employerName",
DROP COLUMN "employmentStatus",
DROP COLUMN "fraudScore",
DROP COLUMN "phone",
DROP COLUMN "ssn";

-- AlterTable
ALTER TABLE "Owner" ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UnderwritingCase" ADD COLUMN     "anchoredTxHash" TEXT,
ADD COLUMN     "behaviorScore" DOUBLE PRECISION,
ADD COLUMN     "financialScore" DOUBLE PRECISION,
ADD COLUMN     "merkleRoot" TEXT;
