-- CreateEnum
CREATE TYPE "ParcelStatus" AS ENUM ('created', 'ready', 'shipped', 'delivered', 'cancelled', 'returned');

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "method" "PaymentMethod",
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'RUB',
    "externalId" TEXT,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parcels" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" "ParcelStatus" NOT NULL DEFAULT 'created',
    "trackingNumber" TEXT,
    "carrier" TEXT,
    "shippedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parcels_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcels" ADD CONSTRAINT "parcels_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
