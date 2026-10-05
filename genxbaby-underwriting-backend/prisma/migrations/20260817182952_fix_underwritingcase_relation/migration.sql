/*
  Warnings:

  - The primary key for the `Borrower` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `address` on the `Borrower` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `Borrower` table. All the data in the column will be lost.
  - You are about to drop the column `kycVerified` on the `Borrower` table. All the data in the column will be lost.
  - You are about to drop the column `ssnLast4` on the `Borrower` table. All the data in the column will be lost.
  - The `id` column on the `Borrower` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `reissuedToId` on the `Check` table. All the data in the column will be lost.
  - You are about to drop the `AuditAnchor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BehaviorProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BehaviorSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FraudFlag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Investor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lead` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SuspiciousActivityReport` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `Borrower` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `borrowerId` on the `Application` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `email` to the `Borrower` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Borrower` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Borrower` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_borrowerId_fkey";

-- DropForeignKey
ALTER TABLE "BehaviorProfile" DROP CONSTRAINT "BehaviorProfile_investorId_fkey";

-- DropForeignKey
ALTER TABLE "BehaviorProfile" DROP CONSTRAINT "BehaviorProfile_leadId_fkey";

-- DropForeignKey
ALTER TABLE "BehaviorProfile" DROP CONSTRAINT "BehaviorProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "BehaviorSession" DROP CONSTRAINT "BehaviorSession_investorId_fkey";

-- DropForeignKey
ALTER TABLE "BehaviorSession" DROP CONSTRAINT "BehaviorSession_leadId_fkey";

-- DropForeignKey
ALTER TABLE "BehaviorSession" DROP CONSTRAINT "BehaviorSession_userId_fkey";

-- DropForeignKey
ALTER TABLE "FraudFlag" DROP CONSTRAINT "FraudFlag_checkId_fkey";

-- DropForeignKey
ALTER TABLE "SuspiciousActivityReport" DROP CONSTRAINT "SuspiciousActivityReport_checkId_fkey";

-- DropForeignKey
ALTER TABLE "SuspiciousActivityReport" DROP CONSTRAINT "SuspiciousActivityReport_flagId_fkey";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "borrowerId",
ADD COLUMN     "borrowerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Borrower" DROP CONSTRAINT "Borrower_pkey",
DROP COLUMN "address",
DROP COLUMN "fullName",
DROP COLUMN "kycVerified",
DROP COLUMN "ssnLast4",
ADD COLUMN     "annualIncome" DOUBLE PRECISION,
ADD COLUMN     "behaviorScore" DOUBLE PRECISION,
ADD COLUMN     "cashflowScore" DOUBLE PRECISION,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "creditScore" INTEGER,
ADD COLUMN     "dtiRatio" DOUBLE PRECISION,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "employerName" TEXT,
ADD COLUMN     "employmentStatus" TEXT,
ADD COLUMN     "financialHealthScore" DOUBLE PRECISION,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "fraudScore" DOUBLE PRECISION,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "ssn" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "dob" DROP NOT NULL,
ALTER COLUMN "dob" SET DATA TYPE TEXT,
ADD CONSTRAINT "Borrower_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Check" DROP COLUMN "reissuedToId";

-- DropTable
DROP TABLE "AuditAnchor";

-- DropTable
DROP TABLE "BehaviorProfile";

-- DropTable
DROP TABLE "BehaviorSession";

-- DropTable
DROP TABLE "FraudFlag";

-- DropTable
DROP TABLE "Investor";

-- DropTable
DROP TABLE "Lead";

-- DropTable
DROP TABLE "SuspiciousActivityReport";

-- DropEnum
DROP TYPE "Pillar";

-- CreateTable
CREATE TABLE "Property" (
    "id" SERIAL NOT NULL,
    "ownerId" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "propertyType" TEXT,
    "squareFeet" INTEGER,
    "bedrooms" INTEGER,
    "bathrooms" DOUBLE PRECISION,
    "marketValue" DOUBLE PRECISION,
    "valuationConfidence" DOUBLE PRECISION,
    "capRate" DOUBLE PRECISION,
    "noi" DOUBLE PRECISION,
    "dscr" DOUBLE PRECISION,
    "sanitizerPass" BOOLEAN NOT NULL DEFAULT false,
    "sanitizerReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mortgage" (
    "id" SERIAL NOT NULL,
    "borrowerId" INTEGER NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "loanAmount" DOUBLE PRECISION NOT NULL,
    "interestRate" DOUBLE PRECISION,
    "termMonths" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mortgage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnderwritingCase" (
    "id" SERIAL NOT NULL,
    "borrowerId" INTEGER NOT NULL,
    "mortgageId" INTEGER NOT NULL,
    "riskScore" DOUBLE PRECISION,
    "collateralScore" DOUBLE PRECISION,
    "behaviorScore" DOUBLE PRECISION,
    "fraudScore" DOUBLE PRECISION,
    "financialHealthScore" DOUBLE PRECISION,
    "valuationAmount" DOUBLE PRECISION,
    "pricingOutput" DOUBLE PRECISION,
    "decision" TEXT NOT NULL DEFAULT 'PENDING',
    "decisionReason" TEXT,
    "merkleRoot" TEXT,
    "blockchainTx" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UnderwritingCase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UnderwritingCase_mortgageId_key" ON "UnderwritingCase"("mortgageId");

-- CreateIndex
CREATE UNIQUE INDEX "Borrower_email_key" ON "Borrower"("email");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "Borrower"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mortgage" ADD CONSTRAINT "Mortgage_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "Borrower"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mortgage" ADD CONSTRAINT "Mortgage_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnderwritingCase" ADD CONSTRAINT "UnderwritingCase_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "Borrower"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnderwritingCase" ADD CONSTRAINT "UnderwritingCase_mortgageId_fkey" FOREIGN KEY ("mortgageId") REFERENCES "Mortgage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
