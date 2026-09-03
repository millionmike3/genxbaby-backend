-- CreateTable
CREATE TABLE "BluetoothEvent" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT,
    "name" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "signalStrength" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BluetoothEvent_pkey" PRIMARY KEY ("id")
);
