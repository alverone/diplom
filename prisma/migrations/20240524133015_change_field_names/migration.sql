-- AlterTable
ALTER TABLE "orders" RENAME COLUMN "createdAt" TO "created_at";

-- AlterTable
ALTER TABLE "orders" RENAME COLUMN "updatedAt" TO "updated_at";

-- AlterTable
ALTER TABLE IF EXISTS "User" RENAME COLUMN "createdAt" TO "created_at";

-- AlterTable
ALTER TABLE IF EXISTS "User" RENAME COLUMN "emailVerified" TO "email_verified";

-- AlterTable
ALTER TABLE IF EXISTS "User" RENAME COLUMN "orderIds" TO "order_ids";

-- AlterTable
ALTER TABLE IF EXISTS "User" RENAME COLUMN "updatedAt" TO "updated_at";

-- AlterTable
ALTER TABLE IF EXISTS "User" RENAME COLUMN "wishesIds" TO "wishes_ids";
