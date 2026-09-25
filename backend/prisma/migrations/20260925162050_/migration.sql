-- CreateTable
CREATE TABLE "LLPAGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "LLPAGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LLPAAdjustment" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "bps" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "minFico" INTEGER,
    "maxFico" INTEGER,
    "minLtv" DOUBLE PRECISION,
    "maxLtv" DOUBLE PRECISION,
    "occupancy" TEXT,
    "propertyType" TEXT,
    "purpose" TEXT,
    "loanType" TEXT,
    "termMonths" INTEGER,
    "state" TEXT,
    "firstTimeHomebuyer" BOOLEAN,
    "minImpulsivenessScore" INTEGER,
    "maxImpulsivenessScore" INTEGER,
    "requiresBluetoothPresence" BOOLEAN,

    CONSTRAINT "LLPAAdjustment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LlpaGridRow" (
    "id" SERIAL NOT NULL,
    "agency" TEXT NOT NULL,
    "productType" TEXT NOT NULL,
    "occupancy" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "ficoBucket" INTEGER NOT NULL,
    "ltvBucket" INTEGER NOT NULL,
    "adjustment" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "LlpaGridRow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestorPricingSheet" (
    "id" SERIAL NOT NULL,
    "investorId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "effectiveAt" TIMESTAMP(3) NOT NULL,
    "baseSpread" DOUBLE PRECISION NOT NULL,
    "llpaFactor" DOUBLE PRECISION NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "InvestorPricingSheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LlpaGrid" (
    "id" SERIAL NOT NULL,
    "investor" TEXT NOT NULL,
    "productType" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "occupancy" TEXT NOT NULL,
    "ficoMin" INTEGER NOT NULL,
    "ficoMax" INTEGER NOT NULL,
    "ltvMin" DOUBLE PRECISION NOT NULL,
    "ltvMax" DOUBLE PRECISION NOT NULL,
    "termMonths" INTEGER NOT NULL,
    "llpaBps" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LlpaGrid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnderwritingAssetSnapshot" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "mortgageAssetId" INTEGER,
    "assetQualityScore" INTEGER NOT NULL,
    "cashflowScore" INTEGER NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "diversificationImpact" INTEGER NOT NULL,
    "valuationJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UnderwritingAssetSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnderwritingDecision" (
    "id" SERIAL NOT NULL,
    "loanId" INTEGER NOT NULL,
    "decision" TEXT NOT NULL,
    "reasonCodesJson" JSONB NOT NULL,
    "pricingScenarioId" INTEGER,
    "riskSnapshotId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UnderwritingDecision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskSnapshot" (
    "id" SERIAL NOT NULL,
    "loanId" INTEGER NOT NULL,
    "ltv" DOUBLE PRECISION NOT NULL,
    "dscr" DOUBLE PRECISION NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "delinquencyJson" JSONB NOT NULL,
    "marketJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiskSnapshot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LLPAAdjustment" ADD CONSTRAINT "LLPAAdjustment_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "LLPAGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
