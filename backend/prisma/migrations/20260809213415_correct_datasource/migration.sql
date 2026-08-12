-- CreateEnum
CREATE TYPE "Pillar" AS ENUM ('STOCK_SANITIZER', 'CUSTOMER', 'INVESTOR');

-- CreateTable
CREATE TABLE "Owner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "theme" TEXT NOT NULL DEFAULT 'dark',
    "accentColor" TEXT NOT NULL DEFAULT '#3CF46B',
    "density" TEXT NOT NULL DEFAULT 'comfortable',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankProfile" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "routingNumber" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "signerName" TEXT,
    "signatureImage" TEXT,
    "nextCheckNumber" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BankProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Signer" (
    "id" TEXT NOT NULL,
    "bankProfileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "signatureImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Signer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Check" (
    "id" TEXT NOT NULL,
    "checkNumber" INTEGER NOT NULL,
    "payee" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "memo" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "bankProfileId" TEXT NOT NULL,
    "signerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reissuedToId" TEXT,

    CONSTRAINT "Check_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FraudFlag" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "checkId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FraudFlag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuspiciousActivityReport" (
    "id" TEXT NOT NULL,
    "flagId" TEXT NOT NULL,
    "checkId" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SuspiciousActivityReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "walletAddress" TEXT,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adminId" TEXT NOT NULL,
    "ip" TEXT,
    "metadata" JSONB,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditAnchor" (
    "id" SERIAL NOT NULL,
    "root" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditAnchor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BehaviorSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "leadId" TEXT,
    "investorId" TEXT,
    "pillar" "Pillar" NOT NULL,
    "page" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3) NOT NULL,
    "clickCount" INTEGER NOT NULL,
    "clickRate" DOUBLE PRECISION NOT NULL,
    "burstIndex" INTEGER NOT NULL,
    "rageClickScore" DOUBLE PRECISION NOT NULL,
    "formFillTimeMs" INTEGER NOT NULL,
    "abandonedFormsCount" INTEGER NOT NULL,
    "avgTimeOnPageMs" INTEGER NOT NULL,
    "sessionVolatility" DOUBLE PRECISION NOT NULL,
    "impulsivenessScore" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BehaviorSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BehaviorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "leadId" TEXT,
    "investorId" TEXT,
    "pillar" "Pillar" NOT NULL,
    "sessionsCount" INTEGER NOT NULL DEFAULT 0,
    "avgImpulsivenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "maxImpulsivenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "impulsivenessLevel" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BehaviorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investor" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "Investor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskHistoryLog" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fraudScore" INTEGER NOT NULL,
    "sarSeverity" INTEGER NOT NULL,
    "volatilityIndex" INTEGER NOT NULL,
    "behaviorScore" INTEGER NOT NULL,
    "bankRiskScore" INTEGER NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "riskTier" TEXT NOT NULL,
    "finalRateBps" INTEGER NOT NULL,

    CONSTRAINT "RiskHistoryLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingDecisionLog" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "baseRateBps" INTEGER NOT NULL,
    "marginBps" INTEGER NOT NULL,
    "finalRateBps" INTEGER NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "riskTier" TEXT NOT NULL,
    "fraudScore" INTEGER NOT NULL,
    "sarSeverity" INTEGER NOT NULL,
    "volatilityIndex" INTEGER NOT NULL,
    "behaviorScore" INTEGER NOT NULL,
    "bankRiskScore" INTEGER NOT NULL,

    CONSTRAINT "PricingDecisionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnerDocument" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OwnerDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OCRExtraction" (
    "id" TEXT NOT NULL,
    "docId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OCRExtraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentFraudResult" (
    "id" TEXT NOT NULL,
    "docId" TEXT NOT NULL,
    "fraudScore" INTEGER NOT NULL,
    "issues" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentFraudResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialHealthSnapshot" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "liquidityScore" INTEGER NOT NULL,
    "incomeStability" INTEGER NOT NULL,
    "debtLoadScore" INTEGER NOT NULL,
    "cashFlowScore" INTEGER NOT NULL,
    "overdraftRisk" INTEGER NOT NULL,
    "financialHealthScore" INTEGER NOT NULL,

    CONSTRAINT "FinancialHealthSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncomeVerificationSnapshot" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sourceType" TEXT NOT NULL,
    "grossMonthlyIncome" INTEGER NOT NULL,
    "netMonthlyIncome" INTEGER NOT NULL,
    "incomeStability" INTEGER NOT NULL,
    "employerMatch" INTEGER NOT NULL,
    "bankMatch" INTEGER NOT NULL,
    "incomeVerificationScore" INTEGER NOT NULL,

    CONSTRAINT "IncomeVerificationSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimelineEvent" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "borrowerId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimelineEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Owner_email_key" ON "Owner"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_key_key" ON "Permission"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_email_key" ON "Lead"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Investor_email_key" ON "Investor"("email");

-- CreateIndex
CREATE INDEX "RiskHistoryLog_ownerId_idx" ON "RiskHistoryLog"("ownerId");

-- CreateIndex
CREATE INDEX "PricingDecisionLog_ownerId_idx" ON "PricingDecisionLog"("ownerId");

-- CreateIndex
CREATE INDEX "OwnerDocument_ownerId_idx" ON "OwnerDocument"("ownerId");

-- CreateIndex
CREATE INDEX "FinancialHealthSnapshot_ownerId_idx" ON "FinancialHealthSnapshot"("ownerId");

-- CreateIndex
CREATE INDEX "IncomeVerificationSnapshot_ownerId_idx" ON "IncomeVerificationSnapshot"("ownerId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankProfile" ADD CONSTRAINT "BankProfile_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signer" ADD CONSTRAINT "Signer_bankProfileId_fkey" FOREIGN KEY ("bankProfileId") REFERENCES "BankProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Check" ADD CONSTRAINT "Check_bankProfileId_fkey" FOREIGN KEY ("bankProfileId") REFERENCES "BankProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Check" ADD CONSTRAINT "Check_signerId_fkey" FOREIGN KEY ("signerId") REFERENCES "Signer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FraudFlag" ADD CONSTRAINT "FraudFlag_checkId_fkey" FOREIGN KEY ("checkId") REFERENCES "Check"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuspiciousActivityReport" ADD CONSTRAINT "SuspiciousActivityReport_checkId_fkey" FOREIGN KEY ("checkId") REFERENCES "Check"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuspiciousActivityReport" ADD CONSTRAINT "SuspiciousActivityReport_flagId_fkey" FOREIGN KEY ("flagId") REFERENCES "FraudFlag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BehaviorSession" ADD CONSTRAINT "BehaviorSession_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "Investor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BehaviorSession" ADD CONSTRAINT "BehaviorSession_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BehaviorSession" ADD CONSTRAINT "BehaviorSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BehaviorProfile" ADD CONSTRAINT "BehaviorProfile_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "Investor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BehaviorProfile" ADD CONSTRAINT "BehaviorProfile_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BehaviorProfile" ADD CONSTRAINT "BehaviorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OCRExtraction" ADD CONSTRAINT "OCRExtraction_docId_fkey" FOREIGN KEY ("docId") REFERENCES "OwnerDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentFraudResult" ADD CONSTRAINT "DocumentFraudResult_docId_fkey" FOREIGN KEY ("docId") REFERENCES "OwnerDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
