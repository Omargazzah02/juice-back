/*
  Warnings:

  - You are about to drop the column `total_amount` on the `order` table. All the data in the column will be lost.
  - Added the required column `totalAmount` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `total_amount`,
    ADD COLUMN `totalAmount` DOUBLE NOT NULL;
