-- CreateTable
CREATE TABLE "AnchorBatch" (
    "id" TEXT NOT NULL,
    "merkleRoot" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "anchoredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnchorBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnchorRecord" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "merkleRoot" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "anchoredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "batchId" TEXT,
    "riskScore" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnchorRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AnchorRecord" ADD CONSTRAINT "AnchorRecord_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "AnchorBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;
