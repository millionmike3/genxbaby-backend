/*
  Warnings:

  - You are about to drop the column `name` on the `Owner` table. All the data in the column will be lost.
  - You are about to drop the `FinancialHealthSnapshot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IncomeVerificationSnapshot` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `organizationId` to the `Check` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `Owner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Owner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `OwnerDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CheckStatus" AS ENUM ('ISSUED', 'PENDING', 'CLEARED', 'RETURNED', 'VOIDED', 'REISSUED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "LifecycleType" AS ENUM ('CREATED', 'ISSUED', 'CLEARED', 'RETURNED', 'VOIDED', 'REISSUED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "IdentityVerificationStatus" AS ENUM ('UNVERIFIED', 'PARTIALLY_VERIFIED', 'VERIFIED', 'HIGH_RISK', 'SYNTHETIC_SUSPECT');

-- CreateEnum
CREATE TYPE "IdentityRiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "IdentityEventType" AS ENUM ('CREATED', 'UPDATED', 'VERIFIED', 'FLAGGED', 'DEVICE_ADDED', 'ACCOUNT_ADDED', 'DOCUMENT_ADDED', 'FRAUD_ALERT');

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('OPEN', 'REVIEW', 'ESCALATED', 'CLOSED');

-- DropIndex
DROP INDEX "Owner_email_key";

-- AlterTable
ALTER TABLE "Check" ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "clearedAt" TIMESTAMP(3),
ADD COLUMN     "issuedAt" TIMESTAMP(3),
ADD COLUMN     "organizationId" TEXT NOT NULL,
ADD COLUMN     "ownerId" TEXT,
ADD COLUMN     "returnedAt" TIMESTAMP(3),
ADD COLUMN     "status" "CheckStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "voidedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "FraudFlag" ADD COLUMN     "ownerId" TEXT;

-- AlterTable
ALTER TABLE "Owner" DROP COLUMN "name",
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "organizationId" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "primaryAddress" TEXT,
ADD COLUMN     "riskLevel" "IdentityRiskLevel" NOT NULL DEFAULT 'LOW',
ADD COLUMN     "riskScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "verificationStatus" "IdentityVerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OwnerDocument" ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Signer" ADD COLUMN     "ownerId" TEXT;

-- AlterTable
ALTER TABLE "SuspiciousActivityReport" ADD COLUMN     "ownerId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "organizationId" TEXT NOT NULL;

-- DropTable
DROP TABLE "FinancialHealthSnapshot";

-- DropTable
DROP TABLE "IncomeVerificationSnapshot";

-- CreateTable
CREATE TABLE "OwnerDevice" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OwnerDevice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnerAccount" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "routingNumber" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OwnerAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckLifecycleEvent" (
    "id" TEXT NOT NULL,
    "checkId" TEXT NOT NULL,
    "type" "LifecycleType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "CheckLifecycleEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckAuditLog" (
    "id" TEXT NOT NULL,
    "checkId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actorId" TEXT,
    "metadata" JSONB,

    CONSTRAINT "CheckAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FraudAlert" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "meta" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "caseId" TEXT,

    CONSTRAINT "FraudAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdentityEvent" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "type" "IdentityEventType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "IdentityEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "status" "CaseStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseNote" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseAttachment" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "ownerId" TEXT,
    "organizationId" TEXT,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Owner" ADD CONSTRAINT "Owner_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnerDevice" ADD CONSTRAINT "OwnerDevice_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnerAccount" ADD CONSTRAINT "OwnerAccount_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signer" ADD CONSTRAINT "Signer_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Check" ADD CONSTRAINT "Check_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Check" ADD CONSTRAINT "Check_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckLifecycleEvent" ADD CONSTRAINT "CheckLifecycleEvent_checkId_fkey" FOREIGN KEY ("checkId") REFERENCES "Check"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckAuditLog" ADD CONSTRAINT "CheckAuditLog_checkId_fkey" FOREIGN KEY ("checkId") REFERENCES "Check"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FraudFlag" ADD CONSTRAINT "FraudFlag_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuspiciousActivityReport" ADD CONSTRAINT "SuspiciousActivityReport_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnerDocument" ADD CONSTRAINT "OwnerDocument_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnerDocument" ADD CONSTRAINT "OwnerDocument_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FraudAlert" ADD CONSTRAINT "FraudAlert_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FraudAlert" ADD CONSTRAINT "FraudAlert_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FraudAlert" ADD CONSTRAINT "FraudAlert_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdentityEvent" ADD CONSTRAINT "IdentityEvent_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseNote" ADD CONSTRAINT "CaseNote_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseAttachment" ADD CONSTRAINT "CaseAttachment_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
