/*
  Warnings:

  - Added the required column `email` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `full_name` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "full_name" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL;
